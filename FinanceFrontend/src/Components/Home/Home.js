import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Home.css";

function Home() {
  const navigate = useNavigate();

  // Example state for properties
  const [properties, setProperties] = useState([]); // Initially empty

  return (
    <div className="home-container">
      <h2 className="home-title">My Properties</h2>

      <button
        className="btn-add-property"
        onClick={() => navigate("/addproperty")}
      >
        Add New Property
      </button>

      {properties.length === 0 ? (
        <p className="no-properties">No property to display</p>
      ) : (
        <ul className="property-list">
          {properties.map((property, index) => (
            <li className="property-item" key={index}>
              <div className="property-title">{property.title}</div>
              <div className="property-details">
                ${property.price} — {property.location}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default Home;
