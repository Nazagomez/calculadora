import React, { useState, useEffect } from 'react';
import { getModels } from '../services/api.js';

const ModelsTable = () => {
  const [models, setModels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchModels();
  }, []);

  const fetchModels = async () => {
    try {
      setLoading(true);
      const data = await getModels();
      setModels(data.models || []);
    } catch (err) {
      setError(err.message || 'Error al cargar los modelos');
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

  if (loading) {
    return (
      <div className="models-container">
        <h3>Modelos de Cálculo</h3>
        <div className="loading">Cargando modelos...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="models-container">
        <h3>Modelos de Cálculo</h3>
        <div className="error">
          <p>Error: {error}</p>
          <button onClick={fetchModels} className="retry-btn">
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="models-container">
      <h3>Modelos de Cálculo Disponibles</h3>
      
      <div className="models-grid">
        {models.map((model, index) => (
          <div key={index} className="model-card">
            <div className="model-header">
              <h4>{model.name}</h4>
            </div>
            
            <div className="model-section">
              <h5>Parámetros:</h5>
              <div className="params-list">
                {model.params.map((param, idx) => (
                  <span key={idx} className="param-tag">{param}</span>
                ))}
              </div>
            </div>

            {model.ranges && (
              <div className="model-section">
                <h5>Rangos:</h5>
                <div className="ranges-grid">
                  {Object.entries(model.ranges).map(([param, range]) => (
                    <div key={param} className="range-item">
                      <span className="range-param">{param}:</span>
                      <span className="range-value">{range}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {model.weightsDefault && (
              <div className="model-section">
                <h5>Pesos por Defecto:</h5>
                <div className="weights-grid">
                  {Object.entries(model.weightsDefault).map(([weight, value]) => (
                    <div key={weight} className="weight-item">
                      <span className="weight-name">{weight}:</span>
                      <span className="weight-value">{value}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {model.categories && (
              <div className="model-section">
                <h5>Categorías de Riesgo:</h5>
                <div className="categories-grid">
                  {Object.entries(model.categories).map(([category, range]) => (
                    <div key={category} className="category-item">
                      <span className={`category-badge ${getCategoryColor(category)}`}>
                        {category}
                      </span>
                      <span className="category-range">{range}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {models.length === 0 && (
        <div className="no-models">
          <p>No se encontraron modelos disponibles.</p>
        </div>
      )}
    </div>
  );
};

export default ModelsTable; 