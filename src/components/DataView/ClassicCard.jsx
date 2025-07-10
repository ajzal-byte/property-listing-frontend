// import React from 'react';
// import { Heart, Maximize2, MapPin, Clock, ArrowUpRight, Plus } from 'lucide-react';

// const PropertyCard = ({
//   image,
//   title,
//   developer,
//   location,
//   address,
//   walkingTime,
//   isPopular,
//   isCompleted,
//   amenities,
//   layouts
// }) => {
//   return (
//     <div className="bg-white rounded-3xl overflow-hidden border border-gray-100 hover:shadow-lg transition-shadow duration-300">
//       <div className="relative">
//         {/* Image container */}
//         <div className="relative h-64 w-full">
//           <img
//             src={image}
//             alt={title}
//             className="w-full h-full object-cover"
//           />

//           {/* Overlay buttons */}
//           <div className="absolute top-4 right-4 flex gap-2">
//             <button className="p-2 bg-white/90 backdrop-blur-sm rounded-full hover:bg-white transition-colors">
//               <Plus size={20} className="text-gray-700" />
//             </button>
//             <button className="p-2 bg-white/90 backdrop-blur-sm rounded-full hover:bg-white transition-colors">
//               <Heart size={20} className="text-gray-700" />
//             </button>
//             <button className="p-2 bg-white/90 backdrop-blur-sm rounded-full hover:bg-white transition-colors">
//               <Maximize2 size={20} className="text-gray-700" />
//             </button>
//           </div>

//           {/* Status badges */}
//           <div className="absolute top-4 left-4 flex gap-2">
//             {isPopular && (
//               <span className="px-3 py-1 bg-orange-500 text-white text-sm font-medium rounded-full">
//                 Popular
//               </span>
//             )}
//             {isCompleted && (
//               <span className="px-3 py-1 bg-gray-100 text-gray-700 text-sm font-medium rounded-full">
//                 Completed
//               </span>
//             )}
//           </div>
//         </div>

//         {/* Content */}
//         <div className="p-6 space-y-6">
//           {/* Header */}
//           <div className="space-y-2">
//             <h3 className="text-xl font-semibold text-gray-900">{title}</h3>
//             <p className="text-gray-500">Developer: {developer}</p>

//             {/* Location info */}
//             <div className="space-y-2">
//               <div className="flex items-center gap-2 text-gray-700">
//                 <MapPin size={18} className="text-gray-400" />
//                 <span>{location}</span>
//               </div>
//               <div className="flex items-center justify-between text-gray-600 text-sm">
//                 <span>{address}</span>
//                 <div className="flex items-center gap-1">
//                   <Clock size={16} className="text-gray-400" />
//                   <span>{walkingTime} min</span>
//                 </div>
//               </div>
//             </div>
//           </div>

//           {/* Map button */}
//           <button className="w-full py-3 px-4 bg-gray-50 hover:bg-orange-400 hover:text-white border border-orange-500 transition-colors rounded-xl text-gray-700 font-medium flex items-center justify-center gap-2">
//             <MapPin size={18} />
//             Show on map
//           </button>

//           {/* Amenities */}
//           <div className="flex flex-wrap gap-2">
//             {amenities?.map((amenity, index) => (
//               <span
//                 key={index}
//                 className="px-4 py-2 bg-gray-50 rounded-xl text-gray-700 text-sm"
//               >
//                 {amenity}
//               </span>
//             ))}
//           </div>

//           {/* Layouts section */}
//           <div className="space-y-4 pt-4 border-t border-gray-100">
//             <div className="flex justify-between items-center text-gray-600">
//               <span className="font-medium">Active:</span>
//             </div>

//             {/* Layout options */}
//             {layouts?.map((layout, index) => (
//               <div key={index} className="flex justify-between items-center">
//                 <div className="flex items-center gap-2">
//                   <span>{layout.type}</span>
//                   <span className="px-2 py-0.5 bg-gray-100 rounded-full text-sm">
//                     {layout.count}
//                   </span>
//                 </div>
//                 <span className="font-medium">From {layout.price} د.ا</span>
//               </div>
//             ))}

//             {/* View all layouts button */}
//             <button className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 transition-colors rounded-xl text-white font-medium flex items-center justify-center gap-2">
//               <span>View all layouts</span>
//               <ArrowUpRight size={18} />
//             </button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default PropertyCard;

import { useState } from "react";
import {
  Heart,
  BedDouble,
  Bath,
  Home,
  Ruler,
  Calendar,
  CheckCircle,
  Tag,
  MapPin,
  Building,
  Phone,
  Mail,
  DollarSign,
  User,
  Shield,
  ChevronRight,
} from "lucide-react";

const ClassicCard = ({ listing }) => {
  // Default to empty objects/arrays if properties don't exist
  const {
    id,
    title = "Property Listing",
    reference_no = "",
    property_type = "",
    offering_type = "",
    size = "0",
    bedrooms = 0,
    bathrooms = 0,
    available_from = "",
    furnished = "0",
    rera_permit_issue_date = "",
    rera_expiration_date = "",
    photos = [],
    amenities = [],
    company = {},
    agent = {},
    location = {},
    financial_status = 4, // Default value
    contract_expiry = "",
  } = listing || {};

  const [currentImage, setCurrentImage] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  // Find main image or use first image
  const mainImageIndex = photos.findIndex((photo) => photo.is_main === 1);
  const imageUrls = photos.map((photo) => photo.image_url);

  // Handle image navigation
  const nextImage = (e) => {
    e.stopPropagation();
    setCurrentImage((prev) => (prev === imageUrls.length - 1 ? 0 : prev + 1));
  };

  const prevImage = (e) => {
    e.stopPropagation();
    setCurrentImage((prev) => (prev === 0 ? imageUrls.length - 1 : prev - 1));
  };

  // Format date function
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  // Get financial status text and color
  const getFinancialStatusInfo = (status) => {
    switch (status) {
      case 1:
        return { text: "Pending", color: "bg-yellow-100 text-yellow-800" };
      case 2:
        return { text: "Approved", color: "bg-green-100 text-green-800" };
      case 3:
        return { text: "Rejected", color: "bg-red-100 text-red-800" };
      case 4:
      default:
        return { text: "Available", color: "bg-blue-100 text-blue-800" };
    }
  };

  const statusInfo = getFinancialStatusInfo(financial_status);

  return (
    <div
      className="bg-white rounded-xl shadow-md overflow-hidden transition-all duration-300 hover:shadow-xl border border-gray-100"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="flex flex-col md:flex-row">
        {/* Left side - Image */}
        <div className="relative md:w-1/3 h-64">
          {imageUrls.length > 0 ? (
            <>
              <img
                src={imageUrls[currentImage]}
                alt={`Property ${currentImage + 1}`}
                className={`h-full w-full object-cover transition-transform duration-500 ${
                  isHovered ? "scale-105" : ""
                }`}
              />

              {/* Image navigation buttons */}
              <div className="absolute inset-0 flex items-center justify-between px-4">
                <button
                  onClick={prevImage}
                  className="bg-white bg-opacity-50 rounded-full p-2 text-blue-700 hover:bg-opacity-75 transition transform hover:scale-110"
                >
                  <ChevronRight className="h-5 w-5 rotate-180" />
                </button>
                <button
                  onClick={nextImage}
                  className="bg-white bg-opacity-50 rounded-full p-2 text-blue-700 hover:bg-opacity-75 transition transform hover:scale-110"
                >
                  <ChevronRight className="h-5 w-5" />
                </button>
              </div>

              {/* Image counter */}
              <div className="absolute bottom-4 right-4 bg-blue-600 text-white px-2 py-1 rounded-md text-sm">
                {currentImage + 1} / {imageUrls.length}
              </div>
            </>
          ) : (
            <div className="h-full w-full flex items-center justify-center bg-blue-100">
              <Building className="h-16 w-16 text-blue-300" />
            </div>
          )}

          {/* Favorite button */}
          <button className="absolute top-4 right-4 bg-white rounded-full p-2 shadow-md transition transform hover:scale-110">
            <Heart
              className={`h-5 w-5 ${
                isHovered ? "text-red-500" : "text-blue-600"
              }`}
            />
          </button>

          {/* Status tag */}
          <div className="absolute top-4 left-4">
            <span
              className={`${statusInfo.color} px-3 py-1 rounded-full text-sm font-medium`}
            >
              {statusInfo.text}
            </span>
          </div>
        </div>

        {/* Right side - Content */}
        <div className="md:w-2/3 p-6">
          <div className="flex flex-col h-full">
            <div className="flex justify-between items-start mb-2">
              <div>
                <div className="flex items-center space-x-2 mb-1">
                  <span className="bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                    {offering_type}
                  </span>
                  <span
                    className={`${
                      property_type === "Apartment"
                        ? "bg-green-100 text-green-800"
                        : "bg-purple-100 text-purple-800"
                    } px-3 py-1 rounded-full text-sm font-medium`}
                  >
                    {property_type}
                  </span>
                </div>
                <h2 className="text-xl font-bold text-gray-800">{title}</h2>
              </div>
              <span className="text-gray-500 text-sm whitespace-nowrap">
                Ref: {reference_no}
              </span>
            </div>

            {/* Location info if available */}
            {location && location.name && (
              <div className="flex items-center text-gray-600 mb-4">
                <MapPin className="h-4 w-4 text-blue-500 mr-1" />
                <span className="text-sm">{location.name}</span>
              </div>
            )}

            {/* Main property details */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
              <div className="flex items-center text-gray-700">
                <BedDouble className="h-5 w-5 text-blue-500 mr-2" />
                <span>
                  {bedrooms} {bedrooms === 1 ? "Bedroom" : "Bedrooms"}
                </span>
              </div>
              <div className="flex items-center text-gray-700">
                <Bath className="h-5 w-5 text-blue-500 mr-2" />
                <span>
                  {bathrooms} {bathrooms === 1 ? "Bathroom" : "Bathrooms"}
                </span>
              </div>
              <div className="flex items-center text-gray-700">
                <Ruler className="h-5 w-5 text-blue-500 mr-2" />
                <span>{size} sq.ft</span>
              </div>
              <div className="flex items-center text-gray-700">
                <CheckCircle className="h-5 w-5 text-blue-500 mr-2" />
                <span>{furnished === "1" ? "Furnished" : "Unfurnished"}</span>
              </div>
            </div>

            {/* Second row of details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div className="flex items-center text-gray-700">
                <Calendar className="h-5 w-5 text-blue-500 mr-2" />
                <span>Available: {formatDate(available_from)}</span>
              </div>
              <div className="flex items-center text-gray-700">
                <Shield className="h-5 w-5 text-blue-500 mr-2" />
                <span>
                  RERA Valid until: {formatDate(rera_expiration_date)}
                </span>
              </div>
            </div>

            {/* Amenities */}
            {amenities && amenities.length > 0 && (
              <div className="mb-4">
                <div className="flex flex-wrap gap-2">
                  {amenities.map((amenity) => (
                    <span
                      key={amenity.id}
                      className="bg-blue-50 text-blue-700 text-xs px-2 py-1 rounded flex items-center group"
                    >
                      <Tag className="h-3 w-3 mr-1 group-hover:text-blue-500" />
                      {amenity.amenity_name}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Footer with agent and company info */}
            <div className="mt-auto pt-4 border-t border-gray-200">
              <div className="flex flex-wrap justify-between items-center">
                {/* Agent info */}
                {agent && (
                  <div className="flex items-center">
                    <div className="bg-blue-100 rounded-full p-2 mr-3">
                      {agent.profile_url ? (
                        <img
                          src={agent.profile_url}
                          alt={agent.name}
                          className="h-8 w-8 rounded-full"
                        />
                      ) : (
                        <User className="h-6 w-6 text-blue-500" />
                      )}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        {agent.name}
                      </p>
                      {agent.rera_number && (
                        <p className="text-xs text-gray-500">
                          RERA: {agent.rera_number}
                        </p>
                      )}
                    </div>
                  </div>
                )}

                {/* Company logo if available */}
                {company && company.name && (
                  <div className="flex items-center mt-2 md:mt-0">
                    <span className="text-xs text-gray-500 mr-2">
                      {company.name}
                    </span>
                    {company.logo_url && (
                      <img
                        src={company.logo_url}
                        alt={company.name}
                        className="h-6 object-contain"
                      />
                    )}
                  </div>
                )}

                {/* View details button */}
                <button
                  className={`ml-auto mt-2 md:mt-0 flex items-center px-4 py-2 rounded-lg transition duration-300 ${
                    isHovered
                      ? "bg-blue-600 text-white"
                      : "bg-blue-100 text-blue-700"
                  }`}
                >
                  View Details
                  <ChevronRight className="ml-1 h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClassicCard;
