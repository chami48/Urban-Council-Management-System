import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { useReactToPrint } from "react-to-print";

const URL = "http://localhost:5000/assessments";

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

  const handlePrinter = useReactToPrint({
    content: () => componentsRef.current,
    documentTitle: "Assessment Report",
    onAfterPrint: () => alert("Assessment Report Successfully Downloaded!"),
  });

  const handleSearch = () => {
    if (!searchQuery.trim()) {
      loadAssessments();
      return;
    }
    fetchHandler().then((data) => {
      const filtered = (data.assessments || []).filter((assessment) =>
        Object.values(assessment).some((field) =>
          field?.toString().toLowerCase().includes(searchQuery.toLowerCase())
        )
      );
      setAssessments(filtered);
      setNoResults(filtered.length === 0);
    });
  };

  return (
    <div className="assessments-container">
      {/* Search Section */}
      <div className="search-section">
        <div className="search-container">
          <input
            onChange={(e) => setSearchQuery(e.target.value)}
            value={searchQuery}
            type="text"
            placeholder="Search Assessment Details"
            className="search-input"
          />
          <button onClick={handleSearch} className="btn btn-search">
            Search
          </button>
        </div>
      </div>

      {/* Results Section */}
      {noResults ? (
        <div className="no-results">
          <p>No Assessments Found</p>
        </div>
      ) : (
        <div ref={componentsRef} className="assessments-grid">
          <table className="assessments-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Assessment No</th>
                <th>Division</th>
                <th>Street</th>
                <th>Property No</th>
                <th>Owner</th>
                <th>NIC</th>
                <th>Contact</th>
                <th>Value</th>
                <th>Tax Rate</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {assessments.map((a, i) => (
                <tr key={a._id || i}>
                  <td>{i + 1}</td>
                  <td>{a.assessmentNo}</td>
                  <td>{a.division}</td>
                  <td>{a.street}</td>
                  <td>{a.propertyNo}</td>
                  <td>{a.ownerName}</td>
                  <td>{a.ownerNIC}</td>
                  <td>{a.contactNo}</td>
                  <td>{a.appraisedValue}</td>
                  <td>{a.taxRate}%</td>
                  <td>{a.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Print Button */}
      <button onClick={handlePrinter} className="btn btn-print">
        Print Report
      </button>
    </div>
  );
}

export default Assessments;
