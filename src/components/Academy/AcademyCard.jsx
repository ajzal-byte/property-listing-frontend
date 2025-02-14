import React, { useState, useEffect } from 'react';
import { ArrowUpRight } from 'lucide-react';

const AnimatedStatsCard = ({ targetNumber, title }) => {
  const [currentNumber, setCurrentNumber] = useState(0);

  useEffect(() => {
    const steps = 100; // Number of steps for animation
    const stepDuration = 1000 / steps;
    const stepValue = targetNumber / steps;
    let currentStep = 0;

    const interval = setInterval(() => {
      currentStep++;
      if (currentStep === steps) {
        setCurrentNumber(targetNumber);
        clearInterval(interval);
      } else {
        setCurrentNumber(Math.floor(stepValue * currentStep));
      }
    }, stepDuration);

    return () => clearInterval(interval);
  }, [targetNumber]);

  return (
    <div className="flex items-center justify-center p-6">
      <div className="group bg-gradient-to-br from-emerald-50 to-green-100 p-6 rounded-2xl shadow-lg 
                      hover:shadow-2xl hover:scale-105 hover:from-emerald-100 hover:to-green-200
                      transition-all duration-300 ease-in-out w-72">
        <div className="flex items-center justify-between mb-4">
          <div className="bg-emerald-500/10 p-3 rounded-xl group-hover:rotate-12 group-hover:bg-emerald-500/20 
                          transition-all duration-300">
            <ArrowUpRight className="w-6 h-6 text-emerald-600 group-hover:scale-110" />
          </div>
          <div className="bg-emerald-500/10 text-emerald-600 text-sm font-medium px-3 py-1 rounded-full
                          group-hover:bg-emerald-600 group-hover:text-white transition-all duration-300">
            +12.5%
          </div>
        </div>
        
        <div className="space-y-2">
          <h3 className="text-4xl font-bold text-gray-800 group-hover:text-emerald-700 
                         transition-colors duration-300">
            {currentNumber.toLocaleString()}
          </h3>
          <p className="text-gray-600 group-hover:text-gray-700">{title}</p>
        </div>
        
        <div className="mt-4 pt-4 border-t border-gray-200 group-hover:border-emerald-200">
          <p className="text-sm text-gray-500">
            <span className="text-emerald-600 font-medium group-hover:text-emerald-700">↑ 18% </span>
            vs last month
          </p>
        </div>
      </div>
    </div>
  );
};

export default AnimatedStatsCard;