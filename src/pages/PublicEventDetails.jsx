import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { ArrowLeft, Calendar, Dumbbell, Clock, MapPin, Users } from 'lucide-react';

const PublicEventDetails = () => {
  const { id } = useParams();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [registering, setRegistering] = useState(false);
  const [regData, setRegData] = useState({ userName: '', userEmail: '' });
  const [regStatus, setRegStatus] = useState(null); // 'success' or 'error'

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/events/${id}`);
        setEvent(res.data);
      } catch (err) { console.error("Error fetching event:", err); } finally {
        setLoading(false);
      }
    };
    fetchEvent();
  }, [id]);

  const handleRegister = async (e) => {
    e.preventDefault();
    setRegistering(true);
    setRegStatus(null);
    try {
      await axios.post(`http://localhost:5000/api/events/register/${id}`, regData);
      setRegStatus('success');
      setRegData({ userName: '', userEmail: '' });
    } catch (err) {
      console.error("Registration error:", err);
      setRegStatus('error');
    } finally {
      setRegistering(false);
    }
  };

  if (loading) return <div className="min-h-screen bg-[#050505] flex items-center justify-center text-blue-500 text-sm font-bold uppercase tracking-widest">Loading...</div>;
  if (!event) return <div className="min-h-screen bg-[#050505] flex items-center justify-center text-red-500 text-sm font-bold uppercase tracking-widest">Event Not Found</div>;

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

            <div className="bg-[#0a0a0a] border border-gray-800 rounded-3xl p-6 lg:p-8">
              <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-blue-500 mb-6 flex items-center gap-2">
                <Users size={14} /> Reserve Your Spot Online
              </h3>
              
              {regStatus === 'success' ? (
                <div className="text-center py-6 animate-in zoom-in duration-300">
                  <div className="bg-green-600/20 text-green-500 p-4 rounded-2xl border border-green-600/30 mb-4 font-bold text-sm">
                    Registration successful! Check your email for confirmation.
                  </div>
                  <button onClick={() => setRegStatus(null)} className="text-[10px] font-bold uppercase tracking-widest text-gray-500 hover:text-white transition-colors">Register another person</button>
                </div>
              ) : (
                <form onSubmit={handleRegister} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input 
                      type="text" 
                      required 
                      placeholder="Your Full Name" 
                      value={regData.userName}
                      onChange={e => setRegData({...regData, userName: e.target.value})}
                      className="bg-black border border-gray-800 rounded-xl px-4 py-4 text-sm focus:outline-none focus:border-blue-600 transition-colors text-white"
                    />
                    <input 
                      type="email" 
                      required 
                      placeholder="Your Email Address" 
                      value={regData.userEmail}
                      onChange={e => setRegData({...regData, userEmail: e.target.value})}
                      className="bg-black border border-gray-800 rounded-xl px-4 py-4 text-sm focus:outline-none focus:border-blue-600 transition-colors text-white"
                    />
                  </div>
                  
                  {regStatus === 'error' && <p className="text-red-500 text-[10px] font-bold uppercase tracking-widest text-center">Failed to register. Please try again.</p>}
                  
                  <button 
                    disabled={registering}
                    className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white py-5 rounded-2xl font-black uppercase tracking-widest text-sm flex items-center justify-center gap-3 transition-all hover:shadow-[0_0_30px_rgba(37,99,235,0.3)] hover:-translate-y-1 active:scale-95"
                  >
                    {registering ? 'Validating...' : <><Users size={20} /> Confirm Registration</>}
                  </button>
                </form>
              )}

              <p className="text-center text-gray-600 text-[9px] font-bold uppercase tracking-widest mt-6 pb-2 border-b border-white/5">
                Instant confirmation via email. Secure your spot now.
              </p>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
};

export default PublicEventDetails;
