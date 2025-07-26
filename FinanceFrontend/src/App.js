import React from "react";
import { Route, Routes } from "react-router";
import './App.css';
import Home from "./Components/Home/Home";
import AddUser from "./Components/AddUser/AddUser";
import Users from "./Components/UserDetails/Users";
import UpdateUser from "./Components/UpdateUser/UpdateUser";
import Nav from "./Components/Nav/Nav";
import Register from "./Components/Register/Register";
import Login from "./Components/Login/Login";
import ContactUs from "./Components/ContactUs/ContactUs";


function App() {
  return (
    <div className="App">
      <React.Fragment>
        <Nav/>
        <Routes>
          <Route path="/" element={<Home/>}/>
          <Route path="/mainhome" element={<Home/>}/>
          <Route path="/adduser" element={<AddUser/>}/>
          <Route path="/userdetails" element={<Users/>}/>
          <Route path="/updateuser/:id" element={<UpdateUser/>}/>
          <Route path="/register" element={<Register/>}/>
          <Route path="/log" element={<Login/>}/>
          <Route path="/contactus" element={<ContactUs/>}/>

        </Routes>
      </React.Fragment>
    </div>
  );
}

export default App;
