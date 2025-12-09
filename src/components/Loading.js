import React from 'react';

const Loading = () => {
  return (
    <div className="flex flex-col items-center justify-center h-64 w-full">
      <div className="w-8 h-8 border-4 border-gray-200 border-t-black rounded-full animate-spin mb-4"></div>
      <p className="text-[11px] font-[Roboto] text-gray-400 tracking-widest animate-pulse">LOADING COLLECTION</p>
    </div>
  );
};

export default Loading;