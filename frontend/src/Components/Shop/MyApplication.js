import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from "react-router-dom";
import Nav from "../Nav/Nav";
import Swal from "sweetalert2";

const MyApplications = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [citizenNIC, setCitizenNIC] = useState('');
  const [paymentHistory, setPaymentHistory] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    const nic = localStorage.getItem('citizenNIC') || 'your-nic-here';
    setCitizenNIC(nic);
    fetchApplications(nic);
  }, []);

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
      setApplications(response.data);
      setLoading(false);
      response.data.forEach((app) => {
        if (app.status === 'approved') fetchPaymentHistory(app._id);
      });
    } catch (error) {
      console.error('Error fetching applications:', error);
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'pending': return 'bg-yellow-500';
      case 'approved': return 'bg-green-600';
      case 'rejected': return 'bg-red-600';
      default: return 'bg-gray-500';
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

  const handlePaymentClick = (application) => {
    try {
      if (!application._id) {
        Swal.fire({
          icon: "error",
          title: "Invalid Application",
          text: "Invalid shop application ID",
        });
        return;
      }
      navigate(`/shop-rent/${application._id}`);
    } catch (error) {
      console.error('Payment navigation error:', error);
      Swal.fire({
        icon: "error",
        title: "Navigation Error",
        text: "Error navigating to payment page. Please try again.",
      });
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[50vh] text-2xl font-bold text-indigo-600 animate-pulse">
        Loading applications...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-indigo-100 dark:from-gray-900 dark:to-gray-800 transition">
      <Nav />
      <div className="max-w-7xl mx-auto p-6">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-center bg-white/30 backdrop-blur-md border border-white/40 rounded-2xl shadow-2xl p-6 mb-10 animate-fade-in">
          <h1 className="text-3xl font-extrabold text-indigo-700 dark:text-white drop-shadow-md">
            මගේ අයදුම්පත් (My Applications)
          </h1>
          <div className="mt-4 md:mt-0 flex gap-4">
            <button 
              onClick={() => fetchApplications(citizenNIC)}
              className="px-6 py-2 rounded-full border border-indigo-500 bg-white text-indigo-600 font-semibold hover:bg-indigo-600 hover:text-white transition-all shadow-md hover:shadow-lg"
            >
              🔄 Refresh
            </button>
            <button 
              onClick={() => navigate("/citizen-apply")}
              className="px-6 py-2 rounded-full bg-gradient-to-r from-pink-500 to-yellow-400 text-white font-bold shadow-md hover:scale-105 transition"
            >
              🏪 Register My Shop
            </button>
          </div>
        </div>

        {/* No Applications */}
        {applications.length === 0 ? (
          <div className="text-center bg-white/50 backdrop-blur-lg border border-gray-200 rounded-2xl p-12 shadow-xl">
            <h3 className="text-2xl font-semibold text-gray-800 dark:text-white mb-4">අයදුම්පත් නොමැත (No Applications Found)</h3>
            <p className="text-gray-600 dark:text-gray-300">ඔබ තවම කිසිදු අයදුම්පතක් ඉදිරිපත් කර නැත.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {applications.map((application, index) => (
              <div 
                key={application._id || index} 
                className="relative bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg border border-gray-200 dark:border-gray-700 rounded-2xl shadow-xl hover:shadow-2xl transition transform hover:-translate-y-2"
              >
                
                {/* Card Header */}
                <div className="flex justify-between items-center bg-gradient-to-r from-blue-400 to-blue-700 text-white px-6 py-4 rounded-t-2xl">
                  <h3 className="text-lg font-bold tracking-wide">Shop License Application</h3>
                  <span className={`px-4 py-1 rounded-full text-xs font-bold shadow ${getStatusColor(application.status)}`}>
                    {getStatusText(application.status)}
                  </span>
                </div>

                {/* Card Body */}
                <div className="p-6 space-y-2 text-sm text-gray-800 dark:text-gray-200">
                  <p><strong>Shop Name:</strong> {application.shopName || "N/A"}</p>
                  <p><strong>Shop Number:</strong> {application.shopNo || "N/A"}</p>
                  <p><strong>Owner Name:</strong> {application.applicantName || "N/A"}</p>
                  <p><strong>NIC:</strong> {application.nicNumber || "N/A"}</p>
                  <p><strong>Permanent Address:</strong> {application.permanentAddress || "N/A"}</p>
                  <p><strong>Shop Address:</strong> {application.shopAddress || "N/A"}</p>
                  <p><strong>Business Category:</strong> {application.businessCategory || "N/A"}</p>
                  <p><strong>Contact:</strong> {application.phone || application.emergencyPhone || "N/A"}</p>
                  <p><strong>Email:</strong> {application.email || "N/A"}</p>
                  <p><strong>Submitted:</strong> {application.createdAt ? new Date(application.createdAt).toLocaleDateString('en-GB') : "N/A"}</p>

                  {application.status === 'rejected' && application.rejectionReason && (
                    <div className="bg-red-50 border border-red-300 rounded-xl p-4 mt-4 dark:bg-red-900/40 dark:border-red-600">
                      <strong className="text-red-700 dark:text-red-400">Rejection Reason:</strong>
                      <p className="text-red-600 dark:text-red-300">{application.rejectionReason}</p>
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div className="p-6 bg-gray-50 dark:bg-gray-900/50 border-t border-gray-200 dark:border-gray-700 rounded-b-2xl space-y-4">
                  {application.status === 'pending' && (
                    <p className="bg-yellow-100 text-yellow-800 px-4 py-2 rounded-lg text-center font-medium shadow-inner">
                      ⏳ Your application is being reviewed by our officers.
                    </p>
                  )}

                  {application.status === 'approved' && (
                    <div className="bg-green-100 text-green-800 px-4 py-3 rounded-lg text-center font-semibold shadow-inner">
                      <p>✅ Congratulations! Your application has been approved.</p>
                      {(!paymentHistory[application._id] || paymentHistory[application._id].length === 0) ? (
                        <button
                          onClick={() => handlePaymentClick(application)}
                          className="mt-3 px-6 py-2 rounded-full bg-blue-600 hover:bg-blue-700 text-white font-bold shadow-md hover:scale-105 transition"
                        >
                          💳 Pay Rent
                        </button>
                      ) : (
                        <div className="mt-4 text-left text-sm">
                          <p className="font-semibold">💰 Rent already paid</p>
                          <h4 className="font-semibold mt-2">Payment History:</h4>
                          <ul className="list-disc ml-5">
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
                    <div className="text-center">
                      <p className="bg-red-100 text-red-700 px-4 py-2 rounded-lg mb-3 shadow-inner">
                        ❌ Sorry, your application has been rejected.
                      </p>
                      <button 
                        onClick={() => navigate('/citizen-apply')}
                        className="px-6 py-2 rounded-full bg-gradient-to-r from-pink-500 to-yellow-400 text-white font-bold shadow-lg hover:scale-105 transition"
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
