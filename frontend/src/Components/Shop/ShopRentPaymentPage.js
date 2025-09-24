// src/Components/Shop/ShopRentPaymentPage.js
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import Nav from '../Nav/Nav';

export default function ShopRentPaymentPage() {
  const { shopId } = useParams();
  const [shopData, setShopData] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get(`http://localhost:5000/api/shop-payment/${shopId}`)
      .then((res) => setShopData(res.data))
      .catch((err) => console.error("Error fetching shop details:", err));
  }, [shopId]);

  const handleProceedToPay = () => {
    // Navigate using paymentType + shopId
    navigate(`/payment?paymentType=shop_rent&shopId=${shopId}`);
  };

  const styles = {
    container: {
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 25%, #f1f5f9 50%, #e7f3ff 75%, #f0f9ff 100%)',
      backgroundSize: '400% 400%',
      animation: 'gradientShift 15s ease infinite',
      position: 'relative',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      padding: '2rem 1rem'
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
      margin: '0 auto'
    },
    header: {
      fontSize: 'clamp(2rem, 4vw, 3rem)',
      fontWeight: '800',
      color: '#1e293b',
      textAlign: 'center',
      marginBottom: '3rem',
      textShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
      letterSpacing: '-0.02em',
      animation: 'slideInDown 0.8s ease-out'
    },
    paymentContainer: {
      background: 'rgba(255, 255, 255, 0.8)',
      backdropFilter: 'blur(20px)',
      borderRadius: '24px',
      border: '1px solid rgba(226, 232, 240, 0.8)',
      padding: '3rem',
      boxShadow: `
        0 20px 40px rgba(0, 0, 0, 0.08),
        0 1px 0px rgba(255, 255, 255, 0.9) inset
      `,
      animation: 'slideInUp 0.8s ease-out 0.2s both',
      position: 'relative',
      overflow: 'hidden'
    },
    shimmerOverlay: {
      position: 'absolute',
      top: 0,
      left: '-100%',
      width: '100%',
      height: '100%',
      background: 'linear-gradient(90deg, transparent, rgba(59, 130, 246, 0.05), transparent)',
      animation: 'shimmer 3s infinite'
    },
    detailsBox: {
      background: 'rgba(248, 250, 252, 0.8)',
      borderRadius: '16px',
      padding: '2rem',
      marginBottom: '2rem',
      border: '1px solid rgba(226, 232, 240, 0.6)',
      animation: 'fadeIn 1s ease-out 0.4s both'
    },
    detailItem: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '0.75rem 0',
      borderBottom: '1px solid rgba(226, 232, 240, 0.4)',
      fontSize: '1rem',
      color: '#475569'
    },
    detailItemLast: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '0.75rem 0',
      fontSize: '1rem',
      color: '#475569'
    },
    detailLabel: {
      fontWeight: '600',
      color: '#334155'
    },
    detailValue: {
      fontWeight: '500',
      color: '#1e293b'
    },
    summary: {
      background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
      borderRadius: '16px',
      padding: '1.5rem 2rem',
      marginBottom: '2rem',
      color: 'white',
      textAlign: 'center',
      boxShadow: '0 10px 30px rgba(59, 130, 246, 0.3)',
      animation: 'fadeIn 1s ease-out 0.6s both'
    },
    summaryText: {
      fontSize: '1.2rem',
      fontWeight: '700',
      margin: 0
    },
    payBtn: {
      background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
      border: 'none',
      borderRadius: '16px',
      padding: '1.25rem 3rem',
      color: 'white',
      fontSize: '1.1rem',
      fontWeight: '700',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      boxShadow: '0 8px 25px rgba(16, 185, 129, 0.4)',
      width: '100%',
      textTransform: 'uppercase',
      letterSpacing: '0.05em',
      animation: 'fadeIn 1s ease-out 0.8s both',
      position: 'relative',
      overflow: 'hidden'
    },
    payBtnHover: {
      transform: 'translateY(-2px)',
      boxShadow: '0 12px 35px rgba(16, 185, 129, 0.5)'
    },
    loadingContainer: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '60vh',
      color: '#1e293b'
    },
    loadingSpinner: {
      width: '60px',
      height: '60px',
      border: '4px solid rgba(59, 130, 246, 0.2)',
      borderTop: '4px solid #3b82f6',
      borderRadius: '50%',
      animation: 'spin 1s linear infinite',
      marginBottom: '1rem'
    },
    loadingText: {
      fontSize: '1.2rem',
      fontWeight: '500',
      textAlign: 'center'
    },
    icon: {
      fontSize: '1.5rem',
      marginRight: '0.5rem'
    }
  };

  const keyframes = `
    @keyframes gradientShift {
      0% { background-position: 0% 50%; }
      50% { background-position: 100% 50%; }
      100% { background-position: 0% 50%; }
    }
    
    @keyframes slideInDown {
      from {
        opacity: 0;
        transform: translateY(-30px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
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
    
    @keyframes shimmer {
      0% { left: -100%; }
      100% { left: 100%; }
    }
    
    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
    
    @keyframes pulse {
      0%, 100% { transform: scale(1); }
      50% { transform: scale(1.02); }
    }
  `;

  if (!shopData) {
    return (
      <div style={styles.container}>
        <style>{keyframes}</style>
        <div style={styles.backgroundOverlay}></div>
        <div style={styles.pageContent}>
          <div style={styles.loadingContainer}>
            <div style={styles.loadingSpinner}></div>
            <p style={styles.loadingText}>Loading shop details...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <Nav/>
    <div style={styles.container}>
      <style>{keyframes}</style>
      <div style={styles.backgroundOverlay}></div>
      <div style={styles.pageContent}>
        <h2 style={styles.header}>
          <span style={styles.icon}>🏪</span>
          Shop Rent Payment
        </h2>

        <div style={styles.paymentContainer}>
          <div style={styles.shimmerOverlay}></div>
          
          <div style={styles.detailsBox}>
            <div style={styles.detailItem}>
              <span style={styles.detailLabel}>🏷️ Shop Name:</span>
              <span style={styles.detailValue}>{shopData.shopName}</span>
            </div>
            <div style={styles.detailItem}>
              <span style={styles.detailLabel}>🔢 Shop No:</span>
              <span style={styles.detailValue}>{shopData.shopNo}</span>
            </div>
            <div style={styles.detailItem}>
              <span style={styles.detailLabel}>📍 Address:</span>
              <span style={styles.detailValue}>{shopData.shopAddress}</span>
            </div>
            <div style={styles.detailItem}>
              <span style={styles.detailLabel}>📅 Lease Duration:</span>
              <span style={styles.detailValue}>{shopData.leaseDuration}</span>
            </div>
            <div style={styles.detailItemLast}>
              <span style={styles.detailLabel}>💰 Monthly Rent:</span>
              <span style={styles.detailValue}>LKR {shopData.requestedRent}</span>
            </div>
          </div>

          <div style={styles.summary}>
            <p style={styles.summaryText}>
              Total Amount: LKR {shopData.requestedRent}
            </p>
          </div>

          <button 
            style={styles.payBtn} 
            onClick={handleProceedToPay}
            onMouseEnter={(e) => {
              e.target.style.transform = 'translateY(-2px)';
              e.target.style.boxShadow = '0 12px 35px rgba(16, 185, 129, 0.5)';
            }}
            onMouseLeave={(e) => {
              e.target.style.transform = 'translateY(0)';
              e.target.style.boxShadow = '0 8px 25px rgba(16, 185, 129, 0.4)';
            }}
          >
            🚀 Proceed to Pay
          </button>
        </div>
      </div>
    </div>
    </div>
  );
}