import React, { useState } from 'react';
import { calculate } from '../services/api.js';

const RpnForm = ({ onResult }) => {
  const [formData, setFormData] = useState({
    likelihood: 1,
    impact: 1,
    detectability: 1
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: parseInt(value) || 1
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const payload = {
        method: 'RPN',
        ...formData
      };

      const result = await calculate(payload);
      onResult(result);
    } catch (err) {
      setError(err.message || 'Error al calcular el riesgo');
      onResult(null, err.message || 'Error al calcular el riesgo');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="form-container">
      <h3>Calculadora RPN</h3>
      <p className="form-description">
        Risk Priority Number: Multiplica likelihood × impact × detectability
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

        <button 
          type="submit" 
          disabled={loading}
          className="submit-btn"
        >
          {loading ? 'Calculando...' : 'Calcular RPN'}
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

export default RpnForm; 