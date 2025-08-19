//import './App.css';
import Home from "./Components/Home/Home";
import React from 'react';
import Complaints from "./Components/Complaints/Complaints";
import ComplaintsDetails from "./Components/ComplaintsDetails/ComplaintsDetails";
import ContactUs from "./Components/ContactUs/contactus";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Announcements from './Components/Announcements/Announcements';

function App() {
  return (
     <div className="App">
            <React.Fragment>

    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/mainhome" element={<Home />} />
           <Route path="/complaints" element={<Complaints />} />
        <Route path="/complaints-details" element={<ComplaintsDetails />} />
        <Route path="/announcement" element={<Announcements />} />
        <Route path="/contactus" element={<ContactUs />} />
      </Routes>
    </BrowserRouter>
    </React.Fragment>
      </div>
  
  );
}

export default App;