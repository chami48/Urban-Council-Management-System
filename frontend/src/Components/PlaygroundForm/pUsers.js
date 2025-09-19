// src/Components/PlaygroundForm/pUsers.js
import React, { useEffect, useState } from "react";
import axios from "axios";
import Nav from "../Nav/Nav";
import PUser from "./pUser";

const API_BASE = "http://localhost:5000/playgrounds";

export default function Users() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState(null);

  const extractArray = (payload) => {
    // Log to see exactly what backend sends
    console.log("GET /playgrounds payload ->", payload);

    // Check direct array first
    if (Array.isArray(payload)) return payload;
    
    // Check for items field (what your backend actually returns!)
    if (payload?.items && Array.isArray(payload.items)) return payload.items;
    
    // Check other common patterns
    if (payload?.users && Array.isArray(payload.users)) return payload.users;
    if (payload?.data && Array.isArray(payload.data)) return payload.data;
    if (payload?.bookings && Array.isArray(payload.bookings)) return payload.bookings;
    if (payload?.results && Array.isArray(payload.results)) return payload.results;
    
    // Nested patterns
    if (payload?.data?.items && Array.isArray(payload.data.items)) return payload.data.items;

    console.warn("Could not extract array from payload:", payload);
    return [];
  };

  const load = async () => {
    try {
      setLoading(true);
      console.log("Loading bookings from:", API_BASE);
      
      const res = await axios.get(API_BASE);
      console.log("Raw response:", res.data);
      
      const arr = extractArray(res.data);
      console.log("Extracted array:", arr);
      
      setItems(arr);
      setErr(null);
    } catch (e) {
      console.error("Load error:", e);
      setErr("Failed to load bookings");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { 
    load(); 
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this booking?")) return;
    try {
      await axios.delete(`${API_BASE}/${id}`);
      setItems(prev => prev.filter(x => x._id !== id));
      console.log(`Deleted booking ${id}`);
    } catch (e) {
      console.error("Delete error:", e);
      alert("Delete failed");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Nav />
        <div className="max-w-5xl mx-auto px-4 py-12 text-center">
          <div className="inline-flex items-center gap-2">
            <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
            </svg>
            Loading bookings...
          </div>
        </div>
      </div>
    );
  }

  if (err) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Nav />
        <div className="max-w-5xl mx-auto px-4 py-12 text-center">
          <div className="text-red-600 mb-4">{err}</div>
          <button 
            onClick={load}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Nav />
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">Playground Bookings</h1>
          <div className="text-sm text-gray-600">
            Total: {items.length} booking{items.length !== 1 ? 's' : ''}
          </div>
        </div>

        {items.length === 0 ? (
          <div className="bg-white p-8 rounded-lg border text-center text-gray-600">
            <div className="mb-4">
              <svg className="w-16 h-16 mx-auto text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No bookings yet</h3>
            <p className="text-gray-600">Create your first playground booking to get started.</p>
          </div>
        ) : (
          <div className="grid gap-4">
            {items.map((item, index) => (
              <PUser
                key={item._id || index}
                booking={item}
                onDelete={() => handleDelete(item._id)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}