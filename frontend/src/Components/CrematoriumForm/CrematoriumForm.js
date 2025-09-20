import React, { useState } from "react";
import axios from "axios";
import Nav from "../Nav/Nav";

export default function CrematoriumForm() {
  const [formData, setFormData] = useState({
    applicantFullName: "",
    surname: "",
    nic: "",
    deceasedFullName: "",
    dateOfDeath: "",
    residenceArea: "within",
    registrationNumber: "",
    naturalDeathCertificate: "",
    cremationDate: "",
    declarationAgreement: false,
  });

  // State for death certificate image file
  const [deathCertificateFile, setDeathCertificateFile] = useState(null);
  // State for BE order image file
  const [beOrderFile, setBeOrderFile] = useState(null);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleFileChange = (e) => {
    setDeathCertificateFile(e.target.files[0]);
  };

  const handleBeOrderFileChange = (e) => {
    setBeOrderFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = new FormData();

      // Append all form data fields
      Object.entries(formData).forEach(([key, val]) => data.append(key, val));

      // Append files if selected
      if (deathCertificateFile) data.append("deathCertificateImage", deathCertificateFile);
      if (beOrderFile) data.append("beOrderImage", beOrderFile);

      await axios.post("http://localhost:5000/crematorium", data, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      alert("ඇනවුම සාර්ථකව යැවිය");
      window.location.reload();
    } catch (err) {
      console.error(err);
      alert("ඇනවුම යැවීම අසාර්ථකයි");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Nav />
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-lg shadow-lg p-8">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-gray-800 mb-2">
                ආදහනාගාර පහසුකම් ලබා ගැනීම සදහා ඉල්ලුම් පත්‍රය
              </h1>
              <p className="text-gray-600">
                කරුණාකර සියලු අවශ්‍ය තොරතුරු සම්පූර්ණ කරන්න
              </p>
            </div>

            <form
              onSubmit={handleSubmit}
              encType="multipart/form-data"
              className="space-y-6"
            >
              {/* Applicant Information Section */}
              <div className="bg-blue-50 p-6 rounded-lg">
                <h2 className="text-xl font-semibold text-blue-800 mb-4">
                  අයදුම්කරුගේ තොරතුරු
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      අයදුම්කරුගේ සම්පූර්ණ නම *
                    </label>
                    <input
                      type="text"
                      name="applicantFullName"
                      placeholder="අයදුම්කරුගේ සම්පූර්ණ නම"
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      ලිපිනය *
                    </label>
                    <input
                      type="text"
                      name="surname"
                      placeholder="ලිපිනය"
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      ජාතික හැඳුනුම්පත් අංකය *
                    </label>
                    <input
                      type="text"
                      name="nic"
                      placeholder="NIC"
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg"
                    />
                  </div>
                </div>
              </div>

              {/* Deceased Information Section */}
              <div className="bg-gray-50 p-6 rounded-lg">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">
                  මියගිය පුද්ගලයාගේ තොරතුරු
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      මියගිය පුද්ගලයාගේ සම්පූර්ණ නම *
                    </label>
                    <input
                      type="text"
                      name="deceasedFullName"
                      placeholder="මියගිය පුද්ගලයාගේ සම්පූර්ණ නම"
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      මරණය වූ දිනය *
                    </label>
                    <input
                      type="date"
                      name="dateOfDeath"
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      නේවාසික ප්‍රදේශය
                    </label>
                    <select
                      name="residenceArea"
                      onChange={handleChange}
                      value={formData.residenceArea}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg"
                    >
                      <option value="within">නගර සීමා ඇතුළත</option>
                      <option value="outside">නගර සීමා පිටත</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Documentation Section */}
              <div className="bg-yellow-50 p-6 rounded-lg">
                <h2 className="text-xl font-semibold text-yellow-800 mb-4">
                  ලේඛන
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      බල ප්‍රදේශය තුල නම් මියගිය අය පදිංචි ස්තානයේ වරිපනම් අංකය
                    </label>
                    <input
                      type="text"
                      name="registrationNumber"
                      placeholder="(ඇත්නම්) ලියාපදිංචි අංකය"
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg"
                    />
                  </div>

                  {/* BE Order Number input removed as requested */}

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                     ස්වභාවික මරණයක් නම් ග්‍රාම නිලදාරි සහතිකය                   </label>
                    <input
                      type="file"
                      name="beOrderImage"
                      onChange={handleBeOrderFileChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      මරණ සහතික පින්තූරය *
                    </label>
                    <input
                      type="file"
                      name="deathCertificateImage"
                      onChange={handleFileChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg"
                    />
                  </div>
                </div>
              </div>

              {/* Cremation Details Section */}
              <div className="bg-green-50 p-6 rounded-lg">
                <h2 className="text-xl font-semibold text-green-800 mb-4">
                  දහන විස්තර
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      දහන දිනය *
                    </label>
                    <input
                      type="date"
                      name="cremationDate"
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg"
                    />
                  </div>
                </div>
              </div>

              {/* Declaration Section */}
              <div className="bg-red-50 p-6 rounded-lg">
                <h2 className="text-xl font-semibold text-red-800 mb-4">
                  ප්‍රකාශය
                </h2>
                <div className="flex items-start space-x-3">
                  <input
                    type="checkbox"
                    name="declarationAgreement"
                    onChange={handleChange}
                    className="mt-1 h-5 w-5 text-blue-600 border-gray-300 rounded"
                  />
                  <label className="text-gray-700">
                    සපයන ලද සියලු තොරතුරු නිවැරදි සහ සම්පූර්ණ බවට මම එකඟ වෙමි.
                  </label>
                </div>
              </div>

              {/* Submit Button */}
              <div className="text-center pt-6">
                <button
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-4 px-12 rounded-lg"
                >
                  ඇනවුම යවන්න
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
