import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import Nav from "../Nav/Nav";

export default function PaymentDetailsPage() {
  const { propertyNo, year, quarter } = useParams();
  const [propertyData, setPropertyData] = useState(null);
  const [assessmentData, setAssessmentData] = useState(null);
  const [taxData, setTaxData] = useState(null);
  const [paymentAmount, setPaymentAmount] = useState(""); // user input
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

        // pre-fill payment amount with backend payable
        setPaymentAmount(taxRes.data?.payableAmount || "");
      } catch (err) {
        console.error("Error fetching payment details:", err);
        setError("Failed to load payment details");
      } finally {
        setLoading(false);
      }
    };

    if (propertyNo) fetchData();
  }, [propertyNo]);

  if (loading)
    return <p className="text-center text-gray-500">⏳ Loading...</p>;
  if (error) return <p className="text-center text-red-500">❌ {error}</p>;

  const handleProceedToPay = () => {
    navigate(
      `/payment?paymentType=property_tax&propertyNo=${encodeURIComponent(
        propertyNo
      )}&year=${year}&quarter=${quarter}&amount=${paymentAmount}`
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
                <b>Division:</b>
                <br /> {propertyData.division?.en}
                {propertyData.division?.si||"-"}
                {propertyData.division?.ta}
              </p>

              <p>
                <b>Street:</b>
                <br /> {propertyData.street?.en}
                {propertyData.street?.si}
                {propertyData.street?.ta}
              </p>
            </div>
          )}

          {/* Owner Info */}
          {assessmentData && (
            <div className="bg-white shadow-lg rounded-2xl p-6 mb-6 border border-gray-200">
              <h3 className="text-xl font-semibold text-indigo-600 mb-4">
                Owner & Assessment
              </h3>
              <p>
                <b>Owner:</b> {assessmentData.ownerName}
              </p>
              <p>
                <b>NIC:</b> {assessmentData.ownerNIC}
              </p>
              <p>
                <b>Contact:</b> {assessmentData.contactNo}
              </p>
              <p>
                <b>Type:</b> {assessmentData.propertyType}
              </p>
            </div>
          )}

          {/* Tax Summary + Editable Payment */}
          {taxData && (
            <div className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-2xl shadow-lg p-6 mb-6">
              <h3 className="text-lg font-semibold mb-4">💰 Payment Entry</h3>

              {/* Display summary */}
              <div className="mb-4 space-y-1">
                <p>
                  Annual Tax: <b>LKR {taxData.annualTax.toLocaleString()}</b>
                </p>
                <p>Discount: -LKR {taxData.discount.toLocaleString()}</p>
                <p>Fine: +LKR {taxData.fine.toLocaleString()}</p>
              </div>

              {/* Input for user payment */}
              <div className="flex flex-col space-y-2">
                <label className="font-semibold">
                  Enter Payment Amount (LKR)
                </label>
                <input
                  type="number"
                  className="px-4 py-2 rounded-lg text-gray-800 border border-gray-300 focus:ring-2 focus:ring-yellow-400"
                  placeholder="Enter amount"
                  value={paymentAmount}
                  onChange={(e) => setPaymentAmount(e.target.value)}
                />
              </div>

              {/* Proceed */}
              <div className="flex justify-center mt-6">
                <button
                  onClick={handleProceedToPay}
                  className="px-8 py-3 bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-bold rounded-xl shadow-md transition transform hover:scale-105"
                >
                  ✅ Confirm Payment
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
