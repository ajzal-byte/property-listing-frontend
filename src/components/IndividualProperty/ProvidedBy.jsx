import React from 'react';
import { Star, Medal } from 'lucide-react';

const ProvidedByCard = () => {
  return (
    <div className="max-w-[100%] mx-auto p-6">
      <h2 className="text-2xl font-semibold text-gray-800 mb-6">Provided by</h2>
      
      <div className="flex flex-col md:flex-row gap-6 w-[100%]">
        {/* Company Section */}
        <div className="bg-gray-100 rounded-lg p-6 flex-2">
          <div className="flex flex-col items-center">
            <div className="bg-white p-4 rounded-lg mb-4 w-48">
              <img 
                src="/public/logo.png" 
                alt="Real Estate Org" 
                className="w-full h-auto"
              />
            </div>
            
            <h3 className="text-xl font-medium text-gray-800 mb-4">Real Estate Org - T2</h3>
            
            <button className="flex items-center bg-white rounded-full px-4 py-2 text-sm text-gray-700 shadow-sm border border-gray-200 mb-6">
              <span className="mr-2">💎</span>
              Exclusively on Property Finder
            </button>
            
            <button className="w-full bg-white border border-gray-300 rounded-lg py-3 px-4 text-blue-700 font-medium hover:bg-gray-50">
              See all properties (93)
            </button>
          </div>
        </div>
        
        {/* Agent Section */}
        <div className="bg-gray-100 rounded-lg p-6 flex-2">
          <div className="flex flex-col items-center">
            <div className="relative mb-2">
              <img 
                src="/public/user.png" 
                alt="Vortex Web" 
                className="w-24 h-24 rounded-full object-cover border-4 border-white"
              />
              <div className="absolute -top-1 right-0 bg-indigo-700 text-white text-xs px-2 py-1 rounded flex items-center">
                <Medal size={14} className="mr-1" />
                SUPERAGENT
              </div>
            </div>
            
            <h3 className="text-xl font-medium text-gray-800 mb-2">Vortex Web</h3>
            
            <div className="flex items-center mb-6">
              <span className="text-lg font-semibold mr-2">4.8</span>
              {[1, 2, 3, 4, 5].map((star) => (
                <Star 
                  key={star} 
                  size={20} 
                  className="text-yellow-400 fill-yellow-400" 
                />
              ))}
              <span className="ml-2 text-gray-600">12 Ratings</span>
            </div>
            
            <div className="w-full space-y-4 mb-6">
              <div className="flex justify-between">
                <span className="text-gray-600">Response time</span>
                <span className="font-medium">within 5 minutes</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Closed Deals</span>
                <span className="font-medium">14</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Languages</span>
                <span className="font-medium">English</span>
              </div>
            </div>
            
            <button className="w-full bg-white border border-gray-300 rounded-lg py-3 px-4 text-blue-700 font-medium hover:bg-gray-50">
              See agent properties (19)
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProvidedByCard;