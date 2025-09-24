import React, { useState } from 'react';
import { ChevronRight, FileText, CreditCard, AlertCircle } from 'lucide-react';
import { useNavigate } from "react-router-dom";
import Nav from '../Nav/Nav'; 

function ShopRentalInstructionPage() {
  const [language, setLanguage] = useState('english');
  const [captchaVerified, setCaptchaVerified] = useState(false);
  const navigate = useNavigate();

  const content = {
    sinhala: {
      title: "කඩ කුලියට දීම / වෙළඳ බද්ද උපදේශන පිටුව",
      englishTitle: "Shop Rental / Trade Tax Instruction Page",
      instructions: [
        "නිවරදි සාප්පු සංඛ්‍යාව සහ නිවැරදි සාප්පු නම් සඳහා ගෙවිය යුතුය. (වැරදි අංක සඳහා ගෙවන මුදල් ආපසු නොදෙනු ලැබේ.)",
        "ගෙවීම ක්‍රෙඩිට්/ඩෙබිට් කාඩ්පත් මගින් පමණක් කළ හැකිය.",
        "2025.08.31 දක්වා කුලියට පහර වර්ග සඳහා ඔන්ලයින් ගෙවීම මත 15% VAT අය කරනු ලැබේ, සහ 2025.08.31 දක්වා කුලියට පහර වර්ග සඳහා පුද්ගලිකව ගෙවන විට පමණක් VAT අය නොකරනු ලැබේ.",
        "සෑම මාසයකම කුලිය ඊළඟ මාසයේ 10 වනදා ට පෙර නොගෙවුවහොත්, 5% වරපත් ගාස්තුවක් අය කරනු ලැබේ.",
        "වෙළඳ බද්ද වාර්ෂිකව නිර්ණය කර අය කරනු ලැබේ.",
        "බලපත්‍ර සහ අවසර පත්‍ර යාවත්කාලීන කරන්න."
      ],
      importantNotice: "කරුණාකර ගෙවීම් කිරීමට පෙර සියලු උපදේශන කියවා බලන්න.",
      paymentMethods: "ගෙවීමේ ක්‍රම",
      requiredDocs: "අවශ්‍ය ලේඛන",
      docs: [
        "ජාතික හැඳුනුම්පත",
        "ව්‍යාපාර ලියාපදිංචි සහතිකය",
        "කුලිකරු ගිණුම්",
        "බද්ද ගෙවීමේ රිසිට්පත්"
      ],
      captcha: "මම රොබෝවෙකු නොවෙමි",
      continue: "ඉදිරියට",
      footer: "තාක්ෂණික සහාය සඳහා: support@horana.lk"
    },
    english: {
      title: "Shop Rental / Trade Tax Instruction Page",
      englishTitle: "",
      instructions: [
        "Payment must be made for the correct shopping mall and the correct shop number. (Money paid for wrong numbers will not be refunded.)",
        "Payment can be made by Credit/Debit cards only.",
        "15% VAT will be charged on online payment for rent arrears up to 31.08.2025, and VAT will not be charged on rent arrears up to 31.08.2025 only when paid in person.",
        "If the rent of each month is not paid before the 10th of the following month, a 5% warrant fee will be charged.",
        "Trade tax will be assessed and charged annually based on business income and type.",
        "Ensure all licenses and permits are up to date before making payments."
      ],
      importantNotice: "Please read all instructions carefully before making payments.",
      paymentMethods: "Payment Methods",
      requiredDocs: "Required Documents",
      docs: [
        "National Identity Card",
        "Business Registration Certificate",
        "Previous Rental Receipts (if applicable)",
        "Tax Payment Receipts"
      ],
      captcha: "I'm not a robot",
      continue: "Continue",
      footer: "For technical support: support@horana.lk"
    },
    tamil: {
      title: "கடை வாடகை / வர்த்தக வரி வழிகாட்டி பக்கம்",
      englishTitle: "Shop Rental / Trade Tax Instruction Page",
      instructions: [
        "சரியான கடை எண் மற்றும் கடை பெயருக்கு மட்டுமே பணம் செலுத்த வேண்டும். (தவறான எண்களுக்கு செலுத்தப்பட்ட பணம் திருப்பித் தரப்படமாட்டாது.)",
        "கட்டணம் கிரெடிட்/டெபிட் கார்டுகள் மூலமாக மட்டுமே செய்யலாம்.",
        "31.08.2025 வரை நிலுவை வாடகைக்கான ஆன்லைன் கட்டணங்களுக்கு 15% VAT வசூலிக்கப்படும். அதே தேதிவரை நேரடியாக செலுத்தும் போது மட்டுமே VAT வசூலிக்கப்படமாட்டாது.",
        "ஒவ்வொரு மாத வாடகையும் அடுத்த மாதம் 10 ஆம் தேதிக்கு முன் செலுத்தப்படாவிட்டால், 5% அபராத கட்டணம் விதிக்கப்படும்.",
        "வர்த்தக வரி ஆண்டுதோறும் வணிக வருமானம் மற்றும் வகையை அடிப்படையாகக் கொண்டு மதிப்பிடப்பட்டு வசூலிக்கப்படும்.",
        "அனைத்து உரிமங்கள் மற்றும் அனுமதிகளை கட்டணம் செலுத்துவதற்கு முன் புதுப்பித்திருக்க வேண்டும்."
      ],
      importantNotice: "கட்டணம் செலுத்துவதற்கு முன் அனைத்து வழிமுறைகளையும் கவனமாகப் படிக்கவும்.",
      paymentMethods: "கட்டண முறைகள்",
      requiredDocs: "தேவையான ஆவணங்கள்",
      docs: [
        "தேசிய அடையாள அட்டை",
        "வர்த்தக பதிவு சான்றிதழ்",
        "முந்தைய வாடகை ரசீதுகள் (தேவையானால்)",
        "வரி கட்டண ரசீதுகள்"
      ],
      captcha: "நான் ஒரு ரோபோ அல்ல",
      continue: "தொடரவும்",
      footer: "தொழில்நுட்ப உதவிக்காக: support@horana.lk"
    }
  };

  const currentContent = content[language];

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
            {language !== 'english' && currentContent.englishTitle && (
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
              <button
                onClick={() => setLanguage('tamil')}
                className={`px-4 py-2 rounded text-sm font-medium ${
                  language === 'tamil'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                தமிழ்
              </button>
            </div>
          </div>

          {/* Instructions Content */}
          <div className="px-6 py-6 space-y-6">
            {/* Important Notice */}
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
              <div className="flex items-center mb-2">
                <AlertCircle className="w-5 h-5 text-amber-600 mr-2" />
                <h3 className="font-semibold text-amber-800">
                  {language === 'sinhala'
                    ? 'වැදගත් දැනුම්දීම'
                    : language === 'tamil'
                    ? 'முக்கிய அறிவிப்பு'
                    : 'Important Notice'}
                </h3>
              </div>
              <p className="text-amber-700 text-sm">{currentContent.importantNotice}</p>
            </div>

            {/* Instructions List */}
            <div className="space-y-4">
              {currentContent.instructions.map((instruction, index) => (
                <div key={index} className="flex items-start space-x-3">
                  <div className="flex-shrink-0 w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center mt-0.5">
                    <span className="text-blue-600 text-sm font-medium">{index + 1}</span>
                  </div>
                  <p className="text-gray-700 text-sm leading-relaxed">{instruction}</p>
                </div>
              ))}
            </div>

            {/* Payment Methods */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h3 className="font-semibold text-blue-800 mb-2">
                {currentContent.paymentMethods}
              </h3>
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
                  <p className="text-xs text-gray-600">
                    {language === 'tamil' ? 'உள்ளூர் கார்டுகள்' : language === 'sinhala' ? 'දේශීය කාඩ්පත්' : 'Local Cards'}
                  </p>
                </div>
              </div>
            </div>

            {/* Required Documents */}
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <h3 className="font-semibold text-green-800 mb-2">
                {currentContent.requiredDocs}
              </h3>
              <ul className="text-sm text-green-700 space-y-1">
                {currentContent.docs.map((doc, i) => (
                  <li key={i}>• {doc}</li>
                ))}
              </ul>
            </div>
          </div>

          {/* reCAPTCHA Section */}
          <div className="px-6 py-4 border-t bg-gray-50">
            <div className="flex items-center justify-center mb-4">
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
                    {currentContent.captcha}
                  </label>
                </div>
              </div>
            </div>

            {/* Continue Button */}
<div className="flex justify-center">
  <button
    onClick={() => navigate('/log', { state: { fromShopRent: true } })}
    disabled={!captchaVerified}
    className={`px-8 py-2 rounded-lg font-medium transition-colors ${
      captchaVerified
        ? 'bg-blue-600 text-white hover:bg-blue-700'
        : 'bg-gray-300 text-gray-500 cursor-not-allowed'
    }`}
  >
    {currentContent.continue}
    <ChevronRight className="inline-block w-4 h-4 ml-1" />
  </button>
</div>

          </div>
        </div>

        {/* Footer */}
        <div className="text-center text-gray-500 text-sm mt-8">
          <p>© 2025 Horana Municipal Council. All rights reserved.</p>
          <p className="mt-1">{currentContent.footer}</p>
        </div>
      </div>
    </div>
  );
}

export default ShopRentalInstructionPage;
