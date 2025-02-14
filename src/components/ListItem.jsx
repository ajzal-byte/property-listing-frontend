import React from 'react';
import { Heart, Expand, ChevronDown, Plus, Star, Clock, MapPin } from 'lucide-react';

const ListItem = ({ image, title, developer, price, description, rating, location, address, walkingTime, isPopular, isCompleted }) => {
  return (
    <div className="group w-[110%] bg-white rounded-lg border border-gray-100 hover:shadow-lg transition-all duration-300 ease-in-out overflow-hidden">
      <div className="flex items-center p-4 gap-4">
        {/* Property Image */}
        <div className="w-40 h-32 overflow-hidden rounded-lg flex-shrink-0">
          <img 
            src={image}
            alt={title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        </div>

        {/* Main Content */}
        <div className="flex-1">
          <div className="flex justify-between items-start">
            <div>
              <div className="flex items-center gap-3">
                <h3 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                  {title}
                </h3>
                {isPopular && (
                  <span className="px-2 py-1 bg-blue-50 text-blue-600 text-xs rounded-full">
                    Popular
                  </span>
                )}
              </div>
              <p className="text-sm text-gray-500 mt-1">{developer}</p>
            </div>
            <div className="flex items-center gap-1">
              <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
              <span className="text-sm font-medium text-gray-700">{rating}</span>
            </div>
          </div>

          <div className="mt-3 flex items-center gap-4 text-sm text-gray-600">
            <div className="flex items-center gap-1">
              <MapPin className="w-4 h-4" />
              {location}
            </div>
            <div className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              {walkingTime} min walk
            </div>
          </div>

          <div className="mt-2 text-sm text-gray-600">
            {description}
          </div>

          <div className="mt-3 flex items-center justify-between">
            <p className="text-lg font-semibold text-blue-600">{price}</p>
            <div className="flex items-center gap-1">
              <button className="p-2 hover:bg-gray-50 rounded-lg transition-colors duration-200">
                <Plus className="w-5 h-5 text-gray-400 hover:text-blue-500 transition-colors" />
              </button>
              <button className="p-2 hover:bg-gray-50 rounded-lg transition-colors duration-200">
                <Heart className="w-5 h-5 text-gray-400 hover:text-rose-500 transition-colors" />
              </button>
              <button className="p-2 hover:bg-gray-50 rounded-lg transition-colors duration-200">
                <Expand className="w-5 h-5 text-gray-400 hover:text-blue-500 transition-colors" />
              </button>
              <button className="p-2 hover:bg-gray-50 rounded-lg transition-colors duration-200">
                <ChevronDown className="w-5 h-5 text-gray-400 hover:text-blue-500 transition-colors" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ListItem