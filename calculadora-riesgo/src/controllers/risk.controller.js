const riskService = require('../services/risk.service');

/**
 * Health check endpoint
 */
function getHealth(req, res) {
  res.json({
    status: 'ok',
    time: new Date().toISOString()
  });
}

/**
 * Get supported risk models
 */
function getModels(req, res) {
  const modelsConfig = riskService.getModelsConfig();
  res.json(modelsConfig);
}

/**
 * Calculate single risk score
 */
function calculateRisk(req, res) {
  const { method, likelihood, impact, detectability, exposure, weights } = req.body;

  if (!method || !likelihood || !impact || !detectability) {
    return res.status(400).json({
      message: 'Missing required parameters: method, likelihood, impact, detectability'
    });
  }

  let result;
  let inputs = { likelihood, impact, detectability };
  let weightsUsed = null;

  try {
    if (method === 'RPN') {
      result = riskService.calcRpn(likelihood, impact, detectability);
    } else if (method === 'WEIGHTED') {
      if (exposure === undefined) {
        return res.status(400).json({
          message: 'Exposure parameter required for WEIGHTED method'
        });
      }
      
      inputs.exposure = exposure;
      weightsUsed = weights || riskService.DEFAULT_WEIGHTS;
      result = riskService.calcWeighted(likelihood, impact, detectability, exposure, weights);
    } else {
      return res.status(400).json({
        message: 'Unsupported method. Use "RPN" or "WEIGHTED"'
      });
    }

    res.json({
      method,
      inputs,
      weightsUsed,
      score: result.score,
      category: result.category,
      explanation: result.explanation
    });
  } catch (error) {
    res.status(500).json({
      message: 'Error calculating risk score',
      error: error.message
    });
  }
}

/**
 * Calculate multiple risk scores in batch
 */
function calculateBatch(req, res) {
  const { items } = req.body;

  if (!items || !Array.isArray(items) || items.length === 0) {
    return res.status(400).json({
      message: 'Items array is required and must not be empty'
    });
  }

  const results = [];
  const errors = [];

  items.forEach((item, index) => {
    try {
      const { method, likelihood, impact, detectability, exposure, weights } = item;

      if (!method || !likelihood || !impact || !detectability) {
        errors.push({
          index,
          error: 'Missing required parameters: method, likelihood, impact, detectability'
        });
        return;
      }

      let result;
      if (method === 'RPN') {
        result = riskService.calcRpn(likelihood, impact, detectability);
      } else if (method === 'WEIGHTED') {
        if (exposure === undefined) {
          errors.push({
            index,
            error: 'Exposure parameter required for WEIGHTED method'
          });
          return;
        }
        result = riskService.calcWeighted(likelihood, impact, detectability, exposure, weights);
      } else {
        errors.push({
          index,
          error: 'Unsupported method. Use "RPN" or "WEIGHTED"'
        });
        return;
      }

      results.push({
        method,
        score: result.score,
        category: result.category
      });
    } catch (error) {
      errors.push({
        index,
        error: error.message
      });
    }
  });

  if (errors.length > 0) {
    return res.status(400).json({
      message: 'Some items failed to process',
      errors,
      results: results.length > 0 ? results : undefined
    });
  }

  res.json({ results });
}

module.exports = {
  getHealth,
  getModels,
  calculateRisk,
  calculateBatch
}; 