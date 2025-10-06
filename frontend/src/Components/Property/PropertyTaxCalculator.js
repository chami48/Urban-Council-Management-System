// src/Components/Property/TaxCalculationEnglish.js
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import Nav from "../Nav/Nav";

function TaxCalculationEnglish() {
  const { propertyNo, part1, part2 } = useParams();
  const navigate = useNavigate();

  const actualPropertyNo = propertyNo
    ? decodeURIComponent(propertyNo)
    : part1 && part2
    ? `${part1}/${part2}`
    : part1 || "";

  const [property, setProperty] = useState(null);
  const [assessment, setAssessment] = useState(null);
  const [taxDetails, setTaxDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      if (!actualPropertyNo) return;
      setLoading(true);
      setError(null);

      try {
        const encodedPropertyNo = encodeURIComponent(actualPropertyNo);

        const propertyRes = await axios.get(
          `http://localhost:5000/properties/propertyNo/${encodedPropertyNo}`
        );
        setProperty(propertyRes.data?.property || null);

        const assessmentRes = await axios.get(
          `http://localhost:5000/assessments/propertyNo/${encodedPropertyNo}`
        );
        setAssessment(assessmentRes.data?.assessment || null);

        const taxRes = await axios.get(
          `http://localhost:5000/calculateTax/${encodedPropertyNo}`
        );
        setTaxDetails(taxRes.data || null);
      } catch (err) {
        console.error("Error fetching data:", err);
        setError("Failed to load data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [actualPropertyNo]);

  if (loading) {
    return (
      <div>
        <Nav />
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <p className="text-center text-gray-500 text-lg">⏳ Loading...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <Nav />
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <p className="text-center text-red-500 text-lg">❌ {error}</p>
        </div>
      </div>
    );
  }

  const handleProceedToPay = () => {
    const year = new Date().getFullYear();
    const quarter = Math.ceil((new Date().getMonth() + 1) / 3);
    navigate(
      `/payment-details/${encodeURIComponent(actualPropertyNo)}/${year}/${quarter}`
    );
  };

  return (
    <div>
      <Nav />
      <div className="min-h-screen bg-gray-50 flex flex-col items-center py-10 px-4">
        <div className="w-full max-w-3xl">
          <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">
            🏠 Property Tax Bill Summary
          </h2>

          {/* Property Information */}
          {property && (
            <div className="bg-white shadow-lg rounded-2xl p-6 mb-6 border border-gray-200">
              <h3 className="text-xl font-semibold text-indigo-600 mb-4">
                Property Information
              </h3>
              <p className="mb-2">
                <b>Property No:</b> {property.propertyNo}
              </p>
              <p className="mb-2">
                <b>Division:</b> {property.division?.en || "-"}
              </p>
              <p className="mb-2">
                <b>Street:</b> {property.street?.en || "-"}
              </p>
            </div>
          )}

          {/* Owner & Assessment Info */}
          {assessment && (
            <div className="bg-white shadow-lg rounded-2xl p-6 mb-6 border border-gray-200">
              <h3 className="text-xl font-semibold text-indigo-600 mb-4">
                Owner & Assessment Details
              </h3>
              <p className="mb-2">
                <b>Owner:</b> {assessment.ownerName || "-"}
              </p>
              <p className="mb-2">
                <b>NIC:</b> {assessment.ownerNIC || "-"}
              </p>
              <p className="mb-2">
                <b>Contact:</b> {assessment.contactNo || "-"}
              </p>
              <p className="mb-2">
                <b>Property Type:</b> {assessment.propertyType || "-"}
              </p>
            </div>
          )}

          {/* Tax Summary */}
          {taxDetails && (
            <div className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-2xl shadow-lg p-6 mb-6">
              <h3 className="text-lg font-semibold mb-4">Payment Summary</h3>
              <p className="mb-2">
                Annual Tax: LKR {taxDetails.annualTax?.toLocaleString() || "0"}
              </p>
              <p className="mb-2">
                Discount: -LKR {taxDetails.discount?.toLocaleString() || "0"}
              </p>
              <p className="mb-2">
                Fine: +LKR {taxDetails.fine?.toLocaleString() || "0"}
              </p>
              <p className="text-2xl font-bold mt-4">
                Total Payable: LKR {taxDetails.payableAmount?.toLocaleString() || "0"}
              </p>
            </div>
          )}

          {/* Quarter Breakdown */}
          {taxDetails?.quarters && taxDetails.quarters.length > 0 && (
            <div className="bg-white shadow-lg rounded-2xl p-6 border border-gray-200 mb-6">
              <h3 className="text-lg font-semibold mb-4 text-indigo-600">
                Quarter Breakdown
              </h3>
              {taxDetails.quarters.map((q) => (
                <div
                  key={q.quarter}
                  className={`p-4 mb-3 rounded-lg ${
                    q.status === "Paid"
                      ? "bg-green-100"
                      : q.status === "Overdue"
                      ? "bg-red-100"
                      : "bg-yellow-100"
                  }`}
                >
                  <p className="font-semibold mb-2">
                    <b>Quarter {q.quarter}</b> (Due: {new Date(q.dueDate).toLocaleDateString()})
                  </p>
                  <p className="text-sm mb-1">
                    Base Amount: LKR {q.baseAmount?.toLocaleString() || "0"}
                  </p>
                  <p className="text-sm mb-1">
                    Paid: LKR {q.paidAmount?.toLocaleString() || "0"}
                  </p>
                  <p className="text-sm mb-1">
                    Remaining Due: LKR {q.remainingDue?.toLocaleString() || "0"}
                  </p>
                  <p className="text-sm mb-1">
                    Fine: LKR {q.fine?.toLocaleString() || "0"}
                  </p>
                  <p className="text-sm font-semibold mt-2">
                    Status: {q.status}
                  </p>
                </div>
              ))}
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-4 justify-center">
            <button
              onClick={() => navigate(-1)}
              className="px-6 py-3 bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold rounded-xl shadow-md transition transform hover:scale-105"
            >
              ← Back
            </button>
            <button
              onClick={() => {/* Add payment history navigation */}}
              className="px-6 py-3 bg-amber-500 hover:bg-amber-600 text-white font-semibold rounded-xl shadow-md transition transform hover:scale-105"
            >
              📊 Payment History
            </button>
            <button
              onClick={handleProceedToPay}
              className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl shadow-md transition transform hover:scale-105"
            >
              💳 Confirm Payment
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TaxCalculationEnglish;