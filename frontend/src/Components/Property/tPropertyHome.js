// src/Components/Property/HomeTamil.js
import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import Nav from "../Nav/Nav";
import Swal from "sweetalert2";

function HomeTamil() {
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
      console.error("சொத்து பெறும்போது பிழை:", err);
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
      Swal.fire({
        icon: "success",
        title: "சொத்து வெற்றிகரமாக நீக்கப்பட்டது!",
        timer: 2000,
        showConfirmButton: false,
      });
    } catch (err) {
      console.error("சொத்தை நீக்கும்போது பிழை:", err);
      // ❌ Error Swal
      Swal.fire({
        icon: "error",
        title: "சொத்தை நீக்க முடியவில்லை",
        text: "தயவுசெய்து மீண்டும் முயற்சிக்கவும்.",
      });
    }
  };

  if (loading)
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-blue-700 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-orange-500 mx-auto mb-4"></div>
          <p className="text-white text-xl font-medium">
            சொத்துகள் ஏற்றுகிறது...
          </p>
        </div>
      </div>
    );

  //Helper: pick Tamil text, fallback to English if missing
  const getField = (field) => {
  if (!field) return "-";
  if (typeof field === "string") return field;

  // Tamil first, then Sinhala, then English
  return field.ta || field.si || field.en || "-";
};



  return (
    <>
      <Nav />
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-slate-50 to-blue-100 py-8 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-5xl md:text-6xl font-black bg-gradient-to-r from-blue-900 via-blue-800 to-blue-600 bg-clip-text text-transparent mb-6 tracking-tight">
              எனது சொத்து
            </h2>
            <p className="text-lg text-slate-600 mb-8 max-w-2xl mx-auto leading-relaxed">
              உங்கள் சொத்துக்களை எளிதாக மேலாண்மை செய்யுங்கள். மதிப்பீடுகள்,
              கட்டணங்கள் மற்றும் சொத்து விவரங்களை ஒரே இடத்தில் பார்க்கலாம்.
            </p>
            <button
              className="group relative inline-flex items-center justify-center px-8 py-4 text-lg font-semibold text-white transition-all duration-300 bg-gradient-to-r from-orange-500 to-orange-600 rounded-full hover:from-orange-600 hover:to-orange-700 hover:scale-105 hover:shadow-xl hover:shadow-orange-500/25 focus:outline-none focus:ring-4 focus:ring-orange-500/50"
              onClick={() => navigate("/taddproperty")}
            >
              <span className="relative flex items-center">
                ➕ புதிய சொத்தைச் சேர்க்கவும்
              </span>
            </button>
          </div>

          {properties.length === 0 ? (
            <div className="max-w-2xl mx-auto text-center py-16">
              <div className="bg-white rounded-3xl shadow-xl p-12 border border-blue-100">
                <div className="text-8xl mb-6 opacity-40">🏠</div>
                <h3 className="text-2xl font-bold text-blue-900 mb-4">
                  இன்னும் சொத்து இல்லை
                </h3>
                <p className="text-slate-600 text-lg">காண்பிக்க சொத்து இல்லை</p>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
              {properties.map((prop, index) => {
                const assessment = prop.assessment;
                const hasPayments = prop.payments && prop.payments.length > 0;
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
                          🏠 சொத்து {prop.propertyNo}
                        </span>
                      </div>
                    </div>

                    {/* Body */}
                    <div className="p-6 space-y-4">
                      <p>
                        <strong>உரிமையாளர்:</strong>{" "}
                        {assessment?.ownerName || "-"}
                      </p>
                      <p>
                        <strong>அலுவலகம்/பிரிவு/தெரு:</strong>{" "}
                        {getField(prop.branch)}, {getField(prop.division)},{" "}
                        {getField(prop.street)}
                      </p>
                      <p>
                        <strong>விளக்கம்:</strong>{" "}
                        {assessment?.description || "-"}
                      </p>

                      <div className="grid grid-cols-2 gap-3 mt-6">
                        <div className="bg-blue-50 rounded-xl p-4 text-center border">
                          <p className="text-xs text-blue-600 uppercase">
                            மதிப்பீட்ட மதிப்பு
                          </p>
                          <p className="text-lg font-bold text-blue-900">
                            {assessment?.appraisedValue
                              ? `ரூ. ${assessment.appraisedValue}`
                              : "-"}
                          </p>
                        </div>
                        <div className="bg-orange-50 rounded-xl p-4 text-center border">
                          <p className="text-xs text-orange-600 uppercase">
                            ஆண்டு வரி
                          </p>
                          <p className="text-lg font-bold text-orange-800">
                            {annualTax ? `ரூ. ${annualTax}` : "-"}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="p-6 bg-blue-50 border-t flex flex-col gap-3">
                      {!assessment && (
                        <p className="text-red-600 font-semibold text-center">
                          ⚠️ மதிப்பீடு இன்னும் தீர்மானிக்கப்படவில்லை!
                        </p>
                      )}

                      {assessment && !hasPayments && (
                        <button
                          className="bg-gradient-to-r from-blue-600 to-blue-700 text-white py-3 px-4 rounded-xl font-semibold text-sm hover:scale-105"
                          onClick={() =>
                            navigate(
                              `/tpropertyTaxCalculation/${prop.propertyNo}`
                            )
                          }
                        >
                          பார்க்க / கட்டணம் செலுத்த
                        </button>
                      )}

                      {hasPayments && (
                        <div className="bg-green-50 p-3 rounded-lg border border-green-200">
                          <p className="text-green-700 font-semibold mb-2">
                            ✅ வரி செலுத்தப்பட்டது
                          </p>
                          <ul className="text-sm text-gray-700">
                            {prop.payments.map((p) => (
                              <li key={p._id}>
                                ரூ. {p.amount} –{" "}
                                {new Date(p.paymentDate).toLocaleDateString(
                                  "ta-LK"
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
                        நீக்கு
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

export default HomeTamil;
