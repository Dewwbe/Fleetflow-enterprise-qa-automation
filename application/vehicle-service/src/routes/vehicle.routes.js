const express = require('express');
const vehicles = require('../data/vehicles');
const { requireAuth, requireRole } = require('../middleware/auth');

const router = express.Router();

// GET /vehicles - list, optional ?status=available
router.get('/', requireAuth, (req, res) => {
  const { status } = req.query;
  const result = status ? vehicles.filter((v) => v.status === status) : vehicles;
  res.json(result);
});

// GET /vehicles/:id
router.get('/:id', requireAuth, (req, res) => {
  const vehicle = vehicles.find((v) => v.id === req.params.id);
  if (!vehicle) return res.status(404).json({ error: 'Vehicle not found' });
  res.json(vehicle);
});

// POST /vehicles - admin only
router.post('/', requireAuth, requireRole('admin'), (req, res) => {
  const { plate, make, model, type } = req.body || {};
  if (!plate || !make || !model || !type) {
    return res.status(400).json({ error: 'plate, make, model and type are required' });
  }
  const vehicle = { id: `v-${Date.now()}`, plate, make, model, type, status: 'available' };
  vehicles.push(vehicle);
  res.status(201).json(vehicle);
});

// PATCH /vehicles/:id - admin/fleet_manager
router.patch('/:id', requireAuth, requireRole('admin', 'fleet_manager'), (req, res) => {
  const vehicle = vehicles.find((v) => v.id === req.params.id);
  if (!vehicle) return res.status(404).json({ error: 'Vehicle not found' });
  Object.assign(vehicle, req.body || {});
  res.json(vehicle);
});

// DELETE /vehicles/:id - admin only
router.delete('/:id', requireAuth, requireRole('admin'), (req, res) => {
  const idx = vehicles.findIndex((v) => v.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: 'Vehicle not found' });
  vehicles.splice(idx, 1);
  res.status(204).end();
});

// internal: used by booking-service to flip availability
router.post('/:id/set-status', (req, res) => {
  const vehicle = vehicles.find((v) => v.id === req.params.id);
  if (!vehicle) return res.status(404).json({ error: 'Vehicle not found' });
  vehicle.status = req.body.status;
  res.json(vehicle);
});

module.exports = router;
