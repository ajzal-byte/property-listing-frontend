import { useState, useEffect, useRef, useContext } from "react";
import {
  Search,
  X,
  MapPin,
  ChevronLeft,
  ChevronRight,
  PlusCircle,
} from "lucide-react";
import LocationsList from "./LocationList";
import AddLocation from "./AddLocation";
import MainTabContext from "../../contexts/TabContext";
import { tabs } from "../../enums/sidebarTabsEnums";
import BulkImportLocation from "./BulkImport";

export default function LocationSearch() {
  const [activeTab, setActiveTab] = useState("bayut");
  const [searchText, setSearchText] = useState("");
  const [locations, setLocations] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const searchInputRef = useRef(null);
  const suggestionRef = useRef(null);
  const searchTimeoutRef = useRef(null);
  const [openAddLocation, setOpenAddLocation] = useState(false);
  const [openImportBulkLocation, setOpenImportBulkLocation] = useState(false);
  const { setMainTab } = useContext(MainTabContext);

  // Fetch locations based on current filters
  const fetchLocations = async (type, page, search = "") => {
    setIsLoading(true);
    try {
      let url = `https://backend.myemirateshome.com/api/locations?type=${type}`;

      if (page) url += `&page=${page}`;
      if (search) url += `&search=${encodeURIComponent(search)}`;

      const response = await fetch(url, {
        method: "GET",
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
      });
      const data = await response.json();

      setLocations(data.data);
      setTotalPages(data.last_page);
      setCurrentPage(data.current_page);
    } catch (error) {
      console.error("Error fetching locations:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch suggestions based on search text
  const fetchSuggestions = async (type, search) => {
    if (!search) {
      setSuggestions([]);
      return;
    }

    try {
      const url = `https://backend.myemirateshome.com/api/locations?type=${type}&search=${encodeURIComponent(
        search
      )}`;
      const response = await fetch(url, {
        method: "GET",
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
      });
      const data = await response.json();

      // Limit to top 30 results
      setSuggestions(data.data.slice(0, 30));
    } catch (error) {
      console.error("Error fetching suggestions:", error);
    }
  };

  // Initial fetch
  useEffect(() => {
    setMainTab(tabs.HIDDEN);
    console.log("active tab is:", activeTab);
    fetchLocations(activeTab, 1);
  }, [activeTab, setMainTab]);

  // Handle tab change
  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setCurrentPage(1);
    setSearchText("");
    setSuggestions([]);
  };

  // Handle search text change with debounce
  const handleSearchChange = (e) => {
    const value = e.value || e.target.value;
    setSearchText(value);

    // Clear previous timeout
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    // Set new timeout for debounce
    searchTimeoutRef.current = setTimeout(() => {
      if (value) {
        fetchSuggestions(activeTab, value);
        setShowSuggestions(true);
      } else {
        setSuggestions([]);
        setShowSuggestions(false);
      }
    }, 300);
  };

  // Handle search submission
  const handleSearch = () => {
    setShowSuggestions(false);
    fetchLocations(activeTab, 1, searchText);
  };

  // Handle suggestion click
  const handleSuggestionClick = (suggestion) => {
    const locationText =
      suggestion.location || `${suggestion.community}, ${suggestion.city}`;
    setSearchText(locationText);
    setShowSuggestions(false);
  };

  // Handle pagination
  const handlePageChange = (page) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
    fetchLocations(activeTab, page, searchText);
  };

  // Handle click outside suggestions
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        suggestionRef.current &&
        !suggestionRef.current.contains(event.target) &&
        searchInputRef.current &&
        !searchInputRef.current.contains(event.target)
      ) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Clear search
  const clearSearch = () => {
    setSearchText("");
    setSuggestions([]);
    setShowSuggestions(false);
    fetchLocations(activeTab, 1);
  };

  // Format location display
  const formatLocation = (location) => {
    const parts = [];
    if (location.sub_community) parts.push(location.sub_community);
    if (location.community) parts.push(location.community);
    if (location.city) parts.push(location.city);

    return parts.join(", ");
  };

  return (
    <div className="max-w-6xl mx-auto p-4">
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 p-4 rounded-t-lg shadow-md mb-6">
        <h2 className="text-xl md:text-2xl font-bold text-white">
          Available Locations
        </h2>
        <p className="text-blue-100 text-sm md:text-base">
          Browse our properties in various communities
        </p>
      </div>

      {/* Search Bar */}
      <div className="mb-6 relative">
        <div className="flex items-center bg-white border border-gray-300 rounded-lg overflow-hidden">
          <div className="p-2" onClick={handleSearch}>
            <Search className="h-5 w-5 text-gray-500" />
          </div>
          <input
            ref={searchInputRef}
            type="text"
            value={searchText}
            onChange={handleSearchChange}
            placeholder="Search locations..."
            className="w-full py-2 px-1 outline-none"
          />
          {searchText && (
            <button
              onClick={clearSearch}
              className="p-2 text-gray-500 hover:text-gray-700"
            >
              <X className="h-5 w-5" />
            </button>
          )}
        </div>

        {/* Suggestions Dropdown */}
        {showSuggestions && suggestions.length > 0 && (
          <div
            ref={suggestionRef}
            className="absolute z-10 w-full bg-white mt-1 rounded-lg shadow-lg max-h-80 overflow-y-auto"
          >
            {suggestions.map((suggestion, index) => (
              <div
                key={`${suggestion.id}-${index}`}
                className="p-3 hover:bg-gray-100 cursor-pointer border-b border-gray-100 flex items-start"
                onClick={() => handleSuggestionClick(suggestion)}
              >
                <MapPin className="h-5 w-5 text-gray-500 mt-1 mr-2 flex-shrink-0" />
                <div>
                  <div className="font-medium">
                    {suggestion.location ||
                      suggestion.building ||
                      suggestion.sub_community}
                  </div>
                  <div className="text-sm text-gray-600">
                    {formatLocation(suggestion)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Tabs */}
      <div className="flex mb-4 border-b">
        <button
          className={`px-4 py-2 font-medium ${
            activeTab === "pf"
              ? "text-blue-600 border-b-2 border-blue-600"
              : "text-gray-500 hover:text-gray-700"
          }`}
          onClick={() => handleTabChange("pf")}
        >
          PF Locations
        </button>
        <button
          className={`px-4 py-2 font-medium ${
            activeTab === "bayut"
              ? "text-blue-600 border-b-2 border-blue-600"
              : "text-gray-500 hover:text-gray-700"
          }`}
          onClick={() => handleTabChange("bayut")}
        >
          Bayut Locations
        </button>
      </div>
      {/* <div className='flex gap-4 relative'>
      <button 
          onClick={() => setOpenAddLocation(true)}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors flex items-center absolute right-2"
          >
          <PlusCircle size={16} className="mr-2" />
          Add Location
        </button>

      <button 
          onClick={() => setOpenImportBulkLocation(true)}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors flex items-center absolute right-24"
          >
          <PlusCircle size={16} className="mr-2" />
          Import Bulk
        </button>
            </div> */}
      <div className="flex mb-8 relative items-center">
        <div className="absolute top-2 right-2 flex  mb-4">
          <button
            onClick={() => setOpenAddLocation(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors flex items-center mx-4"
          >
            <PlusCircle size={16} className="mr-2" />
            Add Location
          </button>

          <button
            onClick={() => setOpenImportBulkLocation(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors flex items-center "
          >
            <PlusCircle size={16} className="mr-2" />
            Import Bulk
          </button>
        </div>

        <AddLocation
          isModalOpen={openAddLocation}
          onClose={() => setOpenAddLocation(false)}
          type={activeTab}
        />
        <BulkImportLocation
          isModalOpen={openImportBulkLocation}
          onClose={() => setOpenImportBulkLocation(false)}
          type="locations"
        />
      </div>

      {/* Location List */}

      <LocationsList
        locations={locations}
        isLoading={isLoading}
        onDeleteSuccess={(deletedId) => {
          setLocations((prev) => prev.filter((loc) => loc.id !== deletedId));
        }}
      />

      {/* Pagination */}
      {locations.length > 0 && (
        <div className="mt-6 flex justify-center items-center space-x-2">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className={`p-2 rounded-md ${
              currentPage === 1
                ? "text-gray-300 cursor-not-allowed"
                : "text-gray-600 hover:bg-gray-100"
            }`}
          >
            <ChevronLeft className="h-5 w-5" />
          </button>

          <div className="flex space-x-1">
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              // Calculate page numbers to show (centered around current page)
              let pageNum;
              if (totalPages <= 5) {
                pageNum = i + 1;
              } else if (currentPage <= 3) {
                pageNum = i + 1;
              } else if (currentPage >= totalPages - 2) {
                pageNum = totalPages - 4 + i;
              } else {
                pageNum = currentPage - 2 + i;
              }

              return (
                <button
                  key={pageNum}
                  onClick={() => handlePageChange(pageNum)}
                  className={`h-8 w-8 flex items-center justify-center rounded-md ${
                    currentPage === pageNum
                      ? "bg-blue-600 text-white"
                      : "text-gray-600 hover:bg-gray-100"
                  }`}
                >
                  {pageNum}
                </button>
              );
            })}

            {totalPages > 5 && currentPage < totalPages - 2 && (
              <>
                <span className="px-1 self-end">...</span>
                <button
                  onClick={() => handlePageChange(totalPages)}
                  className="h-8 w-8 flex items-center justify-center rounded-md text-gray-600 hover:bg-gray-100"
                >
                  {totalPages}
                </button>
              </>
            )}
          </div>

          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className={`p-2 rounded-md ${
              currentPage === totalPages
                ? "text-gray-300 cursor-not-allowed"
                : "text-gray-600 hover:bg-gray-100"
            }`}
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
      )}

      {/* Current page info */}
      {locations.length > 0 && (
        <div className="mt-2 text-center text-sm text-gray-500">
          Page {currentPage} of {totalPages}
        </div>
      )}
    </div>
  );
}
