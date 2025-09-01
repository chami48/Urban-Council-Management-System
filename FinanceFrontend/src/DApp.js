import React from "react";
import { Route, Routes } from "react-router";
import './DApp.css';
import Home from "./Components/Home/Home"
import AdminHome from "./Components/AdminHome/AdminHome";
import PropertyHome from "./Components/PropertyHome/PropertyHome";
import AddAssessment from "./Components/AddAssessment/AddAssessment";
import UpdateAssessment from "./Components/UpdateAssessment/UpdateAssessment";
import Register from "./Components/Register/Register";
import Login from "./Components/Login/Login";
import ContactUs from "./Components/ContactUs/ContactUs";
import Assessments from "./Components/AssessmentDetails/Assessments";
import AddProperty from "./Components/AddProperty/AddProperty";
import PropertyAssessmentDetails from "./Components/PropertyAssessmentDetails/PropertyAssessmentDetails";
import HoranaCouncilLanding from "./Components/Landing/HoranaCouncilLanding";
import PropertyTax from "./Components/PropertyTax/PropertyTax";


function DApp() {
  return (
    <div className="App">
      <React.Fragment>
        
        <Routes>
          <Route path="/" element={<HoranaCouncilLanding />}/>
          <Route path="/mainhome" element={<Home />}/>
          <Route path="/adminhome" element={<AdminHome />} />
          <Route path="/propertyhome" element={<PropertyHome />} />
          <Route path="/addproperty" element={<AddProperty />} />
          <Route path="/addassessment" element={<AddAssessment />} />
          <Route path="/assessmentdetails" element={<Assessments />} />
          <Route path="/propertyassessmentdetails/:part1/:part2" element={<PropertyAssessmentDetails />} />
          <Route path="/updateassessment/:id" element={<UpdateAssessment />} />
          <Route path="/register" element={<Register />} />
          <Route path="/log" element={<Login />} />
          <Route path="/contactus" element={<ContactUs />} />
          <Route path="/property-tax" element={<PropertyTax />} />
        </Routes>
      </React.Fragment>
    </div>
  );
}

export default DApp;