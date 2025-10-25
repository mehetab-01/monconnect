import React, { useState, useEffect } from "react";
import VantaBackground from "../components/VantaBackground";
import "./ServiceAuth.css";
import { getProvider, hasNFT, mintNFTAndWait, SERVICE_PROVIDER_NFT_ADDRESS } from '../utils/nft';
import { useNavigate } from 'react-router-dom';

// Monad Testnet Configuration
const MONAD_TESTNET = {
  chainId: "0x279F", // 10143 in hex
  chainName: "Monad Testnet",
  nativeCurrency: {
    name: "MON",
    symbol: "MON",
    decimals: 18,
  },
  rpcUrls: ["https://testnet-rpc.monad.xyz"],
  blockExplorerUrls: ["https://testnet.monadexplorer.com"],
};

const ServiceAuth: React.FC = () => {
  const [view, setView] = useState<"main" | "signin" | "signup" | "wallet" | "verified">("main");
  const [account, setAccount] = useState<string | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  
  const navigate = useNavigate();

  useEffect(() => {
    checkIfWalletIsConnected();
    
   
    if (window.ethereum) {
      window.ethereum.on("accountsChanged", handleAccountsChanged);
      window.ethereum.on("chainChanged", handleChainChanged);
    }

    return () => {
      if (window.ethereum) {
        window.ethereum.removeListener("accountsChanged", handleAccountsChanged);
        window.ethereum.removeListener("chainChanged", handleChainChanged);
      }
    };
  }, []);

  // trigger mount animation
  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 20);
    return () => clearTimeout(t);
  }, []);

 
  const checkIfWalletIsConnected = async () => {
    try {
      if (!window.ethereum) return;

      const accounts = await window.ethereum.request({ 
        method: "eth_accounts" 
      });

      if (accounts.length > 0) {
        setAccount(accounts[0]);
        // check NFT ownership and redirect directly to dashboard if present
        try {
          const provider = getProvider();
          if (provider) {
            const owns = await hasNFT(provider, accounts[0], SERVICE_PROVIDER_NFT_ADDRESS);
            if (owns) {
              console.log('[checkIfWalletIsConnected] NFT found, redirecting to dashboard...');
              navigate('/service-dashboard');
            }
          }
        } catch (err) {
          console.error('initial NFT check failed', err);
        }
      }
    } catch (error) {
      console.error("Error checking wallet connection:", error);
    }
  };


  const handleAccountsChanged = (accounts: string[]) => {
    if (accounts.length === 0) {
      setAccount(null);
      setError("Please connect to MetaMask");
    } else {
      setAccount(accounts[0]);
      // on account change, check NFT ownership and redirect directly to dashboard
      (async () => {
        try {
          const provider = getProvider();
          if (provider) {
            const owns = await hasNFT(provider, accounts[0], SERVICE_PROVIDER_NFT_ADDRESS);
            if (owns) {
              console.log('[handleAccountsChanged] NFT found, redirecting to dashboard...');
              navigate('/service-dashboard');
            }
          }
        } catch (err) {
          console.error('accountsChanged NFT check failed', err);
        }
      })();
      setError(null);
    }
  };

    const handleChainChanged = () => {
    window.location.reload();
  };

  const switchToMonadNetwork = async () => {
    try {
      await window.ethereum?.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: MONAD_TESTNET.chainId }],
      });
      return true;
    } catch (switchError: any) {
     
      if (switchError.code === 4902) {
        try {
          await window.ethereum?.request({
            method: "wallet_addEthereumChain",
            params: [MONAD_TESTNET],
          });
          return true;
        } catch (addError) {
          console.error("Error adding Monad network:", addError);
          setError("Failed to add Monad Testnet to MetaMask");
          return false;
        }
      } else {
        console.error("Error switching network:", switchError);
        setError("Failed to switch to Monad Testnet");
        return false;
      }
    }
  };

  const connectWallet = async (isSignIn: boolean = false) => {
    setIsConnecting(true);
    setError(null);

    try {
      
      if (!window.ethereum) {
        setError("MetaMask is not installed. Please install it from metamask.io");
        setIsConnecting(false);
        return;
      }

      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });

      if (accounts.length > 0) {
        setAccount(accounts[0]);

        const switched = await switchToMonadNetwork();

        if (switched) {
          console.log("Connected to wallet:", accounts[0]);
          // check if user already has NFT
          try {
            const provider = getProvider();
            if (provider) {
              const owns = await hasNFT(provider, accounts[0], SERVICE_PROVIDER_NFT_ADDRESS);
              if (owns) {
                // User has NFT, redirect directly to dashboard (skip verification page)
                console.log('[connectWallet] NFT found, redirecting directly to dashboard...');
                navigate('/service-dashboard');
                return;
              } else if (isSignIn) {
                // Sign In flow: no NFT found, ask to register first
                setError("No NFT found. Please Sign Up first to register and mint your NFT.");
              }
            }
          } catch (err) {
            console.error('post-connect NFT check failed', err);
          }
        }
      }
    } catch (error: any) {
      console.error("Error connecting wallet:", error);
      
      if (error.code === 4001) {
        setError("Connection rejected. Please try again.");
      } else {
        setError("Failed to connect wallet. Please try again.");
      }
    } finally {
      setIsConnecting(false);
    }
  };

  
  const disconnectWallet = () => {
    setAccount(null);
    setError(null);
  };

  
  const formatAddress = (address: string) => {
    return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
  };

  const handleMint = async () => {
    console.log('🟢 [handleMint ServiceAuth] Function called!');
    console.log('🟢 [handleMint] Starting mint process...');
    
    // Ensure we reset state at the start
    setIsConnecting(true);
    setError(null);
    
    try {
      console.log('🟢 [handleMint] Checking window.ethereum...');
      if (!window.ethereum) {
        throw new Error('MetaMask not installed. Please install MetaMask to continue.');
      }
      console.log('🟢 [handleMint] window.ethereum exists');
      
      console.log('🟢 [handleMint] Checking account...');
      if (!account) {
        throw new Error('No wallet connected. Please connect your wallet first.');
      }
      console.log('🟢 [handleMint] Account exists:', account);

      console.log('[handleMint] Getting provider...');
      const provider = getProvider();
      if (!provider) {
        throw new Error('Failed to get provider. Please refresh and try again.');
      }
      console.log('🟢 [handleMint] Provider obtained');

      console.log('[handleMint] Getting signer...');
      const signer = await provider.getSigner();
      const signerAddress = await signer.getAddress();
      console.log('[handleMint] Signer address:', signerAddress);

      // Check current network
      const network = await provider.getNetwork();
      console.log('[handleMint] Current network chainId:', network.chainId.toString());

      console.log('[handleMint] Calling mintNFTAndWait...');
      const receipt = await mintNFTAndWait(signer, SERVICE_PROVIDER_NFT_ADDRESS);
      
      if (receipt?.alreadyMinted) {
        console.log('[handleMint] User already has NFT, redirecting...');
        navigate('/service-dashboard');
        return;
      }

      console.log('[handleMint] Mint successful! Receipt:', receipt);

      // Quick check then poll for ownership
      console.log('[handleMint] Checking NFT ownership...');
      let owns = await hasNFT(provider, account, SERVICE_PROVIDER_NFT_ADDRESS);
      
      if (!owns) {
        // Poll for up to 30 seconds
        const start = Date.now();
        const timeout = 30000;
        while (Date.now() - start < timeout && !owns) {
          await new Promise((r) => setTimeout(r, 2000));
          owns = await hasNFT(provider, account, SERVICE_PROVIDER_NFT_ADDRESS);
          if (owns) break;
        }
      }

      if (owns) {
        console.log('[handleMint] NFT confirmed in wallet! Showing verification page...');
        setView('verified');
      } else {
        console.warn('[handleMint] NFT not detected yet, but mint succeeded');
        setError('Mint transaction confirmed! If you don\'t see your NFT, please refresh the page in a moment.');
        // Show verification page anyway after a delay
        setTimeout(() => setView('verified'), 3000);
      }
    } catch (err: any) {
      console.error('🔴 [handleMint] Error:', err);
      console.error('🔴 [handleMint] Error stack:', err?.stack);
      setError(err?.message || 'Mint failed. Please try again.');
    } finally {
      console.log('🟢 [handleMint] Finally block - setting isConnecting to false');
      setIsConnecting(false);
    }
  };  return (
    <div className="app">
      <VantaBackground />
      <div className="logo">MonConnect</div>

      <div className={`auth-container ${mounted ? 'page-enter' : ''}`}>
        {view === "main" && (
          <>
            <h2>Service Provider Portal</h2>
            <div className="button-container">
              <button className="btn btn-primary" onClick={() => setView("signin")}>
                Sign In
              </button>
              <button className="btn btn-secondary" onClick={() => setView("signup")}>
                Sign Up
              </button>
            </div>
          </>
        )}

        {view === "signin" && (
          <div className="signin-section">
            <h2>Sign In</h2>
            
            {!account ? (
              <>
                <button 
                  className="btn btn-primary" 
                  onClick={() => connectWallet(true)}
                  disabled={isConnecting}
                >
                  {isConnecting ? "Connecting..." : "Connect Wallet"}
                </button>
                
                {error && <p className="error-message">{error}</p>}
                
                {!window.ethereum && (
                  <p className="info-message">
                    Don't have MetaMask? 
                    <a 
                      href="https://metamask.io/download/" 
                      target="_blank" 
                      rel="noopener noreferrer"
                    >
                      Install it here
                    </a>
                  </p>
                )}
              </>
            ) : (
              <div className="wallet-connected">
                <p className="success-message"> Wallet Connected</p>
                <p className="wallet-address">{formatAddress(account)}</p>
                <button 
                  className="btn btn-secondary" 
                  onClick={disconnectWallet}
                >
                  Disconnect
                </button>
              </div>
            )}
            
            <button 
              className="btn btn-text" 
              onClick={() => setView("main")}
            >
              ← Back
            </button>
          </div>
        )}

        {view === "signup" && (
          <div className="signup-section">
            <h2>Sign Up</h2>
            <form
              className="signup-form"
              onSubmit={(e) => {
                e.preventDefault();
                setView("wallet");
              }}
            >
              <input type="text" placeholder="Full Name of Owner" required />
              <select required>
                <option value="">Select Business Name</option>
                <option value="Catering">Catering</option>
                <option value="Merchandise">Merchandise</option>
                <option value="Photography">Photography</option>
                <option value="Co-working Space">Co-Working Space</option>
               <option value="Marketing">Marketing</option>
                <option value="Printing and Signage">Printing and Signage</option>
              </select>
              <input type="email" placeholder="Email" required />
              <input type="tel" placeholder="Phone Number" required />
              <input type="text" placeholder="Address" required />
              <input type="text" placeholder="GST Number" required />
              <button type="submit" className="btn btn-primary">
                Register
              </button>
            </form>
            
            <button 
              className="btn btn-text" 
              onClick={() => setView("main")}
            >
              ← Back
            </button>
          </div>
        )}

        {view === "wallet" && (
          <div className="wallet-section">
            <h2>Complete Registration</h2>
            
            {!account ? (
              <>
                <button 
                  className="btn btn-primary" 
                  onClick={() => connectWallet(false)}
                  disabled={isConnecting}
                >
                  {isConnecting ? "Connecting..." : "Connect Wallet"}
                </button>
                
                {error && <p className="error-message">{error}</p>}
              </>
                ) : (
              <div className="wallet-connected">
                <p className="success-message">Wallet Connected</p>
                <p className="wallet-address">{formatAddress(account)}</p>
                <button
                  className="btn btn-primary"
                  onClick={() => {
                    console.log('🔵 Mint NFT button clicked! (ServiceAuth)');
                    console.log('🔵 isConnecting:', isConnecting);
                    console.log('🔵 account:', account);
                    handleMint();
                  }}
                  disabled={isConnecting}
                >
                  {isConnecting ? 'Processing...' : 'Mint NFT'}
                </button>
                <button 
                  className="btn btn-secondary" 
                  onClick={disconnectWallet}
                >
                  Disconnect
                </button>
              </div>
            )}
            
            <button 
              className="btn btn-text" 
              onClick={() => setView("signup")}
            >
              ← Back
            </button>
          </div>
        )}

        {view === "verified" && (
          <div className="verified-section">
            <div className="verification-card">
              <div className="verification-icon">
                <svg width="80" height="80" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="12" cy="12" r="10" stroke="#9333ea" strokeWidth="2" fill="none"/>
                  <path d="M8 12L11 15L16 9" stroke="#9333ea" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              
              <h2 className="verification-title">You're Verified!</h2>
              
              <p className="verification-message">
                Your NFT has been successfully minted and your identity has been verified on the blockchain.
              </p>

              {account && (
                <div className="verification-details">
                  <p className="wallet-label">Connected Wallet</p>
                  <p className="wallet-address-verified">{formatAddress(account)}</p>
                </div>
              )}

              <button 
                className="btn btn-primary btn-register"
                onClick={() => navigate('/service-dashboard')}
              >
                Register on Chain
              </button>

              <p className="verification-footer">
                Click the button above to complete your registration and access your dashboard
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ServiceAuth;