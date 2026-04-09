import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { ArrowLeft, CreditCard, Truck, ShieldCheck, Dumbbell, ReceiptText } from 'lucide-react';
import axios from 'axios';

const PublicCheckout = () => {
    const { cart, cartTotal, clearCart } = useCart();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    
    // Form States
    const [formData, setFormData] = useState({
        firstName: '', lastName: '', company: '', 
        address: '', apartment: '', city: '', 
        zip: '', phone: '', email: '', 
        orderNotes: '', createAccount: false, shipDifferent: false,
        agreeTerms: false
    });
    const [paymentMethod, setPaymentMethod] = useState('Card');

    // Cost Breakdown
    const shipmentRate = 580;
    const handlingFee = 428.45;
    const finalTotal = cartTotal + shipmentRate + handlingFee;

    useEffect(() => {
        if (cart.length === 0) {
            // navigate('/store'); // Optional: redirect if empty
        }
    }, [cart, navigate]);

    const handlePlaceOrder = async (e) => {
        e.preventDefault();
        if (!formData.agreeTerms) {
            alert("Please agree to the terms and conditions.");
            return;
        }
        
        setLoading(true);
        try {
            const payload = {
                userEmail: formData.email,
                userName: `${formData.firstName} ${formData.lastName}`,
                products: cart.map(item => ({
                    productId: item._id,
                    name: item.name,
                    quantity: item.quantity,
                    price: item.price
                })),
                totalAmount: finalTotal,
                paymentMethod: paymentMethod,
                billingDetails: formData
            };

            await axios.post('https://rc-fitness-backend.vercel.app/api/shop/checkout', payload);
            alert("Order Placed Successfully!");
            clearCart();
            navigate('/store');
        } catch (err) {
            console.error(err);
            alert("Checkout Failed. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    if (cart.length === 0) {
        return (
            <div className="min-h-screen bg-[#080808] text-white flex flex-col items-center justify-center p-6">
                <ReceiptText size={64} className="text-gray-800 mb-6" />
                <h2 className="text-3xl font-black uppercase italic mb-4">Your Cart is Empty</h2>
                <Link to="/store" className="bg-purple-600 px-8 py-4 rounded-xl font-bold uppercase tracking-widest text-xs">Back to Store</Link>
            </div>
        );
    }

    return (
        <div className="bg-[#080808] min-h-screen text-white font-sans selection:bg-purple-600 pb-20">
            {/* Header */}
            <nav className="bg-[#0a0a0a] border-b border-white/5 sticky top-0 z-50 h-20 flex items-center">
                <div className="max-w-7xl mx-auto px-6 w-full flex justify-between items-center">
                    <Link to="/" className="flex items-center gap-2">
                        <div className="bg-red-600 p-1.5 rounded-sm"><Dumbbell className="text-white" size={20} /></div>
                        <span className="font-black text-xl tracking-tighter uppercase italic">RC Fitness</span>
                    </Link>
                    <Link to="/store" className="text-[10px] font-bold uppercase tracking-widest text-gray-500 hover:text-white flex items-center gap-2">
                        <ArrowLeft size={14} /> Continue Shopping
                    </Link>
                </div>
            </nav>

            <main className="max-w-7xl mx-auto px-6 pt-12">
                <form onSubmit={handlePlaceOrder} className="flex flex-col lg:flex-row gap-12">
                    
                    {/* LEFT: Billing Details */}
                    <div className="flex-1 space-y-10">
                        <section>
                            <h2 className="text-2xl font-black uppercase italic tracking-tight mb-8 border-l-4 border-purple-600 pl-4">Billing Details</h2>
                            <div className="grid grid-cols-2 gap-6">
                                <InputGroup label="First Name *" val={formData.firstName} fn={(v) => setFormData({...formData, firstName: v})} required />
                                <InputGroup label="Last Name *" val={formData.lastName} fn={(v) => setFormData({...formData, lastName: v})} required />
                            </div>
                            <div className="mt-6">
                                <InputGroup label="Company Name (Optional)" val={formData.company} fn={(v) => setFormData({...formData, company: v})} />
                            </div>
                            <div className="mt-6">
                                <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 mb-2 block">Country / Region *</label>
                                <div className="bg-white/5 border border-white/10 p-4 rounded-xl text-sm font-bold">Sri Lanka</div>
                            </div>
                            <div className="mt-6 space-y-4">
                                <InputGroup label="Street Address *" placeholder="House number and street name" val={formData.address} fn={(v) => setFormData({...formData, address: v})} required />
                                <InputGroup placeholder="Apartment, suite, unit, etc. (optional)" val={formData.apartment} fn={(v) => setFormData({...formData, apartment: v})} />
                            </div>
                            <div className="grid grid-cols-2 gap-6 mt-6">
                                <InputGroup label="Town / City *" val={formData.city} fn={(v) => setFormData({...formData, city: v})} required />
                                <InputGroup label="Postcode / ZIP *" val={formData.zip} fn={(v) => setFormData({...formData, zip: v})} required />
                            </div>
                            <div className="grid grid-cols-2 gap-6 mt-6">
                                <InputGroup label="Phone *" val={formData.phone} type="tel" fn={(v) => setFormData({...formData, phone: v})} required />
                                <InputGroup label="Email Address *" val={formData.email} type="email" fn={(v) => setFormData({...formData, email: v})} required />
                            </div>

                            <div className="mt-10 space-y-4">
                                <div className="flex items-center gap-3">
                                    <input type="checkbox" id="createAcc" checked={formData.createAccount} onChange={e => setFormData({...formData, createAccount: e.target.checked})} className="w-4 h-4 accent-purple-600" />
                                    <label htmlFor="createAcc" className="text-xs font-bold text-gray-400 cursor-pointer">Create an account?</label>
                                </div>
                                <div className="flex items-center gap-3">
                                    <input type="checkbox" id="shipDiff" checked={formData.shipDifferent} onChange={e => setFormData({...formData, shipDifferent: e.target.checked})} className="w-4 h-4 accent-purple-600" />
                                    <label htmlFor="shipDiff" className="text-xs font-bold text-gray-400 cursor-pointer">Ship to a different address?</label>
                                </div>
                            </div>
                        </section>

                        <section>
                            <h3 className="text-xs font-black uppercase tracking-widest text-gray-500 mb-4">Order Notes (Optional)</h3>
                            <textarea 
                                className="w-full bg-white/5 border border-white/10 rounded-2xl p-6 text-sm outline-none focus:border-purple-600 transition-colors h-32"
                                placeholder="Notes about your order, e.g. special notes for delivery."
                                value={formData.orderNotes}
                                onChange={e => setFormData({...formData, orderNotes: e.target.value})}
                            ></textarea>
                        </section>
                    </div>

                    {/* RIGHT: Order Summary */}
                    <div className="w-full lg:w-[450px]">
                        <div className="bg-[#111] border border-white/5 rounded-[2.5rem] p-8 lg:p-10 sticky top-32 shadow-2xl overflow-hidden">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-purple-600/10 blur-3xl rounded-full"></div>
                            
                            <h2 className="text-2xl font-black uppercase italic mb-8 relative">Your Order</h2>
                            
                            <div className="space-y-6 mb-8 border-b border-white/5 pb-8 relative">
                                <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-gray-500">
                                    <span>Product</span>
                                    <span>Subtotal</span>
                                </div>
                                {cart.map(item => (
                                    <div key={item._id} className="flex justify-between gap-4">
                                        <div className="flex gap-4">
                                            <div className="w-12 h-12 bg-black rounded-lg border border-white/5 flex-shrink-0 flex items-center justify-center p-1">
                                                <img src={item.image || item.images?.[0]} alt="" className="w-full h-full object-contain" />
                                            </div>
                                            <div>
                                                <p className="text-xs font-bold leading-tight">{item.name}</p>
                                                <p className="text-[10px] text-gray-500 mt-1 font-black tabular-nums">× {item.quantity}</p>
                                            </div>
                                        </div>
                                        <span className="text-sm font-black italic">Rs.{(item.price * item.quantity).toLocaleString()}</span>
                                    </div>
                                ))}
                            </div>

                            <div className="space-y-4 mb-8">
                                <div className="flex justify-between text-xs font-bold">
                                    <span className="text-gray-500">Subtotal</span>
                                    <span className="text-red-500">Rs.{cartTotal.toLocaleString()}.00</span>
                                </div>
                                <div className="flex justify-between text-xs font-bold">
                                    <span className="text-gray-500">Shipment (Fast Delivery)</span>
                                    <span className="text-red-500">Rs.{shipmentRate}.00</span>
                                </div>
                                <div className="flex justify-between text-xs font-bold border-b border-white/5 pb-4">
                                    <span className="text-gray-500">Handling Fee</span>
                                    <span className="text-red-500">Rs.{handlingFee.toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between text-xl font-black italic pt-2">
                                    <span>Total</span>
                                    <span className="text-red-500">Rs.{finalTotal.toLocaleString()}</span>
                                </div>
                            </div>

                            {/* Payment Methods */}
                            <div className="space-y-4 mb-10">
                                <PaymentOption 
                                    id="genie" label="Visa / Master / Amex (Powered by genie)" 
                                    active={paymentMethod === 'Card'} 
                                    onClick={() => setPaymentMethod('Card')}
                                />
                                <PaymentOption 
                                    id="koko" label="Pay installments with KOKO" 
                                    active={paymentMethod === 'Koko'} 
                                    onClick={() => setPaymentMethod('Koko')}
                                />
                                <PaymentOption 
                                    id="bank" label="Direct Bank Transfer" 
                                    active={paymentMethod === 'Bank'} 
                                    onClick={() => setPaymentMethod('Bank')}
                                />
                                <PaymentOption 
                                    id="cod" label="Cash on Delivery" 
                                    active={paymentMethod === 'COD'} 
                                    onClick={() => setPaymentMethod('COD')}
                                />
                            </div>

                            <div className="space-y-6">
                                <p className="text-[10px] text-gray-500 leading-relaxed font-medium">
                                    Your personal data will be used to process your order, support your experience throughout this website, and for other purposes described in our <span className="text-purple-400 underline cursor-pointer">privacy policy</span>.
                                </p>
                                
                                <div className="flex items-start gap-3">
                                    <input type="checkbox" id="terms" checked={formData.agreeTerms} onChange={e => setFormData({...formData, agreeTerms: e.target.checked})} className="mt-1 w-4 h-4 accent-purple-600" required />
                                    <label htmlFor="terms" className="text-[10px] font-bold text-gray-400 uppercase tracking-wider cursor-pointer">
                                        I have read and agree to the website <span className="text-purple-400 underline">terms and conditions</span> *
                                    </label>
                                </div>

                                <button 
                                    type="submit"
                                    disabled={loading}
                                    className="w-full bg-orange-600 hover:bg-orange-700 text-white py-5 rounded-2xl font-black uppercase tracking-[0.2em] text-sm shadow-xl shadow-orange-950/20 transition-all hover:-translate-y-1 active:scale-95 disabled:opacity-50"
                                >
                                    {loading ? 'Processing...' : 'Proceed to Payment'}
                                </button>
                            </div>

                            <div className="mt-8 grid grid-cols-2 gap-4">
                                <div className="flex items-center gap-2 text-[8px] font-black uppercase text-gray-500 border border-white/5 bg-black/40 p-2 rounded-lg">
                                    <Truck size={12} className="text-purple-500" /> Fast Delivery
                                </div>
                                <div className="flex items-center gap-2 text-[8px] font-black uppercase text-gray-500 border border-white/5 bg-black/40 p-2 rounded-lg">
                                    <ShieldCheck size={12} className="text-purple-500" /> Secure SSL
                                </div>
                            </div>
                        </div>
                    </div>
                </form>
            </main>
        </div>
    );
};

const InputGroup = ({ label, val, fn, type = "text", placeholder = "", required = false }) => (
    <div className="flex flex-col gap-2 w-full">
        {label && <label className="text-[10px] uppercase font-black tracking-widest text-gray-500 ml-1">{label}</label>}
        <input 
            type={type} 
            required={required} 
            value={val} 
            placeholder={placeholder}
            onChange={(e) => fn(e.target.value)}
            className="w-full bg-white/[0.03] border border-white/10 p-4 rounded-xl text-sm outline-none focus:border-purple-600 transition-all text-white placeholder:text-gray-700" 
        />
    </div>
);

const PaymentOption = ({ label, active, onClick }) => (
    <label onClick={onClick} className={`flex items-center gap-4 p-4 rounded-2xl border transition-all cursor-pointer ${active ? 'bg-white/5 border-purple-600/50' : 'bg-transparent border-white/5 hover:border-white/10'}`}>
        <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${active ? 'border-purple-500' : 'border-gray-700'}`}>
            {active && <div className="w-2 h-2 rounded-full bg-purple-500" />}
        </div>
        <span className={`text-[11px] font-bold uppercase tracking-wide ${active ? 'text-white' : 'text-gray-500'}`}>{label}</span>
        {active && label.includes('genie') && <CreditCard size={14} className="ml-auto text-gray-600" />}
    </label>
);

export default PublicCheckout;
