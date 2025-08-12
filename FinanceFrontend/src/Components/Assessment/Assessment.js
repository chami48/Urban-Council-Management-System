import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { useReactToPrint } from "react-to-print";

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

  const handleSendReport = () => {
    const phoneNumber = "+94727663031";
    const message = "Selected Assessment Reports";
    const whatsappUrl = `https://web.whatsapp.com/send?phone=${phoneNumber}&text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, "_blank");
  };

  return (
    <div className="assessments-container">
      <div className="search-section">
        <div className="search-container">
          <input
            onChange={(e) => setSearchQuery(e.target.value)}
            value={searchQuery}
            type="text"
            name="search"
            placeholder="Search Assessment Details"
            className="search-input"
          />
          <button onClick={handleSearch} className="btn btn-search">
            Search
          </button>
          <button onClick={handlePrinter} className="btn btn-download">
            Download Report
          </button>
        </div>
      </div>

      {noResults ? (
        <div className="no-results">
          <p>No Assessments Found</p>
        </div>
      ) : (
        <div ref={componentsRef} className="assessments-grid">
          {assessments.map((assessment, i) => (
            <div key={i} className="assessment-item">
              <pre>{JSON.stringify(assessment, null, 2)}</pre>
            </div>
          ))}
        </div>
      )}

      <button onClick={handleSendReport} className="whatsapp-floating-btn">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
          <path d="M17.472 14.382c-..." />
        </svg>
      </button>
    </div>
  );
}

export default Assessments;