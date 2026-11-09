require('dotenv').config({ path: require('path').resolve(__dirname, '../../../.env') });
const express = require('express');
const cors = require('cors');
const tripRoutes = require('./routes/trip.routes');

const app = express();
app.use(cors());
app.use(express.json());

app.get('/health', (req, res) => res.json({ status: 'ok', service: 'trip-service' }));
app.use('/trips', tripRoutes);

const PORT = process.env.PORT || process.env.TRIP_SERVICE_PORT || 4005;
app.listen(PORT, () => console.log(`trip-service listening on :${PORT}`));

module.exports = app;
