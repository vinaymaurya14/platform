import React from 'react';
import './DraftsTab.css';

const DraftCard = ({ name, description, status, type, progress, lastModified }) => {
  const statusColor = status === 'In Progress' ? 'in-progress' : 'not-started';
  
  return (
    <div className="draft-card">
      <div className="draft-header">
        <div className="draft-title">
          <span className="agent-icon">👤</span>
          <h3>{name}</h3>
          <span className={`status-badge ${statusColor}`}>
            {status}
          </span>
        </div>
        <p className="draft-description">{description}</p>
      </div>

      <div className="draft-progress">
        <div className="progress-label">
          <span>Progress</span>
          <span>{progress}%</span>
        </div>
        <div className="progress-bar">
          <div 
            className="progress-fill"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      <div className="draft-footer">
        <div className="draft-meta">
          <span className="time-badge">
            <span className="icon">⏰</span>
            {lastModified}
          </span>
          <span className={`type-badge ${type.toLowerCase()}`}>
            {type}
          </span>
        </div>
        <div className="draft-actions">
          <button className="action-btn" title="Share">
            <span>↗️</span>
          </button>
          <button className="action-btn" title="Edit">
            <span>✏️</span>
          </button>
          <button className="action-btn" title="Copy">
            <span>📋</span>
          </button>
          <button className="action-btn" title="Delete">
            <span>🗑️</span>
          </button>
        </div>
      </div>
    </div>
  );
};

const DraftsTab = () => {
  const drafts = [
    {
      name: 'Customer Service Enhancement',
      description: 'Improving customer service workflows with AI-driven responses.',
      status: 'In Progress',
      type: 'Customer Service',
      progress: 45,
      lastModified: '2 hours ago'
    },
    {
      name: 'Sales Pipeline Automation',
      description: 'Automating lead qualification and follow-up processes.',
      status: 'Not Started',
      type: 'Sales',
      progress: 15,
      lastModified: '1 day ago'
    },
    {
      name: 'Data Analysis & Reporting',
      description: 'Automated data analysis and reporting for business metrics.',
      status: 'In Progress',
      type: 'Analytics',
      progress: 60,
      lastModified: '30 minutes ago'
    },
    {
      name: 'Compliance Monitoring',
      description: 'Monitoring and ensuring compliance with regulations.',
      status: 'Not Started',
      type: 'Legal',
      progress: 5,
      lastModified: '3 days ago'
    }
  ];

  return (
    <div className="drafts-container">
      <div className="drafts-header">
        <h1>Agent Drafts</h1>
        <div className="header-actions">
          <div className="search-bar">
            <input
              type="text"
              placeholder="Search drafts..."
              className="search-input"
            />
            <button className="filter-btn">
              <span>🔍</span>
            </button>
          </div>
        </div>
      </div>

      <div className="drafts-grid">
        {drafts.map((draft, index) => (
          <DraftCard key={index} {...draft} />
        ))}
      </div>
    </div>
  );
};

export default DraftsTab; 