import React, { useState, useRef, useEffect } from 'react';
import { 
  MessageCircle, 
  Mic, 
  MicOff, 
  Send, 
  Volume2, 
  Calendar, 
  MapPin, 
  FileText,
  User,
  Phone,
  Mail,
  Clock,
  Users,
  X,
  Upload,
  CheckCircle,
  AlertCircle,
  Globe
} from 'lucide-react';
import axios from 'axios';

const BookingChatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [currentLanguage, setCurrentLanguage] = useState('en');
  const [conversationState, setConversationState] = useState('greeting');
  const [bookingType, setBookingType] = useState('');
  const [bookingData, setBookingData] = useState({});
  const [isTyping, setIsTyping] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState({});
  const [waitingForFile, setWaitingForFile] = useState(null);
  
  const messagesEndRef = useRef(null);
  const recognitionRef = useRef(null);
  const fileInputRef = useRef(null);

  // Language configurations
  const languages = {
    en: { 
      code: 'en-US', 
      name: 'English',
      flag: '🇺🇸'
    },
    si: { 
      code: 'si-LK', 
      name: 'සිංහල',
      flag: '🇱🇰'
    },
    ta: { 
      code: 'ta-LK', 
      name: 'தமிழ்',
      flag: '🇱🇰'
    }
  };

  // Playground booking questions sequence
  const playgroundQuestions = [
    'eventName', 'eventType', 'description', 'organizerName', 'email', 
    'phone', 'playgroundType', 'expectedAttendees', 'eventDate', 
    'startTime', 'endTime', 'specialRequirement'
  ];

  // Crematorium booking questions sequence
  const crematoriumQuestions = [
    'applicantFullName', 'surname', 'nic', 'deceasedFullName', 'dateOfDeath',
    'residenceArea', 'registrationNumber', 'cremationDate', 'files'
  ];

  // Translations
  const translations = {
    en: {
      greeting: "Hello! I'm your booking assistant. I can help you book playgrounds or crematorium facilities. Which service would you like to book?",
      playgroundOption: "🏟️ Playground Booking",
      crematoriumOption: "🏛️ Crematorium Booking",
      checkAvailability: "Checking availability for",
      available: "✅ Great news! The slot is available. Would you like to proceed with booking?",
      notAvailable: "❌ Sorry, that slot is not available. Please try a different date/time.",
      bookingComplete: "🎉 Excellent! Your booking has been submitted successfully. You'll receive a confirmation email shortly.",
      error: "I'm sorry, I didn't understand that. Could you please try again?",
      restart: "Would you like to make another booking? Just say 'yes' or click the button below.",
      goodbye: "Thank you for using our booking service. Have a great day!",
      fileUpload: "Please upload the required file by clicking the upload button below:",
      fileUploaded: "File uploaded successfully! ✅",
      processing: "Processing your request...",
      playgroundQuestions: {
        eventName: "What's the name of your event?",
        eventType: "What type of event is this? (e.g., Sports, Cultural, Educational)",
        description: "Please provide a brief description of your event:",
        organizerName: "What's the organizer's full name?",
        email: "Please provide your email address:",
        phone: "What's your phone number?",
        playgroundType: "What type of playground do you need? (e.g., Football, Cricket, Basketball)",
        expectedAttendees: "How many people are expected to attend?",
        eventDate: "When would you like to book? (Please use YYYY-MM-DD format, e.g., 2025-09-15)",
        startTime: "What time should the event start? (Use HH:MM format, e.g., 14:30)",
        endTime: "What time should the event end? (Use HH:MM format, e.g., 18:00)",
        specialRequirement: "Any special requirements? (Optional - you can say 'none' if no requirements)"
      },
      crematoriumQuestions: {
        applicantFullName: "What's the applicant's full name?",
        surname: "Please provide the applicant's address:",
        nic: "What's the applicant's NIC number?",
        deceasedFullName: "What's the full name of the deceased?",
        dateOfDeath: "When did the death occur? (Use YYYY-MM-DD format)",
        residenceArea: "Is the residence within city limits? (Answer: 'within' or 'outside')",
        registrationNumber: "If within city limits, what's the registration number? (Say 'none' if not applicable)",
        cremationDate: "When would you like the cremation? (Use YYYY-MM-DD format)",
        files: "Now I need you to upload the death certificate image. Click the upload button below:"
      }
    },
    si: {
      greeting: "ආයුබෝවන්! මම ඔබගේ වෙන්කිරීම් සහායකයා. මට ක්‍රීඩාංගන හෝ ආදහනාගාර පහසුකම් වෙන්කිරීමට උදව් කළ හැක. ඔබට කුමන සේවාව වෙන්කිරීමට අවශ්‍යද?",
      playgroundOption: "🏟️ ක්‍රීඩාංගන වෙන්කිරීම",
      crematoriumOption: "🏛️ ආදහනාගාර වෙන්කිරීම",
      checkAvailability: "සඳහා ලබා ගත හැකි බව පරීක්ෂා කරමි",
      available: "✅ හොඳ පුවත්! කාල සීමාව ලබා ගත හැක. වෙන්කිරීම ඉදිරියට ගෙන යාමට අවශ්‍යද?",
      notAvailable: "❌ කණගාටුයි, එම කාල සීමාව ලබා ගත නොහැක. කරුණාකර වෙනත් දිනයක්/වේලාවක් උත්සාහ කරන්න.",
      bookingComplete: "🎉 විශිෂ්ටයි! ඔබගේ වෙන්කිරීම සාර්ථකව ඉදිරිපත් කර ඇත. ඔබට ඉක්මනින් තහවුරු කිරීමේ ඊමේල් එකක් ලැබෙනු ඇත.",
      error: "කණගාටුයි, මට එය අවබෝධ වූයේ නැත. කරුණාකර නැවත උත්සාහ කරන්න?",
      restart: "ඔබට වෙනත් වෙන්කිරීමක් කිරීමට අවශ්‍යද? 'ඔව්' කියන්න හෝ පහත බොත්තම ක්ලික් කරන්න.",
      goodbye: "අපගේ වෙන්කිරීම් සේවාව භාවිතා කිරීම ගැන ස්තූතියි. හොඳ දිනයක් වේවා!",
      fileUpload: "කරුණාකර පහත උඩුගත කිරීමේ බොත්තම ක්ලික් කර අවශ්‍ය ගොනුව උඩුගත කරන්න:",
      fileUploaded: "ගොනුව සාර්ථකව උඩුගත කරන ලදි! ✅",
      processing: "ඔබගේ ඉල්ලීම සකස් කරමි...",
      playgroundQuestions: {
        eventName: "ඔබගේ උත්සවයේ නම කුමක්ද?",
        eventType: "මෙය කුමන ආකාරයේ උත්සවයක්ද? (උදා: ක්‍රීඩා, සංස්කෘතික, අධ්‍යාපනික)",
        description: "කරුණාකර ඔබගේ උත්සවය ගැන කෙටි විස්තරයක් දෙන්න:",
        organizerName: "සංවිධායකගේ සම්පූර්ණ නම කුමක්ද?",
        email: "කරුණාකර ඔබගේ විද්‍යුත් තැපෑල ලිපිනය දෙන්න:",
        phone: "ඔබගේ දුරකථන අංකය කුමක්ද?",
        playgroundType: "ඔබට කුමන ආකාරයේ ක්‍රීඩාංගනයක් අවශ්‍යද? (උදා: පාපන්දු, ක්‍රිකට්, පැසිපන්දු)",
        expectedAttendees: "කී දෙනෙකු සහභාගී වනු ඇතැයි අපේක්ෂා කරනවාද?",
        eventDate: "කවදා වෙන්කිරීමට අවශ්‍යද? (YYYY-MM-DD ආකෘතියෙන් භාවිතා කරන්න, උදා: 2025-09-15)",
        startTime: "උත්සවය ආරම්භ වන්නේ කීයටද? (HH:MM ආකෘතියෙන්, උදා: 14:30)",
        endTime: "උත්සවය අවසන් වන්නේ කීයටද? (HH:MM ආකෘතියෙන්, උදා: 18:00)",
        specialRequirement: "කිසියම් විශේෂ අවශ්‍යතාවක් තිබේද? (අත්‍යාවශ්‍ය නැත - අවශ්‍යතා නැතිනම් 'නැත' කියන්න)"
      },
      crematoriumQuestions: {
        applicantFullName: "අයදුම්කරුගේ සම්පූර්ණ නම කුමක්ද?",
        surname: "කරුණාකර අයදුම්කරුගේ ලිපිනය දෙන්න:",
        nic: "අයදුම්කරුගේ ජාතික හැඳුනුම්පත් අංකය කුමක්ද?",
        deceasedFullName: "මියගිය පුද්ගලයාගේ සම්පූර්ණ නම කුමක්ද?",
        dateOfDeath: "මරණය සිදුවූයේ කවදාද? (YYYY-MM-DD ආකෘතියෙන්)",
        residenceArea: "නිවස නගර සීමා ඇතුළතද? (පිළිතුර: 'within' හෝ 'outside')",
        registrationNumber: "නගර සීමා ඇතුළත නම්, ලියාපදිංචි අංකය කුමක්ද? (අදාළ නොවේ නම් 'none' කියන්න)",
        cremationDate: "ආදහනය කවදා කිරීමට අවශ්‍යද? (YYYY-MM-DD ආකෘතියෙන්)",
        files: "දැන් මට මරණ සහතිකයේ පින්තූරය උඩුගත කිරීමට අවශ්‍යයි. පහත උඩුගත කිරීමේ බොත්තම ක්ලික් කරන්න:"
      }
    },
    ta: {
      greeting: "வணக்கம்! நான் உங்கள் முன்பதிவு உதவியாளர். எனக்கு விளையாட்டு மைதானம் அல்லது தகனவிடு வசதிகளை முன்பதிவு செய்ய உதவ முடியும். எந்த சேவையை நீங்கள் முன்பதிவு செய்ய விரும்புகிறீர்கள்?",
      playgroundOption: "🏟️ விளையாட்டு மைதான முன்பதிவு",
      crematoriumOption: "🏛️ தகனவிடு முன்பதிவு",
      checkAvailability: "க்கான கிடைக்கும் தன்மையை சரிபார்க்கிறேன்",
      available: "✅ நல்ல செய்தி! நேரம் கிடைக்கிறது. முன்பதிவுடன் தொடர விரும்புகிறீர்களா?",
      notAvailable: "❌ மன்னிக்கவும், அந்த நேரம் கிடைக்கவில்லை. தயவுசெய்து வேறு தேதி/நேரத்தை முயற்சி செய்யுங்கள்.",
      bookingComplete: "🎉 அருமை! உங்கள் முன்பதிவு வெற்றிகரமாக சமர்பிக்கப்பட்டது. விரைவில் உங்களுக்கு உறுதிப்படுத்தல் மின்னஞ்சல் வரும்.",
      error: "மன்னிக்கவும், எனக்கு அது புரியவில்லை. தயவுசெய்து மீண்டும் முயற்சி செய்யுங்கள்?",
      restart: "நீங்கள் மற்றொரு முன்பதிவு செய்ய விரும்புகிறீர்களா? 'ஆம்' என்று சொல்லுங்கள் அல்லது கீழே உள்ள பொத்தானை கிளிக் செய்யுங்கள்.",
      goodbye: "எங்கள் முன்பதிவு சேவையை பயன்படுத்தியதற்கு நன்றி. நல்ல நாள் வாழ்த்துக்கள்!",
      fileUpload: "தயவுசெய்து கீழே உள்ள பதிவேற்று பொத்தானை கிளிக் செய்து தேவையான கோப்பை பதிவேற்றுங்கள்:",
      fileUploaded: "கோப்பு வெற்றிகரமாக பதிவேற்றப்பட்டது! ✅",
      processing: "உங்கள் கோரிக்கையை செயலாக்குகிறேன்...",
      playgroundQuestions: {
        eventName: "உங்கள் நிகழ்வின் பெயர் என்ன?",
        eventType: "இது எந்த வகையான நிகழ்வு? (உதா: விளையாட்டு, கலாச்சாரம், கல்வி)",
        description: "தயவுசெய்து உங்கள் நிகழ்வு பற்றி சுருக்கமான விளக்கம் கொடுங்கள்:",
        organizerName: "நிகழ்வு நடத்துனரின் முழுப்பெயர் என்ன?",
        email: "தயவுசெய்து உங்கள் மின்னஞ்சல் முகவரியை கொடுங்கள்:",
        phone: "உங்கள் தொலைபேசி எண் என்ன?",
        playgroundType: "எந்த வகையான விளையாட்டு மைதானம் உங்களுக்கு தேவை? (உதா: கால்பந்து, கிரிக்கெட், கூடைபந்து)",
        expectedAttendees: "எத்தனை பேர் கலந்து கொள்வார்கள் என்று எதிர்பார்க்கிறீர்கள்?",
        eventDate: "எப்போது முன்பதிவு செய்ய விரும்புகிறீர்கள்? (YYYY-MM-DD வடிவத்தில் பயன்படுத்துங்கள், உதா: 2025-09-15)",
        startTime: "நிகழ்வு எத்தனை மணிக்கு தொடங்க வேண்டும்? (HH:MM வடிவத்தில், உதா: 14:30)",
        endTime: "நிகழ்வு எத்தனை மணிக்கு முடிய வேண்டும்? (HH:MM வடிவத்தில், உதா: 18:00)",
        specialRequirement: "ஏதேனும் சிறப்பு தேவைகள்? (விருப்பமான - தேவைகள் இல்லாவிட்டால் 'none' என்று சொல்லுங்கள்)"
      },
      crematoriumQuestions: {
        applicantFullName: "விண்ணப்பதாரரின் முழுப்பெயர் என்ன?",
        surname: "தயவுசெய்து விண்ணப்பதாரரின் முகவரியை கொடுங்கள்:",
        nic: "விண்ணப்பதாரரின் தேசிய அடையாள அட்டை எண் என்ன?",
        deceasedFullName: "இறந்தவரின் முழுப்பெயர் என்ன?",
        dateOfDeath: "மரணம் எப்போது நடந்தது? (YYYY-MM-DD வடிவத்தில்)",
        residenceArea: "குடியிருப்பு நகர எல்லைக்குள் உள்ளதா? (பதில்: 'within' அல்லது 'outside')",
        registrationNumber: "நகர எல்லைக்குள் இருந்தால், பதிவு எண் என்ன? (பொருந்தாது என்றால் 'none' என்று சொல்லுங்கள்)",
        cremationDate: "தகனம் எப்போது செய்ய விரும்புகிறீர்கள்? (YYYY-MM-DD வடிவத்தில்)",
        files: "இப்போது மரண சான்றிதழின் படத்தை பதிவேற்ற வேண்டும். கீழே உள்ள பதிவேற்று பொத்தானை கிளிக் செய்யுங்கள்:"
      }
    }
  };

  const t = (key) => {
    const keys = key.split('.');
    let value = translations[currentLanguage];
    for (const k of keys) {
      value = value?.[k];
    }
    return value || key;
  };

  // Initialize speech recognition
  useEffect(() => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
      
      recognitionRef.current.onstart = () => setIsListening(true);
      recognitionRef.current.onend = () => setIsListening(false);
      recognitionRef.current.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setInputText(transcript);
        handleSendMessage(transcript);
      };
      recognitionRef.current.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);
      };
    }
  }, []);

  // Update speech recognition language
  useEffect(() => {
    if (recognitionRef.current) {
      recognitionRef.current.lang = languages[currentLanguage].code;
    }
  }, [currentLanguage]);

  // Auto scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Initialize chat with greeting
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      addMessage(t('greeting'));
    }
  }, [isOpen, currentLanguage]);

  const startListening = () => {
    if (recognitionRef.current && !isListening) {
      try {
        recognitionRef.current.start();
      } catch (error) {
        console.error('Error starting speech recognition:', error);
      }
    }
  };

  const stopListening = () => {
    if (recognitionRef.current && isListening) {
      recognitionRef.current.stop();
    }
  };

  const speak = (text) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = languages[currentLanguage].code;
      speechSynthesis.speak(utterance);
    }
  };

  const simulateTyping = async () => {
    setIsTyping(true);
    await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000));
    setIsTyping(false);
  };

  const addMessage = (text, sender = 'bot') => {
    const message = {
      id: Date.now(),
      text,
      sender,
      timestamp: new Date()
    };
    setMessages(prev => [...prev, message]);
    
    if (sender === 'bot') {
      speak(text);
    }
  };

  // Check real availability from database
  const checkAvailability = async (date, startTime, endTime, type) => {
    try {
      await simulateTyping();
      addMessage(`${t('checkAvailability')} ${date}${startTime ? ` from ${startTime}` : ''}${endTime ? ` to ${endTime}` : ''}...`);

      // Check for conflicting bookings
      const endpoint = type === 'playground' ? '/users' : '/crematorium';
      const response = await axios.get(`http://localhost:5000${endpoint}`);
      
      const existingBookings = response.data.users || response.data.data || [];
      
      // Check for conflicts
      const hasConflict = existingBookings.some(booking => {
        const bookingDate = new Date(booking.eventDate || booking.cremationDate).toDateString();
        const requestedDate = new Date(date).toDateString();
        
        if (bookingDate !== requestedDate) return false;
        
        if (type === 'playground' && startTime && endTime) {
          const bookingStart = booking.startTime;
          const bookingEnd = booking.endTime;
          
          // Check time overlap
          return (startTime < bookingEnd && endTime > bookingStart);
        }
        
        return true; // For crematorium, only one per day
      });

      await new Promise(resolve => setTimeout(resolve, 1500));
      
      if (!hasConflict) {
        addMessage(t('available'));
        return true;
      } else {
        addMessage(t('notAvailable'));
        return false;
      }
    } catch (error) {
      console.error('Availability check error:', error);
      addMessage("Sorry, I couldn't check availability right now. Let's proceed with your booking anyway.");
      return true;
    }
  };

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      setUploadedFiles(prev => ({ ...prev, [waitingForFile]: file }));
      addMessage(t('fileUploaded'));
      setWaitingForFile(null);
      
      // Continue with next question or complete booking
      if (waitingForFile === 'deathCertificateImage') {
        // Ask for BE order file (optional)
        setTimeout(() => {
          addMessage("Would you also like to upload a BE order image? (Optional - say 'yes' or 'no')");
          setWaitingForFile('beOrderImage');
        }, 1000);
      } else if (waitingForFile === 'beOrderImage') {
        // Complete crematorium booking
        setTimeout(() => {
          completeCrematoriumBooking();
        }, 1000);
      }
    }
  };

  const handleSendMessage = async (text = inputText) => {
    if (!text.trim()) return;

    addMessage(text, 'user');
    setInputText('');
    await simulateTyping();

    // Handle conversation flow
    if (conversationState === 'greeting') {
      if (text.toLowerCase().includes('playground') || text.toLowerCase().includes('ක්‍රීඩාංගන') || text.toLowerCase().includes('விளையாட்டு')) {
        setBookingType('playground');
        setConversationState('playground_booking');
        addMessage(t('playgroundQuestions.eventName'));
      } else if (text.toLowerCase().includes('crematorium') || text.toLowerCase().includes('ආදහනාගාර') || text.toLowerCase().includes('தகன')) {
        setBookingType('crematorium');
        setConversationState('crematorium_booking');
        addMessage(t('crematoriumQuestions.applicantFullName'));
      } else {
        addMessage(t('greeting'));
      }
    } else if (conversationState === 'playground_booking') {
      await handlePlaygroundBooking(text);
    } else if (conversationState === 'crematorium_booking') {
      await handleCrematoriumBooking(text);
    } else if (conversationState === 'awaiting_confirmation') {
      if (text.toLowerCase().includes('yes') || text.toLowerCase().includes('ඔව්') || text.toLowerCase().includes('ஆம்')) {
        if (bookingType === 'playground') {
          await submitPlaygroundBooking();
        } else {
          await submitCrematoriumBooking();
        }
      } else {
        addMessage("Okay, let's try a different date/time. What would you prefer?");
        // Go back to date question
        const questions = bookingType === 'playground' ? playgroundQuestions : crematoriumQuestions;
        const dateFieldIndex = questions.indexOf(bookingType === 'playground' ? 'eventDate' : 'cremationDate');
        setBookingData(prev => {
          const newData = { ...prev };
          questions.slice(dateFieldIndex).forEach(field => delete newData[field]);
          return newData;
        });
        addMessage(t(`${bookingType}Questions.${questions[dateFieldIndex]}`));
        setConversationState(`${bookingType}_booking`);
      }
    } else if (waitingForFile === 'beOrderImage') {
      if (text.toLowerCase().includes('yes') || text.toLowerCase().includes('ඔව්') || text.toLowerCase().includes('ஆம்')) {
        addMessage("Please upload the BE order image:");
        // Keep waiting for file
      } else {
        setWaitingForFile(null);
        await completeCrematoriumBooking();
      }
    }
  };

  const handlePlaygroundBooking = async (text) => {
    const currentStep = Object.keys(bookingData).length;
    const currentField = playgroundQuestions[currentStep];
    
    // Validate and process input
    let processedValue = text;
    
    if (currentField === 'expectedAttendees') {
      processedValue = parseInt(text);
      if (isNaN(processedValue)) {
        addMessage("Please enter a valid number for expected attendees.");
        return;
      }
    } else if (currentField === 'eventDate' || currentField === 'startTime' || currentField === 'endTime') {
      if (currentField === 'eventDate' && !text.match(/^\d{4}-\d{2}-\d{2}$/)) {
        addMessage("Please use the correct date format: YYYY-MM-DD (e.g., 2025-09-15)");
        return;
      } else if ((currentField === 'startTime' || currentField === 'endTime') && !text.match(/^\d{2}:\d{2}$/)) {
        addMessage("Please use the correct time format: HH:MM (e.g., 14:30)");
        return;
      }
    }
    
    setBookingData(prev => ({ ...prev, [currentField]: processedValue }));
    
    if (currentStep + 1 < playgroundQuestions.length) {
      const nextField = playgroundQuestions[currentStep + 1];
      addMessage(t(`playgroundQuestions.${nextField}`));
    } else {
      // All questions answered, check availability
      const { eventDate, startTime, endTime } = { ...bookingData, [currentField]: processedValue };
      const isAvailable = await checkAvailability(eventDate, startTime, endTime, 'playground');
      
      if (isAvailable) {
        setConversationState('awaiting_confirmation');
      } else {
        // Go back to date/time questions
        const dateIndex = playgroundQuestions.indexOf('eventDate');
        setBookingData(prev => {
          const newData = { ...prev };
          playgroundQuestions.slice(dateIndex).forEach(field => delete newData[field]);
          return newData;
        });
        addMessage(t('playgroundQuestions.eventDate'));
      }
    }
  };

  const handleCrematoriumBooking = async (text) => {
    const currentStep = Object.keys(bookingData).filter(key => key !== 'files').length;
    const currentField = crematoriumQuestions[currentStep];
    
    if (currentField === 'files') {
      addMessage(t('crematoriumQuestions.files'));
      setWaitingForFile('deathCertificateImage');
      return;
    }
    
    // Validate inputs
    let processedValue = text;
    
    if (currentField === 'dateOfDeath' || currentField === 'cremationDate') {
      if (!text.match(/^\d{4}-\d{2}-\d{2}$/)) {
        addMessage("Please use the correct date format: YYYY-MM-DD (e.g., 2025-09-15)");
        return;
      }
    } else if (currentField === 'residenceArea') {
      if (!['within', 'outside'].includes(text.toLowerCase())) {
        addMessage("Please answer 'within' or 'outside' for residence area.");
        return;
      }
      processedValue = text.toLowerCase();
    } else if (currentField === 'registrationNumber' && text.toLowerCase() === 'none') {
      processedValue = '';
    }
    
    setBookingData(prev => ({ ...prev, [currentField]: processedValue }));
    
    if (currentStep + 1 < crematoriumQuestions.length) {
      const nextField = crematoriumQuestions[currentStep + 1];
      addMessage(t(`crematoriumQuestions.${nextField}`));
    } else {
      // Check availability before asking for files
      const { cremationDate } = { ...bookingData, [currentField]: processedValue };
      const isAvailable = await checkAvailability(cremationDate, null, null, 'crematorium');
      
      if (isAvailable) {
        addMessage(t('crematoriumQuestions.files'));
        setWaitingForFile('deathCertificateImage');
      } else {
        // Go back to cremation date
        const dateIndex = crematoriumQuestions.indexOf('cremationDate');
        setBookingData(prev => {
          const newData = { ...prev };
          delete newData.cremationDate;
          return newData;
        });
        addMessage(t('crematoriumQuestions.cremationDate'));
      }
    }
  };

  const submitPlaygroundBooking = async () => {
    try {
      addMessage(t('processing'));
      
      const response = await axios.post("http://localhost:5000/users", {
        ...bookingData,
        expectedAttendees: Number(bookingData.expectedAttendees),
      });

      if (response.status === 201) {
        addMessage(t('bookingComplete'));
        setTimeout(() => {
          addMessage(t('restart'));
          resetForNewBooking();
        }, 3000);
      }
    } catch (error) {
      console.error("Error submitting playground booking:", error);
      addMessage("Sorry, there was an error submitting your booking. Please try again or contact support.");
    }
  };

  const completeCrematoriumBooking = async () => {
    try {
      addMessage(t('processing'));
      
      const formData = new FormData();
      
      // Append all booking data
      Object.entries(bookingData).forEach(([key, value]) => {
        if (key !== 'files') {
          formData.append(key, value);
        }
      });
      
      // Append declaration agreement
      formData.append('declarationAgreement', 'true');
      
      // Append files
      if (uploadedFiles.deathCertificateImage) {
        formData.append('deathCertificateImage', uploadedFiles.deathCertificateImage);
      }
      if (uploadedFiles.beOrderImage) {
        formData.append('beOrderImage', uploadedFiles.beOrderImage);
      }

      const response = await axios.post("http://localhost:5000/crematorium", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (response.status === 201) {
        addMessage(t('bookingComplete'));
        setTimeout(() => {
          addMessage(t('restart'));
          resetForNewBooking();
        }, 3000);
      }
    } catch (error) {
      console.error("Error submitting crematorium booking:", error);
      addMessage("Sorry, there was an error submitting your booking. Please try again or contact support.");
    }
  };

  const submitCrematoriumBooking = async () => {
    await completeCrematoriumBooking();
  };

  const resetForNewBooking = () => {
    setConversationState('greeting');
    setBookingData({});
    setBookingType('');
    setUploadedFiles({});
    setWaitingForFile(null);
  };

  const resetChat = () => {
    setMessages([]);
    resetForNewBooking();
    setInputText('');
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {/* Chat Toggle Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white p-4 rounded-full shadow-lg transition-all duration-300 animate-pulse"
        >
          <MessageCircle className="h-6 w-6" />
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div className="bg-white rounded-lg shadow-2xl w-96 h-[32rem] flex flex-col border border-gray-200">
          {/* Chat Header */}
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-4 rounded-t-lg flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <MessageCircle className="h-5 w-5" />
              <span className="font-semibold">Smart Booking Assistant</span>
            </div>
            <div className="flex items-center space-x-2">
              {/* Language Selector */}
              <select
                value={currentLanguage}
                onChange={(e) => setCurrentLanguage(e.target.value)}
                className="bg-blue-800 text-white text-xs rounded px-2 py-1 border-none outline-none"
              >
                {Object.entries(languages).map(([code, lang]) => (
                  <option key={code} value={code} className="bg-white text-black">
                    {lang.flag} {lang.name}
                  </option>
                ))}
              </select>
              <button
                onClick={() => setIsOpen(false)}
                className="text-white hover:text-gray-200 transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Messages Container */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-xs px-4 py-2 rounded-lg ${
                    message.sender === 'user'
                      ? 'bg-blue-600 text-white rounded-br-none'
                      : 'bg-white text-gray-800 shadow-md border rounded-bl-none'
                  }`}
                >
                  <p className="text-sm whitespace-pre-wrap">{message.text}</p>
                  <span className="text-xs opacity-75 mt-1 block">
                    {message.timestamp.toLocaleTimeString([], { 
                      hour: '2-digit', 
                      minute: '2-digit' 
                    })}
                  </span>
                </div>
              </div>
            ))}
            
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-white text-gray-800 shadow-md border max-w-xs px-4 py-2 rounded-lg rounded-bl-none">
                  <div className="flex space-x-2">
                    <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Actions */}
          {conversationState === 'greeting' && (
            <div className="px-4 py-2 border-t border-gray-200 bg-white">
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => handleSendMessage(t('playgroundOption'))}
                  className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-xs hover:bg-green-200 transition-colors flex items-center"
                >
                  <MapPin className="h-3 w-3 mr-1" />
                  {t('playgroundOption')}
                </button>
                <button
                  onClick={() => handleSendMessage(t('crematoriumOption'))}
                  className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-xs hover:bg-purple-200 transition-colors flex items-center"
                >
                  <FileText className="h-3 w-3 mr-1" />
                  {t('crematoriumOption')}
                </button>
              </div>
            </div>
          )}

          {/* File Upload Section */}
          {waitingForFile && (
            <div className="px-4 py-2 border-t border-gray-200 bg-yellow-50">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-700">Upload Required:</span>
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="bg-blue-600 text-white px-3 py-1 rounded-md text-xs hover:bg-blue-700 transition-colors flex items-center"
                >
                  <Upload className="h-3 w-3 mr-1" />
                  Choose File
                </button>
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*,.pdf"
                onChange={handleFileUpload}
                className="hidden"
              />
            </div>
          )}

          {/* Input Area */}
          <div className="p-4 border-t border-gray-200 bg-white rounded-b-lg">
            <div className="flex items-center space-x-2">
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                placeholder={
                  currentLanguage === 'en' ? 'Type your message...' : 
                  currentLanguage === 'si' ? 'ඔබගේ පණිවිඩය ටයිප් කරන්න...' : 
                  'உங்கள் செய்தியை தட்டச்சு செய்யুங்கள்...'
                }
                className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                disabled={waitingForFile}
              />
              
              {/* Voice Recognition Button */}
              <button
                onClick={isListening ? stopListening : startListening}
                className={`p-2 rounded-lg transition-colors ${
                  isListening 
                    ? 'bg-red-500 text-white animate-pulse' 
                    : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
                }`}
                title={isListening ? 'Stop listening' : 'Start voice input'}
                disabled={waitingForFile}
              >
                {isListening ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
              </button>
              
              {/* Send Button */}
              <button
                onClick={() => handleSendMessage()}
                className="bg-blue-600 text-white p-2 rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-400"
                title="Send message"
                disabled={waitingForFile}
              >
                <Send className="h-4 w-4" />
              </button>
            </div>
            
            {/* Status Indicators */}
            <div className="mt-2 flex items-center justify-between text-xs text-gray-500">
              <div className="flex items-center space-x-2">
                {Object.keys(uploadedFiles).length > 0 && (
                  <span className="flex items-center">
                    <CheckCircle className="h-3 w-3 text-green-500 mr-1" />
                    {Object.keys(uploadedFiles).length} file(s) uploaded
                  </span>
                )}
                {conversationState !== 'greeting' && bookingType && (
                  <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded-full">
                    {bookingType === 'playground' ? '🏟️' : '🏛️'} {bookingType}
                  </span>
                )}
              </div>
              <button
                onClick={resetChat}
                className="text-gray-400 hover:text-gray-600 transition-colors"
                title="Start new conversation"
              >
                🔄 Reset
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BookingChatbot;