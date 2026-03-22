import { useState, useEffect } from 'react';
import axios from 'axios';
import { ShoppingBag, ArrowLeft, Tag } from 'lucide-react';
import { Link } from 'react-router-dom';

const PublicShop = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get('https://rc-fitness-backend.vercel.app/api/shop/products').catch(() => ({ data: [] }));
        setProducts(res.data || []);
      } catch (err) { console.error(err); }
    };
    fetchProducts();
  }, []);

  return (
    <div className="bg-[#080808] min-h-screen text-white font-sans selection:bg-red-600">
      <nav className="border-b border-white/5 bg-black/50 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-20 flex justify-between items-center">
          <Link to="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
             <ArrowLeft size={20} className="text-red-600" />
             <span className="font-black text-xs tracking-widest uppercase">Back to Home</span>
          </Link>
          <div className="flex items-center gap-2">
            <ShoppingBag className="text-red-600" size={24} />
            <span className="font-black text-xl tracking-tighter uppercase italic">RC Store</span>
          </div>
          <div className="w-[100px]"></div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-6 py-12 md:py-20">
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-7xl font-black uppercase tracking-tighter italic mb-4">Elite <span className="text-red-600">Supplements</span></h1>
          <p className="text-gray-400 font-medium max-w-2xl mx-auto">Fuel your progress with our premium selection of verified supplements, gym apparel, and high-quality accessories.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map(product => (
            <div key={product._id || product.id} className="bg-[#111] border border-white/5 rounded-2xl p-6 group hover:border-red-600/30 transition-all duration-500 flex flex-col justify-between min-h-[280px]">
              <div>
                <div className="flex justify-between items-start mb-6">
                  <span className="px-3 py-1 rounded-full border bg-red-900/10 text-red-500 border-red-900/20 text-[9px] font-black uppercase tracking-widest">
                    {product.category}
                  </span>
                  <Tag size={16} className="text-gray-700" />
                </div>
                <h3 className="text-2xl font-black uppercase italic leading-tight mb-2">{product.name}</h3>
              </div>
              <div className="border-t border-white/5 pt-4 mt-6 flex justify-between items-end">
                <div>
                  <span className="text-gray-600 text-[9px] font-black uppercase tracking-widest block mb-1">Status</span>
                  <span className={`text-sm font-bold ${product.stock > 0 ? 'text-green-500' : 'text-red-500'}`}>
                    {product.stock > 0 ? 'In Stock' : 'Sold Out'}
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-gray-600 text-[9px] font-black uppercase tracking-widest block mb-1">Price</span>
                  <span className="text-2xl font-black text-white italic tracking-tighter">LKR {product.price.toLocaleString()}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {products.length === 0 && (
          <div className="flex flex-col items-center justify-center p-20 border border-dashed border-white/10 rounded-3xl opacity-50">
            <ShoppingBag size={48} className="text-gray-600 mb-4" />
            <span className="text-gray-500 text-sm font-black uppercase tracking-widest">Store Inventory is Empty</span>
          </div>
        )}
      </main>
    </div>
  );
};

export default PublicShop;
