// src/Components/User/User.js
import React from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

function User({ users = {}, refreshUsers }) {
  const { _id, name, email } = users;
  const navigate = useNavigate();

  const deleteHandler = async () => {
    const res = await Swal.fire({
      title: "Delete this user?",
      text: "This action cannot be undone.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete",
      cancelButtonText: "Cancel",
      confirmButtonColor: "#d33",
    });

    if (!res.isConfirmed) return;

    try {
      Swal.fire({
        title: "Deleting…",
        allowOutsideClick: false,
        didOpen: () => Swal.showLoading(),
      });

      await axios.delete(`http://localhost:5000/users/${_id}`, {
        withCredentials: true,
      });

      Swal.close();
      await Swal.fire("Deleted", "User removed successfully!", "success");

      // Option 1: Reload the whole page
      // window.location.reload();

      // Option 2: Better — if parent passed refreshUsers, call it
      if (typeof refreshUsers === "function") {
        refreshUsers();
      } else {
        navigate("/viewusers");
      }
    } catch (err) {
      Swal.close();
      const msg = err?.response?.data?.message || "Delete failed";
      await Swal.fire("Error", msg, "error");
    }
  };

  return (
    <div>
      <h1>User Details Display</h1>
      <h1>ID : {_id}</h1>
      <h1>Name : {name}</h1>
      <h1>Email : {email}</h1>

      <Link to={`/viewusers/${_id}`}>
        <button>Update</button>
      </Link>
      <button onClick={deleteHandler}>Delete</button>
    </div>
  );
}

export default User;
