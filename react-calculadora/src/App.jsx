import React, { useState } from 'react';
import RpnForm from './components/RpnForm.jsx';
import WeightedForm from './components/WeightedForm.jsx';
import ModelsTable from './components/ModelsTable.jsx';
import BatchCalculator from './components/BatchCalculator.jsx';
import ResultDisplay from './components/ResultDisplay.jsx';
import './App.css';

function App() {
  const [currentResult, setCurrentResult] = useState(null);
  const [currentError, setCurrentError] = useState('');
  const [activeTab, setActiveTab] = useState('rpn');

  const handleResult = (result, error = '') => {
    setCurrentResult(result);
    setCurrentError(error);
  };

  const tabs = [
    { id: 'rpn', label: 'RPN', component: <RpnForm onResult={handleResult} /> },
    { id: 'weighted', label: 'WEIGHTED', component: <WeightedForm onResult={handleResult} /> },
    { id: 'models', label: 'Modelos', component: <ModelsTable /> },
    { id: 'batch', label: 'Lote', component: <BatchCalculator /> }
  ];

  return (
    <div className="app">
      <header className="app-header">
        <h1>🚨 Calculadora de Riesgos</h1>
        <p>Herramienta para evaluación de riesgos usando métodos RPN y WEIGHTED</p>
      </header>

      <main className="app-main">
        <nav className="tab-navigation">
          {tabs.map(tab => (
            <button
              key={tab.id}
              className={`tab-button ${activeTab === tab.id ? 'active' : ''}`}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.label}
            </button>
          ))}
        </nav>

        <div className="content-area">
          <div className="form-section">
            {tabs.find(tab => tab.id === activeTab)?.component}
          </div>

          {(activeTab === 'rpn' || activeTab === 'weighted') && (
            <div className="result-section">
              <ResultDisplay 
                result={currentResult} 
                error={currentError}
                loading={false}
              />
            </div>
          )}
        </div>
      </main>

      <footer className="app-footer">
        <p>
          API Base: <code>{import.meta.env.VITE_API_BASE || 'http://localhost:3000/api'}</code>
        </p>
        <p>Calculadora de Riesgos - Frontend React + Vite</p>
      </footer>
    </div>
  );
}

export default App;
