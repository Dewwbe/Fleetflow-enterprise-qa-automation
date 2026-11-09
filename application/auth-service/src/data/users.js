// In-memory user store. Replace with a MongoDB model (users collection) when ready.
const bcrypt = require('bcryptjs');

const users = [
  // seeded accounts so the automation suites have a known login for every role
  { id: 'u-admin', email: 'admin@fleetflow.test', passwordHash: bcrypt.hashSync('Admin@123', 8), role: 'admin', name: 'Admin User' },
  { id: 'u-manager', email: 'manager@fleetflow.test', passwordHash: bcrypt.hashSync('Manager@123', 8), role: 'fleet_manager', name: 'Fleet Manager' },
  { id: 'u-employee', email: 'employee@fleetflow.test', passwordHash: bcrypt.hashSync('Employee@123', 8), role: 'employee', name: 'Employee One' },
];

module.exports = users;
