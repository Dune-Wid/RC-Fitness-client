import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { ArrowLeft, Calendar, Dumbbell, Clock, MapPin, Users, CheckCircle } from 'lucide-react';

const PublicEventDetails = () => {
  const { id } = useParams();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [registered, setRegistered] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '' });
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const res = await axios.get(`https://rc-fitness-backend.vercel.app/api/events/${id}`);
        setEvent(res.data);
      } catch (err) { console.error("Error fetching event:", err); } finally {
        setLoading(false);
      }
    };
    fetchEvent();
  }, [id]);

  const handleRegister = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');
    try {
      await axios.post(`https://rc-fitness-backend.vercel.app/api/events/register/${id}`, {
        userName: formData.name,
        userEmail: formData.email
      });
      setRegistered(true);
    } catch (err) {
      setError("Registration failed. Please try again.");
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div className="min-h-screen bg-[#050505] flex items-center justify-center text-blue-500 text-sm font-bold uppercase tracking-widest">Loading...</div>;
  
  if (!event) return (
    <div className="min-h-screen bg-[#050505] flex flex-col items-center justify-center p-6 text-center">
      <Calendar size={48} className="text-gray-800 mb-4" />
      <h2 className="text-2xl font-black uppercase italic tracking-tighter text-white mb-2">Event Not Found</h2>
      <p className="text-gray-500 text-xs font-bold uppercase tracking-widest mb-8">This event may have already occurred or was removed.</p>
      <Link to="/events" className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-xl font-black uppercase tracking-widest text-[10px] transition-all flex items-center gap-2">
        <ArrowLeft size={14} /> Back to Events
      </Link>
    </div>
  );

  return (
    <div className="bg-[#050505] min-h-screen text-white font-sans selection:bg-blue-600">
      <nav className="fixed top-0 w-full z-50 bg-[#0a0a0a]/90 backdrop-blur-md border-b border-white/5">
        <div className="max-w-7xl mx-auto px-6 h-20 flex justify-between items-center">
          <Link to="/" className="flex items-center gap-2">
            <div className="bg-red-600 p-1.5 rounded-sm"><Dumbbell className="text-white" size={20} /></div>
            <span className="font-black text-xl tracking-tighter uppercase italic">RC Fitness</span>
          </Link>
          <Link to="/events" className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-gray-400 hover:text-blue-500 transition-colors">
            <ArrowLeft size={16} /> Back to Catalog
          </Link>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-6 pt-32 pb-20">
        <div className="bg-[#111] border border-gray-900 rounded-[2.5rem] p-6 lg:p-12 shadow-2xl flex flex-col lg:flex-row gap-12 lg:gap-20">
          
          <div className="w-full lg:w-1/2 flex items-center justify-center bg-black rounded-3xl overflow-hidden border border-gray-800 min-h-[400px]">
            {event.image ? (
              <img src={event.image} alt={event.title} className="w-full h-full object-cover min-h-[400px] drop-shadow-2xl animate-in zoom-in duration-700" />
            ) : (
              <Calendar size={64} className="text-gray-800" />
            )}
          </div>

          <div className="w-full lg:w-1/2 flex flex-col justify-center">
            <div className="mb-8 border-b border-gray-900 pb-8">
              <span className="inline-block px-3 py-1 bg-blue-900/20 text-blue-400 border border-blue-900/50 rounded-full text-[9px] font-black uppercase tracking-widest mb-4">
                {event.type}
              </span>
              <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tighter italic leading-none mb-6 text-white drop-shadow-xl">
                {event.title}
              </h1>
              
              <div className="flex flex-col gap-4 mt-8">
                <div className="flex items-center gap-4 bg-[#0a0a0a] border border-gray-800 p-4 rounded-2xl text-sm font-bold tracking-widest uppercase">
                  <div className="bg-blue-900/20 p-3 rounded-xl"><Calendar className="text-blue-500" size={24} /></div>
                  <div>
                    <span className="block text-gray-500 text-[9px] mb-1">Date</span>
                    <span className="text-white">{new Date(event.date).toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center gap-4 bg-[#0a0a0a] border border-gray-800 p-4 rounded-2xl text-[10px] lg:text-sm font-bold tracking-widest uppercase">
                    <div className="bg-blue-900/20 p-2 lg:p-3 rounded-xl"><Clock className="text-blue-500" size={20} /></div>
                    <div>
                      <span className="block text-gray-500 text-[9px] mb-1">Time</span>
                      <span className="text-white">{event.time}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 bg-[#0a0a0a] border border-gray-800 p-4 rounded-2xl text-[10px] lg:text-sm font-bold tracking-widest uppercase">
                    <div className="bg-blue-900/20 p-2 lg:p-3 rounded-xl"><MapPin className="text-blue-500" size={20} /></div>
                    <div>
                      <span className="block text-gray-500 text-[9px] mb-1">Location</span>
                      <span className="text-white truncate max-w-[100px] lg:max-w-full block">{event.location || 'RC Fitness Center'}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="mb-10">
              <h3 className="text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-4">Event Details</h3>
              <p className="text-gray-300 text-sm md:text-base leading-relaxed whitespace-pre-wrap">
                {event.description || "No specific details provided for this session. Contact front-desk for prerequisites."}
              </p>
            </div>

            {registered ? (
              <div className="bg-green-500/10 border border-green-500/30 rounded-3xl p-8 text-center animate-in zoom-in-95 duration-500">
                <CheckCircle className="text-green-500 mx-auto mb-4" size={48} />
                <h3 className="text-2xl font-black uppercase italic tracking-tighter text-white mb-2">You're In!</h3>
                <p className="text-gray-400 text-sm">Confirmation email sent to <strong>{formData.email}</strong>. See you there!</p>
                <button onClick={() => setRegistered(false)} className="mt-6 text-[10px] font-black uppercase tracking-widest text-gray-500 hover:text-white underline underline-offset-4">Register someone else</button>
              </div>
            ) : showForm ? (
              <form onSubmit={handleRegister} className="bg-black/50 border border-gray-800 rounded-3xl p-8 shadow-2xl animate-in slide-in-from-bottom-4">
                 <h3 className="text-xs font-black uppercase tracking-[0.2em] mb-6 text-blue-500 flex items-center gap-2">
                   Online Registration
                 </h3>
                 <div className="space-y-4">
                    <div>
                      <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-600 mb-2">Full Name</label>
                      <input 
                        type="text" required 
                        value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})}
                        className="w-full bg-[#0a0a0a] border border-gray-800 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-blue-600 transition-colors text-white" 
                        placeholder="e.g. Sathsara Gamage" 
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-600 mb-2">Email Address</label>
                      <input 
                        type="email" required 
                        value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})}
                        className="w-full bg-[#0a0a0a] border border-gray-800 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-blue-600 transition-colors text-white" 
                        placeholder="your@email.com" 
                      />
                    </div>
                    {error && <p className="text-[10px] text-red-500 font-bold uppercase">{error}</p>}
                    <div className="flex gap-4 pt-4">
                       <button type="button" onClick={() => setShowForm(false)} className="flex-1 bg-gray-900 hover:bg-gray-800 text-white py-4 rounded-xl font-black uppercase tracking-widest text-[10px] transition-colors">Cancel</button>
                       <button type="submit" disabled={submitting} className="flex-[2] bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-xl font-black uppercase tracking-widest text-xs flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(37,99,235,0.3)] transition-all disabled:opacity-50">
                         {submitting ? "Booking..." : "Confirm Spot"}
                       </button>
                    </div>
                 </div>
              </form>
            ) : (
              <>
                <button 
                  onClick={() => setShowForm(true)}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white py-5 rounded-2xl font-black uppercase tracking-widest text-sm flex items-center justify-center gap-3 transition-all hover:shadow-[0_0_30px_rgba(37,99,235,0.3)] hover:-translate-y-1 active:scale-95"
                >
                  <Users size={20} /> Register Online Now
                </button>
                <p className="text-center text-gray-600 text-[9px] font-bold uppercase tracking-widest mt-4">
                  Instant confirmation via email. Secure your spot today.
                </p>
              </>
            )}
          </div>

        </div>
      </main>
    </div>
  );
};

export default PublicEventDetails;
