import React, { useState } from 'react';
import { PieChart, ChartNoAxesColumn } from 'lucide-react';

const MinimalToggle = ({mode, toggleMode}) => {
  
  return (
    <div 
      onClick={toggleMode}
      className="relative w-34 h-10 mb-3 mx-3 flex items-center cursor-pointer rounded-full overflow-hidden shadow-lg"
    >
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-r from-violet-500 to-fuchsia-500 opacity-20"></div>
      
      {/* Track */}
      <div className="absolute inset-0 rounded-full border border-gray-700"></div>
      
      {/* Slider */}
      <div 
        className={`absolute top-1 bottom-1 w-1/2 rounded-full transition-all duration-300 ease-in-out flex items-center justify-center backdrop-blur-sm ${
          mode === 'pie' 
            ? 'left-1 bg-gradient-to-r from-pink-500 to-purple-500' 
            : 'left-1/2 -translate-x-1 bg-gradient-to-r from-blue-500 to-cyan-500'
        }`}
      >
        <span className="font-bold text-white">{mode=="pie" ? <PieChart className='w-6 h-6'/> : mode=="bar" ? <ChartNoAxesColumn className='w-6 h-6'/> : ""}</span>
      </div>
      
      {/* Labels */}
      <div className="absolute inset-0 flex">
        <div className="flex-1 flex items-center justify-center">
          <span className={`font-medium transition-all ${mode === 'pie' ? 'opacity-0' : 'text-gray-700 opacity-80'}`}>
            PIE
          </span>
        </div>
        <div className="flex-1 flex items-center justify-center">
          <span className={`font-medium transition-all ${mode === 'bar' ? 'opacity-0' : 'text-gray-700 opacity-80'}`}>
            BAR
          </span>
        </div>
      </div>
    </div>
  );
};

export default MinimalToggle;