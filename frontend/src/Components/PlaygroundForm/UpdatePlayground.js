import React, { useEffect, useState } from 'react';
import axios from "axios";
import { useParams, useNavigate } from 'react-router-dom';
import Nav from "../Nav/Nav";

function UpdateUser() {
  const [inputs, setInputs] = useState({
    eventName: "",
    eventType: "",
    description: "",
    organizerName: "",
    email: "",
    phone: "",
    playgroundType: "",
    expectedAttendees: "",
    eventDate: "",
    startTime: "",
    endTime: "",
    specialRequirement: ""
  });

  const history = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    const fetchHandler = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/users/${id}`);
        setInputs(res.data.user);
      } catch (err) {
        console.error("Error fetching user:", err);
      }
    };
    fetchHandler();
  }, [id]);

  const handleChange = (e) => {
    setInputs((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`http://localhost:5000/users/${id}`, {
        eventName: inputs.eventName,
        eventType: inputs.eventType,
        description: inputs.description,
        organizerName: inputs.organizerName,
        email: inputs.email,
        phone: inputs.phone,
        playgroundType: inputs.playgroundType,
        expectedAttendees: Number(inputs.expectedAttendees),
        eventDate: inputs.eventDate,
        startTime: inputs.startTime,
        endTime: inputs.endTime,
        specialRequirement: inputs.specialRequirement
      });
      history('/userdetails');
    } catch (err) {
      console.error("Update error:", err);
    }
  };

  return (
    <div>
      <Nav />
      <h1>Update Event</h1>
      <form onSubmit={handleSubmit}>
        <label>Event Name</label>
        <input
          type="text"
          name="eventName"
          onChange={handleChange}
          value={inputs.eventName || ""}
          required
        />
        <br />

        <label>Event Type</label>
        <input
          type="text"
          name="eventType"
          onChange={handleChange}
          value={inputs.eventType || ""}
          required
        />
        <br />

        {/* Add all other fields matching your UserModel.js */}
        {/* ... */}

        <button type="submit">Submit</button>
      </form>
    </div>
  );
}

export default UpdateUser;