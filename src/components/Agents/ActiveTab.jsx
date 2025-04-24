import React from 'react';
import './ActiveTab.css';

const AgentCard = ({ name, description, status, type, percentage }) => {
  const statusColor = status === 'Active' ? 'active' : 'paused';
  
  return (
    <div className="agent-card">
      <div className="agent-header">
        <div className="agent-title">
          <span className="agent-icon">👤</span>
          <h3>{name}</h3>
          <span className={`status-badge ${statusColor}`}>
            {status}
          </span>
        </div>
        <p className="agent-description">{description}</p>
      </div>

      <div className="agent-metrics">
        <div className="metric-badge">
          <span className="metric-value">{percentage}%</span>
          <span className="metric-label">{type}</span>
        </div>
      </div>

      <div className="agent-actions">
        <button className="action-btn" title="Share">
          <span>↗️</span>
        </button>
        <button className="action-btn" title="Edit">
          <span>✏️</span>
        </button>
        <button className="action-btn" title="Copy">
          <span>📋</span>
        </button>
        <button className="action-btn" title="Run">
          <span>▶️</span>
        </button>
        <button className="action-btn" title="Delete">
          <span>🗑️</span>
        </button>
      </div>
    </div>
  );
};

const ActiveTab = () => {
  const agents = [
    {
      name: 'Data Ingestion Agent',
      description: 'Collects and processes data from various sources.',
      status: 'Active',
      type: 'Data Processing',
      percentage: 96
    },
    {
      name: 'Fraud Detection Agent',
      description: 'Identifies and flags potentially fraudulent transactions.',
      status: 'Paused',
      type: 'Security',
      percentage: 88
    },
    {
      name: 'Inventory Optimization Agent',
      description: 'Optimizes inventory levels to reduce costs and improve availability.',
      status: 'Active',
      type: 'Supply Chain',
      percentage: 88
    },
    {
      name: 'Customer Support Agent',
      description: 'Provides automated responses to customer inquiries.',
      status: 'Active',
      type: 'Customer Service',
      percentage: 92
    },
    {
      name: 'Predictive Maintenance Agent',
      description: 'Predicts equipment failures to enable proactive maintenance.',
      status: 'Active',
      type: 'Operations',
      percentage: 78
    },
    {
      name: 'Market Analysis Agent',
      description: 'Analyzes market trends to identify new opportunities.',
      status: 'Paused',
      type: 'Analytics',
      percentage: 90
    }
  ];

  return (
    <div className="active-container">
      <div className="active-header">
        <h1>Active Agents</h1>
        <div className="header-actions">
          <div className="search-bar">
            <input
              type="text"
              placeholder="Search..."
              className="search-input"
            />
            <button className="filter-btn">
              <span>🔍</span>
            </button>
          </div>
        </div>
      </div>

      <div className="agents-grid">
        {agents.map((agent, index) => (
          <AgentCard key={index} {...agent} />
        ))}
      </div>
    </div>
  );
};

export default ActiveTab; 