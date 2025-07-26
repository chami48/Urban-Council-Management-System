import React, { useEffect, useState , useRef } from 'react';
import axios from "axios";
import User from '../User/User';
import {useReactToPrint} from "react-to-print";

const URL = "http://localhost:5000/users";

const fetchHandler = async () =>{
  return await axios.get(URL).then((res) => res.data);
}

function Users() {
   const [users, setUsers] = useState();
   useEffect(()=> {
    fetchHandler().then((data) => setUsers(data.users));
  },[])

   const ComponentsRef = useRef();
  const handlePrinter = useReactToPrint({
    content: () => ComponentsRef.current,
    documentTitle: "Users Report",
    onafterprint:()=> alert("Users Report Successfully Download !")
  });

   const [searchQuery, setSearchQuery] = useState("");
  const [noResults , setNoResults] = useState(false);

   const handleSearch = ()=> {
    fetchHandler().then ((data) => {
      const filteredUsers = data.users.filter((user)=>
      Object.values(user).some((field)=>
         field.toString().toLowerCase().includes(searchQuery.toLowerCase())
      ))
      setUsers(filteredUsers);
      setNoResults(filteredUsers.length === 0);
    });
  };

   const handleSendReport = () => {
    //create the whatsapp chat url
    const phoneNumber = "+94727663031";
    const message = `select User Reports`;
    const WhatsAppUrl = `https://web.whatsapp.com/send?phone=${phoneNumber}&text=${encodeURIComponent(
      message
    )}`;

    //Open the whatsapp cht in new window
    window.open(WhatsAppUrl,"_blank");
   }

   return (
    <React.Fragment>
    <div className="users-container">
      <div className="search-section">
        <div className="search-container">
          <input 
            onChange ={(e)=> setSearchQuery(e.target.value)}
            type="text"
            name="search"
            placeholder="Search User Details"
            className="search-input"
          />
          <button onClick={handleSearch} className="btn btn-search"> Search</button>
          <button onClick={handlePrinter} className="btn btn-download">Download Report</button>
        </div>
      </div>

       {noResults ? (
        <div className="no-results">
          <p>No Users Found</p>
        </div>
      ): (
      <div ref = {ComponentsRef} className="users-grid">
        {users && users.map((user, i) => (
          <div key={i} className="user-card">
            <User user={user}/>
          </div>
        ))}
      </div>
      )}
      
      
      <button onClick={handleSendReport} className="whatsapp-floating-btn">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.465 3.516"/>
        </svg>
      </button>
    </div>
    </React.Fragment>
  )
}

export default Users;