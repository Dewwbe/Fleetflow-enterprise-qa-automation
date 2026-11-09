require('dotenv').config({ path: require('path').resolve(__dirname, '../../../.env') });
const express = require('express');
const cors = require('cors');
const bookingRoutes = require('./routes/booking.routes');

const app = express();
app.use(cors());
app.use(express.json());

app.get('/health', (req, res) => res.json({ status: 'ok', service: 'booking-service' }));
app.use('/bookings', bookingRoutes);

const PORT = process.env.PORT || process.env.BOOKING_SERVICE_PORT || 4004;
app.listen(PORT, () => console.log(`booking-service listening on :${PORT}`));

module.exports = app;
