// src/Components/User/User.js
import React from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function User({ users = {}, refreshUsers }) {
  const { _id, name, email } = users;
  const navigate = useNavigate();

  // const deleteHandler = async () => {
  //   try {
  //     await axios.delete(`http://localhost:5000/users/${_id}`);
  //     console.log('User deleted');

  //     // Option 1: Navigate back to list
  //     navigate('/viewusers');

  //     // Option 2: Or, if parent passes refresh function, just refresh
  //     // refreshUsers();
  //   } catch (err) {
  //     console.error('Delete failed:', err);
  //   }
  // };



const deleteHandler = async () => {
  try {
    await axios.delete(`http://localhost:5000/users/${_id}`);
    console.log('User deleted');

    // Reload the page
    window.location.reload();
  } catch (err) {
    console.error('Delete failed:', err);
  }
};



  return (
    <div>
      <h1>User Details Display</h1>
      <h1>ID : {_id}</h1>
      <h1>Name : {name}</h1>
      <h1>Email : {email}</h1>

      <Link to={`/viewusers/${_id}`}>
        <button>Update</button>
      </Link>
      <button onClick={deleteHandler}>Delete</button>
    </div>
  );
}

export default User;
