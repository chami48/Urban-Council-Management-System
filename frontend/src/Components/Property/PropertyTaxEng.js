import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './PropertyTax.css';
import Nav from '../Nav/Nav.js';

const PropertyTax = () => {
  const [agreed, setAgreed] = useState(false);
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    propertyId: '',
    ownerName: '',
    address: '',
    assessmentValue: '',
    taxType: 'annual'
  });

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!agreed) {
      alert('Please agree to the terms and conditions before proceeding.');
      return;
    }
    console.log('Form submitted:', formData);
    alert('Your property tax application has been successfully submitted!');
  };

  const handleProceedClick = () => {
    if (agreed) {
      navigate('/propertyhome');
    }
  };

  return (
    <div className="property-tax-container">
        <Nav/>

      {/* Main Content */}
      <main className="main-content">
        <div className="page-container">
          {/* Page Title */}
          <div className="page-title">
            <h3>Application Instructions Page</h3>
          </div>

          {/* Instructions Section */}
          <section className="instructions-section">
            <div className="instruction-card">
              <h4>This registration is valid only for paying taxes online.</h4>
              
              <ul className="instruction-list">
                <li>
                  <span className="bullet">•</span>
                  To receive a 5% discount for each quarter (Jan 31, Apr 30, Jul 31, Oct 31), payments must be made before 3:00 PM on these dates.
                </li>
                
                <li>
                  <span className="bullet">•</span>
                  If the full tax amount for the year is paid before January 31, you are entitled to a 10% discount.
                </li>
                
                <li>
                  <span className="bullet">•</span>
                  To receive these discounts, the total amount shown in the bill (including cents) must be paid in full.
                </li>
                
                <li>
                  <span className="bullet">•</span>
                  You must connect to a bank to complete the payment.
                </li>
                
                <li>
                  <span className="bullet">•</span>
                  Payments can be made using your bank-issued Credit/Debit card.
                </li>
                
                <li>
                  <span className="bullet">•</span>
                  Entering card details:  
                  First, select your card type, then enter the 16-digit card number.  
                  Next, enter the expiry date, the name on the card, and the 3-digit CVV number on the back of the card to complete payment.
                </li>
                
                <li>
                  <span className="bullet">•</span>
                  Then, enter the verification code sent to your mobile phone to confirm the payment.
                </li>
              </ul>

              <div className="additional-info">
                <p>
                  It is your responsibility to select the correct tax number when making a payment.  
                  If you mistakenly pay to a different number, the Municipal Council will not be responsible for it.
                </p>
              </div>

              <ul className="instruction-list">
                <li>
                  <span className="bullet">•</span>
                  Payments you make will be credited to the relevant account on the next day.
                </li>
              </ul>

              <div className="agreement-section">
                <label className="checkbox-container">
                  <input 
                    type="checkbox" 
                    checked={agreed}
                    onChange={(e) => setAgreed(e.target.checked)}
                  />
                  <span className="checkmark"></span>
                  I agree to the above information and relevant instructions.
                </label>
              </div>

              <button 
                type="button" 
                className={`submit-btn ${!agreed ? 'disabled' : ''}`}
                onClick={handleProceedClick}
                disabled={!agreed}
              >
                Proceed
              </button>
            </div>
          </section>
        </div>
      </main>

      {/* Footer */}
      <footer className="footer">
        <p>Copyright © 2025 - Horana Urban Council. All Rights Reserved.</p>
      </footer>
    </div>
  );
};

export default PropertyTax;
