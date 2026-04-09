import { useState, useEffect } from 'react';
import axios from 'axios';
import Sidebar from '../components/Sidebar';
import InventoryReportModal from '../components/InventoryReportModal';
import { ShoppingBag, Plus, Edit2, Trash2, Image as ImageIcon, Tag, Package } from 'lucide-react';

const Shop = () => {
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [promos, setPromos] = useState([]);
  const [activeTab, setActiveTab] = useState('inventory');
  
  const [newProduct, setNewProduct] = useState({ name: '', category: '', price: '', stock: '', description: '', images: [] });
  const [newPromo, setNewPromo] = useState({ code: '', discountPercentage: '' });
  const [editProductId, setEditProductId] = useState(null);
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('authToken');
      const config = { headers: { 'auth-token': token } };
      
      const [prodRes, orderRes, promoRes] = await Promise.all([
        axios.get('https://rc-fitness-backend.vercel.app/api/shop/products', config),
        axios.get('https://rc-fitness-backend.vercel.app/api/shop/orders', config).catch(() => ({ data: [] })),
        axios.get('https://rc-fitness-backend.vercel.app/api/shop/promotions', config).catch(() => ({ data: [] }))
      ]);

      setProducts(prodRes.data);
      setOrders(orderRes.data);
      setPromos(promoRes.data);
    } catch (err) { console.error("Error fetching shop data:", err); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchData(); }, []);

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
        fetchData();
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
      fetchData();
    } catch (err) { console.error("Error deleting product:", err); }
  };

  const handleAddPromo = async (e) => {
    e.preventDefault();
    if (!newPromo.code || !newPromo.discountPercentage) return;
    try {
      const token = localStorage.getItem('authToken');
      await axios.post('https://rc-fitness-backend.vercel.app/api/shop/promotions/add', {
        code: newPromo.code.toUpperCase(),
        discountPercentage: Number(newPromo.discountPercentage)
      }, { headers: { 'auth-token': token } });
      setNewPromo({ code: '', discountPercentage: '' });
      fetchData();
    } catch (err) { console.error(err); }
  };

  const handleDeletePromo = async (id) => {
    try {
      const token = localStorage.getItem('authToken');
      await axios.delete(`https://rc-fitness-backend.vercel.app/api/shop/promotions/delete/${id}`, { headers: { 'auth-token': token } });
      fetchData();
    } catch (err) { console.error(err); }
  };

  const handleTogglePromo = async (id) => {
    try {
      const token = localStorage.getItem('authToken');
      await axios.put(`https://rc-fitness-backend.vercel.app/api/shop/promotions/toggle/${id}`, {}, { headers: { 'auth-token': token } });
      fetchData();
    } catch (err) { console.error(err); }
  };

  const handleUpdateOrderStatus = async (orderId, newStatus) => {
    try {
      const token = localStorage.getItem('authToken');
      await axios.put(`https://rc-fitness-backend.vercel.app/api/shop/orders/${orderId}/status`, { status: newStatus }, { headers: { 'auth-token': token } });
      setOrders(orders.map(o => o._id === orderId ? { ...o, status: newStatus } : o));
    } catch (err) { console.error("Error updating order status:", err); }
  };

  return (
    <div className="flex bg-[#080808] min-h-screen text-white font-sans">
      <Sidebar />
      <main className="flex-1 p-6 lg:p-12 lg:ml-64 pt-24 lg:pt-12">
        <header className="flex flex-col lg:flex-row justify-between items-center gap-6 mb-10">
          <div className="text-center lg:text-left">
            <h1 className="text-4xl font-black uppercase tracking-tighter italic leading-none flex items-center justify-center lg:justify-start gap-4">
              <ShoppingBag className="text-purple-600" size={36} /> Shop Management
            </h1>
            <p className="text-gray-500 text-[10px] font-bold uppercase tracking-[0.3em] mt-2">Inventory, Orders & Promos</p>
          </div>
          <div className="flex gap-4 w-full lg:w-auto">
            <div className="bg-[#111] border border-gray-900 rounded-2xl p-1 flex gap-1">
              <button 
                onClick={() => setActiveTab('inventory')}
                className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'inventory' ? 'bg-purple-600 text-white shadow-lg' : 'text-gray-500 hover:text-white'}`}
              >
                Inventory
              </button>
              <button 
                onClick={() => setActiveTab('orders')}
                className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'orders' ? 'bg-purple-600 text-white shadow-lg' : 'text-gray-500 hover:text-white'}`}
              >
                Orders
              </button>
              <button 
                onClick={() => setActiveTab('promos')}
                className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'promos' ? 'bg-purple-600 text-white shadow-lg' : 'text-gray-500 hover:text-white'}`}
              >
                Promos
              </button>
            </div>
            {activeTab === 'inventory' && (
              <button 
                onClick={() => { setIsFormVisible(!isFormVisible); setEditProductId(null); setNewProduct({ name: '', category: '', price: '', stock: '', description: '', images: [] }); }} 
                className="bg-purple-600 hover:bg-purple-700 px-6 py-3 rounded-xl font-black uppercase text-[10px] tracking-widest shadow-2xl transition-all active:scale-95 flex items-center gap-2"
              >
                {isFormVisible ? <X size={14} /> : <Plus size={14} />} {isFormVisible ? 'Close' : 'Add'}
              </button>
            )}
          </div>
          <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto mt-4 lg:mt-0">
            <button 
              onClick={() => setShowReportModal(true)} 
              className="w-full lg:w-auto bg-[#111] hover:bg-purple-900/20 text-purple-500 border border-purple-900/30 px-6 py-4 rounded-2xl font-black uppercase text-[10px] tracking-widest transition-all active:scale-95"
            >
              Generate Stock Report
            </button>
            <button 
              onClick={() => { setIsFormVisible(!isFormVisible); setEditProductId(null); setNewProduct({ name: '', category: '', price: '', stock: '', description: '', images: [] }); }} 
              className="w-full lg:w-auto bg-purple-600 hover:bg-purple-700 px-6 py-4 rounded-2xl font-black uppercase text-[10px] tracking-widest shadow-2xl transition-all active:scale-95"
            >
              {isFormVisible ? 'Close Form' : <><Plus size={14} className="inline mr-2" /> Add Product</>}
            </button>
          </div>
        </header>

        {activeTab === 'inventory' && (
          <>
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
                    <option value="WheyProtein">Whey Protein</option>
                    <option value="MassGainer">Mass Gainer</option>
                    <option value="Creatine">Creatine</option>
                    <option value="PreWorkout">Pre-Workout</option>
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
        </>
        )}

        {activeTab === 'orders' && (
          <section className="bg-[#111] border border-gray-900 rounded-3xl p-6 lg:p-8 shadow-xl animate-in fade-in slide-in-from-bottom-4">
            <div className="flex items-center gap-3 mb-6 border-b border-gray-900 pb-4">
              <ClipboardList className="text-purple-500" size={24} />
              <h2 className="text-2xl font-black uppercase italic tracking-wider">Recent Orders</h2>
            </div>
            
            <div className="space-y-4">
              {orders.map(order => (
                <div key={order._id} className="bg-black border border-gray-800 rounded-2xl p-6 hover:border-gray-700 transition-colors">
                  <div className="flex flex-col lg:flex-row justify-between gap-8">
                    <div className="flex-1">
                      <div className="flex flex-wrap items-center gap-3 mb-4">
                        <StatusBadge status={order.status} />
                        <span className="text-[10px] font-black uppercase tracking-widest bg-blue-600/10 text-blue-400 px-3 py-1 rounded-full border border-blue-900/30">{order.paymentMethod}</span>
                        <span className="text-[10px] font-bold text-gray-600 uppercase tracking-widest">{new Date(order.createdAt).toLocaleString()}</span>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-6">
                        <div>
                          <h4 className="text-lg font-black uppercase italic tracking-tight mb-1">{order.userName}</h4>
                          <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">{order.userEmail}</p>
                          {order.billingDetails && (
                            <div className="mt-4 p-4 bg-[#080808] rounded-xl border border-gray-900 space-y-2">
                               <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest border-b border-gray-900 pb-2 mb-2 italic">Delivery Logistics</p>
                               <p className="text-[11px] text-gray-300 leading-relaxed font-medium"><span className="text-gray-600 uppercase text-[9px] mr-2">Address:</span> {order.billingDetails.address}, {order.billingDetails.city} {order.billingDetails.zip}</p>
                               <p className="text-[11px] text-gray-300 font-medium"><span className="text-gray-600 uppercase text-[9px] mr-2">Phone:</span> {order.billingDetails.phone}</p>
                               {order.billingDetails.orderNotes && (
                                 <p className="text-[10px] text-yellow-500/80 italic font-medium bg-yellow-500/5 p-2 rounded-lg mt-2 underline decoration-yellow-900/50 underline-offset-4">" {order.billingDetails.orderNotes} "</p>
                               )}
                            </div>
                          )}
                        </div>
                        
                        <div className="space-y-3">
                          <p className="text-[10px] font-black uppercase tracking-widest text-gray-600 mb-2 italic">Purchased Items</p>
                          {order.products.map((item, idx) => (
                            <div key={idx} className="flex items-center gap-3 bg-[#080808] p-3 rounded-xl border border-gray-900 group hover:border-purple-900/30 transition-colors">
                               <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center text-[10px] font-black text-purple-500 border border-gray-800 group-hover:border-purple-600/50 transition-colors">{item.quantity}x</div>
                               <div className="flex-1">
                                 <p className="text-[10px] font-black uppercase tracking-tight line-clamp-1">{item.name}</p>
                                 <p className="text-[9px] font-bold text-gray-600 uppercase tracking-widest">Unit: LKR {item.price.toLocaleString()}</p>
                               </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="lg:w-64 flex flex-col justify-between items-end border-t lg:border-t-0 lg:border-l border-gray-900 pt-6 lg:pt-0 lg:pl-8">
                       <div className="text-right w-full">
                         <p className="text-[9px] font-black uppercase tracking-[0.2em] text-gray-600 mb-1">Order Total</p>
                         <p className="text-3xl font-black italic tracking-tighter text-purple-500 mb-2">LKR {order.totalAmount.toLocaleString()}</p>
                         {order.promoCode && (
                           <div className="flex items-center justify-end gap-1 text-green-500 text-[9px] font-black uppercase tracking-widest bg-green-500/5 px-2 py-1 rounded-lg border border-green-900/20">
                              <Ticket size={10} /> {order.promoCode} (-{order.discountAmount})
                           </div>
                         )}
                       </div>

                       <div className="w-full space-y-2 mt-6">
                         <p className="text-[10px] font-black uppercase tracking-widest text-gray-600 text-center mb-3">Fulfillment Status</p>
                         <div className="grid grid-cols-2 gap-2">
                           {['Pending', 'Shipped', 'Delivered', 'Cancelled'].map(s => (
                             <button 
                                key={s}
                                onClick={() => handleUpdateOrderStatus(order._id, s)}
                                className={`py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all border ${
                                  order.status === s 
                                  ? 'bg-purple-600/20 border-purple-500 text-purple-400 shadow-[0_0_15px_rgba(168,85,247,0.2)]' 
                                  : 'bg-transparent border-gray-900 text-gray-700 hover:border-gray-600 hover:text-gray-400'
                                }`}
                             >
                               {s}
                             </button>
                           ))}
                         </div>
                       </div>
                    </div>
                  </div>
                </div>
              ))}
              {orders.length === 0 && <p className="text-center text-gray-600 text-xs font-black uppercase tracking-widest py-10 opacity-50">No orders placed yet.</p>}
            </div>
          </section>
        )}

        {activeTab === 'promos' && (
          <section className="bg-[#111] border border-gray-900 rounded-3xl p-6 lg:p-8 shadow-xl animate-in fade-in slide-in-from-bottom-4">
            <div className="flex items-center gap-3 mb-6 border-b border-gray-900 pb-4">
              <Ticket className="text-purple-500" size={24} />
              <h2 className="text-2xl font-black uppercase italic tracking-wider">Promotion Codes</h2>
            </div>

            <form onSubmit={handleAddPromo} className="mb-8 grid grid-cols-1 md:grid-cols-3 gap-4 bg-black p-4 rounded-2xl border border-gray-800">
               <input type="text" placeholder="Promo Code (e.g. FIT20)" value={newPromo.code} onChange={e => setNewPromo({...newPromo, code: e.target.value.toUpperCase()})} className="bg-[#080808] border border-gray-800 rounded-xl px-4 py-3 text-xs focus:outline-none focus:border-purple-600 font-black uppercase" required />
               <input type="number" placeholder="Discount %" value={newPromo.discountPercentage} onChange={e => setNewPromo({...newPromo, discountPercentage: e.target.value})} className="bg-[#080808] border border-gray-800 rounded-xl px-4 py-3 text-xs focus:outline-none focus:border-purple-600 font-black" required />
               <button type="submit" className="bg-purple-600 hover:bg-purple-700 text-white font-black uppercase text-[10px] tracking-widest py-3 rounded-xl transition-all shadow-lg flex items-center justify-center gap-2">
                 <Plus size={14} /> Create Promo
               </button>
            </form>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {promos.map(promo => (
                <div key={promo._id} className="bg-black border border-gray-800 rounded-2xl p-5 flex items-center justify-between group hover:border-gray-700 transition-colors">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-black text-lg tracking-tighter italic text-white uppercase">{promo.code}</h4>
                      {promo.isActive ? <ShieldCheck size={14} className="text-green-500" /> : <ShieldAlert size={14} className="text-red-500" />}
                    </div>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-purple-500">{promo.discountPercentage}% Discount</p>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => handleTogglePromo(promo._id)} className={`p-2 rounded-lg border transition-colors ${promo.isActive ? 'bg-green-500/10 border-green-900/30 text-green-500 hover:bg-yellow-500/10 hover:text-yellow-500 hover:border-yellow-900/30' : 'bg-red-500/10 border-red-900/30 text-red-500 hover:bg-green-500/10 hover:text-green-500 hover:border-green-900/30'}`}>
                      {promo.isActive ? 'Deactivate' : 'Activate'}
                    </button>
                    <button onClick={() => handleDeletePromo(promo._id)} className="p-2 bg-red-900/20 text-red-500 border border-red-900/30 rounded-lg hover:bg-red-600 hover:text-white transition-all">
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              ))}
              {promos.length === 0 && <p className="col-span-full text-center text-gray-600 text-xs font-black uppercase tracking-widest py-10 opacity-50">No promotions active.</p>}
            </div>
          </section>
        )}

        {showReportModal && (
          <InventoryReportModal 
            products={products} 
            onClose={() => setShowReportModal(false)} 
          />
        )}

      </main>
    </div>
  );
};

const StatusBadge = ({ status }) => {
  const styles = {
    Pending: 'bg-yellow-600/10 border-yellow-900/30 text-yellow-500',
    Shipped: 'bg-blue-600/10 border-blue-900/30 text-blue-500',
    Delivered: 'bg-green-600/10 border-green-900/30 text-green-500',
    Cancelled: 'bg-red-600/10 border-red-900/30 text-red-500',
    Paid: 'bg-purple-600/10 border-purple-900/30 text-purple-500'
  };
  return <span className={`text-[10px] font-black uppercase tracking-widest border rounded-full px-3 py-1 ${styles[status] || styles.Pending}`}>{status}</span>;
};

export default Shop;
