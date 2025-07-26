import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';


function Register() {
    const history = useNavigate();
    const [user, setUser] = useState({
    name: '',
    gmail: '',
    password: '',
  });

  const handleChange = (e) => {
    const {name,value} = e.target;
    setUser((prevUser) => ({...prevUser,[name]:value}));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    sendRequest().then(()=> {
        alert('User registered successfully!');
        history("/userdetails");
    }).catch ((err)=>{
        alert('Registration failed: ' + err.message);
    });
    };
    const sendRequest = async() => {
        await axios .post("http://localhost:5000/register", {
            name:String(user.name),
            gmail:String(user.gmail),
            password: String(user.password),
        })
        .then((res) => res.data);
    };

  return (
    <div style={{ maxWidth: "400px", margin: "auto" }}>
      <h2>User Registration</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Name:</label><br />
          <input
            type="text"
            name="name"
            value={user.name}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Email:</label><br />
          <input
            type="email"
            name="gmail"
            value={user.email}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Password:</label><br />
          <input
            type="password"
            name="password"
            value={user.password}
            onChange={handleChange}
            required
          />
        </div>
        <br />
        <button type="submit">Register</button>
      </form>
    </div>
  );
};

export default Register;
