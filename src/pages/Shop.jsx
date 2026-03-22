import { useState, useEffect } from 'react';
import axios from 'axios';
import Sidebar from '../components/Sidebar';
import { ShoppingBag, Plus, Trash2, Package, Tag, Layers, DollarSign, Image as ImageIcon } from 'lucide-react';

const Shop = () => {
  const [products, setProducts] = useState([]);
  const [newProduct, setNewProduct] = useState({ name: '', category: '', price: '', stock: '', images: [] });

  const fetchProducts = async () => {
    try {
      const token = localStorage.getItem('authToken');
      const config = { headers: { 'auth-token': token } };
      const res = await axios.get('https://rc-fitness-backend.vercel.app/api/shop/products', config).catch(() => ({ data: [] }));
      setProducts(res.data || []);
    } catch (err) { console.error("Error fetching products:", err); }
  };

  useEffect(() => { fetchProducts(); }, []);

  const handleAddProduct = async (e) => {
    e.preventDefault();
    if (!newProduct.name || !newProduct.price || !newProduct.stock) return;
    
    const submittedProduct = { ...newProduct, price: Number(newProduct.price), stock: Number(newProduct.stock) };
    const tempProduct = { ...submittedProduct, _id: Date.now() };
    
    setProducts(prev => [...prev, tempProduct]);
    setNewProduct({ name: '', category: '', price: '', stock: '', images: [] });

    try {
      const token = localStorage.getItem('authToken');
      await axios.post('https://rc-fitness-backend.vercel.app/api/shop/products/add', submittedProduct, { headers: { 'auth-token': token } });
      fetchProducts();
    } catch (err) { console.error("Error adding product:", err); }
  };

  const handleDeleteProduct = async (id) => {
    setProducts(prev => prev.filter(p => (p._id || p.id) !== id));
    try {
      const token = localStorage.getItem('authToken');
      await axios.delete(`https://rc-fitness-backend.vercel.app/api/shop/products/delete/${id}`, { headers: { 'auth-token': token } });
      fetchProducts();
    } catch (err) { console.error("Error deleting product:", err); }
  };

  return (
    <div className="flex bg-[#080808] min-h-screen text-white font-sans">
      <Sidebar />
      <main className="flex-1 p-6 lg:p-12 lg:ml-64 pt-24 lg:pt-12">
        <header className="mb-10 text-center lg:text-left">
          <h1 className="text-4xl font-black uppercase tracking-tighter italic leading-none flex items-center justify-center lg:justify-start gap-4">
            <ShoppingBag className="text-blue-500" size={36} /> Supplement Store
          </h1>
          <p className="text-gray-500 text-[10px] font-bold uppercase tracking-[0.3em] mt-2">Member 4: Inventory &amp; Catalog</p>
        </header>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-12">
          {/* Add Product Section */}
          <section className="xl:col-span-1 bg-[#111] border border-gray-900 rounded-3xl p-6 lg:p-8 shadow-xl h-fit sticky top-8">
            <div className="flex items-center gap-3 mb-6 border-b border-gray-900 pb-4">
              <Package className="text-blue-500" size={24} />
              <h2 className="text-2xl font-black uppercase italic tracking-wider">Add Item</h2>
            </div>
            
            <form onSubmit={handleAddProduct} className="flex flex-col gap-4">
              <div className="relative group">
                <Tag className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600 group-focus-within:text-blue-500 transition-colors" size={16} />
                <input type="text" placeholder="Product Name" value={newProduct.name} onChange={(e) => setNewProduct({...newProduct, name: e.target.value})} className="w-full bg-[#080808] border border-gray-800 rounded-xl pl-12 pr-4 py-4 text-sm focus:outline-none focus:border-blue-600 transition-all text-white placeholder-gray-600" />
              </div>

              <div className="relative group">
                <Layers className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600 group-focus-within:text-blue-500 transition-colors" size={16} />
                <select value={newProduct.category} onChange={(e) => setNewProduct({...newProduct, category: e.target.value})} className="w-full bg-[#080808] border border-gray-800 rounded-xl pl-12 pr-4 py-4 text-sm focus:outline-none focus:border-blue-600 transition-all text-gray-400 appearance-none">
                  <option value="" disabled>Select Category</option>
                  <option value="Supplement">Supplement</option>
                  <option value="Apparel">Apparel</option>
                  <option value="Equipment">Equipment</option>
                  <option value="Beverage">Beverage</option>
                </select>
              </div>

              {/* Multiple Images Upload */}
              <div className="relative group">
                <ImageIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600 group-focus-within:text-blue-500 transition-colors" size={16} />
                <input 
                   type="file" 
                   multiple 
                   accept="image/*"
                   onChange={(e) => {
                     const files = Array.from(e.target.files);
                     setNewProduct({...newProduct, images: files});
                   }} 
                   className="w-full bg-[#080808] border border-gray-800 rounded-xl pl-12 pr-4 py-4 text-sm focus:outline-none focus:border-blue-600 transition-all text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-[10px] file:uppercase file:tracking-widest file:font-black file:bg-blue-900/20 file:text-blue-500 hover:file:bg-blue-900/40 cursor-pointer" 
                />
              </div>

              <div className="relative group">
                <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600 group-focus-within:text-blue-500 transition-colors" size={16} />
                <input type="number" placeholder="Price (LKR)" value={newProduct.price} onChange={(e) => setNewProduct({...newProduct, price: e.target.value})} className="w-full bg-[#080808] border border-gray-800 rounded-xl pl-12 pr-4 py-4 text-sm focus:outline-none focus:border-blue-600 transition-all text-white placeholder-gray-600" />
              </div>

              <div className="relative group">
                <Package className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600 group-focus-within:text-blue-500 transition-colors" size={16} />
                <input type="number" placeholder="Stock Quantity" value={newProduct.stock} onChange={(e) => setNewProduct({...newProduct, stock: e.target.value})} className="w-full bg-[#080808] border border-gray-800 rounded-xl pl-12 pr-4 py-4 text-sm focus:outline-none focus:border-blue-600 transition-all text-white placeholder-gray-600" />
              </div>

              <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-black uppercase tracking-widest py-4 rounded-xl transition-all flex items-center justify-center gap-2 mt-4 shadow-[0_0_20px_rgba(37,99,235,0.3)] hover:shadow-[0_0_30px_rgba(37,99,235,0.5)]">
                <Plus size={18} /> Add to Inventory
              </button>
            </form>
          </section>

          {/* Product Catalog */}
          <section className="xl:col-span-2 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {products.map(product => (
                <div key={product._id || product.id} className="bg-[#111] border border-gray-900 rounded-3xl p-6 group hover:border-gray-700 transition-all relative overflow-hidden flex flex-col justify-between min-h-[220px] shadow-lg">
                  <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:opacity-10 transition-opacity pointer-events-none">
                    <ShoppingBag size={100} />
                  </div>
                  <div>
                    <div className="flex justify-between items-start mb-4 relative z-10">
                      <span className="px-3 py-1 rounded-full border bg-blue-900/20 text-blue-500 border-blue-900/30 text-[9px] font-black uppercase tracking-widest">
                        {product.category}
                      </span>
                    </div>
                    <h3 className="text-2xl font-black uppercase italic leading-tight mb-2 relative z-10">{product.name}</h3>
                  </div>
                  <div className="flex items-end justify-between relative z-10 border-t border-gray-900 pt-4 mt-4">
                    <div>
                      <span className="text-gray-600 text-[9px] font-black uppercase tracking-widest leading-none block mb-1">In Stock</span>
                      <span className={`text-lg font-black ${product.stock > 10 ? 'text-green-500' : 'text-orange-500'}`}>{product.stock} Units</span>
                    </div>
                    <div className="flex flex-col items-end">
                       <span className="text-gray-600 text-[9px] font-black uppercase tracking-widest leading-none block mb-1">Price</span>
                       <span className="text-xl font-black text-white italic tracking-tighter block mb-2">LKR {product.price.toLocaleString()}</span>
                       <button onClick={() => handleDeleteProduct(product._id || product.id)} className="p-2 bg-black rounded-lg text-gray-600 hover:text-red-500 border border-gray-800 transition-colors">
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            {products.length === 0 && (
               <div className="flex flex-col items-center justify-center p-16 border-2 border-dashed border-gray-900 rounded-3xl opacity-50">
                 <ShoppingBag size={48} className="text-gray-700 mb-4" />
                 <span className="text-gray-500 text-xs font-black uppercase tracking-widest">Store Inventory is Empty</span>
               </div>
            )}
          </section>
        </div>
      </main>
    </div>
  );
};

export default Shop;
