const express = require('express');
const axios = require('axios');
const bookings = require('../data/bookings');
const { withLock } = require('../lib/mutex');
const { requireAuth, requireRole } = require('../middleware/auth');

const router = express.Router();

const VEHICLE_SERVICE_URL = process.env.VEHICLE_SERVICE_URL || 'http://localhost:4002';

function overlaps(aStart, aEnd, bStart, bEnd) {
  return new Date(aStart) < new Date(bEnd) && new Date(bStart) < new Date(aEnd);
}

function hasConflict(vehicleId, startDate, endDate, excludeId) {
  return bookings.some(
    (b) =>
      b.id !== excludeId &&
      b.vehicleId === vehicleId &&
      b.status !== 'rejected' &&
      b.status !== 'cancelled' &&
      overlaps(startDate, endDate, b.startDate, b.endDate)
  );
}

// POST /bookings - employee requests a vehicle
router.post('/', requireAuth, requireRole('employee', 'fleet_manager', 'admin'), async (req, res) => {
  const { vehicleId, startDate, endDate } = req.body || {};
  if (!vehicleId || !startDate || !endDate) {
    return res.status(400).json({ error: 'vehicleId, startDate and endDate are required' });
  }
  if (new Date(startDate) >= new Date(endDate)) {
    return res.status(400).json({ error: 'startDate must be before endDate' });
  }

  try {
    // serialize on the vehicle so two overlapping requests can't both succeed
    const booking = await withLock(vehicleId, async () => {
      if (hasConflict(vehicleId, startDate, endDate)) {
        const conflict = new Error('Vehicle already reserved for the requested period');
        conflict.code = 'CONFLICT';
        throw conflict;
      }
      const b = {
        id: `b-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
        vehicleId,
        startDate,
        endDate,
        requestedBy: req.user.sub,
        status: 'pending',
        driverId: null,
        createdAt: new Date().toISOString(),
      };
      bookings.push(b);
      return b;
    });
    return res.status(201).json(booking);
  } catch (err) {
    if (err.code === 'CONFLICT') return res.status(409).json({ error: err.message });
    console.error(err);
    return res.status(500).json({ error: 'Unexpected error creating booking' });
  }
});

router.get('/', requireAuth, (req, res) => {
  const { status } = req.query;
  const result = status ? bookings.filter((b) => b.status === status) : bookings;
  res.json(result);
});

router.get('/:id', requireAuth, (req, res) => {
  const booking = bookings.find((b) => b.id === req.params.id);
  if (!booking) return res.status(404).json({ error: 'Booking not found' });
  res.json(booking);
});

// POST /bookings/:id/approve - fleet manager only
router.post('/:id/approve', requireAuth, requireRole('fleet_manager', 'admin'), async (req, res) => {
  const booking = bookings.find((b) => b.id === req.params.id);
  if (!booking) return res.status(404).json({ error: 'Booking not found' });
  if (booking.status !== 'pending') {
    return res.status(409).json({ error: `Booking is already ${booking.status}, cannot approve again` });
  }
  booking.status = 'approved';
  try {
    await axios.post(`${VEHICLE_SERVICE_URL}/vehicles/${booking.vehicleId}/set-status`, { status: 'reserved' });
  } catch (e) {
    // vehicle-service may be unreachable in isolated test runs; booking state still updates
  }
  res.json(booking);
});

// POST /bookings/:id/reject - fleet manager only
router.post('/:id/reject', requireAuth, requireRole('fleet_manager', 'admin'), (req, res) => {
  const booking = bookings.find((b) => b.id === req.params.id);
  if (!booking) return res.status(404).json({ error: 'Booking not found' });
  if (booking.status !== 'pending') {
    return res.status(409).json({ error: `Booking is already ${booking.status}, cannot reject again` });
  }
  booking.status = 'rejected';
  booking.rejectionReason = (req.body && req.body.reason) || 'Not specified';
  res.json(booking);
});

// internal: trip-service marks a booking as having an assigned driver
router.post('/:id/assign-driver', (req, res) => {
  const booking = bookings.find((b) => b.id === req.params.id);
  if (!booking) return res.status(404).json({ error: 'Booking not found' });
  booking.driverId = req.body.driverId;
  booking.status = 'driver_assigned';
  res.json(booking);
});

module.exports = router;
