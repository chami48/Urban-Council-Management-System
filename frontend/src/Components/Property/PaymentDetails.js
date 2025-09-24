import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import Nav from "../Nav/Nav";

export default function PaymentDetailsPage() {
  const { propertyNo } = useParams();
  const [propertyData, setPropertyData] = useState(null);
  const [assessmentData, setAssessmentData] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const encodedNo = encodeURIComponent(propertyNo);

        const propRes = await axios.get(
          `http://localhost:5000/properties/propertyNo/${encodedNo}`
        );
        setPropertyData(propRes.data?.property || null);

        const assessRes = await axios.get(
          `http://localhost:5000/assessments/propertyNo/${encodedNo}`
        );
        setAssessmentData(assessRes.data?.assessment || null);
      } catch (err) {
        console.error("Error fetching property/assessment:", err);
      }
    };

    if (propertyNo) {
      fetchData();
    }
  }, [propertyNo]);

  if (!propertyData)
    return (
      <p className="text-center text-gray-500">Loading property details...</p>
    );

  let annualTax = 0;
  let quarterlyTax = 0;
  if (assessmentData) {
    annualTax = (assessmentData.appraisedValue * assessmentData.taxRate) / 100;
    quarterlyTax = annualTax / 4;
  }

  const handleProceedToPay = () => {
    const year = new Date().getFullYear();
    const quarter = Math.ceil((new Date().getMonth() + 1) / 3);

    navigate(
      `/payment?paymentType=property_tax&propertyNo=${encodeURIComponent(
        propertyNo
      )}&year=${year}&quarter=${quarter}`
    );
  };

  return (
    <div>
      <Nav />
      <div className="min-h-screen bg-gray-50 flex flex-col items-center py-10 px-4">
        <div className="w-full max-w-3xl">
          <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">
            🏠 Property Tax Payment
          </h2>

          {/* Property Details */}
          <div className="bg-white shadow-lg rounded-2xl p-6 mb-6 border border-gray-200">
            <h3 className="text-xl font-semibold text-indigo-600 mb-4">
              Property Information
            </h3>
            <div className="space-y-2 text-gray-700">
              <p>
                <b>Property No:</b> {propertyData.propertyNo}
              </p>
              <p>
                <b>Branch:</b> {propertyData.branch?.en || "-"} |{" "}
                {propertyData.branch?.si || "-"} |{" "}
                {propertyData.branch?.ta || "-"}
              </p>
              <p>
                <b>Division:</b> {propertyData.division?.en || "-"} |{" "}
                {propertyData.division?.si || "-"} |{" "}
                {propertyData.division?.ta || "-"}
              </p>
              <p>
                <b>Street:</b> {propertyData.street?.en || "-"} |{" "}
                {propertyData.street?.si || "-"} |{" "}
                {propertyData.street?.ta || "-"}
              </p>
            </div>
          </div>

          {/* Assessment / Owner Details */}
          {assessmentData ? (
            <div className="bg-white shadow-lg rounded-2xl p-6 mb-6 border border-gray-200">
              <h3 className="text-xl font-semibold text-indigo-600 mb-4">
                Owner & Assessment Info
              </h3>
              <div className="grid grid-cols-2 gap-y-2 text-gray-700">
                <p>
                  <b>Owner Name:</b> {assessmentData.ownerName}
                </p>
                <p>
                  <b>NIC:</b> {assessmentData.ownerNIC}
                </p>
                <p>
                  <b>Contact:</b> {assessmentData.contactNo}
                </p>
                <p>
                  <b>Property Type:</b> {assessmentData.propertyType}
                </p>
                <p>
                  <b>Annual Value:</b> LKR{" "}
                  {assessmentData.appraisedValue.toLocaleString()}
                </p>
                <p>
                  <b>Tax Rate:</b> {assessmentData.taxRate}%
                </p>
                <p>
                  <b>Annual Tax:</b> LKR {annualTax.toLocaleString()}
                </p>
                <p>
                  <b>Quarterly Tax:</b> LKR {quarterlyTax.toLocaleString()}
                </p>
              </div>
            </div>
          ) : (
            <div className="bg-white shadow rounded-2xl p-6 text-center text-gray-500 italic">
              No assessment found for this property.
            </div>
          )}

          {/* Payment Summary */}
          {assessmentData && (
            <div className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-2xl shadow-lg p-6 mb-6">
              <h3 className="text-lg font-semibold mb-2">Payment Summary</h3>
              <p className="text-2xl font-bold">
                Total Amount (Quarterly): LKR {quarterlyTax.toLocaleString()}
              </p>
            </div>
          )}

          {/* Proceed to Pay */}
          {assessmentData && (
            <div className="flex justify-center">
              <button
                className="px-8 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl shadow-md transition transform hover:scale-105"
                onClick={handleProceedToPay}
              >
                💳 Proceed to Pay
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
