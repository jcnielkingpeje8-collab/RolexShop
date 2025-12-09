import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, MapPin } from 'lucide-react';
import { supabase } from '../supabase';
import { useCart } from '../context/CartContext';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';

// Replace with your Stripe Public Key
const stripePromise = loadStripe('pk_test_51ScWeGAWaVFG19K0HyTAXaE4ge5r0Z9L6MyCvV5rwTlsKi5QkUh35Sk6bJsyW0QqIKxy2FdGItkwtwmk9vYVK07E00LBsU8o80'); 

const CheckoutForm = ({ totalAmount, onSuccess }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [error, setError] = useState(null);
  const [processing, setProcessing] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!stripe || !elements) return;

    setProcessing(true);
    const { error, paymentMethod } = await stripe.createPaymentMethod({
      type: 'card',
      card: elements.getElement(CardElement),
    });

    if (error) {
      setError(error.message);
      setProcessing(false);
    } else {
      onSuccess(paymentMethod.id);
      setProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mt-6 border border-gray-100 p-5 rounded-xl bg-gray-50 font-[Roboto]">
      <h3 className="text-[14px] font-[Poppins] font-medium mb-4">Secure Payment</h3>
      
      <div className="bg-white p-3 rounded-lg border border-gray-100 mb-4">
        <CardElement options={{
          style: {
            base: { 
              fontSize: '11px', 
              color: '#000', 
              fontFamily: 'Roboto, sans-serif',
              '::placeholder': { color: '#aab7c4' } 
            },
            invalid: { color: '#ef4444' },
          },
        }}/>
      </div>
      
      {error && <div className="text-red-500 text-[11px] mb-3 font-medium">{error}</div>}
      
      <button 
        type="submit" 
        disabled={!stripe || processing}
        className="w-full bg-black text-white py-4 rounded-xl font-medium text-[11px] font-[Poppins] disabled:bg-gray-400 transition tracking-wide uppercase"
      >
        {processing ? 'Processing...' : `Pay $${totalAmount.toLocaleString()}`}
      </button>
    </form>
  );
};

const CheckoutPage = () => {
  const { cart, clearCart } = useCart();
  const navigate = useNavigate();
  const [address, setAddress] = useState('');
  const [voucher, setVoucher] = useState('');
  const [discount, setDiscount] = useState(0);

  // --- UPDATED CALCULATIONS ---
  const SHIPPING_RATE_PER_KG = 1; // Now $1 per 1kg
  
  const subtotal = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);
  const totalWeight = cart.reduce((sum, item) => sum + (item.weight * item.qty), 0);
  
  // Logic: 1kg = $1
  const shippingFee = totalWeight * SHIPPING_RATE_PER_KG;
  
  const finalTotal = subtotal + shippingFee - discount;

  const handleApplyVoucher = async () => {
    const { data } = await supabase.from('vouchers').select('*').eq('code', voucher).single();
    if (data) { 
        setDiscount(data.discount_amount); 
        alert(`Voucher Applied: -$${data.discount_amount}`); 
    } else {
        alert('Invalid Voucher Code');
    }
  };

  const handlePaymentSuccess = async (paymentMethodId) => {
    if (!address) return alert('Please enter a delivery address.');
    
    const { data: { user } } = await supabase.auth.getUser();
    
    // Create Order with detailed notes
    const { data: order, error } = await supabase.from('orders').insert({
      user_id: user.id, 
      total_amount: finalTotal, 
      shipping_address: address,
      status: 'Paid',
      delivery_notes: `Weight: ${totalWeight.toFixed(2)}kg | Shipping Fee: $${shippingFee.toFixed(2)}`
    }).select().single();

    if (error) {
      console.error(error);
      return alert('Error creating order.');
    }

    const items = cart.map(i => ({ 
      order_id: order.id, 
      product_id: i.id, 
      quantity: i.qty, 
      price_at_purchase: i.price 
    }));
    
    await supabase.from('order_items').insert(items);
    clearCart();
    alert(`Payment Successful! Order ID: ${order.id}`);
    navigate('/home');
  };

  return (
    <div className="p-5 pb-24 bg-white min-h-screen font-[Poppins] text-gray-800">
      
      {/* Header */}
      <div className="flex items-center mb-8">
        <button onClick={() => navigate(-1)} className="mr-3 hover:bg-gray-100 p-2 rounded-full transition">
           <ChevronLeft size={20} />
        </button>
        <h2 className="text-[14px] font-medium tracking-wide">Checkout</h2>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        
        {/* Left Column: Details */}
        <div className="flex-1 space-y-6">
          
          {/* Order Summary */}
          <div className="border border-gray-100 p-6 rounded-xl shadow-sm">
            <h3 className="text-[14px] font-medium mb-4 border-b border-gray-100 pb-3">Order Details</h3>
            
            <div className="flex justify-between text-[11px] mb-2 font-[Roboto] text-gray-500">
                <span>Subtotal</span>
                <span>${subtotal.toLocaleString()}</span>
            </div>

            <div className="flex justify-between text-[11px] mb-2 font-[Roboto] text-gray-500">
                <span>Total Weight</span>
                <span>{totalWeight.toFixed(2)} kg</span>
            </div>

            <div className="flex justify-between text-[11px] mb-2 font-[Roboto] text-blue-600 font-medium">
                <span>Shipping Fee ($1/kg)</span>
                <span>+${shippingFee.toFixed(2)}</span>
            </div>

            {discount > 0 && (
                <div className="flex justify-between text-[11px] mb-2 font-[Roboto] text-red-500 font-medium">
                    <span>Voucher Discount</span>
                    <span>-${discount}</span>
                </div>
            )}

            <div className="border-t border-gray-100 mt-4 pt-4 flex justify-between text-[14px] font-medium">
                <span>Total to Pay</span>
                <span>${finalTotal.toLocaleString()}</span>
            </div>
          </div>

          {/* Voucher Input */}
          <div className="flex gap-3">
            <input 
                type="text" 
                placeholder="Voucher Code" 
                value={voucher}
                onChange={e=>setVoucher(e.target.value)} 
                className="flex-1 p-3 border border-gray-100 bg-gray-50 rounded-xl text-[11px] font-[Roboto] outline-none focus:border-black transition" 
            />
            <button onClick={handleApplyVoucher} className="bg-gray-900 text-white px-6 rounded-xl text-[11px] font-medium hover:bg-black transition">APPLY</button>
          </div>

          {/* Delivery Address */}
          <div className="border border-gray-100 p-6 rounded-xl shadow-sm">
            <h3 className="text-[14px] font-medium mb-3 flex items-center gap-2">
                <MapPin size={16} /> Delivery Address
            </h3>
            <textarea 
                placeholder="Enter your full delivery address..." 
                value={address}
                onChange={e=>setAddress(e.target.value)} 
                className="w-full bg-gray-50 p-3 rounded-lg outline-none text-[11px] font-[Roboto] min-h-[80px] border border-gray-100 focus:border-black transition resize-none" 
            />
          </div>
        </div>

        {/* Right Column: Payment (Sticky on Desktop) */}
        <div className="lg:w-96">
           <Elements stripe={stripePromise}>
              <CheckoutForm totalAmount={finalTotal} onSuccess={handlePaymentSuccess} />
           </Elements>
        </div>

      </div>
    </div>
  );
};

export default CheckoutPage;