const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const users = require('../data/users');

const router = express.Router();

// POST /auth/register
router.post('/register', (req, res) => {
  const { email, password, name, role } = req.body || {};
  if (!email || !password || !name) {
    return res.status(400).json({ error: 'email, password and name are required' });
  }
  if (users.find((u) => u.email === email)) {
    return res.status(409).json({ error: 'Email already registered' });
  }
  const user = {
    id: `u-${Date.now()}`,
    email,
    passwordHash: bcrypt.hashSync(password, 8),
    name,
    role: role && ['employee', 'fleet_manager', 'admin'].includes(role) ? role : 'employee',
  };
  users.push(user);
  return res.status(201).json({ id: user.id, email: user.email, role: user.role, name: user.name });
});

// POST /auth/login
router.post('/login', (req, res) => {
  const { email, password } = req.body || {};
  const user = users.find((u) => u.email === email);
  if (!user || !bcrypt.compareSync(password || '', user.passwordHash)) {
    return res.status(401).json({ error: 'Invalid email or password' });
  }
  const token = jwt.sign(
    { sub: user.id, email: user.email, role: user.role, name: user.name },
    process.env.JWT_SECRET || 'change-me-in-production',
    { expiresIn: '8h' }
  );
  return res.json({ token, user: { id: user.id, email: user.email, role: user.role, name: user.name } });
});

module.exports = router;
