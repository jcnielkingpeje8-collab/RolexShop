import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { Home, Clock, User } from 'lucide-react';

const BottomNav = () => {
  const location = useLocation();
  
  // Hide on auth/landing pages
  if (['/auth', '/checkout', '/landing', '/'].includes(location.pathname)) return null;

  // Helper for active styles
  const navClass = ({ isActive }) => 
    `flex flex-col items-center p-2 transition-all duration-300 ${
      isActive ? "text-black scale-110" : "text-gray-400"
    }`;

  return (
    // Added 'md:hidden' to hide on desktop
    <div className="md:hidden fixed bottom-0 left-0 w-full bg-white/90 backdrop-blur-md border-t border-gray-100 flex justify-around py-3 z-50 font-[Poppins] pb-safe">
      <NavLink to="/home" className={navClass}>
        <Home size={22} strokeWidth={1.5} />
        <span className="text-[10px] mt-1 font-medium">Home</span>
      </NavLink>
      
      <NavLink to="/history" className={navClass}>
        <Clock size={22} strokeWidth={1.5} />
        <span className="text-[10px] mt-1 font-medium">History</span>
      </NavLink>
      
      <NavLink to="/profile" className={navClass}>
        <User size={22} strokeWidth={1.5} />
        <span className="text-[10px] mt-1 font-medium">Profile</span>
      </NavLink>
    </div>
  );
};

export default BottomNav;