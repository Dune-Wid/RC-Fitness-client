import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { ArrowLeft, ShoppingCart, CheckCircle, XCircle, Dumbbell, ShoppingBag } from 'lucide-react';
import { useCart } from '../context/CartContext';

const PublicProduct = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart();

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
  if (!product) return <div className="min-h-screen bg-[#050505] flex items-center justify-center text-red-500 text-sm font-bold uppercase tracking-widest">Product Not Found</div>;

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
              <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tighter italic leading-none mb-6 text-white drop-shadow-xl">
                {product.name}
              </h1>
              <div className="flex items-center gap-4">
                <p className="text-4xl font-black text-purple-500 tracking-tight">LKR {product.price.toLocaleString()}</p>
                {product.stock > 0 ? (
                  <span className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-green-500 bg-green-900/20 px-3 py-1 rounded-full"><CheckCircle size={14}/> In Stock</span>
                ) : (
                  <span className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-red-500 bg-red-900/20 px-3 py-1 rounded-full"><XCircle size={14}/> Out of Stock</span>
                )}
              </div>
            </div>

            <div className="mb-10">
              <h3 className="text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-4">Product Details</h3>
              <p className="text-gray-300 text-sm md:text-base leading-relaxed whitespace-pre-wrap">
                {product.description || "No detailed description provided for this product. Contact front-desk for nutritional or usage inquiries."}
              </p>
            </div>

            <button 
              onClick={() => addToCart(product)}
              className={`w-full py-5 rounded-2xl font-black uppercase tracking-widest text-sm flex items-center justify-center gap-3 transition-all ${
                product.stock > 0 
                ? 'bg-purple-600 hover:bg-purple-700 hover:shadow-[0_0_30px_rgba(147,51,234,0.3)] hover:-translate-y-1 active:scale-95 text-white' 
                : 'bg-gray-800 text-gray-500 cursor-not-allowed'
              }`}
              disabled={product.stock === 0}
            >
              <ShoppingCart size={20} /> {product.stock > 0 ? 'Add to Cart' : 'Currently Unavailable'}
            </button>
            <p className="text-center text-gray-600 text-[9px] font-bold uppercase tracking-widest mt-4">
              Online payments coming soon. Reserve in-person.
            </p>
          </div>

        </div>
      </main>
    </div>
  );
};

export default PublicProduct;
