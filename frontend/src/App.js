import React from 'react';
import { Routes, Route } from 'react-router-dom';
import './App.css';

import Home from './Components/Home/Home';

// Playground booking pages
import AddUser from './Components/PlaygroundForm/PlaygroundFrom';      // create form page (default export)
import Users from './Components/PlaygroundForm/pUsers';                 // list page (this file below)
import UpdateUser from './Components/PlaygroundForm/UpdatePlayground';  // update page

// Other features (unchanged)
import CrematoriumForm from './Components/CrematoriumForm/CrematoriumForm';
import Adminbooking from './Components/Admincheck/Adminbooking';
import Displaybooking from './Components/Displaybooking/Displaybooking';
import HoranaCouncilLanding from './Components/Landing/oranaCouncilLanding';
import AdminHome from './Components/AdminHome/AdminHome';
import AddProperty from './Components/Property/AddProperty';
import PropertyAssessmentDetails from './Components/Property/PropertyAssessmentDetails';
import PropertyHome from './Components/Property/PropertyHome';
import AddAssessment from './Components/Assessment/AddAssessment';
import Complaints from './Components/Complaint/Complaints';
import Announcements from './Components/Announcements/Announcements';
import ContactUs from './Components/ContactUs/contactus';
import ServicesChatbot from './Components/chatbot/ServicesChatbot';
import ComplaintsDetails from './Components/Complaint/ComplaintsDetails';
import UpdateAssessment from './Components/Assessment/UpdateAssessment';
import PropertyTax from './Components/Property/PropertyTax';
import Assessments from './Components/Assessment/Assessments';

function App() {
  return (
    <div className="App">
      <React.Fragment>
        <Routes>
          <Route path="/" element={<HoranaCouncilLanding />} />
          <Route path="/mainhome" element={<Home />} />

          {/* Playground booking */}
          <Route path="/playgroundFrom" element={<AddUser />} />   {/* create */}
          <Route path="/userdetails" element={<Users />} />        {/* list */}
          <Route path="/userdetails/:id" element={<UpdateUser />} /> {/* edit */}

          {/* Other routes (unchanged) */}
          <Route path="/crematorium" element={<CrematoriumForm />} />
          <Route path="/admincheck" element={<Adminbooking />} />
          <Route path="/displaybooking" element={<Displaybooking />} />
          <Route path="/adminHome" element={<AdminHome />} />
          <Route path="/propertyHome" element={<PropertyHome />} />
          <Route path="/addproperty" element={<AddProperty />} />
          <Route path="/propertyassessmentdetails/:part1/:part2" element={<PropertyAssessmentDetails />} />
          <Route path="/propertyassessmentdetails/:part1" element={<PropertyAssessmentDetails />} />
          <Route path="/addassessment" element={<AddAssessment />} />
          <Route path="/complaint" element={<Complaints />} />
          <Route path="/announcements" element={<Announcements />} />
          <Route path="/contact" element={<ContactUs />} />
          <Route path="/chatbot" element={<ServicesChatbot />} />
          <Route path="/complaintsDetails" element={<ComplaintsDetails />} />
          <Route path="/updateassessment/:id" element={<UpdateAssessment />} />
          <Route path="/propertytax" element={<PropertyTax />} />
          <Route path="/assessmentdetails" element={<Assessments />} />
        </Routes>
      </React.Fragment>
    </div>
  );
}

export default App;
