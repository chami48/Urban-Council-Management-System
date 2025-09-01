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
            <h3>Application Instructions Page | ඉල්ලීම් පත්‍ර උපදේශක පිටුව</h3>
          </div>

          {/* Instructions Section */}
          <section className="instructions-section">
            <div className="instruction-card">
              <h4>ගෘහ බදු අයදුම්පත් සඳහා උපදේශ:</h4>
              
              <ul className="instruction-list">
                <li>
                  <span className="bullet">•</span>
                  අදාළ දින්නම්කෙරුමින් මීම දිනරං වර්ධනය කරන්න සෑම මාස්කරන් වරක්ම.
                </li>
                
                <li>
                  <span className="bullet">•</span>
                  සෑම වර්ෂකරනගම් ජනවරි 31, ඇප්‍රිල් 30 සිට 31, ජුලි ඔක්තේඔර් 31 ගන වින්ර්ග කරනුන් කීපම්කරන් කරමිම් සිරවිම් කීරන්ම නීම්රන 5% වටරන මිනිකට නම්සිරස් සමත, එම වින්ර්ග මට 03,000 සකන කරමිම් කගත ගම්නක.
                </li>
                
                <li>
                  <span className="bullet">•</span>
                  නීමිම් වර්ධනට ඇම්රම වර්ධනම් මර්ගම ජනප්‍රන-31 වින්ට සකන කම්සි+කයගරනගම් කරමිම් ද 10% වටරන්ම නීම් මට.
                </li>
                
                <li>
                  <span className="bullet">•</span>
                  ඇම්රම වටරන මිනිකට නම්සිරස් සමත කරමිම් ගම්නම සර්යද නීරරම්ට කබනවන කම්සි+කයක මිර්ගම් කරමිම් ගම්නටම (සම ගකනම දර වනගනට)
                </li>
                
                <li>
                  <span className="bullet">•</span>
                  අදාළ කරමිම් කම්සි+කයක සිරසිරට මිරගනම නම කම්සිපකරන වීමට අර්ගයකන් මට.
                </li>
                
                <li>
                  <span className="bullet">•</span>
                  වනන් ස්ථිරකරන මිරගනම වීන්ම මිනිකට ද ඇම්සර කනවිනකම රීර්ර (Credit/Debit) කිරට මම් සමත කරමිම් වීරු කනග පනවිගන.
                </li>
                
                <li>
                  <span className="bullet">•</span>
                  කනවිනකර වීන්ර වනගනටම කිරරර
                </li>
              </ul>

              <div className="additional-info">
                <p>මර්සිකරන සිටවකර කනවිනකර වර්ගන කරනරරම අනම 16 සිරර ගම්නම කනවිනකර අනම වීරනගනටකර කන ගම්නටම.</p>
                
                <p>ඉදිකරනු සර්දකරර්ම කන අනගනටන වීම් වින්ර. කම් ගන කනවිනකම සිම්නම ඇම්සර අනම 3 සිරර ගම්නම රගගන අනම වීර වනගනටන කර කරමිම් කම්සි+කයක කන ගම්නටම.</p>
              </div>

              <ul className="instruction-list">
                <li>
                  <span className="bullet">•</span>
                  ඉදිකරනු සිටවකර ප්‍රකනවකරර ගුණකම නකම්ර්රුක සිරසිරට රනරට වනගනටන කර කරමිම් නකම්ර්රුක කන ගම්නටම.
                </li>
                
                <li>
                  <span className="bullet">•</span>
                  සිට වීන්ම කරමිම් මිප්‍රන්වීම් ද සිනර්ම වර්ධනම් අනම කරනරරම නම්සිරස් ගමර සිටවකර ජනකම්ම්ර නවනන වර ඇම්සරර අනකගනට කරමිම් කර වනරකම් එන් වනකරම් මීගනම්බෝ මහන නගර කභම සකභර සම කනන්.
                </li>
                
                <li>
                  <span className="bullet">•</span>
                  සෑම දින්ගකම් සිට වීන්ම කරරර ගම්රටන සර්යද අප්‍රර දිසම්ජර වීර කර්යද ගබරකර කම් ර දින්රර ද ගට.
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
                  ඉරගන කරන්දේසිවරර් සහන ඇම්රද උර්දේශ විගනට එකගර කරමිම්.
                </label>
              </div>

              <button 
                type="button" 
                className={`submit-btn ${!agreed ? 'disabled' : ''}`}
                onClick={handleProceedClick}
                disabled={!agreed}
              >
                ඇගලරද පිටර්ස
              </button>
            </div>
          </section>

          
        </div>
      </main>

      {/* Footer */}
      <footer className="footer">
        <p>Copyright © 2024 - Negombo Municipal Council. All Rights Reserved.</p>
      </footer>
    </div>
  );
};

export default PropertyTax;