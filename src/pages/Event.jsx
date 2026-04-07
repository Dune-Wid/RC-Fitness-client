import { useState, useEffect } from 'react';
import axios from 'axios';
import Sidebar from '../components/Sidebar';
import { Calendar, Plus, Edit2, Trash2, Image as ImageIcon, MapPin, Clock, Tag, Users, X as XIcon, Mail } from 'lucide-react';

const Event = () => {
  const [events, setEvents] = useState([]);
  const [attendees, setAttendees] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [newEvent, setNewEvent] = useState({ title: '', date: '', time: '', type: '', location: '', description: '', image: '' });
  const [editEventId, setEditEventId] = useState(null);
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [loadingAttendees, setLoadingAttendees] = useState(false);

  const fetchEvents = async () => {
    try {
      const token = localStorage.getItem('authToken');
      const res = await axios.get('https://rc-fitness-backend.vercel.app/api/events', { headers: { 'auth-token': token } });
      setEvents(res.data);
    } catch (err) { console.error("Error fetching events:", err); }
  };

  useEffect(() => { fetchEvents(); }, []);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewEvent({ ...newEvent, image: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveEvent = async (e) => {
    e.preventDefault();
    if (!newEvent.title || !newEvent.date || !newEvent.time || !newEvent.type) return;

    try {
      const token = localStorage.getItem('authToken');
      if (editEventId) {
        const res = await axios.put(`https://rc-fitness-backend.vercel.app/api/events/update/${editEventId}`, newEvent, { headers: { 'auth-token': token } });
        setEvents(events.map(ev => ev._id === editEventId ? res.data : ev));
        setEditEventId(null);
      } else {
        await axios.post('https://rc-fitness-backend.vercel.app/api/events/add', newEvent, { headers: { 'auth-token': token } });
        fetchEvents();
      }
      setNewEvent({ title: '', date: '', time: '', type: '', location: '', description: '', image: '' });
      setIsFormVisible(false);
    } catch (err) { console.error("Error saving event:", err); }
  };

  const handleDeleteEvent = async (id) => {
    if(!window.confirm("Are you sure you want to delete this event?")) return;
    try {
      const token = localStorage.getItem('authToken');
      await axios.delete(`https://rc-fitness-backend.vercel.app/api/events/delete/${id}`, { headers: { 'auth-token': token } });
      fetchEvents();
    } catch (err) { console.error("Error deleting event:", err); }
  };

  const fetchAttendees = async (eventId) => {
    setLoadingAttendees(true);
    setSelectedEvent(events.find(e => e._id === eventId));
    try {
      const token = localStorage.getItem('authToken');
      const res = await axios.get(`https://rc-fitness-backend.vercel.app/api/events/registrations/${eventId}`, { headers: { 'auth-token': token } });
      setAttendees(res.data);
    } catch (err) { console.error(err); }
    finally { setLoadingAttendees(false); }
  };

  return (
    <div className="flex bg-[#080808] min-h-screen text-white font-sans">
      <Sidebar />
      <main className="flex-1 p-6 lg:p-12 lg:ml-64 pt-24 lg:pt-12">
        <header className="flex flex-col lg:flex-row justify-between items-center gap-6 mb-10">
          <div className="text-center lg:text-left">
            <h1 className="text-4xl font-black uppercase tracking-tighter italic leading-none flex items-center justify-center lg:justify-start gap-4">
              <Calendar className="text-blue-600" size={36} /> Event Management
            </h1>
            <p className="text-gray-500 text-[10px] font-bold uppercase tracking-[0.3em] mt-2">Manage Gym Events & Classes</p>
          </div>
          <button 
            onClick={() => { setIsFormVisible(!isFormVisible); setEditEventId(null); setNewEvent({ title: '', date: '', time: '', type: '', location: '', description: '', image: '' }); }} 
            className="w-full lg:w-auto bg-blue-600 hover:bg-blue-700 px-8 py-4 rounded-2xl font-black uppercase text-xs tracking-widest shadow-2xl transition-all active:scale-95"
          >
            {isFormVisible ? 'Close Form' : <><Plus size={16} className="inline mr-2" /> Schedule Event</>}
          </button>
        </header>

        {isFormVisible && (
          <form onSubmit={handleSaveEvent} className="mb-12 bg-[#111] border border-gray-900 rounded-3xl p-6 lg:p-8 shadow-xl animate-in fade-in slide-in-from-top-4">
            <h3 className="text-[10px] font-black uppercase text-gray-500 mb-6 tracking-widest border-b border-gray-900 pb-4">
              {editEventId ? 'Edit Event Details' : 'Create New Event'}
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-[10px] uppercase font-bold text-gray-500 tracking-widest mb-2">Event Title</label>
                  <input type="text" value={newEvent.title} onChange={e => setNewEvent({...newEvent, title: e.target.value})} className="w-full bg-black border border-gray-800 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-blue-600 transition-colors" required />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] uppercase font-bold text-gray-500 tracking-widest mb-2">Date</label>
                    <input type="date" value={newEvent.date} onChange={e => setNewEvent({...newEvent, date: e.target.value})} className="w-full bg-black border border-gray-800 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-blue-600 transition-colors text-gray-400" required />
                  </div>
                  <div>
                    <label className="block text-[10px] uppercase font-bold text-gray-500 tracking-widest mb-2">Time</label>
                    <input type="time" value={newEvent.time} onChange={e => setNewEvent({...newEvent, time: e.target.value})} className="w-full bg-black border border-gray-800 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-blue-600 transition-colors text-gray-400" required />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] uppercase font-bold text-gray-500 tracking-widest mb-2">Event Type</label>
                    <select value={newEvent.type} onChange={e => setNewEvent({...newEvent, type: e.target.value})} className="w-full bg-black border border-gray-800 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-blue-600 transition-colors text-gray-400" required>
                      <option value="" disabled>Select Type</option>
                      <option value="Class">Fitness Class</option>
                      <option value="Workshop">Workshop</option>
                      <option value="Competition">Competition</option>
                      <option value="Social">Social</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[10px] uppercase font-bold text-gray-500 tracking-widest mb-2">Location</label>
                    <input type="text" value={newEvent.location} onChange={e => setNewEvent({...newEvent, location: e.target.value})} className="w-full bg-black border border-gray-800 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-blue-600 transition-colors" placeholder="e.g. Main Studio" />
                  </div>
                </div>
                <div>
                  <label className="block text-[10px] uppercase font-bold text-gray-500 tracking-widest mb-2 mt-2">Event Description / Details</label>
                  <textarea value={newEvent.description || ''} onChange={e => setNewEvent({...newEvent, description: e.target.value})} className="w-full bg-black border border-gray-800 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-blue-600 transition-colors h-24 resize-none" placeholder="Enter full event description..."></textarea>
                </div>
              </div>

              <div>
                <label className="block text-[10px] uppercase font-bold text-gray-500 tracking-widest mb-2">Event Cover Image</label>
                <div className="w-full h-full min-h-[150px] bg-black border-2 border-dashed border-gray-800 hover:border-blue-600 rounded-xl flex flex-col items-center justify-center transition-colors relative overflow-hidden group">
                  {newEvent.image ? (
                    <>
                      <img src={newEvent.image} alt="Preview" className="w-full h-full object-cover opacity-80 group-hover:opacity-40 transition-opacity" />
                      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                        <span className="bg-blue-600 text-white font-black uppercase text-[10px] tracking-widest px-4 py-2 rounded-lg">Change Image</span>
                      </div>
                    </>
                  ) : (
                    <div className="flex flex-col items-center text-gray-600 group-hover:text-blue-500 transition-colors">
                      <ImageIcon size={32} className="mb-2" />
                      <span className="font-bold text-xs uppercase tracking-widest">Upload Cover</span>
                    </div>
                  )}
                  <input type="file" accept="image/*" onChange={handleImageUpload} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
                </div>
              </div>
            </div>

            <div className="mt-8">
              <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-black uppercase text-sm tracking-widest py-4 rounded-xl transition-all shadow-xl shadow-blue-900/20 active:scale-[0.98]">
                {editEventId ? 'Save Changes' : 'Schedule Event'}
              </button>
            </div>
          </form>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {events.map((ev) => (
             <div key={ev._id} className="bg-[#111] border border-gray-900 rounded-3xl overflow-hidden shadow-2xl group hover:border-gray-700 transition-all flex flex-col h-full">
               <div className="relative h-48 bg-black overflow-hidden flex items-center justify-center border-b border-gray-900">
                 {ev.image ? (
                   <img src={ev.image} alt={ev.title} className="w-full h-full object-cover opacity-80 group-hover:scale-110 transition-transform duration-500" />
                 ) : (
                   <ImageIcon size={48} className="text-gray-800" />
                 )}
                 <div className="absolute top-4 left-4">
                   <span className="bg-blue-900/80 backdrop-blur-sm border border-blue-800 text-blue-400 text-[9px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full shadow-lg">
                     {ev.type}
                   </span>
                 </div>
               </div>
               
               <div className="p-6 flex-1 flex flex-col">
                 <h3 className="font-black text-xl uppercase tracking-tight italic mb-4">{ev.title}</h3>
                 
                 <div className="space-y-2 mb-6 text-gray-400 text-xs font-bold tracking-widest uppercase">
                   <div className="flex items-center gap-3">
                     <Calendar size={14} className="text-blue-500" />
                     <span>{ev.date}</span>
                   </div>
                   <div className="flex items-center gap-3">
                     <Clock size={14} className="text-blue-500" />
                     <span>{ev.time}</span>
                   </div>
                   <div className="flex items-center gap-3">
                     <MapPin size={14} className="text-blue-500" />
                     <span>{ev.location || 'TBA'}</span>
                   </div>
                 </div>
                 
                 <button 
                    onClick={() => fetchAttendees(ev._id)}
                    className="w-full mb-4 bg-blue-600/10 hover:bg-blue-600/20 text-blue-400 border border-blue-900/30 rounded-xl py-3 text-[10px] font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2"
                  >
                    <Users size={14} /> View Attendees
                  </button>

                 <div className="mt-auto flex gap-2 pt-4 border-t border-gray-900">
                   <button onClick={() => { setEditEventId(ev._id); setNewEvent({ title: ev.title, date: ev.date, time: ev.time, type: ev.type, location: ev.location, description: ev.description || '', image: ev.image }); setIsFormVisible(true); window.scrollTo({ top: 0, behavior: 'smooth' }); }} className="flex-1 bg-gray-900 hover:bg-gray-800 text-white text-[10px] font-black uppercase tracking-widest py-3 rounded-xl transition-colors flex items-center justify-center gap-2">
                     <Edit2 size={14} /> Edit
                   </button>
                   <button onClick={() => handleDeleteEvent(ev._id)} className="flex-1 bg-red-900/20 hover:bg-red-600 hover:text-white text-red-500 border border-red-900/30 hover:border-red-600 text-[10px] font-black uppercase tracking-widest py-3 rounded-xl transition-all flex items-center justify-center gap-2">
                     <Trash2 size={14} /> Delete
                   </button>
                 </div>
               </div>
             </div>
          ))}
          {events.length === 0 && !isFormVisible && (
            <div className="col-span-full py-20 flex flex-col items-center justify-center border-2 border-dashed border-gray-900 rounded-3xl opacity-50">
              <Calendar size={48} className="text-gray-700 mb-4" />
              <p className="text-gray-500 uppercase tracking-widest font-bold text-sm">No upcoming events scheduled.</p>
            </div>
          )}
        </div>

        {/* Attendees Modal */}
        {selectedEvent && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[100] flex items-center justify-center p-6 animate-in fade-in duration-300">
            <div className="bg-[#111] border border-gray-800 w-full max-w-2xl rounded-[2.5rem] overflow-hidden shadow-2xl flex flex-col max-h-[80vh] animate-in zoom-in-95 duration-300">
              <div className="p-8 border-b border-gray-900 bg-[#0a0a0a] flex justify-between items-center text-white">
                <div>
                   <h2 className="text-2xl font-black uppercase italic tracking-tighter leading-none">{selectedEvent.title}</h2>
                   <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mt-2">Registration List</p>
                </div>
                <button onClick={() => setSelectedEvent(null)} className="p-2 hover:bg-gray-900 rounded-full transition-colors"><XIcon size={24} /></button>
              </div>

              <div className="flex-1 overflow-y-auto p-8 space-y-4">
                 {loadingAttendees ? (
                   <p className="text-center text-blue-500 font-bold uppercase text-xs animate-pulse">Loading participants...</p>
                 ) : attendees.length === 0 ? (
                   <div className="text-center py-10 opacity-30">
                      <Users size={48} className="mx-auto mb-4" />
                      <p className="font-black uppercase tracking-widest text-sm">No registrations yet.</p>
                   </div>
                 ) : (
                   attendees.map((at, i) => (
                     <div key={i} className="bg-black border border-gray-800 rounded-2xl p-4 flex items-center justify-between hover:border-blue-900/50 transition-colors group">
                        <div className="flex items-center gap-4">
                           <div className="w-10 h-10 bg-blue-600/10 rounded-full flex items-center justify-center text-blue-500 font-black italic">{at.userName.charAt(0)}</div>
                           <div>
                              <h4 className="font-black uppercase tracking-tight text-white">{at.userName}</h4>
                              <div className="flex items-center gap-2 text-gray-500 text-[10px] font-bold">
                                 <Mail size={10} /> {at.userEmail}
                              </div>
                           </div>
                        </div>
                        <div className="text-right">
                           <p className="text-[9px] font-bold text-gray-600 uppercase tracking-widest">Registered on</p>
                           <p className="text-[10px] font-black text-white">{new Date(at.registrationDate).toLocaleDateString()}</p>
                        </div>
                     </div>
                   ))
                 )}
              </div>
              
              <div className="p-6 bg-[#0a0a0a] border-t border-gray-900">
                 <button onClick={() => setSelectedEvent(null)} className="w-full bg-gray-900 hover:bg-gray-800 text-white py-4 rounded-xl font-black uppercase tracking-widest text-xs transition-colors">Close List</button>
              </div>
            </div>
          </div>
        )}

      </main>
    </div>
  );
};

export default Event;
