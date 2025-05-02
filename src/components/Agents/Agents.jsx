import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Agents.css';
import BuilderTab from './BuilderTab';
import ActiveTab from './ActiveTab';
import DraftsTab from './DraftsTab';
import ConnectTab from './ConnectTab';

const agentDetails = {
  'supply-chain': {
    icon: '🔄',
    title: 'Supply Chain Optimization',
    description: 'Transform supply chain operations with intelligent agents that optimize inventory, logistics, and procurement processes.',
    agentCount: '12 Agents',
    businessOutcomes: [
      'Reduce inventory costs by 35% through smart forecasting',
      'Improve delivery times by 45% with route optimization',
      'Decrease procurement costs by 25% through automated sourcing',
      'Enhance supplier relationship scores by 40%',
      'Minimize stockouts by 80% with predictive analytics'
    ],
    constellations: [
      {
        icon: '📦',
        title: 'Demand Forecasting',
        description: 'AI-powered sales trends analysis and future demand prediction',
        agents: '4 Agents'
      },
      {
        icon: '📦',
        title: 'Inventory Management',
        description: 'AI-powered inventory optimization and demand forecasting',
        agents: '4 Agents'
      },
      {
        icon: '🚚',
        title: 'Logistics Optimization',
        description: 'Real-time route planning and delivery optimization',
        agents: '4 Agents'
      },
      {
        icon: '🤝',
        title: 'Supplier Management',
        description: 'Automated supplier evaluation and relationship management',
        agents: '4 Agents'
      },
      {
        icon: '🤝',
        title: 'Production Scheduling',
        description: 'Automated production scheduling',
        agents: '4 Agents'
      },
      {
        icon: '🤝',
        title: 'Risk Management',
        description: 'Automated risk assessment and mitigation',
        agents: '4 Agents'
      }
    ]
  },
  'multimodal-discovery': {
    icon: '🔍',
    title: 'Multimodal Discovery Agent Galaxy',
    description: 'Reinvent how users search, explore, and interact with knowledge, content, commerce, and services through text, image, voice, video, and multilingual inputs — powered by Tensor Search.',
    agentCount: '15 Agents',
    businessOutcomes: [
      'Increase search relevance by 85% using semantic understanding',
      'Reduce time-to-find by 65% with multimodal search options',
      'Boost conversion rates by 40% through personalized discovery',
      'Enable new revenue channels through visual and voice commerce',
      'Improve customer satisfaction with natural, intuitive interactions'
    ],
    constellations: [
      {
        icon: '🔍',
        title: 'Universal Search Constellation',
        description: 'Enable universal multimodal search across documents, media, databases, and APIs',
        agents: '5 Agents'
      },
      {
        icon: '👤',
        title: 'Personalized Discovery Constellation',
        description: 'Create hyper-personalized search and discovery experiences',
        agents: '5 Agents'
      },
      {
        icon: '🛍️',
        title: 'Commerce Discovery Constellation',
        description: 'Reinvent product discovery, shopping search, and visual commerce',
        agents: '5 Agents'
      }
    ]
  },
  'healthcare': {
    icon: '🏥',
    title: 'Healthcare & Wellness',
    description: 'Transform patient care with intelligent agent networks that enhance diagnosis, treatment, and overall wellness experiences.',
    agentCount: '15 Agents',
    businessOutcomes: [
      'Reduce patient wait times by 65% through automated triage',
      'Increase appointment attendance by 40% with smart reminders',
      'Improve treatment adherence by 35% through personalized education',
      'Provide 24/7 accessible healthcare support via voice and video',
      'Decrease administrative costs by 50% through automation'
    ],
    constellations: [
      {
        icon: '🤖',
        title: 'Virtual Healthcare Avatar',
        description: 'Empathetic virtual agent for patient interactions via voice and video',
        agents: '4 Agents'
      },
      {
        icon: '🏥',
        title: 'Patient Triage & Symptom Checking',
        description: 'Assessment and routing of patient symptoms with intelligent follow-up',
        agents: '3 Agents'
      },
      {
        icon: '📅',
        title: 'Appointment & Administrative Management',
        description: 'Streamline scheduling and administrative tasks with voice-enabled assistants',
        agents: '3 Agents'
      },
      {
        icon: '📚',
        title: 'Health Education & Wellness',
        description: 'Personalized health information and wellness support',
        agents: '3 Agents'
      },
      {
        icon: '❤️',
        title: 'Mental Health Support',
        description: 'Initial support and resources for mental health concerns',
        agents: '2 Agents'
      }
    ]
  },
  'automotive': {
    icon: '🚗',
    title: 'Automotive Agentic Systems',
    description: 'Transform the automotive industry with intelligent agent networks that enhance every aspect of the vehicle experience.',
    agentCount: '8 Agents',
    businessOutcomes: [
      'Reduce maintenance costs by 40% through predictive service',
      'Increase customer lifetime value by 35% through personalization',
      'Streamline supply chain with 60% faster parts replacement',
      'Create new revenue streams through in-car experiences'
    ],
    constellations: [
      {
        icon: '🔧',
        title: 'Component Health Monitoring',
        description: 'Real-time monitoring and predictive maintenance for all vehicle parts',
        agents: '3 Agents'
      },
      {
        icon: '🚘',
        title: 'Driver Experience',
        description: 'Personalized cabin environment, entertainment, and navigation',
        agents: '3 Agents'
      },
      {
        icon: '⛓️',
        title: 'Supply Chain Integration',
        description: 'Connect vehicle needs directly to parts suppliers and service centers',
        agents: '4 Agents'
      }
    ]
  },
  'retail': {
    icon: '🏪',
    title: 'Experiential Retail',
    description: 'Transform retail spaces into intelligent environments that understand and respond to customer needs in real-time.',
    agentCount: '5 Agents',
    businessOutcomes: [
      'Increase average transaction value by 28%',
      'Reduce stockouts by 75% through predictive inventory',
      'Boost customer return rate by 45% through personalization'
    ],
    constellations: [
      {
        icon: '👥',
        title: 'Customer Understanding',
        description: 'Create comprehensive customer profiles across touchpoints',
        agents: '2 Agents'
      },
      {
        icon: '🏬',
        title: 'Space Optimization',
        description: 'Dynamic retail space that adapts to customer flow and preferences',
        agents: '2 Agents'
      },
      {
        icon: '📦',
        title: 'Inventory Intelligence',
        description: 'Smart shelves and real-time product availability management',
        agents: '3 Agents'
      }
    ]
  },
  'risk': {
    icon: '🛡️',
    title: 'Risk Assessment Automation',
    description: 'Automate risk assessments, improve compliance, and reduce operational risks with AI-driven insights.',
    agentCount: '5 Agents',
    businessOutcomes: [
      'Reduce compliance violations by 75%',
      'Decrease audit preparation time by 65%',
      'Minimize operational risk exposure by 40%'
    ],
    constellations: [
      {
        icon: '📊',
        title: 'Continuous Risk Monitoring',
        description: 'Real-time risk assessment across operations',
        agents: '3 Agents'
      },
      {
        icon: '✅',
        title: 'Compliance Automation',
        description: 'Automate compliance checks and documentation',
        agents: '2 Agents'
      },
      {
        icon: '📋',
        title: 'Audit Preparation',
        description: 'Maintain audit-ready status with automated checks',
        agents: '2 Agents'
      }
    ]
  },
  'manufacturing': {
    icon: '🏭',
    title: 'Smart Manufacturing Suite',
    description: 'Optimize manufacturing operations with AI-powered agents that monitor, predict, and enhance production processes.',
    agentCount: '10 Agents',
    businessOutcomes: [
      'Increase production efficiency by 45%',
      'Reduce equipment downtime by 60%',
      'Improve quality control accuracy by 75%',
      'Optimize energy consumption by 30%'
    ],
    constellations: [
      {
        icon: '⚙️',
        title: 'Production Optimization',
        description: 'AI-driven production line optimization and scheduling',
        agents: '4 Agents'
      },
      {
        icon: '🔍',
        title: 'Quality Assurance',
        description: 'Automated quality control and defect detection',
        agents: '3 Agents'
      },
      {
        icon: '📈',
        title: 'Performance Analytics',
        description: 'Real-time monitoring and performance optimization',
        agents: '3 Agents'
      }
    ]
  },
  'education': {
    icon: '📚',
    title: 'Educational Technology Suite',
    description: 'Transform learning experiences with AI agents that personalize education and enhance student engagement.',
    agentCount: '12 Agents',
    businessOutcomes: [
      'Improve student engagement by 55%',
      'Increase learning outcomes by 40%',
      'Reduce administrative workload by 65%',
      'Enhance student retention rates by 35%'
    ],
    constellations: [
      {
        icon: '👩‍🏫',
        title: 'Personalized Learning',
        description: 'Adaptive learning paths and personalized content delivery',
        agents: '4 Agents'
      },
      {
        icon: '📝',
        title: 'Assessment & Feedback',
        description: 'Automated assessment and intelligent feedback systems',
        agents: '4 Agents'
      },
      {
        icon: '📊',
        title: 'Learning Analytics',
        description: 'Student progress tracking and performance analytics',
        agents: '4 Agents'
      }
    ]
  },
  'finance': {
    icon: '💰',
    title: 'Financial Services Suite',
    description: 'Enhance financial operations with AI agents that automate processes and improve decision-making.',
    agentCount: '10 Agents',
    businessOutcomes: [
      'Reduce transaction processing time by 70%',
      'Improve fraud detection by 85%',
      'Increase customer satisfaction by 45%',
      'Optimize investment returns by 25%'
    ],
    constellations: [
      {
        icon: '🏦',
        title: 'Transaction Processing',
        description: 'Automated financial transaction handling and reconciliation',
        agents: '3 Agents'
      },
      {
        icon: '🔒',
        title: 'Risk & Compliance',
        description: 'Real-time risk assessment and compliance monitoring',
        agents: '4 Agents'
      },
      {
        icon: '📊',
        title: 'Financial Analytics',
        description: 'Advanced financial analysis and reporting',
        agents: '3 Agents'
      }
    ]
  }
};

const DetailView = ({ agent, onBack }) => {
  return (
    <div className="detail-view">
      <div className="detail-header">
        <button className="back-button" onClick={onBack}>
          <span>←</span> Back
        </button>
        <div className="header-content">
          <span className="agent-icon">{agent.icon}</span>
          <div>
            <h1>{agent.title}</h1>
            <p className="agent-description">{agent.description}</p>
          </div>
        </div>
      </div>

      <div className="detail-content">
        <section className="business-outcomes">
          <h2>Business Outcomes</h2>
          <ul>
            {agent.businessOutcomes.map((outcome, index) => (
              <li key={index}>
                <span className="check-icon">✓</span>
                {outcome}
              </li>
            ))}
          </ul>
        </section>

        <section className="constellations">
          <h2>Constellations</h2>
          <div className="constellation-grid">
            {agent.constellations.map((constellation, index) => (
              <div key={index} className="constellation-card">
                <div className="constellation-icon">{constellation.icon}</div>
                <div className="constellation-content">
                  <h3>{constellation.title}</h3>
                  <p>{constellation.description}</p>
                  <span className="agent-count">{constellation.agents}</span>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>

      <div className="detail-actions">
        <button className="action-btn">Clone</button>
        <button className="action-btn">Preview</button>
        <button className="action-btn use-btn">Use Galaxy</button>
      </div>
    </div>
  );
};

const SupplyChainView = ({ onBack }) => {
  const navigate = useNavigate();
  const [showIframe, setShowIframe] = useState(false);
  const [iframeLoading, setIframeLoading] = useState(true);

  const handleStartOptimization = () => {
    // Show iframe instead of redirecting
    setShowIframe(true);
    setIframeLoading(true);
  };

  const handleCloseIframe = () => {
    setShowIframe(false);
  };

  const handleIframeLoad = () => {
    setIframeLoading(false);
  };

  return (
    <div className="supply-chain-view">
      <button className="back-button" onClick={onBack}>
        <span>←</span> Back
      </button>
      
      {showIframe ? (
        <div className="iframe-container">
          <div className="iframe-header">
            <h2>Supply Chain Optimization Portal</h2>
            <button className="close-iframe-btn" onClick={handleCloseIframe}>
              ✕ Close
            </button>
          </div>
          {iframeLoading && (
            <div className="iframe-loading">
              <div className="loading-spinner"></div>
              <p>Loading optimization portal...</p>
            </div>
          )}
          <iframe
            src="https://a8e1-183-82-119-26.ngrok-free.app"
            width="100%"
            height="300px"
            style={{ 
              border: "none", 
              marginTop: iframeLoading ? "-400px" : "0",
              opacity: iframeLoading ? 0 : 1,
              transition: "opacity 0.3s ease"
            }}
            title="Supply Chain Optimization"
            onLoad={handleIframeLoad}
          />
        </div>
      ) : (
        <>
          <h1>Transform your supply chain with AI-powered optimization</h1>

          <div className="content-grid">
            <div className="main-card">
              <h2>Supply Chain Agent</h2>
              <p className="agent-description">
                Our intelligent agent leverages cutting-edge AI to revolutionize your supply chain operations. Get started with our comprehensive optimization workflow.
              </p>

              <div className="features-grid">
                <div className="feature-item">
                  <h3>&#10004;  Data Upload</h3>
                  <p>Upload and process your supply chain data</p>
                </div>
                <div className="feature-item">
                  <h3>&#10004; Demand Forecasting</h3>
                  <p>AI-powered demand prediction and analysis</p>
                </div>
                <div className="feature-item">
                  <h3>&#10004; Inventory Management</h3>
                  <p>Optimize stock levels and reduce costs</p>
                </div>
                <div className="feature-item">
                  <h3>&#10004; Transportation Logistics</h3>
                  <p>Route optimization and delivery planning</p>
                </div>
                <div className="feature-item">
                  <h3>&#10004; Supplier Selection</h3>
                  <p>Smart supplier evaluation and selection</p>
                </div>
                <div className="feature-item">
                  <h3>&#10004; Production Scheduling</h3>
                  <p>Efficient production planning and scheduling</p>
                </div>
                <div className="feature-item">
                  <h3>&#10004; Risk Management</h3>
                  <p>Proactive risk assessment and mitigation</p>
                </div>
              </div>

              <div className="action-section">
                <button className="start-button" onClick={handleStartOptimization}>Start Optimization</button>
                <p className="helper-text">Get started with our AI-powered supply chain optimization</p>
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
        </>
      )}
    </div>
  );
};

const ConstellationsView = ({ onTabClick }) => {
  // Collect all constellations from all galaxies
  const allConstellations = Object.values(agentDetails).flatMap(galaxy => 
    galaxy.constellations.map(constellation => ({
      ...constellation,
      galaxyName: galaxy.title
    }))
  );

  return (
    <div className="constellation-grid">
      {allConstellations.map((constellation, index) => (
        <div key={index} className="constellation-card">
          <div className="constellation-icon">{constellation.icon}</div>
          <div className="constellation-content">
            <h3>{constellation.title}</h3>
            <p>{constellation.description}</p>
            <div className="constellation-footer">
              <span className="agent-count">{constellation.agents}</span>
              <span className="galaxy-name">From {constellation.galaxyName}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

const GalaxiesView = ({ onViewDetails, onUseClick, onTabClick }) => {
  return (
    <div className="templates-grid">
      {Object.entries(agentDetails).map(([id, agent]) => (
        <div key={id} className="template-card">
          <div className="template-icon">{agent.icon}</div>
          <h3>{agent.title}</h3>
          <p>{agent.description}</p>
          <div className="agent-count">{agent.agentCount}</div>
          <div className="template-actions">
            <button className="action-btn" onClick={() => onViewDetails(id)}>
              View Details
            </button>
            <button className="action-btn">Preview</button>
            <button className="action-btn use-btn" onClick={() => onUseClick(id)}>
              Use
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

const Agents = () => {
  const [selectedAgent, setSelectedAgent] = useState(null);
  const [viewingDetails, setViewingDetails] = useState(null);
  const [showSupplyChain, setShowSupplyChain] = useState(false);
  const [activeTab, setActiveTab] = useState('galaxies');
  const [mainTab, setMainTab] = useState('templates');
  const navigate = useNavigate();

  const handleViewDetails = (agentId) => {
    setViewingDetails(agentId);
  };

  const handleBack = () => {
    setViewingDetails(null);
    setShowSupplyChain(false);
  };

  const handleUseClick = (agentId) => {
    if (agentId === 'supply-chain') {
      setShowSupplyChain(true);
    }
  };

  const handleTabClick = (tab) => {
    setActiveTab(tab);
    setViewingDetails(null);
    setShowSupplyChain(false);
  };

  const handleMainTabClick = (tab) => {
    setMainTab(tab);
    setViewingDetails(null);
    setShowSupplyChain(false);
    setActiveTab('galaxies');
  };

  const renderMainContent = () => {
    if (showSupplyChain) {
      return <SupplyChainView onBack={handleBack} />;
    }

    if (viewingDetails) {
      return <DetailView agent={agentDetails[viewingDetails]} onBack={handleBack} />;
    }

    switch (mainTab) {
      case 'templates':
        if (activeTab === 'constellations') {
          return <ConstellationsView onTabClick={handleTabClick} />;
        }
        return (
          <GalaxiesView 
            onViewDetails={handleViewDetails} 
            onUseClick={handleUseClick} 
            onTabClick={handleTabClick}
          />
        );
      case 'builder':
        return <BuilderTab />;
      case 'active':
        return <ActiveTab />;
      case 'drafts':
        return <DraftsTab />;
      case 'connect':
        return <ConnectTab />;
      default:
        return null;
    }
  };

  return (
    <div className="agents-container">
      <div className="agents-header">
        <h1>Agent Studio</h1>
        <button className="create-agent-btn">+ Create Agent</button>
      </div>

      <div className="tabs">
        <button
          className={`tab ${mainTab === 'templates' ? 'active' : ''}`}
          onClick={() => handleMainTabClick('templates')}
        >
          Templates
        </button>
        <button 
          className={`tab ${mainTab === 'builder' ? 'active' : ''}`}
          onClick={() => handleMainTabClick('builder')}
        >
          Builder
        </button>
        <button 
          className={`tab ${mainTab === 'active' ? 'active' : ''}`}
          onClick={() => handleMainTabClick('active')}
        >
          Active
        </button>
        <button 
          className={`tab ${mainTab === 'drafts' ? 'active' : ''}`}
          onClick={() => handleMainTabClick('drafts')}
        >
          Drafts
        </button>
        <button 
          className={`tab ${mainTab === 'connect' ? 'active' : ''}`}
          onClick={() => handleMainTabClick('connect')}
        >
          Connect
        </button>
      </div>

      {mainTab === 'templates' && (
        <>
          <div className="search-section">
            <h2>Galaxy Templates</h2>
            <input type="text" placeholder="Search templates..." className="search-input" />
          </div>

          <div className="sub-tabs">
            <button
              className={`sub-tab ${activeTab === 'galaxies' ? 'active' : ''}`}
              onClick={() => handleTabClick('galaxies')}
            >
              Galaxies
            </button>
            <button
              className={`sub-tab ${activeTab === 'constellations' ? 'active' : ''}`}
              onClick={() => handleTabClick('constellations')}
            >
              Constellations
            </button>
            <button
              className={`sub-tab ${activeTab === 'agents' ? 'active' : ''}`}
              onClick={() => handleTabClick('agents')}
            >
              Agents
            </button>
          </div>
        </>
      )}

      {renderMainContent()}
    </div>
  );
};

export default Agents; 
