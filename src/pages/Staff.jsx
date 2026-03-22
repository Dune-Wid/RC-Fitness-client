import { useState, useEffect } from 'react';
import axios from 'axios';
import Sidebar from '../components/Sidebar';
import StaffModal from '../components/StaffModal';
import { Search, UserPlus, Edit2, Trash2, Clock, Star } from 'lucide-react';

const Staff = () => {
  const [staff, setStaff] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedStaff, setSelectedStaff] = useState(null);

  const fetchStaff = async () => {
    try {
      const token = localStorage.getItem('authToken');
      const res = await axios.get('http://localhost:5000/api/user/staff-all', { headers: { 'auth-token': token } });
      setStaff(res.data);
    } catch (err) { console.error(err); }
  };

  useEffect(() => { fetchStaff(); }, []);

  const deleteStaff = async (id) => {
    if (window.confirm("Remove this trainer?")) {
      const token = localStorage.getItem('authToken');
      await axios.delete(`http://localhost:5000/api/user/delete/${id}`, { headers: { 'auth-token': token } });
      fetchStaff();
    }
  };

  return (
    <div className="flex bg-[#080808] min-h-screen text-white font-sans">
      <Sidebar />
      <main className="flex-1 p-6 lg:p-12 lg:ml-64 pt-24 lg:pt-12">
        <header className="flex flex-col lg:flex-row justify-between items-center gap-6 mb-10">
          <div className="text-center lg:text-left">
            <h1 className="text-4xl font-black uppercase tracking-tighter italic leading-none">Staff Management</h1>
            <p className="text-gray-500 text-[10px] font-bold uppercase tracking-[0.3em] mt-2">Trainers & Attendance</p>
          </div>
          <button onClick={() => { setSelectedStaff(null); setIsModalOpen(true); }} className="w-full lg:w-auto bg-red-600 hover:bg-red-700 px-8 py-4 rounded-2xl font-black uppercase text-xs tracking-widest shadow-2xl transition-all active:scale-95">
            <UserPlus size={16} className="inline mr-2" /> Add Trainer
          </button>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
          {staff.map((s) => (
            <div key={s._id} className="bg-[#111] border border-gray-900 rounded-3xl p-6 relative group transition-all hover:border-gray-700 shadow-xl">
               <div className="flex justify-between items-start mb-6">
                  <div className="px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest bg-green-900/20 text-green-500 border border-green-900/30">On Duty</div>
                  <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={() => { setSelectedStaff(s); setIsModalOpen(true); }} className="p-2 bg-black rounded-lg text-gray-500 hover:text-white border border-gray-800"><Edit2 size={14}/></button>
                    <button onClick={() => deleteStaff(s._id)} className="p-2 bg-black rounded-lg text-gray-500 hover:text-red-500 border border-gray-800"><Trash2 size={14}/></button>
                  </div>
               </div>
               <div className="mb-6 flex flex-col items-center text-center">
                 <div className="w-16 h-16 bg-red-600/10 rounded-2xl flex items-center justify-center text-red-500 font-black text-2xl mb-4 border border-red-900/20 uppercase">{s.fullName[0]}</div>
                 <h3 className="font-black text-lg uppercase leading-tight italic">{s.fullName}</h3>
                 <p className="text-red-600 text-[9px] font-bold mt-1 tracking-widest uppercase">{s.shift}</p>
                 <p className="text-gray-500 text-[9px] mt-1 font-bold">{s.email}</p>
               </div>
               <div className="pt-4 border-t border-gray-900 flex justify-between items-center text-[10px] font-bold uppercase text-gray-500">
                  <div className="flex items-center gap-2"><Clock size={12}/> 08:00 - 17:00</div>
                  <div className="flex items-center gap-1"><Star size={12} className="text-yellow-600 fill-yellow-600"/> 5.0</div>
               </div>
            </div>
          ))}
          <button onClick={() => { setSelectedStaff(null); setIsModalOpen(true); }} className="border-2 border-dashed border-gray-900 rounded-3xl p-6 flex flex-col items-center justify-center hover:border-red-600 transition-colors group h-[300px]">
            <div className="bg-gray-900 p-4 rounded-full mb-4 group-hover:bg-red-600/10 transition-colors"><UserPlus size={30} className="text-gray-700 group-hover:text-red-600" /></div>
            <p className="text-[10px] font-black uppercase tracking-widest text-gray-700 group-hover:text-red-500">New Trainer Profile</p>
          </button>
        </div>
      </main>
      {isModalOpen && <StaffModal close={() => setIsModalOpen(false)} refresh={fetchStaff} staffMember={selectedStaff} />}
    </div>
  );
};

export default Staff;