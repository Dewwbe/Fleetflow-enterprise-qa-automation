const express = require('express');
const drivers = require('../data/drivers');
const { requireAuth, requireRole } = require('../middleware/auth');

const router = express.Router();

router.get('/', requireAuth, (req, res) => {
  const { available } = req.query;
  let result = drivers;
  if (available !== undefined) result = result.filter((d) => String(d.available) === available);
  res.json(result);
});

router.get('/:id', requireAuth, (req, res) => {
  const driver = drivers.find((d) => d.id === req.params.id);
  if (!driver) return res.status(404).json({ error: 'Driver not found' });
  res.json(driver);
});

router.post('/', requireAuth, requireRole('admin', 'fleet_manager'), (req, res) => {
  const { name, licenceNo, licenceExpiry } = req.body || {};
  if (!name || !licenceNo || !licenceExpiry) {
    return res.status(400).json({ error: 'name, licenceNo and licenceExpiry are required' });
  }
  const driver = { id: `d-${Date.now()}`, name, licenceNo, licenceExpiry, available: true };
  drivers.push(driver);
  res.status(201).json(driver);
});

// GET /drivers/:id/validate - licence + availability check, used by trip-service
router.get('/:id/validate', (req, res) => {
  const driver = drivers.find((d) => d.id === req.params.id);
  if (!driver) return res.status(404).json({ error: 'Driver not found' });
  const licenceValid = new Date(driver.licenceExpiry) > new Date();
  res.json({ id: driver.id, licenceValid, available: driver.available });
});

router.post('/:id/set-availability', (req, res) => {
  const driver = drivers.find((d) => d.id === req.params.id);
  if (!driver) return res.status(404).json({ error: 'Driver not found' });
  driver.available = !!req.body.available;
  res.json(driver);
});

module.exports = router;
