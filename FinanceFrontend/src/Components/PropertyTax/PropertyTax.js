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
      alert('කරුණාකර කොන්දේසි සහ නියම උපදේශ පිළිගන්න.');
      return;
    }
    console.log('Form submitted:', formData);
    alert('ඔබගේ ගෘහ බදු අයදුම්පත සාර්ථකව ගොනු කරන ලදී!');
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
            <h3>Application Instructions Page | ඉල්ලුම් පත්‍ර උපදෙස් පිටුව</h3>
          </div>

          {/* Instructions Section */}
          <section className="instructions-section">
            <div className="instruction-card">
              <h4>මෙම ලියාපදිංචි වීම අන්තර්ජාලය හරහා වරිපනම් ගෙවීම සදහා පමණක් වලංගු වේ.</h4>
              
              <ul className="instruction-list">
                <li>
                  <span className="bullet">•</span>
                  සෑම වර්ෂයකම ජනවාරි 31, අප්‍රේල් 30, ජුලි 31, ඔක්තෝම්බර් 31 යන දිනවල කාර්තුවකට පමණක් ගෙවීම් කිරීමේදී ඔබට හිමිවන 5% වට්ටම ලබා ගැනීම සදහා එම දිනවල ප.ව 03.00ට පෙර ගෙවීම් කල යුතුය.
                </li>
                
                <li>
                  <span className="bullet">•</span>
                  නියමිත වර්ෂයට අදාල වරිපනම් මුදල ජනවාරි 31 දිනට පෙර සම්පුර්ණයෙන්ම ගෙවීමේ දී 10% වට්ටමක් හිමි වේ.

                </li>
                
                <li>
                  <span className="bullet">•</span>
                  අදාල වට්ටම් ලබා ගැනීම සදහා ගෙවිය යුතු මුදල් තීරුවේ පෙන්වන සම්පුර්ණ මුදලම ගෙවිය යුතුය.(ශත ගණන ද ඇතුළුව)

                </li>
                
                <li>
                  <span className="bullet">•</span>
                  මෙම ගෙවීම සම්පුර්ණ කිරීමට බැංකුව හා සම්බන්ධ වීමට අවශ්‍ය වේ.
                </li>
                
                <li>
                  <span className="bullet">•</span>
                  එහිදී ඔබගේ බැංකුව විසින් ලබා දී ඇති කාඩ්පත මගින් (Credit/Debit) ඔබට මේ සදහා ගෙවීම සිදු කල හැකිය.
                </li>
                
                <li>
                  <span className="bullet">•</span>
                  කාඩ්පත් විස්තර ඇතුලත් කිරිම

    මුලින්ම ඔබගේ කාඩ්පත් වර්ගය තෝරා අංක 16 කින් යුතු කාඩ්පත් අංකය ඊටඇතුලත් කල යුතුය.

    ඉන්පසු පිලිවෙලින් කල් ඉකුත් වීමේ දිනය, නම හා කාඩ්පත පිටුපස ඇති අංක 3 කින් යුතු රහස්‍ය අංකය ඊට ඇතුලත් කර ගෙවීම සම්පුර්ණ කල යුතුය.
                </li>
                
                <li>
                  <span className="bullet">•</span>
                  ඉන්පසු ඔබගේ දුරකථනයට ලැබෙන තහවුරු කිරීමේ කේතය ඇතුලත් කර ගෙවීම තහවුරු කල යුතුය
                </li>
              </ul>

              <div className="additional-info">
                <p>ඔබ විසින් ගෙවීම් සිදුකිරීමේ දී නිවැරදි වරිපනම් අංකය තෝරා ගැනීම ඔබගේ වගකීම වන අතර වෙනත් අංකයකට ගෙවීම් කර ඇත්නම් එහි වගකීම මීගමුව මහා නගර සභාව සතු නොවන බව සැලකිය යුතුය.</p>
              </div>

              <ul className="instruction-list">
                <li>
                  <span className="bullet">•</span>
                  සෑම දිනකම ඔබ විසින් ගෙවනු ලබන මුදල් අදාල ගිණුමට බැර කරනු ලබන්නේ පසු දිනයේ දී ය.
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
                  ඉහත තොරතුරු සහ අදාළ උපදෙස් වලට එකග වෙමි.
                </label>
              </div>

              <button 
                type="button" 
                className={`submit-btn ${!agreed ? 'disabled' : ''}`}
                onClick={handleProceedClick}
                disabled={!agreed}
              >
               ඇතුල් වන්න
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