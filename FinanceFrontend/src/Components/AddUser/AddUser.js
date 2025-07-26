import React, { useState }from 'react'
import { useNavigate } from 'react-router-dom';
import axios from "axios";
import './AddUser.css';

function AddUser() {

    const history = useNavigate();
    const [inputs, setInputs] = useState({
        name:"",
        gmail:"",
        age:"",
        address:"",
    });

const handleChange = (e) =>{
    setInputs((prevState)=> ({
        ...prevState,
        [e.target.name]: e.target.value,
    }))
};

const handleSubmit = async (e)=>{
    e.preventDefault();
    console.log(inputs);
    await sendRequest();
    history('/userdetails');
};

const sendRequest = async ()=>{
    await axios.post("http://localhost:5000/users", {
        name: String (inputs.name),
        gmail: String (inputs.gmail),
        age: Number (inputs.age),
        address: String (inputs.address),
    }).then(res => res.data);
}

  return (
    <div>
      <div className="form-container">
        <h2>User Details</h2>
        <form onSubmit ={handleSubmit}>
          <label htmlFor="name">Name:</label><br></br>
          <input type="text" id="name" name="name" value={inputs.name} onChange={handleChange} required /><br></br>

          <label htmlFor="gmail">Gmail:</label><br></br>
          <input type="email" id="gmail" name="gmail" value={inputs.gmail} onChange={handleChange} required /><br></br>

          <label htmlFor="age">Age:</label><br></br>
          <input type="number" id="age" name="age" value={inputs.age} onChange={handleChange} required /><br></br>

          <label htmlFor="address">Address:</label><br></br>
          <textarea id="address" name="address" value={inputs.address} onChange={handleChange} rows="3" required /><br></br>

          <button type="submit">Submit</button>
        </form>
      </div>
    </div>
  );
}

export default AddUser;
