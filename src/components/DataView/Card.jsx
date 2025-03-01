// 

import React, { useState } from 'react';
import { MoreHorizontal, Heart, Share2, MapPin, Star, Check } from 'lucide-react';

const Card = ({ 
  image, 
  title, 
  location, 
  price, 
  description, 
  isPopular, 
  isCompleted, 
  rating = 4.5 
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isLiked, setIsLiked] = useState(false);

  const handleLike = (e) => {
    e.preventDefault();
    // setIsLiked(!isLiked);
    // if (onLike) onLike(!isLiked);
  };

  // Reusable button component
  const IconButton = ({ onClick, children, className = "" }) => (
    <button
      onClick={onClick}
      className={`w-8 h-8 rounded-full bg-white/90 hover:bg-white flex items-center justify-center shadow-sm transition-colors ${className}`}
    >
      {children}
    </button>
  );

  // Reusable badge component
  const Badge = ({ children, className = "" }) => (
    <span 
      className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${className}`}
    >
      {children}
    </span>
  );

  return (
    <div
      className="relative w-full max-w-xs bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Card image section */}
      <div className="relative w-full aspect-video">
        <img
          src={image}
          alt={title}
          className="object-cover w-full h-full"
        />
        
        {/* Status badges - moved to top-left for better visibility */}
        <div className="absolute top-3 left-3 flex flex-col gap-1">
          {isPopular && (
            <Badge className="bg-yellow-400 text-white">
              <Star className="w-3 h-3 mr-1" />
              Popular
            </Badge>
          )}
          {isCompleted && (
            <Badge className="bg-green-500 text-white">
              <Check className="w-3 h-3 mr-1" />
              Completed
            </Badge>
          )}
        </div>

        {/* Action buttons - spaced better */}
        <div className="absolute top-3 right-3 flex gap-1">
          <IconButton onClick={handleLike}>
            <Heart
              className={`w-4 h-4 ${isLiked ? 'fill-red-500 text-red-500' : 'text-gray-700'}`}
            />
          </IconButton>
          <IconButton>
            <Share2 className="w-4 h-4 text-gray-700" />
          </IconButton>
          <IconButton>
            <MoreHorizontal className="w-4 h-4 text-gray-700" />
          </IconButton>
        </div>
      </div>

      {/* Card content section - better spacing */}
      <div className="p-4">
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-semibold text-lg text-gray-800 truncate mr-2">{title}</h3>
          <Badge className="bg-blue-100 text-blue-700 flex-shrink-0">
            {rating} ★
          </Badge>
        </div>
        <div className="flex items-center text-gray-500 text-sm mb-2">
          <MapPin className="w-4 h-4 mr-1 flex-shrink-0" />
          <span className="truncate">{location}</span>
        </div>
        <p className="font-bold text-gray-800 text-lg">{price}</p>
      </div>

      {/* Hover overlay - improved positioning and spacing */}
      <div 
        className={`
          absolute left-0 right-0 bottom-0 bg-white p-4 transform transition-all duration-300
          ${isHovered ? 'translate-y-0 shadow-lg border-t border-blue-400' : 'translate-y-full'}
        `}
      >
        <p className="text-gray-700 text-sm mb-3 overflow-hidden line-clamp-3">{description}</p>
        <button 
          className="w-full bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 rounded-lg transition-colors"
        >
          View Details
        </button>
      </div>
    </div>
  );
};

export default Card;