import React, { useState } from "react";
import Nav from "../Nav/Nav";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./complaints.css";

function Complaints() {
  const navigate = useNavigate();

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

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (name === "Description") {
      setCharCount(value.length);
    }

    if (name === "Attach_Files") {
      const filesArray = files ? Array.from(files) : [];
      setFileLabel(
        filesArray.length === 1
          ? filesArray[0].name
          : `${filesArray.length} files selected`
      );
      setInputs({ ...inputs, Attach_Files: filesArray });
      return;
    }

    setInputs({ ...inputs, [name]: value });
  };

  const validateForm = () => {
    let newErrors = {};
    if (!inputs.NatureofComplaint)
      newErrors.NatureofComplaint = "Please select the nature of complaint";
    if (!inputs.Name.trim()) newErrors.Name = "Please enter your name";
    if (!/^[0-9]{9}[vVxX]$|^[0-9]{12}$/.test(inputs.NIC_Number.trim()))
      newErrors.NIC_Number = "Enter a valid NIC number";
    if (inputs.Email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(inputs.Email))
      newErrors.Email = "Please enter a valid email address";
    if (!/^0[0-9]{9}$/.test(inputs.Phone_Number.trim()))
      newErrors.Phone_Number = "Enter a valid phone number (0xxxxxxxxx)";
    if (!inputs.Address.trim()) newErrors.Address = "Please enter your address";
    if (!inputs.Location.trim()) newErrors.Location = "Please enter the location";
    if (!inputs.Grama_Niladhari_Division)
      newErrors.Grama_Niladhari_Division = "Please select a division";
    if (!inputs.Description.trim())
      newErrors.Description = "Please enter the complaint description";
    if (inputs.Captcha.trim().toLowerCase() !== "i am human")
      newErrors.Captcha = "Please type 'I am human'";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const sendRequest = async () => {
    const formData = new FormData();

    formData.append("NatureofComplaint", inputs.NatureofComplaint);
    formData.append("Name", inputs.Name);
    formData.append("NIC_Number", inputs.NIC_Number);
    formData.append("Email", inputs.Email);
    formData.append("Phone_Number", inputs.Phone_Number);
    formData.append("Address", inputs.Address);
    formData.append("Location", inputs.Location);
    formData.append("Grama_Niladhari_Division", inputs.Grama_Niladhari_Division);
    formData.append("Description", inputs.Description);

    inputs.Attach_Files.forEach((file) => {
      formData.append("Attach_Files", file);
    });

    try {
      const response = await axios.post("http://localhost:5000/users", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return response.data;
    } catch (error) {
      console.error("Error submitting form:", error);
      throw error;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      await sendRequest();
      setSuccess(true);
      alert("Submit successful"); // ✅ Alert message here

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

      setTimeout(() => {
        setSuccess(false);
        // navigate("/complaints-details"); // ❌ Removed redirect so it stays on this page
      }, 2000);
    } catch (error) {
      console.error("Submission failed:", error);
    }
  };

  return (
    <div>
      <Nav />
      <div className="container">
        <div className="header">
          <h1>Complaint Submission Form</h1>
          <p>Please fill in the form</p>
        </div>

        <div className="form-container">
          {success && (
            <div className="success-message">
              Your complaint has been successfully submitted!
            </div>
          )}

          <form onSubmit={handleSubmit} encType="multipart/form-data">
            {/* Nature of Complaint */}
            <div className="form-group">
              <label>Nature of Complaint *</label>
              <select
                name="NatureofComplaint"
                value={inputs.NatureofComplaint}
                onChange={handleChange}
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
                <label>Name *</label>
                <input
                  type="text"
                  name="Name"
                  value={inputs.Name}
                  onChange={handleChange}
                />
                {errors.Name && <div className="error-message">{errors.Name}</div>}
              </div>
              <div className="form-group">
                <label>NIC Number *</label>
                <input
                  type="text"
                  name="NIC_Number"
                  value={inputs.NIC_Number}
                  onChange={handleChange}
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
                />
                {errors.Email && <div className="error-message">{errors.Email}</div>}
              </div>
              <div className="form-group">
                <label>Phone Number *</label>
                <input
                  type="tel"
                  name="Phone_Number"
                  value={inputs.Phone_Number}
                  onChange={handleChange}
                />
                {errors.Phone_Number && (
                  <div className="error-message">{errors.Phone_Number}</div>
                )}
              </div>
            </div>

            {/* Address & Location */}
            <div className="form-row">
              <div className="form-group">
                <label>Address *</label>
                <input
                  type="text"
                  name="Address"
                  value={inputs.Address}
                  onChange={handleChange}
                />
                {errors.Address && (
                  <div className="error-message">{errors.Address}</div>
                )}
              </div>
              <div className="form-group">
                <label>Location *</label>
                <input
                  type="text"
                  name="Location"
                  value={inputs.Location}
                  onChange={handleChange}
                />
                {errors.Location && (
                  <div className="error-message">{errors.Location}</div>
                )}
              </div>
            </div>

            {/* Division & Files */}
            <div className="form-row">
              <div className="form-group">
                <label>Grama Niladhari Division *</label>
                <select
                  name="Grama_Niladhari_Division"
                  value={inputs.Grama_Niladhari_Division}
                  onChange={handleChange}
                >
                  <option value="">Please Select</option>
                  <option value="colombo1">Colombo 01</option>
                  <option value="colombo2">Colombo 02</option>
                  <option value="colombo3">Colombo 03</option>
                  <option value="gampaha1">Gampaha 01</option>
                  <option value="gampaha2">Gampaha 02</option>
                  <option value="kalutara1">Kalutara 01</option>
                  <option value="kalutara2">Kalutara 02</option>
                  <option value="other">Other</option>
                </select>
                {errors.Grama_Niladhari_Division && (
                  <div className="error-message">{errors.Grama_Niladhari_Division}</div>
                )}
              </div>

              <div className="form-group">
                <label>Attach Files</label>
                <input
                  type="file"
                  name="Attach_Files"
                  multiple
                  onChange={handleChange}
                />
                <span>{fileLabel}</span>
              </div>
            </div>

            {/* Description */}
            <div className="form-group">
              <label>Description *</label>
              <textarea
                name="Description"
                value={inputs.Description}
                onChange={handleChange}
                maxLength={500}
              />
              <div>{charCount}/500</div>
              {errors.Description && (
                <div className="error-message">{errors.Description}</div>
              )}
            </div>

            {/* Captcha */}
            <div className="form-group">
              <label>Enter "I am human" *</label>
              <input
                type="text"
                name="Captcha"
                value={inputs.Captcha}
                onChange={handleChange}
              />
              {errors.Captcha && (
                <div className="error-message">{errors.Captcha}</div>
              )}
            </div>

            {/* Buttons */}
            <div className="button-group">
              <button type="submit" className="btn btn-submit">
                Submit Complaint
              </button>
              <button
                type="button"
                className="btn btn-clear"
                onClick={() => window.location.reload()}
              >
                Clear Form
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Complaints;
