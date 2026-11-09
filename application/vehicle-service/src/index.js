require('dotenv').config({ path: require('path').resolve(__dirname, '../../../.env') });
const express = require('express');
const cors = require('cors');
const vehicleRoutes = require('./routes/vehicle.routes');

const app = express();
app.use(cors());
app.use(express.json());

app.get('/health', (req, res) => res.json({ status: 'ok', service: 'vehicle-service' }));
app.use('/vehicles', vehicleRoutes);

const PORT = process.env.PORT || process.env.VEHICLE_SERVICE_PORT || 4002;
app.listen(PORT, () => console.log(`vehicle-service listening on :${PORT}`));

module.exports = app;
