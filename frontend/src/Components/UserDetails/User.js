// src/Components/UserDetails/User.js
import React, { useEffect } from 'react'
import Nav from '../Nav/Nav'
import axios from "axios";
import { useState } from 'react';
import User from '../User/User';


const URL = "http://Localhost:5000/users";

const fetchHandler = async () => {
    return await axios.get(URL)
        .then((response) => response.data);
}

function UserList() {

    const [users, setUsers] = useState([]);
    useEffect(() => {
        fetchHandler()
            .then((data) => {
                setUsers(data.users);
            })
            .catch((error) => {
                console.error("Error fetching users:", error);
            });
    }, []);

  return (
    <div>
        <Nav/>
      <h1>User Details </h1>
      <div>
        {users && users.map((user,i) => (
          <div key={i}>  
          <User users={user} />
            <p>Name: {user.name}</p> 
            <p>Email: {user.email}</p>
            <p>Address: {user.address}</p>      
            <p>Phone: {user.phone}</p>
            <hr />  
       
          </div>
        ))}
      </div>

      
    </div>
  )
}

export default UserList;
