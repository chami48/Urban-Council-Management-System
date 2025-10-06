import React from 'react';
import { Routes, Route } from 'react-router-dom';
import './App.css';

import Home from './Components/Home/Home';
import EnglishHome from './Components/Home/EnglishHome.js';
import TamilHome from './Components/Home/TamilHome.js';

// Playground booking pages
import AddPlayground from './Components/PlaygroundForm/PlaygroundFrom';
import Playgrounds from './Components/PlaygroundForm/pUsers';
import UpdatePlayground from './Components/PlaygroundForm/UpdatePlayground';
import MyBookings from "./Components/MyBookings/MyBookings";

// Other features
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
import InventoryQuanEdit from "./Components/Inventory/InventoryQuanEdit";
import InventoryLog from "./Components/Inventory/InventoryLog.js";

// Stripe Payment Components
import PaymentPage from './Components/Payment/PaymentPage';
import PaymentSuccess from './Components/Payment/PaymentSuccess';

import SPropertyHome from './Components/Property/sPropertyHome';
import SAddProperty from './Components/Property/sAddProperty';
import AddPropertyTamil from './Components/Property/tAddProperty';
import SPropertyTaxCalculator from './Components/Property/sPropertyTaxCalculator';
import TaxCalculationTamil from './Components/Property/tPropertyTaxCalculator';
import HomeTamil from './Components/Property/tPropertyHome';
import OfficerDisplayPage from './Components/Shop/OfficerDisplayPage';
import Financial from './Components/Financial/Financial';
import UpdateApplication from './Components/Shop/updateShop.js';

 {/* chira */}
import Leaveform from "./Components/HR/Leaveform";
import Dashboard from "./Components/HR/Dashboard";
import SalaryForm from "./Components/HR/SalaryForm";
import SalaryTable from "./Components/HR/SalaryTable";
import UpdateSalary from "./Components/HR/UpdateSalary";
import Leavestatus from "./Components/HR/Leavestatus";
import ViewSalary from "./Components/HR/ViewSalary";
import AdminDashboard from "./Components/HR/AdminDashboard";
import "./Components/HR/sweetalert-custom.css";
import HROfficerDashboard from "./Components/HR/HROfficerDashboard"

function App() {
  return (
    <div className="App">
      <React.Fragment>
        <Routes>
          {/* Landing */}
          <Route path="/" element={<HoranaCouncilLanding />} />
          <Route path="/mainhome" element={<Home />} />
          <Route path="/tamilHome" element={<TamilHome />} />
          <Route path="/englishHome" element={<EnglishHome />} />

          {/* Playground booking */}
          <Route
            path="/playgroundFrom"
            element={
              <ProtectedRoute onForbiddenRedirect="/login">
                <AddPlayground />
              </ProtectedRoute>
            }
          />
          <Route path="/userdetails" element={<Playgrounds />} />
          <Route path="/userdetails/:id" element={<UpdatePlayground />} />
          <Route path="/my-bookings" element={<MyBookings />} />

          {/* Other routes */}
          <Route path="/crematorium" element={<CrematoriumForm />} />
          <Route
            path="/admincheck"
            element={
              <ProtectedRoute
                allowedRoles={["admin", "permitLicence"]}
                onForbiddenRedirect="/mainhome"
              >
                <Adminbooking />
              </ProtectedRoute>
            }
          />
          <Route path="/displaybooking" element={<Displaybooking />} />
          <Route
            path="/adminHome"
            element={
              <ProtectedRoute
                allowedRoles={[
                  "admin",
                  "inventoryOfficer",
                  "financeAssesmentOfficer",
                  "hrManager",
                  "permitLicence",
                  "announcementService",
                ]}
                onForbiddenRedirect="/log"
              >
                <AdminHome />
              </ProtectedRoute>
            }
          />

          {/* Property */}
          <Route
            path="/propertyHome"
            element={
              <ProtectedRoute allowedRoles={["user"]} onForbiddenRedirect="/login">
                <PropertyHome />
              </ProtectedRoute>
            }
          />
          <Route path="/addproperty" element={<AddProperty />} />
          <Route path="/propertyassessmentdetails/:part1/:part2" element={<PropertyAssessmentDetails />} />
          <Route path="/propertyassessmentdetails/:part1" element={<PropertyAssessmentDetails />} />
          <Route path="/addassessment" element={<AddAssessment />} />
          <Route path="/updateassessment/:id" element={<UpdateAssessment />} />
          <Route path="/propertytax" element={<PropertyTax />} />
          <Route path="/assessmentdetails" element={<Assessments />} />
          <Route path="/propertyTaxCalculation/:part1/:part2" element={<PropertyTaxCalculator />} />
          <Route path="/payment-details/:part1/:part2" element={<PaymentDetailsPage />} />
          <Route path="/update-application/:id" element={<UpdateApplication/>}/>

          {/* Complaints */}
          <Route
            path="/complaint"
            element={
              <ProtectedRoute onForbiddenRedirect="/login">
                <Complaints />
              </ProtectedRoute>
            }
          />
          <Route path="/announcements" element={<Announcements />} />
          <Route path="/contact" element={<ContactUs />} />
          <Route path="/chatbot" element={<ServicesChatbot />} />
          <Route
            path="/complaintsDetails"
            element={
              <ProtectedRoute
                allowedRoles={["admin", "announcementService"]}
                onForbiddenRedirect="/mainhome"
              >
                <ComplaintsDetails />
              </ProtectedRoute>
            }
          />

          {/* Shop Applications */}
          <Route path="/citizen-apply" element={<CitizenApply />} />
          <Route path="/my-applications" element={<MyApplication />} />
          <Route
            path="/officer"
            element={
              <ProtectedRoute
                allowedRoles={["admin", "financeAssesmentOfficer"]}
                onForbiddenRedirect="/mainhome"
              >
                <OfficerDashboard />
              </ProtectedRoute>
            }
          />
          
          <Route
            path="/shop-rental-instructions"
            element={
              
                <ShopRentalInstructionPage />
              
            }
          />
          <Route path="/shop-rent/:shopId" element={<ShopRentPaymentPage />} />
          <Route path="/rent-pay" element={<ShopRentPaymentPage />} />

          {/* User */}
          <Route path="/log" element={<Login />} />
          <Route path="/regi" element={<Register />} />
          <Route path="/viewusers" element={<UserList />} />
          <Route path="/viewusers/:id" element={<UpdateUser1 />} />
          <Route
            path="/profile"
            element={
              <ProtectedRoute onForbiddenRedirect="/login">
                <Profile />
              </ProtectedRoute>
            }
          />

          {/* Admin */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute
                allowedRoles={[
                  "admin",
                  "inventoryOfficer",
                  "financeAssesmentOfficer",
                  "hrManager",
                  "permitLicence",
                  "announcementService",
                ]}
                onForbiddenRedirect="/log"
              >
                <AdminHome />
              </ProtectedRoute>
            }
          />

          {/* Inventory */}
          <Route
            path="/inventory"
            element={
              <ProtectedRoute
                allowedRoles={["admin", "inventoryOfficer"]}
                onForbiddenRedirect="/mainhome"
              >
                <InventoryList />
              </ProtectedRoute>
            }
          />
          <Route
            path="/inventory/add"
            element={
              <ProtectedRoute
                allowedRoles={["admin", "inventoryOfficer"]}
                onForbiddenRedirect="/mainhome"
              >
                <InventoryAdd />
              </ProtectedRoute>
            }
          />
          <Route
            path="/inventory/:id"
            element={
              <ProtectedRoute
                allowedRoles={["admin", "inventoryOfficer"]}
                onForbiddenRedirect="/mainhome"
              >
                <InventoryEdit />
              </ProtectedRoute>
            }
          />
          <Route
            path="/inventory/:id/qty"
            element={
              <ProtectedRoute
                allowedRoles={["admin", "inventoryOfficer"]}
                onForbiddenRedirect="/mainhome"
              >
                <InventoryQuanEdit />
              </ProtectedRoute>
            }
          />
          <Route
            path="/inventory/logs"
            element={
              <ProtectedRoute
                allowedRoles={["admin", "inventoryOfficer"]}
                onForbiddenRedirect="/mainhome"
              >
                <InventoryLog />
              </ProtectedRoute>
            }
          />

          {/* Stripe Payment */}
          <Route path="/payment" element={<PaymentPage />} />
          <Route path="/payment-success" element={<PaymentSuccess />} />

          {/* Multilingual Property */}
          <Route
            path="/spropertyHome"
            element={
              <ProtectedRoute allowedRoles={["user"]} onForbiddenRedirect="/login">
                <SPropertyHome />
              </ProtectedRoute>
            }
          />
          <Route
            path="/tpropertyHome"
            element={
              <ProtectedRoute allowedRoles={["user"]} onForbiddenRedirect="/login">
                <HomeTamil />
              </ProtectedRoute>
            }
          />
          <Route path="/saddproperty" element={<SAddProperty />} />
          <Route path="/taddproperty" element={<AddPropertyTamil />} />
          <Route path="/spropertyTaxCalculation/:part1/:part2" element={<SPropertyTaxCalculator />} />
          <Route path="/tpropertyTaxCalculation/:part1/:part2" element={<TaxCalculationTamil />} />

          {/* Officer Display */}
          <Route path="/officerdisplaypage" element={<OfficerDisplayPage />} />
          <Route path="/officer" element={<OfficerDashboard />} />
          <Route path="/financial" element={<Financial />} />

            {/* chira */}
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/leaveform" element={<Leaveform />} />
          <Route path="/leavestatus" element={<Leavestatus />} />
          <Route path="/leave" element={<Leavestatus />} />
          <Route path="/salary" element={<SalaryForm />} />
          <Route path="/salary-table" element={<SalaryTable />} />
          <Route path="/salary/update/:id" element={<UpdateSalary />} />
          <Route path="/salary/view/:id" element={<ViewSalary />} />
          <Route path="/hrofficerpage" element={<HROfficerDashboard />} />

          

        </Routes>
             

      </React.Fragment>
    </div>
  );
}

export default App;
