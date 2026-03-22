import { useState, useEffect } from 'react';
import axios from 'axios';
import Sidebar from '../components/Sidebar';
import { Users, DollarSign, UserCheck, Activity } from 'lucide-react';

const Dashboard = () => {
  const [stats, setStats] = useState({ totalMembers: 0, activeMembers: 0, totalStaff: 0, revenue: 0 });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const token = localStorage.getItem('authToken');
        const res = await axios.get('https://rc-fitness-backend.vercel.app/api/user/stats', { headers: { 'auth-token': token } });
        setStats(res.data);
      } catch (err) { console.error(err); }
    };
    fetchStats();
  }, []);

  return (
    <div className="flex bg-[#080808] min-h-screen text-white">
      <Sidebar />
      <main className="flex-1 p-6 lg:p-10 lg:ml-64 pt-24 lg:pt-10">
        <header className="mb-10 text-center lg:text-left">
          <h1 className="text-3xl lg:text-4xl font-black uppercase tracking-tight italic">Admin Dashboard</h1>
          <p className="text-gray-500 mt-1 text-[10px] font-bold uppercase tracking-widest">Real-time facility overview</p>
        </header>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
          <StatCard title="Total Members" value={stats.totalMembers} trend="Total Enrolled" icon={<Users className="text-red-500"/>} />
          <StatCard title="Active Members" value={stats.activeMembers} trend="Currently Active" icon={<Activity className="text-green-500"/>} />
          <StatCard title="Total Staff" value={stats.totalStaff} trend="Trainers & Admin" icon={<UserCheck className="text-blue-500"/>} />
          <StatCard title="Est. Revenue" value={`Rs. ${stats.revenue?.toLocaleString()}`} trend="Monthly Target" icon={<DollarSign className="text-yellow-500"/>} />
        </div>
      </main>
    </div>
  );
};

const StatCard = ({ title, value, trend, icon }) => (
  <div className="bg-[#121212] p-6 rounded-3xl border border-gray-800 relative overflow-hidden">
    <div className="flex justify-between items-start mb-4">
      <p className="text-gray-400 text-[10px] font-black uppercase tracking-widest">{title}</p>
      <div className="bg-black p-2 rounded-lg border border-gray-800">{icon}</div>
    </div>
    <div className="flex items-baseline gap-3">
      <h3 className="text-3xl lg:text-4xl font-black">{value}</h3>
      <span className="text-gray-500 text-[9px] font-bold uppercase">{trend}</span>
    </div>
    <div className="absolute bottom-0 left-0 w-full h-1 bg-red-600 opacity-30"></div>
  </div>
);

export default Dashboard;