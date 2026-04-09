import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Home, Dumbbell, Utensils, TrendingUp, CalendarDays, Store, User, Users, LogOut, Menu, X } from 'lucide-react';

const MemberSidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  const menuItems = [
    { name: 'Home', icon: <Home size={20}/>, path: '/profile' },
    { name: 'Workout Plans', icon: <Dumbbell size={20}/>, path: '/workout-plans' },
    { name: 'Diet Plans', icon: <Utensils size={20}/>, path: '/diet-plans' },
    { name: 'Progress', icon: <TrendingUp size={20}/>, path: '/progress' },
    { name: 'Community', icon: <Users size={20}/>, path: '/reviews' },
    { name: 'Store', icon: <Store size={20}/>, path: '/store' },
    { name: 'Profile', icon: <User size={20}/>, path: '/profile' },
  ];

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  return (
    <>
      {/* Mobile Top Bar */}
      <div className="lg:hidden fixed top-0 w-full bg-black border-b border-white/5 p-4 flex justify-between items-center z-[60]">
        <div className="flex items-center gap-2">
          <div className="bg-red-600 p-1.5 rounded-lg"><Dumbbell className="text-white" size={16} /></div>
          <div className="flex flex-col">
            <span className="font-black text-white italic uppercase tracking-tighter text-sm leading-tight">RC Fitness</span>
            <span className="text-blue-200 text-[8px] uppercase tracking-widest font-bold leading-tight">Member Dashboard</span>
          </div>
        </div>
        <button onClick={() => setIsOpen(!isOpen)} className="text-white p-2 bg-[#111] rounded-lg">
          {isOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Sidebar Navigation */}
      <div className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-[#0a0a0a] border-r border-white/5 p-6 transform transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <div className="flex items-center gap-3 mb-12 mt-12 lg:mt-0">
          <div className="bg-red-600 p-3 rounded-xl shadow-[0_0_15px_rgba(220,38,38,0.5)]">
            <Dumbbell className="text-white" size={24} />
          </div>
          <div>
            <h1 className="text-white font-black text-xl leading-none italic uppercase tracking-tighter">RC Fitness</h1>
            <p className="text-blue-300/80 text-[10px] uppercase font-bold mt-1 tracking-wider">Member Dashboard</p>
          </div>
        </div>

        <nav className="flex-1 space-y-2">
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.name}
                to={item.path}
                onClick={() => setIsOpen(false)}
                className={`flex items-center gap-4 p-3.5 rounded-2xl transition-all duration-300 ${
                  isActive 
                  ? 'bg-red-950/30 text-red-500 border border-red-900/50 shadow-[0_0_20px_rgba(220,38,38,0.1)]' 
                  : 'text-gray-500 hover:text-gray-200 hover:bg-white/5'
                }`}
              >
                {item.icon}
                <span className="font-bold text-xs tracking-wide">{item.name}</span>
              </Link>
            )
          })}
        </nav>

        <div className="absolute bottom-6 left-6 right-6 pt-6 border-t border-white/5">
          <button onClick={handleLogout} className="flex items-center gap-4 p-3 w-full text-gray-500 hover:text-white hover:bg-white/5 rounded-2xl transition-all duration-300 group">
            <LogOut size={20} className="group-hover:-translate-x-1 transition-transform" />
            <span className="font-bold text-xs tracking-wide">Sign Out</span>
          </button>
        </div>
      </div>
      
      {isOpen && <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-40 lg:hidden" onClick={() => setIsOpen(false)}></div>}
    </>
  );
};

export default MemberSidebar;
