// src/Components/Property/Home.js
import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import Nav from "../Nav/Nav";

function Home() {
  const navigate = useNavigate();
  const location = useLocation();

  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);

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
            const assessment = assessRes.data.assessment || null;

            let propertyPayments = [];
            if (assessment?.ownerNIC) {
              const payRes = await axios.get(
                `http://localhost:5000/api/payment/history/${assessment.ownerNIC}`
              );
              propertyPayments = payRes.data.filter(
                (p) =>
                  p.propertyNo === prop.propertyNo &&
                  p.paymentType === "property_tax"
              );
            }

            return { ...prop, assessment, payments: propertyPayments };
          } catch {
            return { ...prop, assessment: null, payments: [] };
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

  useEffect(() => {
    fetchPropertiesWithAssessments();
  }, []);

  useEffect(() => {
    if (location.state?.property) {
      const newProperty = location.state.property;
      setProperties((prev) => {
        const exists = prev.some(
          (p) => p.propertyNo === newProperty.propertyNo
        );
        if (exists) return prev;
        return [...prev, newProperty];
      });
    }
  }, [location.state]);

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

  if (loading)
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-blue-700 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-orange-500 mx-auto mb-4"></div>
          <p className="text-white text-xl font-medium">Loading properties...</p>
        </div>
      </div>
    );

  return (
    <>
      <Nav />
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-slate-50 to-blue-100 py-8 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-5xl md:text-6xl font-black bg-gradient-to-r from-blue-900 via-blue-800 to-blue-600 bg-clip-text text-transparent mb-6 tracking-tight">
              My Property
            </h2>
            <p className="text-lg text-slate-600 mb-8 max-w-2xl mx-auto leading-relaxed">
              Manage your property portfolio with ease. Track assessments,
              payments, and property details all in one place.
            </p>
            <button
              className="group relative inline-flex items-center justify-center px-8 py-4 text-lg font-semibold text-white transition-all duration-300 bg-gradient-to-r from-orange-500 to-orange-600 rounded-full hover:from-orange-600 hover:to-orange-700 hover:scale-105 hover:shadow-xl hover:shadow-orange-500/25 focus:outline-none focus:ring-4 focus:ring-orange-500/50"
              onClick={() => navigate("/addproperty")}
            >
              <span className="relative flex items-center">
                <svg
                  className="w-5 h-5 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 4v16m8-8H4"
                  />
                </svg>
                Add New Property
              </span>
            </button>
          </div>

          {properties.length === 0 ? (
            <div className="max-w-2xl mx-auto text-center py-16">
              <div className="bg-white rounded-3xl shadow-xl p-12 border border-blue-100">
                <div className="text-8xl mb-6 opacity-40">🏠</div>
                <h3 className="text-2xl font-bold text-blue-900 mb-4">
                  No Properties Yet
                </h3>
                <p className="text-slate-600 text-lg">No property to display</p>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
              {properties.map((prop, index) => {
                const assessment = prop.assessment;
                const hasPayments =
                  prop.payments && prop.payments.length > 0;
                const annualTax = assessment
                  ? (
                      (assessment.appraisedValue * assessment.taxRate) /
                      100
                    ).toLocaleString()
                  : "-";

                return (
                  <div
                    key={index}
                    className="group bg-white rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 border border-blue-100 overflow-hidden"
                  >
                    {/* Header */}
                    <div className="relative bg-gradient-to-br from-blue-900 via-blue-800 to-blue-700 p-6 text-white overflow-hidden">
                      <div className="relative z-10 flex justify-between items-center">
                        <span className="text-xl font-bold tracking-wide flex items-center">
                          🏠 Property {prop.propertyNo}
                        </span>
                      </div>
                    </div>

                    {/* Body */}
                    <div className="p-6 space-y-4">
                      <p>
                        <strong>Owner:</strong>{" "}
                        {assessment?.ownerName || "-"}
                      </p>
                      <p>
                        <strong>Branch/Div/Street:</strong> {prop.branch},{" "}
                        {prop.division}, {prop.street}
                      </p>
                      <p>
                        <strong>Description:</strong>{" "}
                        {assessment?.description || "-"}
                      </p>

                      <div className="grid grid-cols-2 gap-3 mt-6">
                        <div className="bg-blue-50 rounded-xl p-4 text-center border">
                          <p className="text-xs text-blue-600 uppercase">
                            Appraised Value
                          </p>
                          <p className="text-lg font-bold text-blue-900">
                            {assessment?.appraisedValue
                              ? `LKR ${assessment.appraisedValue}`
                              : "-"}
                          </p>
                        </div>
                        <div className="bg-orange-50 rounded-xl p-4 text-center border">
                          <p className="text-xs text-orange-600 uppercase">
                            Annual Tax
                          </p>
                          <p className="text-lg font-bold text-orange-800">
                            {annualTax ? `LKR ${annualTax}` : "-"}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="p-6 bg-blue-50 border-t flex flex-col gap-3">
                      {/* 🚫 If no assessment */}
                      {!assessment && (
                        <p className="text-red-600 font-semibold text-center">
                          ⚠️ Assessment is not decided yet!
                        </p>
                      )}

                      {/* ✅ If assessment exists but no payments */}
                      {assessment && !hasPayments && (
                        <button
                          className="bg-gradient-to-r from-blue-600 to-blue-700 text-white py-3 px-4 rounded-xl font-semibold text-sm hover:scale-105"
                          onClick={() =>
                            navigate(`/propertyTaxCalculation/${prop.propertyNo}`)
                          }
                        >
                          View / Payment
                        </button>
                      )}

                      {/* 💰 If payments exist */}
                      {hasPayments && (
                        <div className="bg-green-50 p-3 rounded-lg border border-green-200">
                          <p className="text-green-700 font-semibold mb-2">
                            ✅ Tax Paid
                          </p>
                          <ul className="text-sm text-gray-700">
                            {prop.payments.map((p) => (
                              <li key={p._id}>
                                Rs. {p.amount} –{" "}
                                {new Date(p.paymentDate).toLocaleDateString(
                                  "en-GB"
                                )}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      <button
                        className="bg-gradient-to-r from-orange-500 to-orange-600 text-white py-3 px-4 rounded-xl font-semibold text-sm hover:scale-105"
                        onClick={() => handleRemove(prop.propertyNo, index)}
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
