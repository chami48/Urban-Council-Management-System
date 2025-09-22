import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from "react-router-dom";
import './MyApplication.css';
import Nav from "../Nav/Nav";

const MyApplications = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [citizenNIC, setCitizenNIC] = useState('');
  const [paymentHistory, setPaymentHistory] = useState({}); // ✅ new state
  const navigate = useNavigate();

  useEffect(() => {
    const nic = localStorage.getItem('citizenNIC') || 'your-nic-here';
    setCitizenNIC(nic);
    fetchApplications(nic);
  }, []);

  // ✅ fetch payment history for each approved application
  const fetchPaymentHistory = async (appId) => {
    try {
      const res = await axios.get(`http://localhost:5000/api/payment/history/application/${appId}`);
      setPaymentHistory((prev) => ({ ...prev, [appId]: res.data }));
    } catch (error) {
      console.error('Error fetching payment history:', error);
    }
  };

  const fetchApplications = async (nic) => {
    try {
      const response = await axios.get(`http://localhost:5000/api/shop-applications?nic=${nic}`);
      console.log("Applications response:", response.data);
      setApplications(response.data);
      setLoading(false);

      // ✅ fetch history for approved apps
      response.data.forEach((app) => {
        if (app.status === 'approved') {
          fetchPaymentHistory(app._id);
        }
      });
    } catch (error) {
      console.error('Error fetching applications:', error);
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'pending': return '#ffa500';
      case 'approved': return '#28a745';
      case 'rejected': return '#dc3545';
      default: return '#6c757d';
    }
  };

  const getStatusText = (status) => {
    switch (status.toLowerCase()) {
      case 'pending': return 'විමර්ශනයේ (Pending)';
      case 'approved': return 'අනුමත කර ඇත (Approved)';
      case 'rejected': return 'ප්‍රතික්ෂේප කර ඇත (Rejected)';
      default: return status;
    }
  };

  // Payment button click handler
  const handlePaymentClick = (application) => {
    try {
      if (!application._id) {
        alert("Invalid shop application ID");
        return;
      }
      navigate(`/shop-rent/${application._id}`);
    } catch (error) {
      console.error('Payment navigation error:', error);
      alert('Error navigating to payment page. Please try again.');
    }
  };

  if (loading) {
    return <div className="loading-container"><div className="loading">Loading applications...</div></div>;
  }

  return (
    <div>
      <Nav/>
      <div className="my-applications-container">
        <div className="header">
          <h1>මගේ අයදුම්පත් (My Applications)</h1>
          <div>
            <button 
              className="refresh-btn"
              onClick={() => fetchApplications(citizenNIC)}
            >
              🔄 Refresh
            </button>

            <button 
              className="register-btn"
              onClick={() => navigate("/citizen-apply")}
            >
              🏪 Register My Shop
            </button>
          </div>
        </div>

        {applications.length === 0 ? (
          <div className="no-applications">
            <h3>අයදුම්පත් නොමැත (No Applications Found)</h3>
            <p>ඔබ තවම කිසිදු අයදුම්පතක් ඉදිරිපත් කර නැත.</p>
          </div>
        ) : (
          <div className="applications-grid">
            {applications.map((application, index) => (
              <div key={application._id || index} className="application-card">
                <div className="application-header">
                  <h3>Shop License Application</h3>
                  <div 
                    className="status-badge"
                    style={{ backgroundColor: getStatusColor(application.status) }}
                  >
                    {getStatusText(application.status)}
                  </div>
                </div>

                <div className="application-details">
                  <div className="detail-row"><strong>Shop Name:</strong><span>{application.shopName || "N/A"}</span></div>
                  <div className="detail-row"><strong>Shop Number:</strong><span>{application.shopNo || "N/A"}</span></div>
                  <div className="detail-row"><strong>Owner Name:</strong><span>{application.applicantName || "N/A"}</span></div>
                  <div className="detail-row"><strong>NIC:</strong><span>{application.nicNumber || "N/A"}</span></div>
                  <div className="detail-row"><strong>Permanent Address:</strong><span>{application.permanentAddress || "N/A"}</span></div>
                  <div className="detail-row"><strong>Shop Address:</strong><span>{application.shopAddress || "N/A"}</span></div>
                  <div className="detail-row"><strong>Business Category:</strong><span>{application.businessCategory || "N/A"}</span></div>
                  <div className="detail-row"><strong>Contact Number:</strong><span>{application.phone || application.emergencyPhone || "N/A"}</span></div>
                  <div className="detail-row"><strong>Email:</strong><span>{application.email || "N/A"}</span></div>
                  <div className="detail-row"><strong>Submitted Date:</strong>
                    <span>{application.createdAt ? new Date(application.createdAt).toLocaleDateString('en-GB') : "N/A"}</span>
                  </div>
                  {application.status === 'rejected' && application.rejectionReason && (
                    <div className="detail-row rejection-reason">
                      <strong>Rejection Reason:</strong>
                      <span className="rejection-text">{application.rejectionReason}</span>
                    </div>
                  )}
                </div>

                {/* 🔄 Application Actions Section */}
                <div className="application-actions">
                  {application.status === 'pending' && (
                    <p className="pending-message">⏳ Your application is being reviewed by our officers.</p>
                  )}

                  {application.status === 'approved' && (
                    <div className="approved-message">
                      <p>✅ Congratulations! Your application has been approved.</p>

                      {/* ✅ hide Pay button if history exists */}
                      {(!paymentHistory[application._id] || paymentHistory[application._id].length === 0) ? (
                        <button
                          className="payrent-btn"
                          onClick={() => handlePaymentClick(application)}
                        >
                          💳 Pay Rent
                        </button>
                      ) : (
                        <div className="payment-history">
                          <p className="text-green-600 font-semibold">💰 Rent already paid</p>
                          <h4>Payment History:</h4>
                          <ul>
                            {paymentHistory[application._id].map((p) => (
                              <li key={p._id}>
                                Rs. {p.amount} – {new Date(p.paymentDate).toLocaleDateString('en-GB')}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  )}

                  {application.status === 'rejected' && (
                    <div className="rejected-message">
                      <p>❌ Sorry, your application has been rejected.</p>
                      <button 
                        className="reapply-btn"
                        onClick={() => navigate('/citizen-apply')}
                      >
                        Apply Again
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyApplications;
