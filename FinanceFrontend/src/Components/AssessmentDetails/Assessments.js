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
    <div>
      <AdminNav/>
    
    <div className="assessments-container">
      <div className="header-section">
        <h1 className="header-title">Property Assessments</h1>
        <p className="header-subtitle">
          Manage and view all property assessment records
        </p>
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
       
      </div>

      {noResults ? (
        <div className="no-results">
          <p>No Assessments Found</p>
        </div>
      ) : (
        <div ref={componentsRef} className="table-wrapper">
          <table className="assessment-table">
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
                <tr key={a._id}>
                  <td>{index + 1}</td>
                  <td>{a.assessmentNo}</td>
                  <td>{a.division}</td>
                  <td>{a.street}</td>
                  <td>{a.propertyNo}</td>
                  <td>{a.ownerName}</td>
                  <td>{a.ownerNIC}</td>
                  <td>{a.contactNo}</td>
                  <td>{a.description}</td>
                  <td>{a.propertyType}</td>
                  <td>Rs.{a.appraisedValue}.00</td>
                  <td>{a.taxRate}%</td>
                  <td>
                    <span className={`status-badge ${getStatusClass(a.status)}`}>
                      {a.status}
                    </span>
                  </td>
                  <td>
                    <button
                      className="btn btn-update"
                      onClick={() => handleUpdate(a._id)}
                    >
                      ✏️ Update
                    </button>
                    <button
                      className="btn btn-delete"
                      onClick={() => handleDelete(a._id)}
                    >
                      🗑️ Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
    </div>
  );
}

export default Assessments;
