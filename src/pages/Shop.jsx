import { useState, useEffect } from 'react';
import axios from 'axios';
import Sidebar from '../components/Sidebar';
import { ShoppingBag, Plus, Edit2, Trash2, Image as ImageIcon, Tag, Package } from 'lucide-react';

const Shop = () => {
  const [products, setProducts] = useState([]);
  const [newProduct, setNewProduct] = useState({ name: '', category: '', price: '', stock: '', description: '', images: [] });
  const [editProductId, setEditProductId] = useState(null);
  const [isFormVisible, setIsFormVisible] = useState(false);

  const fetchProducts = async () => {
    try {
      const token = localStorage.getItem('authToken');
      const res = await axios.get('https://rc-fitness-backend.vercel.app/api/shop/products', { headers: { 'auth-token': token } });
      setProducts(res.data);
    } catch (err) { console.error("Error fetching products:", err); }
  };

  useEffect(() => { fetchProducts(); }, []);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewProduct({ ...newProduct, images: [reader.result] });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveProduct = async (e) => {
    e.preventDefault();
    if (!newProduct.name || !newProduct.price || !newProduct.stock) return;
    
    const submittedProduct = { 
        ...newProduct, 
        price: Number(newProduct.price),
        stock: Number(newProduct.stock)
    };

    try {
      const token = localStorage.getItem('authToken');
      if (editProductId) {
        const res = await axios.put(`https://rc-fitness-backend.vercel.app/api/shop/products/update/${editProductId}`, submittedProduct, { headers: { 'auth-token': token } });
        setProducts(products.map(p => p._id === editProductId ? res.data : p));
        setEditProductId(null);
      } else {
        await axios.post('https://rc-fitness-backend.vercel.app/api/shop/products/add', submittedProduct, { headers: { 'auth-token': token } });
        fetchProducts();
      }
      setNewProduct({ name: '', category: '', price: '', stock: '', description: '', images: [] });
      setIsFormVisible(false);
    } catch (err) { console.error("Error saving product:", err); }
  };

  const handleDeleteProduct = async (id) => {
    if(!window.confirm("Are you sure you want to delete this product?")) return;
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
        <header className="flex flex-col lg:flex-row justify-between items-center gap-6 mb-10">
          <div className="text-center lg:text-left">
            <h1 className="text-4xl font-black uppercase tracking-tighter italic leading-none flex items-center justify-center lg:justify-start gap-4">
              <ShoppingBag className="text-purple-600" size={36} /> Shop Inventory
            </h1>
            <p className="text-gray-500 text-[10px] font-bold uppercase tracking-[0.3em] mt-2">Manage Products & Details</p>
          </div>
          <button 
            onClick={() => { setIsFormVisible(!isFormVisible); setEditProductId(null); setNewProduct({ name: '', category: '', price: '', stock: '', description: '', images: [] }); }} 
            className="w-full lg:w-auto bg-purple-600 hover:bg-purple-700 px-8 py-4 rounded-2xl font-black uppercase text-xs tracking-widest shadow-2xl transition-all active:scale-95"
          >
            {isFormVisible ? 'Close Form' : <><Plus size={16} className="inline mr-2" /> Add Product</>}
          </button>
        </header>

        {isFormVisible && (
          <form onSubmit={handleSaveProduct} className="mb-12 bg-[#111] border border-gray-900 rounded-3xl p-6 lg:p-8 shadow-xl animate-in fade-in slide-in-from-top-4">
            <h3 className="text-[10px] font-black uppercase text-gray-500 mb-6 tracking-widest border-b border-gray-900 pb-4">
              {editProductId ? 'Edit Product Details' : 'Add New Product'}
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-[10px] uppercase font-bold text-gray-500 tracking-widest mb-2">Product Name</label>
                  <input type="text" value={newProduct.name} onChange={e => setNewProduct({...newProduct, name: e.target.value})} className="w-full bg-black border border-gray-800 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-purple-600 transition-colors" required />
                </div>
                <div>
                  <label className="block text-[10px] uppercase font-bold text-gray-500 tracking-widest mb-2">Category</label>
                  <select value={newProduct.category} onChange={e => setNewProduct({...newProduct, category: e.target.value})} className="w-full bg-black border border-gray-800 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-purple-600 transition-colors text-gray-400" required>
                    <option value="" disabled>Select Category</option>
                    <option value="Supplements">Supplements</option>
                    <option value="Apparel">Apparel</option>
                    <option value="Equipment">Equipment</option>
                    <option value="Accessories">Accessories</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] uppercase font-bold text-gray-500 tracking-widest mb-2">Price (LKR)</label>
                    <input type="number" value={newProduct.price} onChange={e => setNewProduct({...newProduct, price: e.target.value})} className="w-full bg-black border border-gray-800 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-purple-600 transition-colors" required />
                  </div>
                  <div>
                    <label className="block text-[10px] uppercase font-bold text-gray-500 tracking-widest mb-2">Stock Details</label>
                    <input type="number" value={newProduct.stock} onChange={e => setNewProduct({...newProduct, stock: e.target.value})} className="w-full bg-black border border-gray-800 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-purple-600 transition-colors" required />
                  </div>
                </div>
                <div>
                  <label className="block text-[10px] uppercase font-bold text-gray-500 tracking-widest mb-2 mt-2">Product Description / Details</label>
                  <textarea value={newProduct.description || ''} onChange={e => setNewProduct({...newProduct, description: e.target.value})} className="w-full bg-black border border-gray-800 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-purple-600 transition-colors h-24 resize-none" placeholder="Enter detailed product description..."></textarea>
                </div>
              </div>

              <div>
                <label className="block text-[10px] uppercase font-bold text-gray-500 tracking-widest mb-2">Product Image</label>
                <div className="w-full h-full min-h-[150px] bg-black border-2 border-dashed border-gray-800 hover:border-purple-600 rounded-xl flex flex-col items-center justify-center transition-colors relative overflow-hidden group">
                  {newProduct.images && newProduct.images[0] ? (
                    <>
                      <img src={newProduct.images[0]} alt="Preview" className="w-full h-full object-contain p-2 opacity-80 group-hover:opacity-40 transition-opacity" />
                      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                        <span className="bg-purple-600 text-white font-black uppercase text-[10px] tracking-widest px-4 py-2 rounded-lg">Change Image</span>
                      </div>
                    </>
                  ) : (
                    <div className="flex flex-col items-center text-gray-600 group-hover:text-purple-500 transition-colors">
                      <ImageIcon size={32} className="mb-2" />
                      <span className="font-bold text-xs uppercase tracking-widest">Upload Image</span>
                    </div>
                  )}
                  <input type="file" accept="image/*" onChange={handleImageUpload} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
                </div>
              </div>
            </div>

            <div className="mt-8">
              <button type="submit" className="w-full bg-purple-600 hover:bg-purple-700 text-white font-black uppercase text-sm tracking-widest py-4 rounded-xl transition-all shadow-xl shadow-purple-900/20 active:scale-[0.98]">
                {editProductId ? 'Save Changes' : 'Publish Product'}
              </button>
            </div>
          </form>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {products.map(product => (
             <div key={product._id} className="bg-[#111] border border-gray-900 rounded-3xl overflow-hidden shadow-2xl group hover:border-gray-700 transition-all flex flex-col h-full">
               <div className="relative h-48 bg-black overflow-hidden flex items-center justify-center">
                 {product.images && product.images[0] ? (
                   <img src={product.images[0]} alt={product.name} className="w-full h-full object-contain p-4 opacity-90 group-hover:scale-110 transition-transform duration-500 bg-white/5" />
                 ) : (
                   <ImageIcon size={48} className="text-gray-800" />
                 )}
                 <div className="absolute top-4 left-4">
                   {product.stock === 0 ? (
                     <span className="bg-red-600 text-white text-[9px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full shadow-lg">Sold Out</span>
                   ) : (
                     <span className="bg-green-600 text-white text-[9px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full shadow-lg">In Stock • {product.stock}</span>
                   )}
                 </div>
               </div>
               
               <div className="p-6 flex-1 flex flex-col">
                 <div className="flex justify-between items-start mb-2">
                   <h3 className="font-black text-lg uppercase tracking-tight italic">{product.name}</h3>
                   <span className="text-purple-500 font-bold">LKR {product.price}</span>
                 </div>
                 <div className="flex items-center gap-2 mb-6">
                   <Tag size={12} className="text-gray-500"/>
                   <span className="text-gray-500 text-[10px] uppercase font-bold tracking-widest">{product.category}</span>
                 </div>
                 
                 <div className="mt-auto flex gap-2">
                   <button onClick={() => { setEditProductId(product._id); setNewProduct({ name: product.name, category: product.category, price: product.price, stock: product.stock, description: product.description || '', images: product.images }); setIsFormVisible(true); window.scrollTo({ top: 0, behavior: 'smooth' }); }} className="flex-1 bg-gray-900 hover:bg-gray-800 text-white text-[10px] font-black uppercase tracking-widest py-3 rounded-xl transition-colors flex items-center justify-center gap-2">
                     <Edit2 size={14} /> Edit
                   </button>
                   <button onClick={() => handleDeleteProduct(product._id)} className="flex-1 bg-red-900/20 hover:bg-red-600 hover:text-white text-red-500 border border-red-900/30 hover:border-red-600 text-[10px] font-black uppercase tracking-widest py-3 rounded-xl transition-all flex items-center justify-center gap-2">
                     <Trash2 size={14} /> Delete
                   </button>
                 </div>
               </div>
             </div>
          ))}
          {products.length === 0 && !isFormVisible && (
            <div className="col-span-full py-20 flex flex-col items-center justify-center border-2 border-dashed border-gray-900 rounded-3xl opacity-50">
              <Package size={48} className="text-gray-700 mb-4" />
              <p className="text-gray-500 uppercase tracking-widest font-bold text-sm">No products in inventory.</p>
            </div>
          )}
        </div>

      </main>
    </div>
  );
};

export default Shop;
