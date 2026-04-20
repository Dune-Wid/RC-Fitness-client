import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { Search, ShoppingBag, Filter, Plus } from 'lucide-react';
import PublicNavbar from '../components/PublicNavbar';
import { useCart } from '../context/CartContext';

const PublicShop = () => {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const { addToCart } = useCart();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/shop/products');
        setProducts(res.data);
      } catch (err) { console.error("Error fetching products:", err); }
    };
    fetchProducts();
  }, []);

  const categories = ['All', 'Supplements', 'Apparel', 'Equipment', 'Accessories', 'Other'];
  
  const filteredProducts = products.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = category === 'All' || p.category === category;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="bg-[#050505] min-h-screen text-white font-sans selection:bg-purple-600">
      <PublicNavbar />

      {/* Main Store Content */}
      <main className="max-w-7xl mx-auto px-6 pt-32 pb-12 flex flex-col md:flex-row gap-10">
        
        {/* Sidebar Filters */}
        <aside className="w-full md:w-64 flex-shrink-0">
          <div className="sticky top-28 bg-[#111] border border-gray-900 rounded-3xl p-6">
            <h2 className="text-xl font-black uppercase italic tracking-tighter mb-6 flex items-center gap-2">
              <Filter size={18} className="text-purple-500" /> Filters
            </h2>
            
            <div className="mb-8">
              <label className="text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-3 block">Search</label>
              <div className="relative">
                <input 
                  type="text" 
                  placeholder="Find products..." 
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  className="w-full bg-black border border-gray-800 rounded-xl px-4 py-3 pl-10 text-sm focus:outline-none focus:border-purple-600 transition-colors"
                />
                <Search size={16} className="absolute left-4 top-3.5 text-gray-500" />
              </div>
            </div>

            <div>
              <label className="text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-3 block">Categories</label>
              <div className="flex flex-col gap-2">
                {categories.map(cat => (
                  <button 
                    key={cat}
                    onClick={() => setCategory(cat)}
                    className={`text-left px-4 py-3 rounded-xl text-sm font-bold tracking-wide transition-all ${
                      category === cat ? 'bg-purple-600/20 text-purple-400 border border-purple-900/50' : 'text-gray-400 hover:bg-gray-900 border border-transparent hover:text-white'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </aside>

        {/* Products Grid */}
        <section className="flex-1">
          <header className="mb-8 flex justify-between items-end border-b border-gray-900 pb-4">
            <div>
              <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tighter italic">Pro Shop</h1>
              <p className="text-gray-500 text-xs font-bold uppercase tracking-[0.2em] mt-2">Fuel your performance</p>
            </div>
            <p className="text-gray-500 text-[10px] font-bold uppercase tracking-widest hidden md:block">
              Showing {filteredProducts.length} Results
            </p>
          </header>

          {filteredProducts.length === 0 ? (
            <div className="py-20 flex flex-col items-center justify-center border-2 border-dashed border-gray-900 rounded-3xl opacity-50">
              <ShoppingBag size={48} className="text-gray-700 mb-4" />
              <p className="text-gray-500 uppercase tracking-widest font-bold text-sm">No products found matching your criteria.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredProducts.map(product => (
                <Link to={`/store/${product._id}`} key={product._id} className="bg-[#111] border border-gray-900 rounded-3xl overflow-hidden shadow-xl group hover:border-purple-900/50 transition-all flex flex-col h-full hover:-translate-y-1">
                  <div className="relative h-64 bg-black overflow-hidden flex items-center justify-center p-6">
                    {product.images && product.images[0] ? (
                      <img src={product.images[0]} alt={product.name} className="w-full h-full object-contain opacity-90 group-hover:scale-105 transition-transform duration-500" />
                    ) : (
                      <ShoppingBag size={48} className="text-gray-800" />
                    )}
                    <div className="absolute top-4 right-4">
                      {product.stock === 0 ? (
                        <span className="bg-red-600/90 backdrop-blur-md text-white text-[9px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full">Out of Stock</span>
                      ) : null}
                    </div>
                  </div>
                  
                  <div className="p-6 flex-1 flex flex-col relative z-20">
                    <p className="text-gray-500 text-[9px] uppercase font-bold tracking-widest mb-2">{product.category}</p>
                    <h3 className="font-black text-xl uppercase tracking-tight italic mb-2 line-clamp-2">{product.name}</h3>
                    
                    <div className="mt-auto flex items-center justify-between pt-4">
                      <p className="text-purple-500 font-black text-2xl">LKR {product.price.toLocaleString()}</p>
                      
                      {product.stock > 0 && (
                        <button 
                          onClick={(e) => { e.preventDefault(); e.stopPropagation(); addToCart(product); }}
                          className="bg-purple-600/90 backdrop-blur hover:bg-purple-500 text-white p-3 rounded-2xl transition-all hover:scale-110 active:scale-95 shadow-xl border border-purple-500"
                        >
                          <ShoppingBag size={18} />
                        </button>
                      )}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </section>

      </main>
    </div>
  );
};

export default PublicShop;
