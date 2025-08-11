import React from "react";
import { Route, Routes } from "react-router";
import './App.css';
import Home from "./Components/Home/Home";
import AddAssessment from "./Components/AddAssessment/AddAssessment";
import UpdateAssessment from "./Components/UpdateAssessment/UpdateAssessment";
import Nav from "./Components/Nav/Nav";
import Register from "./Components/Register/Register";
import Login from "./Components/Login/Login";
import ContactUs from "./Components/ContactUs/ContactUs";
import Assessments from "./Components/AssessmentDetails/Assessments";
import AddProperty from "./Components/AddProperty/AddProperty";

function App() {
  return (
    <div className="App">
      <React.Fragment>
        <Nav />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/mainhome" element={<Home />} />
          <Route path="/addproperty" element={<AddProperty />} />
          <Route path="/addassessment" element={<AddAssessment />} />
          <Route path="/assessmentdetails" element={<Assessments />} />
          <Route path="/updateassessment/:id" element={<UpdateAssessment />} />
          <Route path="/register" element={<Register />} />
          <Route path="/log" element={<Login />} />
          <Route path="/contactus" element={<ContactUs />} />
        </Routes>
      </React.Fragment>
    </div>
  );
}

export default App;
