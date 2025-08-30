const express = require('express');
const riskController = require('../controllers/risk.controller');

const router = express.Router();

// Health check
router.get('/health', riskController.getHealth);

// Get supported models
router.get('/risks/models', riskController.getModels);

// Calculate single risk
router.post('/risks/calculate', riskController.calculateRisk);

// Calculate batch risks
router.post('/risks/batch', riskController.calculateBatch);

module.exports = router; 