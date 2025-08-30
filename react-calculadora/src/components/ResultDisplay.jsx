import React from 'react';

const ResultDisplay = ({ result, error, loading }) => {
  if (loading) {
    return (
      <div className="result-container">
        <div className="loading">Calculando...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="result-container">
        <div className="error">
          <h3>Error</h3>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  if (!result) {
    return null;
  }

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
    <div className="result-container">
      <h3>Resultado del Cálculo</h3>
      <div className="result-card">
        <div className="result-header">
          <span className="method">{result.method}</span>
          <span className={`category ${getCategoryColor(result.category)}`}>
            {result.category}
          </span>
        </div>
        
        <div className="score-section">
          <h4>Score: <span className="score">{result.score}</span></h4>
        </div>

        {result.inputs && (
          <div className="inputs-section">
            <h4>Entradas:</h4>
            <div className="inputs-grid">
              {Object.entries(result.inputs).map(([key, value]) => (
                <div key={key} className="input-item">
                  <span className="input-label">{key}:</span>
                  <span className="input-value">{value}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {result.weightsUsed && (
          <div className="weights-section">
            <h4>Pesos Utilizados:</h4>
            <div className="weights-grid">
              {Object.entries(result.weightsUsed).map(([key, value]) => (
                <div key={key} className="weight-item">
                  <span className="weight-label">{key}:</span>
                  <span className="weight-value">{value}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {result.explanation && (
          <div className="explanation-section">
            <h4>Explicación:</h4>
            <p>{result.explanation}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ResultDisplay; 