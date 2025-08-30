const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:3000/api';

/**
 * Realiza una petición HTTP genérica
 * @param {string} endpoint - El endpoint a llamar
 * @param {Object} options - Opciones de la petición
 * @returns {Promise<Object>} - Respuesta de la API
 */
async function apiRequest(endpoint, options = {}) {
  try {
    const fullUrl = `${API_BASE}${endpoint}`;
    console.log('API Request:', { url: fullUrl, method: options.method || 'GET', API_BASE });
    
    const response = await fetch(fullUrl, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    });

    console.log('API Response:', { status: response.status, url: fullUrl });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('API Request Error:', { error, url: `${API_BASE}${endpoint}`, API_BASE });
    throw error;
  }
}

/**
 * Verifica el estado de salud de la API
 * @returns {Promise<Object>} - Estado de salud
 */
export async function getHealth() {
  return apiRequest('/health');
}

/**
 * Obtiene los modelos de cálculo disponibles
 * @returns {Promise<Object>} - Lista de modelos
 */
export async function getModels() {
  return apiRequest('/risks/models');
}

/**
 * Calcula el riesgo individual
 * @param {Object} payload - Datos para el cálculo
 * @returns {Promise<Object>} - Resultado del cálculo
 */
export async function calculate(payload) {
  return apiRequest('/risks/calculate', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

/**
 * Calcula múltiples riesgos en lote
 * @param {Array} items - Array de elementos a calcular
 * @returns {Promise<Object>} - Resultados del lote
 */
export async function calculateBatch(items) {
  return apiRequest('/risks/batch', {
    method: 'POST',
    body: JSON.stringify({ items }),
  });
} 