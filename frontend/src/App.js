import React from 'react';
import { Routes, Route } from 'react-router-dom';
import './App.css';

// Imports
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
import PropertyTaxCalculator from './Components/Property/PropertyTaxCalculator';
import CitizenApply from './Components/Shop/CitizenApply';
import OfficerDashboard from './Components/Shop/OfficerDashboard';
import ShopPayment from "./Components/Shop/ShopPayment";
import MyApplication from "./Components/Shop/MyApplication";
import ShopRentalInstructionPage from './Components/Shop/ShopRentalInstructionPage';

function App() {
  return (
    <div className="App">
      <React.Fragment>
        <Routes>
          {/* Landing page */}
          <Route path="/" element={<HoranaCouncilLanding />} />

          {/* Main Home */}
          <Route path="/mainhome" element={<Home />} />

          {/* User Management */}
          <Route path="/adduser" element={<AddUser />} />
          <Route path="/userdetails" element={<Users />} />
          <Route path="/userdetails/:id" element={<UpdateUser />} />

          {/* Crematorium */}
          <Route path="/crematorium" element={<CrematoriumForm />} />
          <Route path="/admincheck" element={<Adminbooking />} /> 
          <Route path="/displaybooking" element={<Displaybooking />} />

          {/* Admin / Complaints / Announcements */}
          <Route path="/adminHome" element={<AdminHome />} />  
          <Route path="/complaint" element={<Complaints />} />
          <Route path="/announcements" element={<Announcements />} />

          {/* Property & Assessments */}
          <Route path="/propertyHome" element={<PropertyHome />} />  
          <Route path="/addproperty" element={<AddProperty />} />  
          <Route path="/propertyassessmentdetails/:part1/:part2" element={<PropertyAssessmentDetails />} />
          <Route path="/propertyassessmentdetails/:part1" element={<PropertyAssessmentDetails />} />
          <Route path="/addassessment" element={<AddAssessment />} />
          <Route path="/assessmentdetails" element={<Assessments/>}/>
          <Route path="/updateassessment/:id" element={<UpdateAssessment/>}/>

          {/* Other */}
          <Route path="/contact" element={<ContactUs />} /> 
          <Route path="/propertytax" element={<PropertyTax />} />   
          <Route path="/propertyTaxCalculation/:part1/:part2" element={<PropertyTaxCalculator />} />

          {/* Shop Registration */}
          <Route path="/citizen-apply" element={<CitizenApply />} />
          <Route path="/my-applications" element={<MyApplication />} />
          <Route path="/officer" element={<OfficerDashboard />} />
          <Route path="/pay" element={<ShopPayment />} />
          <Route path="/shop-rental-instructions" element={< ShopRentalInstructionPage/>} />
        </Routes>
      </React.Fragment>
    </div>
  );
}

export default App;
