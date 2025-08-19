import React from 'react';
import Nav from '../Nav/Nav';

function Complaint(props) {

   const {_id,name,gmail,age,address} = props.user;

  return (
    <div>
      
      <h1>Complaints Display</h1>
      <br></br>
      <h2>ID :{_id}</h2>
      <h2>Name :{name}</h2>
      <h2>Gmail :{gmail}</h2>
      <h2>Age :{age}</h2>
      <h2>Address :{address}</h2>


    </div>
  )
}

export default Complaint
