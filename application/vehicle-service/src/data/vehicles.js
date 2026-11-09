// In-memory vehicle store. Replace with a MongoDB model when ready.
const vehicles = [
  { id: 'v-001', plate: 'WP-CAB-1001', make: 'Toyota', model: 'Hiace', type: 'Van', status: 'available' },
  { id: 'v-002', plate: 'WP-CAB-1002', make: 'Toyota', model: 'Corolla', type: 'Sedan', status: 'available' },
  { id: 'v-003', plate: 'WP-CAB-1003', make: 'Nissan', model: 'Caravan', type: 'Van', status: 'maintenance' },
];

module.exports = vehicles;
