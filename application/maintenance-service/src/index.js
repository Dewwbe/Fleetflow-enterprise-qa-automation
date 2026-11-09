require('dotenv').config({ path: require('path').resolve(__dirname, '../../../.env') });
const express = require('express');
const cors = require('cors');
const maintenanceRoutes = require('./routes/maintenance.routes');

const app = express();
app.use(cors());
app.use(express.json());

app.get('/health', (req, res) => res.json({ status: 'ok', service: 'maintenance-service' }));
app.use('/maintenance', maintenanceRoutes);

const PORT = process.env.PORT || process.env.MAINTENANCE_SERVICE_PORT || 4006;
app.listen(PORT, () => console.log(`maintenance-service listening on :${PORT}`));

module.exports = app;
