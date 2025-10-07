import React, { useState } from "react";
import Nav from "../Nav/ENav";
import axios from "axios";
import "./complaints.css";

function Complaints() {
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
  const [fileLabel, setFileLabel] = useState("Choose File / No file chosen");
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
        fileError = "You can upload up to 5 files only";
      } else {
        for (let file of filesArray) {
          if (
            !["image/jpeg", "image/png", "application/pdf"].includes(file.type)
          ) {
            fileError = "Only JPG, PNG, or PDF files are allowed";
            break;
          }
          if (file.size > 5 * 1024 * 1024) {
            fileError = "Each file must be smaller than 5MB";
            break;
          }
        }
      }

      if (fileError) {
        setErrors((prev) => ({ ...prev, Attach_Files: fileError }));
        setInputs({ ...inputs, Attach_Files: [] });
        setFileLabel("Choose File / No file chosen");
      } else {
        setErrors((prev) => ({ ...prev, Attach_Files: "" }));
        setInputs({ ...inputs, Attach_Files: filesArray });
        setFileLabel(
          filesArray.length === 0
            ? "Choose File / No file chosen"
            : filesArray.length === 1
            ? filesArray[0].name
            : `${filesArray.length} files selected`
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
      newErrors.NatureofComplaint = "Please select the nature of complaint";

    if (!inputs.Name.trim()) {
      newErrors.Name = "Please enter your name";
    } else if (!/^[A-Za-z\s]+$/.test(inputs.Name.trim())) {
      newErrors.Name = "Only English letters are allowed";
    }

    if (
      !/^[0-9]{9}V$/.test(inputs.NIC_Number.trim()) &&
      !/^[0-9]{12}$/.test(inputs.NIC_Number.trim())
    ) {
      newErrors.NIC_Number =
        "Enter a valid NIC number (9 digits + V OR 12 digits)";
    }

    if (inputs.Email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(inputs.Email)) {
      newErrors.Email = "Please enter a valid email address";
    }

    if (
      !/^(070|071|072|074|075|076|077|078)[0-9]{7}$/.test(
        inputs.Phone_Number.trim()
      )
    ) {
      newErrors.Phone_Number =
        "Phone number must start with 070, 071, 072, 074, 075, 076, 077, or 078 and be 10 digits";
    }

    if (!inputs.Address.trim())
      newErrors.Address = "Please enter your address";
    else if (!/^[A-Za-z0-9\s/]+$/.test(inputs.Address.trim())) {
      newErrors.Address =
        "Address can only contain letters, numbers, spaces, and '/'";
    }

    if (!inputs.Location.trim())
      newErrors.Location = "Please enter the location";
    if (!inputs.Grama_Niladhari_Division)
      newErrors.Grama_Niladhari_Division = "Please select a division";
    if (!inputs.Description.trim())
      newErrors.Description = "Please enter the complaint description";
    if (inputs.Captcha.trim().toLowerCase() !== "i am human")
      newErrors.Captcha = "Please type 'I am human'";

    if (inputs.Attach_Files.length > 0) {
      if (inputs.Attach_Files.length > 5) {
        newErrors.Attach_Files = "You can upload up to 5 files only";
      } else {
        inputs.Attach_Files.forEach((file) => {
          if (
            !["image/jpeg", "image/png", "application/pdf"].includes(file.type)
          ) {
            newErrors.Attach_Files = "Only JPG, PNG, or PDF files are allowed";
          }
          if (file.size > 5 * 1024 * 1024) {
            newErrors.Attach_Files = "Each file must be smaller than 5MB";
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
      alert("Submit successful ✅");

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
      setFileLabel("Choose File / No file chosen");
      setErrors({});

      setTimeout(() => setSuccess(false), 2000);
    } catch (err) {
      console.error("Submission failed:", err);
      alert("Submission failed. Please try again.");
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
    setFileLabel("Choose File / No file chosen");
    setErrors({});
  };

  return (
    <div>
      <Nav />
      <div className="complaints-container">
        <h1>Complaint Submission Form</h1>
        <p>Please fill in the form below to submit your complaint</p>

        {success && (
          <div className="success-message">
            ✅ Your complaint has been successfully submitted!
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
              Nature of Complaint <span className="required">*</span>
            </label>
            <select
              name="NatureofComplaint"
              value={inputs.NatureofComplaint}
              onChange={handleChange}
              className="form-select"
            >
              <option value="">Please Select</option>
              <option value="service">Service Issues</option>
              <option value="corruption">Corruption</option>
              <option value="harassment">Harassment</option>
              <option value="discrimination">Discrimination</option>
              <option value="delay">Delays</option>
              <option value="misconduct">Misconduct</option>
              <option value="other">Other</option>
            </select>
            {errors.NatureofComplaint && (
              <div className="error-message">{errors.NatureofComplaint}</div>
            )}
          </div>

          {/* Name & NIC */}
          <div className="form-row">
            <div className="form-group">
              <label>
                Name <span className="required">*</span>
              </label>
              <input
                type="text"
                name="Name"
                value={inputs.Name}
                onChange={handleChange}
                className="form-input"
                placeholder="Enter your full name"
              />
              {errors.Name && (
                <div className="error-message">{errors.Name}</div>
              )}
            </div>

            <div className="form-group">
              <label>
                NIC Number <span className="required">*</span>
              </label>
              <input
                type="text"
                name="NIC_Number"
                value={inputs.NIC_Number}
                onChange={handleChange}
                className="form-input"
                placeholder="e.g., 123456789V or 199012345678"
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
              <label>Email</label>
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
                Phone Number <span className="required">*</span>
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
                Address <span className="required">*</span>
              </label>
              <input
                type="text"
                name="Address"
                value={inputs.Address}
                onChange={handleChange}
                className="form-input"
                placeholder="Your residential address"
              />
              {errors.Address && (
                <div className="error-message">{errors.Address}</div>
              )}
            </div>

            <div className="form-group">
              <label>
                Location <span className="required">*</span>
              </label>
              <input
                type="text"
                name="Location"
                value={inputs.Location}
                onChange={handleChange}
                className="form-input"
                placeholder="Location of the incident"
              />
              {errors.Location && (
                <div className="error-message">{errors.Location}</div>
              )}
            </div>
          </div>

          {/* Division */}
          <div className="form-group">
            <label>
              Grama Niladhari Division <span className="required">*</span>
            </label>
            <select
              name="Grama_Niladhari_Division"
              value={inputs.Grama_Niladhari_Division}
              onChange={handleChange}
              className="form-select"
            >
              <option value="">Please Select</option>
              <option value="welmilla">Welmilla</option>
              <option value="halapitiya">Halapitiya</option>
              <option value="godigamuwaEast">Godigamuwa East</option>
              <option value="palannoruwa">Palannoruwa</option>
              <option value="olaboduwaEast">Olaboduwa East</option>
              <option value="olaboduwaNorth">Olaboduwa North</option>
              <option value="olaboduwaSouth">Olaboduwa South</option>
              <option value="other">Other</option>
            </select>
            {errors.Grama_Niladhari_Division && (
              <div className="error-message">
                {errors.Grama_Niladhari_Division}
              </div>
            )}
          </div>

          {/* File Upload */}
          <div className="form-group">
            <label>Attach Files</label>
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
                📎 Click to upload files or drag and drop
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
              Description <span className="required">*</span>
            </label>
            <textarea
              name="Description"
              value={inputs.Description}
              onChange={handleChange}
              maxLength={500}
              className="form-textarea"
              placeholder="Please provide detailed information about your complaint..."
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
              Verification <span className="required">*</span>
            </label>
            <div className="captcha-instruction">
              Please type "I am human" in the field below to verify you are not
              a robot.
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
              {isSubmitting ? "SUBMITTING..." : "SUBMIT COMPLAINT"}
            </button>
            <button
              type="button"
              onClick={handleClearForm}
              className="btn btn-secondary"
              disabled={isSubmitting}
            >
              CLEAR FORM
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Complaints;