import { useState, useEffect } from 'react';
import axios from 'axios';
import Sidebar from '../components/Sidebar';
import { Calendar as CalendarIcon, Plus, Trash2, MapPin, Clock, CalendarDays } from 'lucide-react';

const EventCalendar = () => {
  const [events, setEvents] = useState([]);
  const [newEvent, setNewEvent] = useState({ title: '', date: '', time: '', type: 'Class', location: '' });

  const fetchEvents = async () => {
    try {
      const token = localStorage.getItem('authToken');
      const config = { headers: { 'auth-token': token } };
      const res = await axios.get('https://rc-fitness-backend.vercel.app/api/events', config).catch(() => ({ data: [] }));
      
      const sortedEvents = (res.data || []).sort((a, b) => new Date(a.date) - new Date(b.date));
      setEvents(sortedEvents);
    } catch (err) { console.error("Error fetching events:", err); }
  };

  useEffect(() => { fetchEvents(); }, []);

  const handleAddEvent = async (e) => {
    e.preventDefault();
    if (!newEvent.title || !newEvent.date || !newEvent.time || !newEvent.type) return;
    
    const tempEvent = { ...newEvent, _id: Date.now() };
    setEvents(prev => [...prev, tempEvent].sort((a, b) => new Date(a.date) - new Date(b.date)));
    setNewEvent({ title: '', date: '', time: '', type: 'Class', location: '' });

    try {
      const token = localStorage.getItem('authToken');
      await axios.post('https://rc-fitness-backend.vercel.app/api/events/add', newEvent, { headers: { 'auth-token': token } });
      fetchEvents();
    } catch (err) { console.error("Error adding event:", err); }
  };

  const handleDeleteEvent = async (id) => {
    setEvents(prev => prev.filter(p => (p._id || p.id) !== id));
    try {
      const token = localStorage.getItem('authToken');
      await axios.delete(`https://rc-fitness-backend.vercel.app/api/events/delete/${id}`, { headers: { 'auth-token': token } });
      fetchEvents();
    } catch (err) { console.error("Error deleting event:", err); }
  };

  const getDayAndMonth = (dateString) => {
    if (!dateString) return { day: '--', month: '---' };
    const date = new Date(dateString);
    return {
      day: date.getDate().toString().padStart(2, '0'),
      month: date.toLocaleString('default', { month: 'short' }).toUpperCase()
    };
  };

  return (
    <div className="flex bg-[#080808] min-h-screen text-white font-sans">
      <Sidebar />
      <main className="flex-1 p-6 lg:p-12 lg:ml-64 pt-24 lg:pt-12">
        <header className="mb-10 text-center lg:text-left">
          <h1 className="text-4xl font-black uppercase tracking-tighter italic leading-none flex items-center justify-center lg:justify-start gap-4">
            <CalendarDays className="text-purple-500" size={36} /> Event Calendar
          </h1>
          <p className="text-gray-500 text-[10px] font-bold uppercase tracking-[0.3em] mt-2">Member 5: Schedule &amp; Contents</p>
        </header>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-12">
          {/* Add Event Form */}
          <section className="xl:col-span-1 bg-[#111] border border-gray-900 rounded-3xl p-6 lg:p-8 shadow-xl h-fit sticky top-8">
            <div className="flex items-center gap-3 mb-6 border-b border-gray-900 pb-4">
              <CalendarIcon className="text-purple-500" size={24} />
              <h2 className="text-2xl font-black uppercase italic tracking-wider">Schedule Event</h2>
            </div>
            
            <form onSubmit={handleAddEvent} className="flex flex-col gap-4">
              <input type="text" placeholder="Event Title" value={newEvent.title} onChange={(e) => setNewEvent({...newEvent, title: e.target.value})} className="w-full bg-[#080808] border border-gray-800 rounded-xl px-4 py-4 text-sm focus:outline-none focus:border-purple-600 transition-all text-white placeholder-gray-600" />
              
              <div className="grid grid-cols-2 gap-4">
                <input type="date" value={newEvent.date} onChange={(e) => setNewEvent({...newEvent, date: e.target.value})} className="w-full bg-[#080808] border border-gray-800 rounded-xl px-4 py-4 text-sm focus:outline-none focus:border-purple-600 transition-all text-gray-400" />
                <input type="time" value={newEvent.time} onChange={(e) => setNewEvent({...newEvent, time: e.target.value})} className="w-full bg-[#080808] border border-gray-800 rounded-xl px-4 py-4 text-sm focus:outline-none focus:border-purple-600 transition-all text-gray-400" />
              </div>

              <select value={newEvent.type} onChange={(e) => setNewEvent({...newEvent, type: e.target.value})} className="w-full bg-[#080808] border border-gray-800 rounded-xl px-4 py-4 text-sm focus:outline-none focus:border-purple-600 transition-all text-gray-400 appearance-none">
                <option value="Class">Group Class</option>
                <option value="Competition">Competition</option>
                <option value="Seminar">Seminar</option>
                <option value="Maintenance">Maintenance</option>
              </select>

              <div className="relative group">
                <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600 group-focus-within:text-purple-500 transition-colors" size={16} />
                <input type="text" placeholder="Location/Studio" value={newEvent.location} onChange={(e) => setNewEvent({...newEvent, location: e.target.value})} className="w-full bg-[#080808] border border-gray-800 rounded-xl pl-12 pr-4 py-4 text-sm focus:outline-none focus:border-purple-600 transition-all text-white placeholder-gray-600" />
              </div>

              <button type="submit" className="w-full bg-purple-600 hover:bg-purple-700 text-white font-black uppercase tracking-widest py-4 rounded-xl transition-all flex items-center justify-center gap-2 mt-4 shadow-[0_0_20px_rgba(147,51,234,0.3)] hover:shadow-[0_0_30px_rgba(147,51,234,0.5)]">
                <Plus size={18} /> Add to Calendar
              </button>
            </form>
          </section>

          {/* Events List */}
          <section className="xl:col-span-2 space-y-4">
            {events.map(event => {
               const { day, month } = getDayAndMonth(event.date);
               return (
                  <div key={event._id || event.id} className="flex flex-row items-center bg-black rounded-3xl border border-gray-900 overflow-hidden hover:border-gray-700 transition-colors group pr-4 md:pr-6 shadow-xl relative">
                    <div className="bg-[#111] p-6 md:p-8 flex flex-col items-center justify-center border-r border-gray-900 group-hover:bg-purple-900/10 transition-colors min-w-[100px] md:min-w-[120px]">
                      <span className="text-purple-500 font-bold uppercase tracking-widest text-xs mb-1">{month}</span>
                      <span className="text-4xl md:text-5xl font-black italic tracking-tighter text-white">{day}</span>
                    </div>
                    
                    <div className="flex-1 p-6 md:px-8 py-6">
                       <span className={`inline-block px-3 py-1 rounded-full border text-[9px] font-black uppercase tracking-widest mb-3 ${event.type === 'Competition' ? 'bg-red-900/20 text-red-500 border-red-900/30' : event.type === 'Class' ? 'bg-blue-900/20 text-blue-500 border-blue-900/30' : 'bg-gray-800 text-gray-400 border-gray-700'}`}>
                         {event.type}
                       </span>
                       <h3 className="text-2xl font-black uppercase italic leading-tight mb-2 pr-10">{event.title}</h3>
                       <div className="flex flex-wrap gap-4 text-gray-500 text-[10px] font-bold uppercase tracking-widest">
                         <span className="flex items-center gap-1"><Clock size={12}/> {event.time}</span>
                         {event.location && <span className="flex items-center gap-1"><MapPin size={12}/> {event.location}</span>}
                       </div>
                    </div>

                    <div className="flex flex-col h-full absolute right-0 top-0 bottom-0 bg-[#080808] border-l border-gray-900 opacity-0 group-hover:opacity-100 transition-opacity justify-center px-4 w-[60px] md:w-[80px]">
                      <button onClick={() => handleDeleteEvent(event._id || event.id)} className="w-full aspect-square flex items-center justify-center bg-[#111] rounded-xl text-gray-600 hover:text-red-500 hover:bg-red-500/10 transition-colors border border-gray-800 focus:opacity-100">
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
               );
            })}

            {events.length === 0 && (
               <div className="flex flex-col items-center justify-center p-16 border-2 border-dashed border-gray-900 rounded-3xl opacity-50 h-[300px]">
                 <CalendarIcon size={48} className="text-gray-700 mb-4" />
                 <span className="text-gray-500 text-xs font-black uppercase tracking-widest">No upcoming events</span>
               </div>
            )}
          </section>
        </div>
      </main>
    </div>
  );
};

export default EventCalendar;
