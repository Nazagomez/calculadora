import React, { useState } from 'react';
import { calculateBatch } from '../services/api.js';

const BatchCalculator = () => {
  const [jsonInput, setJsonInput] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const exampleData = `[
  {
    "method": "RPN",
    "likelihood": 5,
    "impact": 4,
    "detectability": 3
  },
  {
    "method": "WEIGHTED",
    "likelihood": 2,
    "impact": 5,
    "detectability": 2,
    "exposure": 1
  },
  {
    "method": "WEIGHTED",
    "likelihood": 4,
    "impact": 5,
    "detectability": 2,
    "exposure": 3,
    "weights": {
      "wL": 0.5,
      "wI": 0.2,
      "wD": 0.2,
      "wE": 0.1
    }
  }
]`;

  const handleInputChange = (e) => {
    setJsonInput(e.target.value);
    setError('');
  };

  const loadExample = () => {
    setJsonInput(exampleData);
    setError('');
  };

  const clearInput = () => {
    setJsonInput('');
    setResults([]);
    setError('');
  };

  const validateJson = (jsonString) => {
    try {
      const parsed = JSON.parse(jsonString);
      if (!Array.isArray(parsed)) {
        throw new Error('El JSON debe ser un array de objetos');
      }
      if (parsed.length === 0) {
        throw new Error('El array no puede estar vacío');
      }
      return parsed;
    } catch (err) {
      throw new Error(`JSON inválido: ${err.message}`);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const items = validateJson(jsonInput);
      const response = await calculateBatch(items);
      setResults(response.results || []);
    } catch (err) {
      setError(err.message || 'Error al procesar el lote');
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  const getCategoryColor = (category) => {
    switch (category?.toUpperCase()) {
      case 'LOW':
        return 'low-risk';
      case 'MEDIUM':
        return 'medium-risk';
      case 'HIGH':
        return 'high-risk';
      default:
        return '';
    }
  };

  return (
    <div className="batch-container">
      <h3>Calculadora en Lote</h3>
      <p className="batch-description">
        Procesa múltiples cálculos de riesgo a la vez. Ingresa un array JSON con los datos.
      </p>

      <div className="batch-controls">
        <button onClick={loadExample} className="example-btn">
          Cargar Ejemplo
        </button>
        <button onClick={clearInput} className="clear-btn">
          Limpiar
        </button>
      </div>

      <form onSubmit={handleSubmit} className="batch-form">
        <div className="form-group">
          <label htmlFor="jsonInput">Datos JSON:</label>
          <textarea
            id="jsonInput"
            value={jsonInput}
            onChange={handleInputChange}
            placeholder="Pega aquí tu array JSON..."
            rows="12"
            className="json-textarea"
            required
          />
          <small>
            Formato: Array de objetos con method, likelihood, impact, detectability, 
            y opcionalmente exposure y weights para WEIGHTED
          </small>
        </div>

        <button 
          type="submit" 
          disabled={loading || !jsonInput.trim()}
          className="submit-btn"
        >
          {loading ? 'Procesando...' : 'Procesar Lote'}
        </button>

        {error && (
          <div className="form-error">
            {error}
          </div>
        )}
      </form>

      {results.length > 0 && (
        <div className="batch-results">
          <h4>Resultados del Lote ({results.length} elementos)</h4>
          
          <div className="results-grid">
            {results.map((result, index) => (
              <div key={index} className="batch-result-card">
                <div className="result-header">
                  <span className="result-index">#{index + 1}</span>
                  <span className="method">{result.method}</span>
                  <span className={`category ${getCategoryColor(result.category)}`}>
                    {result.category}
                  </span>
                </div>
                
                <div className="result-score">
                  <strong>Score: {result.score}</strong>
                </div>

                {result.inputs && (
                  <div className="result-inputs">
                    <small>Entradas: {Object.entries(result.inputs).map(([k, v]) => `${k}:${v}`).join(', ')}</small>
                  </div>
                )}

                {result.weightsUsed && (
                  <div className="result-weights">
                    <small>Pesos: {Object.entries(result.weightsUsed).map(([k, v]) => `${k}:${v}`).join(', ')}</small>
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="batch-summary">
            <h5>Resumen:</h5>
            <div className="summary-stats">
              <div className="stat-item">
                <span className="stat-label">Total procesados:</span>
                <span className="stat-value">{results.length}</span>
              </div>
              <div className="stat-item">
                <span className="stat-label">Promedio score:</span>
                <span className="stat-value">
                  {(results.reduce((sum, r) => sum + r.score, 0) / results.length).toFixed(1)}
                </span>
              </div>
              <div className="stat-item">
                <span className="stat-label">Riesgos altos:</span>
                <span className="stat-value">
                  {results.filter(r => r.category === 'HIGH').length}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BatchCalculator; 