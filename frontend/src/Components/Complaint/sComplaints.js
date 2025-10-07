import React, { useState } from "react";
import Nav from "../Nav/Nav";
import axios from "axios";
import "./complaints.css";
import Swal from "sweetalert2";

function sComplaints() {
  const [inputs, setInputs] = useState({
    NatureofComplaint: "",
    Name: "",
    NIC_Number: "",
    Email: "",
    Phone_Number: "",
    Address: "",
    Location: "",
    Grama_Niladhari_Division: "",
    Attach_Files: [],
    Description: "",
    Captcha: "",
  });

  const [charCount, setCharCount] = useState(0);
  const [fileLabel, setFileLabel] = useState("ගොනු තෝරන්න / කිසිඳු ගොනුවක් තෝරා නැත");
  const [success, setSuccess] = useState(false);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Handle input changes + restrictions
  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (name === "Description") setCharCount(value.length);

    if (name === "Attach_Files") {
      const filesArray = files ? Array.from(files) : [];

      // File validations
      let fileError = "";
      if (filesArray.length > 5) {
        fileError = "ගොනු 5ක් දක්වා පමණක් එක් කළ හැක.";
      } else {
        for (let file of filesArray) {
          if (!["image/jpeg", "image/png", "application/pdf"].includes(file.type)) {
            fileError = "JPG, PNG, PDF වර්ගයේ ගොනු පමණක් අවසර ඇත.";
            break;
          }
          if (file.size > 5 * 1024 * 1024) {
            fileError = "ගොනු තලාව 5MB ට අඩු විය යුතුය.";
            break;
          }
        }
      }

      if (fileError) {
        setErrors((prev) => ({ ...prev, Attach_Files: fileError }));
        setInputs((prev) => ({ ...prev, Attach_Files: [] }));
        setFileLabel("ගොනු තෝරන්න / කිසිඳු ගොනුවක් තෝරා නැත");
      } else {
        setErrors((prev) => ({ ...prev, Attach_Files: "" }));
        setInputs((prev) => ({ ...prev, Attach_Files: filesArray }));
        setFileLabel(
          filesArray.length === 0
            ? "ගොනු තෝරන්න / කිසිඳු ගොනුවක් තෝරා නැත"
            : filesArray.length === 1
            ? filesArray[0].name
            : `${filesArray.length} ගොනු තෝරාගෙන ඇත`
        );
      }
    } else if (name === "Name") {
      const onlyLetters = value.replace(/[^A-Za-z\s]/g, ""); // Only English letters
      setInputs({ ...inputs, [name]: onlyLetters });
    } else if (name === "Phone_Number") {
      const onlyNumbers = value.replace(/[^0-9]/g, "").slice(0, 10); // Max 10 digits
      setInputs({ ...inputs, [name]: onlyNumbers });
    } else if (name === "NIC_Number") {
      let formatted = value.replace(/[^0-9vV]/g, "").slice(0, 12);
      formatted = formatted.replace(/v/g, "V"); // auto-uppercase V
      setInputs({ ...inputs, [name]: formatted });
    } else if (name === "Address") {
      const formatted = value.replace(/[^A-Za-z0-9\s/]/g, ""); // letters, numbers, spaces, "/"
      setInputs({ ...inputs, [name]: formatted });
    } else {
      setInputs({ ...inputs, [name]: value });
    }
  };

  // Validation
  const validateForm = () => {
    let newErrors = {};

    if (!inputs.NatureofComplaint)
      newErrors.NatureofComplaint = "කරුණාකර පැමිණිල්ලේ ස්වභාවය තෝරන්න.";

    if (!inputs.Name.trim()) {
      newErrors.Name = "කරුණාකර ඔබගේ නම ඇතුළත් කරන්න.";
    } else if (!/^[A-Za-z\s]+$/.test(inputs.Name.trim())) {
      newErrors.Name = "English අකුරු සහ හිස් ඉඩ පමණක් යොදන්න.";
    }

    if (
      !/^[0-9]{9}V$/.test(inputs.NIC_Number.trim()) &&
      !/^[0-9]{12}$/.test(inputs.NIC_Number.trim())
    ) {
      newErrors.NIC_Number =
        "NIC නිවැරදිව ඇතුළත් කරන්න (උදා: 9 ඉලක්කම් + V හෝ ඉලක්කම් 12ක්).";
    }

    if (inputs.Email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(inputs.Email)) {
      newErrors.Email = "වලංගු ඊමේල් ලිපිනක් ඇතුළත් කරන්න.";
    }

    if (
      !/^(070|071|072|074|075|076|077|078)[0-9]{7}$/.test(inputs.Phone_Number.trim())
    ) {
      newErrors.Phone_Number =
        "දුරකථන අංකය 070/071/072/074/075/076/077/078 ලෙස ආරම්භ වන ඉලක්කම් 10ක් විය යුතුය.";
    }

    if (!inputs.Address.trim())
      newErrors.Address = "කරුණාකර ලිපිනය ඇතුළත් කරන්න.";
    else if (!/^[A-Za-z0-9\s/]+$/.test(inputs.Address.trim())) {
      newErrors.Address =
        "ලිපිනයේ letters, numbers, හිස් ඉඩ, '/' පමණක් භාවිතා කරන්න.";
    }

    if (!inputs.Location.trim())
      newErrors.Location = "කරුණාකර සිදුවීමේ ස්ථානය ඇතුළත් කරන්න.";
    if (!inputs.Grama_Niladhari_Division)
      newErrors.Grama_Niladhari_Division = "කරුණාකර ග්‍රා.නි. කොට්ඨාශය තෝරන්න.";
    if (!inputs.Description.trim())
      newErrors.Description = "කරුණාකර පැමිණිල්ලේ විස්තරය ඇතුළත් කරන්න.";
    if (inputs.Captcha.trim().toLowerCase() !== "i am human")
      newErrors.Captcha = "කරුණාකර 'I am human' ලෙසම ටයිප් කරන්න.";

    if (inputs.Attach_Files.length > 0) {
      if (inputs.Attach_Files.length > 5) {
        newErrors.Attach_Files = "ගොනු 5ක් දක්වා පමණක් එක් කළ හැක.";
      } else {
        inputs.Attach_Files.forEach((file) => {
          if (!["image/jpeg", "image/png", "application/pdf"].includes(file.type)) {
            newErrors.Attach_Files = "JPG, PNG, PDF ගොනු පමණක් අවසර ඇත.";
          }
          if (file.size > 5 * 1024 * 1024) {
            newErrors.Attach_Files = "එක් ගොනුවක තලාව 5MB ට වඩා වැඩි විය නොහැක.";
          }
        });
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Send request
  const sendRequest = async () => {
    const formData = new FormData();
    Object.keys(inputs).forEach((key) => {
      if (key === "Attach_Files") {
        inputs.Attach_Files.forEach((file) => {
          formData.append("Attach_Files", file);
        });
      } else {
        formData.append(key, inputs[key]);
      }
    });

    return await axios.post("http://localhost:5000/complaints", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      await sendRequest();
      setSuccess(true);

      await Swal.fire({
        icon: "success",
        title: "යොමු කිරීම සාර්ථකයි",
        text: "✅ ඔබගේ පැමිණිල්ල සාර්ථකව යොමු කරන ලදි!",
        timer: 2000,
        showConfirmButton: false,
      });

      setInputs({
        NatureofComplaint: "",
        Name: "",
        NIC_Number: "",
        Email: "",
        Phone_Number: "",
        Address: "",
        Location: "",
        Grama_Niladhari_Division: "",
        Attach_Files: [],
        Description: "",
        Captcha: "",
      });
      setCharCount(0);
      setFileLabel("ගොනු තෝරන්න / කිසිඳු ගොනුවක් තෝරා නැත");
      setErrors({});

      setTimeout(() => setSuccess(false), 2000);
    } catch (err) {
      console.error("Submission failed:", err);
      await Swal.fire({
        icon: "error",
        title: "යොමු කිරීම අසාර්ථකයි",
        text: "කරුණාකර නැවත උත්සාහ කරන්න.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClearForm = () => {
    setInputs({
      NatureofComplaint: "",
      Name: "",
      NIC_Number: "",
      Email: "",
      Phone_Number: "",
      Address: "",
      Location: "",
      Grama_Niladhari_Division: "",
      Attach_Files: [],
      Description: "",
      Captcha: "",
    });
    setCharCount(0);
    setFileLabel("ගොනු තෝරන්න / කිසිඳු ගොනුවක් තෝරා නැත");
    setErrors({});
  };

  return (
    <div>
      <Nav />
      <div className="complaints-container">
        <h1>පැමිණිලි ඉදිරිපත් කිරීමේ පෝරමය</h1>
        <p>කරුණාකර පහත පෝරමය පුරවා ඔබගේ පැමිණිල්ල ඉදිරිපත් කරන්න.</p>

        {success && (
          <div className="success-message">
            ✅ ඔබගේ පැමිණිල්ල සාර්ථකව යොමු කරන ලදි!
          </div>
        )}

        <form onSubmit={handleSubmit} className="complaints-form" encType="multipart/form-data">
          {/* Nature of Complaint */}
          <div className="form-group">
            <label>
              පැමිණිල්ලේ ස්වභාවය <span className="required">*</span>
            </label>
            <select
              name="NatureofComplaint"
              value={inputs.NatureofComplaint}
              onChange={handleChange}
              className="form-select"
            >
              <option value="">කරුණාකර තෝරන්න</option>
              <option value="service">සේවා ගැටළු</option>
              <option value="corruption">භේදභාවය/දූෂණ</option>
              <option value="harassment">ආතල්භාවය/හිරිහැර</option>
              <option value="discrimination">කලහ/විසුම්බු</option>
              <option value="delay">වෙළංගු කම්මැලි/පමාවීම්</option>
              <option value="misconduct">අස්ථානගත හැසිරීම</option>
              <option value="other">වෙනත්</option>
            </select>
            {errors.NatureofComplaint && (
              <div className="error-message">{errors.NatureofComplaint}</div>
            )}
          </div>

          {/* Name & NIC */}
          <div className="form-row">
            <div className="form-group">
              <label>
                නම <span className="required">*</span>
              </label>
              <input
                type="text"
                name="Name"
                value={inputs.Name}
                onChange={handleChange}
                className="form-input"
                placeholder="ඔබගේ සම්පූර්ණ නම (English අකුරු)"
              />
              {errors.Name && <div className="error-message">{errors.Name}</div>}
            </div>

            <div className="form-group">
              <label>
                ජාතික හැඳුනුම්පත් අංකය (NIC) <span className="required">*</span>
              </label>
              <input
                type="text"
                name="NIC_Number"
                value={inputs.NIC_Number}
                onChange={handleChange}
                className="form-input"
                placeholder="උදා: 123456789V හෝ 199012345678"
                maxLength={12}
              />
              {errors.NIC_Number && (
                <div className="error-message">{errors.NIC_Number}</div>
              )}
            </div>
          </div>

          {/* Email & Phone */}
          <div className="form-row">
            <div className="form-group">
              <label>ඊමේල් ලිපිනය</label>
              <input
                type="email"
                name="Email"
                value={inputs.Email}
                onChange={handleChange}
                className="form-input"
                placeholder="your.email@example.com"
              />
              {errors.Email && <div className="error-message">{errors.Email}</div>}
            </div>

            <div className="form-group">
              <label>
                දුරකථන අංකය <span className="required">*</span>
              </label>
              <input
                type="tel"
                name="Phone_Number"
                value={inputs.Phone_Number}
                onChange={handleChange}
                className="form-input"
                placeholder="07XXXXXXXX"
                maxLength={10}
              />
              {errors.Phone_Number && (
                <div className="error-message">{errors.Phone_Number}</div>
              )}
            </div>
          </div>

          {/* Address & Location */}
          <div className="form-row">
            <div className="form-group">
              <label>
                ලිපිනය <span className="required">*</span>
              </label>
              <input
                type="text"
                name="Address"
                value={inputs.Address}
                onChange={handleChange}
                className="form-input"
                placeholder="ඔබගේ වාසස්ථාන ලිපිනය (letters, numbers, '/' පමණක්)"
              />
              {errors.Address && <div className="error-message">{errors.Address}</div>}
            </div>

            <div className="form-group">
              <label>
                සිදුවීමේ ස්ථානය <span className="required">*</span>
              </label>
              <input
                type="text"
                name="Location"
                value={inputs.Location}
                onChange={handleChange}
                className="form-input"
                placeholder="සිදුවීම සිදුවූ ස්ථානය"
              />
              {errors.Location && <div className="error-message">{errors.Location}</div>}
            </div>
          </div>

          {/* Division */}
          <div className="form-group">
            <label>
              ග්‍රාම නිලධාරී කොට්ඨාශය <span className="required">*</span>
            </label>
            <select
              name="Grama_Niladhari_Division"
              value={inputs.Grama_Niladhari_Division}
              onChange={handleChange}
              className="form-select"
            >
              <option value="">කරුණාකර තෝරන්න</option>
              <option value="welmilla">වෙල්මිල්ලා (Welmilla)</option>
              <option value="halapitiya">හලපිටිය (Halapitiya)</option>
              <option value="godigamuwaEast">ගොඩිගමුව කොටස (Godigamuwa East)</option>
              <option value="palannoruwa">පලන්නෝරුව (Palannoruwa)</option>
              <option value="olaboduwaEast">ඔලබොඩුව කොටස (Olaboduwa East)</option>
              <option value="olaboduwaNorth">ඔලබොඩුව උතුර (Olaboduwa North)</option>
              <option value="olaboduwaSouth">ඔලබොඩුව දකුණ (Olaboduwa South)</option>
              <option value="other">වෙනත්</option>
            </select>
            {errors.Grama_Niladhari_Division && (
              <div className="error-message">{errors.Grama_Niladhari_Division}</div>
            )}
          </div>

          {/* File Upload */}
          <div className="form-group">
            <label>ගොනු එකතු කිරීම</label>
            <div className="file-upload-container">
              <input
                type="file"
                name="Attach_Files"
                multiple
                onChange={handleChange}
                className="file-input"
                id="file-upload"
              />
              <label htmlFor="file-upload" className="file-label">
                📎 ගොනු උඩුගත කිරීමට ක්ලික් කරන්න හෝ Drag & Drop කරන්න
              </label>
            </div>
            <div className="file-status">{fileLabel}</div>
            {errors.Attach_Files && (
              <div className="error-message">{errors.Attach_Files}</div>
            )}
          </div>

          {/* Description */}
          <div className="form-group">
            <label>
              විස්තරය <span className="required">*</span>
            </label>
            <textarea
              name="Description"
              value={inputs.Description}
              onChange={handleChange}
              maxLength={500}
              className="form-textarea"
              placeholder="කරුණාකර ඔබගේ පැමිණිල්ල පිළිබඳ සවිස්තරාත්මක තොරතුරු ලබා දෙන්න..."
            />
            <div
              className={`char-counter ${charCount > 400 ? "warning" : ""} ${
                charCount >= 500 ? "danger" : ""
              }`}
            >
              {charCount}/500
            </div>
            {errors.Description && (
              <div className="error-message">{errors.Description}</div>
            )}
          </div>

          {/* Captcha */}
          <div className="form-group captcha-section">
            <label>
              සත්‍යාපනය <span className="required">*</span>
            </label>
            <div className="captcha-instruction">
              කරුණාකර පහත කොටුවේ <strong>I am human</strong> (ඉංග්‍රීසි ලෙසම) ටයිප් කරන්න.
            </div>
            <input
              type="text"
              name="Captcha"
              value={inputs.Captcha}
              onChange={handleChange}
              className="form-input"
              placeholder="Type exactly: I am human"
            />
            {errors.Captcha && <div className="error-message">{errors.Captcha}</div>}
          </div>

          {/* Buttons */}
          <div className="button-group">
            <button
              type="submit"
              className={`btn btn-primary ${isSubmitting ? "loading" : ""}`}
              disabled={isSubmitting}
            >
              {isSubmitting ? "යොමු කරමින්..." : "පැමිණිල්ල යොමු කරන්න"}
            </button>
            <button
              type="button"
              onClick={handleClearForm}
              className="btn btn-secondary"
              disabled={isSubmitting}
            >
              පෝරමය හිස් කරන්න
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default sComplaints;
