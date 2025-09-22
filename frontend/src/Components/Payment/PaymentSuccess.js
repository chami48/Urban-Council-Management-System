import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import axios from 'axios';
import Nav from '../Nav/Nav';

const PaymentSuccess = () => {
  const [loading, setLoading] = useState(true);
  const [paymentStatus, setPaymentStatus] = useState(null);
  const [error, setError] = useState('');
  
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const paymentType = searchParams.get('paymentType');

  useEffect(() => {
    const paymentIntentId = searchParams.get('payment_intent');
    const paymentIntentClientSecret = searchParams.get('payment_intent_client_secret');

    if (paymentIntentId) {
      verifyPayment(paymentIntentId);
    } else {
      // For testing purposes, show a demo success state
      // In production, this should show an error
      const isDevelopment = window.location.hostname === 'localhost';
      
      if (isDevelopment) {
        // Demo data for testing
        setPaymentStatus({
          status: 'succeeded',
          amount: 5000,
          currency: 'lkr'
        });
        setLoading(false);
      } else {
        setError('Payment information not found');
        setLoading(false);
      }
    }
  }, [searchParams]);

  const verifyPayment = async (paymentIntentId) => {
    try {
      const response = await axios.get(`http://localhost:5000/api/payment/payment-status/${paymentIntentId}`);
      setPaymentStatus(response.data);
      
      if (response.data.status === 'succeeded') {
        
        await axios.post('http://localhost:5000/api/payment/save-payment', {
          paymentIntentId: paymentIntentId,
          amount: response.data.amount,
          shopName: 'Sample Shop', 
          applicantName: 'John Doe', 
          nicNumber: '123456789V'
        });
      }
      
      setLoading(false);
    } catch (error) {
      console.error('Payment verification error:', error);
      setError('Failed to verify payment status');
      setLoading(false);
    }
  };

  const styles = {
    container: {
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 25%, #f1f5f9 50%, #e7f3ff 75%, #f0f9ff 100%)',
      backgroundSize: '400% 400%',
      animation: 'gradientShift 15s ease infinite',
      position: 'relative',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
    },
    backgroundOverlay: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: `
        radial-gradient(circle at 20% 50%, rgba(59, 130, 246, 0.05) 0%, transparent 50%),
        radial-gradient(circle at 80% 20%, rgba(168, 85, 247, 0.05) 0%, transparent 50%),
        radial-gradient(circle at 40% 80%, rgba(14, 165, 233, 0.05) 0%, transparent 50%)
      `,
      pointerEvents: 'none'
    },
    pageContent: {
      position: 'relative',
      zIndex: 1,
      maxWidth: '800px',
      margin: '0 auto',
      padding: '2rem 1rem',
      minHeight: 'calc(100vh - 80px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    },
    loadingContainer: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      color: '#1e293b',
      textAlign: 'center'
    },
    loadingSpinner: {
      width: '80px',
      height: '80px',
      border: '6px solid rgba(59, 130, 246, 0.2)',
      borderTop: '6px solid #3b82f6',
      borderRadius: '50%',
      animation: 'spin 1s linear infinite',
      marginBottom: '2rem'
    },
    loadingText: {
      fontSize: '1.3rem',
      fontWeight: '600',
      color: '#475569'
    },
    errorContainer: {
      background: 'rgba(255, 255, 255, 0.9)',
      backdropFilter: 'blur(20px)',
      borderRadius: '24px',
      border: '1px solid rgba(239, 68, 68, 0.2)',
      padding: '3rem',
      textAlign: 'center',
      boxShadow: '0 20px 40px rgba(0, 0, 0, 0.08)',
      animation: 'slideInUp 0.8s ease-out',
      maxWidth: '500px',
      width: '100%'
    },
    errorTitle: {
      fontSize: '2.5rem',
      fontWeight: '800',
      color: '#ef4444',
      marginBottom: '1rem'
    },
    errorMessage: {
      fontSize: '1.1rem',
      color: '#64748b',
      marginBottom: '2rem',
      lineHeight: '1.6'
    },
    successContainer: {
      background: 'rgba(255, 255, 255, 0.9)',
      backdropFilter: 'blur(20px)',
      borderRadius: '24px',
      border: '1px solid rgba(34, 197, 94, 0.2)',
      padding: '3rem',
      textAlign: 'center',
      boxShadow: '0 20px 40px rgba(0, 0, 0, 0.08)',
      animation: 'successAnimation 1.2s ease-out',
      maxWidth: '600px',
      width: '100%',
      position: 'relative',
      overflow: 'hidden'
    },
    successShimmer: {
      position: 'absolute',
      top: 0,
      left: '-100%',
      width: '100%',
      height: '100%',
      background: 'linear-gradient(90deg, transparent, rgba(34, 197, 94, 0.1), transparent)',
      animation: 'shimmer 3s infinite'
    },
    successIcon: {
      fontSize: '5rem',
      marginBottom: '1.5rem',
      animation: 'bounceIn 1s ease-out 0.3s both',
      display: 'block'
    },
    successTitle: {
      fontSize: 'clamp(2rem, 4vw, 3rem)',
      fontWeight: '800',
      color: '#1e293b',
      marginBottom: '1.5rem',
      letterSpacing: '-0.02em',
      animation: 'slideInUp 0.8s ease-out 0.4s both'
    },
    successMessage: {
      marginBottom: '2.5rem',
      animation: 'fadeIn 1s ease-out 0.6s both'
    },
    messageText: {
      fontSize: '1.2rem',
      color: '#22c55e',
      fontWeight: '600',
      marginBottom: '1.5rem'
    },
    detailsGrid: {
      display: 'grid',
      gap: '1rem',
      textAlign: 'left',
      background: 'rgba(248, 250, 252, 0.8)',
      borderRadius: '16px',
      padding: '1.5rem',
      border: '1px solid rgba(226, 232, 240, 0.6)'
    },
    detailItem: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '0.5rem 0',
      borderBottom: '1px solid rgba(226, 232, 240, 0.4)'
    },
    detailItemLast: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '0.5rem 0'
    },
    detailLabel: {
      fontWeight: '600',
      color: '#334155',
      fontSize: '1rem'
    },
    detailValue: {
      fontWeight: '700',
      color: '#1e293b',
      fontSize: '1rem'
    },
    button: {
      background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
      border: 'none',
      borderRadius: '16px',
      padding: '1.25rem 3rem',
      color: 'white',
      fontSize: '1.1rem',
      fontWeight: '700',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      boxShadow: '0 8px 25px rgba(59, 130, 246, 0.4)',
      textTransform: 'uppercase',
      letterSpacing: '0.05em',
      animation: 'fadeIn 1s ease-out 0.8s both',
      margin: '0 0.5rem'
    },
    errorButton: {
      background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
      boxShadow: '0 8px 25px rgba(239, 68, 68, 0.4)'
    },
    failedContainer: {
      background: 'rgba(255, 255, 255, 0.9)',
      backdropFilter: 'blur(20px)',
      borderRadius: '24px',
      border: '1px solid rgba(239, 68, 68, 0.2)',
      padding: '3rem',
      textAlign: 'center',
      boxShadow: '0 20px 40px rgba(0, 0, 0, 0.08)',
      animation: 'slideInUp 0.8s ease-out',
      maxWidth: '500px',
      width: '100%'
    },
    failedIcon: {
      fontSize: '4rem',
      marginBottom: '1.5rem',
      color: '#ef4444',
      display: 'block'
    },
    failedTitle: {
      fontSize: '2.5rem',
      fontWeight: '800',
      color: '#ef4444',
      marginBottom: '1rem'
    },
    confetti: {
      position: 'absolute',
      width: '10px',
      height: '10px',
      background: '#22c55e',
      animation: 'confetti 3s linear infinite'
    }
  };

  const keyframes = `
    @keyframes gradientShift {
      0% { background-position: 0% 50%; }
      50% { background-position: 100% 50%; }
      100% { background-position: 0% 50%; }
    }
    
    @keyframes slideInUp {
      from {
        opacity: 0;
        transform: translateY(30px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }
    
    @keyframes fadeIn {
      from {
        opacity: 0;
        transform: translateY(20px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }
    
    @keyframes bounceIn {
      0% {
        opacity: 0;
        transform: scale(0.3);
      }
      50% {
        opacity: 1;
        transform: scale(1.1);
      }
      100% {
        opacity: 1;
        transform: scale(1);
      }
    }
    
    @keyframes successAnimation {
      0% {
        opacity: 0;
        transform: translateY(30px) scale(0.9);
      }
      100% {
        opacity: 1;
        transform: translateY(0) scale(1);
      }
    }
    
    @keyframes shimmer {
      0% { left: -100%; }
      100% { left: 100%; }
    }
    
    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
    
    @keyframes confetti {
      0% { transform: translateY(-100vh) rotate(0deg); opacity: 1; }
      100% { transform: translateY(100vh) rotate(720deg); opacity: 0; }
    }
  `;

  if (loading) {
    return (
      <div style={styles.container}>
        <style>{keyframes}</style>
        <div style={styles.backgroundOverlay}></div>
        <Nav />
        <div style={styles.pageContent}>
          <div style={styles.loadingContainer}>
            <div style={styles.loadingSpinner}></div>
            <p style={styles.loadingText}>Payment verification කරමින්...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={styles.container}>
        <style>{keyframes}</style>
        <div style={styles.backgroundOverlay}></div>
        <Nav />
        <div style={styles.pageContent}>
          <div style={styles.errorContainer}>
            <h2 style={styles.errorTitle}>⚠️ Verification Error</h2>
            <p style={styles.errorMessage}>{error}</p>
            <button 
              onClick={() => navigate('/my-applications')} 
              style={{...styles.button, ...styles.errorButton}}
              onMouseEnter={(e) => {
                e.target.style.transform = 'translateY(-2px)';
                e.target.style.boxShadow = '0 12px 35px rgba(239, 68, 68, 0.5)';
              }}
              onMouseLeave={(e) => {
                e.target.style.transform = 'translateY(0)';
                e.target.style.boxShadow = '0 8px 25px rgba(239, 68, 68, 0.4)';
              }}
            >
              Back to Applications
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <style>{keyframes}</style>
      <div style={styles.backgroundOverlay}></div>
      <Nav />
      <div style={styles.pageContent}>
        {paymentStatus?.status === 'succeeded' ? (
          <div style={styles.successContainer}>
            <div style={styles.successShimmer}></div>
            
            {/* Animated Confetti Elements */}
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                style={{
                  ...styles.confetti,
                  left: `${10 + i * 15}%`,
                  animationDelay: `${i * 0.2}s`,
                  background: ['#22c55e', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4'][i]
                }}
              ></div>
            ))}
            
            <span style={styles.successIcon}>🎉</span>
            <h1 style={styles.successTitle}>Payment Successful!</h1>
            
            <div style={styles.successMessage}>
              <p style={styles.messageText}>
               Your payment is successfully completed!
              </p>
              
              <div style={styles.detailsGrid}>
                {/* <div style={styles.detailItem}>
                  <span style={styles.detailLabel}>💰 Amount Paid:</span>
                  <span style={styles.detailValue}>Rs. {paymentStatus.amount?.toLocaleString()}</span>
                </div> */}
                <div style={styles.detailItem}>
                  <span style={styles.detailLabel}>💱 Currency:</span>
                  <span style={styles.detailValue}>{paymentStatus.currency?.toUpperCase()}</span>
                </div>
                <div style={styles.detailItemLast}>
                  <span style={styles.detailLabel}>✅ Status:</span>
                  <span style={styles.detailValue}>Completed</span>
                </div>
              </div>
            </div>
          
<button 
  onClick={() => {
    if (paymentType === 'property_tax') {
      navigate('/propertyhome');   // ✅ Go to property home
    } else {
      navigate('/my-applications'); // ✅ Default shop rent
    }
  }}
  style={styles.button}
  onMouseEnter={(e) => {
    e.target.style.transform = 'translateY(-2px)';
    e.target.style.boxShadow = '0 12px 35px rgba(59, 130, 246, 0.5)';
  }}
  onMouseLeave={(e) => {
    e.target.style.transform = 'translateY(0)';
    e.target.style.boxShadow = '0 8px 25px rgba(59, 130, 246, 0.4)';
  }}
>
  {paymentType === 'property_tax' ? "🏠 Go to Property Home" : "📋 Back to My Applications"}
</button>          </div>
        ) : (
          <div style={styles.failedContainer}>
            <span style={styles.failedIcon}>❌</span>
            <h2 style={styles.failedTitle}>Payment Failed</h2>
            <p style={styles.errorMessage}>Your payment was not completed successfully.</p>
            <div style={styles.detailsGrid}>
              <div style={styles.detailItemLast}>
                <span style={styles.detailLabel}>Status:</span>
                <span style={styles.detailValue}>{paymentStatus?.status}</span>
              </div>
            </div>
            <button 
              onClick={() => navigate('/pay')} 
              style={{...styles.button, ...styles.errorButton}}
              onMouseEnter={(e) => {
                e.target.style.transform = 'translateY(-2px)';
                e.target.style.boxShadow = '0 12px 35px rgba(239, 68, 68, 0.5)';
              }}
              onMouseLeave={(e) => {
                e.target.style.transform = 'translateY(0)';
                e.target.style.boxShadow = '0 8px 25px rgba(239, 68, 68, 0.4)';
              }}
            >
              Try Again
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default PaymentSuccess;