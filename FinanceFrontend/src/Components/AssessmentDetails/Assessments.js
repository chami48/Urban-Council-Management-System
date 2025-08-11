import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { useReactToPrint } from "react-to-print";
import "./Assessments.css";

const URL = "http://localhost:5001/assessments";

const fetchHandler = async () => {
  try {
    const res = await axios.get(URL);
    return res.data; // backend returns { assessments: [...] }
  } catch (err) {
    console.error("Error fetching assessments:", err);
    return { assessments: [] };
  }
};

function Assessments() {
  const [assessments, setAssessments] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [noResults, setNoResults] = useState(false);
  const componentsRef = useRef();

  useEffect(() => {
    loadAssessments();
  }, []);

  const loadAssessments = () => {
    fetchHandler().then((data) => {
      setAssessments(data.assessments || []);
      setNoResults((data.assessments || []).length === 0);
    });
  };

  // 🗑 Delete Handler
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this assessment?")) return;
    try {
      await axios.delete(`${URL}/${id}`);
      loadAssessments();
    } catch (err) {
      console.error("Error deleting assessment:", err);
    }
  };

  // ✏ Update Handler (redirect or popup)
  const handleUpdate = (id) => {
    window.location.href = `/updateassessment/${id}`;
    // You can replace with navigate() if using react-router's useNavigate
  };

  const handlePrinter = useReactToPrint({
    content: () => componentsRef.current,
    documentTitle: "Property Assessment Report",
    onAfterPrint: () => alert("Report Downloaded!"),
  });

  const handleSearch = () => {
    if (!searchQuery.trim()) {
      loadAssessments();
      return;
    }
    fetchHandler().then((data) => {
      const filtered = (data.assessments || []).filter((item) =>
        Object.values(item).some((field) =>
          field?.toString().toLowerCase().includes(searchQuery.toLowerCase())
        )
      );
      setAssessments(filtered);
      setNoResults(filtered.length === 0);
    });
  };

  // Helper function to get status class
  const getStatusClass = (status) => {
    switch (status?.toLowerCase()) {
      case 'active': return 'status-active';
      case 'pending': return 'status-pending';
      case 'inactive': return 'status-inactive';
      default: return 'status-pending';
    }
  };

  return (
    <div className="assessments-container">
      {/* Header Section */}
      <div className="header-section">
        <h1 className="header-title">Property Assessments</h1>
        <p className="header-subtitle">Manage and view all property assessment records</p>
      </div>

      <div className="search-section">
        <input
          onChange={(e) => setSearchQuery(e.target.value)}
          value={searchQuery}
          type="text"
          placeholder="🔍 Search assessments by any field..."
          className="search-input"
        />
        <button onClick={handleSearch} className="btn btn-search">
          Search
        </button>
        <button onClick={handlePrinter} className="btn btn-download">
          📄 Download Report
        </button>
      </div>

      {noResults ? (
        <div className="no-results">
          <p>No Assessments Found</p>
        </div>
      ) : (
        <div ref={componentsRef} className="assessments-list">
          {assessments.map((a) => (
            <div key={a._id} className="assessment-item">
              <strong>{a.assessmentNo}</strong>
              <div className="assessment-details">
                <div className="detail-row">
                  <span className="detail-label">Owner:</span>
                  <span className="detail-value">{a.ownerName}</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Property:</span>
                  <span className="detail-value">{a.propertyType}</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Division:</span>
                  <span className="detail-value">{a.division}</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Street:</span>
                  <span className="detail-value">{a.street}</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Property No:</span>
                  <span className="detail-value">{a.propertyNo}</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Annual Value:</span>
                  <span className="detail-value">Rs.{a.annualValue}.00</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Tax Rate:</span>
                  <span className="detail-value">{a.taxRate}%</span>
                </div>
              </div>
              <span className={`status-badge ${getStatusClass(a.status)}`}>
                {a.status}
              </span>
              <div className="actions">
                <button className="btn btn-update" onClick={() => handleUpdate(a._id)}>
                  ✏️ Update
                </button>
                <button className="btn btn-delete" onClick={() => handleDelete(a._id)}>
                  🗑️ Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Assessments;