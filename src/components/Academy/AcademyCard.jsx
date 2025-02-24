import React, { useState, useEffect } from 'react';
import { ArrowUpRight } from 'lucide-react';

// Color mapping utility
const getColorClasses = (color) => {
  const colorMap = {
    emerald: {
      gradientFrom: 'from-emerald-50',
      gradientTo: 'to-green-100',
      hoverGradientFrom: 'group-hover:from-emerald-100',
      hoverGradientTo: 'group-hover:to-green-200',
      iconBg: 'bg-emerald-500/10',
      iconHoverBg: 'group-hover:bg-emerald-500/20',
      iconColor: 'text-emerald-600',
      badgeBg: 'bg-emerald-500/10',
      badgeText: 'text-emerald-600',
      badgeHoverBg: 'group-hover:bg-emerald-600',
      titleHover: 'group-hover:text-emerald-700',
      accentText: 'text-emerald-600',
      accentHover: 'group-hover:text-emerald-700',
      borderHover: 'group-hover:border-emerald-200'
    },
    blue: {
      gradientFrom: 'from-blue-50',
      gradientTo: 'to-blue-100',
      hoverGradientFrom: 'group-hover:from-blue-100',
      hoverGradientTo: 'group-hover:to-blue-200',
      iconBg: 'bg-blue-500/10',
      iconHoverBg: 'group-hover:bg-blue-500/20',
      iconColor: 'text-blue-600',
      badgeBg: 'bg-blue-500/10',
      badgeText: 'text-blue-600',
      badgeHoverBg: 'group-hover:bg-blue-600',
      titleHover: 'group-hover:text-blue-700',
      accentText: 'text-blue-600',
      accentHover: 'group-hover:text-blue-700',
      borderHover: 'group-hover:border-blue-200'
    },
    purple: {
      gradientFrom: 'from-purple-50',
      gradientTo: 'to-purple-100',
      hoverGradientFrom: 'group-hover:from-purple-100',
      hoverGradientTo: 'group-hover:to-purple-200',
      iconBg: 'bg-purple-500/10',
      iconHoverBg: 'group-hover:bg-purple-500/20',
      iconColor: 'text-purple-600',
      badgeBg: 'bg-purple-500/10',
      badgeText: 'text-purple-600',
      badgeHoverBg: 'group-hover:bg-purple-600',
      titleHover: 'group-hover:text-purple-700',
      accentText: 'text-purple-600',
      accentHover: 'group-hover:text-purple-700',
      borderHover: 'group-hover:border-purple-200'
    },
    rose: {
      gradientFrom: 'from-rose-50',
      gradientTo: 'to-rose-100',
      hoverGradientFrom: 'group-hover:from-rose-100',
      hoverGradientTo: 'group-hover:to-rose-200',
      iconBg: 'bg-rose-500/10',
      iconHoverBg: 'group-hover:bg-rose-500/20',
      iconColor: 'text-rose-600',
      badgeBg: 'bg-rose-500/10',
      badgeText: 'text-rose-600',
      badgeHoverBg: 'group-hover:bg-rose-600',
      titleHover: 'group-hover:text-rose-700',
      accentText: 'text-rose-600',
      accentHover: 'group-hover:text-rose-700',
      borderHover: 'group-hover:border-rose-200'
    }
  };

  return colorMap[color] || colorMap.emerald; // Default to emerald if color not found
};

const AnimatedStatsCard = ({ targetNumber, title, color = 'emerald', description = 'Discover the wonders of learning in a structured and innovative way. Join us now!' }) => {
  const [currentNumber, setCurrentNumber] = useState(0);
  const colors = getColorClasses(color);

  useEffect(() => {
    const steps = 100;
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
    <div className="flex items-center justify-center p-6 cursor-pointer">
      <div className={`group bg-gradient-to-br ${colors.gradientFrom} ${colors.gradientTo} p-6 rounded-2xl shadow-lg 
                      hover:shadow-2xl hover:scale-105 ${colors.hoverGradientFrom} ${colors.hoverGradientTo}
                      transition-all duration-300 ease-in-out w-96`}>
        <div className="flex items-center justify-between mb-4">
          <div className={`${colors.iconBg} p-3 rounded-xl group-hover:rotate-12 ${colors.iconHoverBg} 
                          transition-all duration-300`}>
            <ArrowUpRight className={`w-6 h-6 ${colors.iconColor} group-hover:scale-110`} />
          </div>
          <div className={`${colors.badgeBg} ${colors.badgeText} text-sm font-medium px-3 py-1 rounded-full
                          ${colors.badgeHoverBg} group-hover:text-white transition-all duration-300`}>
            +12.5%
          </div>
        </div>
        
        <div className="space-y-2">
          <h3 className={`text-4xl font-bold text-gray-800 ${colors.titleHover} 
                         transition-colors duration-300`}>
            {currentNumber.toLocaleString()}
          </h3>
          <p className="text-gray-600 group-hover:text-gray-700 pb-1">{title}</p>
          <p className="text-gray-600 group-hover:text-gray-700 text-sm">{description}</p>

        </div>
        
        <div className={`mt-4 pt-4 border-t border-gray-200 ${colors.borderHover}`}>
          <p className="text-sm text-gray-500">
            <span className={`${colors.accentText} font-medium ${colors.accentHover}`}>↑ 18% </span>
            vs last month
          </p>
        </div>
      </div>
    </div>
  );
};

export default AnimatedStatsCard;