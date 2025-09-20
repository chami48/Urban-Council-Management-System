import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import Nav from "../Nav/Nav";

function Home() {
  const navigate = useNavigate();
  const location = useLocation();

  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch properties and their assessments
  const fetchPropertiesWithAssessments = async () => {
    try {
      setLoading(true);
      const propRes = await axios.get("http://localhost:5000/properties");
      const propertiesData = propRes.data.properties;

      const combinedData = await Promise.all(
        propertiesData.map(async (prop) => {
          try {
            const assessRes = await axios.get(
              `http://localhost:5000/assessments/propertyNo/${encodeURIComponent(
                prop.propertyNo
              )}`
            );
            return {
              ...prop,
              assessment: assessRes.data.assessment || null,
            };
          } catch {
            return { ...prop, assessment: null };
          }
        })
      );

      setProperties(combinedData);
    } catch (err) {
      console.error("Error fetching properties:", err);
    } finally {
      setLoading(false);
    }
  };

  // Initial load
  useEffect(() => {
    fetchPropertiesWithAssessments();
  }, []);

  // Add property if navigated from PropertyAssessmentDetails
  useEffect(() => {
    if (location.state?.property) {
      const newProperty = location.state.property;
      setProperties((prev) => {
        const exists = prev.some((p) => p.propertyNo === newProperty.propertyNo);
        if (exists) return prev;
        return [...prev, newProperty];
      });
    }
  }, [location.state]);

  // ✅ Remove property (delete from DB + update state)
  const handleRemove = async (propertyNo, index) => {
    try {
      await axios.delete(
        `http://localhost:5000/properties/propertyNo/${encodeURIComponent(
          propertyNo
        )}`
      );
      setProperties((prev) => prev.filter((_, i) => i !== index));
      alert("Property removed successfully!");
    } catch (err) {
      console.error("Error deleting property:", err);
      alert("Failed to delete property. Please try again.");
    }
  };

  if (loading) return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-blue-700 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-orange-500 mx-auto mb-4"></div>
        <p className="text-white text-xl font-medium">Loading properties...</p>
      </div>
    </div>
  );

  return (
    <>
      <Nav /> {/* Navigation bar at the top */}

      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-slate-50 to-blue-100 py-8 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Header Section */}
          <div className="text-center mb-12">
            <h2 className="text-5xl md:text-6xl font-black bg-gradient-to-r from-blue-900 via-blue-800 to-blue-600 bg-clip-text text-transparent mb-6 tracking-tight">
              My Property
            </h2>
            <p className="text-lg text-slate-600 mb-8 max-w-2xl mx-auto leading-relaxed">
              Manage your property portfolio with ease. Track assessments, payments, and property details all in one place.
            </p>

            <button
              className="group relative inline-flex items-center justify-center px-8 py-4 text-lg font-semibold text-white transition-all duration-300 bg-gradient-to-r from-orange-500 to-orange-600 rounded-full hover:from-orange-600 hover:to-orange-700 hover:scale-105 hover:shadow-xl hover:shadow-orange-500/25 focus:outline-none focus:ring-4 focus:ring-orange-500/50"
              onClick={() => navigate("/addproperty")}
            >
              <span className="absolute inset-0 w-full h-full transition duration-300 ease-out transform translate-x-1 translate-y-1 bg-gradient-to-r from-orange-600 to-orange-700 rounded-full group-hover:translate-x-0 group-hover:translate-y-0"></span>
              <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-orange-500 to-orange-600 rounded-full"></span>
              <span className="relative flex items-center">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Add New Property
              </span>
            </button>
          </div>

          {properties.length === 0 ? (
            <div className="max-w-2xl mx-auto text-center py-16">
              <div className="bg-white rounded-3xl shadow-xl p-12 border border-blue-100">
                <div className="text-8xl mb-6 opacity-40">🏠</div>
                <h3 className="text-2xl font-bold text-blue-900 mb-4">No Properties Yet</h3>
                <p className="text-slate-600 text-lg">No property to display</p>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
              {properties.map((prop, index) => {
                const assessment = prop.assessment;
                const annualTax = assessment
                  ? (
                      (assessment.appraisedValue * assessment.taxRate) /
                      100
                    ).toLocaleString()
                  : "-";

                const getStatusStyles = (status) => {
                  switch(status) {
                    case 'APPROVED': return 'bg-green-100 text-green-800 border-green-200';
                    case 'PENDING': return 'bg-orange-100 text-orange-800 border-orange-200';
                    case 'REJECTED': return 'bg-red-100 text-red-800 border-red-200';
                    default: return 'bg-slate-100 text-slate-600 border-slate-200';
                  }
                };

                return (
                  <div className="group bg-white rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 border border-blue-100 overflow-hidden" key={index}>
                    {/* Property Header */}
                    <div className="relative bg-gradient-to-br from-blue-900 via-blue-800 to-blue-700 p-6 text-white overflow-hidden">
                      <div className="absolute inset-0 bg-black/10"></div>
                      <div className="absolute -top-4 -right-4 w-24 h-24 bg-white/10 rounded-full blur-xl"></div>
                      <div className="relative z-10 flex justify-between items-center">
                        <span className="text-xl font-bold tracking-wide flex items-center">
                          <svg className="w-6 h-6 mr-2" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z"/>
                          </svg>
                          Property {prop.propertyNo}
                        </span>
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getStatusStyles(assessment?.status || "UNASSESSED")}`}>
                          {assessment?.status || "UNASSESSED"}
                        </span>
                      </div>
                    </div>

                    {/* Property Body */}
                    <div className="p-6 space-y-4">
                      <div className="space-y-3">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white text-sm">
                            👤
                          </div>
                          <div>
                            <p className="text-xs text-slate-500 uppercase tracking-wider font-medium">Owner</p>
                            <p className="font-semibold text-blue-900">
                              {assessment?.ownerName || "-"}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-orange-600 rounded-full flex items-center justify-center text-white text-sm">
                            📍
                          </div>
                          <div>
                            <p className="text-xs text-slate-500 uppercase tracking-wider font-medium">Branch/Div/Street</p>
                            <p className="font-semibold text-blue-900">
                              {prop.branch}, {prop.division}, {prop.street}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-700 rounded-full flex items-center justify-center text-white text-sm">
                            📝
                          </div>
                          <div>
                            <p className="text-xs text-slate-500 uppercase tracking-wider font-medium">Description</p>
                            <p className="font-semibold text-blue-900">
                              {assessment?.description || "-"}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Value Cards */}
                      <div className="grid grid-cols-2 gap-3 mt-6">
                        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-4 text-center border border-blue-200">
                          <p className="text-xs text-blue-600 uppercase tracking-wider font-medium mb-1">Appraised Value</p>
                          <p className="text-lg font-bold text-blue-900">
                            {assessment?.appraisedValue
                              ? `LKR ${assessment.appraisedValue}`
                              : "-"}
                          </p>
                        </div>
                        <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl p-4 text-center border border-orange-200">
                          <p className="text-xs text-orange-600 uppercase tracking-wider font-medium mb-1">Annual Tax</p>
                          <p className="text-lg font-bold text-orange-800">
                            {annualTax ? `LKR ${annualTax}` : "-"}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Property Actions */}
                    <div className="p-6 bg-blue-50 border-t border-blue-100 flex gap-3">
                      <button
                        className={`flex-1 py-3 px-4 rounded-xl font-semibold text-sm transition-all duration-300 ${
                          assessment 
                            ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white hover:from-blue-700 hover:to-blue-800 hover:shadow-lg hover:shadow-blue-500/25 hover:scale-105' 
                            : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                        }`}
                        onClick={() =>
                          navigate(`/propertyTaxCalculation/${prop.propertyNo}`)
                        }
                        disabled={!assessment}
                        style={{
                          cursor: assessment ? "pointer" : "not-allowed",
                          opacity: assessment ? 1 : 0.5,
                        }}
                      >
                        View / Payment
                      </button>

                      <button
                        className="bg-gradient-to-r from-orange-500 to-orange-600 text-white py-3 px-4 rounded-xl font-semibold text-sm transition-all duration-300 hover:from-orange-600 hover:to-orange-700 hover:shadow-lg hover:shadow-orange-500/25 hover:scale-105"
                        onClick={() =>
                          handleRemove(prop.propertyNo, index)
                        }
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default Home;