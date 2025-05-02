// import React, { useState, useContext, useEffect } from 'react';
// import { Heart, BedDouble, Bath, Home, Ruler, Calendar, Tag, CheckCircle } from "lucide-react";

// // Property Card Component
// const PropertyCard = ({ listing = {} }) => {
//   // Default to empty objects/arrays if properties don't exist
//   const {
//     id,
//     title = "Property Listing",
//     reference_no = "",
//     property_type = "",
//     offering_type = "",
//     size = "0",
//     bedrooms = 0,
//     bathrooms = 0,
//     available_from = "",
//     furnished = "0",
//     rera_permit_issue_date = "",
//     rera_expiration_date = "",
//     photos = [],
//     amenities = []
//   } = listing || {};

//   const [currentImage, setCurrentImage] = useState(0);

//   // Find main image or use first image
//   const mainImageIndex = photos.findIndex(photo => photo.is_main === 1);
//   const imageUrls = photos.map(photo => photo.image_url);

//   // Handle image navigation
//   const nextImage = (e) => {
//     e.stopPropagation();
//     setCurrentImage((prev) => (prev === imageUrls.length - 1 ? 0 : prev + 1));
//   };

//   const prevImage = (e) => {
//     e.stopPropagation();
//     setCurrentImage((prev) => (prev === 0 ? imageUrls.length - 1 : prev - 1));
//   };

//   // Format date function
//   const formatDate = (dateString) => {
//     if (!dateString) return "N/A";
//     const date = new Date(dateString);
//     return date.toLocaleDateString('en-US', {
//       year: 'numeric',
//       month: 'short',
//       day: 'numeric'
//     });
//   };

//   return (
//     <div className="h-full bg-white rounded-xl shadow-md overflow-hidden">
//       {/* Image Slider */}
//       <div className="relative h-64 w-full">
//         {imageUrls.length > 0 ? (
//           <>
//             <img
//               src={imageUrls[currentImage]}
//               alt={`Property ${currentImage + 1}`}
//               className="h-full w-full object-cover"
//             />

//             {/* Image navigation buttons */}
//             <div className="absolute inset-0 flex items-center justify-between px-4">
//               <button
//                 onClick={prevImage}
//                 className="bg-white bg-opacity-50 rounded-full p-2 text-blue-700 hover:bg-opacity-75 transition"
//               >
//                 <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
//                 </svg>
//               </button>
//               <button
//                 onClick={nextImage}
//                 className="bg-white bg-opacity-50 rounded-full p-2 text-blue-700 hover:bg-opacity-75 transition"
//               >
//                 <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
//                 </svg>
//               </button>
//             </div>

//             {/* Image counter */}
//             <div className="absolute bottom-4 right-4 bg-blue-600 text-white px-2 py-1 rounded-md text-sm">
//               {currentImage + 1} / {imageUrls.length}
//             </div>
//           </>
//         ) : (
//           <div className="h-full w-full flex items-center justify-center bg-blue-100">
//             <Home className="h-16 w-16 text-blue-300" />
//           </div>
//         )}

//         {/* Favorite button */}
//         <button className="absolute top-4 right-4 bg-white rounded-full p-2 shadow-md">
//           <Heart className="h-5 w-5 text-blue-600" />
//         </button>
//       </div>

//       {/* Card Content */}
//       <div className="p-6">
//         {/* Status and Type */}
//         <div className="flex justify-between items-center mb-2">
//           <span className="bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-medium">
//             {offering_type}
//           </span>
//           <span className="text-gray-500 text-sm">
//             Ref: {reference_no}
//           </span>
//         </div>

//         {/* Title */}
//         <h2 className="text-xl font-bold text-gray-800 mb-2">{title}</h2>

//         {/* Property Details */}
//         <div className="grid grid-cols-2 gap-4 mb-4">
//           <div className="flex items-center text-gray-700">
//             <BedDouble className="h-5 w-5 text-blue-500 mr-2" />
//             <span>{bedrooms} {bedrooms === 1 ? 'Bedroom' : 'Bedrooms'}</span>
//           </div>
//           <div className="flex items-center text-gray-700">
//             <Bath className="h-5 w-5 text-blue-500 mr-2" />
//             <span>{bathrooms} {bathrooms === 1 ? 'Bathroom' : 'Bathrooms'}</span>
//           </div>
//           <div className="flex items-center text-gray-700">
//             <Ruler className="h-5 w-5 text-blue-500 mr-2" />
//             <span>{size} sq.ft</span>
//           </div>
//           <div className="flex items-center text-gray-700">
//             <Home className="h-5 w-5 text-blue-500 mr-2" />
//             <span>{property_type}</span>
//           </div>
//         </div>

//         {/* Availability */}
//         <div className="flex items-center mb-4 text-gray-700">
//           <Calendar className="h-5 w-5 text-blue-500 mr-2" />
//           <span>Available from: {formatDate(available_from)}</span>
//         </div>

//         {/* Additional Details */}
//         <div className="border-t border-gray-200 pt-4">
//           <div className="flex items-center mb-2">
//             <CheckCircle className="h-5 w-5 text-blue-500 mr-2" />
//             <span className="text-gray-700">
//               {furnished === "1" ? "Furnished" : "Unfurnished"}
//             </span>
//           </div>

//           {/* RERA Details */}
//           <div className="text-sm text-gray-600 mb-2">
//             <div>RERA Valid: {formatDate(rera_permit_issue_date)} - {formatDate(rera_expiration_date)}</div>
//           </div>

//           {/* Amenities */}
//           {amenities.length > 0 && (
//             <div className="mt-2">
//               <h3 className="text-sm font-semibold text-gray-700 mb-1">Amenities:</h3>
//               <div className="flex flex-wrap gap-2">
//                 {amenities.map((amenity) => (
//                   <span
//                     key={amenity.id}
//                     className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded"
//                   >
//                     {amenity.amenity_name}
//                   </span>
//                 ))}
//               </div>
//             </div>
//           )}
//         </div>

//         {/* Agent or Contact Info */}
//         {listing.agent && (
//           <div className="mt-4 pt-4 border-t border-gray-200">
//             <div className="flex items-center">
//               <div className="bg-blue-100 rounded-full p-2 mr-3">
//                 {listing.agent.profile_url ? (
//                   <img
//                     src={listing.agent.profile_url}
//                     alt={listing.agent.name}
//                     className="h-8 w-8 rounded-full"
//                   />
//                 ) : (
//                   <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
//                   </svg>
//                 )}
//               </div>
//               <div>
//                 <p className="text-sm font-medium text-gray-900">{listing.agent.name}</p>
//                 <p className="text-xs text-gray-500">RERA: {listing.agent.rera_number}</p>
//               </div>
//             </div>
//           </div>
//         )}

//         {/* CTA Button */}
//         <div className="mt-6">
//           <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition duration-300">
//             Contact Agent
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default PropertyCard;

import React, { useState } from "react";
import {
  Heart,
  BedDouble,
  Bath,
  Home,
  Ruler,
  Calendar,
  Tag,
  CheckCircle,
  Edit2Icon
} from "lucide-react";
import { useNavigate } from "react-router-dom";

// Property Card Component
const PropertyCard = ({ listing = {} }) => {
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
  } = listing || {};

  const [currentImage, setCurrentImage] = useState(0);
  const navigate = useNavigate ();
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

  return (
    <div className="max-w-sm bg-white rounded-xl shadow-md overflow-hidden">
      {/* Top Section: Image + Key Details */}
      <div className="flex flex-col">
        {/* Image Slider */}
        <div className="relative h-48 w-full">
          {imageUrls.length > 0 ? (
            <>
              <img
                src={imageUrls[currentImage]}
                alt={`Property ${currentImage + 1}`}
                className="h-full w-full object-cover"
              />

              {/* Image navigation buttons */}
              <div className="absolute inset-0 flex items-center justify-between px-4">
                <button
                  onClick={prevImage}
                  className="bg-white bg-opacity-50 rounded-full p-2 text-blue-700 hover:bg-opacity-75 transition"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 19l-7-7 7-7"
                    />
                  </svg>
                </button>
                <button
                  onClick={nextImage}
                  className="bg-white bg-opacity-50 rounded-full p-2 text-blue-700 hover:bg-opacity-75 transition"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </button>
              </div>

              {/* Image counter */}
              <div className="absolute bottom-4 right-4 bg-blue-600 text-white px-2 py-1 rounded-md text-sm">
                {currentImage + 1} / {imageUrls.length}
              </div>
            </>
          ) : (
            <div className="h-full w-full flex items-center justify-center bg-blue-100">
              <Home className="h-16 w-16 text-blue-300" />
            </div>
          )}

          {/* Favorite button */}
          <button className="absolute top-4 right-4 bg-white rounded-full p-2 shadow-md">
            <Heart className="h-5 w-5 text-blue-600" />
          </button>

        </div>

        {/* Title and Status Section */}
        <div className="p-4">
          <div className="flex justify-between items-center mb-2">
            <span className="bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-medium">
              {offering_type}
            </span>
            <span className="text-gray-500 text-sm">Ref: {reference_no}</span>
          </div>

          <h2 className="text-lg font-bold text-gray-800 mb-3">{title}</h2>

          {/* Property Specs Grid */}
          <div className="grid grid-cols-2 gap-x-4 gap-y-2 mb-3">
            <div className="flex items-center text-gray-700">
              <BedDouble className="h-4 w-4 text-blue-500 mr-2" />
              <span className="text-sm">
                {bedrooms} {bedrooms === 1 ? "Bedroom" : "Bedrooms"}
              </span>
            </div>
            <div className="flex items-center text-gray-700">
              <Bath className="h-4 w-4 text-blue-500 mr-2" />
              <span className="text-sm">
                {bathrooms} {bathrooms === 1 ? "Bathroom" : "Bathrooms"}
              </span>
            </div>
            <div className="flex items-center text-gray-700">
              <Ruler className="h-4 w-4 text-blue-500 mr-2" />
              <span className="text-sm">{size} sq.ft</span>
            </div>
            <div className="flex items-center text-gray-700">
              <Home className="h-4 w-4 text-blue-500 mr-2" />
              <span className="text-sm">{property_type}</span>
            </div>
          </div>

          {/* Availability */}
          <div className="flex items-center mb-3 text-gray-700 text-sm">
            <Calendar className="h-4 w-4 text-blue-500 mr-2" />
            <span>Available: {formatDate(available_from)}</span>
          </div>

          {/* Additional Details */}
          <div className="border-t border-gray-200 pt-3">
            <div className="flex items-center mb-2">
              <CheckCircle className="h-4 w-4 text-blue-500 mr-2" />
              <span className="text-sm text-gray-700">
                {furnished === "1" ? "Furnished" : "Unfurnished"}
              </span>
            </div>

            {/* RERA Details */}
            <div className="text-xs text-gray-600 mb-2">
              <div>
                RERA: {formatDate(rera_permit_issue_date)} -{" "}
                {formatDate(rera_expiration_date)}
              </div>
            </div>

            {/* Amenities */}
            {amenities.length > 0 && (
              <div className="mt-2">
                <h3 className="text-xs font-semibold text-gray-700 mb-1">
                  Amenities:
                </h3>
                <div className="flex flex-wrap gap-1">
                  {amenities.slice(0, 3).map((amenity) => (
                    <span
                      key={amenity.id}
                      className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded"
                    >
                      {amenity.amenity_name}
                    </span>
                  ))}
                  {amenities.length > 3 && (
                    <span className="text-xs text-blue-600">
                      +{amenities.length - 3} more
                    </span>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Agent Info (Compact) */}
          {listing.agent && (
            <div className="mt-3 pt-3 border-t border-gray-200 flex items-center">
              <div className="bg-blue-100 rounded-full p-1 mr-2">
                {listing.agent.profile_url ? (
                  <img
                    src={listing.agent.profile_url}
                    alt={listing.agent.name}
                    className="h-6 w-6 rounded-full"
                  />
                ) : (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 text-blue-500"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    />
                  </svg>
                )}
              </div>
              <div className="flex-1">
                <p className="text-xs font-medium text-gray-900">
                  {listing.agent.name}
                </p>
                <p className="text-xs text-gray-500">
                  RERA: {listing.agent.rera_number}
                </p>
              </div>
              {/* CTA Button */}
              <button
                className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium py-2 px-3 rounded-lg transition duration-300"
                onClick={() => {
                  const phone = listing?.agent?.phone;
                  const email = listing?.agent?.email;

                  if (phone) {
                    window.location.href = `tel:${phone}`;
                  } else if (email) {
                    window.location.href = `mailto:${email}`;
                  }
                }}
              >
                Contact
              </button>

              <button
                className="bg-green-500 hover:bg-green-600 text-white text-xs font-medium py-2 px-3 rounded-lg transition duration-300 mx-2"
                onClick={() => {
                  navigate(`/secondary-listings/${listing.id}`)
                }}
              >
                View
              </button>
            </div>
          )}

          {/* CTA Button (Only shown if no agent) */}
          {!listing.agent && (
            <div className="mt-3">
              <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition duration-300">
                Contact Agent
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PropertyCard;
