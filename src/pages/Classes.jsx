import { useState, useEffect } from 'react';
import MemberSidebar from '../components/MemberSidebar';
import { Calendar, Bell, Clock, XCircle, BarChart2 } from 'lucide-react';
import axios from 'axios';

const Classes = () => {
  const [activeTab, setActiveTab] = useState('TODAY');
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const { data } = await axios.get('http://localhost:5000/api/classes/bookings');
      setBookings(data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleJoin = async (cls) => {
    try {
      await axios.post('http://localhost:5000/api/classes/book', {
        className: cls.name,
        time: cls.time,
        studioLocation: 'Main Studio'
      });
      fetchBookings();
      alert(`Booked ${cls.name} successfully!`);
    } catch (err) {
      console.error(err);
      alert('Failed to book class.');
    }
  };

  const handleCancelBooking = async (id) => {
    if(!window.confirm("Cancel this booking?")) return;
    try {
      await axios.delete(`http://localhost:5000/api/classes/bookings/${id}`);
      fetchBookings();
    } catch (err) {
      console.error(err);
    }
  };

  const classes = [
    {
      type: 'CORE',
      time: '08:00 AM - 09:00 AM',
      name: 'ABS TRAINING',
      intensity: 'HIGH',
      intensityColor: 'text-red-500',
      bgImage: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?q=80&w=2070&auto=format&fit=crop'
    },
    {
      type: 'ENDURANCE',
      time: '10:30 AM - 11:30 AM',
      name: 'CARDIO BLAST',
      intensity: 'EXTREME',
      intensityColor: 'text-red-600',
      bgImage: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?q=80&w=2070&auto=format&fit=crop'
    },
    {
      type: 'FULL BODY',
      time: '05:00 PM - 06:00 PM',
      name: 'ZUMBA RHYTHM',
      intensity: 'MEDIUM',
      intensityColor: 'text-orange-500',
      bgImage: 'https://images.unsplash.com/photo-1518310383802-640c2de311b2?q=80&w=2070&auto=format&fit=crop'
    },
    {
      type: 'POWER',
      time: '07:30 PM - 08:30 PM',
      name: 'STRENGTH FORGE',
      intensity: 'VERY HIGH',
      intensityColor: 'text-red-500',
      bgImage: 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?q=80&w=2070&auto=format&fit=crop'
    }
  ];

  return (
    <div className="flex bg-[#0d0a0a] min-h-screen text-white font-sans">
      <MemberSidebar />
      <div className="flex-1 p-6 lg:p-10 lg:ml-64 relative overflow-hidden">
        
        {/* Subtle Background Elements */}
        <div className="absolute top-[-10%] left-[-5%] w-[40%] h-[40%] bg-red-900/10 blur-[120px] rounded-full pointer-events-none"></div>

        <div className="max-w-7xl mx-auto pt-16 lg:pt-0 relative z-10">
          
          {/* Header */}
          <header className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-6">
            <div>
              <div className="flex items-center gap-2 text-red-500 mb-2">
                <Calendar size={16} />
                <span className="text-[10px] font-bold uppercase tracking-widest">Available Sessions</span>
              </div>
              <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tight text-white mb-2 leading-none">Group Classes</h1>
              <p className="text-gray-400 text-sm tracking-wide">Book your spot in today's high-intensity training sessions.</p>
            </div>
            
            <div className="flex bg-[#111] border border-white/5 rounded-xl overflow-hidden p-1 shadow-inner">
              <button 
                onClick={() => setActiveTab('TODAY')}
                className={`px-6 py-2 rounded-lg text-xs font-bold tracking-widest uppercase transition-all ${activeTab === 'TODAY' ? 'bg-[#221818] text-white shadow-sm' : 'text-gray-500 hover:text-white'}`}
              >
                Today
              </button>
              <button 
                onClick={() => setActiveTab('CALENDAR')}
                className={`px-6 py-2 rounded-lg text-xs font-bold tracking-widest uppercase transition-all ${activeTab === 'CALENDAR' ? 'bg-[#221818] text-white shadow-sm' : 'text-gray-500 hover:text-white'}`}
              >
                Calendar
              </button>
            </div>
          </header>

          {/* Classes Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {classes.map((cls, idx) => (
              <div key={idx} className="bg-[#151111] border border-white/5 rounded-2xl overflow-hidden group hover:border-red-900/50 transition-colors flex flex-col">
                {/* Image Section */}
                <div className="h-48 relative overflow-hidden bg-[#0d0a0a]">
                  <img src={cls.bgImage} alt={cls.name} className="w-full h-full object-cover opacity-60 group-hover:opacity-80 group-hover:scale-105 transition-all duration-500 mix-blend-luminosity" />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#151111] via-transparent to-transparent"></div>
                  <div className="absolute bottom-4 left-4 bg-red-500 text-white text-[9px] font-black px-2.5 py-1 rounded tracking-widest uppercase shadow-md">
                    {cls.type}
                  </div>
                </div>

                {/* Content Section */}
                <div className="p-6 flex-1 flex flex-col">
                  <div className="flex items-center gap-2 text-red-500 mb-3">
                    <Clock size={12} />
                    <span className="text-[10px] font-bold tracking-widest">{cls.time}</span>
                  </div>
                  <h3 className="text-lg font-light tracking-wide text-gray-200 mb-6 uppercase">{cls.name}</h3>
                  
                  <div className="mt-auto flex items-center justify-between">
                    <div>
                      <p className="text-[9px] text-gray-500 font-bold uppercase tracking-widest mb-1">Intensity</p>
                      <p className={`text-[10px] font-black tracking-widest uppercase ${cls.intensityColor}`}>{cls.intensity}</p>
                    </div>
                    <button 
                      onClick={() => handleJoin(cls)}
                      className="bg-red-500 hover:bg-red-600 text-white px-6 py-2.5 rounded-lg text-[10px] font-bold tracking-widest uppercase transition-all shadow-[0_4px_15px_rgba(239,68,68,0.2)]"
                    >
                      Join
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Bottom Grid: Upcoming Bookings & Stats */}
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
            
            {/* Upcoming Bookings */}
            <div className="xl:col-span-2">
              <div className="flex items-center gap-3 mb-6">
                <Bell size={20} className="text-red-500" />
                <h2 className="text-xl font-bold tracking-wide text-white">My Upcoming Bookings</h2>
              </div>
              
              <div className="space-y-4">
                {bookings.length === 0 ? (
                  <p className="text-gray-500 text-xs tracking-widest uppercase font-bold text-center py-6 border border-white/5 bg-[#151111] rounded-2xl">
                    No upcoming bookings.
                  </p>
                ) : bookings.map((booking) => (
                  <div key={booking._id} className="bg-[#151111] border border-red-900/20 rounded-2xl p-4 flex items-center justify-between group hover:border-red-500/30 transition-colors">
                    <div className="flex items-center gap-5">
                      <div className="w-12 h-12 rounded-xl bg-red-500/10 flex items-center justify-center border border-red-900/30">
                        <Clock size={20} className="text-red-500" />
                      </div>
                      <div>
                        <h4 className="text-gray-300 font-light tracking-wide text-lg mb-0.5">{booking.className}</h4>
                        <p className="text-gray-500 text-xs tracking-wide">Tomorrow at {booking.time} • {booking.studioLocation}</p>
                      </div>
                    </div>
                    <button onClick={() => handleCancelBooking(booking._id)} className="text-gray-600 hover:text-red-500 p-2 transition-colors" title="Cancel Booking">
                      <XCircle size={20} />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Class Statistics */}
            <div className="bg-[#151111] border border-white/5 rounded-2xl p-8">
              <div className="flex items-center gap-3 mb-8">
                <BarChart2 size={20} className="text-red-500" />
                <h2 className="text-sm font-black uppercase tracking-widest text-white">Class Statistics</h2>
              </div>

              <div className="mb-8">
                <div className="flex justify-between items-end mb-3">
                  <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest leading-tight">Monthly<br/>Attendance</span>
                  <span className="text-xs font-black text-white uppercase tracking-widest text-right leading-tight">12 / 20<br/>Sessions</span>
                </div>
                <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
                  <div className="h-full bg-red-600 rounded-full w-[60%] shadow-[0_0_10px_rgba(220,38,38,0.5)]"></div>
                </div>
              </div>

              <div className="flex items-center justify-between border-t border-white/5 pt-6">
                <div className="text-center w-1/2 border-r border-white/5 pr-4">
                  <span className="block text-2xl font-black text-white mb-1 tracking-tight">4.8k</span>
                  <span className="text-[8px] font-bold text-gray-500 uppercase tracking-widest">Calories Burnt</span>
                </div>
                <div className="text-center w-1/2 pl-4">
                  <span className="block text-2xl font-black text-red-500 mb-1 tracking-tight">18</span>
                  <span className="text-[8px] font-bold text-gray-500 uppercase tracking-widest">Hours Logged</span>
                </div>
              </div>
            </div>

          </div>

        </div>
      </div>
    </div>
  );
};

export default Classes;
