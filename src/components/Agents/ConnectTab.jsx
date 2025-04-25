import React, { useState } from 'react';
import './ConnectTab.css';

const ConnectTab = () => {
  const [activeApiTab, setActiveApiTab] = useState('REST APIs');

  const apiEndpoints = {
    'REST APIs': [
      {
        name: 'User Management API',
        url: 'https://api.example.com/v1/user-management',
        status: 'Active'
      },
      {
        name: 'Data Processing API',
        url: 'https://api.example.com/v1/data-processing',
        status: 'Active'
      },
      {
        name: 'Agent Communication API',
        url: 'https://api.example.com/v1/agent-communication',
        status: 'Active'
      }
    ],
    'GraphQL': [],
    'SOAP': [],
    'WebSockets': [],
    'gRPC': [],
    'Webhooks': []
  };

  const metrics = {
    totalRequests: '24,583',
    avgResponseTime: '238ms',
    errorRate: '0.4%',
    activeEndpoints: '18'
  };

  const security = {
    authentication: 'OAuth 2.0',
    apiKeys: '12 Active',
    rateLimiting: 'Enabled',
    lastScan: 'Today'
  };

  return (
    <div className="connect-tab-container">
      <div className="connect-header">
        <div className="flex items-center gap-2">
          <span className="text-xl">🔌</span>
          <div>
            <h1 className="text-2xl font-semibold">API Management Console</h1>
            <p className="text-gray-600 mt-1">Monitor and manage all API protocols</p>
          </div>
        </div>
      </div>

      <div className="api-tabs">
        {Object.keys(apiEndpoints).map((tab) => (
          <button
            key={tab}
            className={`api-tab ${activeApiTab === tab ? 'active' : ''}`}
            onClick={() => setActiveApiTab(tab)}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="api-content">
        {activeApiTab === 'REST APIs' ? (
          <>
            <div className="endpoints-section">
              <div className="section-header">
                <h2 className="text-lg font-medium">REST API Endpoints</h2>
                <button className="add-endpoint-btn">
                  Add Endpoint
                </button>
              </div>
              
              <div className="endpoints-list">
                {apiEndpoints['REST APIs'].map((endpoint, index) => (
                  <div key={index} className="endpoint-item">
                    <div className="endpoint-info">
                      <h3 className="endpoint-name">{endpoint.name}</h3>
                      <p className="endpoint-url">{endpoint.url}</p>
                    </div>
                    <div className="endpoint-actions">
                      <span className="status-badge">
                        {endpoint.status}
                      </span>
                      <button className="manage-btn">
                        Manage
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="metrics-grid">
              <div className="metrics-card">
                <h3>API Metrics</h3>
                <p className="section-subtitle">Performance & Usage</p>
                <div className="metrics-list">
                  <div className="metric-item">
                    <span>Total Requests (24h)</span>
                    <span className="metric-value">{metrics.totalRequests}</span>
                  </div>
                  <div className="metric-item">
                    <span>Avg Response Time</span>
                    <span className="metric-value">{metrics.avgResponseTime}</span>
                  </div>
                  <div className="metric-item">
                    <span>Error Rate</span>
                    <span className="metric-value">{metrics.errorRate}</span>
                  </div>
                  <div className="metric-item">
                    <span>Active Endpoints</span>
                    <span className="metric-value">{metrics.activeEndpoints}</span>
                  </div>
                </div>
              </div>
              
              <div className="metrics-card">
                <h3>Security</h3>
                <p className="section-subtitle">Auth & Protection</p>
                <div className="metrics-list">
                  <div className="metric-item">
                    <span>Authentication</span>
                    <span className="status-badge">{security.authentication}</span>
                  </div>
                  <div className="metric-item">
                    <span>API Keys</span>
                    <span className="metric-value">{security.apiKeys}</span>
                  </div>
                  <div className="metric-item">
                    <span>Rate Limiting</span>
                    <span className="status-badge">{security.rateLimiting}</span>
                  </div>
                  <div className="metric-item">
                    <span>Last Security Scan</span>
                    <span className="metric-value">{security.lastScan}</span>
                  </div>
                </div>
              </div>
              
              <div className="metrics-card">
                <h3>Developer Portal</h3>
                <p className="section-subtitle">Documentation & Resources</p>
                <p className="portal-description">
                  Access API documentation, SDKs, and testing tools for your development team.
                </p>
                <button className="portal-btn">
                  <span>📝</span>
                  Open Developer Portal
                </button>
              </div>
            </div>

            <div className="bottom-actions">
              <button className="action-btn secondary">API Documentation</button>
              <button className="action-btn primary">Authentication Settings</button>
            </div>
          </>
        ) : (
          <div className="empty-state">
            <div className="empty-icon">
              {activeApiTab === 'GraphQL' ? '📊' : 
               activeApiTab === 'SOAP' ? '📄' :
               activeApiTab === 'WebSockets' ? '🔌' :
               activeApiTab === 'gRPC' ? '⚡' : '🔗'}
            </div>
            <h3>Add {activeApiTab}</h3>
            <p>Configure and manage your {activeApiTab} endpoints.</p>
            <button className="add-endpoint-btn">
              Add {activeApiTab.replace(/s$/, '')} Endpoint
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ConnectTab; 