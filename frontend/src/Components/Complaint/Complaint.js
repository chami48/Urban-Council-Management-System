import React from "react";
import Nav from "../Nav/Nav";

function Complaint({ user }) {
  if (!user) {
    return <h2>No complaint details available</h2>;
  }

  const { _id, name, gmail, age, address } = user;

  return (
    <>
      <Nav />
      <div style={styles.container}>
        <h1 style={styles.title}>Complaint Details</h1>
        <div style={styles.card}>
          <p><strong>ID:</strong> {_id || "N/A"}</p>
          <p><strong>Name:</strong> {name || "N/A"}</p>
          <p><strong>Email:</strong> {gmail || "N/A"}</p>
          <p><strong>Age:</strong> {age || "N/A"}</p>
          <p><strong>Address:</strong> {address || "N/A"}</p>
        </div>
      </div>
    </>
  );
}

const styles = {
  container: {
    padding: "20px",
    textAlign: "center",
  },
  title: {
    fontSize: "28px",
    marginBottom: "20px",
    color: "#333",
  },
  card: {
    maxWidth: "500px",
    margin: "0 auto",
    background: "#f9f9f9",
    padding: "20px",
    borderRadius: "12px",
    boxShadow: "0px 4px 8px rgba(0,0,0,0.1)",
    textAlign: "left",
    lineHeight: "1.8",
  },
};

export default Complaint;
