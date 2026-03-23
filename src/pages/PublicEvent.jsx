import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { Search, Calendar, Filter, MapPin, Clock } from 'lucide-react';
import PublicNavbar from '../components/PublicNavbar';

const PublicEvent = () => {
  const [events, setEvents] = useState([]);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await axios.get('https://rc-fitness-backend.vercel.app/api/events');
        setEvents(res.data);
      } catch (err) { console.error("Error fetching events:", err); }
    };
    fetchEvents();
  }, []);

  const categories = ['All', 'Class', 'Workshop', 'Competition', 'Social'];
  
  const filteredEvents = events.filter(e => {
    const matchesSearch = e.title.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = category === 'All' || e.type === category;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="bg-[#050505] min-h-screen text-white font-sans selection:bg-blue-600">
      <PublicNavbar />

      <main className="max-w-7xl mx-auto px-6 pt-32 pb-12 flex flex-col md:flex-row gap-10">
        <aside className="w-full md:w-64 flex-shrink-0">
          <div className="sticky top-28 bg-[#111] border border-gray-900 rounded-3xl p-6">
            <h2 className="text-xl font-black uppercase italic tracking-tighter mb-6 flex items-center gap-2">
              <Filter size={18} className="text-blue-500" /> Filters
            </h2>
            
            <div className="mb-8">
              <label className="text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-3 block">Search Event</label>
              <div className="relative">
                <input 
                  type="text" 
                  placeholder="Find classes..." 
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  className="w-full bg-black border border-gray-800 rounded-xl px-4 py-3 pl-10 text-sm focus:outline-none focus:border-blue-600 transition-colors"
                />
                <Search size={16} className="absolute left-4 top-3.5 text-gray-500" />
              </div>
            </div>

            <div>
              <label className="text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-3 block">Categories</label>
              <div className="flex flex-col gap-2">
                {categories.map(cat => (
                  <button 
                    key={cat}
                    onClick={() => setCategory(cat)}
                    className={`text-left px-4 py-3 rounded-xl text-sm font-bold tracking-wide transition-all ${
                      category === cat ? 'bg-blue-600/20 text-blue-400 border border-blue-900/50' : 'text-gray-400 hover:bg-gray-900 border border-transparent hover:text-white'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </aside>

        <section className="flex-1">
          <header className="mb-8 flex justify-between items-end border-b border-gray-900 pb-4">
            <div>
              <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tighter italic">Classes & Events</h1>
              <p className="text-gray-500 text-xs font-bold uppercase tracking-[0.2em] mt-2">Book your next session</p>
            </div>
            <p className="text-gray-500 text-[10px] font-bold uppercase tracking-widest hidden md:block">
              {filteredEvents.length} Upcoming
            </p>
          </header>

          {filteredEvents.length === 0 ? (
            <div className="py-20 flex flex-col items-center justify-center border-2 border-dashed border-gray-900 rounded-3xl opacity-50">
              <Calendar size={48} className="text-gray-700 mb-4" />
              <p className="text-gray-500 uppercase tracking-widest font-bold text-sm">No scheduled events right now.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredEvents.map(event => (
                <Link to={`/events/${event._id}`} key={event._id} className="bg-[#111] border border-gray-900 rounded-3xl overflow-hidden shadow-xl group hover:border-blue-900/50 transition-all flex flex-col h-full hover:-translate-y-1">
                  <div className="relative h-48 bg-black overflow-hidden flex items-center justify-center border-b border-gray-900 shrink-0">
                    {event.image ? (
                      <img src={event.image} alt={event.title} className="w-full h-full object-cover opacity-90 group-hover:scale-105 transition-transform duration-500" />
                    ) : (
                      <Calendar size={48} className="text-gray-800" />
                    )}
                    <div className="absolute top-4 left-4">
                      <span className="bg-blue-900/80 backdrop-blur-sm border border-blue-800 text-blue-400 text-[9px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full shadow-lg">
                        {event.type}
                      </span>
                    </div>
                  </div>
                  
                  <div className="p-6 flex-1 flex flex-col">
                    <h3 className="font-black text-2xl uppercase tracking-tight italic mb-4 line-clamp-2">{event.title}</h3>
                    
                    <div className="space-y-3 mt-auto text-gray-400 text-xs font-bold tracking-widest uppercase">
                      <div className="flex items-center gap-3">
                        <Calendar size={16} className="text-blue-500" />
                        <span>{new Date(event.date).toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <Clock size={16} className="text-blue-500" />
                        <span>{event.time}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <MapPin size={16} className="text-blue-500" />
                        <span className="truncate">{event.location || 'Fitness Center'}</span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
};

export default PublicEvent;
