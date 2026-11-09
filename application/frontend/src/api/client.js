import axios from 'axios';

const AUTH_BASE = import.meta.env.VITE_AUTH_SERVICE_URL || 'http://localhost:4001';
const VEHICLE_BASE = import.meta.env.VITE_VEHICLE_SERVICE_URL || 'http://localhost:4002';
const BOOKING_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:4004';

function authHeader() {
  const token = localStorage.getItem('fleetflow_token');
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export const api = {
  login: (email, password) => axios.post(`${AUTH_BASE}/auth/login`, { email, password }),
  listVehicles: (status) =>
    axios.get(`${VEHICLE_BASE}/vehicles`, { params: status ? { status } : {}, headers: authHeader() }),
  createBooking: (vehicleId, startDate, endDate) =>
    axios.post(`${BOOKING_BASE}/bookings`, { vehicleId, startDate, endDate }, { headers: authHeader() }),
  listBookings: (status) =>
    axios.get(`${BOOKING_BASE}/bookings`, { params: status ? { status } : {}, headers: authHeader() }),
  approveBooking: (id) => axios.post(`${BOOKING_BASE}/bookings/${id}/approve`, {}, { headers: authHeader() }),
  rejectBooking: (id, reason) =>
    axios.post(`${BOOKING_BASE}/bookings/${id}/reject`, { reason }, { headers: authHeader() }),
};
