import React from 'react';
import { Routes, Route } from 'react-router-dom';
import './App.css';
import Home from './Components/Home/Home';
import AddUser from "./Components/AddUser/AddUser";
import Users from "./Components/UserDetails/Users";
import UpdateUser from './Components/UpdateUser/UpdateUser';
import CrematoriumForm from "./Components/CrematoriumForm/CrematoriumForm";
import Adminbooking from "./Components/Admincheck/Adminbooking";
import Displaybooking from "./Components/Displaybooking/Displaybooking";
import HoranaCouncilLanding from "./Components/Landing/oranaCouncilLanding";

function App() {
  return (
    <div className="App">
      <React.Fragment>
        <Routes>
          <Route path="/" element={<HoranaCouncilLanding />} />
          <Route path="/mainhome" element={<Home />} />
          <Route path="/adduser" element={<AddUser />} />
          <Route path="/userdetails" element={<Users />} />
          <Route path="/userdetails/:id" element={<UpdateUser />} />
          <Route path="/crematorium" element={<CrematoriumForm />} />
          <Route path="/admincheck" element={<Adminbooking />} /> 
          <Route path="/displaybooking" element={<Displaybooking />} /> 
        </Routes>
      </React.Fragment>
    </div>
  );
}

export default App;
