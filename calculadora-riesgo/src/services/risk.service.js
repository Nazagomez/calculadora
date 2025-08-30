/**
 * Risk calculation service
 * Implements RPN and WEIGHTED risk assessment methods
 */

// Default weights for WEIGHTED method
const DEFAULT_WEIGHTS = {
  wL: 0.4, // likelihood weight
  wI: 0.3, // impact weight
  wD: 0.2, // detectability weight
  wE: 0.1  // exposure weight
};

/**
 * Calculate RPN (Risk Priority Number)
 * @param {number} likelihood - 1-5 scale
 * @param {number} impact - 1-5 scale
 * @param {number} detectability - 1-5 scale
 * @returns {object} - score and category
 */
function calcRpn(likelihood, impact, detectability) {
  const score = likelihood * impact * detectability;
  
  let category;
  if (score <= 20) {
    category = 'LOW';
  } else if (score <= 60) {
    category = 'MEDIUM';
  } else {
    category = 'HIGH';
  }
  
  return {
    score,
    category,
    explanation: 'RPN = likelihood × impact × detectability'
  };
}

/**
 * Calculate WEIGHTED risk score
 * @param {number} likelihood - 1-5 scale
 * @param {number} impact - 1-5 scale
 * @param {number} detectability - 1-5 scale
 * @param {number} exposure - 0-5 scale
 * @param {object} weights - optional custom weights
 * @returns {object} - score and category
 */
function calcWeighted(likelihood, impact, detectability, exposure, weights = {}) {
  const w = { ...DEFAULT_WEIGHTS, ...weights };
  
  // Calculate weighted average
  const weightedSum = (w.wL * likelihood) + (w.wI * impact) + (w.wD * detectability) + (w.wE * exposure);
  const totalWeight = w.wL + w.wI + w.wD + w.wE;
  const score = Math.round((weightedSum / totalWeight) * 20);
  
  let category;
  if (score < 33) {
    category = 'LOW';
  } else if (score <= 66) {
    category = 'MEDIUM';
  } else {
    category = 'HIGH';
  }
  
  return {
    score,
    category,
    explanation: 'Weighted average scaled to 0..100'
  };
}

/**
 * Get risk category based on score and method
 * @param {string} method - 'RPN' or 'WEIGHTED'
 * @param {number} score - calculated score
 * @returns {string} - category
 */
function getCategory(method, score) {
  if (method === 'RPN') {
    if (score <= 20) return 'LOW';
    if (score <= 60) return 'MEDIUM';
    return 'HIGH';
  } else if (method === 'WEIGHTED') {
    if (score < 33) return 'LOW';
    if (score <= 66) return 'MEDIUM';
    return 'HIGH';
  }
  return 'UNKNOWN';
}

/**
 * Get supported models configuration
 * @returns {object} - models configuration
 */
function getModelsConfig() {
  return {
    models: [
      {
        name: 'RPN',
        params: ['likelihood', 'impact', 'detectability'],
        ranges: {
          likelihood: '1..5',
          impact: '1..5',
          detectability: '1..5'
        },
        categories: {
          LOW: '1..20',
          MEDIUM: '21..60',
          HIGH: '61..125'
        }
      },
      {
        name: 'WEIGHTED',
        params: ['likelihood', 'impact', 'detectability', 'exposure'],
        weightsDefault: DEFAULT_WEIGHTS,
        ranges: {
          likelihood: '1..5',
          impact: '1..5',
          detectability: '1..5',
          exposure: '0..5'
        },
        categories: {
          LOW: '<33',
          MEDIUM: '33..66',
          HIGH: '>66'
        }
      }
    ]
  };
}

module.exports = {
  calcRpn,
  calcWeighted,
  getCategory,
  getModelsConfig,
  DEFAULT_WEIGHTS
}; 