import React, { useState } from 'react';
import { Heart, Maximize, Building2, Bed, Bath, Grid2x2 } from 'lucide-react';

const LayoutCard = ({ layout }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);

  const {
    type,
    area,
    areaUnit,
    building,
    floor,
    unitNumber,
    price,
    currency,
    projectName,
    floorPlanImage,
    status,
    rooms,
  } = layout;

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US').format(price);
  };

  return (
    <div 
      className="group relative bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500 ease-out"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Image Container */}
      <div className="relative overflow-hidden flex items-center justify-center">
        <img 
          src={floorPlanImage} 
          alt={`Floor plan for ${type}`}
          className="w-64 h-64 object-cover transform group-hover:scale-105 transition-transform duration-700 ease-out p-4"
        />
        
        <div className={`absolute top-4 left-4 py-1.5 px-3 rounded-full bg-white/90 backdrop-blur-sm 
          text-xs font-semibold text-orange-600 transform transition-all duration-300
          ${isHovered ? 'translate-y-0 opacity-100' : '-translate-y-1 opacity-0'}`}>
          {status}
        </div>

        <div className="absolute top-4 right-4 flex gap-2">
          <button 
            onClick={() => setIsFavorite(!isFavorite)}
            className={`p-2.5 rounded-full transform transition-all duration-300
              ${isHovered ? 'translate-y-0 opacity-100' : 'translate-y-1 opacity-0'}
              ${isFavorite ? 'bg-rose-50' : 'bg-white/90 backdrop-blur-sm'}`}
          >
            <Heart 
              className={`w-5 h-5 transition-colors duration-300 
                ${isFavorite ? 'fill-rose-500 text-rose-500' : 'text-gray-600'}`}
            />
          </button>
          <button 
            className={`p-2.5 rounded-full bg-white/90 backdrop-blur-sm transform transition-all duration-300
              ${isHovered ? 'translate-y-0 opacity-100' : 'translate-y-1 opacity-0'}`}
          >
            <Maximize className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>

      {/* Content */}
      <div className="px-5 py-2">
        {/* Price Tag */}
        <div className="relative -mt-4 mb-4">
          <div className="inline-block px-4 py-2 bg-white rounded-lg shadow-md">
            <p className="text-lg font-semibold text-blue-900">
              {currency} {formatPrice(price)}
            </p>
          </div>
        </div>

        {/* Title Section */}
        <div className="mb-2">
          <h3 className="text-xl font-semibold text-gray-900 group-hover:text-gray-700 transition-colors">
            {type}
          </h3>
          <p className="text-sm text-gray-500 mt-1">
            {projectName}
          </p>
        </div>

        {/* Details Grid */}
        <div className="grid grid-cols-3 gap-4 mb-4">
          <div className="relative group/item">
            <div className="flex items-center p-1 rounded-xl bg-gray-50 group-hover:bg-gray-100 transition-colors">
              <span className="text-sm font-medium text-gray-900 mr-3">{rooms.bedrooms}</span>
              <Bed className="w-4 h-4 text-gray-600 mb-1" />
            </div>
            <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-gray-900 text-white px-3 py-1.5 rounded-lg text-xs font-medium opacity-0 group-hover/item:opacity-100 transition-opacity duration-200 whitespace-nowrap">
              {rooms.bedrooms} Bedroom{rooms.bedrooms !== 1 ? 's' : ''}
            </div>
          </div>
          <div className="relative group/item">
            <div className="flex items-center p-1 rounded-xl bg-gray-50 group-hover:bg-gray-100 transition-colors">
              <span className="text-sm font-medium text-gray-900 mr-3">{rooms.bathrooms}</span>
              <Bath className="w-4 h-4 text-gray-600" />
            </div>
            <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-gray-900 text-white px-3 py-1.5 rounded-lg text-xs font-medium opacity-0 group-hover/item:opacity-100 transition-opacity duration-200 whitespace-nowrap">
              {rooms.bathrooms} Bathroom{rooms.bathrooms !== 1 ? 's' : ''}
            </div>
          </div>
          <div className="relative group/item">
            <div className="flex items-center p-1 rounded-xl bg-gray-50 group-hover:bg-gray-100 transition-colors">
              <span className="text-sm font-medium text-gray-900 mr-3">{area}</span>
              <span className="text-xs text-gray-500">{areaUnit}</span>
            </div>
            <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-gray-900 text-white px-3 py-1.5 rounded-lg text-xs font-medium opacity-0 group-hover/item:opacity-100 transition-opacity duration-200 whitespace-nowrap">
              Area: {area} {areaUnit}
            </div>
          </div>
        </div>

        {/* Location */}
        <div className="flex items-center px-3 pb-2 rounded-lg bg-gray-50">
          <div className="flex-1">
            <span className="text-[0.75em] text-gray-600">
              {building} · Floor {floor} · Unit {unitNumber}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LayoutCard;