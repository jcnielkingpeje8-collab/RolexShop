import React from 'react';
import { Link } from 'react-router-dom';

const LandingPage = () => {
  return (
    <div className="h-screen bg-black text-white flex flex-col justify-center items-center p-6 text-center font-[Poppins]">
      <h1 className="text-3xl font-medium mb-2 tracking-widest text-yellow-500">ROLEX</h1>
      <p className="text-[14px] font-[Roboto] text-gray-400 mb-8">The essence of the watch.</p>
      <Link to="/auth" className="bg-white text-black px-8 py-3 rounded-full text-[14px] font-medium hover:bg-gray-200 transition">
        Enter Boutique
      </Link>
    </div>
  );
};

export default LandingPage;