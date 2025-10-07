import React, { useState } from "react";
import Nav from "../Nav/TNav";
import axios from "axios";
import "./complaints.css";

function TComplaints() {
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
  const [fileLabel, setFileLabel] = useState("கோப்பைத் தேர்வு செய்க / எந்தக் கோப்பும் தேர்ந்தெடுக்கப்படவில்லை");
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
        fileError = "நீங்கள் அதிகபட்சம் 5 கோப்புகள் மட்டுமே பதிவேற்ற முடியும்";
      } else {
        for (let file of filesArray) {
          if (
            !["image/jpeg", "image/png", "application/pdf"].includes(file.type)
          ) {
            fileError = "JPG, PNG, அல்லது PDF கோப்புகள் மட்டுமே அனுமதிக்கப்படும்";
            break;
          }
          if (file.size > 5 * 1024 * 1024) {
            fileError = "ஒவ்வொரு கோப்பும் 5MB-ஐ விட குறைவாக இருக்க வேண்டும்";
            break;
          }
        }
      }

      if (fileError) {
        setErrors((prev) => ({ ...prev, Attach_Files: fileError }));
        setInputs({ ...inputs, Attach_Files: [] });
        setFileLabel("கோப்பைத் தேர்வு செய்க / எந்தக் கோப்பும் தேர்ந்தெடுக்கப்படவில்லை");
      } else {
        setErrors((prev) => ({ ...prev, Attach_Files: "" }));
        setInputs({ ...inputs, Attach_Files: filesArray });
        setFileLabel(
          filesArray.length === 0
            ? "கோப்பைத் தேர்வு செய்க / எந்தக் கோப்பும் தேர்ந்தெடுக்கப்படவில்லை"
            : filesArray.length === 1
            ? filesArray[0].name
            : `${filesArray.length} கோப்புகள் தேர்ந்தெடுக்கப்பட்டுள்ளன`
        );
      }
    } else if (name === "Name") {
      const onlyLetters = value.replace(/[^A-Za-z\s]/g, "");
      setInputs({ ...inputs, [name]: onlyLetters });
    } else if (name === "Phone_Number") {
      const onlyNumbers = value.replace(/[^0-9]/g, "").slice(0, 10);
      setInputs({ ...inputs, [name]: onlyNumbers });
    } else if (name === "NIC_Number") {
      let formatted = value.replace(/[^0-9vV]/g, "").slice(0, 12);
      formatted = formatted.replace(/v/g, "V");
      setInputs({ ...inputs, [name]: formatted });
    } else if (name === "Address") {
      const formatted = value.replace(/[^A-Za-z0-9\s/]/g, "");
      setInputs({ ...inputs, [name]: formatted });
    } else {
      setInputs({ ...inputs, [name]: value });
    }
  };

  // Validation
  const validateForm = () => {
    let newErrors = {};

    if (!inputs.NatureofComplaint)
      newErrors.NatureofComplaint = "தயவுசெய்து புகாரின் தன்மையைத் தேர்ந்தெடுக்கவும்";

    if (!inputs.Name.trim()) {
      newErrors.Name = "தயவுசெய்து உங்கள் பெயரை உள்ளிடவும்";
    } else if (!/^[A-Za-z\s]+$/.test(inputs.Name.trim())) {
      newErrors.Name = "ஆங்கில எழுத்துக்கள் மட்டுமே அனுமதிக்கப்படும்";
    }

    if (
      !/^[0-9]{9}V$/.test(inputs.NIC_Number.trim()) &&
      !/^[0-9]{12}$/.test(inputs.NIC_Number.trim())
    ) {
      newErrors.NIC_Number =
        "சரியான அடையாள எண் (9 இலக்கங்கள் + V அல்லது 12 இலக்கங்கள்) உள்ளிடவும்";
    }

    if (inputs.Email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(inputs.Email)) {
      newErrors.Email = "சரியான மின்னஞ்சல் முகவரியை உள்ளிடவும்";
    }

    if (
      !/^(070|071|072|074|075|076|077|078)[0-9]{7}$/.test(
        inputs.Phone_Number.trim()
      )
    ) {
      newErrors.Phone_Number =
        "தொலைபேசி எண் 070, 071, 072, 074, 075, 076, 077, அல்லது 078 என தொடங்கியிருக்க வேண்டும் மற்றும் 10 இலக்கங்களாக இருக்க வேண்டும்";
    }

    if (!inputs.Address.trim())
      newErrors.Address = "தயவுசெய்து உங்கள் முகவரியை உள்ளிடவும்";
    else if (!/^[A-Za-z0-9\s/]+$/.test(inputs.Address.trim())) {
      newErrors.Address =
        "முகவரியில் எழுத்துக்கள், எண்கள், இடைவெளி மற்றும் '/' மட்டுமே அனுமதிக்கப்படும்";
    }

    if (!inputs.Location.trim())
      newErrors.Location = "தயவுசெய்து இடத்தை உள்ளிடவும்";
    if (!inputs.Grama_Niladhari_Division)
      newErrors.Grama_Niladhari_Division = "தயவுசெய்து கிராமநிலதாரி பிரிவைத் தேர்ந்தெடுக்கவும்";
    if (!inputs.Description.trim())
      newErrors.Description = "தயவுசெய்து புகார் விவரத்தை உள்ளிடவும்";
    if (inputs.Captcha.trim().toLowerCase() !== "i am human")
      newErrors.Captcha = "தயவுசெய்து 'I am human' என்று type செய்யவும்";

    if (inputs.Attach_Files.length > 0) {
      if (inputs.Attach_Files.length > 5) {
        newErrors.Attach_Files = "நீங்கள் அதிகபட்சம் 5 கோப்புகள் மட்டுமே பதிவேற்ற முடியும்";
      } else {
        inputs.Attach_Files.forEach((file) => {
          if (
            !["image/jpeg", "image/png", "application/pdf"].includes(file.type)
          ) {
            newErrors.Attach_Files = "JPG, PNG, அல்லது PDF கோப்புகள் மட்டுமே அனுமதிக்கப்படும்";
          }
          if (file.size > 5 * 1024 * 1024) {
            newErrors.Attach_Files = "ஒவ்வொரு கோப்பும் 5MB-ஐ விட குறைவாக இருக்க வேண்டும்";
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
      alert("வெற்றிகரமாக சமர்ப்பிக்கப்பட்டது ✅");

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
      setFileLabel("கோப்பைத் தேர்வு செய்க / எந்தக் கோப்பும் தேர்ந்தெடுக்கப்படவில்லை");
      setErrors({});

      setTimeout(() => setSuccess(false), 2000);
    } catch (err) {
      console.error("Submission failed:", err);
      alert("சமர்ப்பித்தல் தோல்வியடைந்தது. மீண்டும் முயற்சிக்கவும்.");
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
    setFileLabel("கோப்பைத் தேர்வு செய்க / எந்தக் கோப்பும் தேர்ந்தெடுக்கப்படவில்லை");
    setErrors({});
  };

  return (
    <div>
      <Nav />
      <div className="complaints-container">
        <h1>புகார் சமர்ப்பிக்கும் படிவம்</h1>
        <p>உங்கள் புகாரை சமர்ப்பிக்க கீழே உள்ள படிவத்தை பூர்த்தி செய்யவும்</p>

        {success && (
          <div className="success-message">
            ✅ உங்கள் புகார் வெற்றிகரமாக சமர்ப்பிக்கப்பட்டது!
          </div>
        )}

        <form
          onSubmit={handleSubmit}
          className="complaints-form"
          encType="multipart/form-data"
        >
          {/* Nature of Complaint */}
          <div className="form-group">
            <label>
              புகாரின் தன்மை <span className="required">*</span>
            </label>
            <select
              name="NatureofComplaint"
              value={inputs.NatureofComplaint}
              onChange={handleChange}
              className="form-select"
            >
              <option value="">தயவுசெய்து தேர்ந்தெடுக்கவும்</option>
              <option value="service">சேவை பிரச்சினைகள்</option>
              <option value="corruption">ஊழல்</option>
              <option value="harassment">துன்புறுத்தல்</option>
              <option value="discrimination">பாகுபாடு</option>
              <option value="delay">தாமதம்</option>
              <option value="misconduct">ஒழுக்கக்கேடு</option>
              <option value="other">மற்றவை</option>
            </select>
            {errors.NatureofComplaint && (
              <div className="error-message">{errors.NatureofComplaint}</div>
            )}
          </div>

          {/* Name & NIC */}
          <div className="form-row">
            <div className="form-group">
              <label>
                பெயர் <span className="required">*</span>
              </label>
              <input
                type="text"
                name="Name"
                value={inputs.Name}
                onChange={handleChange}
                className="form-input"
                placeholder="உங்கள் முழுப் பெயரை உள்ளிடவும்"
              />
              {errors.Name && (
                <div className="error-message">{errors.Name}</div>
              )}
            </div>

            <div className="form-group">
              <label>
                தேசிய அடையாள எண் <span className="required">*</span>
              </label>
              <input
                type="text"
                name="NIC_Number"
                value={inputs.NIC_Number}
                onChange={handleChange}
                className="form-input"
                placeholder="உதாரணம்: 123456789V அல்லது 199012345678"
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
              <label>மின்னஞ்சல்</label>
              <input
                type="email"
                name="Email"
                value={inputs.Email}
                onChange={handleChange}
                className="form-input"
                placeholder="your.email@example.com"
              />
              {errors.Email && (
                <div className="error-message">{errors.Email}</div>
              )}
            </div>

            <div className="form-group">
              <label>
                தொலைபேசி எண் <span className="required">*</span>
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
                முகவரி <span className="required">*</span>
              </label>
              <input
                type="text"
                name="Address"
                value={inputs.Address}
                onChange={handleChange}
                className="form-input"
                placeholder="உங்கள் வீட்டின் முகவரி"
              />
              {errors.Address && (
                <div className="error-message">{errors.Address}</div>
              )}
            </div>

            <div className="form-group">
              <label>
                இடம் <span className="required">*</span>
              </label>
              <input
                type="text"
                name="Location"
                value={inputs.Location}
                onChange={handleChange}
                className="form-input"
                placeholder="நிகழ்வு நடந்த இடம்"
              />
              {errors.Location && (
                <div className="error-message">{errors.Location}</div>
              )}
            </div>
          </div>

          {/* Division */}
          <div className="form-group">
            <label>
              கிராமநிலதாரி பிரிவு <span className="required">*</span>
            </label>
            <select
              name="Grama_Niladhari_Division"
              value={inputs.Grama_Niladhari_Division}
              onChange={handleChange}
              className="form-select"
            >
              <option value="">தயவுசெய்து தேர்ந்தெடுக்கவும்</option>
              <option value="welmilla">வெல்மில்லா</option>
              <option value="halapitiya">ஹலபிட்டியா</option>
              <option value="godigamuwaEast">கொடிகமுவ கிழக்கு</option>
              <option value="palannoruwa">பலன்னொருவ</option>
              <option value="olaboduwaEast">ஒலபொடுவ கிழக்கு</option>
              <option value="olaboduwaNorth">ஒலபொடுவ வடக்கு</option>
              <option value="olaboduwaSouth">ஒலபொடுவ தெற்கு</option>
              <option value="other">மற்றவை</option>
            </select>
            {errors.Grama_Niladhari_Division && (
              <div className="error-message">
                {errors.Grama_Niladhari_Division}
              </div>
            )}
          </div>

          {/* File Upload */}
          <div className="form-group">
            <label>கோப்புகளை இணைக்கவும்</label>
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
                📎 கோப்புகளை பதிவேற்ற கிளிக் செய்யவும் அல்லது இழுத்து விடவும்
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
              புகாரின் விவரம் <span className="required">*</span>
            </label>
            <textarea
              name="Description"
              value={inputs.Description}
              onChange={handleChange}
              maxLength={500}
              className="form-textarea"
              placeholder="தயவுசெய்து உங்கள் புகாரை விவரமாக எழுதவும்..."
            />
            <div
              className={`char-counter ${
                charCount > 400 ? "warning" : ""
              } ${charCount >= 500 ? "danger" : ""}`}
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
              சரிபார்த்தல் <span className="required">*</span>
            </label>
            <div className="captcha-instruction">
              நீங்கள் மனிதர் என்பதை உறுதிப்படுத்த கீழே "I am human" என்று தட்டச்சு செய்யவும்.
            </div>
            <input
              type="text"
              name="Captcha"
              value={inputs.Captcha}
              onChange={handleChange}
              className="form-input"
              placeholder="Type: I am human"
            />
            {errors.Captcha && (
              <div className="error-message">{errors.Captcha}</div>
            )}
          </div>

          {/* Submit Buttons */}
          <div className="button-group">
            <button
              type="submit"
              className={`btn btn-primary ${isSubmitting ? "loading" : ""}`}
              disabled={isSubmitting}
            >
              {isSubmitting ? "சமர்ப்பிக்கப்படுகிறது..." : "புகாரை சமர்ப்பிக்கவும்"}
            </button>
            <button
              type="button"
              onClick={handleClearForm}
              className="btn btn-secondary"
              disabled={isSubmitting}
            >
              படிவத்தை அழிக்கவும்
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default TComplaints;
