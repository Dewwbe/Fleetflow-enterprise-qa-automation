const express = require('express');
const axios = require('axios');
const records = require('../data/maintenance');
const { requireAuth, requireRole } = require('../middleware/auth');

const router = express.Router();
const VEHICLE_SERVICE_URL = process.env.VEHICLE_SERVICE_URL || 'http://localhost:4002';

// POST /maintenance - admin registers a maintenance schedule
router.post('/', requireAuth, requireRole('admin', 'fleet_manager'), async (req, res) => {
  const { vehicleId, scheduledDate, description } = req.body || {};
  if (!vehicleId || !scheduledDate) {
    return res.status(400).json({ error: 'vehicleId and scheduledDate are required' });
  }
  if (new Date(scheduledDate) < new Date(new Date().toDateString())) {
    return res.status(400).json({ error: 'scheduledDate cannot be in the past' });
  }

  let vehicle;
  try {
    const resp = await axios.get(`${VEHICLE_SERVICE_URL}/vehicles/${vehicleId}`, {
      headers: { Authorization: req.headers.authorization },
    });
    vehicle = resp.data;
  } catch (e) {
    return res.status(404).json({ error: 'Vehicle not found' });
  }

  const record = {
    id: `m-${Date.now()}`,
    vehicleId,
    scheduledDate,
    description: description || '',
    status: 'scheduled',
    createdAt: new Date().toISOString(),
  };
  records.push(record);

  try {
    await axios.post(`${VEHICLE_SERVICE_URL}/vehicles/${vehicleId}/set-status`, { status: 'maintenance' });
  } catch (e) {
    // ignore in isolated test runs
  }

  res.status(201).json(record);
});

router.get('/', requireAuth, (req, res) => {
  const { vehicleId, status } = req.query;
  let result = records;
  if (vehicleId) result = result.filter((r) => r.vehicleId === vehicleId);
  if (status) result = result.filter((r) => r.status === status);
  res.json(result);
});

router.get('/:id', requireAuth, (req, res) => {
  const record = records.find((r) => r.id === req.params.id);
  if (!record) return res.status(404).json({ error: 'Maintenance record not found' });
  res.json(record);
});

// POST /maintenance/:id/complete
router.post('/:id/complete', requireAuth, requireRole('admin', 'fleet_manager'), async (req, res) => {
  const record = records.find((r) => r.id === req.params.id);
  if (!record) return res.status(404).json({ error: 'Maintenance record not found' });
  record.status = 'completed';
  record.completedAt = new Date().toISOString();
  try {
    await axios.post(`${VEHICLE_SERVICE_URL}/vehicles/${record.vehicleId}/set-status`, { status: 'available' });
  } catch (e) {
    // ignore
  }
  res.json(record);
});

module.exports = router;
