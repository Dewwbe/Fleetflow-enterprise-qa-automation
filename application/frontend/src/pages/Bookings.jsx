import React, { useEffect, useState } from 'react';
import { api } from '../api/client';

export default function Bookings() {
  const [vehicles, setVehicles] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [vehicleId, setVehicleId] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [message, setMessage] = useState('');
  const user = JSON.parse(localStorage.getItem('fleetflow_user') || 'null');

  async function refresh() {
    const [v, b] = await Promise.all([api.listVehicles('available'), api.listBookings()]);
    setVehicles(v.data);
    setBookings(b.data);
  }

  useEffect(() => {
    refresh();
  }, []);

  async function handleBook(e) {
    e.preventDefault();
    setMessage('');
    try {
      await api.createBooking(vehicleId, startDate, endDate);
      setMessage('Booking requested.');
      refresh();
    } catch (err) {
      setMessage(err.response?.data?.error || 'Booking failed');
    }
  }

  async function handleApprove(id) {
    await api.approveBooking(id);
    refresh();
  }

  async function handleReject(id) {
    await api.rejectBooking(id, 'Not required');
    refresh();
  }

  return (
    <div className="page">
      <h1>Vehicle Bookings</h1>

      <form onSubmit={handleBook} data-testid="booking-form">
        <label>
          Vehicle
          <select data-testid="booking-vehicle" value={vehicleId} onChange={(e) => setVehicleId(e.target.value)}>
            <option value="">Select a vehicle</option>
            {vehicles.map((v) => (
              <option key={v.id} value={v.id}>
                {v.plate} — {v.make} {v.model}
              </option>
            ))}
          </select>
        </label>
        <label>
          Start date
          <input
            type="date"
            data-testid="booking-start"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />
        </label>
        <label>
          End date
          <input type="date" data-testid="booking-end" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
        </label>
        <button type="submit" data-testid="booking-submit">Request booking</button>
      </form>
      {message && <p data-testid="booking-message">{message}</p>}

      <h2>Bookings</h2>
      <table data-testid="bookings-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Vehicle</th>
            <th>Start</th>
            <th>End</th>
            <th>Status</th>
            {user?.role === 'fleet_manager' && <th>Actions</th>}
          </tr>
        </thead>
        <tbody>
          {bookings.map((b) => (
            <tr key={b.id} data-testid={`booking-row-${b.id}`}>
              <td>{b.id}</td>
              <td>{b.vehicleId}</td>
              <td>{b.startDate}</td>
              <td>{b.endDate}</td>
              <td>{b.status}</td>
              {user?.role === 'fleet_manager' && (
                <td>
                  {b.status === 'pending' && (
                    <>
                      <button onClick={() => handleApprove(b.id)}>Approve</button>
                      <button onClick={() => handleReject(b.id)}>Reject</button>
                    </>
                  )}
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
