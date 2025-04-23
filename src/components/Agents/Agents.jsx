import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Agents.css';

const Agents = () => {
  const navigate = useNavigate();
  const [activeStep, setActiveStep] = useState('overview');

  const handleUseClick = () => {
    window.location.href = 'https://3c8b-183-82-119-26.ngrok-free.app';
  };

  const workflowSteps = [
    { id: 'data-upload', title: 'Data Upload', description: 'Upload and process your supply chain data' },
    { id: 'demand', title: 'Demand Forecasting', description: 'AI-powered demand prediction and analysis' },
    { id: 'inventory', title: 'Inventory Management', description: 'Optimize stock levels and reduce costs' },
    { id: 'transport', title: 'Transportation Logistics', description: 'Route optimization and delivery planning' },
    { id: 'supplier', title: 'Supplier Selection', description: 'Smart supplier evaluation and selection' },
    { id: 'production', title: 'Production Scheduling', description: 'Efficient production planning and scheduling' },
    { id: 'risk', title: 'Risk Management', description: 'Proactive risk assessment and mitigation' }
  ];

  return (
    <div className="agents-container">
      <div className="agents-header">
        <h1>Supply Chain Optimization</h1>
        <p className="subtitle">Transform your supply chain with AI-powered optimization</p>
      </div>

      <div className="content-grid">
        <div className="main-card">
          <h2>Supply Chain Agent</h2>
          <p className="agent-description">
            Our intelligent agent leverages cutting-edge AI to revolutionize your supply chain operations.
            Get started with our comprehensive optimization workflow.
          </p>
          
          <div className="features-grid">
            {workflowSteps.map((step) => (
              <div key={step.id} className="feature-card">
                <div className="feature-icon">✓</div>
                <div className="feature-content">
                  <h3>{step.title}</h3>
                  <p>{step.description}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="action-section">
            <button className="start-button" onClick={handleUseClick}>
              Start Optimization
            </button>
            <p className="helper-text">
              Begin your supply chain transformation journey with our intelligent agent
            </p>
          </div>
        </div>

        <div className="benefits-section">
          <h2>Key Benefits</h2>
          <div className="benefits-list">
            <div className="benefit-item">
              <span className="benefit-icon">📈</span>
              <div className="benefit-content">
                <h4>Increased Efficiency</h4>
                <p>Up to 30% improvement in operational efficiency</p>
              </div>
            </div>
            <div className="benefit-item">
              <span className="benefit-icon">💰</span>
              <div className="benefit-content">
                <h4>Cost Reduction</h4>
                <p>15-25% reduction in supply chain costs</p>
              </div>
            </div>
            <div className="benefit-item">
              <span className="benefit-icon">🎯</span>
              <div className="benefit-content">
                <h4>Better Accuracy</h4>
                <p>95% accuracy in demand forecasting</p>
              </div>
            </div>
            <div className="benefit-item">
              <span className="benefit-icon">⚡</span>
              <div className="benefit-content">
                <h4>Faster Decisions</h4>
                <p>Real-time insights and recommendations</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Agents; 