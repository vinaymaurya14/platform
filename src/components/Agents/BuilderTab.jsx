import React, { useState } from 'react';
import './BuilderTab.css';

const TemplateCard = ({ title, description, tags }) => {
  return (
    <div className="template-card">
      <h3>{title}</h3>
      <p>{description}</p>
      <div className="template-tags">
        {tags.map((tag, index) => (
          <div key={index} className="tag">
            <span className="tag-dot">•</span>
            {tag}
          </div>
        ))}
      </div>
    </div>
  );
};

const BuilderTab = () => {
  const [agentName, setAgentName] = useState('');
  const [description, setDescription] = useState('');
  const [selectedModel, setSelectedModel] = useState('');
  const [selectedPurpose, setSelectedPurpose] = useState('');

  const templates = [
    {
      title: 'Customer Support Specialist',
      description: 'An agent designed to handle customer inquiries and support r...',
      tags: ['Support', 'Customer Service', 'Communication']
    },
    {
      title: 'Data Analyst',
      description: 'A specialized agent for processing, analyzing, and visualizi...',
      tags: ['Analytics', 'Data Processing', 'Visualization']
    },
    {
      title: 'Content Writer',
      description: 'Creative agent that generates engaging and SEO-optimized con...',
      tags: ['Content', 'Writing', 'SEO']
    }
  ];

  return (
    <div className="builder-container">
      <div className="builder-header">
        <div className="header-left">
          <h1>Create Single Agent</h1>
          <p className="builder-description">Design a specialized agent for specific tasks</p>
        </div>
        <div className="header-actions">
          <button className="action-button">
            Performance
          </button>
          <button className="action-button">
            Reset
          </button>
        </div>
      </div>

      <div className="template-section">
        <div className="section-header">
          <span className="section-icon">◎</span>
          <h2>Start with a Template</h2>
        </div>
        <div className="templates-grid">
          {templates.map((template, index) => (
            <TemplateCard key={index} {...template} />
          ))}
        </div>
      </div>

      <div className="configuration-section">
        <div className="section-header">
          <span className="section-icon">⚙️</span>
          <h2>Agent Configuration</h2>
        </div>
        <p className="section-description">Define the basic properties of your agent</p>
        
        <form className="config-form">
          <div className="form-group">
            <label>Agent Name</label>
            <input
              type="text"
              value={agentName}
              onChange={(e) => setAgentName(e.target.value)}
              placeholder="Enter agent name..."
            />
            <span className="input-help">Choose a descriptive name for your agent</span>
          </div>

          <div className="form-group">
            <label>Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe what your agent does..."
            />
            <span className="input-help">Explain the purpose and capabilities of your agent</span>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>AI Model</label>
              <select
                value={selectedModel}
                onChange={(e) => setSelectedModel(e.target.value)}
              >
                <option value="">Select model</option>
                <option value="gpt4">GPT-4</option>
                <option value="gpt35">GPT-3.5</option>
                <option value="claude">Claude</option>
              </select>
              <span className="input-help">Select the AI model that powers your agent</span>
            </div>

            <div className="form-group">
              <label>Purpose</label>
              <select
                value={selectedPurpose}
                onChange={(e) => setSelectedPurpose(e.target.value)}
              >
                <option value="">Select purpose</option>
                <option value="support">Customer Support</option>
                <option value="analysis">Data Analysis</option>
                <option value="content">Content Creation</option>
              </select>
              <span className="input-help">Define the primary function of your agent</span>
            </div>
          </div>

          <div className="form-actions">
            <button type="submit" className="continue-btn">Continue</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BuilderTab; 