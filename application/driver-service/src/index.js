require('dotenv').config({ path: require('path').resolve(__dirname, '../../../.env') });
const express = require('express');
const cors = require('cors');
const driverRoutes = require('./routes/driver.routes');

const app = express();
app.use(cors());
app.use(express.json());

app.get('/health', (req, res) => res.json({ status: 'ok', service: 'driver-service' }));
app.use('/drivers', driverRoutes);

const PORT = process.env.PORT || process.env.DRIVER_SERVICE_PORT || 4003;
app.listen(PORT, () => console.log(`driver-service listening on :${PORT}`));

module.exports = app;
