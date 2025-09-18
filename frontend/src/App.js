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
import AdminHome from "./Components/AdminHome/AdminHome";
import Complaints from "./Components/Complaint/Complaints";
import Announcements from './Components/Announcements/Announcements';
import ContactUs from './Components/ContactUs/contactus';

import Assessments from './Components/Assessment/Assessments';
import UpdateAssessment from './Components/Assessment/UpdateAssessment';
import PropertyTax from './Components/Property/PropertyTax';
import PropertyHome from './Components/Property/PropertyHome';
import AddAssessment from './Components/Assessment/AddAssessment';
import PropertyAssessmentDetails from './Components/Property/PropertyAssessmentDetails';
import AddProperty from './Components/Property/AddProperty';


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
          <Route path="/adminHome" element={<AdminHome />} />  
          <Route path="/propertyHome" element={<PropertyHome />} />  
          <Route path="/addproperty" element={<AddProperty />} />  
          <Route path="/propertyassessmentdetails/:part1/:part2" element={<PropertyAssessmentDetails />} />
          <Route path="/propertyassessmentdetails/:part1" element={<PropertyAssessmentDetails />} />
          <Route path="/addassessment" element={<AddAssessment />} />
          <Route path="/assessmentdetails" element={<Assessments/>}/>
          <Route path="/complaint" element={<Complaints />} />
          <Route path="/announcements" element={<Announcements />} />
          <Route path="/updateassessment/:id" element={<UpdateAssessment/>}/>
          <Route path="/contact" element={<ContactUs />} /> 
          <Route path="/propertytax" element={<PropertyTax />} />   

        
        </Routes>
      </React.Fragment>
    </div>
  );
}

export default App;
