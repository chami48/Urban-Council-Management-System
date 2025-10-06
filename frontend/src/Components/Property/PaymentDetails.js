import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import Nav from "../Nav/Nav";

export default function PaymentDetailsPage() {
  const { propertyNo, year, quarter } = useParams();
  const [propertyData, setPropertyData] = useState(null);
  const [assessmentData, setAssessmentData] = useState(null);
  const [taxData, setTaxData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
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

        const taxRes = await axios.get(
          `http://localhost:5000/calculateTax/${encodedNo}`
        );
        setTaxData(taxRes.data || null);
      } catch (err) {
        console.error("Error fetching payment details:", err);
        setError("Failed to load payment details");
      } finally {
        setLoading(false);
      }
    };

    if (propertyNo) fetchData();
  }, [propertyNo]);

  if (loading) return <p className="text-center text-gray-500">⏳ Loading...</p>;
  if (error) return <p className="text-center text-red-500">❌ {error}</p>;

  const handleProceedToPay = () => {
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

          {/* Property Info */}
          {propertyData && (
            <div className="bg-white shadow-lg rounded-2xl p-6 mb-6 border border-gray-200">
              <h3 className="text-xl font-semibold text-indigo-600 mb-4">
                Property Information
              </h3>
              <p>
                <b>Property No:</b> {propertyData.propertyNo}
              </p>
              <p>
                <b>Division:</b> {propertyData.division?.en || "-"}
              </p>
              <p>
                <b>Street:</b> {propertyData.street?.en || "-"}
              </p>
            </div>
          )}

          {/* Owner Info */}
          {assessmentData && (
            <div className="bg-white shadow-lg rounded-2xl p-6 mb-6 border border-gray-200">
              <h3 className="text-xl font-semibold text-indigo-600 mb-4">
                Owner & Assessment
              </h3>
              <p><b>Owner:</b> {assessmentData.ownerName}</p>
              <p><b>NIC:</b> {assessmentData.ownerNIC}</p>
              <p><b>Contact:</b> {assessmentData.contactNo}</p>
              <p><b>Type:</b> {assessmentData.propertyType}</p>
            </div>
          )}

          {/* Tax Summary */}
          {taxData && (
            <div className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-2xl shadow-lg p-6 mb-6">
              <h3 className="text-lg font-semibold mb-2">Payment Summary</h3>
              <p>Annual Tax: LKR {taxData.annualTax.toLocaleString()}</p>
              <p>Discount: -LKR {taxData.discount.toLocaleString()}</p>
              <p>Fine: +LKR {taxData.fine.toLocaleString()}</p>
              <p className="text-2xl font-bold mt-3">
                Total Payable: LKR {taxData.payableAmount.toLocaleString()}
              </p>
            </div>
          )}

          {/* Quarter Breakdown */}
          {taxData?.quarters && (
            <div className="bg-white shadow-lg rounded-2xl p-6 border border-gray-200 mb-6">
              <h3 className="text-lg font-semibold mb-4 text-indigo-600">
                Quarter Breakdown
              </h3>
              {taxData.quarters.map((q) => (
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
                  <p><b>Quarter {q.quarter}</b> (Due {new Date(q.dueDate).toLocaleDateString()})</p>
                  <p>Base: LKR {q.baseAmount.toLocaleString()}</p>
                  <p>Paid: LKR {q.paidAmount.toLocaleString()}</p>
                  <p>Remaining: LKR {q.remainingDue.toLocaleString()}</p>
                  <p>Fine: LKR {q.fine.toLocaleString()}</p>
                  <p>Status: {q.status}</p>
                </div>
              ))}
            </div>
          )}

          {/* Pay Button */}
          {taxData && (
            <div className="flex justify-center">
              <button
                onClick={handleProceedToPay}
                className="px-8 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl shadow-md transition transform hover:scale-105"
              >
                💳 Confirm Payment
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
