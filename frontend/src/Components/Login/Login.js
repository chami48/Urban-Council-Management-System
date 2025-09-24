// src/Components/Login/Login.js
import React, { useState, useEffect, useRef } from "react";
import Nav from "../Nav/Nav.js";
import axios from "axios";
import { useNavigate, useLocation, Link } from "react-router-dom";
import Swal from "sweetalert2";

function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const shownRef = useRef(false);

  const [inputs, setInputs] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [canSubmit, setCanSubmit] = useState(false);

  // 🔔 Show alert if ProtectedRoute sent one via state
  useEffect(() => {
    const msg = location.state?.alert;
    if (msg && !shownRef.current) {
      shownRef.current = true;
      // window.alert(msg);
      // // Clear the state so going back/forward doesn't re-alert
      // navigate(location.pathname, { replace: true, state: {} });


        Swal.fire({
          icon: "info",
          title: "Notice",
          text: msg,
          confirmButtonText: "OK",
        }).then(() => {
          // Clear the state so going back/forward doesn't re-alert
          navigate(location.pathname, { replace: true, state: {} });
        });



    }
  }, [location.state, location.pathname, navigate]);

  // Only allow letters/numbers/dot/@ while typing
  const onEmailChange = (e) => {
    const filtered = e.target.value.replace(/[^A-Za-z0-9.@]/g, "");
    setInputs((prev) => ({ ...prev, email: filtered }));
  };

  // Basic email format check (after filtering)
  const isEmailValid = (email) =>
    /^[A-Za-z0-9.]+@[A-Za-z0-9.]+\.[A-Za-z]{2,}$/.test(email);

  // Track password
  const onPasswordChange = (e) => {
    setInputs((prev) => ({ ...prev, password: e.target.value }));
  };

  // Enable submit only when valid
  useEffect(() => {
    const ok = isEmailValid(inputs.email) && inputs.password.length >= 8;
    setCanSubmit(ok);
  }, [inputs]);

  // const handleSubmit = async (e) => {
  //   e.preventDefault();
  //   setError("");
  //   if (!canSubmit) return;

  //   try {
  //     const res = await axios.post("http://localhost:5000/auth/login", inputs, {
  //       withCredentials: true,
  //     });

  //     localStorage.setItem("user", JSON.stringify(res.data.user));

  //     await Swal.fire({
  //     icon: "success",
  //     title: "Welcome",
  //     text: `Hello, ${res.data.user.name}`,
  //     timer: 2000,
  //     showConfirmButton: false
  //   });


  //     if (["admin","inventoryOfficer","financeAssesmentOfficer","hrManager","permitLicence","announcementService"].includes(res.data.user.role)) {
  //       navigate("/admin");
  //     } else {
  //       navigate("/mainhome");
  //     }
  //   } catch (err) {
  //     const msg = err?.response?.data?.message || "Login failed";
  //     setError(msg);
  //      Swal.fire({
  //       icon: "error",
  //       title: "Login Failed",
  //       text: msg,
  //       confirmButtonText: "Try Again"
  //     });
  //   }
  // };

  const handleSubmit = async (e) => {
  e.preventDefault();
  setError("");
  if (!canSubmit) return;

  try {
    const res = await axios.post("http://localhost:5000/auth/login", inputs, {
      withCredentials: true,
    });

    localStorage.setItem("user", JSON.stringify(res.data.user));

    await Swal.fire({
      icon: "success",
      title: "Welcome",
      text: `Hello, ${res.data.user.name}`,
      timer: 2000,
      showConfirmButton: false
    });

    // ✅ NEW: prioritize redirects from instruction pages
    if (location.state?.fromPropertyTax) {
      const lang = location.state?.language;
      if (lang === "en") {
        navigate("/propertyHome", { replace: true, state: {} });
      } else if (lang === "ta") {
        navigate("/tpropertyHome", { replace: true, state: {} });
      } else {
        navigate("/propertyHome", { replace: true, state: {} });
      }
      return; // prevent falling through to normal redirects
    }

    if (location.state?.fromShopRent) {
      navigate("/my-applications", { replace: true, state: {} });
      return; // prevent falling through
    }

    // Normal login redirects (your existing logic)
    const role = res.data.user.role;
    if (
      [
        "admin",
        "inventoryOfficer",
        "financeAssesmentOfficer",
        "hrManager",
        "permitLicence",
        "announcementService",
      ].includes(role)
    ) {
      navigate("/admin");
    } else {
      navigate("/mainhome");
    }
  } catch (err) {
    const msg = err?.response?.data?.message || "Login failed";
    setError(msg);
    Swal.fire({
      icon: "error",
      title: "Login Failed",
      text: msg,
      confirmButtonText: "Try Again"
    });
  }
};


  return (
    <>
      <Nav />
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-gray-100 flex items-center justify-center p-5">
        <div className="w-full max-w-lg">
          <div className="bg-white rounded-lg shadow-xl border-2 border-blue-200 overflow-hidden">
            {/* Government Header */}
            <div className="bg-gradient-to-r from-blue-800 to-blue-900 px-8 py-6 text-center border-b-4 border-yellow-400">
              <div className="flex items-center justify-center mb-2">
                <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center mr-3">
                  <svg className="w-8 h-8 text-blue-800" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
                  </svg>
                </div>
                <div>
                  <h1 className="text-white text-xl font-bold tracking-wide">GOVERNMENT PORTAL</h1>
                  <p className="text-blue-100 text-sm font-medium">Secure Access System</p>
                </div>
              </div>
            </div>

            <div className="px-8 py-8">
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-gray-800 mb-2">Official Login</h2>
                <p className="text-gray-600 text-sm">Enter your authorized credentials</p>
              </div>
              
              <form onSubmit={handleSubmit} className="w-full" noValidate>
                <div className="mb-6">
                  <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wide">Email Address</label>
                  <input
                    type="text"
                    name="email"
                    value={inputs.email}
                    onChange={onEmailChange}
                    placeholder="Enter your official email"
                    className={`w-full px-4 py-3 border-2 rounded-md text-base transition-all duration-200 focus:outline-none focus:ring-2 ${
                      inputs.email !== "" && !isEmailValid(inputs.email) 
                        ? 'border-red-500 bg-red-50 focus:border-red-500 focus:ring-red-200' 
                        : 'border-gray-300 bg-white focus:border-blue-600 focus:ring-blue-200'
                    } placeholder-gray-500`}
                    required
                  />
                  {inputs.email !== "" && !isEmailValid(inputs.email) && (
                    <div className="flex items-center mt-2 text-red-600 text-sm font-semibold">
                      <svg className="w-4 h-4 mr-1.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                      Enter a valid email (letters/numbers, "." and "@" only)
                    </div>
                  )}
                </div>

                <div className="mb-6">
                  <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wide">Password</label>
                  <input
                    type="password"
                    name="password"
                    value={inputs.password}
                    onChange={onPasswordChange}
                    placeholder="Enter your secure password"
                    className={`w-full px-4 py-3 border-2 rounded-md text-base transition-all duration-200 focus:outline-none focus:ring-2 ${
                      inputs.password !== "" && inputs.password.length < 8 
                        ? 'border-red-500 bg-red-50 focus:border-red-500 focus:ring-red-200' 
                        : 'border-gray-300 bg-white focus:border-blue-600 focus:ring-blue-200'
                    } placeholder-gray-500`}
                    required
                  />
                  {inputs.password !== "" && inputs.password.length < 8 && (
                    <div className="flex items-center mt-2 text-red-600 text-sm font-semibold">
                      <svg className="w-4 h-4 mr-1.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                      Password must be at least 8 characters
                    </div>
                  )}
                </div>

                <button 
                  type="submit" 
                  disabled={!canSubmit}
                  className={`w-full px-6 py-4 rounded-md text-base font-bold cursor-pointer transition-all duration-200 flex items-center justify-center mt-4 uppercase tracking-wider ${
                    canSubmit 
                      ? 'bg-blue-700 text-white hover:bg-blue-800 hover:shadow-lg focus:outline-none focus:ring-4 focus:ring-blue-300 active:bg-blue-900' 
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  <svg className={`w-5 h-5 mr-2 ${canSubmit ? '' : 'opacity-50'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>Secure Access</span>
                </button>

                {error && (
                  <div className="flex items-center bg-red-50 border-l-4 border-red-500 text-red-700 px-4 py-3 mt-4 text-sm font-semibold">
                    <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                    {error}
                  </div>
                )}
              </form>

              <div className="mt-8 pt-6 border-t-2 border-gray-200 text-center">
                <div className="bg-yellow-50 border border-yellow-200 rounded-md p-3 mb-4">
                  <p className="text-yellow-800 text-xs font-semibold">
                    ⚠️ AUTHORIZED PERSONNEL ONLY
                  </p>
                </div>
                <p className="text-gray-600 text-sm">
                  Need account access? 
                  <Link to="/regi" className="text-blue-700 font-bold ml-1 hover:text-blue-900 transition-colors duration-200 hover:underline focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded">
                    Request Registration
                  </Link>
                </p>
                <p className="text-gray-500 text-xs mt-2">
                  This system is monitored and protected by federal security protocols
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Login;