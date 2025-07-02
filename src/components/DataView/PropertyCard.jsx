import React, { useState, useRef, useEffect } from "react";
import {
  Heart,
  BedDouble,
  Bath,
  Home,
  Ruler,
  Calendar,
  CheckCircle,
  MoreVertical,
  ChevronRight,
  Upload,
  Download,
  Archive,
  Trash2,
  ArrowLeftRight,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { ActionTypes, actionSections } from "../../enums/actionTypesEnums.jsx";

// Property Card Component
const PropertyCard = ({
  listing = {},
  selectListingArray = [],
  setSelectListingArray = () => {},
  handleAction,
}) => {
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
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [userData, setUserData] = useState(null);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  // Check if the listing is selected
  const isSelected = selectListingArray.includes(id);

  // Find main image or use first image
  const mainImageIndex = photos.findIndex((photo) => photo.is_main === 1);
  const imageUrls = photos.map((photo) => photo.image_url);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    const storedUserData = localStorage.getItem("userData");
    if (storedUserData) {
      setUserData(JSON.parse(storedUserData));
    }
  }, []);

  // Handle selecting/deselecting listing
  const toggleSelectListing = (e) => {
    console.log("is selected? :", isSelected);
    console.log("selectListingArray: ", selectListingArray);

    e.stopPropagation();
    if (isSelected) {
      setSelectListingArray(
        selectListingArray.filter((listingId) => listingId !== id)
      );
    } else {
      setSelectListingArray([...selectListingArray, id]);
    }
  };

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
    <div className="max-w-sm bg-white rounded-xl shadow-md overflow-hidden relative">
      {/* Selection Checkbox */}
      <div className="absolute top-3 left-3 z-10">
        <div
          className={`h-6 w-6 rounded-md cursor-pointer flex items-center justify-center transition-colors ${
            isSelected
              ? "bg-blue-600"
              : "bg-white bg-opacity-70 hover:bg-opacity-100"
          }`}
          onClick={toggleSelectListing}
        >
          {isSelected && (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4 text-white"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                clipRule="evenodd"
              />
            </svg>
          )}
        </div>
      </div>

      {/* Action Button & Dropdown */}
      <div className="absolute top-3 right-3 z-10" ref={dropdownRef}>
        <button
          className="bg-white bg-opacity-70 hover:bg-opacity-100 rounded-md p-1 shadow-sm transition-colors"
          onClick={(e) => {
            e.stopPropagation();
            setDropdownOpen(!dropdownOpen);
          }}
        >
          <MoreVertical className="h-5 w-5 text-gray-700" />
        </button>

        {dropdownOpen && (
          <div className="absolute top-full right-0 mt-1 w-56 bg-white rounded-md shadow-lg py-1 z-20 text-sm max-h-96 overflow-y-auto">
            {actionSections.map((section, idx) => (
              <div key={idx}>
                {/* Section Header */}
                <div
                  className={`px-3 py-1 text-xs font-semibold text-gray-500 bg-gray-50 ${
                    idx > 0 ? "border-t border-gray-200" : ""
                  }`}
                >
                  {section.title}
                </div>

                {/* Buttons */}
                {section.actions.map((action, i) => {
                  const type = action.type;
                  const actionField = action.action_field;
                  const text = actionField
                    .replace(/_/g, " ")
                    .replace(/\b\w/g, (l) => l.toUpperCase()); // Capitalize

                  const textColor =
                    typeof section.textColor === "function"
                      ? section.textColor(type)
                      : section.textColor;
                  const hoverBg =
                    typeof section.hoverBg === "function"
                      ? section.hoverBg(type)
                      : section.hoverBg;

                  return (
                    <button
                      key={i}
                      className={`w-full text-left px-4 py-2 ${hoverBg} ${textColor} flex items-center`}
                      onClick={() =>
                        handleAction(action.action_field, [listing.id], "individual")
                      }
                    >
                      {section.icon(type)}
                      {text}
                    </button>
                  );
                })}
              </div>
            ))}
          </div>
        )}
      </div>

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

          {listing.status == "archived" && (
            <button className="absolute bottom-4 left-4 bg-blue-100 border-2 border-blue-700 rounded-2xl p-1 px-2 shadow-md">
              <span className="h-2 w-2 text-xs text-blue-600">ARCHIVED</span>
            </button>
          )}
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
                className="bg-green-500 hover:bg-green-600 text-white text-xs font-medium py-2 px-3 rounded-lg transition duration-300 ml-2"
                onClick={() => {
                  navigate(`/secondary-listings/${listing.id}`);
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
