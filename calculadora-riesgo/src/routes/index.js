const express = require('express');
const risksRoutes = require('./risks.routes');

const router = express.Router();

// Mount risk routes
router.use('/', risksRoutes);

module.exports = router; 