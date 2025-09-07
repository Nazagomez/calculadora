const express = require('express');
const riskController = require('../controllers/risk.controller');
const { riskCalculationMiddleware } = require('../middlewares/monitoring');

const router = express.Router();

// Health check
router.get('/health', riskController.getHealth);

// Get monitoring stats
router.get('/stats', riskController.getStats);

// Get supported models
router.get('/risks/models', riskController.getModels);

// Calculate single risk
router.post('/risks/calculate', riskCalculationMiddleware, riskController.calculateRisk);

// Calculate batch risks
router.post('/risks/batch', riskCalculationMiddleware, riskController.calculateBatch);

module.exports = router; 