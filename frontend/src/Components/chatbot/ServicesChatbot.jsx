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

  // CORRECTED: Field sequences to match your exact backend forms
  const playgroundQuestions = [
    'eventName', 'eventType', 'description', 'organizerName', 'email', 
    'phone', 'playgroundType', 'expectedAttendees', 'eventDate', 
    'startTime', 'endTime', 'specialRequirement'
  ];

  // CORRECTED: Crematorium fields to match your backend exactly
  const crematoriumQuestions = [
    'applicantFullName', 'address', 'applicantEmail', 'nic', 'deceasedFullName', 
    'dateOfDeath', 'residenceArea', 'registrationNumber', 'cremationDate', 
    'startTime', 'endTime', 'files'
  ];

  // Enhanced validation patterns matching your form validation exactly
  const validationPatterns = {
    email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    phone: /^(\+94|0)?[1-9]\d{8}$/,
    nic: /^[0-9]{9}[vVxX]$|^[0-9]{12}$/,
    date: /^\d{4}-\d{2}-\d{2}$/,
    time: /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/,
    name: /^[a-zA-Z\s\u0D80-\u0DFF\u200D\u200C.'-]+$/,
    eventName: /^[a-zA-Z0-9\s\u0D80-\u0DFF\u200D\u200C.,'-]+$/
  };

  // Complete translations
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
      validationError: "Please provide a valid",
      authError: "Authentication required. Please log in first.",
      serverError: "Server error occurred. Please try again.",
      playgroundQuestions: {
        eventName: "What's the name of your event? (3-100 characters, letters, numbers, and basic punctuation only)",
        eventType: "What type of event is this? (e.g., Sports, Cultural, Educational - 3-50 characters)",
        description: "Please provide a brief description of your event (10-500 characters):",
        organizerName: "What's the organizer's full name? (2-50 characters, letters only)",
        email: "Please provide your email address:",
        phone: "What's your phone number? (Sri Lankan format: 0771234567 or +94771234567)",
        playgroundType: "What type of playground do you need? (e.g., Football, Cricket, Basketball - 3-50 characters)",
        expectedAttendees: "How many people are expected to attend? (1-10000)",
        eventDate: "When would you like to book? (Please use YYYY-MM-DD format, e.g., 2025-09-15, must be today or future)",
        startTime: "What time should the event start? (Use HH:MM format, e.g., 14:30)",
        endTime: "What time should the event end? (Use HH:MM format, e.g., 18:00, must be after start time)",
        specialRequirement: "Any special requirements? (Optional - max 300 characters, you can say 'none' if no requirements)"
      },
      crematoriumQuestions: {
        applicantFullName: "What's the applicant's full name? (2-50 characters, letters only)",
        address: "Please provide the applicant's full address:",
        applicantEmail: "What's the applicant's email address?",
        nic: "What's the applicant's NIC number? (9 digits + V/X or 12 digits)",
        deceasedFullName: "What's the full name of the deceased? (2-50 characters, letters only)",
        dateOfDeath: "When did the death occur? (Use YYYY-MM-DD format, cannot be future date)",
        residenceArea: "Is the residence within city limits? (Answer: 'within' or 'outside')",
        registrationNumber: "If within city limits, what's the registration number? (Say 'none' if not applicable)",
        cremationDate: "When would you like the cremation? (Use YYYY-MM-DD format, must be today or future)",
        startTime: "What time should the cremation start? (Use HH:MM format, e.g., 10:00)",
        endTime: "What time should the cremation end? (Use HH:MM format, e.g., 12:00, must be after start time)",
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
      validationError: "කරුණාකර වලංගු",
      authError: "සත්‍යාපනය අවශ්‍යයි. කරුණාකර පළමුව ප්‍රවේශ වන්න.",
      serverError: "සේවාදායක දෝෂයක් සිදුවිය. කරුණාකර නැවත උත්සාහ කරන්න.",
      playgroundQuestions: {
        eventName: "ඔබගේ උත්සවයේ නම කුමක්ද? (අක්ෂර 3-100, අකුරු, ඇංක සහ මූලික විරාම ලකුණු පමණක්)",
        eventType: "මෙය කුමන ආකාරයේ උත්සවයක්ද? (උදා: ක්‍රීඩා, සංස්කෘතික, අධ්‍යාපනික - අක්ෂර 3-50)",
        description: "කරුණාකර ඔබගේ උත්සවය ගැන කෙටි විස්තරයක් දෙන්න (අක්ෂර 10-500):",
        organizerName: "සංවිධායකගේ සම්පූර්ණ නම කුමක්ද? (අක්ෂර 2-50, අකුරු පමණක්)",
        email: "කරුණාකර ඔබගේ විද්‍යුත් තැපෑල ලිපිනය දෙන්න:",
        phone: "ඔබගේ දුරකථන අංකය කුමක්ද? (ශ්‍රී ලාංකික ආකෘතිය: 0771234567 හෝ +94771234567)",
        playgroundType: "ඔබට කුමන ආකාරයේ ක්‍රීඩාංගනයක් අවශ්‍යද? (උදා: පාපන්දු, ක්‍රිකට්, පැසිපන්දු - අක්ෂර 3-50)",
        expectedAttendees: "කී දෙනෙකු සහභාගී වනු ඇතැයි අපේක්ෂා කරනවාද? (1-10000)",
        eventDate: "කවදා වෙන්කිරීමට අවශ්‍යද? (YYYY-MM-DD ආකෘතියෙන්, අද හෝ අනාගත දිනයක්)",
        startTime: "උත්සවය ආරම්භ වන්නේ කීයටද? (HH:MM ආකෘතියෙන්, උදා: 14:30)",
        endTime: "උත්සවය අවසන් වන්නේ කීයටද? (HH:MM ආකෘතියෙන්, ආරම්භ වේලාවට පසුව)",
        specialRequirement: "කිසියම් විශේෂ අවශ්‍යතාවක් තිබේද? (අත්‍යාවශ්‍ය නැත - උපරිම අක්ෂර 300)"
      },
      crematoriumQuestions: {
        applicantFullName: "අයදුම්කරුගේ සම්පූර්ණ නම කුමක්ද? (අක්ෂර 2-50, අකුරු පමණක්)",
        address: "කරුණාකර අයදුම්කරුගේ සම්පූර්ණ ලිපිනය දෙන්න:",
        applicantEmail: "අයදුම්කරුගේ විද්‍යුත් තැපෑල ලිපිනය කුමක්ද?",
        nic: "අයදුම්කරුගේ ජාතික හැඳුනුම්පත් අංකය කුමක්ද? (ඉලක්කම් 9 + V/X හෝ ඉලක්කම් 12)",
        deceasedFullName: "මියගිය පුද්ගලයාගේ සම්පූර්ණ නම කුමක්ද? (අක්ෂර 2-50, අකුරු පමණක්)",
        dateOfDeath: "මරණය සිදුවූයේ කවදාද? (YYYY-MM-DD ආකෘතියෙන්, අනාගත දිනයක් විය නොහැක)",
        residenceArea: "නිවස නගර සීමා ඇතුළතද? (පිළිතුර: 'within' හෝ 'outside')",
        registrationNumber: "නගර සීමා ඇතුළත නම්, ලියාපදිංචි අංකය කුමක්ද? (අදාළ නොවේ නම් 'none')",
        cremationDate: "ආදහනය කවදා කිරීමට අවශ්‍යද? (YYYY-MM-DD ආකෘතියෙන්, අද හෝ අනාගත දිනයක්)",
        startTime: "ආදහනය ආරම්භ වන්නේ කීයටද? (HH:MM ආකෘතියෙන්, උදා: 10:00)",
        endTime: "ආදහනය අවසන් වන්නේ කීයටද? (HH:MM ආකෘතියෙන්, ආරම්භ වේලාවට පසුව)",
        files: "දැන් මට මරණ සහතිකයේ පින්තූරය උඩුගත කිරීමට අවශ්‍යයි:"
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

  // Enhanced validation function matching your form validation rules exactly
  const validateInput = (field, value, bookingType) => {
    if (!value || value.trim() === '') {
      if (field === 'specialRequirement' || field === 'registrationNumber') {
        return { isValid: true, error: null }; // Optional fields
      }
      return { isValid: false, error: `${field} is required` };
    }

    const trimmedValue = value.trim();

    switch (field) {
      case 'eventName':
        if (trimmedValue.length < 3 || trimmedValue.length > 100) {
          return { isValid: false, error: 'Event name must be 3-100 characters' };
        }
        if (!validationPatterns.eventName.test(trimmedValue)) {
          return { isValid: false, error: 'Event name contains invalid characters' };
        }
        break;

      case 'eventType':
      case 'playgroundType':
        if (trimmedValue.length < 3 || trimmedValue.length > 50) {
          return { isValid: false, error: 'Must be 3-50 characters' };
        }
        if (!validationPatterns.eventName.test(trimmedValue)) {
          return { isValid: false, error: 'Contains invalid characters' };
        }
        break;

      case 'description':
        if (trimmedValue.length < 10 || trimmedValue.length > 500) {
          return { isValid: false, error: 'Description must be 10-500 characters' };
        }
        break;

      case 'organizerName':
      case 'applicantFullName':
      case 'deceasedFullName':
        if (trimmedValue.length < 2 || trimmedValue.length > 50) {
          return { isValid: false, error: 'Name must be 2-50 characters' };
        }
        if (!validationPatterns.name.test(trimmedValue)) {
          return { isValid: false, error: 'Name contains invalid characters' };
        }
        break;

      case 'email':
      case 'applicantEmail':
        if (!validationPatterns.email.test(trimmedValue)) {
          return { isValid: false, error: 'Please enter a valid email address' };
        }
        break;

      case 'phone':
        if (!validationPatterns.phone.test(trimmedValue)) {
          return { isValid: false, error: 'Please enter a valid Sri Lankan phone number (0771234567 or +94771234567)' };
        }
        break;

      case 'nic':
        if (!validationPatterns.nic.test(trimmedValue)) {
          return { isValid: false, error: 'Please enter a valid NIC (9 digits + V/X or 12 digits)' };
        }
        break;

      case 'expectedAttendees':
        const attendees = parseInt(trimmedValue);
        if (isNaN(attendees) || attendees < 1 || attendees > 10000) {
          return { isValid: false, error: 'Expected attendees must be between 1 and 10000' };
        }
        break;

      case 'eventDate':
      case 'cremationDate':
        if (!validationPatterns.date.test(trimmedValue)) {
          return { isValid: false, error: 'Please use YYYY-MM-DD format (e.g., 2025-09-15)' };
        }
        const selectedDate = new Date(trimmedValue);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        if (selectedDate < today) {
          return { isValid: false, error: 'Date cannot be in the past' };
        }
        break;

      case 'dateOfDeath':
        if (!validationPatterns.date.test(trimmedValue)) {
          return { isValid: false, error: 'Please use YYYY-MM-DD format (e.g., 2025-09-15)' };
        }
        const deathDate = new Date(trimmedValue);
        const todayDeath = new Date();
        if (deathDate > todayDeath) {
          return { isValid: false, error: 'Death date cannot be in the future' };
        }
        break;

      case 'startTime':
      case 'endTime':
        if (!validationPatterns.time.test(trimmedValue)) {
          return { isValid: false, error: 'Please use HH:MM format (e.g., 14:30)' };
        }
        break;

      case 'residenceArea':
        if (!['within', 'outside'].includes(trimmedValue.toLowerCase())) {
          return { isValid: false, error: 'Please answer "within" or "outside"' };
        }
        break;

      case 'specialRequirement':
        if (trimmedValue.length > 300) {
          return { isValid: false, error: 'Special requirements cannot exceed 300 characters' };
        }
        break;

      case 'address':
        if (trimmedValue.length < 5 || trimmedValue.length > 200) {
          return { isValid: false, error: 'Address must be 5-200 characters' };
        }
        break;
    }

    // Check end time is after start time
    if (field === 'endTime') {
      const startTime = bookingData.startTime;
      if (startTime && trimmedValue <= startTime) {
        return { isValid: false, error: 'End time must be after start time' };
      }
    }

    return { isValid: true, error: null };
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

  // REAL API CALL: Check availability with actual fetch
  const checkAvailability = async (date, startTime, endTime, type) => {
    try {
      await simulateTyping();
      addMessage(`${t('checkAvailability')} ${date}${startTime ? ` from ${startTime}` : ''}${endTime ? ` to ${endTime}` : ''}...`);

      console.log('=== AVAILABILITY CHECK DEBUG ===');
      console.log('Type:', type);
      console.log('Date:', date);
      console.log('Start Time:', startTime);
      console.log('End Time:', endTime);

      // Use your existing GET endpoint to check for conflicts
      const endpoint = type === 'playground' ? '/playgrounds' : '/crematorium';
      console.log(`Checking availability at: http://localhost:5000${endpoint}`);
      
      const response = await fetch(`http://localhost:5000${endpoint}`, {
        method: 'GET',
        credentials: 'include'
      });
      
      console.log('API Response Status:', response.status);
      
      if (response.ok) {
        const data = await response.json();
        console.log('Existing bookings data:', data);
        
        // Check for conflicts based on your data structure
        let hasConflict = false;
        
        if (type === 'playground') {
          // Your playground API returns { items: [...], count: ... }
          const existingBookings = data.items || [];
          hasConflict = existingBookings.some(booking => {
            const bookingDate = new Date(booking.eventDate).toDateString();
            const requestedDate = new Date(date).toDateString();
            
            console.log('Comparing dates:', bookingDate, 'vs', requestedDate);
            
            if (bookingDate !== requestedDate) return false;
            
            if (startTime && endTime) {
              const bookingStart = booking.startTime;
              const bookingEnd = booking.endTime;
              
              console.log('Checking time overlap:', `${startTime}-${endTime}`, 'vs', `${bookingStart}-${bookingEnd}`);
              
              // Check time overlap
              return (startTime < bookingEnd && endTime > bookingStart);
            }
            
            return true; // Same date conflict for playground
          });
        } else {
          // Crematorium API returns { data: [...] }
          const existingBookings = data.data || [];
          hasConflict = existingBookings.some(booking => {
            const bookingDate = new Date(booking.cremationDate).toDateString();
            const requestedDate = new Date(date).toDateString();
            console.log('Crematorium date comparison:', bookingDate, 'vs', requestedDate);
            return bookingDate === requestedDate; // Only one cremation per day
          });
        }
        
        console.log('Has conflict:', hasConflict);
        
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        if (!hasConflict) {
          addMessage(t('available'));
          return true;
        } else {
          addMessage(t('notAvailable'));
          return false;
        }
      } else {
        throw new Error(`HTTP ${response.status}`);
      }
    } catch (error) {
      console.error('Availability check error:', error);
      addMessage("Availability check temporarily unavailable. Let's proceed with your booking.");
      return true;
    }
  };

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      // Enhanced file validation
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'application/pdf'];
      if (!allowedTypes.includes(file.type)) {
        addMessage("❌ Please upload a valid image (JPG, PNG) or PDF file.");
        return;
      }
      
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        addMessage("❌ File size must be less than 5MB.");
        return;
      }
      
      console.log('File uploaded:', file.name, file.type, file.size);
      setUploadedFiles(prev => ({ ...prev, [waitingForFile]: file }));
      addMessage(t('fileUploaded'));
      setWaitingForFile(null);
      
      // Continue with next question or complete booking
      if (waitingForFile === 'deathCertificateImage') {
        setTimeout(() => {
          addMessage("Would you also like to upload a BE order image? (Optional - say 'yes' or 'no')");
          setWaitingForFile('beOrderImage');
        }, 1000);
      } else if (waitingForFile === 'beOrderImage') {
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
    
    // Handle special cases for optional fields
    let processedValue = text;
    if (currentField === 'specialRequirement' && (
      text.toLowerCase().includes('none') || 
      text.toLowerCase().includes('නැත') || 
      text.toLowerCase().includes('இல்லை') ||
      text.toLowerCase().includes('no')
    )) {
      processedValue = '';
    }
    
    // Validate input with enhanced validation
    const validation = validateInput(currentField, processedValue, 'playground');
    if (!validation.isValid) {
      addMessage(`❌ ${validation.error}. Please try again.`);
      return;
    }
    
    // Process specific field types
    if (currentField === 'expectedAttendees') {
      processedValue = parseInt(processedValue);
    } else if (currentField === 'residenceArea') {
      processedValue = processedValue.toLowerCase();
    }
    
    console.log(`✅ Setting ${currentField} to:`, processedValue);
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
    
    // Handle special cases
    let processedValue = text;
    if (currentField === 'registrationNumber' && text.toLowerCase() === 'none') {
      processedValue = '';
    } else if (currentField === 'residenceArea') {
      processedValue = text.toLowerCase();
    }
    
    // Validate input with enhanced validation
    const validation = validateInput(currentField, processedValue, 'crematorium');
    if (!validation.isValid) {
      addMessage(`❌ ${validation.error}. Please try again.`);
      return;
    }
    
    console.log(`✅ Setting ${currentField} to:`, processedValue);
    setBookingData(prev => ({ ...prev, [currentField]: processedValue }));
    
    if (currentStep + 1 < crematoriumQuestions.length) {
      const nextField = crematoriumQuestions[currentStep + 1];
      addMessage(t(`crematoriumQuestions.${nextField}`));
    } else {
      // Check availability before asking for files
      const { cremationDate, startTime, endTime } = { ...bookingData, [currentField]: processedValue };
      const isAvailable = await checkAvailability(cremationDate, startTime, endTime, 'crematorium');
      
      if (isAvailable) {
        addMessage(t('crematoriumQuestions.files'));
        setWaitingForFile('deathCertificateImage');
      } else {
        // Go back to cremation date
        const dateIndex = crematoriumQuestions.indexOf('cremationDate');
        setBookingData(prev => {
          const newData = { ...prev };
          // Remove date and time fields to restart from date
          ['cremationDate', 'startTime', 'endTime'].forEach(field => delete newData[field]);
          return newData;
        });
        addMessage(t('crematoriumQuestions.cremationDate'));
      }
    }
  };

  // REAL API CALL: Submit playground booking with actual fetch
  const submitPlaygroundBooking = async () => {
    try {
      addMessage(t('processing'));
      
      console.log('=== PLAYGROUND SUBMISSION DEBUG ===');
      console.log('Booking Data:', bookingData);
      
      const submitData = {
        ...bookingData,
        expectedAttendees: Number(bookingData.expectedAttendees),
      };
      
      // FIXED: Add userId from localStorage (like your forms do)
      try {
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
          const user = JSON.parse(storedUser);
          if (user._id) {
            console.log('Adding userId to playground booking:', user._id);
            submitData.userId = user._id;
          }
        }
      } catch (error) {
        console.warn('Could not get user ID from localStorage:', error);
      }
      
      console.log('Final submission data:', submitData);
      console.log('API Endpoint: http://localhost:5000/playgrounds');
      
      const response = await fetch("http://localhost:5000/playgrounds", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include', // For authentication cookies
        body: JSON.stringify(submitData)
      });

      console.log('API Response Status:', response.status);
      console.log('API Response Headers:', response.headers);

      if (response.ok) {
        const result = await response.json();
        console.log('Success result:', result);
        addMessage(t('bookingComplete'));
        addMessage("📧 Booking reference: PG" + Date.now().toString().slice(-6));
        setTimeout(() => {
          addMessage(t('restart'));
          resetForNewBooking();
        }, 3000);
      } else {
        const errorData = await response.text();
        console.error('API Error Response:', errorData);
        throw new Error(`HTTP ${response.status}: ${errorData}`);
      }
    } catch (error) {
      console.error("❌ Error submitting playground booking:", error);
      
      if (error.message.includes('401')) {
        addMessage("❌ " + t('authError'));
      } else if (error.message.includes('400')) {
        addMessage(`❌ Validation error: ${error.message}`);
      } else if (error.message.includes('fetch')) {
        addMessage("❌ Network error. Please check if the server is running.");
      } else {
        addMessage(`❌ Error submitting booking: ${error.message}`);
      }
    }
  };

  // REAL API CALL: Submit crematorium booking with actual fetch
  const completeCrematoriumBooking = async () => {
    try {
      addMessage(t('processing'));
      
      console.log('=== CREMATORIUM SUBMISSION DEBUG ===');
      console.log('Booking Data:', bookingData);
      console.log('Files to upload:', Object.keys(uploadedFiles));
      
      const formData = new FormData();
      
      // Append all booking data
      Object.entries(bookingData).forEach(([key, value]) => {
        if (key !== 'files') {
          console.log(`Adding field: ${key} = ${value}`);
          formData.append(key, value);
        }
      });
      
      // Add required fields
      formData.append('declarationAgreement', 'true');
      
      // FIXED: Add userId from localStorage (like your forms do)
      try {
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
          const user = JSON.parse(storedUser);
          if (user._id) {
            console.log('Adding userId:', user._id);
            formData.append('userId', user._id);
          }
        }
      } catch (error) {
        console.warn('Could not get user ID from localStorage:', error);
      }
      
      // Append files with correct field names
      if (uploadedFiles.deathCertificateImage) {
        console.log('Adding death certificate file:', uploadedFiles.deathCertificateImage.name);
        formData.append('deathCertificateImage', uploadedFiles.deathCertificateImage);
      }
      if (uploadedFiles.beOrderImage) {
        console.log('Adding BE order file:', uploadedFiles.beOrderImage.name);
        formData.append('beOrderImage', uploadedFiles.beOrderImage);
      }
      
      console.log('API Endpoint: http://localhost:5000/crematorium');
      console.log('Submitting FormData to server...');
      
      const response = await fetch("http://localhost:5000/crematorium", {
        method: 'POST',
        credentials: 'include', // For authentication cookies
        body: formData // Don't set Content-Type header for FormData
      });

      console.log('API Response Status:', response.status);

      if (response.ok) {
        const result = await response.json();
        console.log('Success result:', result);
        addMessage(t('bookingComplete'));
        addMessage("📧 Booking reference: CR" + Date.now().toString().slice(-6));
        setTimeout(() => {
          addMessage(t('restart'));
          resetForNewBooking();
        }, 3000);
      } else {
        const errorData = await response.text();
        console.error('API Error Response:', errorData);
        throw new Error(`HTTP ${response.status}: ${errorData}`);
      }
    } catch (error) {
      console.error("❌ Error submitting crematorium booking:", error);
      
      if (error.message.includes('401')) {
        addMessage("❌ " + t('authError'));
      } else if (error.message.includes('400')) {
        addMessage(`❌ Validation error: ${error.message}`);
      } else if (error.message.includes('fetch')) {
        addMessage("❌ Network error. Please check if the server is running.");
      } else {
        addMessage(`❌ Error submitting booking: ${error.message}`);
      }
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
              <div className="text-xs text-gray-500 mt-1">
                Max 5MB, JPG/PNG/PDF only
              </div>
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
                  'உங்கள் செய்தியை தட்டச்சு செய்யுங்கள்...'
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
            
            {/* Enhanced Status Indicators */}
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
                {bookingData && Object.keys(bookingData).length > 0 && (
                  <span className="text-blue-600">
                    {Object.keys(bookingData).length} fields completed
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