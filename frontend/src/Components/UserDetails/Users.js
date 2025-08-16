import React, { useEffect, useState, useRef } from 'react';
import Nav from "../Nav/Nav";
import axios from "axios";
import User from "../User/User";
import { useReactToPrint } from "react-to-print";

const URL = "http://localhost:5000/users";

const fetchHandler = async () => {
  try {
    const res = await axios.get(URL);
    return res.data.users;
  } catch (error) {
    console.error("Fetch error:", error);
    return [];
  }
};

function Users() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [hoveredButton, setHoveredButton] = useState(false);
  const componentsRef = useRef();

  useEffect(() => {
    const loadUsers = async () => {
      setLoading(true);
      const data = await fetchHandler();
      setUsers(data);
      setLoading(false);
    };
    loadUsers();
  }, []);

  const handleUpdate = (user) => {
    // Add your update logic here
    console.log("Update user:", user);
    alert(`${user.name || 'පරිශීලකයා'} යාවත්කාලීන කිරීම සඳහා සූදානම්`);
  };

  const handleDelete = async (user) => {
  if (window.confirm(`ඔබට ${user.name || 'මෙම වාර්තාව'} ඉවත් කිරීමට අවශ්‍යද?`)) {
    try {
      await axios.delete(`${URL}/${user._id}`); // ✅ Backend delete request

      // Remove from frontend list
      const updatedUsers = users.filter(u => u._id !== user._id);
      setUsers(updatedUsers);

      alert("වාර්තාව සාර්ථකව ඉවත් කරන ලදී");
    } catch (error) {
      console.error("Delete error:", error);
      alert("ඉවත් කිරීමේදී දෝෂයක් ඇතිවිය");
    }
  }
};


  const handlePrint = useReactToPrint({
    content: () => componentsRef.current,
    documentTitle: "පරිශීලක වාර්තාව",
    onAfterPrint: () => alert("වාර්තාව සාර්ථකව බාගත කරන ලදී"),
  });

  return (
    <div className="government-container">
      <style jsx>{`
        @import url('https://fonts.googleapis.com/css2?family=Noto+Sans+Sinhala:wght@300;400;500;600;700;800&display=swap');
        @import url('https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500;600;700&display=swap');

        .government-container {
          min-height: 100vh;
          background: linear-gradient(180deg, #1a365d 0%, #2d5016 20%, #ffffff 20%);
          position: relative;
          font-family: 'Roboto', 'Noto Sans Sinhala', sans-serif;
        }

        .government-header {
          background: linear-gradient(90deg, #1a365d 0%, #2d5016 50%, #ff6b00 100%);
          padding: 1rem 0;
          border-bottom: 4px solid #ff6b00;
          box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }

        .sri-lanka-emblem {
          text-align: center;
          padding: 1rem 0;
          background: rgba(255,255,255,0.95);
          border-bottom: 2px solid #e2e8f0;
        }

        .emblem-icon {
          width: 60px;
          height: 60px;
          background: linear-gradient(135deg, #ff6b00, #ffab00);
          border-radius: 50%;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          font-size: 2rem;
          color: white;
          font-weight: bold;
          border: 3px solid #1a365d;
          box-shadow: 0 4px 15px rgba(0,0,0,0.2);
          margin-bottom: 0.5rem;
        }

        .content-wrapper {
          position: relative;
          z-index: 1;
          max-width: 1400px;
          margin: 0 auto;
          padding: 2rem;
          background: white;
          min-height: calc(100vh - 200px);
        }

        .ministry-header {
          text-align: center;
          margin-bottom: 3rem;
          padding: 2rem 0;
          border-bottom: 3px solid #1a365d;
          background: linear-gradient(135deg, #f8f9ff 0%, #e8f4fd 100%);
          border-radius: 12px;
          position: relative;
          overflow: hidden;
        }

        .ministry-header::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 4px;
          background: linear-gradient(90deg, #1a365d 0%, #2d5016 50%, #ff6b00 100%);
        }

        .ministry-title {
          font-size: clamp(1.8rem, 4vw, 2.8rem);
          font-weight: 700;
          color: #1a365d;
          margin-bottom: 0.5rem;
          letter-spacing: -0.5px;
          font-family: 'Noto Sans Sinhala', sans-serif;
          line-height: 1.2;
        }

        .ministry-subtitle {
          font-size: 1.1rem;
          color: #2d5016;
          font-weight: 500;
          margin-bottom: 1rem;
          font-family: 'Roboto', sans-serif;
        }

        .department-title {
          font-size: clamp(1.5rem, 3vw, 2rem);
          color: #ff6b00;
          font-weight: 600;
          font-family: 'Noto Sans Sinhala', sans-serif;
          margin-bottom: 0.5rem;
        }

        .official-card {
          background: white;
          border: 2px solid #e2e8f0;
          border-radius: 8px;
          box-shadow: 
            0 4px 6px rgba(0, 0, 0, 0.05),
            0 1px 3px rgba(0, 0, 0, 0.1);
          margin-bottom: 2rem;
          position: relative;
          overflow: hidden;
        }

        .official-card::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 6px;
          background: linear-gradient(90deg, #1a365d 0%, #2d5016 50%, #ff6b00 100%);
        }

        .card-header {
          padding: 1.5rem 2rem;
          background: #f8fafc;
          border-bottom: 2px solid #e2e8f0;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .card-title {
          font-size: 1.4rem;
          font-weight: 600;
          color: #1a365d;
          margin: 0;
          font-family: 'Noto Sans Sinhala', sans-serif;
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }

        .gov-badge {
          background: linear-gradient(135deg, #1a365d 0%, #2d5016 100%);
          color: white;
          padding: 0.4rem 1rem;
          border-radius: 6px;
          font-size: 0.85rem;
          font-weight: 600;
          font-family: 'Noto Sans Sinhala', sans-serif;
          border: 1px solid #0f2027;
        }

        .card-content {
          padding: 2rem;
          min-height: 400px;
          position: relative;
          background: white;
        }

        .loading-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          height: 300px;
          gap: 1.5rem;
        }

        .gov-spinner {
          width: 60px;
          height: 60px;
          border: 4px solid #e2e8f0;
          border-top: 4px solid #1a365d;
          border-radius: 50%;
          animation: govSpin 1.2s linear infinite;
        }

        .loading-text {
          color: #4a5568;
          font-size: 1rem;
          font-weight: 500;
          font-family: 'Noto Sans Sinhala', sans-serif;
        }

        .empty-state {
          text-align: center;
          padding: 4rem 2rem;
          color: #718096;
        }

        .empty-icon {
          font-size: 4rem;
          margin-bottom: 1.5rem;
          color: #cbd5e0;
        }

        .empty-title {
          font-size: 1.5rem;
          font-weight: 600;
          margin-bottom: 0.75rem;
          color: #2d3748;
          font-family: 'Noto Sans Sinhala', sans-serif;
        }

        .empty-description {
          font-size: 1rem;
          line-height: 1.6;
          font-family: 'Noto Sans Sinhala', sans-serif;
          color: #4a5568;
        }

        .user-item {
          margin-bottom: 1.5rem;
          background: #f8fafc;
          border: 1px solid #e2e8f0;
          border-radius: 8px;
          overflow: hidden;
          border-left: 4px solid #1a365d;
          box-shadow: 0 2px 8px rgba(0,0,0,0.05);
          transition: all 0.3s ease;
        }

        .user-item:hover {
          box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
          border-left-color: #ff6b00;
          transform: translateY(-2px);
        }

        .user-item:last-child {
          margin-bottom: 0;
        }

        .user-content-wrapper {
          padding: 1.5rem;
          background: white;
        }

        .action-buttons-section {
          padding: 1rem 1.5rem;
          background: linear-gradient(135deg, #f8fafc 0%, #edf2f7 100%);
          border-top: 1px solid #e2e8f0;
          display: flex;
          justify-content: space-between;
          align-items: center;
          flex-wrap: wrap;
          gap: 1rem;
        }

        .admin-actions {
          display: flex;
          gap: 0.75rem;
        }

        .action-btn {
          padding: 0.75rem 1.5rem;
          border: none;
          border-radius: 6px;
          cursor: pointer;
          font-size: 0.9rem;
          font-weight: 600;
          transition: all 0.2s ease;
          font-family: 'Noto Sans Sinhala', sans-serif;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          min-width: 140px;
          justify-content: center;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }

        .btn-icon {
          font-size: 1.1rem;
        }

        .btn-text {
          font-size: 0.85rem;
        }

        .update-btn {
          background: linear-gradient(135deg, #2d5016 0%, #38a169 100%);
          color: white;
          border: 1px solid #2d5016;
        }

        .update-btn:hover {
          background: linear-gradient(135deg, #38a169 0%, #48bb78 100%);
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(45, 80, 22, 0.3);
        }

        .delete-btn {
          background: linear-gradient(135deg, #c53030 0%, #e53e3e 100%);
          color: white;
          border: 1px solid #c53030;
        }

        .delete-btn:hover {
          background: linear-gradient(135deg, #e53e3e 0%, #fc8181 100%);
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(197, 48, 48, 0.3);
        }

        .status-info {
          display: flex;
          align-items: center;
          gap: 1rem;
        }

        .record-id {
          font-size: 0.8rem;
          color: #4a5568;
          font-weight: 500;
          padding: 0.3rem 0.8rem;
          background: rgba(26, 54, 93, 0.1);
          border-radius: 12px;
          font-family: 'Roboto', sans-serif;
        }

        .action-section {
          display: flex;
          justify-content: center;
          gap: 1rem;
          margin-top: 2rem;
          padding: 2rem 0;
          border-top: 2px solid #e2e8f0;
          background: #f8fafc;
          border-radius: 8px;
        }

        .gov-button {
          background: linear-gradient(135deg, #1a365d 0%, #2d5016 100%);
          color: white;
          padding: 1rem 2.5rem;
          border: none;
          border-radius: 6px;
          cursor: pointer;
          font-size: 1rem;
          font-weight: 600;
          display: flex;
          align-items: center;
          gap: 0.75rem;
          transition: all 0.3s ease;
          position: relative;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
          font-family: 'Noto Sans Sinhala', sans-serif;
          border: 2px solid transparent;
        }

        .gov-button:hover {
          background: linear-gradient(135deg, #2d5016 0%, #ff6b00 100%);
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
          border-color: #ff6b00;
        }

        .gov-button:active {
          transform: translateY(0);
        }

        .button-icon {
          font-size: 1.1rem;
        }

        .date-info {
          color: #718096;
          font-size: 0.9rem;
          margin-top: 1rem;
          font-family: 'Roboto', sans-serif;
          font-weight: 500;
          text-align: center;
          padding: 0.5rem;
          background: #edf2f7;
          border-radius: 4px;
          border-left: 4px solid #2d5016;
        }

        .official-seal {
          position: absolute;
          top: 1rem;
          right: 1rem;
          width: 60px;
          height: 60px;
          background: linear-gradient(135deg, #1a365d, #2d5016);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-size: 1.5rem;
          border: 3px solid #ff6b00;
          opacity: 0.1;
        }

        @keyframes govSpin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        @media (max-width: 768px) {
          .content-wrapper {
            padding: 2rem 1rem;
          }
          
          .card-content {
            padding: 1.5rem;
          }
          
          .card-header {
            padding: 1rem 1.5rem;
            flex-direction: column;
            gap: 1rem;
            align-items: flex-start;
          }
          
          .gov-button {
            padding: 0.875rem 2rem;
            font-size: 0.9rem;
          }

          .ministry-title {
            font-size: 1.5rem;
          }

          .ministry-subtitle {
            font-size: 1rem;
          }

          .user-actions {
            position: static;
            opacity: 1;
            margin-top: 1rem;
            justify-content: flex-end;
          }

          .action-buttons-section {
            flex-direction: column;
            align-items: stretch;
            gap: 0.75rem;
          }

          .admin-actions {
            justify-content: center;
            flex-wrap: wrap;
          }

          .action-btn {
            font-size: 0.8rem;
            padding: 0.6rem 1.2rem;
            min-width: 120px;
          }

          .btn-text {
            font-size: 0.75rem;
          }

          .status-info {
            justify-content: center;
          }
        }

        .watermark {
          position: fixed;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%) rotate(-45deg);
          font-size: 8rem;
          color: rgba(26, 54, 93, 0.03);
          font-weight: 900;
          z-index: 0;
          pointer-events: none;
          font-family: 'Roboto', sans-serif;
        }
      `}</style>
      
      <div className="government-header">
        <Nav />
      </div>
      
      <div className="sri-lanka-emblem">
        <div className="emblem-icon">🏛️</div>
      </div>
      <div className="watermark">MINISTRY</div>
      
      <div className="content-wrapper">
        <div className="ministry-header">
          <div className="official-seal">⚖️</div>
          <h1 className="ministry-title">හොරණ නගර සභාව</h1>
          <p className="ministry-subtitle">Horana urbern council</p>
          <h2 className="department-title">ක්‍රීඩා භූමි වෙන්කරන ගැනීම</h2>
        </div>

        <div className="official-card">
          <div className="card-header">
            <h2 className="card-title">📊 වෙන්කරන ගැනීම් විශ්ලේෂණය</h2>
            {!loading && users.length > 0 && (
              <div className="gov-badge">
                මුළු වෙන්කරන ගැනීම් {users.length}
              </div>
            )}
          </div>
          
          <div ref={componentsRef} className="card-content">
            {loading ? (
              <div className="loading-container">
                <div className="gov-spinner"></div>
                <p className="loading-text">ඔබේ වෙන්කරන ගැනීම් පූරණය වෙමින්...</p>
              </div>
            ) : users.length === 0 ? (
              <div className="empty-state">
                <div className="empty-icon">🏛️</div>
                <h3 className="empty-title">වෙන්කරන ගැනීම් නොමැත</h3>
                <p className="empty-description">
                  ඔබේ ක්‍රීඩා භූමි වෙන්කරන ගැනීම් පුවරුව සූදානම්.<br/>
                  නව වෙන්කරන ගැනීම් ස්වයංක්‍රීයව මෙහි දිස්වනු ඇත.
                </p>
                <div className="date-info">
                  අද දිනය: {new Date().toLocaleDateString('si-LK')}
                </div>
              </div>
            ) : (
              <>
                <div className="date-info">
                  වාර්තාව සකස් කළ දිනය: {new Date().toLocaleDateString('si-LK')} | 
                  අධ්‍යාපන අමාත්‍යාංශ - නිල වාර්තාව
                </div>
                {users.map((user, i) => (
                  <div key={i} className="user-item">
                    <div className="user-content-wrapper">
                      <User user={user} />
                    </div>
                    <div className="action-buttons-section">
                      <div className="admin-actions">
                        <button 
                          className="action-btn update-btn"
                          onClick={() => handleUpdate(user)}
                          title="යාවත්කාලීන කරන්න"
                        >
                          <span className="btn-icon">✏️</span>
                          <span className="btn-text">සංස්කරණය කරන්න</span>
                        </button>
                        <button 
                          className="action-btn delete-btn"
                          onClick={() => handleDelete(user)}
                          title="ඉවත් කරන්න"
                        >
                          <span className="btn-icon">🗑️</span>
                          <span className="btn-text">ඉවත් කරන්න</span>
                        </button>
                      </div>
                      <div className="status-info">
                        <span className="record-id">වාර්තා අංකය: #{i + 1}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </>
            )}
          </div>
        </div>

        {!loading && users.length > 0 && (
          <div className="action-section">
            <button
              className="gov-button"
              onClick={handlePrint}
              onMouseEnter={() => setHoveredButton(true)}
              onMouseLeave={() => setHoveredButton(false)}
            >
              <span className="button-icon">📄</span>
              වාර්තාව සකස් කරන්න
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default Users;