// src/Components/Auth/ProtectedRoute.js
import React, { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";

export default function ProtectedRoute({
  children,
  allowedRoles,                     // optional: ["admin"] etc.
  redirectTo = "/log",              // where to send if NOT logged in
  alertMessage = "Please log in to continue.",
  onForbiddenRedirect = "/mainhome",// where to send if role not allowed
  unauthorizedMessage = "You don’t have permission to view this page."
}) {
  const [auth, setAuth] = useState({ loading: true, user: null });
  const navigate = useNavigate();
  const location = useLocation();
  const didAct = useRef(false);     // prevents double alerts/redirects

  useEffect(() => {
    (async () => {
      try {
        const res = await axios.get("http://localhost:5000/auth/me", {
          withCredentials: true,
        });
        setAuth({ loading: false, user: res.data.user });
      } catch {
        setAuth({ loading: false, user: null });
      }
    })();
  }, []);

  // not logged in -> alert + redirect
  useEffect(() => {
    if (!auth.loading && !auth.user && !didAct.current) {
      didAct.current = true;
      // window.alert(alertMessage);
      // navigate(redirectTo, { replace: true, state: { from: location } });

      Swal.fire({
      icon: "info",
      title: "Authentication Required",
      text: alertMessage,
      confirmButtonText: "Go to Login",
    }).then(() => {
      navigate(redirectTo, { replace: true, state: { from: location } });
    });




    }
  }, [auth.loading, auth.user, alertMessage, navigate, redirectTo, location]);

  // role not allowed -> alert + redirect
  useEffect(() => {
    if (
      !auth.loading &&
      auth.user &&
      allowedRoles &&
      !allowedRoles.includes(auth.user.role) &&
      !didAct.current
    ) {
      didAct.current = true;
      // window.alert(unauthorizedMessage);
      // navigate(onForbiddenRedirect, { replace: true });


      Swal.fire({
        icon: "error",
        title: "Access Denied",
        text: unauthorizedMessage,
        confirmButtonText: "OK",
      }).then(() => {
        navigate(onForbiddenRedirect, { replace: true });
      });




    }
  }, [auth.loading, auth.user, allowedRoles, unauthorizedMessage, onForbiddenRedirect, navigate]);

  if (auth.loading) return <div>Loading…</div>;
  if (!auth.user)   return null; // redirecting
  if (allowedRoles && !allowedRoles.includes(auth.user.role)) return null; // redirecting

  return children;
}
