import React, { useState, useEffect } from "react";
import axios from "axios";
// import "./Annoucements.css";


const API = "http://localhost:5000/announcements";

function Announcements() {
  const [inputs, setInputs] = useState({
    description: "",
    date: "",
    time: "",
    area: ""
  });
  const [announcements, setAnnouncements] = useState([]);
  const [editId, setEditId] = useState(null);

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  const fetchAnnouncements = async () => {
    const res = await axios.get(API);
    setAnnouncements(res.data);
  };

  const handleChange = (e) => {
    setInputs({ ...inputs, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    if (editId) {
      await axios.put(`${API}/${editId}`, inputs);
      setEditId(null);
    } else {
      await axios.post(API, inputs);
    }
    setInputs({ description: "", date: "", time: "", area: "" });
    fetchAnnouncements();
  };

  const handleDelete = async (id) => {
    await axios.delete(`${API}/${id}`);
    fetchAnnouncements();
  };

  const handleEdit = (item) => {
    setInputs(item);
    setEditId(item._id);
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Announcement Page</h2>
      <input name="description" placeholder="Description" value={inputs.description} onChange={handleChange} /> <br />
      <input name="date" type="date" value={inputs.date} onChange={handleChange} /> <br />
      <input name="time" type="time" value={inputs.time} onChange={handleChange} /> <br />
      <input name="area" placeholder="Area" value={inputs.area} onChange={handleChange} /> <br />

      <button onClick={handleSubmit}>{editId ? "Update" : "Submit"}</button>

      <h3>All Announcements</h3>
      <ul>
        {announcements.map((item) => (
          <li key={item._id}>
            {item.description} - {item.date} - {item.time} - {item.area}
            <button onClick={() => handleEdit(item)}>Update</button>
            <button onClick={() => handleDelete(item._id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Announcements;
