import React, { useState, useEffect } from 'react';
import { Calendar, Clock, Users, MapPin, FileText, User, Phone, Mail, RefreshCw } from 'lucide-react';

const AppointmentCalendar = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [view, setView] = useState('month'); // 'month', 'week', 'day'
  const [filter, setFilter] = useState('all'); // 'all', 'playground', 'crematorium'
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Fetch data from APIs
  const fetchAppointments = async () => {
    setLoading(true);
    setError('');
    
    try {
      // Fetch playground events
      const playgroundResponse = await fetch('/api/users'); // Adjust API endpoint as needed
      let playgroundData = [];
      
      if (playgroundResponse.ok) {
        const playgroundResult = await playgroundResponse.json();
        playgroundData = playgroundResult.users || [];
      }

      // Fetch crematorium bookings
      const crematoriumResponse = await fetch('/api/crematorium'); // Adjust API endpoint as needed
      let crematoriumData = [];
      
      if (crematoriumResponse.ok) {
        const crematoriumResult = await crematoriumResponse.json();
        crematoriumData = crematoriumResult.data || [];
      }

      // Combine and format data
      const formattedAppointments = [
        ...playgroundData.map(event => ({
          ...event,
          type: 'playground',
          id: event._id,
          appointmentDate: new Date(event.eventDate)
        })),
        ...crematoriumData.map(booking => ({
          ...booking,
          type: 'crematorium',
          id: booking._id,
          appointmentDate: new Date(booking.cremationDate)
        }))
      ];

      setAppointments(formattedAppointments);
    } catch (err) {
      console.error('Error fetching appointments:', err);
      setError('Failed to fetch appointments');
      
      // Fallback to sample data for demonstration
      setAppointments([
        {
          id: 1,
          type: 'playground',
          eventName: 'Annual Sports Meet',
          eventType: 'Sports Competition',
          organizerName: 'John Silva',
          email: 'john@email.com',
          phone: '0771234567',
          playgroundType: 'Football Ground',
          expectedAttendees: 150,
          eventDate: new Date('2025-08-25'),
          appointmentDate: new Date('2025-08-25'),
          startTime: '09:00',
          endTime: '17:00',
          description: 'Annual inter-school sports competition',
          approve: true,
          reject: false,
          comment: 'Approved with standard conditions'
        },
        {
          id: 2,
          type: 'crematorium',
          applicantFullName: 'David Perera',
          surname: 'Perera',
          nic: '123456789V',
          deceasedFullName: 'Late. Robert Perera',
          dateOfDeath: new Date('2025-08-20'),
          residenceArea: 'within',
          cremationDate: new Date('2025-08-24'),
          appointmentDate: new Date('2025-08-24'),
          registrationNumber: 'CR2025001',
          approve: true,
          reject: false,
          comment: 'All documents verified'
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  // Fetch appointments on component mount
  useEffect(() => {
    fetchAppointments();
  }, []);

  const getStatusColor = (appointment) => {
    if (appointment.approve) return 'bg-green-100 border-green-500 text-green-800';
    if (appointment.reject) return 'bg-red-100 border-red-500 text-red-800';
    return 'bg-yellow-100 border-yellow-500 text-yellow-800';
  };

  const getStatusText = (appointment) => {
    if (appointment.approve) return 'Approved';
    if (appointment.reject) return 'Rejected';
    return 'Pending';
  };

  const getAppointmentDate = (appointment) => {
    return appointment.appointmentDate;
  };

  const filteredAppointments = appointments.filter(appointment => {
    if (filter === 'all') return true;
    return appointment.type === filter;
  });

  const getAppointmentsForDate = (date) => {
    return filteredAppointments.filter(appointment => {
      const appointmentDate = getAppointmentDate(appointment);
      return appointmentDate.toDateString() === date.toDateString();
    });
  };

  const formatTime = (time) => {
    if (!time) return '';
    return new Date(`1970-01-01T${time}:00`).toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days = [];
    
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }
    
    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(new Date(year, month, day));
    }
    
    return days;
  };

  const navigateMonth = (direction) => {
    const newDate = new Date(currentDate);
    newDate.setMonth(currentDate.getMonth() + direction);
    setCurrentDate(newDate);
  };

  const AppointmentCard = ({ appointment }) => {
    const isPlayground = appointment.type === 'playground';
    
    return (
      <div className={`p-3 mb-2 border-l-4 rounded-r-lg ${getStatusColor(appointment)} hover:shadow-md transition-shadow`}>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              {isPlayground ? (
                <Users className="w-4 h-4" />
              ) : (
                <FileText className="w-4 h-4" />
              )}
              <span className="font-semibold text-sm">
                {isPlayground ? appointment.eventName : `${appointment.deceasedFullName} - Cremation`}
              </span>
            </div>
            
            <div className="text-xs space-y-1">
              {isPlayground ? (
                <>
                  <div className="flex items-center gap-1">
                    <User className="w-3 h-3" />
                    <span>{appointment.organizerName}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    <span>{formatTime(appointment.startTime)} - {formatTime(appointment.endTime)}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <MapPin className="w-3 h-3" />
                    <span>{appointment.playgroundType}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Users className="w-3 h-3" />
                    <span>{appointment.expectedAttendees} attendees</span>
                  </div>
                </>
              ) : (
                <>
                  <div className="flex items-center gap-1">
                    <User className="w-3 h-3" />
                    <span>Applicant: {appointment.applicantFullName}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <FileText className="w-3 h-3" />
                    <span>Reg: {appointment.registrationNumber || 'Pending'}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <MapPin className="w-3 h-3" />
                    <span>Area: {appointment.residenceArea === 'within' ? 'Within Council' : 'Outside Council'}</span>
                  </div>
                </>
              )}
            </div>
          </div>
          
          <div className="text-right">
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(appointment)}`}>
              {getStatusText(appointment)}
            </span>
          </div>
        </div>
        
        {appointment.comment && (
          <div className="mt-2 text-xs text-gray-600 bg-gray-50 p-2 rounded">
            <strong>Comment:</strong> {appointment.comment}
          </div>
        )}
      </div>
    );
  };

  const MonthView = () => {
    const days = getDaysInMonth(currentDate);
    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    return (
      <div className="grid grid-cols-7 gap-1">
        {dayNames.map(day => (
          <div key={day} className="p-2 text-center font-semibold text-gray-600 bg-gray-100">
            {day}
          </div>
        ))}
        
        {days.map((day, index) => {
          if (!day) {
            return <div key={index} className="p-2 h-32"></div>;
          }
          
          const dayAppointments = getAppointmentsForDate(day);
          const isSelected = day.toDateString() === selectedDate.toDateString();
          const isToday = day.toDateString() === new Date().toDateString();
          
          return (
            <div
              key={index}
              className={`p-2 h-32 border cursor-pointer hover:bg-gray-50 ${
                isSelected ? 'bg-blue-100 border-blue-500' : 'border-gray-200'
              } ${isToday ? 'ring-2 ring-blue-300' : ''}`}
              onClick={() => setSelectedDate(day)}
            >
              <div className={`font-semibold mb-1 ${isToday ? 'text-blue-600' : 'text-gray-700'}`}>
                {day.getDate()}
              </div>
              
              <div className="space-y-1">
                {dayAppointments.slice(0, 2).map(appointment => (
                  <div
                    key={appointment.id}
                    className={`text-xs p-1 rounded truncate ${getStatusColor(appointment)}`}
                    title={appointment.type === 'playground' ? appointment.eventName : appointment.deceasedFullName}
                  >
                    {appointment.type === 'playground' ? (
                      <span>🏟️ {appointment.eventName}</span>
                    ) : (
                      <span>⚱️ {appointment.deceasedFullName}</span>
                    )}
                  </div>
                ))}
                
                {dayAppointments.length > 2 && (
                  <div className="text-xs text-gray-500">
                    +{dayAppointments.length - 2} more
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  const DayView = () => {
    const dayAppointments = getAppointmentsForDate(selectedDate);
    
    return (
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-800">
          Appointments for {selectedDate.toLocaleDateString('en-US', { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
          })}
        </h3>
        
        {dayAppointments.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <Calendar className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>No appointments scheduled for this date</p>
          </div>
        ) : (
          <div className="space-y-3">
            {dayAppointments.map(appointment => (
              <AppointmentCard key={appointment.id} appointment={appointment} />
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="max-w-6xl mx-auto p-6 bg-white">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-2">
            <Calendar className="w-8 h-8" />
            Appointment Calendar
          </h1>
          
          <button
            onClick={fetchAppointments}
            disabled={loading}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            {loading ? 'Loading...' : 'Refresh'}
          </button>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        {/* Controls */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            {/* View Toggle */}
            <div className="flex bg-gray-200 rounded-lg p-1">
              <button
                onClick={() => setView('month')}
                className={`px-3 py-1 rounded ${view === 'month' ? 'bg-white shadow' : 'hover:bg-gray-300'}`}
              >
                Month
              </button>
              <button
                onClick={() => setView('day')}
                className={`px-3 py-1 rounded ${view === 'day' ? 'bg-white shadow' : 'hover:bg-gray-300'}`}
              >
                Day
              </button>
            </div>

            {/* Filter */}
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="px-3 py-1 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Appointments</option>
              <option value="playground">Playground Events</option>
              <option value="crematorium">Crematorium Bookings</option>
            </select>
          </div>

          {/* Month Navigation */}
          {view === 'month' && (
            <div className="flex items-center gap-2">
              <button
                onClick={() => navigateMonth(-1)}
                className="p-2 hover:bg-gray-200 rounded-lg"
              >
                ←
              </button>
              
              <h2 className="text-xl font-semibold text-gray-700 min-w-48 text-center">
                {currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
              </h2>
              
              <button
                onClick={() => navigateMonth(1)}
                className="p-2 hover:bg-gray-200 rounded-lg"
              >
                →
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-blue-50 p-4 rounded-lg">
          <h3 className="font-semibold text-blue-800">Total Appointments</h3>
          <p className="text-2xl font-bold text-blue-600">{filteredAppointments.length}</p>
        </div>
        
        <div className="bg-green-50 p-4 rounded-lg">
          <h3 className="font-semibold text-green-800">Approved</h3>
          <p className="text-2xl font-bold text-green-600">
            {filteredAppointments.filter(a => a.approve).length}
          </p>
        </div>
        
        <div className="bg-yellow-50 p-4 rounded-lg">
          <h3 className="font-semibold text-yellow-800">Pending</h3>
          <p className="text-2xl font-bold text-yellow-600">
            {filteredAppointments.filter(a => !a.approve && !a.reject).length}
          </p>
        </div>
        
        <div className="bg-red-50 p-4 rounded-lg">
          <h3 className="font-semibold text-red-800">Rejected</h3>
          <p className="text-2xl font-bold text-red-600">
            {filteredAppointments.filter(a => a.reject).length}
          </p>
        </div>
      </div>

      {/* Calendar View */}
      <div className="bg-gray-50 p-6 rounded-lg">
        {view === 'month' ? <MonthView /> : <DayView />}
      </div>

      {/* Legend */}
      <div className="mt-6 flex flex-wrap gap-4 text-sm">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-green-200 border-l-4 border-green-500 rounded-r"></div>
          <span>Approved</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-yellow-200 border-l-4 border-yellow-500 rounded-r"></div>
          <span>Pending</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-red-200 border-l-4 border-red-500 rounded-r"></div>
          <span>Rejected</span>
        </div>
        <div className="flex items-center gap-2">
          <span>🏟️</span>
          <span>Playground Events</span>
        </div>
        <div className="flex items-center gap-2">
          <span>⚱️</span>
          <span>Crematorium Bookings</span>
        </div>
      </div>
    </div>
  );
};

export default AppointmentCalendar;