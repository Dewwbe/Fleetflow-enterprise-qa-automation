import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login.jsx';
import Bookings from './pages/Bookings.jsx';
import './App.css';

export default function App() {
  const isAuthed = !!localStorage.getItem('fleetflow_token');
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/bookings" element={isAuthed ? <Bookings /> : <Navigate to="/" replace />} />
    </Routes>
  );
}
