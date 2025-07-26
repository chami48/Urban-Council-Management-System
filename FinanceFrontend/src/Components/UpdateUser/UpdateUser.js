import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router";
import { useNavigate } from "react-router";

function UpdateUser() {
  const [inputs, setInputs] = useState({});
  const history = useNavigate();
  const id = useParams().id;

  useEffect(() => {
    const fetchHandler = async () => {
      await axios
        .get(`http://localhost:5000/users/${id}`)
        .then((res) => res.data)
        .then((data) => setInputs(data.user));
    };
    fetchHandler();
  }, [id]);

  const sendRequest = async () => {
    await axios.put(`http://localhost:5000/users/${id}`, {
      name: String(inputs.name),
      gmail: String(inputs.gmail),
      age: Number(inputs.age),
      address: String(inputs.address),
    })
    .then((res) => res.data);
  };

  const handleChange = (e) =>{
    setInputs((prevState)=> ({
        ...prevState,
        [e.target.name]: e.target.value,
    }))
};

const handleSubmit = (e)=>{
    e.preventDefault();
    console.log(inputs);
    sendRequest().then(()=> history('/userdetails'))
};

  return (
    <div>
      <div className="form-container">
        <h1>Update User</h1>
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

export default UpdateUser;
