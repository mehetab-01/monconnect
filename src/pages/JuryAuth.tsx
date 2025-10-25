import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import VantaBackground from '../components/VantaBackground';
import WalletButton from '../components/WalletButton';
import { FaCheckCircle, FaWallet, FaMoneyBillWave } from 'react-icons/fa';

interface JuryAuthProps {
  onConnect?: (account: string) => void;
}

const JuryAuth: React.FC<JuryAuthProps> = ({ onConnect }) => {
  const navigate = useNavigate();
  const [account, setAccount] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSignedUp, setIsSignedUp] = useState(false);

  const connectWallet = async () => {
    try {
      setLoading(true);
      setError(null);

      // Check if MetaMask is installed
      if (!window.ethereum) {
        setError('MetaMask is not installed. Please install MetaMask to continue.');
        setLoading(false);
        return;
      }

      // Request account access
      const accounts = await window.ethereum.request({
        method: 'eth_requestAccounts',
      });

      if (accounts && accounts.length > 0) {
        const userAccount = accounts[0];
        setAccount(userAccount);

        // Store jury account in localStorage
        const juryData = {
          account: userAccount,
          role: 'jury',
          joinedDate: new Date().toISOString(),
          status: 'active'
        };
        localStorage.setItem('juryAccount', JSON.stringify(juryData));

        // Mark as signed up
        setIsSignedUp(true);

        // Call the callback if provided
        if (onConnect) {
          onConnect(userAccount);
        }

        // Show success message then redirect
        setTimeout(() => {
          navigate('/jury-dashboard', { state: { account: userAccount } });
        }, 1500);
      }
    } catch (err: any) {
      console.error('Error connecting wallet:', err);
      if (err.code === -32002) {
        setError('MetaMask request already pending. Please check your MetaMask extension.');
      } else if (err.code === 4001) {
        setError('You rejected the connection request.');
      } else {
        setError('Failed to connect wallet. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDisconnect = () => {
    setAccount(null);
    setIsSignedUp(false);
    setError(null);
    localStorage.removeItem('juryAccount');
  };

  return (
    <div className="app" style={{ minHeight: '100vh', position: 'relative' }}>
      <VantaBackground />
      
      <div style={{
        position: 'relative',
        zIndex: 2,
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '40px 20px'
      }}>
        {/* Logo */}
        <div style={{
          position: 'absolute',
          top: '30px',
          left: '40px',
          fontSize: '1.8rem',
          fontWeight: '700',
          color: 'white',
          background: 'linear-gradient(135deg, #ffffff 0%, #8c00ff 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text'
        }}>
          MonConnect
        </div>

        {/* Back Button */}
        <button
          onClick={() => navigate('/')}
          style={{
            position: 'absolute',
            top: '30px',
            right: '40px',
            padding: '10px 20px',
            backgroundColor: 'rgba(255, 255, 255, 0.15)',
            border: '1px solid rgba(255, 255, 255, 0.3)',
            borderRadius: '8px',
            color: '#fff',
            cursor: 'pointer',
            fontSize: '1rem',
            transition: 'all 0.3s ease'
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.25)';
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.15)';
          }}
        >
          ← Back
        </button>

        {/* Main Content */}
        <div style={{
          maxWidth: '600px',
          width: '100%'
        }}>
          {/* Header */}
          <div style={{
            textAlign: 'center',
            marginBottom: '50px'
          }}>
            <h1 style={{
              fontSize: '3rem',
              fontWeight: '700',
              color: '#fff',
              margin: '0 0 20px 0',
              background: 'linear-gradient(135deg, #ffffff 0%, #8c00ff 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text'
            }}>
              Join as Jury
            </h1>
            <p style={{
              fontSize: '1.2rem',
              color: 'rgba(255, 255, 255, 0.8)',
              margin: 0
            }}>
              Review disputes and help maintain platform integrity
            </p>
          </div>

          {/* Info Cards */}
          <div style={{
            display: 'grid',
            gap: '20px',
            marginBottom: '40px'
          }}>
            {[
              {
                icon: '📋',
                title: 'Review Disputes',
                desc: 'Examine dispute details and evidence from both parties'
              },
              {
                icon: '✅',
                title: 'Make Decisions',
                desc: 'Vote on dispute resolutions with detailed reasoning'
              },
              {
                icon: <FaMoneyBillWave />,
                title: 'Earn Rewards',
                desc: 'Get compensated for your jury service'
              }
            ].map((card, idx) => (
              <div key={idx} style={{
                background: 'rgba(255, 255, 255, 0.08)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                borderRadius: '12px',
                padding: '20px',
                backdropFilter: 'blur(10px)',
                transition: 'all 0.3s ease',
                cursor: 'default'
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.12)';
                e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.3)';
                e.currentTarget.style.transform = 'translateY(-2px)';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.08)';
                e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.2)';
                e.currentTarget.style.transform = 'translateY(0)';
              }}>
                <div style={{
                  display: 'flex',
                  gap: '15px',
                  alignItems: 'flex-start'
                }}>
                  <div style={{
                    fontSize: '2rem',
                    color: '#6C63FF',
                    marginTop: '2px'
                  }}>
                    {card.icon}
                  </div>
                  <div>
                    <h3 style={{
                      color: '#fff',
                      fontSize: '1.1rem',
                      fontWeight: '600',
                      margin: '0 0 8px 0'
                    }}>
                      {card.title}
                    </h3>
                    <p style={{
                      color: 'rgba(255, 255, 255, 0.7)',
                      fontSize: '0.9rem',
                      margin: 0,
                      lineHeight: '1.5'
                    }}>
                      {card.desc}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Auth Card */}
          <div style={{
            background: 'rgba(255, 255, 255, 0.06)',
            border: '2px solid rgba(108, 99, 255, 0.3)',
            borderRadius: '16px',
            padding: '40px 30px',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)'
          }}>
            {!isSignedUp ? (
              <div>
                <h2 style={{
                  color: '#fff',
                  textAlign: 'center',
                  marginBottom: '30px',
                  fontSize: '1.5rem',
                  fontWeight: '600'
                }}>
                  Connect Your Wallet
                </h2>

                <p style={{
                  color: 'rgba(255, 255, 255, 0.7)',
                  textAlign: 'center',
                  marginBottom: '30px',
                  fontSize: '0.95rem',
                  lineHeight: '1.6'
                }}>
                  Sign in or create your jury account using MetaMask. Your wallet will be used to verify your identity and process jury rewards.
                </p>

                {error && (
                  <div style={{
                    background: 'rgba(244, 67, 54, 0.15)',
                    border: '1px solid rgba(244, 67, 54, 0.3)',
                    borderRadius: '10px',
                    padding: '12px 15px',
                    marginBottom: '20px',
                    color: '#ff6b6b',
                    fontSize: '0.9rem',
                    textAlign: 'center'
                  }}>
                    {error}
                  </div>
                )}

                <button
                  onClick={connectWallet}
                  disabled={loading}
                  style={{
                    width: '100%',
                    padding: '16px',
                    background: loading ? 'rgba(108, 99, 255, 0.3)' : 'linear-gradient(135deg, #6C63FF 0%, #5753d1 100%)',
                    border: 'none',
                    borderRadius: '12px',
                    color: '#fff',
                    fontSize: '1.1rem',
                    fontWeight: '600',
                    cursor: loading ? 'not-allowed' : 'pointer',
                    transition: 'all 0.3s ease',
                    boxShadow: loading ? 'none' : '0 10px 30px rgba(108, 99, 255, 0.3)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '10px',
                    opacity: loading ? 0.7 : 1
                  }}
                  onMouseOver={(e) => {
                    if (!loading) {
                      e.currentTarget.style.transform = 'translateY(-2px)';
                      e.currentTarget.style.boxShadow = '0 15px 40px rgba(108, 99, 255, 0.4)';
                    }
                  }}
                  onMouseOut={(e) => {
                    if (!loading) {
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.boxShadow = '0 10px 30px rgba(108, 99, 255, 0.3)';
                    }
                  }}
                >
                  <FaWallet style={{ fontSize: '1.2rem' }} />
                  {loading ? 'Connecting...' : 'Connect with MetaMask'}
                </button>

                <p style={{
                  color: 'rgba(255, 255, 255, 0.5)',
                  textAlign: 'center',
                  marginTop: '20px',
                  fontSize: '0.85rem'
                }}>
                  Don't have MetaMask? <a href="https://metamask.io" target="_blank" rel="noopener noreferrer" style={{
                    color: '#6C63FF',
                    textDecoration: 'none',
                    fontWeight: '600'
                  }}>Download it here</a>
                </p>
              </div>
            ) : (
              <div style={{ textAlign: 'center' }}>
                <div style={{
                  width: '60px',
                  height: '60px',
                  background: 'linear-gradient(135deg, #4CAF50 0%, #45a049 100%)',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 20px',
                  fontSize: '2rem'
                }}>
                  <FaCheckCircle style={{ color: '#fff' }} />
                </div>

                <h2 style={{
                  color: '#fff',
                  marginBottom: '10px',
                  fontSize: '1.5rem',
                  fontWeight: '600'
                }}>
                  Successfully Connected!
                </h2>

                <p style={{
                  color: 'rgba(255, 255, 255, 0.7)',
                  marginBottom: '20px',
                  fontSize: '0.95rem'
                }}>
                  Your wallet has been linked to your jury account.
                </p>

                <p style={{
                  background: 'rgba(108, 99, 255, 0.15)',
                  border: '1px solid rgba(108, 99, 255, 0.3)',
                  borderRadius: '10px',
                  padding: '12px',
                  color: '#6C63FF',
                  fontSize: '0.85rem',
                  wordBreak: 'break-all',
                  fontFamily: 'monospace',
                  marginBottom: '20px'
                }}>
                  {account}
                </p>

                <p style={{
                  color: 'rgba(255, 255, 255, 0.6)',
                  fontSize: '0.9rem',
                  marginBottom: '20px'
                }}>
                  Redirecting to jury dashboard in a moment...
                </p>

                <button
                  onClick={handleDisconnect}
                  style={{
                    padding: '10px 20px',
                    background: 'rgba(255, 255, 255, 0.1)',
                    border: '1px solid rgba(255, 255, 255, 0.3)',
                    borderRadius: '8px',
                    color: '#fff',
                    cursor: 'pointer',
                    fontSize: '0.95rem',
                    fontWeight: '600',
                    transition: 'all 0.3s ease'
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.background = 'rgba(255, 255, 255, 0.15)';
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
                  }}
                >
                  Disconnect
                </button>
              </div>
            )}
          </div>

          {/* Footer Info */}
          <div style={{
            marginTop: '40px',
            padding: '20px',
            background: 'rgba(108, 99, 255, 0.1)',
            border: '1px solid rgba(108, 99, 255, 0.2)',
            borderRadius: '12px',
            textAlign: 'center'
          }}>
            <p style={{
              color: 'rgba(255, 255, 255, 0.7)',
              fontSize: '0.9rem',
              margin: 0,
              lineHeight: '1.6'
            }}>
              <strong style={{ color: '#fff' }}>Jury Requirements:</strong> Must be an active community member with verified credentials to participate in dispute resolution.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JuryAuth;
