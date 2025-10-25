import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import VantaBackground from '../components/VantaBackground';
import { FaSignOutAlt, FaCheckCircle } from 'react-icons/fa';

interface JuryData {
  account: string;
  role: string;
  joinedDate: string;
  status: string;
}

const JuryDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [juryData, setJuryData] = useState<JuryData | null>(null);
  const [disputes, setDisputes] = useState<any[]>([]);

  useEffect(() => {
    const data = localStorage.getItem('juryAccount');
    if (!data) {
      navigate('/jury-auth');
      return;
    }

    const jury = JSON.parse(data);
    setJuryData(jury);

    // Load disputes from localStorage
    const allDisputes = JSON.parse(localStorage.getItem('monConnectDisputes') || '[]');
    setDisputes(allDisputes);
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('juryAccount');
    navigate('/');
  };

  if (!juryData) {
    return <div>Loading...</div>;
  }

  return (
    <div className="app" style={{ minHeight: '100vh', position: 'relative' }}>
      <VantaBackground />

      <div style={{
        position: 'relative',
        zIndex: 2,
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column'
      }}>
        {/* Header */}
        <div style={{
          background: 'rgba(255, 255, 255, 0.08)',
          backdropFilter: 'blur(10px)',
          borderBottom: '1px solid rgba(255, 255, 255, 0.2)',
          padding: '20px 40px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <h1 style={{
            fontSize: '1.8rem',
            fontWeight: '700',
            color: 'white',
            margin: 0,
            background: 'linear-gradient(135deg, #ffffff 0%, #8c00ff 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text'
          }}>
            Jury Dashboard
          </h1>

          <button
            onClick={handleLogout}
            style={{
              padding: '12px 24px',
              background: 'linear-gradient(135deg, #ff6b6b 0%, #ee5a52 100%)',
              border: 'none',
              borderRadius: '8px',
              color: '#fff',
              cursor: 'pointer',
              fontSize: '1rem',
              fontWeight: '600',
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              transition: 'all 0.3s ease'
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 10px 25px rgba(255, 107, 107, 0.3)';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = 'none';
            }}
          >
            <FaSignOutAlt /> Logout
          </button>
        </div>

        {/* Main Content */}
        <div style={{
          padding: '40px',
          flex: 1
        }}>
          <div style={{
            maxWidth: '1200px',
            margin: '0 auto'
          }}>
            {/* Jury Info Card */}
            <div style={{
              background: 'rgba(108, 99, 255, 0.1)',
              border: '1px solid rgba(108, 99, 255, 0.3)',
              borderRadius: '16px',
              padding: '30px',
              marginBottom: '40px',
              backdropFilter: 'blur(10px)'
            }}>
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                gap: '30px'
              }}>
                <div>
                  <p style={{
                    color: 'rgba(255, 255, 255, 0.6)',
                    fontSize: '0.9rem',
                    marginBottom: '8px'
                  }}>
                    Jury Status
                  </p>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px'
                  }}>
                    <div style={{
                      width: '12px',
                      height: '12px',
                      borderRadius: '50%',
                      background: '#4CAF50'
                    }} />
                    <span style={{
                      color: '#fff',
                      fontSize: '1.1rem',
                      fontWeight: '600',
                      textTransform: 'capitalize'
                    }}>
                      {juryData.status}
                    </span>
                  </div>
                </div>

                <div>
                  <p style={{
                    color: 'rgba(255, 255, 255, 0.6)',
                    fontSize: '0.9rem',
                    marginBottom: '8px'
                  }}>
                    Joined Date
                  </p>
                  <p style={{
                    color: '#fff',
                    fontSize: '1.1rem',
                    fontWeight: '600',
                    margin: 0
                  }}>
                    {new Date(juryData.joinedDate).toLocaleDateString()}
                  </p>
                </div>

                <div>
                  <p style={{
                    color: 'rgba(255, 255, 255, 0.6)',
                    fontSize: '0.9rem',
                    marginBottom: '8px'
                  }}>
                    Wallet Address
                  </p>
                  <p style={{
                    color: '#6C63FF',
                    fontSize: '0.85rem',
                    fontFamily: 'monospace',
                    margin: 0,
                    wordBreak: 'break-all'
                  }}>
                    {juryData.account}
                  </p>
                </div>
              </div>
            </div>

            {/* Disputes Section */}
            <div>
              <h2 style={{
                color: '#fff',
                fontSize: '1.5rem',
                fontWeight: '600',
                marginBottom: '20px',
                display: 'flex',
                alignItems: 'center',
                gap: '10px'
              }}>
                ⚖️ Open Disputes for Review
              </h2>

              {disputes.length === 0 ? (
                <div style={{
                  background: 'rgba(255, 255, 255, 0.06)',
                  border: '2px dashed rgba(255, 255, 255, 0.2)',
                  borderRadius: '12px',
                  padding: '60px 30px',
                  textAlign: 'center'
                }}>
                  <p style={{
                    color: 'rgba(255, 255, 255, 0.6)',
                    fontSize: '1rem',
                    margin: 0
                  }}>
                    No disputes to review at this time.
                  </p>
                </div>
              ) : (
                <div style={{
                  display: 'grid',
                  gap: '20px'
                }}>
                  {disputes.map((dispute, idx) => (
                    <div
                      key={idx}
                      style={{
                        background: 'rgba(255, 255, 255, 0.08)',
                        border: '1px solid rgba(255, 165, 0, 0.3)',
                        borderRadius: '12px',
                        padding: '24px',
                        backdropFilter: 'blur(10px)',
                        transition: 'all 0.3s ease'
                      }}
                      onMouseOver={(e) => {
                        e.currentTarget.style.background = 'rgba(255, 255, 255, 0.12)';
                        e.currentTarget.style.borderColor = 'rgba(255, 165, 0, 0.5)';
                      }}
                      onMouseOut={(e) => {
                        e.currentTarget.style.background = 'rgba(255, 255, 255, 0.08)';
                        e.currentTarget.style.borderColor = 'rgba(255, 165, 0, 0.3)';
                      }}
                    >
                      <div style={{
                        display: 'grid',
                        gridTemplateColumns: '1fr 1fr',
                        gap: '20px',
                        marginBottom: '20px'
                      }}>
                        <div>
                          <p style={{
                            color: 'rgba(255, 255, 255, 0.6)',
                            fontSize: '0.85rem',
                            margin: '0 0 5px 0'
                          }}>
                            Job ID
                          </p>
                          <p style={{
                            color: '#fff',
                            fontWeight: '600',
                            fontSize: '1rem',
                            margin: 0,
                            fontFamily: 'monospace'
                          }}>
                            {dispute.jobId}
                          </p>
                        </div>

                        <div>
                          <p style={{
                            color: 'rgba(255, 255, 255, 0.6)',
                            fontSize: '0.85rem',
                            margin: '0 0 5px 0'
                          }}>
                            Raised By
                          </p>
                          <p style={{
                            color: '#FFA500',
                            fontWeight: '600',
                            fontSize: '1rem',
                            margin: 0,
                            textTransform: 'capitalize'
                          }}>
                            {dispute.raiser.replace('-', ' ')}
                          </p>
                        </div>
                      </div>

                      <div style={{
                        marginBottom: '20px',
                        paddingBottom: '20px',
                        borderBottom: '1px solid rgba(255, 255, 255, 0.1)'
                      }}>
                        <p style={{
                          color: 'rgba(255, 255, 255, 0.6)',
                          fontSize: '0.85rem',
                          margin: '0 0 8px 0'
                        }}>
                          Description
                        </p>
                        <p style={{
                          color: 'rgba(255, 255, 255, 0.9)',
                          fontSize: '0.95rem',
                          margin: 0,
                          lineHeight: '1.6'
                        }}>
                          {dispute.description}
                        </p>
                      </div>

                      <div style={{
                        display: 'grid',
                        gridTemplateColumns: '1fr 1fr',
                        gap: '20px'
                      }}>
                        <div>
                          <p style={{
                            color: 'rgba(255, 255, 255, 0.6)',
                            fontSize: '0.85rem',
                            margin: '0 0 5px 0'
                          }}>
                            Wallet Address
                          </p>
                          <p style={{
                            color: '#6C63FF',
                            fontFamily: 'monospace',
                            fontSize: '0.8rem',
                            margin: 0,
                            wordBreak: 'break-all'
                          }}>
                            {dispute.walletAddress}
                          </p>
                        </div>

                        <div>
                          <p style={{
                            color: 'rgba(255, 255, 255, 0.6)',
                            fontSize: '0.85rem',
                            margin: '0 0 5px 0'
                          }}>
                            Timestamp
                          </p>
                          <p style={{
                            color: 'rgba(255, 255, 255, 0.8)',
                            fontSize: '0.9rem',
                            margin: 0
                          }}>
                            {dispute.timestamp}
                          </p>
                        </div>
                      </div>

                      <button
                        style={{
                          marginTop: '15px',
                          width: '100%',
                          padding: '12px',
                          background: 'linear-gradient(135deg, #6C63FF 0%, #5753d1 100%)',
                          border: 'none',
                          borderRadius: '8px',
                          color: '#fff',
                          cursor: 'pointer',
                          fontSize: '0.95rem',
                          fontWeight: '600',
                          transition: 'all 0.3s ease',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '8px'
                        }}
                        onMouseOver={(e) => {
                          e.currentTarget.style.transform = 'translateY(-2px)';
                          e.currentTarget.style.boxShadow = '0 10px 25px rgba(108, 99, 255, 0.3)';
                        }}
                        onMouseOut={(e) => {
                          e.currentTarget.style.transform = 'translateY(0)';
                          e.currentTarget.style.boxShadow = 'none';
                        }}
                      >
                        <FaCheckCircle /> Review Dispute
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JuryDashboard;
