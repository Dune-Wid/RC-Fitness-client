import { useState } from 'react';
import { X, Plus, Minus, ShoppingBag, ArrowRight, CheckCircle, Tag, CreditCard, Banknote } from 'lucide-react';
import { useCart } from '../context/CartContext';
import axios from 'axios';

const CartSidebar = () => {
  const { cartItems, isCartOpen, setIsCartOpen, updateQuantity, removeFromCart, clearCart } = useCart();
  const [isCheckout, setIsCheckout] = useState(false);
  const [orderComplete, setOrderComplete] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', address: '', paymentMethod: 'Cash' });
  const [promoCode, setPromoCode] = useState('');
  const [appliedPromo, setAppliedPromo] = useState(null);
  const [promoError, setPromoError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isCartOpen) return null;

  const totalAmount = cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);

  const discountAmount = appliedPromo ? (totalAmount * (appliedPromo.discount / 100)) : 0;
  const finalAmount = totalAmount - discountAmount;

  const handleApplyPromo = async () => {
    if (!promoCode) return;
    try {
      const res = await axios.post('http://localhost:5000/api/shop/promotions/validate', { code: promoCode });
      setAppliedPromo(res.data);
      setPromoError('');
    } catch (err) {
      setPromoError('Invalid or expired code');
      setAppliedPromo(null);
    }
  };

  const handleCheckoutSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    const orderData = {
      userName: formData.name,
      userEmail: formData.email,
      products: cartItems.map(item => ({
        productId: item._id,
        name: item.name,
        price: item.price,
        quantity: item.quantity
      })),
      totalAmount: finalAmount,
      promoCode: appliedPromo ? appliedPromo.code : '',
      discountAmount,
      paymentMethod: formData.paymentMethod,
      billingDetails: {
        phone: formData.phone,
        address: formData.address
      }
    };

    try {
      const res = await axios.post('http://localhost:5000/api/shop/checkout', orderData);
      
      if (formData.paymentMethod === 'Card' && res.data.payhereHash) {
          const { order, payhereHash, merchantId } = res.data;
          
          const form = document.createElement('form');
          form.method = 'POST';
          form.action = 'https://sandbox.payhere.lk/pay/checkout';
          
          const params = {
              merchant_id: merchantId,
              return_url: window.location.href, 
              cancel_url: window.location.href,
              notify_url: 'http://localhost:5000/api/shop/payhere/notify',
              first_name: formData.name.split(' ')[0],
              last_name: formData.name.split(' ').slice(1).join(' ') || formData.name,
              email: formData.email,
              phone: formData.phone || '0000000000',
              address: formData.address,
              city: 'Colombo',
              country: 'Sri Lanka',
              order_id: order._id,
              items: 'RC Fitness Order',
              currency: 'LKR',
              amount: finalAmount.toFixed(2),
              hash: payhereHash
          };

          for (const key in params) {
              const hiddenField = document.createElement('input');
              hiddenField.type = 'hidden';
              hiddenField.name = key;
              hiddenField.value = params[key];
              form.appendChild(hiddenField);
          }

          document.body.appendChild(form);
          form.submit();
      } else {
          setOrderComplete(true);
          clearCart();
      }
    } catch (err) {
      console.error("Checkout failed:", err);
      alert("Something went wrong during checkout. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const closeSidebar = () => {
    setIsCartOpen(false);
    setTimeout(() => {
      setIsCheckout(false);
      setOrderComplete(false);
      setFormData({ name: '', email: '', phone: '', address: '', paymentMethod: 'Cash' });
      setAppliedPromo(null);
      setPromoCode('');
    }, 500);
  };

  return (
    <>
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60]" onClick={closeSidebar}></div>
      <div className="fixed top-0 right-0 h-full w-full max-w-md bg-[#111] border-l border-gray-800 z-[70] shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
        
        <div className="flex justify-between items-center p-6 border-b border-gray-900 bg-[#0a0a0a]">
          <h2 className="text-xl font-black uppercase italic tracking-tighter flex items-center gap-3 text-white">
            <ShoppingBag className="text-purple-500" /> Your Cart
          </h2>
          <button onClick={closeSidebar} className="text-gray-500 hover:text-white transition-colors">
            <X size={24} />
          </button>
        </div>

        {orderComplete ? (
          <div className="flex-1 flex flex-col items-center justify-center p-8 text-center bg-black">
            <CheckCircle size={64} className="text-green-500 mb-6 animate-bounce" />
            <h3 className="text-2xl font-black uppercase tracking-tight text-white mb-2">Order Confirmed!</h3>
            <p className="text-gray-400 text-sm mb-8">Thank you, {formData.name}. Your order has been placed. Please pay at the front-desk upon pickup.</p>
            <button onClick={closeSidebar} className="w-full bg-purple-600 hover:bg-purple-700 text-white py-4 rounded-xl font-black uppercase tracking-widest text-xs transition-all">
              Continue Shopping
            </button>
          </div>
        ) : isCheckout ? (
          <div className="flex-1 overflow-y-auto p-6 bg-black flex flex-col">
            <h3 className="text-sm font-bold uppercase tracking-widest text-gray-500 mb-6">Contact Details</h3>
            <form id="checkout-form" onSubmit={handleCheckoutSubmit} className="space-y-4 flex-1">
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-2">Full Name</label>
                <input type="text" required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full bg-[#111] border border-gray-800 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-purple-600 transition-colors text-white" placeholder="John Doe" />
              </div>
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-2">Email Address</label>
                <input type="email" required value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className="w-full bg-[#111] border border-gray-800 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-purple-600 transition-colors text-white" placeholder="john@example.com" />
              </div>
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-2">Delivery Address</label>
                <textarea required value={formData.address} onChange={e => setFormData({...formData, address: e.target.value})} className="w-full bg-[#111] border border-gray-800 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-purple-600 transition-colors text-white h-20 resize-none" placeholder="Enter your full address..." />
              </div>
              
              <div className="pt-4">
                <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-4">Payment Method</label>
                <div className="grid grid-cols-2 gap-4">
                  <button 
                    type="button" 
                    onClick={() => setFormData({...formData, paymentMethod: 'Cash'})}
                    className={`p-4 rounded-xl border flex flex-col items-center gap-2 transition-all ${formData.paymentMethod === 'Cash' ? 'bg-purple-600/10 border-purple-600 text-purple-400' : 'bg-[#111] border-gray-800 text-gray-500'}`}
                  >
                    <Banknote size={20} />
                    <span className="text-[10px] font-bold uppercase">Cash on Pickup</span>
                  </button>
                  <button 
                    type="button" 
                    onClick={() => setFormData({...formData, paymentMethod: 'Card'})}
                    className={`p-4 rounded-xl border flex flex-col items-center gap-2 transition-all ${formData.paymentMethod === 'Card' ? 'bg-purple-600/10 border-purple-600 text-purple-400' : 'bg-[#111] border-gray-800 text-gray-500'}`}
                  >
                    <CreditCard size={20} />
                    <span className="text-[10px] font-bold uppercase">Card Payment</span>
                  </button>
                </div>
              </div>

              <div className="pt-4">
                <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-2">Promo Code</label>
                <div className="flex gap-2">
                  <input type="text" value={promoCode} onChange={e => setPromoCode(e.target.value)} className="flex-1 bg-[#111] border border-gray-800 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-purple-600 transition-colors text-white uppercase tracking-widest" placeholder="ENTER CODE" />
                  <button type="button" onClick={handleApplyPromo} className="px-6 bg-gray-800 hover:bg-gray-700 text-white rounded-xl text-[10px] font-black uppercase tracking-widest transition-all">Apply</button>
                </div>
                {promoError && <p className="text-red-500 text-[10px] mt-2 font-bold uppercase tracking-widest">{promoError}</p>}
                {appliedPromo && <p className="text-green-500 text-[10px] mt-2 font-bold uppercase tracking-widest">Applied: {appliedPromo.discount}% OFF!</p>}
              </div>
            </form>
          </div>
        ) : (
          <div className="flex-1 overflow-y-auto p-6 bg-black">
            {cartItems.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center opacity-50">
                <ShoppingBag size={48} className="text-gray-600 mb-4" />
                <p className="text-gray-400 font-bold uppercase tracking-widest text-sm">Your cart is empty</p>
              </div>
            ) : (
              <div className="space-y-6">
                {cartItems.map((item) => (
                  <div key={item._id} className="flex gap-4 border border-gray-900 rounded-2xl p-4 bg-[#111]">
                    <div className="w-20 h-20 bg-black rounded-xl overflow-hidden flex items-center justify-center shrink-0">
                      {item.images && item.images[0] ? (
                        <img src={item.images[0]} alt={item.name} className="w-full h-full object-contain p-2" />
                      ) : (
                        <ShoppingBag className="text-gray-800" />
                      )}
                    </div>
                    <div className="flex-1 flex flex-col justify-center">
                      <p className="text-[9px] font-bold uppercase tracking-widest text-gray-500 mb-1">{item.category}</p>
                      <h4 className="text-sm font-black uppercase text-white line-clamp-1">{item.name}</h4>
                      <p className="text-purple-400 font-bold text-sm mt-1">LKR {(item.price * item.quantity).toLocaleString()}</p>
                      <div className="flex items-center gap-4 mt-3">
                        <div className="flex items-center gap-2 bg-black border border-gray-800 rounded-lg p-1">
                          <button onClick={() => updateQuantity(item._id, item.quantity - 1)} className="p-1 hover:text-red-500 hover:bg-gray-900 rounded-md transition-colors text-white"><Minus size={14} /></button>
                          <span className="text-xs font-bold w-4 text-center text-white">{item.quantity}</span>
                          <button onClick={() => updateQuantity(item._id, item.quantity + 1)} className="p-1 hover:text-green-500 hover:bg-gray-900 rounded-md transition-colors text-white"><Plus size={14} /></button>
                        </div>
                        <button onClick={() => removeFromCart(item._id)} className="text-[10px] font-bold uppercase tracking-widest text-gray-600 hover:text-red-500 underline underline-offset-4">Remove</button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Footer */}
        {!orderComplete && cartItems.length > 0 && (
          <div className="p-6 border-t border-gray-900 bg-[#0a0a0a]">
            {isCheckout ? (
              <div className="space-y-4">
                <div className="flex justify-between text-sm font-bold uppercase tracking-widest text-gray-400">
                  <span>Subtotal</span>
                  <span className="text-white">LKR {totalAmount.toLocaleString()}</span>
                </div>
                {appliedPromo && (
                   <div className="flex justify-between text-sm font-bold uppercase tracking-widest text-green-500">
                     <span>Discount ({appliedPromo.discount}%)</span>
                     <span>- LKR {discountAmount.toLocaleString()}</span>
                   </div>
                )}
                <div className="flex justify-between text-lg font-black uppercase tracking-tight text-white mb-4">
                  <span>Total</span>
                  <span className="text-purple-500">LKR {finalAmount.toLocaleString()}</span>
                </div>
                <div className="flex gap-4">
                  <button onClick={() => setIsCheckout(false)} className="flex-1 bg-gray-900 hover:bg-gray-800 text-white py-4 rounded-xl font-black uppercase tracking-widest text-[10px] transition-colors">
                    Back
                  </button>
                  <button type="submit" form="checkout-form" disabled={isSubmitting} className="flex-[2] bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white py-4 rounded-xl font-black uppercase tracking-widest text-xs flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(147,51,234,0.3)] transition-all">
                    {isSubmitting ? 'Processing...' : <>Confirm Order <CheckCircle size={16} /></>}
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex justify-between text-lg font-black uppercase tracking-tight text-white mb-4">
                  <span>Total Amount</span>
                  <span className="text-purple-500">LKR {totalAmount.toLocaleString()}</span>
                </div>
                <button onClick={() => setIsCheckout(true)} className="w-full bg-white hover:bg-gray-200 text-black py-4 rounded-xl font-black uppercase tracking-widest text-xs flex items-center justify-center gap-2 transition-colors">
                  Proceed to Checkout <ArrowRight size={16} />
                </button>
              </div>
            )}
          </div>
        )}

      </div>
    </>
  );
};

export default CartSidebar;
