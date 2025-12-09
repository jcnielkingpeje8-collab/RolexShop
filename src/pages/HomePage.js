import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShoppingBag, Search, Check } from 'lucide-react'; // Added 'Check' icon
import { supabase } from '../supabase';
import { useCart } from '../context/CartContext';
import Loading from '../components/Loading';

// --- Internal Component for Individual Product Logic ---
const ProductCard = ({ product, addToCart }) => {
  const [isAdded, setIsAdded] = useState(false);

  const handleAdd = () => {
    addToCart(product, 'Silver');
    
    // Trigger Animation
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 1500); // Reset after 1.5 seconds
  };

  return (
    <div className="bg-white p-4 flex flex-col hover:z-10 hover:shadow-2xl transition-all duration-300 border-r border-b border-gray-50 group">
      <div className="aspect-square mb-3 overflow-hidden relative">
        <img 
          src={product.image_url} 
          alt={product.name} 
          className="w-full h-full object-cover mix-blend-multiply group-hover:scale-110 transition duration-700" 
        />
        {/* Optional: Quick Add Overlay on Mobile/Desktop */}
      </div>
      
      <h3 className="text-[13px] font-bold truncate font-[Poppins]">{product.name}</h3>
      <p className="text-[11px] text-gray-500 mb-3 font-[Roboto]">{product.description.substring(0, 25)}...</p>
      
      <div className="mt-auto flex flex-col gap-2">
          <span className="text-[13px] font-medium font-[Poppins]">${product.price.toLocaleString()}</span>
          
          {/* ANIMATED BUTTON */}
          <button 
            onClick={handleAdd} 
            disabled={isAdded}
            className={`
              w-full py-2 px-3 rounded text-[11px] font-medium font-[Poppins] uppercase tracking-wide transition-all duration-300 flex items-center justify-center gap-2
              ${isAdded 
                ? 'bg-green-600 text-white scale-95' /* Success State */
                : 'bg-black text-white hover:bg-gray-800 active:scale-95' /* Default State */
              }
            `}
          >
            {isAdded ? (
              <>
                <Check size={14} /> Added
              </>
            ) : (
              'Add to Cart'
            )}
          </button>
      </div>
    </div>
  );
};

// --- Main Page Component ---
const HomePage = () => {
  const { cart, addToCart } = useCart();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('All');
  const [search, setSearch] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      await new Promise(resolve => setTimeout(resolve, 500)); 
      const { data } = await supabase.from('products').select('*');
      if (data) setProducts(data);
      setLoading(false);
    };
    fetchProducts();
  }, []);

  const filtered = products.filter(p => 
    (filter === 'All' || p.category === filter) && 
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50 pb-20 font-[Poppins]">
      
      {/* Header */}
      <div className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-gray-200 p-4">
        <div className="w-full flex justify-between items-center">
          <h1 className="text-[20px] font-bold tracking-widest">ROLEX</h1>
          <div className="relative cursor-pointer transition active:scale-90" onClick={() => navigate('/cart')}>
            <ShoppingBag size={22} />
            {cart.length > 0 && (
              <span className="absolute -top-1 -right-1 bg-black text-white text-[9px] w-4 h-4 rounded-full flex items-center justify-center font-bold animate-bounce">
                {cart.length}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="w-full">
        <div className="bg-white border-b border-gray-100 p-4 flex flex-col md:flex-row gap-4 sticky top-[60px] z-30">
           <div className="flex-1 flex items-center bg-gray-100 px-3 py-2 rounded-lg">
            <Search size={16} className="text-gray-400 mr-2" />
            <input 
              type="text" placeholder="Search..." 
              className="bg-transparent outline-none w-full text-[13px] font-[Roboto]"
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="flex gap-2">
            {['All', 'Men', 'Women'].map(cat => (
              <button key={cat} onClick={() => setFilter(cat)}
                className={`px-4 py-2 rounded-lg text-[12px] font-medium transition-all ${
                  filter === cat ? 'bg-black text-white' : 'bg-gray-100 text-gray-600'
                }`}>
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Product Grid using the new ProductCard */}
        {loading ? <Loading /> : (
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-1">
             {filtered.map((p) => (
                <ProductCard key={p.id} product={p} addToCart={addToCart} />
             ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default HomePage;