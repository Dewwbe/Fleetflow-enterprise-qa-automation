require('dotenv').config({ path: require('path').resolve(__dirname, '../../../.env') });
const express = require('express');
const cors = require('cors');
const authRoutes = require('./routes/auth.routes');

const app = express();
app.use(cors());
app.use(express.json());

app.get('/health', (req, res) => res.json({ status: 'ok', service: 'auth-service' }));
app.use('/auth', authRoutes);

const PORT = process.env.PORT || process.env.AUTH_SERVICE_PORT || 4001;
app.listen(PORT, () => console.log(`auth-service listening on :${PORT}`));

module.exports = app;
