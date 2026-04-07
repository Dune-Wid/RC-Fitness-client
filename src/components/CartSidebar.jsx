import { useNavigate } from 'react-router-dom';
import { X, Plus, Minus, ShoppingBag, ArrowRight, Trash2 } from 'lucide-react';
import { useCart } from '../context/CartContext';

const CartSidebar = () => {
  const { cartItems, isCartOpen, setIsCartOpen, updateQuantity, removeFromCart } = useCart();
  const navigate = useNavigate();

  if (!isCartOpen) return null;

  const subtotal = cartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);

  const closeSidebar = () => {
    setIsCartOpen(false);
  };

  const handleProceedToCheckout = () => {
    closeSidebar();
    navigate('/checkout');
  };

  return (
    <>
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60]" onClick={closeSidebar}></div>
      <div className="fixed top-0 right-0 h-full w-full max-w-md bg-[#111] border-l border-gray-800 z-[70] shadow-2xl flex flex-col animate-in slide-in-from-right duration-300 font-sans">
        
        <div className="flex justify-between items-center p-6 border-b border-gray-900 bg-[#0a0a0a]">
          <h2 className="text-xl font-black uppercase italic tracking-tighter flex items-center gap-3 text-white">
            <ShoppingBag className="text-purple-500" /> Your Cart
          </h2>
          <button onClick={closeSidebar} className="text-gray-500 hover:text-white transition-colors">
            <X size={24} />
          </button>
        </div>

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
                        <span className="text-xs font-bold w-4 text-center text-white tabular-nums">{item.quantity}</span>
                        <button onClick={() => updateQuantity(item._id, item.quantity + 1)} className="p-1 hover:text-green-500 hover:bg-gray-900 rounded-md transition-colors text-white"><Plus size={14} /></button>
                      </div>
                      <button onClick={() => removeFromCart(item._id)} className="text-[10px] font-bold uppercase tracking-widest text-gray-600 hover:text-red-500 underline underline-offset-4 flex items-center gap-1">
                        <Trash2 size={12} /> Remove
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {cartItems.length > 0 && (
          <div className="p-8 border-t border-gray-900 bg-[#0a0a0a]">
            <div className="flex justify-between items-center mb-8">
              <span className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-500">Subtotal</span>
              <span className="text-2xl font-black italic text-purple-500 tabular-nums">LKR {subtotal.toLocaleString()}</span>
            </div>
            
            <button 
              onClick={handleProceedToCheckout}
              className="w-full bg-purple-600 hover:bg-purple-700 text-white py-5 rounded-2xl font-black uppercase tracking-[0.2em] text-xs flex items-center justify-center gap-3 shadow-xl shadow-purple-900/20 transition-all hover:-translate-y-1 active:scale-95 group"
            >
              Proceed to Checkout
              <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </button>
            
            <p className="text-center text-[9px] font-bold text-gray-600 uppercase tracking-widest mt-6">
              Tax & Shipment calculated at checkout
            </p>
          </div>
        )}

      </div>
    </>
  );
};

export default CartSidebar;
