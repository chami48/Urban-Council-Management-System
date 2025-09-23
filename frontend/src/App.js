

import React from 'react';
import { Routes, Route } from 'react-router-dom';
import './App.css';

import Home from './Components/Home/Home';

// Playground booking pages - corrected imports to match usage
import AddPlayground from './Components/PlaygroundForm/PlaygroundFrom';      // create form page
import Playgrounds from './Components/PlaygroundForm/pUsers';                 // list page
import UpdatePlayground from './Components/PlaygroundForm/UpdatePlayground';
import MyBookings from "./Components/MyBookings/MyBookings";  // update page

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
import PropertyTaxCalculator from './Components/Property/PropertyTaxCalculator';
import CitizenApply from './Components/Shop/CitizenApply';
import OfficerDashboard from './Components/Shop/OfficerDashboard';
import ShopPayment from "./Components/Shop/ShopPayment";
import MyApplication from "./Components/Shop/MyApplication";
import ShopRentalInstructionPage from './Components/Shop/ShopRentalInstructionPage';
import PaymentDetailsPage from './Components/Property/PaymentDetails';
import ShopRentPaymentPage from './Components/Shop/ShopRentPaymentPage';
import UserList from "./Components/UserList/UserList";
import UpdateUser1 from "./Components/UpdateUser/UpdateUser";
import Register from "./Components/Register/Register";
import Login from "./Components/Login/Login";
import Profile from "./Components/Profile/Profile";
import ProtectedRoute from "./Components/Auth/ProtectedRoute";
import InventoryList from "./Components/Inventory/InventoryList";
import InventoryAdd from "./Components/Inventory/InventoryAdd";
import InventoryEdit from "./Components/Inventory/InventoryEdit";

function App() {
  return (
    <div className="App">
      <React.Fragment>
        <Routes>
          <Route path="/" element={<HoranaCouncilLanding />} />
          <Route path="/mainhome" element={<Home />} />

          {/* Playground booking routes - now properly aligned */}


          <Route path="/playgroundFrom" element={<ProtectedRoute alertMessage="Please log in to access this form"><AddPlayground /></ProtectedRoute>} />   {/* create */}


          <Route path="/userdetails" element={<Playgrounds />} />        {/* list */}
          <Route path="/userdetails/:id" element={<UpdatePlayground />} /> {/* edit */}

          {/* Other routes (unchanged) */}
          <Route path="/crematorium" element={<CrematoriumForm />} />
          <Route path="/admincheck" element={<ProtectedRoute allowedRoles={["admin","permitLicence"]}unauthorizedMessage="Log as permitLicence Officer."onForbiddenRedirect="/mainhome"><Adminbooking /></ProtectedRoute>} />
          <Route path="/displaybooking" element={<Displaybooking />} />


          {/*<Route path="/adminHome" element={<AdminHome />} />   */}
          

          <Route path="/adminHome" element={<ProtectedRoute allowedRoles={["admin","inventoryOfficer","financeAssesmentOfficer","hrManager","permitLicence","announcementService"]}unauthorizedMessage="Admins only."onForbiddenRedirect="/log"><AdminHome /></ProtectedRoute>} />


          <Route path="/propertyHome" element={<PropertyHome />} />
          <Route path="/addproperty" element={<AddProperty />} />
          <Route path="/propertyassessmentdetails/:part1/:part2" element={<PropertyAssessmentDetails />} />
          <Route path="/propertyassessmentdetails/:part1" element={<PropertyAssessmentDetails />} />
          <Route path="/addassessment" element={<AddAssessment />} />

          <Route path="/complaint" element={<ProtectedRoute alertMessage="Please log in to access Profile"><Complaints /></ProtectedRoute>} />


          <Route path="/announcements" element={<Announcements />} />
          <Route path="/contact" element={<ContactUs />} />
          <Route path="/chatbot" element={<ServicesChatbot />} />
          <Route path="/complaintsDetails" element={<ProtectedRoute allowedRoles={["admin","announcementService"]}unauthorizedMessage="Log as complaint Officer."onForbiddenRedirect="/mainhome"><ComplaintsDetails /></ProtectedRoute>} />
          <Route path="/updateassessment/:id" element={<UpdateAssessment />} />
          <Route path="/propertytax" element={<PropertyTax />} />
          <Route path="/assessmentdetails" element={<Assessments />} />
          <Route path="/citizen-apply" element={<CitizenApply />} />
          <Route path="/my-applications" element={<MyApplication />} />
          <Route path="/officer" element={<ProtectedRoute allowedRoles={["admin","financeAssesmentOfficer"]}unauthorizedMessage="Log as Assessmnet Officer."onForbiddenRedirect="/mainhome"><OfficerDashboard /></ProtectedRoute>} />
          <Route path="/pay" element={<ShopPayment />} />
          <Route path="/shop-rental-instructions" element={<ShopRentalInstructionPage />} />
          <Route path="/rent-pay" element={<ShopRentPaymentPage />} />
          <Route path="/propertyTaxCalculation/:part1/:part2" element={<PropertyTaxCalculator />} />
          <Route path="/payment-details" element={<PaymentDetailsPage />} />

          <Route path="/log" element={<Login />} />
          <Route path="/regi" element={<Register />} />
          <Route path="/viewusers" element={<UserList />} />
          <Route path="/viewusers/:id" element={<UpdateUser1 />} />
          <Route path="/my-bookings" element={<MyBookings />} />

          <Route  path="/profile"  element={<ProtectedRoute alertMessage="Please log in to access Profile">  <Profile /></ProtectedRoute>}/>
          <Route path="/admin" element={<ProtectedRoute allowedRoles={["admin","inventoryOfficer","financeAssesmentOfficer","hrManager","permitLicence","announcementService"]}unauthorizedMessage="Admins only."onForbiddenRedirect="/log"><AdminHome /></ProtectedRoute>} />
          <Route path="/inventory" element={<ProtectedRoute allowedRoles={["admin","inventoryOfficer"]}unauthorizedMessage="Log as Inventory Officer."onForbiddenRedirect="/mainhome"><InventoryList /></ProtectedRoute>} />
          <Route path="/inventory/add" element={<ProtectedRoute allowedRoles={["admin","inventoryOfficer"]}unauthorizedMessage="Log as Inventory Officer."onForbiddenRedirect="/mainhome"><InventoryAdd /></ProtectedRoute>} />
          <Route path="/inventory/:id" element={<ProtectedRoute allowedRoles={["admin","inventoryOfficer"]}unauthorizedMessage="Log as Inventory Officer."onForbiddenRedirect="/mainhome"><InventoryEdit /></ProtectedRoute>} />
        </Routes>
      </React.Fragment>
    </div>
  );
}

export default App;