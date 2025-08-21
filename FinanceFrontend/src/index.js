import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import DApp from './DApp';
import {BrowserRouter} from "react-router-dom";

const root = ReactDOM.createRoot(document.getElementById('root')); 
root.render(
  <BrowserRouter>
  <React.StrictMode>
    <DApp />
  </React.StrictMode>
  </BrowserRouter>
);

