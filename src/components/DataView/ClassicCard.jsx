import React from 'react';
import { Heart, Maximize2, MapPin, Clock, ArrowUpRight, Plus } from 'lucide-react';

const PropertyCard = ({
  image,
  title,
  developer,
  location,
  address,
  walkingTime,
  isPopular,
  isCompleted,
  amenities,
  layouts
}) => {
  return (
    <div className="bg-white rounded-3xl overflow-hidden border border-gray-100 hover:shadow-lg transition-shadow duration-300">
      <div className="relative">
        {/* Image container */}
        <div className="relative h-64 w-full">
          <img 
            src={image} 
            alt={title}
            className="w-full h-full object-cover"
          />
          
          {/* Overlay buttons */}
          <div className="absolute top-4 right-4 flex gap-2">
            <button className="p-2 bg-white/90 backdrop-blur-sm rounded-full hover:bg-white transition-colors">
              <Plus size={20} className="text-gray-700" />
            </button>
            <button className="p-2 bg-white/90 backdrop-blur-sm rounded-full hover:bg-white transition-colors">
              <Heart size={20} className="text-gray-700" />
            </button>
            <button className="p-2 bg-white/90 backdrop-blur-sm rounded-full hover:bg-white transition-colors">
              <Maximize2 size={20} className="text-gray-700" />
            </button>
          </div>

          {/* Status badges */}
          <div className="absolute top-4 left-4 flex gap-2">
            {isPopular && (
              <span className="px-3 py-1 bg-orange-500 text-white text-sm font-medium rounded-full">
                Popular
              </span>
            )}
            {isCompleted && (
              <span className="px-3 py-1 bg-gray-100 text-gray-700 text-sm font-medium rounded-full">
                Completed
              </span>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Header */}
          <div className="space-y-2">
            <h3 className="text-xl font-semibold text-gray-900">{title}</h3>
            <p className="text-gray-500">Developer: {developer}</p>
            
            {/* Location info */}
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-gray-700">
                <MapPin size={18} className="text-gray-400" />
                <span>{location}</span>
              </div>
              <div className="flex items-center justify-between text-gray-600 text-sm">
                <span>{address}</span>
                <div className="flex items-center gap-1">
                  <Clock size={16} className="text-gray-400" />
                  <span>{walkingTime} min</span>
                </div>
              </div>
            </div>
          </div>

          {/* Map button */}
          <button className="w-full py-3 px-4 bg-gray-50 hover:bg-orange-400 hover:text-white border border-orange-500 transition-colors rounded-xl text-gray-700 font-medium flex items-center justify-center gap-2">
            <MapPin size={18} />
            Show on map
          </button>

          {/* Amenities */}
          <div className="flex flex-wrap gap-2">
            {amenities?.map((amenity, index) => (
              <span 
                key={index}
                className="px-4 py-2 bg-gray-50 rounded-xl text-gray-700 text-sm"
              >
                {amenity}
              </span>
            ))}
          </div>

          {/* Layouts section */}
          <div className="space-y-4 pt-4 border-t border-gray-100">
            <div className="flex justify-between items-center text-gray-600">
              <span className="font-medium">Active:</span>
            </div>
            
            {/* Layout options */}
            {layouts?.map((layout, index) => (
              <div key={index} className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <span>{layout.type}</span>
                  <span className="px-2 py-0.5 bg-gray-100 rounded-full text-sm">
                    {layout.count}
                  </span>
                </div>
                <span className="font-medium">From {layout.price} د.ا</span>
              </div>
            ))}

            {/* View all layouts button */}
            <button className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 transition-colors rounded-xl text-white font-medium flex items-center justify-center gap-2">
              <span>View all layouts</span>
              <ArrowUpRight size={18} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertyCard;