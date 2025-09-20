// src/Components/UpdateUser/UpdateUser.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import './UpdateUser.css';

function UpdateUser() {
  const [inputs, setInputs] = useState({
    name: '', email: '', password: '', address: '', phone: ''
  });
  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/users/${id}`);
        const { name, email, address, phone } = res.data.user;
        // do not prefill password for security; leave blank
        setInputs({ name, email, password: '', address, phone });
      } catch (err) {
        console.error(err);
      }
    };
    fetchData();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setInputs(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Only send password if user typed one
    const payload = { ...inputs };
    if (!payload.password) delete payload.password;

    try {
      await axios.put(`http://localhost:5000/users/${id}`, payload);
      navigate('/viewusers');
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="form-container">
      <h2>Update User Details</h2>
      <form onSubmit={handleSubmit} className="user-form">
        <label>Name:</label>
        <input type="text" name="name" value={inputs.name} onChange={handleChange} required />

        <label>Email:</label>
        <input type="email" name="email" value={inputs.email} onChange={handleChange} required />

        <label>New Password (optional):</label>
        <input type="password" name="password" value={inputs.password} onChange={handleChange} placeholder="Leave blank to keep current" />

        <label>Address:</label>
        <input type="text" name="address" value={inputs.address} onChange={handleChange} required />

        <label>Phone:</label>
        <input type="text" name="phone" value={inputs.phone} onChange={handleChange} required />

        <button type="submit">Update</button>
      </form>
    </div>
  );
}

export default UpdateUser;
