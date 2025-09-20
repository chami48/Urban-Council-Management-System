import React, { useState } from 'react';
import { ChevronRight, FileText, CreditCard, AlertCircle, Calendar, Building, Home, Shield } from 'lucide-react';
import { useNavigate } from "react-router-dom";
import Nav from '../Nav/Nav';

function PropertyTaxInstructionPage() {
  const [language, setLanguage] = useState('sinhala');
  const [agreed, setAgreed] = useState(false);
  const [captchaVerified, setCaptchaVerified] = useState(false);
   const navigate = useNavigate();

  const content = {
    sinhala: {
      title: "ගෘහ බදු ගෙවීම් උපදේශන පිටුව",
      englishTitle: "Property Tax Payment Instruction Page",
      subtitle: "මෙම ලියාපදිංචි වීම අන්තර්ජාලය හරහා වරිපනම් ගෙවීම සදහා පමණක් වලංගු වේ.",
      instructions: [
        "සෑම වර්ෂයකම ජනවාරි 31, අප්‍රේල් 30, ජුලි 31, ඔක්තෝම්බර් 31 යන දිනවල කාර්තුවකට පමණක් ගෙවීම් කිරීමේදී ඔබට හිමිවන 5% වට්ටම ලබා ගැනීම සදහා එම දිනවල ප.ව 03.00ට පෙර ගෙවීම් කල යුතුය.",
        "නියමිත වර්ෂයට අදාල වරිපනම් මුදල ජනවාරි 31 දිනට පෙර සම්පුර්ණයෙන්ම ගෙවීමේ දී 10% වට්ටමක් හිමි වේ.",
        "අදාල වට්ටම් ලබා ගැනීම සදහා ගෙවිය යුතු මුදල් තීරුවේ පෙන්වන සම්පුර්ණ මුදලම ගෙවිය යුතුය.(ශත ගණන ද ඇතුළුව)",
        "මෙම ගෙවීම සම්පුර්ණ කිරීමට බැංකුව හා සම්බන්ධ වීමට අවශ්‍ය වේ.",
        "එහිදී ඔබගේ බැංකුව විසින් ලබා දී ඇති කාඩ්පත මගින් (Credit/Debit) ඔබට මේ සදහා ගෙවීම සිදු කල හැකිය.",
        "කාඩ්පත් විස්තර ඇතුලත් කිරිම - මුලින්ම ඔබගේ කාඩ්පත් වර්ගය තෝරා අංක 16 කින් යුතු කාඩ්පත් අංකය ඊටඇතුලත් කල යුතුය. ඉන්පසු පිලිවෙලින් කල් ඉකුත් වීමේ දිනය, නම හා කාඩ්පත පිටුපස ඇති අංක 3 කින් යුතු රහස්‍ය අංකය ඊට ඇතුලත් කර ගෙවීම සම්පුර්ණ කල යුතුය.",
        "ඉන්පසු ඔබගේ දුරකථනයට ලැබෙන තහවුරු කිරීමේ කේතය ඇතුලත් කර ගෙවීම තහවුරු කල යුතුය.",
        "සෑම දිනකම ඔබ විසින් ගෙවනු ලබන මුදල් අදාල ගිණුමට බැර කරනු ලබන්නේ පසු දිනයේ දී ය."
      ],
      importantNote: "ඔබ විසින් ගෙවීම් සිදුකිරීමේ දී නිවැරදි වරිපනම් අංකය තෝරා ගැනීම ඔබගේ වගකීම වන අතර වෙනත් අංකයකට ගෙවීම් කර ඇත්නම් එහි වගකීම හොරණ නගර සභාව සතු නොවන බව සැලකිය යුතුය.",
      agreeText: "ඉහත තොරතුරු සහ අදාළ උපදෙස් වලට එකග වෙමි.",
      continueText: "ඇතුල් වන්න"
    },
    english: {
      title: "Property Tax Payment Instruction Page",
      englishTitle: "",
      subtitle: "This registration is valid only for online property tax payments.",
      instructions: [
        "To receive the 5% discount available for quarterly payments on January 31, April 30, July 31, and October 31 of each year, payments must be made before 3:00 PM on those dates.",
        "A 10% discount is available when the full property tax amount for the relevant year is paid completely before January 31.",
        "To receive the applicable discounts, the full amount shown in the payment column must be paid (including cents).",
        "Bank connectivity is required to complete this payment.",
        "You can make payments using Credit/Debit cards issued by your bank.",
        "Card Details Entry - First select your card type and enter the 16-digit card number. Then sequentially enter the expiry date, name, and the 3-digit security code on the back of the card to complete the payment.",
        "Then enter the verification code sent to your phone to confirm the payment.",
        "The amount you pay each day will be credited to the relevant account on the following day."
      ],
      importantNote: "It is your responsibility to select the correct property tax number when making payments. Horana Urban Council will not be responsible if payments are made to a different number.",
      agreeText: "I agree to the above information and relevant instructions.",
      continueText: "Proceed"
    }
  };

  const currentContent = content[language];

  const handleProceedClick = () => {
    if (agreed && captchaVerified) {
      // In your actual app, replace this with: navigate('/propertyhome');
      alert(language === 'sinhala' ? 'ගෘහ බදු ගෙවීම් පිටුවට යොමු කරමින්...' : 'Redirecting to property tax payment page...');
      console.log('Proceeding to /propertyhome');
    } else if (!agreed) {
      alert(language === 'sinhala' ? 'කරුණාකර කොන්දේසි සහ නියම උපදේශ පිළිගන්න.' : 'Please agree to the terms and conditions.');
    } else if (!captchaVerified) {
      alert(language === 'sinhala' ? 'කරුණාකර reCAPTCHA සත්‍යාපනය කරන්න.' : 'Please verify the reCAPTCHA.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Nav/>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg overflow-hidden">
          {/* Title Section */}
          <div className="bg-gray-50 px-6 py-4 border-b">
            <h2 className="text-2xl font-semibold text-gray-800 mb-2">
              {currentContent.title}
            </h2>
            {language === 'sinhala' && currentContent.englishTitle && (
              <p className="text-lg text-gray-600">{currentContent.englishTitle}</p>
            )}
          </div>

          {/* Language Toggle */}
          <div className="px-6 py-3 border-b bg-gray-50">
            <div className="flex space-x-2">
              <button
                onClick={() => setLanguage('sinhala')}
                className={`px-4 py-2 rounded text-sm font-medium ${
                  language === 'sinhala'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                සිංහල
              </button>
              <button
                onClick={() => setLanguage('english')}
                className={`px-4 py-2 rounded text-sm font-medium ${
                  language === 'english'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                English
              </button>
            </div>
          </div>

          {/* Instructions Content */}
          <div className="px-6 py-6">
            <div className="space-y-6">
              {/* Subtitle */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-center mb-2">
                  <Home className="w-5 h-5 text-blue-600 mr-2" />
                  <h3 className="font-semibold text-blue-800">
                    {language === 'sinhala' ? 'වැදගත් සටහන' : 'Important Note'}
                  </h3>
                </div>
                <p className="text-blue-700 text-sm">
                  {currentContent.subtitle}
                </p>
              </div>

              {/* Discount Information */}
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="flex items-center mb-3">
                  <Calendar className="w-5 h-5 text-green-600 mr-2" />
                  <h3 className="font-semibold text-green-800">
                    {language === 'sinhala' ? 'වට්ටම් තොරතුරු' : 'Discount Information'}
                  </h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className="bg-white p-3 rounded border">
                    <h4 className="font-medium text-green-700 text-sm">
                      {language === 'sinhala' ? 'කාර්තුමක වට්ටම - 5%' : 'Quarterly Discount - 5%'}
                    </h4>
                    <p className="text-xs text-green-600 mt-1">
                      {language === 'sinhala' ? 'ජන. 31, අප්‍රේල් 30, ජුලි 31, ඔක්තෝ. 31' : 'Jan 31, Apr 30, Jul 31, Oct 31'}
                    </p>
                  </div>
                  <div className="bg-white p-3 rounded border">
                    <h4 className="font-medium text-green-700 text-sm">
                      {language === 'sinhala' ? 'වාර්ෂික වට්ටම - 10%' : 'Annual Discount - 10%'}
                    </h4>
                    <p className="text-xs text-green-600 mt-1">
                      {language === 'sinhala' ? 'ජනවාරි 31 ට පෙර සම්පූර්ණ ගෙවීම' : 'Full payment before Jan 31'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Instructions List */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-800 flex items-center">
                  <FileText className="w-5 h-5 text-orange-600 mr-2" />
                  {language === 'sinhala' ? 'ගෙවීම් උපදේශන' : 'Payment Instructions'}
                </h3>
                {currentContent.instructions.map((instruction, index) => (
                  <div key={index} className="flex items-start space-x-3">
                    <div className="flex-shrink-0 w-6 h-6 bg-orange-100 rounded-full flex items-center justify-center mt-0.5">
                      <span className="text-orange-600 text-sm font-medium">{index + 1}</span>
                    </div>
                    <p className="text-gray-700 text-sm leading-relaxed">{instruction}</p>
                  </div>
                ))}
              </div>

              {/* Payment Methods */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-center mb-3">
                  <CreditCard className="w-5 h-5 text-blue-600 mr-2" />
                  <h3 className="font-semibold text-blue-800">
                    {language === 'sinhala' ? 'ගෙවීමේ ක්‍රම' : 'Payment Methods'}
                  </h3>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  <div className="bg-white p-2 rounded border text-center">
                    <p className="text-xs text-gray-600">Visa</p>
                  </div>
                  <div className="bg-white p-2 rounded border text-center">
                    <p className="text-xs text-gray-600">Mastercard</p>
                  </div>
                  <div className="bg-white p-2 rounded border text-center">
                    <p className="text-xs text-gray-600">American Express</p>
                  </div>
                  <div className="bg-white p-2 rounded border text-center">
                    <p className="text-xs text-gray-600">Local Cards</p>
                  </div>
                </div>
              </div>

              {/* Important Warning */}
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                <div className="flex items-center mb-2">
                  <AlertCircle className="w-5 h-5 text-amber-600 mr-2" />
                  <h3 className="font-semibold text-amber-800">
                    {language === 'sinhala' ? 'වැදගත් අවවාදය' : 'Important Warning'}
                  </h3>
                </div>
                <p className="text-amber-700 text-sm">
                  {currentContent.importantNote}
                </p>
              </div>
            </div>
          </div>

          {/* Agreement Section */}
          <div className="px-6 py-4 border-t bg-gray-50">
            <div className="space-y-4">
              {/* Terms Agreement */}
              <label className="flex items-start space-x-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={agreed}
                  onChange={(e) => setAgreed(e.target.checked)}
                  className="mt-1 w-5 h-5 text-orange-600 border-2 border-gray-300 rounded focus:ring-orange-500"
                />
                <span className="text-sm text-gray-700">
                  {currentContent.agreeText}
                </span>
              </label>

              {/* reCAPTCHA */}
              <div className="flex items-center justify-center">
                <div className="bg-white p-4 border-2 border-gray-300 rounded">
                  <div className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      id="captcha"
                      checked={captchaVerified}
                      onChange={(e) => setCaptchaVerified(e.target.checked)}
                      className="w-5 h-5 text-blue-600 border-2 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <label htmlFor="captcha" className="text-sm text-gray-700 cursor-pointer">
                      {language === 'sinhala' ? 'මම රොබෝවෙකු නොවෙමි' : "I'm not a robot"}
                    </label>
                    <div className="text-xs text-gray-500">
                      reCAPTCHA<br />
                      <span className="text-xs">Privacy - Terms</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Continue Button */}
              <div className="flex justify-center">
                <button
                  onClick={() => navigate('/propertyHome')}
                  disabled={!agreed || !captchaVerified}
                  className={`px-8 py-2 rounded-lg font-medium transition-colors ${
                    agreed && captchaVerified
                      ? 'bg-orange-600 text-white hover:bg-orange-700'
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  {currentContent.continueText}
                  <ChevronRight className="inline-block w-4 h-4 ml-1" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center text-gray-500 text-sm mt-8">
          <p>© 2025 Horana Municipal Council. All rights reserved.</p>
          <p className="mt-1">
            {language === 'sinhala' 
              ? 'තාක්ෂණික සහාය සඳහා: support@horana.lk'
              : 'For technical support: support@horana.lk'
            }
          </p>
        </div>
      </div>
    </div>
  );
}

export default PropertyTaxInstructionPage;