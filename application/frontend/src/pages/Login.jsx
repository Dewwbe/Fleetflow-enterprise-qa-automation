import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../api/client';

export default function Login() {
  const [email, setEmail] = useState('employee@fleetflow.test');
  const [password, setPassword] = useState('Employee@123');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    try {
      const { data } = await api.login(email, password);
      localStorage.setItem('fleetflow_token', data.token);
      localStorage.setItem('fleetflow_user', JSON.stringify(data.user));
      navigate('/bookings');
    } catch (err) {
      setError(err.response?.data?.error || 'Login failed');
    }
  }

  return (
    <div className="page">
      <h1>FleetFlow</h1>
      <form onSubmit={handleSubmit} data-testid="login-form">
        <label>
          Email
          <input data-testid="login-email" value={email} onChange={(e) => setEmail(e.target.value)} />
        </label>
        <label>
          Password
          <input
            type="password"
            data-testid="login-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </label>
        <button type="submit" data-testid="login-submit">Log in</button>
        {error && <p role="alert" data-testid="login-error">{error}</p>}
      </form>
      <p className="hint">
        Seeded accounts: employee@fleetflow.test / Employee@123 · manager@fleetflow.test / Manager@123 ·
        admin@fleetflow.test / Admin@123
      </p>
    </div>
  );
}
