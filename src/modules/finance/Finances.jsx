import { useState, useEffect } from 'react';
import axios from 'axios';
import Sidebar from '../../components/Sidebar';
import { CreditCard, DollarSign, Plus, Trash2, Calendar, FileText, Edit2, TrendingUp, BarChart3, Wallet, Users, ShoppingBag, Banknote, TrendingDown } from 'lucide-react';

const Finances = () => {
  const [activeTab, setActiveTab] = useState('dashboard'); // 'dashboard', 'plans', 'payments', 'salary', 'shop'

  const [plans, setPlans] = useState([]);
  const [payments, setPayments] = useState([]);

  const [newPlan, setNewPlan] = useState({ name: '', price: '', duration: '' });
  const [newPayment, setNewPayment] = useState({ member: '', amount: '', date: '', status: 'Paid', duration: '' });

  const fetchFinanceData = async () => {
    try {
      const token = localStorage.getItem('authToken');
      const config = { headers: { 'auth-token': token } };
      
      const [plansRes, paymentsRes] = await Promise.all([
        axios.get('https://rc-fitness-backend.vercel.app/api/finance/plans', config).catch(() => ({ data: [] })),
        axios.get('https://rc-fitness-backend.vercel.app/api/finance/payments', config).catch(() => ({ data: [] }))
      ]);
      
      setPlans(plansRes.data || []);
      setPayments(paymentsRes.data || []);
    } catch (err) { console.error("Error fetching finance data:", err); }
  };

  useEffect(() => { fetchFinanceData(); }, []);

  const handleAddPlan = async (e) => {
    e.preventDefault();
    if (!newPlan.name || !newPlan.price || !newPlan.duration) return;
    try {
      const token = localStorage.getItem('authToken');
      await axios.post('https://rc-fitness-backend.vercel.app/api/finance/plans/add', { ...newPlan, price: Number(newPlan.price) }, { headers: { 'auth-token': token } });
      setNewPlan({ name: '', price: '', duration: '' });
      fetchFinanceData();
    } catch (err) { console.error(err); }
  };

  const handleDeletePlan = async (id) => {
    try {
      const token = localStorage.getItem('authToken');
      await axios.delete(`https://rc-fitness-backend.vercel.app/api/finance/plans/delete/${id}`, { headers: { 'auth-token': token } });
      fetchFinanceData();
    } catch (err) { console.error(err); }
  };

  const handleAddPayment = async (e) => {
    e.preventDefault();
    if (!newPayment.member || !newPayment.amount || !newPayment.date) return;
    try {
      const token = localStorage.getItem('authToken');
      await axios.post('https://rc-fitness-backend.vercel.app/api/finance/payments/add', { ...newPayment, amount: Number(newPayment.amount) }, { headers: { 'auth-token': token } });
      setNewPayment({ member: '', amount: '', date: '', status: 'Paid', duration: '' });
      fetchFinanceData();
    } catch (err) { console.error(err); }
  };

  const handleDeletePayment = async (id) => {
    try {
      const token = localStorage.getItem('authToken');
      await axios.delete(`https://rc-fitness-backend.vercel.app/api/finance/payments/delete/${id}`, { headers: { 'auth-token': token } });
      fetchFinanceData();
    } catch (err) { console.error(err); }
  };

  const calculateRemainingDays = (paymentDate, durationText) => {
    if (!paymentDate || !durationText) return 0;
    const start = new Date(paymentDate);
    let daysToAdd = 30; 
    if (durationText.toLowerCase().includes('3')) daysToAdd = 90;
    else if (durationText.toLowerCase().includes('12')) daysToAdd = 365;
    else if (durationText.toLowerCase().includes('6')) daysToAdd = 180;
    
    // Add days to start date
    const expiry = new Date(start.getTime() + daysToAdd * 24 * 60 * 60 * 1000);
    const today = new Date();
    const diffTime = expiry - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 0;
  };

  return (
    <div className="flex bg-[#080808] min-h-screen text-white font-sans">
      <Sidebar />
      <main className="flex-1 p-6 lg:p-12 lg:ml-64 pt-24 lg:pt-12">
        <header className="mb-10 text-center lg:text-left">
          <h1 className="text-4xl font-black uppercase tracking-tighter italic leading-none flex items-center justify-center lg:justify-start gap-4">
            <BarChart3 className="text-red-600" size={36} /> Financial Dashboard
          </h1>
          <p className="text-gray-500 text-[10px] font-bold uppercase tracking-[0.3em] mt-2">Overview &amp; Management</p>
        </header>

        {/* Top Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-[#111] border border-gray-900 rounded-3xl p-8 flex flex-col justify-center items-center text-center shadow-2xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity"><TrendingDown size={64}/></div>
            <p className="text-gray-500 text-[10px] font-black uppercase tracking-widest mb-2 z-10">Outgoing Payments</p>
            <h2 className="text-4xl font-black italic tracking-tighter text-gray-300 z-10">LKR 450,000</h2>
          </div>
          <div className="bg-[#111] border border-red-900/30 rounded-3xl p-8 flex flex-col justify-center items-center text-center shadow-2xl relative overflow-hidden group">
             <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity text-red-500"><TrendingUp size={64}/></div>
            <p className="text-gray-500 text-[10px] font-black uppercase tracking-widest mb-2 z-10">Income This Month</p>
            <h2 className="text-4xl font-black italic tracking-tighter text-red-500 z-10">LKR 620,000</h2>
          </div>
          <div className="bg-[#111] border border-green-900/30 rounded-3xl p-8 flex flex-col justify-center items-center text-center shadow-2xl relative overflow-hidden group">
             <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity text-green-500"><Wallet size={64}/></div>
            <p className="text-gray-500 text-[10px] font-black uppercase tracking-widest mb-2 z-10">Profit</p>
            <h2 className="text-4xl font-black italic tracking-tighter text-green-500 z-10">LKR 210,000</h2>
          </div>
        </div>

        {/* Bottom Nav Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
          <button onClick={() => setActiveTab('plans')} className={`p-6 rounded-2xl border flex flex-col items-center justify-center gap-3 transition-all ${activeTab === 'plans' ? 'bg-red-600/10 border-red-600 text-red-500 shadow-[0_0_30px_rgba(220,38,38,0.15)]' : 'bg-[#111] border-gray-900 text-gray-400 hover:border-gray-600 hover:text-white'}`}>
            <FileText size={28} />
            <span className="text-[10px] font-black uppercase tracking-widest">Membership Plans</span>
          </button>
          <button onClick={() => setActiveTab('salary')} className={`p-6 rounded-2xl border flex flex-col items-center justify-center gap-3 transition-all ${activeTab === 'salary' ? 'bg-red-600/10 border-red-600 text-red-500 shadow-[0_0_30px_rgba(220,38,38,0.15)]' : 'bg-[#111] border-gray-900 text-gray-400 hover:border-gray-600 hover:text-white'}`}>
            <Users size={28} />
            <span className="text-[10px] font-black uppercase tracking-widest">Staff Salary</span>
          </button>
          <button onClick={() => setActiveTab('payments')} className={`p-6 rounded-2xl border flex flex-col items-center justify-center gap-3 transition-all ${activeTab === 'payments' ? 'bg-green-600/10 border-green-600 text-green-500 shadow-[0_0_30px_rgba(22,163,74,0.15)]' : 'bg-[#111] border-gray-900 text-gray-400 hover:border-gray-600 hover:text-white'}`}>
            <Banknote size={28} />
            <span className="text-[10px] font-black uppercase tracking-widest">Member Payment</span>
          </button>
          <button onClick={() => setActiveTab('shop')} className={`p-6 rounded-2xl border flex flex-col items-center justify-center gap-3 transition-all ${activeTab === 'shop' ? 'bg-blue-600/10 border-blue-600 text-blue-500 shadow-[0_0_30px_rgba(37,99,235,0.15)]' : 'bg-[#111] border-gray-900 text-gray-400 hover:border-gray-600 hover:text-white'}`}>
            <ShoppingBag size={28} />
            <span className="text-[10px] font-black uppercase tracking-widest">Shop Revenue</span>
          </button>
        </div>

        {/* Dynamic Content Section */}
        <div className="mt-8">
          {activeTab === 'plans' && (
            <section className="bg-[#111] border border-gray-900 rounded-3xl p-6 lg:p-8 shadow-xl animate-in fade-in slide-in-from-bottom-4">
              <div className="flex items-center gap-3 mb-6 border-b border-gray-900 pb-4">
                <FileText className="text-red-500" size={24} />
                <h2 className="text-2xl font-black uppercase italic tracking-wider">Membership Plans</h2>
              </div>
              
              <form onSubmit={handleAddPlan} className="mb-8 bg-black p-4 rounded-2xl border border-gray-800">
                <h3 className="text-[10px] font-black uppercase text-gray-500 mb-4 tracking-widest">Add New Plan</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <input type="text" placeholder="Plan Name" value={newPlan.name} onChange={(e) => setNewPlan({...newPlan, name: e.target.value})} className="bg-[#080808] border border-gray-800 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-red-600 transition-colors" />
                  <input type="number" placeholder="Price (LKR)" value={newPlan.price} onChange={(e) => setNewPlan({...newPlan, price: e.target.value})} className="bg-[#080808] border border-gray-800 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-red-600 transition-colors" />
                  <input type="text" placeholder="Duration (e.g. 1 Month)" value={newPlan.duration} onChange={(e) => setNewPlan({...newPlan, duration: e.target.value})} className="bg-[#080808] border border-gray-800 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-red-600 transition-colors" />
                </div>
                <button type="submit" className="w-full bg-red-600 hover:bg-red-700 text-white font-black uppercase text-xs tracking-widest py-3 rounded-xl transition-all flex items-center justify-center gap-2">
                  <Plus size={16} /> Add Plan
                </button>
              </form>

              <div className="space-y-4">
                {plans.map(plan => (
                  <div key={plan._id || plan.id} className="flex items-center justify-between bg-black p-4 rounded-2xl border border-gray-800 hover:border-gray-700 transition-colors">
                    <div>
                      <h4 className="font-bold text-lg">{plan.name}</h4>
                      <p className="text-gray-500 text-xs font-bold uppercase tracking-wider">{plan.duration} &bull; <span className="text-green-500">LKR {plan.price}</span></p>
                    </div>
                    <div className="flex gap-2">
                      <button type="button" className="p-3 bg-[#111] rounded-xl text-gray-500 hover:text-blue-500 hover:bg-blue-500/10 transition-colors">
                        <Edit2 size={18} />
                      </button>
                      <button type="button" onClick={() => handleDeletePlan(plan._id || plan.id)} className="p-3 bg-[#111] rounded-xl text-gray-500 hover:text-red-500 hover:bg-red-500/10 transition-colors">
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                ))}
                {plans.length === 0 && <p className="text-center text-gray-600 text-sm font-bold uppercase tracking-widest py-4">No plans available.</p>}
              </div>
            </section>
          )}

          {activeTab === 'payments' && (
            <section className="bg-[#111] border border-gray-900 rounded-3xl p-6 lg:p-8 shadow-xl animate-in fade-in slide-in-from-bottom-4">
              <div className="flex items-center gap-3 mb-6 border-b border-gray-900 pb-4">
                <Banknote className="text-green-500" size={24} />
                <h2 className="text-2xl font-black uppercase italic tracking-wider">Member Payments</h2>
              </div>

              <form onSubmit={handleAddPayment} className="mb-8 bg-black p-4 rounded-2xl border border-gray-800">
                <h3 className="text-[10px] font-black uppercase text-gray-500 mb-4 tracking-widest">Record Payment</h3>
                <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 mb-4">
                  <input type="text" placeholder="Member Name" value={newPayment.member} onChange={(e) => setNewPayment({...newPayment, member: e.target.value})} className="bg-[#080808] border border-gray-800 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-green-600 transition-colors" />
                  <select 
                    onChange={(e) => {
                      // Using string comparison since _id is usually a string in MongoDB
                      const selectedPlan = plans.find(p => String(p._id || p.id) === String(e.target.value));
                      if (selectedPlan) {
                        setNewPayment({ ...newPayment, amount: selectedPlan.price, duration: selectedPlan.duration });
                      }
                    }} 
                    className="bg-[#080808] border border-gray-800 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-green-600 transition-colors text-gray-400"
                    defaultValue=""
                  >
                    <option value="" disabled>Select Plan</option>
                    {plans.map(p => (
                      <option key={p._id || p.id} value={p._id || p.id}>{p.name} - LKR {p.price}</option>
                    ))}
                  </select>
                  <input type="number" placeholder="Amount (LKR)" value={newPayment.amount} onChange={(e) => setNewPayment({...newPayment, amount: e.target.value})} className="bg-[#080808] border border-gray-800 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-green-600 transition-colors" />
                  <div className="grid grid-cols-2 gap-4">
                    <input type="date" value={newPayment.date} onChange={(e) => setNewPayment({...newPayment, date: e.target.value})} className="bg-[#080808] border border-gray-800 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-green-600 transition-colors text-gray-400" />
                    <select value={newPayment.status} onChange={(e) => setNewPayment({...newPayment, status: e.target.value})} className="bg-[#080808] border border-gray-800 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-green-600 transition-colors text-gray-400">
                      <option value="Paid">Paid</option>
                      <option value="Pending">Pending</option>
                    </select>
                  </div>
                </div>
                <button type="submit" className="w-full bg-green-600 hover:bg-green-700 text-white font-black uppercase text-xs tracking-widest py-3 rounded-xl transition-all flex items-center justify-center gap-2">
                  <Plus size={16} /> Record Payment
                </button>
              </form>

              <div className="space-y-4">
                {payments.map(payment => {
                  const remainingDays = calculateRemainingDays(payment.date, payment.duration);
                  const isExpiringSoon = remainingDays > 0 && remainingDays <= 7;
                  const isExpired = remainingDays === 0;

                  return (
                   <div key={payment._id || payment.id} className="flex flex-col md:flex-row md:items-center justify-between bg-black p-5 rounded-2xl border border-gray-800 hover:border-gray-700 transition-colors gap-4">
                     <div>
                       <div className="flex items-center gap-3">
                         <h4 className="font-bold text-lg">{payment.member}</h4>
                         {isExpired ? (
                           <span className="px-2 py-0.5 rounded-full border bg-red-900/20 text-red-500 border-red-900/30 text-[9px] font-black uppercase tracking-widest">Expired</span>
                         ) : isExpiringSoon ? (
                           <span className="px-2 py-0.5 rounded-full border bg-orange-900/20 text-orange-500 border-orange-900/30 text-[9px] font-black uppercase tracking-widest">Expiring Soon</span>
                         ) : (
                           <span className="px-2 py-0.5 rounded-full border bg-blue-900/20 text-blue-500 border-blue-900/30 text-[9px] font-black uppercase tracking-widest">Active</span>
                         )}
                       </div>
                       
                       <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-gray-500 text-[10px] font-bold uppercase tracking-wider mt-2">
                         <span className="flex items-center gap-1"><Calendar size={12} className="text-gray-600"/> {payment.date}</span>
                         <span className="flex items-center gap-1"><FileText size={12} className="text-gray-600"/> {payment.duration || 'N/A'}</span>
                         <span className={`px-2 py-0.5 rounded-full border ${payment.status === 'Paid' ? 'bg-green-900/20 text-green-500 border-green-900/30' : 'bg-yellow-900/20 text-yellow-500 border-yellow-900/30'}`}>
                           {payment.status}
                         </span>
                       </div>
                     </div>

                     <div className="flex items-center justify-between md:justify-end gap-6 w-full md:w-auto mt-2 md:mt-0 pt-4 md:pt-0 border-t border-gray-800 md:border-t-0">
                       <div className="flex flex-col items-start md:items-end">
                         <span className="text-[9px] font-black uppercase tracking-widest text-gray-600 mb-1">Time Remaining</span>
                         <span className={`font-black text-2xl tracking-tighter italic ${isExpired ? 'text-red-500' : isExpiringSoon ? 'text-orange-500' : 'text-blue-500'}`}>
                           {remainingDays} <span className="text-[10px] uppercase font-bold tracking-widest not-italic">Days</span>
                         </span>
                       </div>
                       <div className="flex flex-col items-end pl-6 ml-2 border-l border-gray-800">
                         <span className="text-[9px] font-black uppercase tracking-widest text-gray-600 mb-1">Amount</span>
                         <span className="text-green-500 font-bold block text-lg">LKR {payment.amount}</span>
                       </div>
                       <button onClick={() => handleDeletePayment(payment._id || payment.id)} className="p-3 bg-[#111] rounded-xl text-gray-500 hover:text-red-500 hover:bg-red-500/10 transition-colors ml-4">
                         <Trash2 size={18} />
                       </button>
                     </div>
                   </div>
                  );
                })}
                {payments.length === 0 && <p className="text-center text-gray-600 text-sm font-bold uppercase tracking-widest py-4">No payments recorded.</p>}
              </div>
            </section>
          )}

          {activeTab === 'salary' && (
            <section className="bg-[#111] border border-gray-900 rounded-3xl p-6 lg:p-8 shadow-xl animate-in fade-in slide-in-from-bottom-4">
              <div className="flex items-center justify-between mb-6 border-b border-gray-900 pb-4">
                <div className="flex items-center gap-3">
                  <Users className="text-blue-500" size={24} />
                  <h2 className="text-2xl font-black uppercase italic tracking-wider">Staff Payroll</h2>
                </div>
                <button className="bg-blue-600 hover:bg-blue-700 text-white font-black uppercase text-[10px] tracking-widest px-6 py-2 rounded-xl transition-all flex items-center gap-2">
                  <Plus size={14} /> Process Payroll
                </button>
              </div>

              <div className="space-y-4">
                {[
                  { id: 1, name: 'Mike Johnson', role: 'Head Trainer', salary: 85000, status: 'Paid', date: '2023-11-01' },
                  { id: 2, name: 'Sarah Lee', role: 'Yoga Instructor', salary: 60000, status: 'Pending', date: '2023-11-01' },
                  { id: 3, name: 'Tom Hardy', role: 'Cleaner', salary: 35000, status: 'Paid', date: '2023-11-01' },
                ].map(staff => (
                  <div key={staff.id} className="flex flex-col md:flex-row md:items-center justify-between bg-black p-5 rounded-2xl border border-gray-800 hover:border-gray-700 transition-colors gap-4">
                     <div>
                       <div className="flex items-center gap-3">
                         <h4 className="font-bold text-lg">{staff.name}</h4>
                         <span className={`px-2 py-0.5 rounded-full border text-[9px] font-black uppercase tracking-widest ${staff.status === 'Paid' ? 'bg-blue-900/20 text-blue-500 border-blue-900/30' : 'bg-yellow-900/20 text-yellow-500 border-yellow-900/30'}`}>
                           {staff.status}
                         </span>
                       </div>
                       <p className="text-gray-500 text-[10px] font-bold uppercase tracking-wider mt-1">{staff.role}</p>
                     </div>

                     <div className="flex items-center justify-between md:justify-end gap-6 w-full md:w-auto mt-2 md:mt-0 pt-4 md:pt-0 border-t border-gray-800 md:border-t-0">
                       <div className="flex flex-col items-start md:items-end">
                         <span className="text-[9px] font-black uppercase tracking-widest text-gray-600 mb-1">Due Date</span>
                         <span className="font-bold text-gray-400 block text-sm flex items-center gap-1"><Calendar size={12}/> {staff.date}</span>
                       </div>
                       <div className="flex flex-col items-end pl-6 ml-2 border-l border-gray-800">
                         <span className="text-[9px] font-black uppercase tracking-widest text-gray-600 mb-1">Total Salary</span>
                         <span className="text-blue-500 font-bold block text-lg">LKR {staff.salary.toLocaleString()}</span>
                       </div>
                       {staff.status === 'Pending' && (
                         <button className="bg-blue-600/20 hover:bg-blue-600 text-blue-500 hover:text-white font-black uppercase text-[10px] tracking-widest px-4 py-2 rounded-xl transition-all ml-4">
                           Pay Now
                         </button>
                       )}
                     </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {activeTab === 'shop' && (
            <section className="bg-[#111] border border-gray-900 rounded-3xl p-6 lg:p-8 shadow-xl animate-in fade-in slide-in-from-bottom-4">
              <div className="flex items-center justify-between mb-6 border-b border-gray-900 pb-4">
                <div className="flex items-center gap-3">
                  <ShoppingBag className="text-purple-500" size={24} />
                  <h2 className="text-2xl font-black uppercase italic tracking-wider">Shop & Supplement Revenue</h2>
                </div>
                <div className="text-right">
                   <p className="text-[10px] font-black uppercase tracking-widest text-gray-500">Total Revenue</p>
                   <p className="text-2xl font-black italic tracking-tighter text-purple-500">LKR 125,000</p>
                </div>
              </div>

              <div className="space-y-4">
                {[
                  { id: 1, item: 'Whey Protein 5lbs', category: 'Supplement', amount: 25000, date: '2023-11-20', customer: 'John Doe' },
                  { id: 2, item: 'Creatine Monohydrate', category: 'Supplement', amount: 8000, date: '2023-11-19', customer: 'Jane Smith' },
                  { id: 3, item: 'Gym Gloves Pro', category: 'Gear', amount: 4500, date: '2023-11-18', customer: 'Guest' },
                  { id: 4, item: 'BCAA Energy Drink', category: 'Beverage', amount: 800, date: '2023-11-18', customer: 'Mike Johnson' },
                ].map(sale => (
                  <div key={sale.id} className="flex flex-col md:flex-row md:items-center justify-between bg-black p-5 rounded-2xl border border-gray-800 hover:border-gray-700 transition-colors gap-4">
                     <div>
                       <div className="flex items-center gap-3">
                         <h4 className="font-bold text-lg">{sale.item}</h4>
                         <span className="px-2 py-0.5 rounded-full border bg-purple-900/20 text-purple-500 border-purple-900/30 text-[9px] font-black uppercase tracking-widest">
                           {sale.category}
                         </span>
                       </div>
                       <p className="text-gray-500 text-[10px] font-bold uppercase tracking-wider mt-1">Purchased by: <span className="text-gray-300">{sale.customer}</span></p>
                     </div>

                     <div className="flex items-center justify-between md:justify-end gap-6 w-full md:w-auto mt-2 md:mt-0 pt-4 md:pt-0 border-t border-gray-800 md:border-t-0">
                       <div className="flex flex-col items-start md:items-end">
                         <span className="text-[9px] font-black uppercase tracking-widest text-gray-600 mb-1">Date</span>
                         <span className="font-bold text-gray-400 block text-sm flex items-center gap-1"><Calendar size={12}/> {sale.date}</span>
                       </div>
                       <div className="flex flex-col items-end pl-6 ml-2 border-l border-gray-800">
                         <span className="text-[9px] font-black uppercase tracking-widest text-gray-600 mb-1">Amount</span>
                         <span className="text-purple-500 font-bold block text-lg">+ LKR {sale.amount.toLocaleString()}</span>
                       </div>
                     </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {activeTab === 'dashboard' && (
             <div className="flex flex-col items-center justify-center p-12 opacity-50 my-10 border-2 border-dashed border-gray-900 rounded-3xl">
               <span className="text-gray-500 text-xs font-black uppercase tracking-[0.2em]">Select a module above to view details</span>
             </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Finances;
