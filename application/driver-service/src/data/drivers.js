// In-memory driver store. Replace with a MongoDB model when ready.
const drivers = [
  { id: 'd-001', name: 'Kasun Perera', licenceNo: 'B1234567', licenceExpiry: '2027-05-01', available: true },
  { id: 'd-002', name: 'Nimal Silva', licenceNo: 'B7654321', licenceExpiry: '2025-01-01', available: true }, // expired licence, for negative tests
  { id: 'd-003', name: 'Saman Jayasuriya', licenceNo: 'B1122334', licenceExpiry: '2026-12-31', available: false },
];

module.exports = drivers;
