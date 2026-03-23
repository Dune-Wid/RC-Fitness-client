import { useState, useEffect } from 'react';
import axios from 'axios';
import { CalendarDays, ArrowLeft, Clock, MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';

const PublicEvent = () => {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await axios.get('https://rc-fitness-backend.vercel.app/api/events').catch(() => ({ data: [] }));
        const sortedEvents = (res.data || []).sort((a, b) => new Date(a.date) - new Date(b.date));
        setEvents(sortedEvents);
      } catch (err) { console.error(err); }
    };
    fetchEvents();
  }, []);

  const getDayAndMonth = (dateString) => {
    if (!dateString) return { day: '--', month: '---' };
    const date = new Date(dateString);
    return {
      day: date.getDate().toString().padStart(2, '0'),
      month: date.toLocaleString('default', { month: 'short' }).toUpperCase()
    };
  };

  return (
    <div className="bg-[#080808] min-h-screen text-white font-sans selection:bg-red-600">
      <nav className="border-b border-white/5 bg-black/50 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-20 flex justify-between items-center">
          <Link to="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
             <ArrowLeft size={20} className="text-red-600" />
             <span className="font-black text-xs tracking-widest uppercase">Back to Home</span>
          </Link>
          <div className="flex items-center gap-2">
            <CalendarDays className="text-red-600" size={24} />
            <span className="font-black text-xl tracking-tighter uppercase italic">Schedule</span>
          </div>
          <div className="w-[100px]"></div>
        </div>
      </nav>

      <main className="max-w-5xl mx-auto px-6 py-12 md:py-20">
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-7xl font-black uppercase tracking-tighter italic mb-4">Upcoming <span className="text-red-600">Events</span></h1>
          <p className="text-gray-400 font-medium max-w-2xl mx-auto">Join our upcoming classes, competitive seminars, and special community gatherings to elevate your journey.</p>
        </div>

        <div className="space-y-6">
          {events.map(event => {
            const { day, month } = getDayAndMonth(event.date);
            return (
              <div key={event._id || event.id} className="flex flex-col md:flex-row items-center bg-[#111] rounded-2xl border border-white/5 overflow-hidden hover:border-red-600/30 transition-all duration-500 group relative">
                {event.image && (
                  <div className="absolute inset-0 z-0 opacity-20 group-hover:opacity-40 transition-opacity duration-500">
                    <img src={event.image} alt={event.title} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500" />
                  </div>
                )}
                <div className="bg-black/80 backdrop-blur-sm p-8 flex flex-col items-center justify-center border-b md:border-b-0 md:border-r border-white/5 group-hover:bg-red-900/10 transition-colors w-full md:w-40 relative z-10 h-full">
                  <span className="text-red-600 font-bold uppercase tracking-widest text-sm mb-1">{month}</span>
                  <span className="text-5xl md:text-6xl font-black italic tracking-tighter text-white">{day}</span>
                </div>
                
                <div className="flex-1 p-8 relative z-10 bg-[#111]/50 backdrop-blur-sm h-full">
                  <span className={`inline-block px-3 py-1 rounded-full border text-[9px] font-black uppercase tracking-widest mb-4 ${event.type === 'Competition' ? 'bg-red-900/30 text-red-400 border-red-900/40' : event.type === 'Class' ? 'bg-blue-900/30 text-blue-400 border-blue-900/40' : 'bg-gray-800/80 text-gray-300 border-gray-700'}`}>
                    {event.type}
                  </span>
                  <h3 className="text-3xl font-black uppercase italic leading-tight mb-4 text-white drop-shadow-md">{event.title}</h3>
                  <div className="flex flex-wrap gap-6 text-gray-300 text-xs font-bold uppercase tracking-widest">
                    <span className="flex items-center gap-2 drop-shadow"><Clock size={16} className="text-red-500"/> {event.time}</span>
                    {event.location && <span className="flex items-center gap-2 drop-shadow"><MapPin size={16} className="text-red-500"/> {event.location}</span>}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {events.length === 0 && (
          <div className="flex flex-col items-center justify-center p-20 border border-dashed border-white/10 rounded-3xl opacity-50 mt-10">
            <CalendarDays size={48} className="text-gray-600 mb-4" />
            <span className="text-gray-500 text-sm font-black uppercase tracking-widest">No scheduled events</span>
          </div>
        )}
      </main>
    </div>
  );
};

export default PublicEvent;
