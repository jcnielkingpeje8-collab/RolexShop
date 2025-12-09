import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';
import { useCart } from '../context/CartContext';

const CartPage = () => {
  const { cart, updateQty, removeFromCart } = useCart();
  const navigate = useNavigate();
  const total = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);

  return (
    <div className="p-5 min-h-screen bg-gray-50 font-[Poppins]">
      <div className="flex items-center mb-6">
        <ChevronLeft onClick={() => navigate(-1)} className="mr-2 cursor-pointer"/>
        <h2 className="text-[14px] font-medium">My Cart</h2>
      </div>

      <div className="space-y-4 mb-20">
        {cart.map(item => (
          <div key={`${item.id}-${item.selectedColor}`} className="bg-white p-3 rounded-lg flex gap-3 shadow-sm">
            <img src={item.image_url} alt={item.name} className="w-20 h-20 object-contain bg-gray-50 rounded" />
            <div className="flex-1">
              <h3 className="text-[14px] font-medium">{item.name}</h3>
              <p className="text-[11px] text-gray-500 font-[Roboto]">Color: {item.selectedColor}</p>
              <p className="text-[14px] font-medium mt-1">${item.price}</p>
            </div>
            <div className="flex flex-col items-end justify-between">
              <button onClick={() => removeFromCart(item.id, item.selectedColor)} className="text-gray-400 text-[11px]">Remove</button>
              <div className="flex items-center bg-gray-100 rounded px-2 py-1">
                <button onClick={() => updateQty(item.id, item.selectedColor, -1)} className="px-2 font-bold">-</button>
                <span className="text-[11px] w-4 text-center">{item.qty}</span>
                <button onClick={() => updateQty(item.id, item.selectedColor, 1)} className="px-2 font-bold">+</button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="fixed bottom-0 left-0 w-full bg-white p-5 border-t">
        <div className="flex justify-between mb-4">
          <span className="text-[14px] font-medium">Total:</span>
          <span className="text-[14px] font-bold">${total}</span>
        </div>
        <button onClick={() => navigate('/checkout')} className="w-full bg-black text-white py-3 rounded font-medium text-[14px]">
          Proceed to Checkout
        </button>
      </div>
    </div>
  );
};

export default CartPage;