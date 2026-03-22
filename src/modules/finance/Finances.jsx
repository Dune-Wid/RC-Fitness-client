import { useState } from 'react';
import Sidebar from '../../components/Sidebar';
import { CreditCard, DollarSign, Plus, Trash2, Calendar, FileText } from 'lucide-react';

const Finances = () => {
  const [plans, setPlans] = useState([
    { id: 1, name: 'Basic Plan', price: 3000, duration: '1 Month' },
    { id: 2, name: 'Pro Plan', price: 8000, duration: '3 Months' },
  ]);
  const [payments, setPayments] = useState([
    { id: 1, member: 'John Doe', amount: 3000, date: '2023-10-01', status: 'Paid' },
    { id: 2, member: 'Jane Smith', amount: 8000, date: '2023-10-05', status: 'Paid' },
  ]);

  const [newPlan, setNewPlan] = useState({ name: '', price: '', duration: '' });
  const [newPayment, setNewPayment] = useState({ member: '', amount: '', date: '', status: 'Paid' });

  const handleAddPlan = (e) => {
    e.preventDefault();
    if (!newPlan.name || !newPlan.price || !newPlan.duration) return;
    setPlans([...plans, { ...newPlan, id: Date.now(), price: Number(newPlan.price) }]);
    setNewPlan({ name: '', price: '', duration: '' });
  };

  const handleDeletePlan = (id) => {
    setPlans(plans.filter(p => p.id !== id));
  };

  const handleAddPayment = (e) => {
    e.preventDefault();
    if (!newPayment.member || !newPayment.amount || !newPayment.date) return;
    setPayments([...payments, { ...newPayment, id: Date.now(), amount: Number(newPayment.amount) }]);
    setNewPayment({ member: '', amount: '', date: '', status: 'Paid' });
  };

  const handleDeletePayment = (id) => {
    setPayments(payments.filter(p => p.id !== id));
  };

  return (
    <div className="flex bg-[#080808] min-h-screen text-white font-sans">
      <Sidebar />
      <main className="flex-1 p-6 lg:p-12 lg:ml-64 pt-24 lg:pt-12">
        <header className="mb-10 text-center lg:text-left">
          <h1 className="text-4xl font-black uppercase tracking-tighter italic leading-none flex items-center justify-center lg:justify-start gap-4">
            <CreditCard className="text-red-600" size={36} /> Financial Management
          </h1>
          <p className="text-gray-500 text-[10px] font-bold uppercase tracking-[0.3em] mt-2">Member 2: Plans &amp; Payments</p>
        </header>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-12">
          {/* MEMBERSHIP PLANS SECTION */}
          <section className="bg-[#111] border border-gray-900 rounded-3xl p-6 lg:p-8 shadow-xl">
            <div className="flex items-center gap-3 mb-6 border-b border-gray-900 pb-4">
              <FileText className="text-red-500" size={24} />
              <h2 className="text-2xl font-black uppercase italic tracking-wider">Membership Plans</h2>
            </div>
            
            {/* Add Plan Form */}
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

            {/* Plans List */}
            <div className="space-y-4">
              {plans.map(plan => (
                <div key={plan.id} className="flex items-center justify-between bg-black p-4 rounded-2xl border border-gray-800 hover:border-gray-700 transition-colors">
                  <div>
                    <h4 className="font-bold text-lg">{plan.name}</h4>
                    <p className="text-gray-500 text-xs font-bold uppercase tracking-wider">{plan.duration} &bull; <span className="text-green-500">LKR {plan.price}</span></p>
                  </div>
                  <button onClick={() => handleDeletePlan(plan.id)} className="p-3 bg-[#111] rounded-xl text-gray-500 hover:text-red-500 hover:bg-red-500/10 transition-colors">
                    <Trash2 size={18} />
                  </button>
                </div>
              ))}
              {plans.length === 0 && <p className="text-center text-gray-600 text-sm font-bold uppercase tracking-widest py-4">No plans available.</p>}
            </div>
          </section>

          {/* PAYMENTS SECTION */}
          <section className="bg-[#111] border border-gray-900 rounded-3xl p-6 lg:p-8 shadow-xl">
            <div className="flex items-center gap-3 mb-6 border-b border-gray-900 pb-4">
              <DollarSign className="text-green-500" size={24} />
              <h2 className="text-2xl font-black uppercase italic tracking-wider">Payments</h2>
            </div>

            {/* Add Payment Form */}
            <form onSubmit={handleAddPayment} className="mb-8 bg-black p-4 rounded-2xl border border-gray-800">
              <h3 className="text-[10px] font-black uppercase text-gray-500 mb-4 tracking-widest">Record Payment</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <input type="text" placeholder="Member Name" value={newPayment.member} onChange={(e) => setNewPayment({...newPayment, member: e.target.value})} className="bg-[#080808] border border-gray-800 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-green-600 transition-colors" />
                <input type="number" placeholder="Amount (LKR)" value={newPayment.amount} onChange={(e) => setNewPayment({...newPayment, amount: e.target.value})} className="bg-[#080808] border border-gray-800 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-green-600 transition-colors" />
                <input type="date" value={newPayment.date} onChange={(e) => setNewPayment({...newPayment, date: e.target.value})} className="bg-[#080808] border border-gray-800 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-green-600 transition-colors text-gray-400" />
                <select value={newPayment.status} onChange={(e) => setNewPayment({...newPayment, status: e.target.value})} className="bg-[#080808] border border-gray-800 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-green-600 transition-colors text-gray-400">
                  <option value="Paid">Paid</option>
                  <option value="Pending">Pending</option>
                </select>
              </div>
              <button type="submit" className="w-full bg-green-600 hover:bg-green-700 text-white font-black uppercase text-xs tracking-widest py-3 rounded-xl transition-all flex items-center justify-center gap-2">
                <Plus size={16} /> Record Payment
              </button>
            </form>

            {/* Payments List */}
            <div className="space-y-4">
              {payments.map(payment => (
                 <div key={payment.id} className="flex items-center justify-between bg-black p-4 rounded-2xl border border-gray-800 hover:border-gray-700 transition-colors">
                 <div>
                   <h4 className="font-bold text-lg">{payment.member}</h4>
                   <div className="flex items-center gap-2 text-gray-500 text-[10px] font-bold uppercase tracking-wider mt-1">
                     <Calendar size={10} /> {payment.date}
                     <span className={`px-2 py-0.5 rounded-full ml-2 border ${payment.status === 'Paid' ? 'bg-green-900/20 text-green-500 border-green-900/30' : 'bg-yellow-900/20 text-yellow-500 border-yellow-900/30'}`}>
                       {payment.status}
                     </span>
                   </div>
                 </div>
                 <div className="flex items-center gap-4">
                   <div className="text-right">
                     <span className="text-green-500 font-bold block">LKR {payment.amount}</span>
                   </div>
                   <button onClick={() => handleDeletePayment(payment.id)} className="p-3 bg-[#111] rounded-xl text-gray-500 hover:text-red-500 hover:bg-red-500/10 transition-colors">
                     <Trash2 size={18} />
                   </button>
                 </div>
               </div>
              ))}
              {payments.length === 0 && <p className="text-center text-gray-600 text-sm font-bold uppercase tracking-widest py-4">No payments recorded.</p>}
            </div>
          </section>
        </div>
      </main>
    </div>
  );
};

export default Finances;
