import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { ArrowLeft, ShoppingCart, CheckCircle, XCircle, Dumbbell, ShoppingBag, Home, ChevronRight, Star, Zap, ShieldCheck, Share2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';

const PublicProduct = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('description');
  const { addToCart } = useCart();
  const navigate = useNavigate();

  const handleBuyNow = () => {
    addToCart(product, quantity);
    navigate('/checkout');
  };

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await axios.get(`https://rc-fitness-backend.vercel.app/api/shop/products/${id}`);
        setProduct(res.data);
      } catch (err) { console.error("Error fetching product:", err); } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  if (loading) return <div className="min-h-screen bg-[#050505] flex items-center justify-center text-purple-500 text-sm font-bold uppercase tracking-widest">Loading...</div>;
  
  if (!product) return (
    <div className="min-h-screen bg-[#050505] flex flex-col items-center justify-center p-6 text-center">
      <ShoppingCart size={48} className="text-gray-800 mb-4" />
      <h2 className="text-2xl font-black uppercase italic tracking-tighter text-white mb-2">Product Not Found</h2>
      <p className="text-gray-500 text-xs font-bold uppercase tracking-widest mb-8">It may have been removed or the ID is incorrect.</p>
      <Link to="/store" className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-4 rounded-xl font-black uppercase tracking-widest text-[10px] transition-all flex items-center gap-2">
        <ArrowLeft size={14} /> Back to Store
      </Link>
    </div>
  );

  return (
    <div className="bg-[#050505] min-h-screen text-white font-sans selection:bg-purple-600">
      {/* Navbar Minimal */}
      <nav className="fixed top-0 w-full z-50 bg-[#0a0a0a]/90 backdrop-blur-md border-b border-white/5">
        <div className="max-w-7xl mx-auto px-6 h-20 flex justify-between items-center">
          <Link to="/" className="flex items-center gap-2">
            <div className="bg-red-600 p-1.5 rounded-sm"><Dumbbell className="text-white" size={20} /></div>
            <span className="font-black text-xl tracking-tighter uppercase italic">RC Fitness</span>
          </Link>
          <Link to="/store" className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-gray-400 hover:text-purple-500 transition-colors">
            <ArrowLeft size={16} /> Back to Store
          </Link>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-6 pt-32 pb-20">
        {/* Breadcrumbs */}
        <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 mb-8 ml-4">
          <Link to="/" className="hover:text-white flex items-center gap-1"><Home size={12}/> Home</Link>
          <ChevronRight size={10} />
          <Link to="/store" className="hover:text-white">Shop</Link>
          <ChevronRight size={10} />
          <span className="text-purple-500">{product.category}</span>
          <ChevronRight size={10} />
          <span className="text-gray-300 truncate max-w-[150px]">{product.name}</span>
        </div>
        <div className="bg-[#111] border border-gray-900 rounded-[2.5rem] p-6 lg:p-12 shadow-2xl flex flex-col lg:flex-row gap-12 lg:gap-20">
          
          {/* Image Section */}
          <div className="w-full lg:w-1/2 flex items-center justify-center bg-black rounded-3xl p-10 border border-gray-800 min-h-[400px]">
            {product.images && product.images[0] ? (
              <img src={product.images[0]} alt={product.name} className="w-full h-full max-h-[500px] object-contain drop-shadow-2xl animate-in zoom-in duration-700" />
            ) : (
              <ShoppingBag size={64} className="text-gray-800" />
            )}
          </div>

          {/* Details Section */}
          <div className="w-full lg:w-1/2 flex flex-col justify-center">
            <div className="mb-8 border-b border-gray-900 pb-8">
              <span className="inline-block px-3 py-1 bg-purple-900/20 text-purple-400 border border-purple-900/50 rounded-full text-[9px] font-black uppercase tracking-widest mb-4">
                {product.category}
              </span>
              <div className="flex items-center gap-4 mb-8">
                <p className="text-4xl md:text-5xl font-black text-purple-500 tracking-tight italic">LKR {product.price.toLocaleString()}</p>
                <div className="flex flex-col gap-1">
                  <span className="text-[9px] text-gray-500 line-through font-bold">LKR {(product.price * 1.15).toLocaleString()}</span>
                  <span className="text-[9px] text-red-500 font-bold uppercase tracking-widest">-15% OFF</span>
                </div>
              </div>

              {/* Installment Info */}
              <div className="bg-white/[0.03] border border-white/5 rounded-2xl p-4 mb-8 flex items-center justify-between group cursor-help transition-colors hover:bg-white/5">
                <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wide">
                  Or 3 installments of <span className="text-white font-black">LKR {(product.price / 3).toLocaleString()}</span> with <span className="text-purple-400 font-black">KOKO</span>
                </div>
                <ChevronRight size={14} className="text-gray-600 group-hover:translate-x-1 transition-transform" />
              </div>

              {/* Highlights */}
              <ul className="space-y-3 mb-10">
                <HighlightItem icon={<ShieldCheck size={14}/>} text="Pharmaceutical-Grade Quality: 100% Pure" />
                <HighlightItem icon={<Zap size={14}/>} text="Enhances Strength & Power: Scientific Formula" />
                <HighlightItem icon={<Star size={14}/>} text="Accelerates Recovery: Optimized Absorption" />
              </ul>
            </div>

            <div className="flex items-center gap-6 mb-10 pb-10 border-b border-white/5">
              <div className="flex flex-col gap-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-gray-500">Quantity</label>
                <div className="flex items-center bg-white/5 border border-white/10 rounded-xl p-1 w-fit">
                  <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="p-3 hover:bg-white/5 rounded-lg transition-colors text-gray-400 hover:text-white">-</button>
                  <span className="px-6 font-black tabular-nums">{quantity}</span>
                  <button onClick={() => setQuantity(quantity + 1)} className="p-3 hover:bg-white/5 rounded-lg transition-colors text-gray-400 hover:text-white">+</button>
                </div>
              </div>
              
              <div className="flex-1">
                <label className="text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-2 block">Availability</label>
                <div className="flex items-center gap-2">
                  <div className={`w-2.5 h-2.5 rounded-full ${product.stock > 0 ? 'bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.5)]' : 'bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.5)]'}`}></div>
                  <span className={`text-xs font-black uppercase tracking-widest ${product.stock > 0 ? 'text-green-500' : 'text-red-500'}`}>
                    {product.stock > 0 ? `${product.stock} Units In Stock` : 'Out of Stock'}
                  </span>
                </div>
              </div>
            </div>

            <div className="mb-12">
              <div className="flex gap-8 border-b border-white/5 mb-8">
                {['description', 'usage', 'facts'].map((tab) => (
                  <button 
                    key={tab} 
                    onClick={() => setActiveTab(tab)}
                    className={`pb-4 text-[10px] font-black uppercase tracking-[0.25em] transition-all relative ${activeTab === tab ? 'text-purple-500' : 'text-gray-500 hover:text-gray-300'}`}
                  >
                    {tab}
                    {activeTab === tab && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-purple-500 shadow-[0_0_10px_rgba(168,85,247,0.5)]"></div>}
                  </button>
                ))}
              </div>

              <div className="min-h-[150px] animate-in fade-in duration-500">
                {activeTab === 'description' && (
                  <p className="text-gray-300 text-sm md:text-base leading-relaxed whitespace-pre-wrap bg-white/[0.02] p-8 rounded-3xl border border-white/5">
                    {product.description || "No detailed description provided for this product. Contact front-desk for nutritional or usage inquiries."}
                  </p>
                )}
                {activeTab === 'usage' && (
                  <div className="bg-white/[0.02] p-8 rounded-3xl border border-white/5 space-y-4">
                    <p className="text-gray-300 text-sm">Recommended for {product.category} intake. Stir one serving into 8-10 oz of cold water or your favorite beverage.</p>
                    <ul className="text-xs text-gray-500 space-y-2 list-disc pl-4">
                      <li>Use daily for optimal results.</li>
                      <li>Can be stacked with other {product.category} supplements.</li>
                      <li>Consult with a trainer for personalized dosage.</li>
                    </ul>
                  </div>
                )}
                {activeTab === 'facts' && (
                  <div className="bg-white/[0.02] rounded-3xl border border-white/5 overflow-hidden">
                    <table className="w-full text-left text-sm">
                      <thead className="bg-white/5 text-[10px] uppercase font-black tracking-widest text-gray-400">
                        <tr>
                          <th className="px-6 py-4">Attribute</th>
                          <th className="px-6 py-4">Value</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-white/5 text-gray-300">
                        <tr><td className="px-6 py-4 font-bold">Category</td><td className="px-6 py-4">{product.category}</td></tr>
                        <tr><td className="px-6 py-4 font-bold">Weight</td><td className="px-6 py-4">Standard Size</td></tr>
                        <tr><td className="px-6 py-4 font-bold">Authenticity</td><td className="px-6 py-4 text-green-500">100% Genuine</td></tr>
                        <tr><td className="px-6 py-4 font-bold">Storage</td><td className="px-6 py-4 text-xs">Store in cool, dry place.</td></tr>
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 mb-6">
              <button 
                onClick={() => {
                  addToCart(product, quantity);
                  alert(`${quantity} x ${product.name} added to cart!`);
                }}
                disabled={product.stock === 0}
                className="flex-1 bg-white hover:bg-gray-200 text-black py-5 rounded-[2rem] font-black uppercase tracking-[0.2em] text-[11px] flex items-center justify-center gap-3 transition-all hover:-translate-y-1 active:scale-95 disabled:opacity-50"
              >
                <ShoppingCart size={18} /> Add to Cart
              </button>
              <button 
                onClick={handleBuyNow}
                disabled={product.stock === 0}
                className="flex-1 bg-orange-600 hover:bg-orange-700 text-white py-5 rounded-[2rem] font-black uppercase tracking-[0.2em] text-[11px] flex items-center justify-center gap-3 transition-all hover:-translate-y-1 active:scale-95 disabled:opacity-50"
              >
                Buy It Now
              </button>
            </div>

            <div className="flex items-center justify-between pt-6 border-t border-white/5">
               <div className="flex items-center gap-2 text-[10px] font-bold text-gray-500 uppercase tracking-widest">
                  <Share2 size={14} /> Share: 
                  <span className="hover:text-purple-400 cursor-pointer">FB</span> &bull; 
                  <span className="hover:text-purple-400 cursor-pointer">TW</span> &bull; 
                  <span className="hover:text-purple-400 cursor-pointer">WA</span>
               </div>
               <p className="text-gray-600 text-[9px] font-bold uppercase tracking-[0.2em]">Authenticity Guaranteed</p>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
};

const HighlightItem = ({ icon, text }) => (
  <li className="flex items-center gap-3 text-xs text-gray-400 font-medium">
    <div className="text-purple-500 flex-shrink-0">{icon}</div>
    {text}
  </li>
);

export default PublicProduct;
