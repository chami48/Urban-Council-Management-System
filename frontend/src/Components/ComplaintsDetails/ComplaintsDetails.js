import React, { useEffect, useState } from 'react';
import Nav from '../Nav/Nav';
import axios from 'axios';

const URL = "http://localhost:5000/users";

const fetchHandler = async () => {
  return await axios.get(URL).then((res) => res.data);
};

function ComplaintsDetails() {
  const [users, setUsers] = useState([]);
  const [showFormId, setShowFormId] = useState(null); // which complaint's update form is open
  const [message, setMessage] = useState("");
  const [searchTerm, setSearchTerm] = useState(""); // ✅ search state

  useEffect(() => {
    fetchHandler().then((data) => setUsers(data.users));
  }, []);

  // ✅ Delete complaint function
  const handleDelete = async (id) => {
    try {
      await axios.delete(`${URL}/${id}`);
      setUsers((prevUsers) => prevUsers.filter((user) => user._id !== id));
    } catch (err) {
      console.error("Error deleting complaint:", err);
    }
  };

  // ✅ Send message function
  const handleSendMessage = async (phoneNumber) => {
    if (!message.trim()) {
      alert("Please enter a message.");
      return;
    }
    try {
      await axios.post("http://localhost:5000/send-sms", {
        phone: phoneNumber,
        text: message
      });
      alert(`Message sent to ${phoneNumber}`);
      setMessage("");
      setShowFormId(null);
    } catch (err) {
      console.error("Error sending message:", err);
      alert("Failed to send message.");
    }
  };

  // ✅ Filtered complaints based on search term
  const filteredUsers = users.filter((user) =>
    user.NatureofComplaint.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <Nav />
      <h1 style={{ textAlign: "center", margin: "20px 0" }}>Complaint Details</h1>

      {/* ✅ Search Bar */}
      <div style={{ display: "flex", justifyContent: "center", marginBottom: "20px" }}>
        <input
          type="text"
          placeholder="Search by Nature of Complaint..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{
            padding: "10px",
            width: "300px",
            border: "1px solid #ccc",
            borderRadius: "5px"
          }}
        />
      </div>

      <div style={{ display: "flex", flexWrap: "wrap", gap: "20px", justifyContent: "center" }}>
        {filteredUsers.length > 0 ? (
          filteredUsers.map((user, i) => (
            <div
              key={i}
              style={{
                border: "1px solid #ccc",
                borderRadius: "10px",
                padding: "15px",
                width: "300px",
                background: "#f9f9f9",
                boxShadow: "0px 2px 8px rgba(0,0,0,0.1)"
              }}
            >
              <h3 style={{ color: "#333" }}>{user.NatureofComplaint}</h3>
              <p><strong>Name:</strong> {user.Name}</p>
              <p><strong>NIC:</strong> {user.NIC_Number}</p>
              <p><strong>Email:</strong> {user.Email || "N/A"}</p>
              <p><strong>Phone:</strong> {user.Phone_Number}</p>
              <p><strong>Address:</strong> {user.Address}</p>
              <p><strong>Location:</strong> {user.Location}</p>
              <p><strong>GN Division:</strong> {user.Grama_Niladhari_Division}</p>
              <p><strong>Description:</strong> {user.Description}</p>

              {user.Attach_Files && user.Attach_Files.length > 0 && (
                <div>
                  <strong>Attachments:</strong>
                  {user.Attach_Files.map((file, index) => (
                    <div key={index}>
                      <a href={file} target="_blank" rel="noopener noreferrer">
                        View File {index + 1}
                      </a>
                    </div>
                  ))}
                </div>
              )}

              <div style={{ marginTop: "15px", display: "flex", justifyContent: "space-between" }}>
                <button 
                  style={{ backgroundColor: "#4CAF50", color: "white", border: "none", padding: "8px 12px", borderRadius: "5px", cursor: "pointer" }}
                  onClick={() => setShowFormId(showFormId === user._id ? null : user._id)}
                >
                  Update
                </button>
                <button 
                  style={{ backgroundColor: "#f44336", color: "white", border: "none", padding: "8px 12px", borderRadius: "5px", cursor: "pointer" }}
                  onClick={() => handleDelete(user._id)}
                >
                  Delete
                </button>
              </div>

              {showFormId === user._id && (
                <div style={{ marginTop: "15px" }}>
                  <textarea
                    placeholder={`Write a message to ${user.Phone_Number}`}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    style={{
                      width: "100%",
                      padding: "8px",
                      borderRadius: "5px",
                      border: "1px solid #ccc",
                      resize: "none"
                    }}
                    rows={3}
                  />
                  <button
                    style={{
                      marginTop: "8px",
                      backgroundColor: "#2196F3",
                      color: "white",
                      border: "none",
                      padding: "8px 12px",
                      borderRadius: "5px",
                      cursor: "pointer",
                      width: "100%"
                    }}
                    onClick={() => handleSendMessage(user.Phone_Number)}
                  >
                    Send Message
                  </button>
                </div>
              )}
            </div>
          ))
        ) : (
          <p style={{ textAlign: "center", color: "#888" }}>No complaints found.</p>
        )}
      </div>
    </div>
  );
}

export default ComplaintsDetails;
