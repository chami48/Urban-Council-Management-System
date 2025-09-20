import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Navigation from '../Navigation/Navigation'; // Added Navigation import
import './OfficerDashboard.css';

const OfficerDashboard = () => {
  const [pendingApplications, setPendingApplications] = useState([]);
  const [allApplications, setAllApplications] = useState([]);
  const [activeTab, setActiveTab] = useState('pending');
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState(null);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false); // Added sidebar state

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    setLoading(true);
    try {
      // Fetch pending applications
      const pendingResponse = await axios.get('http://localhost:5000/api/shop-applications/pending');
      setPendingApplications(pendingResponse.data);

      // Fetch all applications for history view
      const allResponse = await axios.get('http://localhost:5000/api/shop-applications');
      setAllApplications(allResponse.data);
      
      setLoading(false);
    } catch (error) {
      console.error('Error fetching applications:', error);
      setLoading(false);
    }
  };

  const handleApprove = async (id) => {
    if (!window.confirm('Are you sure you want to approve this application?')) return;
    
    setProcessingId(id);
    try {
      await axios.post(`http://localhost:5000/api/shop-applications/approve/${id}`);
      await fetchApplications(); // Refresh the data
      alert('Application approved successfully!');
    } catch (error) {
      console.error('Error approving application:', error);
      alert('Error approving application. Please try again.');
    }
    setProcessingId(null);
  };

  const handleReject = async (id) => {
    const reason = prompt('Please provide a reason for rejection:');
    if (!reason) return;
    
    setProcessingId(id);
    try {
      await axios.post(`http://localhost:5000/api/shop-applications/reject/${id}`, {
        rejectionReason: reason
      });
      await fetchApplications(); // Refresh the data
      alert('Application rejected successfully!');
    } catch (error) {
      console.error('Error rejecting application:', error);
      alert('Error rejecting application. Please try again.');
    }
    setProcessingId(null);
  };

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'pending':
        return '#ffc107';
      case 'approved':
        return '#28a745';
      case 'rejected':
        return '#dc3545';
      default:
        return '#6c757d';
    }
  };

  const renderApplicationTable = (applications) => {
    if (applications.length === 0) {
      return (
        <div className="no-applications">
          <h3>No applications found</h3>
          <p>There are currently no {activeTab} applications.</p>
        </div>
      );
    }

    return (
      <div className="applications-table-container">
        <table className="applications-table">
          <thead>
            <tr>
              <th>Shop Number</th>
              <th>Shop Name</th>
              <th>Owner Name</th>
              <th>NIC</th>
              <th>Contact</th>
              <th>business Category</th>
              <th>Status</th>
              <th>Submitted Date</th>
              {activeTab === 'pending' && <th>Actions</th>}
              <th>Details</th>
            </tr>
          </thead>
          <tbody>
            {applications.map((application) => (
              <tr key={application._id} className="application-row">
                <td>{application.shopNo}</td>
                <td className="shop-name">{application.shopName}</td>
                <td>{application.applicantName}</td>
                <td>{application.nicNumber}</td>
                <td>
                  <div className="contact-info">
                    <div>{application.phone }</div>
                    <small>{application.email}</small>
                  </div>
                </td>
                <td>{application.businessCategory}</td>
                <td>
                  <span 
                    className="status-badge"
                    style={{ backgroundColor: getStatusColor(application.status) }}
                  >
                    {application.status.charAt(0).toUpperCase() + application.status.slice(1)}
                  </span>
                </td>
                <td>
                  {new Date(application.createdAt || application.submittedDate).toLocaleDateString('en-GB')}
                </td>
                
                {activeTab === 'pending' && (
                  <td className="action-buttons">
                    <button
                      className="approve-btn"
                      onClick={() => handleApprove(application._id)}
                      disabled={processingId === application._id}
                    >
                      {processingId === application._id ? 'Processing...' : 'Approve'}
                    </button>
                    <button
                      className="reject-btn"
                      onClick={() => handleReject(application._id)}
                      disabled={processingId === application._id}
                    >
                      {processingId === application._id ? 'Processing...' : 'Reject'}
                    </button>
                  </td>
                )}
                
                <td>
                  <button 
                    className="view-details-btn"
                    onClick={() => showApplicationDetails(application)}
                  >
                    View Details
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  const showApplicationDetails = (application) => {
    const detailsWindow = window.open('', '_blank', 'width=600,height=800');
    detailsWindow.document.write(`
      <html>
        <head>
          <title>Application Details</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 20px; }
            h2 { color: #333; }
            .detail-item { margin: 10px 0; padding: 10px; background: #f5f5f5; border-radius: 5px; }
            .label { font-weight: bold; color: #555; }
            .status { padding: 5px 10px; border-radius: 15px; color: white; display: inline-block; }
            .pending { background-color: #ffc107; }
            .approved { background-color: #28a745; }
            .rejected { background-color: #dc3545; }
          </style>
        </head>
        <body>
          <h2>Shop License Application Details</h2>
          <div class="detail-item"><span class="label">Shop Name:</span> ${application.shopName}</div>
          <div class="detail-item"><span class="label">Owner Name:</span> ${application.applicantName}</div>
          <div class="detail-item"><span class="label">Owner NIC:</span> ${application.nicNumber}</div>
          <div class="detail-item"><span class="label">Address:</span> ${application.address}</div>
          <div class="detail-item"><span class="label">Business Category:</span> ${application.businessCategory}</div>
          <div class="detail-item"><span class="label">Contact Number:</span> ${application.phone}</div>
          <div class="detail-item"><span class="label">Email:</span> ${application.email}</div>
          <div class="detail-item"><span class="label">Business Registration:</span> ${application.businessRegistration || 'N/A'}</div>
          <div class="detail-item"><span class="label">Expected Opening Date:</span> ${application.expectedOpeningDate || 'N/A'}</div>
          <div class="detail-item">
            <span class="label">Status:</span> 
            <span class="status ${application.status}">${application.status.charAt(0).toUpperCase() + application.status.slice(1)}</span>
          </div>
          <div class="detail-item"><span class="label">Submitted Date:</span> ${new Date(application.createdAt || application.submittedDate).toLocaleString()}</div>
          ${application.rejectionReason ? `<div class="detail-item"><span class="label">Rejection Reason:</span> ${application.rejectionReason}</div>` : ''}
          <br>
          <button onclick="window.close()" style="padding: 10px 20px; background: #007bff; color: white; border: none; border-radius: 5px; cursor: pointer;">Close</button>
        </body>
      </html>
    `);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
        {/* Navigation Component */}
        <Navigation 
          sidebarCollapsed={sidebarCollapsed} 
          setSidebarCollapsed={setSidebarCollapsed} 
        />
        
        {/* Main Content with proper margin */}
        <main className={`transition-all duration-300 ${sidebarCollapsed ? 'ml-20' : 'ml-72'}`}>
          <div className="loading-container">
            <div className="loading">Loading applications...</div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Navigation Component */}
      <Navigation 
        sidebarCollapsed={sidebarCollapsed} 
        setSidebarCollapsed={setSidebarCollapsed} 
      />
      
      {/* Main Content with proper margin */}
      <main className={`transition-all duration-300 ${sidebarCollapsed ? 'ml-20' : 'ml-72'}`}>
        <div className="officer-dashboard">
          <div className="dashboard-header">
            <h1>📋 Officer Dashboard</h1>
            <div className="stats-container">
              <div className="stat-card">
                <h3>{pendingApplications.length}</h3>
                <p>Pending Applications</p>
              </div>
              <div className="stat-card">
                <h3>{allApplications.filter(app => app.status === 'approved').length}</h3>
                <p>Approved Applications</p>
              </div>
              <div className="stat-card">
                <h3>{allApplications.filter(app => app.status === 'rejected').length}</h3>
                <p>Rejected Applications</p>
              </div>
            </div>
          </div>

          <div className="tabs-container">
            <div className="tabs">
              <button
                className={`tab ${activeTab === 'pending' ? 'active' : ''}`}
                onClick={() => setActiveTab('pending')}
              >
                Pending Applications ({pendingApplications.length})
              </button>
              <button
                className={`tab ${activeTab === 'all' ? 'active' : ''}`}
                onClick={() => setActiveTab('all')}
              >
                All Applications ({allApplications.length})
              </button>
            </div>

            <button className="refresh-btn" onClick={fetchApplications}>
              🔄 Refresh Data
            </button>
          </div>

          <div className="tab-content">
            {activeTab === 'pending' ? 
              renderApplicationTable(pendingApplications) : 
              renderApplicationTable(allApplications)
            }
          </div>
        </div>
      </main>
    </div>
  );
};

export default OfficerDashboard;