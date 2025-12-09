import React, { useEffect, useState } from 'react';
import { supabase } from '../supabase';
import { Package, Calendar, ChevronDown, ChevronUp } from 'lucide-react';

const HistoryPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedOrder, setExpandedOrder] = useState(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      // Fetch Orders AND their Items AND the Product details in one go
      const { data, error } = await supabase
        .from('orders')
        .select(`
          *,
          order_items (
            quantity,
            price_at_purchase,
            products (
              name,
              image_url
            )
          )
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setOrders(data);
    } catch (error) {
      console.error("Error fetching history:", error);
    } finally {
      setLoading(false);
    }
  };

  const toggleOrder = (orderId) => {
    setExpandedOrder(expandedOrder === orderId ? null : orderId);
  };

  return (
    <div className="p-5 pb-24 min-h-screen bg-gray-50 font-[Poppins]">
      <h2 className="text-[20px] font-bold mb-6 tracking-wide">Purchase History</h2>

      {loading ? (
        <div className="text-center mt-10 text-[11px] text-gray-400 animate-pulse">LOADING HISTORY...</div>
      ) : orders.length === 0 ? (
        <div className="text-center mt-20 text-gray-400">
          <Package size={48} className="mx-auto mb-3 opacity-20" />
          <p className="text-[13px]">No purchases yet.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div key={order.id} className="bg-white border border-gray-100 rounded-xl overflow-hidden shadow-sm transition-all">
              
              {/* Order Header */}
              <div 
                onClick={() => toggleOrder(order.id)} 
                className="p-4 flex justify-between items-center bg-white cursor-pointer hover:bg-gray-50 transition"
              >
                <div className="flex flex-col gap-1">
                  <span className="text-[10px] text-gray-400 font-[Roboto] uppercase tracking-wider">
                    Order #{order.id}
                  </span>
                  <div className="flex items-center gap-2 text-[11px] text-gray-500">
                    <Calendar size={12} />
                    {new Date(order.created_at).toLocaleDateString()}
                  </div>
                </div>
                
                <div className="flex items-center gap-4">
                  <span className="text-[14px] font-bold">${order.total_amount.toLocaleString()}</span>
                  {expandedOrder === order.id ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                </div>
              </div>

              {/* Order Details (Collapsible) */}
              {expandedOrder === order.id && (
                <div className="bg-gray-50 p-4 border-t border-gray-100 animate-fade-in">
                  
                  {/* Delivery Info */}
                  <div className="mb-4 text-[11px] text-gray-600 bg-white p-3 rounded border border-gray-100">
                    <p className="font-bold mb-1">Delivery To:</p>
                    <p>{order.shipping_address}</p>
                    <p className="mt-2 font-bold">Notes:</p>
                    <p>{order.delivery_notes || "No notes"}</p>
                  </div>

                  {/* Items List */}
                  <div className="space-y-3">
                    {order.order_items.map((item, index) => (
                      <div key={index} className="flex gap-3 items-center bg-white p-2 rounded border border-gray-100">
                        <img 
                          src={item.products?.image_url} 
                          alt={item.products?.name} 
                          className="w-12 h-12 object-contain bg-gray-100 rounded"
                        />
                        <div className="flex-1">
                          <p className="text-[12px] font-bold truncate">{item.products?.name}</p>
                          <p className="text-[10px] text-gray-500">Qty: {item.quantity}</p>
                        </div>
                        <span className="text-[12px] font-medium">${item.price_at_purchase}</span>
                      </div>
                    ))}
                  </div>

                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default HistoryPage;