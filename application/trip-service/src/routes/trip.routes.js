const express = require('express');
const axios = require('axios');
const trips = require('../data/trips');
const { requireAuth, requireRole } = require('../middleware/auth');

const router = express.Router();

const DRIVER_SERVICE_URL = process.env.DRIVER_SERVICE_URL || 'http://localhost:4003';
const BOOKING_SERVICE_URL = process.env.BOOKING_SERVICE_URL || 'http://localhost:4004';

function driverHasOverlap(driverId, startDate, endDate, excludeTripId) {
  return trips.some(
    (t) =>
      t.id !== excludeTripId &&
      t.driverId === driverId &&
      t.status !== 'cancelled' &&
      new Date(startDate) < new Date(t.endDate) &&
      new Date(t.startDate) < new Date(endDate)
  );
}

// POST /trips - fleet manager assigns a driver to an approved booking
router.post('/', requireAuth, requireRole('fleet_manager', 'admin'), async (req, res) => {
  const { bookingId, driverId, startDate, endDate } = req.body || {};
  if (!bookingId || !driverId || !startDate || !endDate) {
    return res.status(400).json({ error: 'bookingId, driverId, startDate and endDate are required' });
  }

  try {
    const { data: validation } = await axios.get(`${DRIVER_SERVICE_URL}/drivers/${driverId}/validate`);
    if (!validation.licenceValid) {
      return res.status(422).json({ error: 'Driver licence is expired' });
    }
    if (!validation.available) {
      return res.status(409).json({ error: 'Driver is not available' });
    }
  } catch (e) {
    return res.status(502).json({ error: 'Could not validate driver via driver-service' });
  }

  if (driverHasOverlap(driverId, startDate, endDate)) {
    return res.status(409).json({ error: 'Driver already assigned to an overlapping trip' });
  }

  const trip = {
    id: `t-${Date.now()}`,
    bookingId,
    driverId,
    startDate,
    endDate,
    status: 'scheduled',
    createdAt: new Date().toISOString(),
  };
  trips.push(trip);

  try {
    await axios.post(`${DRIVER_SERVICE_URL}/drivers/${driverId}/set-availability`, { available: false });
    await axios.post(`${BOOKING_SERVICE_URL}/bookings/${bookingId}/assign-driver`, { driverId });
  } catch (e) {
    // downstream services may be unavailable in isolated runs; trip record still stands
  }

  res.status(201).json(trip);
});

router.get('/', requireAuth, (req, res) => {
  const { status } = req.query;
  res.json(status ? trips.filter((t) => t.status === status) : trips);
});

router.get('/:id', requireAuth, (req, res) => {
  const trip = trips.find((t) => t.id === req.params.id);
  if (!trip) return res.status(404).json({ error: 'Trip not found' });
  res.json(trip);
});

// POST /trips/:id/cancel
router.post('/:id/cancel', requireAuth, requireRole('fleet_manager', 'admin'), async (req, res) => {
  const trip = trips.find((t) => t.id === req.params.id);
  if (!trip) return res.status(404).json({ error: 'Trip not found' });
  trip.status = 'cancelled';
  try {
    await axios.post(`${DRIVER_SERVICE_URL}/drivers/${trip.driverId}/set-availability`, { available: true });
  } catch (e) {
    // ignore
  }
  res.json(trip);
});

module.exports = router;
