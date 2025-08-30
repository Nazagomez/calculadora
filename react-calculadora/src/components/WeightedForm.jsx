import React, { useState } from 'react';
import { calculate } from '../services/api.js';

const WeightedForm = ({ onResult }) => {
  const [formData, setFormData] = useState({
    likelihood: 1,
    impact: 1,
    detectability: 1,
    exposure: 0
  });
  const [weights, setWeights] = useState({
    wL: 0.4,
    wI: 0.3,
    wD: 0.2,
    wE: 0.1
  });
  const [useCustomWeights, setUseCustomWeights] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: parseInt(value) || 0
    }));
  };

  const handleWeightChange = (e) => {
    const { name, value } = e.target;
    setWeights(prev => ({
      ...prev,
      [name]: parseFloat(value) || 0
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const payload = {
        method: 'WEIGHTED',
        ...formData
      };

      if (useCustomWeights) {
        payload.weights = weights;
      }

      const result = await calculate(payload);
      onResult(result);
    } catch (err) {
      setError(err.message || 'Error al calcular el riesgo');
      onResult(null, err.message || 'Error al calcular el riesgo');
    } finally {
      setLoading(false);
    }
  };

  const resetToDefaults = () => {
    setWeights({
      wL: 0.4,
      wI: 0.3,
      wD: 0.2,
      wE: 0.1
    });
    setUseCustomWeights(false);
  };

  return (
    <div className="form-container">
      <h3>Calculadora WEIGHTED</h3>
      <p className="form-description">
        Cálculo ponderado: (L×wL + I×wI + D×wD + E×wE) escalado a 0-100
      </p>
      
      <form onSubmit={handleSubmit} className="risk-form">
        <div className="form-group">
          <label htmlFor="likelihood">
            Likelihood (Probabilidad) <span className="range">1-5</span>
          </label>
          <input
            type="number"
            id="likelihood"
            name="likelihood"
            min="1"
            max="5"
            value={formData.likelihood}
            onChange={handleInputChange}
            required
            className="form-input"
          />
          <small>1 = Muy baja, 5 = Muy alta</small>
        </div>

        <div className="form-group">
          <label htmlFor="impact">
            Impact (Impacto) <span className="range">1-5</span>
          </label>
          <input
            type="number"
            id="impact"
            name="impact"
            min="1"
            max="5"
            value={formData.impact}
            onChange={handleInputChange}
            required
            className="form-input"
          />
          <small>1 = Muy bajo, 5 = Muy alto</small>
        </div>

        <div className="form-group">
          <label htmlFor="detectability">
            Detectability (Detectabilidad) <span className="range">1-5</span>
          </label>
          <input
            type="number"
            id="detectability"
            name="detectability"
            min="1"
            max="5"
            value={formData.detectability}
            onChange={handleInputChange}
            required
            className="form-input"
          />
          <small>1 = Muy fácil, 5 = Muy difícil</small>
        </div>

        <div className="form-group">
          <label htmlFor="exposure">
            Exposure (Exposición) <span className="range">0-5</span>
          </label>
          <input
            type="number"
            id="exposure"
            name="exposure"
            min="0"
            max="5"
            value={formData.exposure}
            onChange={handleInputChange}
            required
            className="form-input"
          />
          <small>0 = Sin exposición, 5 = Exposición máxima</small>
        </div>

        <div className="weights-section">
          <div className="weights-header">
            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={useCustomWeights}
                onChange={(e) => setUseCustomWeights(e.target.checked)}
                className="checkbox-input"
              />
              Usar pesos personalizados
            </label>
            {useCustomWeights && (
              <button 
                type="button" 
                onClick={resetToDefaults}
                className="reset-btn"
              >
                Restaurar valores por defecto
              </button>
            )}
          </div>

          {useCustomWeights && (
            <div className="weights-grid">
              <div className="form-group">
                <label htmlFor="wL">Peso Likelihood (wL)</label>
                <input
                  type="number"
                  id="wL"
                  name="wL"
                  min="0"
                  max="1"
                  step="0.1"
                  value={weights.wL}
                  onChange={handleWeightChange}
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label htmlFor="wI">Peso Impact (wI)</label>
                <input
                  type="number"
                  id="wI"
                  name="wI"
                  min="0"
                  max="1"
                  step="0.1"
                  value={weights.wI}
                  onChange={handleWeightChange}
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label htmlFor="wD">Peso Detectability (wD)</label>
                <input
                  type="number"
                  id="wD"
                  name="wD"
                  min="0"
                  max="1"
                  step="0.1"
                  value={weights.wD}
                  onChange={handleWeightChange}
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label htmlFor="wE">Peso Exposure (wE)</label>
                <input
                  type="number"
                  id="wE"
                  name="wE"
                  min="0"
                  max="1"
                  step="0.1"
                  value={weights.wE}
                  onChange={handleWeightChange}
                  className="form-input"
                />
              </div>
            </div>
          )}

          {useCustomWeights && (
            <div className="weights-summary">
              <p>Suma de pesos: <strong>{Object.values(weights).reduce((sum, w) => sum + w, 0).toFixed(1)}</strong></p>
              <small>La suma debería ser 1.0 para una ponderación correcta</small>
            </div>
          )}
        </div>

        <button 
          type="submit" 
          disabled={loading}
          className="submit-btn"
        >
          {loading ? 'Calculando...' : 'Calcular WEIGHTED'}
        </button>

        {error && (
          <div className="form-error">
            {error}
          </div>
        )}
      </form>
    </div>
  );
};

export default WeightedForm; 