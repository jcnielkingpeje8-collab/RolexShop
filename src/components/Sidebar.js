import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { Home, Clock, User, LogOut } from 'lucide-react';
import { supabase } from '../supabase';

const Sidebar = () => {
  const location = useLocation();

  // If we are on these pages, DO NOT show sidebar
  if (['/auth', '/checkout', '/landing', '/'].includes(location.pathname)) return null;

  return (
    // 'w-64' sets width, 'flex-shrink-0' ensures it doesn't get squished
    <div className="hidden md:flex flex-col w-64 bg-white border-r border-gray-200 h-screen sticky top-0 z-50 flex-shrink-0">
      <div className="p-6 border-b border-gray-100">
        <h1 className="text-2xl font-bold tracking-widest">ROLEX</h1>
        <p className="text-[10px] text-gray-400 tracking-[0.2em] mt-1">BOUTIQUE</p>
      </div>

      <div className="flex-1 py-6 flex flex-col gap-2 px-3">
        <NavLink to="/home" className={({isActive}) => `flex items-center gap-3 px-4 py-3 rounded-lg text-[13px] font-medium transition ${isActive ? 'bg-black text-white' : 'text-gray-500 hover:bg-gray-50'}`}>
           <Home size={18} /> Collection
        </NavLink>
        <NavLink to="/history" className={({isActive}) => `flex items-center gap-3 px-4 py-3 rounded-lg text-[13px] font-medium transition ${isActive ? 'bg-black text-white' : 'text-gray-500 hover:bg-gray-50'}`}>
           <Clock size={18} /> History
        </NavLink>
        <NavLink to="/profile" className={({isActive}) => `flex items-center gap-3 px-4 py-3 rounded-lg text-[13px] font-medium transition ${isActive ? 'bg-black text-white' : 'text-gray-500 hover:bg-gray-50'}`}>
           <User size={18} /> Profile
        </NavLink>
      </div>

      <div className="p-4 border-t border-gray-100">
        <button onClick={async () => { await supabase.auth.signOut(); window.location.href = '/'; }} className="flex items-center gap-3 px-4 py-3 text-red-500 w-full text-[13px] font-medium hover:bg-red-50 rounded-lg">
          <LogOut size={18} /> Sign Out
        </button>
      </div>
    </div>
  );
};

export default Sidebar;