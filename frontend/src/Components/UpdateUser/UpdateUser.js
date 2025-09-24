// src/Components/UpdateUser/UpdateUser.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import "./UpdateUser.css";
import Swal from "sweetalert2";
// optional (once globally): import "sweetalert2/dist/sweetalert2.min.css";

function UpdateUser() {
  const [inputs, setInputs] = useState({
    name: "",
    email: "",
    password: "",
    address: "",
    phone: "",
  });
  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    const fetchData = async () => {
      try {
        Swal.fire({
          title: "Loading…",
          allowOutsideClick: false,
          didOpen: () => Swal.showLoading(),
        });

        const res = await axios.get(`http://localhost:5000/users/${id}`, {
          withCredentials: true,
        });
        const { name, email, address, phone } = res.data.user || {};
        // do not prefill password for security; leave blank
        setInputs({ name: name || "", email: email || "", password: "", address: address || "", phone: phone || "" });
        Swal.close();
      } catch (err) {
        Swal.close();
        await Swal.fire("Error", "Failed to load user details.", "error");
      }
    };
    fetchData();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setInputs((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Only send password if user typed one
    const payload = { ...inputs };
    if (!payload.password) delete payload.password;

    try {
      Swal.fire({
        title: "Saving…",
        allowOutsideClick: false,
        didOpen: () => Swal.showLoading(),
      });

      await axios.put(`http://localhost:5000/users/${id}`, payload, {
        withCredentials: true,
      });

      Swal.close();
      await Swal.fire("Updated", "User updated successfully!", "success");
      navigate("/viewusers");
    } catch (err) {
      Swal.close();
      const msg = err?.response?.data?.message || "Update failed";
      await Swal.fire("Error", msg, "error");
    }
  };

  const handleDelete = async () => {
    const res = await Swal.fire({
      title: "Delete this user?",
      text: "This action cannot be undone.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete",
      cancelButtonText: "Cancel",
      confirmButtonColor: "#d33",
    });

    if (!res.isConfirmed) return;

    try {
      Swal.fire({
        title: "Deleting…",
        allowOutsideClick: false,
        didOpen: () => Swal.showLoading(),
      });

      await axios.delete(`http://localhost:5000/users/${id}`, {
        withCredentials: true,
      });

      Swal.close();
      await Swal.fire("Deleted", "User removed successfully!", "success");
      navigate("/viewusers");
    } catch (err) {
      Swal.close();
      const msg = err?.response?.data?.message || "Delete failed";
      await Swal.fire("Error", msg, "error");
    }
  };

  const handleCancel = () => navigate("/viewusers");

  return (
    <div className="form-container">
      <h2>Update User Details</h2>
      <form onSubmit={handleSubmit} className="user-form">
        <label>Name:</label>
        <input
          type="text"
          name="name"
          value={inputs.name}
          onChange={handleChange}
          required
        />

        <label>Email:</label>
        <input
          type="email"
          name="email"
          value={inputs.email}
          onChange={handleChange}
          required
        />

        <label>New Password (optional):</label>
        <input
          type="password"
          name="password"
          value={inputs.password}
          onChange={handleChange}
          placeholder="Leave blank to keep current"
        />

        <label>Address:</label>
        <input
          type="text"
          name="address"
          value={inputs.address}
          onChange={handleChange}
          required
        />

        <label>Phone:</label>
        <input
          type="text"
          name="phone"
          value={inputs.phone}
          onChange={handleChange}
          required
        />

        <div className="actions-row">
          <button type="submit">Update</button>
          <button
            type="button"
            onClick={handleDelete}
            style={{ backgroundColor: "#d33", color: "#fff" }}
          >
            Delete
          </button>
          <button
            type="button"
            onClick={handleCancel}
            className="secondary-btn"
            style={{ marginLeft: "auto" }}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}

export default UpdateUser;
