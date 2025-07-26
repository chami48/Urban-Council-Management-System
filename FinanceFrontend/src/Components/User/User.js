import React from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './User.css';

function User(props) {
  const { _id, name, gmail, age, address } = props.user;
  
  const history = useNavigate();
  
  const deleteHandler = async () => {
    const userConfirmed = window.confirm(
      "Are you sure you want to delete this user?"
    );
    
    if (userConfirmed) {
      try {
        await axios.delete(`http://localhost:5000/users/${_id}`);
        window.alert("User Details deleted successfully!");
        history("/userdetails");
        window.location.reload();
      } catch (err) {
        console.error("Error deleting user details", err);
      }
    }
  };

  return (
    <div className="user-card">
      <div className="user-header">
        <h3 className="user-title">User Profile</h3>
      </div>
      
      <div className="user-content">
        <div className="user-info">
          <div className="info-item">
            <div className="info-indicator name-indicator"></div>
            <div className="info-details">
              <span className="info-label">Name</span>
              <p className="info-value">{name}</p>
            </div>
          </div>
          
          <div className="info-item">
            <div className="info-indicator email-indicator"></div>
            <div className="info-details">
              <span className="info-label">Email</span>
              <p className="info-value">{gmail}</p>
            </div>
          </div>
          
          <div className="info-item">
            <div className="info-indicator age-indicator"></div>
            <div className="info-details">
              <span className="info-label">Age</span>
              <p className="info-value">{age} years</p>
            </div>
          </div>
          
          <div className="info-item">
            <div className="info-indicator address-indicator"></div>
            <div className="info-details">
              <span className="info-label">Address</span>
              <p className="info-value">{address}</p>
            </div>
          </div>
        </div>
        
        <div className="user-actions">
          <Link to={`/updateuser/${_id}`} className="btn btn-update">
            Update
          </Link>
          <button onClick={deleteHandler} className="btn btn-delete">
            Delete
          </button>
        </div>
      </div>
      
      <div className="user-accent"></div>
    </div>
  );
}

export default User;