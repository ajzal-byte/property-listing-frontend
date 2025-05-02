// import { useState } from 'react';
// import { MapPin, Home, Calendar, BedDouble, Bath, Car, DollarSign, CheckCircle, ChevronLeft, ChevronRight } from 'lucide-react';
// import Fetcher from '../utils/Fetcher';
// import { useParams } from 'react-router-dom';


// export default function DetailedSecondary() {

// //   const [listing, setListing] = useState([]);

//   const { id } = useParams();
//   const { loading, response, error } = Fetcher({
//     url: `http://3.111.31.34/api/listings/${id}`,
//     method: 'GET',
//     headers: { Authorization: `Bearer ${localStorage.getItem("authToken")}` },
//     onSuccess: (res) => console.log('Data is:', res),
//   });

//   const listing = response?.listing ? response.listing : [];

//   console.log("response is: ",response);
//   console.log("error is: ",error);
  

//   const [currentImageIndex, setCurrentImageIndex] = useState(0);

//   // Find the main image
//   const mainImage = listing.photos.find(photo => photo.is_main === 1) || listing.photos[0];
  
//   // Get all photos, ordered with main image first
//   const orderedPhotos = [
//     mainImage,
//     ...listing.photos.filter(photo => photo.id !== mainImage.id)
//   ];

//   const nextImage = () => {
//     setCurrentImageIndex((prevIndex) => 
//       prevIndex === orderedPhotos.length - 1 ? 0 : prevIndex + 1
//     );
//   };

//   const prevImage = () => {
//     setCurrentImageIndex((prevIndex) => 
//       prevIndex === 0 ? orderedPhotos.length - 1 : prevIndex - 1
//     );
//   };

//   const selectImage = (index) => {
//     setCurrentImageIndex(index);
//   };

//   const formatDate = (dateString) => {
//     if (!dateString) return 'N/A';
//     const date = new Date(dateString);
//     return date.toLocaleDateString('en-US', { 
//       year: 'numeric', 
//       month: 'long', 
//       day: 'numeric' 
//     });
//   };

//   return (
//     <div className="max-w-7xl mx-auto px-4 py-8 bg-gray-50">
//       <div className="bg-white rounded-xl shadow-lg overflow-hidden">
//         {/* Property Title Section */}
//         <div className="bg-blue-700 text-white p-6">
//           <div className="flex justify-between items-center">
//             <h1 className="text-3xl font-bold">{listing.title}</h1>
//             <span className="bg-blue-500 px-4 py-1 rounded-full text-white uppercase text-sm font-semibold">
//               {listing.status}
//             </span>
//           </div>
//           <div className="flex items-center mt-2">
//             <MapPin className="h-4 w-4 mr-1" />
//             <p>{listing.pf_location.location}</p>
//           </div>
//           <div className="flex items-center mt-4">
//             <div className="flex items-center mr-6">
//               <BedDouble className="h-5 w-5 mr-1" />
//               <span>{listing.bedrooms} Beds</span>
//             </div>
//             <div className="flex items-center mr-6">
//               <Bath className="h-5 w-5 mr-1" />
//               <span>{listing.bathrooms} Baths</span>
//             </div>
//             <div className="flex items-center">
//               <Home className="h-5 w-5 mr-1" />
//               <span>{listing.size} sqm</span>
//             </div>
//           </div>
//         </div>

//         {/* Image Gallery */}
//         <div className="relative">
//           <div className="relative h-96 w-full overflow-hidden">
//             <img 
//               src={orderedPhotos[currentImageIndex].image_url} 
//               alt={`Property image ${currentImageIndex + 1}`}
//               className="w-full h-full object-cover"
//             />
//             <button 
//               onClick={prevImage}
//               className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 rounded-full p-2 text-white"
//             >
//               <ChevronLeft className="h-6 w-6" />
//             </button>
//             <button 
//               onClick={nextImage}
//               className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 rounded-full p-2 text-white"
//             >
//               <ChevronRight className="h-6 w-6" />
//             </button>
//           </div>
          
//           {/* Thumbnails */}
//           <div className="flex overflow-x-auto py-4 px-6 gap-4">
//             {orderedPhotos.map((photo, index) => (
//               <div 
//                 key={photo.id} 
//                 className={`flex-shrink-0 cursor-pointer border-2 ${
//                   currentImageIndex === index ? 'border-blue-600' : 'border-transparent'
//                 }`}
//                 onClick={() => selectImage(index)}
//               >
//                 <img 
//                   src={photo.image_url} 
//                   alt={`Thumbnail ${index + 1}`}
//                   className="w-24 h-16 object-cover"
//                 />
//               </div>
//             ))}
//           </div>
//         </div>

//         {/* Main Content */}
//         <div className="grid grid-cols-1 md:grid-cols-3 gap-8 p-6">
//           {/* Left Column - Property Details */}
//           <div className="md:col-span-2">
//             <div className="mb-8">
//               <h2 className="text-2xl font-bold text-blue-800 mb-4">Property Details</h2>
//               <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-8">
//                 <div className="flex items-center">
//                   <span className="text-gray-600 w-36">Reference No:</span>
//                   <span className="font-medium">{listing.reference_no || 'N/A'}</span>
//                 </div>
//                 <div className="flex items-center">
//                   <span className="text-gray-600 w-36">Property Type:</span>
//                   <span className="font-medium">{listing.property_type || 'N/A'}</span>
//                 </div>
//                 <div className="flex items-center">
//                   <span className="text-gray-600 w-36">Offering Type:</span>
//                   <span className="font-medium">{listing.offering_type || 'N/A'}</span>
//                 </div>
//                 <div className="flex items-center">
//                   <span className="text-gray-600 w-36">Size:</span>
//                   <span className="font-medium">{listing.size || 'N/A'} sqm</span>
//                 </div>
//                 <div className="flex items-center">
//                   <span className="text-gray-600 w-36">Furnished:</span>
//                   <span className="font-medium">{listing.furnished === "1" ? "Yes" : "No"}</span>
//                 </div>
//                 <div className="flex items-center">
//                   <span className="text-gray-600 w-36">Rental Period:</span>
//                   <span className="font-medium capitalize">{listing.rental_period || 'N/A'}</span>
//                 </div>
//                 <div className="flex items-center">
//                   <span className="text-gray-600 w-36">Available From:</span>
//                   <span className="font-medium">{formatDate(listing.available_from)}</span>
//                 </div>
//                 <div className="flex items-center">
//                   <span className="text-gray-600 w-36">RERA Permit:</span>
//                   <span className="font-medium">{listing.rera_permit_number || 'N/A'}</span>
//                 </div>
//                 <div className="flex items-center">
//                   <span className="text-gray-600 w-36">RERA Issue Date:</span>
//                   <span className="font-medium">{formatDate(listing.rera_issue_date)}</span>
//                 </div>
//                 <div className="flex items-center">
//                   <span className="text-gray-600 w-36">RERA Expiry:</span>
//                   <span className="font-medium">{formatDate(listing.rera_expiration_date)}</span>
//                 </div>
//               </div>
//             </div>

//             <div className="mb-8">
//               <h2 className="text-2xl font-bold text-blue-800 mb-4">Description</h2>
//               <p className="text-gray-700 leading-relaxed">{listing.desc_en || 'No description available.'}</p>
//             </div>

//             <div className="mb-8">
//               <h2 className="text-2xl font-bold text-blue-800 mb-4">Amenities</h2>
//               <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
//                 {listing.amenities.map(amenity => (
//                   <div key={amenity.id} className="flex items-center">
//                     <CheckCircle className="h-5 w-5 text-blue-600 mr-2" />
//                     <span>{amenity.amenity_name}</span>
//                   </div>
//                 ))}
//               </div>
//             </div>
//           </div>

//           {/* Right Column - Agent Info & Location */}
//           <div className="md:col-span-1">
//             <div className="bg-blue-50 rounded-lg p-6 mb-6">
//               <h2 className="text-xl font-bold text-blue-800 mb-4">Agent Information</h2>
//               <div className="flex flex-col space-y-4">
//                 <div>
//                   <p className="text-gray-600 text-sm">Agent</p>
//                   <p className="font-medium">{listing.agent?.name || 'N/A'}</p>
//                 </div>
//                 <div>
//                   <p className="text-gray-600 text-sm">Company</p>
//                   <p className="font-medium">{listing.company?.name || 'N/A'}</p>
//                 </div>
//                 <div>
//                   <p className="text-gray-600 text-sm">RERA Number</p>
//                   <p className="font-medium">{listing.agent?.rera_number || 'N/A'}</p>
//                 </div>
//                 <div>
//                   <p className="text-gray-600 text-sm">Contact</p>
//                   <p className="font-medium">{listing.agent?.phone || 'N/A'}</p>
//                 </div>
//                 <div>
//                   <p className="text-gray-600 text-sm">Email</p>
//                   <p className="font-medium">{listing.agent?.email || 'N/A'}</p>
//                 </div>
//               </div>
//             </div>

//             <div className="bg-blue-50 rounded-lg p-6">
//               <h2 className="text-xl font-bold text-blue-800 mb-4">Location</h2>
//               <div className="flex flex-col space-y-2">
//                 <div>
//                   <p className="text-gray-600 text-sm">City</p>
//                   <p className="font-medium">{listing.pf_location?.city || 'N/A'}</p>
//                 </div>
//                 <div>
//                   <p className="text-gray-600 text-sm">Community</p>
//                   <p className="font-medium">{listing.pf_location?.community || 'N/A'}</p>
//                 </div>
//                 <div>
//                   <p className="text-gray-600 text-sm">Sub Community</p>
//                   <p className="font-medium">{listing.pf_location?.sub_community || 'N/A'}</p>
//                 </div>
//                 <div>
//                   <p className="text-gray-600 text-sm">Building</p>
//                   <p className="font-medium">{listing.pf_location?.building || 'N/A'}</p>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

import { useState, useEffect, useContext } from 'react';
import { MapPin, Home, Calendar, BedDouble, Bath, Car, DollarSign, CheckCircle, ChevronLeft, ChevronRight, Edit2Icon } from 'lucide-react';
import Fetcher from '../utils/Fetcher';
import { useParams } from 'react-router-dom';
import MainTabContext from "../contexts/TabContext";
import { tabs } from '../enums/sidebarTabsEnums';
import { ListingEditModal } from './ListingEditModal';
import getAuthHeaders from '../utils/getAuthHeader';


export default function DetailedSecondary() {
  const { id } = useParams();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showEditModal, setShowEditModal] = useState(false);
  const { mainTab, setMainTab } = useContext(MainTabContext);
  const [locations, setLocations] = useState([]);
  const [developers, setDevelopers] = useState([]);
  const [amenities, setAmenities] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [agents, setAgents] = useState([]);

  const { loading, response, error } = Fetcher({
    url: `http://3.111.31.34/api/listings/${id}`,
    method: 'GET',
    headers: { Authorization: `Bearer ${localStorage.getItem("authToken")}` , 'Accept': 'application/json'},
    onSuccess: (res) => console.log('Data is:', res),
    onError: (err) => console.error('Error fetching listing:', err)
  });

  // For debugging
  useEffect(() => {
    console.log("Response is:", response);
    console.log("Error is:", error);
    console.log("Loading is:", loading);
  }, [response, error, loading]);

    useEffect(() => {
      const fetchData = async () => {
        try {
          // Fetch locations
          const locResponse = await fetch("http://3.111.31.34/api/locations", {
            headers: getAuthHeaders(),
          });
          const locData = await locResponse.json();
          setLocations(locData);
  
          // Fetch developers
          const devResponse = await fetch("http://3.111.31.34/api/developers", {
            headers: getAuthHeaders(),
          });
          const devData = await devResponse.json();
          setDevelopers(devData);
  
          // Fetch amenities
          const amenResponse = await fetch("http://3.111.31.34/api/amenities", {
            headers: getAuthHeaders(),
          });
          const amenData = await amenResponse.json();
          setAmenities(amenData);
  
          // Fetch company and agent info
          const infoResponse = await fetch(
            "http://3.111.31.34/api/listing/create-info",
            {
              headers: getAuthHeaders(),
            }
          );
  
          const infoData = await infoResponse.json();
          console.log(infoData);
  
          // Extract companies and agents from infoData (assuming structure)
          // This may need adjustment based on actual API response structure
          setCompanies(infoData.companies); // Replace with actual data
          console.log(
            "agents are:",
            infoData.companies.flatMap((company) => company.agents || [])
          );
  
          
            setAgents(
                infoData.companies.flatMap(company => company.agents) || []
            );
        } catch (error) {
          console.error("Error fetching data:", error);
        }
      };  
  
      setMainTab(tabs.HIDDEN);
      fetchData();
    }, [
      setMainTab,
      setAgents,
      setAmenities,
      setCompanies,
      setLocations,
      setDevelopers
    ]);
  
  // Safely access the listing data
  const listing = response?.listing || null;

  // Check if data is still loading or there's an error
  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8 bg-gray-50 flex justify-center items-center h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-700 mx-auto mb-4"></div>
          <p className="text-lg text-gray-600">Loading property details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8 bg-gray-50">
        <div className="bg-red-50 border border-red-200 rounded-xl p-6 shadow-md">
          <h2 className="text-xl font-bold text-red-700 mb-2">Error Loading Property</h2>
          <p className="text-gray-700">{error.message || "Failed to load property details. Please try again."}</p>
          <p className="mt-4 text-sm text-gray-600">Status: {error.status || "Unknown"}</p>
        </div>
      </div>
    );
  }

  if (!listing) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8 bg-gray-50">
        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6 shadow-md">
          <h2 className="text-xl font-bold text-yellow-700 mb-2">No Property Found</h2>
          <p className="text-gray-700">The property you're looking for doesn't exist or has been removed.</p>
        </div>
      </div>
    );
  }

  // Only proceed with rendering if we have a valid listing
  
  // Find the main image if photos exist
  const orderedPhotos = listing.photos && listing.photos.length > 0 
    ? (() => {
        const mainImage = listing.photos.find(photo => photo.is_main === 1) || listing.photos[0];
        return [
          mainImage,
          ...listing.photos.filter(photo => photo.id !== mainImage.id)
        ];
      })()
    : [];

  const nextImage = () => {
    setCurrentImageIndex((prevIndex) => 
      prevIndex === orderedPhotos.length - 1 ? 0 : prevIndex + 1
    );
  };

  const prevImage = () => {
    setCurrentImageIndex((prevIndex) => 
      prevIndex === 0 ? orderedPhotos.length - 1 : prevIndex - 1
    );
  };

  const selectImage = (index) => {
    setCurrentImageIndex(index);
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  return (
    <>
     {/* <ListingEditModal 
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        listing={listing}
        authToken={localStorage.getItem("authToken")}
        developers={developers}
        locations={locations}
        companies = {companies}
        agents={agents}
        amenitiesList={amenities}
        onSuccess={()=> {console.log("Updated Successfully");
        }}
      /> */}
    <div className="min-h-screen flex flex-col bg-gray-50">
    <div className="flex-grow flex flex-col w-full max-w-screen-2xl mx-auto px-4 py-6">
      <div className="bg-white rounded-xl shadow-lg overflow-hidden flex-grow flex flex-col">
        {/* Property Title Section */}
        <div className="bg-blue-700 text-white p-6">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center">
            <h1 className="text-2xl sm:text-3xl font-bold mb-2 sm:mb-0">{listing.title || 'Property Title'}{"  "}&nbsp;{listing.title_ar || "Arabic Title"}</h1>

              {/* Edit button */}
              <div className='flex gap-2'>
          <button className=" bg-blue-500 px-4 py-1 rounded-full text-white uppercase text-sm font-semibold w-fit cursor-pointer" onClick={()=> setShowEditModal(true)}>
            <Edit2Icon className="bg-blue-500 " />
          </button>
            <span className="bg-blue-500 px-4 py-1 rounded-full text-white uppercase text-sm font-semibold w-fit cursor-pointer">
              {listing.status || 'N/A'}
            </span>
              </div>
          </div>
          <div className="flex items-center mt-2">
            <MapPin className="h-4 w-4 mr-1 flex-shrink-0" />
            <p className="truncate">{listing.pf_location?.location || 'Location not specified'}</p>
          </div>
          <div className="flex flex-wrap items-center mt-4 gap-y-2">
            <div className="flex items-center mr-6">
              <BedDouble className="h-5 w-5 mr-1 flex-shrink-0" />
              <span>{listing.bedrooms || 'N/A'} Beds</span>
            </div>
            <div className="flex items-center mr-6">
              <Bath className="h-5 w-5 mr-1 flex-shrink-0" />
              <span>{listing.bathrooms || 'N/A'} Baths</span>
            </div>
            <div className="flex items-center">
              <Home className="h-5 w-5 mr-1 flex-shrink-0" />
              <span>{listing.size || 'N/A'} sqm</span>
            </div>
          </div>
        </div>

        {/* Image Gallery - Only show if we have photos */}
        {orderedPhotos.length > 0 ? (
          <div className="relative">
            <div className="relative h-64 sm:h-80 md:h-120 w-full overflow-hidden">
              <img 
                src={orderedPhotos[currentImageIndex].image_url} 
                alt={`Property image ${currentImageIndex + 1}`}
                className="w-full h-full object-cover"
              />
              <button 
                onClick={prevImage}
                className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 rounded-full p-2 text-white"
                aria-label="Previous image"
              >
                <ChevronLeft className="h-6 w-6" />
              </button>
              <button 
                onClick={nextImage}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 rounded-full p-2 text-white"
                aria-label="Next image"
              >
                <ChevronRight className="h-6 w-6" />
              </button>
            </div>
            
            {/* Thumbnails */}
            <div className="flex overflow-x-auto py-4 px-4 sm:px-6 gap-2 sm:gap-4">
              {orderedPhotos.map((photo, index) => (
                <div 
                  key={photo.id} 
                  className={`flex-shrink-0 cursor-pointer border-2 ${
                    currentImageIndex === index ? 'border-blue-600' : 'border-transparent'
                  }`}
                  onClick={() => selectImage(index)}
                >
                  <img 
                    src={photo.image_url} 
                    alt={`Thumbnail ${index + 1}`}
                    className="w-16 sm:w-24 h-12 sm:h-16 object-cover"
                  />
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="h-48 bg-gray-100 flex items-center justify-center">
            <p className="text-gray-500">No property images available</p>
          </div>
        )}

        {/* Main Content - Flex grow to take remaining space */}
        <div className="flex-grow grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 p-4 sm:p-6">
          {/* Left Column - Property Details */}
          <div className="md:col-span-2">
            <div className="mb-6 sm:mb-8">
              <h2 className="text-xl sm:text-2xl font-bold text-blue-800 mb-3 sm:mb-4">Property Details</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-3 gap-x-4 sm:gap-x-8">
                <div className="flex items-center">
                  <span className="text-gray-600 w-28 sm:w-36">Reference No:</span>
                  <span className="font-medium">{listing.reference_no || 'N/A'}</span>
                </div>
                <div className="flex items-center">
                  <span className="text-gray-600 w-28 sm:w-36">Property Type:</span>
                  <span className="font-medium">{listing.property_type || 'N/A'}</span>
                </div>
                <div className="flex items-center">
                  <span className="text-gray-600 w-28 sm:w-36">Offering Type:</span>
                  <span className="font-medium">{listing.offering_type || 'N/A'}</span>
                </div>
                <div className="flex items-center">
                  <span className="text-gray-600 w-28 sm:w-36">Size:</span>
                  <span className="font-medium">{listing.size || 'N/A'} sqm</span>
                </div>
                <div className="flex items-center">
                  <span className="text-gray-600 w-28 sm:w-36">Furnished:</span>
                  <span className="font-medium">{listing.furnished === "1" ? "Yes" : "No"}</span>
                </div>
                <div className="flex items-center">
                  <span className="text-gray-600 w-28 sm:w-36">Rental Period:</span>
                  <span className="font-medium capitalize">{listing.rental_period || 'N/A'}</span>
                </div>
                <div className="flex items-center">
                  <span className="text-gray-600 w-28 sm:w-36">Available From:</span>
                  <span className="font-medium">{formatDate(listing.available_from)}</span>
                </div>
                <div className="flex items-center">
                  <span className="text-gray-600 w-28 sm:w-36">RERA Permit:</span>
                  <span className="font-medium">{listing.rera_permit_number || 'N/A'}</span>
                </div>
                <div className="flex items-center">
                  <span className="text-gray-600 w-28 sm:w-36">RERA Issue Date:</span>
                  <span className="font-medium">{formatDate(listing.rera_issue_date)}</span>
                </div>
                <div className="flex items-center">
                  <span className="text-gray-600 w-28 sm:w-36">RERA Expiry:</span>
                  <span className="font-medium">{formatDate(listing.rera_expiration_date)}</span>
                </div>
              </div>
            </div>

            <div className="mb-6 sm:mb-8">
              <h2 className="text-xl sm:text-2xl font-bold text-blue-800 mb-3 sm:mb-4">Description</h2>
              <p className="text-gray-700 leading-relaxed">{listing.desc_en || 'No description available.'}</p>
            </div>

            <div className="mb-6 sm:mb-8">
              <h2 className="text-xl sm:text-2xl font-bold text-blue-800 mb-3 sm:mb-4">Description Arabic</h2>
              <p className="text-gray-700 leading-relaxed">{listing.desc_ar || 'No description available.'}</p>
            </div>

            <div className="mb-6 sm:mb-8">
              <h2 className="text-xl sm:text-2xl font-bold text-blue-800 mb-3 sm:mb-4">Amenities</h2>
              {listing.amenities && listing.amenities.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4">
                  {listing.amenities.map(amenity => (
                    <div key={amenity.id} className="flex items-center">
                      <CheckCircle className="h-5 w-5 text-blue-600 mr-2 flex-shrink-0" />
                      <span>{amenity.amenity_name}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-600">No amenities listed.</p>
              )}
            </div>
          </div>

          {/* Right Column - Agent Info & Location */}
          <div className="md:col-span-1 space-y-6">
            <div className="bg-blue-50 rounded-lg p-4 sm:p-6">
              <h2 className="text-lg sm:text-xl font-bold text-blue-800 mb-3 sm:mb-4">Agent Information</h2>
              <div className="flex flex-col space-y-3 sm:space-y-4">
                <div>
                  <p className="text-gray-600 text-sm">Agent</p>
                  <p className="font-medium">{listing.agent?.name || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-gray-600 text-sm">Company</p>
                  <p className="font-medium">{listing.company?.name || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-gray-600 text-sm">RERA Number</p>
                  <p className="font-medium">{listing.agent?.rera_number || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-gray-600 text-sm">Contact</p>
                  <p className="font-medium">{listing.agent?.phone || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-gray-600 text-sm">Email</p>
                  <p className="font-medium break-words">{listing.agent?.email || 'N/A'}</p>
                </div>
              </div>
            </div>

            <div className="bg-blue-50 rounded-lg p-4 sm:p-6">
              <h2 className="text-lg sm:text-xl font-bold text-blue-800 mb-3 sm:mb-4">Location</h2>
              <div className="flex flex-col space-y-2 sm:space-y-3">
                <div>
                  <p className="text-gray-600 text-sm">City</p>
                  <p className="font-medium">{listing.pf_location?.city || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-gray-600 text-sm">Community</p>
                  <p className="font-medium">{listing.pf_location?.community || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-gray-600 text-sm">Sub Community</p>
                  <p className="font-medium">{listing.pf_location?.sub_community || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-gray-600 text-sm">Building</p>
                  <p className="font-medium">{listing.pf_location?.building || 'N/A'}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  </>

  );
}