import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import "./Assessments.css";
import AdminNav from "../AdminNav/AdminNav"; 

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

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this assessment?")) return;
    try {
      await axios.delete(`${URL}/${id}`);
      loadAssessments();
    } catch (err) {
      console.error("Error deleting assessment:", err);
    }
  };

  const handleUpdate = (id) => {
    window.location.href = `/updateassessment/${id}`;
  };

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

  const getStatusClass = (status) => {
    switch (status?.toLowerCase()) {
      case "ක්‍රියාකාරී":
      case "active":
        return "status-active";
      case "අක්‍රිය":
      case "inactive":
        return "status-inactive";
      default:
        return "status-pending";
    }
  };

  return (
    <div className="assessments-page">
      <AdminNav/>
      
      <div className="assessments-container">
        {/* Header Section */}
        <div className="header-section">
          <div className="header-content">
            <div className="header-icon">
              <svg className="icon-building" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-4m-5 0H9m0 0H5m4 0v-2.5M9 13h2m-2 3h2m2-6V7a2 2 0 012-2h2a2 2 0 012 2v2M7 7V5a2 2 0 012-2h2a2 2 0 012 2v2" />
              </svg>
            </div>
            <div className="header-text">
              <h1 className="header-title">Property Assessments</h1>
              <p className="header-subtitle">Manage and view all property assessment records</p>
            </div>
          </div>
          
          <div className="header-status">
            <div className="status-item">
              <div className="live-indicator"></div>
              <span>Live Data</span>
            </div>
            <div className="status-item">
              <svg className="icon-clock" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>Updated just now</span>
            </div>
          </div>
        </div>

        {/* Search Section */}
        <div className="search-card">
          <div className="search-content">
            <div className="search-input-container">
              <svg className="search-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                onChange={(e) => setSearchQuery(e.target.value)}
                value={searchQuery}
                type="text"
                placeholder="Search assessments by any field..."
                className="search-input"
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              />
            </div>
            <button onClick={handleSearch} className="search-button">
              Search
            </button>
          </div>
        </div>

        {/* Results Section */}
        {noResults ? (
          <div className="no-results-card">
            <div className="no-results-icon">
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h3 className="no-results-title">No Assessments Found</h3>
            <p className="no-results-subtitle">Try adjusting your search criteria or check back later.</p>
          </div>
        ) : (
          <div ref={componentsRef} className="table-card">
            {/* Stats Header */}
            <div className="table-header">
              <div className="stats-section">
                <span className="total-count">
                  Total Assessments: <span className="count-number">{assessments.length}</span>
                </span>
                <div className="legend">
                  <div className="legend-item">
                    <div className="legend-dot active"></div>
                    <span>Active</span>
                  </div>
                  <div className="legend-item">
                    <div className="legend-dot inactive"></div>
                    <span>Inactive</span>
                  </div>
                  <div className="legend-item">
                    <div className="legend-dot pending"></div>
                    <span>Pending</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Table */}
            <div className="table-wrapper">
              <table className="modern-table">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Assessment No</th>
                    <th>Division</th>
                    <th>Street</th>
                    <th>Property No</th>
                    <th>Owner Name</th>
                    <th>Owner NIC</th>
                    <th>Contact No</th>
                    <th>Description</th>
                    <th>Property Type</th>
                    <th>Appraised Value</th>
                    <th>Tax Rate</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {assessments.map((a, index) => (
                    <tr key={a._id} className="table-row">
                      <td className="row-number">{index + 1}</td>
                      <td className="assessment-no">{a.assessmentNo}</td>
                      <td>{a.division}</td>
                      <td>{a.street}</td>
                      <td>{a.propertyNo}</td>
                      <td className="owner-name">{a.ownerName}</td>
                      <td className="nic-number">{a.ownerNIC}</td>
                      <td>{a.contactNo}</td>
                      <td className="description" title={a.description}>{a.description}</td>
                      <td>
                        <span className="property-type-badge">
                          {a.propertyType}
                        </span>
                      </td>
                      <td className="appraised-value">Rs.{a.appraisedValue}.00</td>
                      <td className="tax-rate">{a.taxRate}%</td>
                      <td>
                        <span className={`status-badge ${getStatusClass(a.status)}`}>
                          {a.status}
                        </span>
                      </td>
                      <td>
                        <div className="action-buttons">
                          <button
                            className="btn-update"
                            onClick={() => handleUpdate(a._id)}
                          >
                            <svg className="btn-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                            Update
                          </button>
                          <button
                            className="btn-delete"
                            onClick={() => handleDelete(a._id)}
                          >
                            <svg className="btn-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Assessments;