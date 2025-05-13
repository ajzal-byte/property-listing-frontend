import React, { useState, useContext, useEffect } from "react";
import {
  Heart,
  BedDouble,
  Bath,
  Home,
  Ruler,
  Calendar,
  Tag,
  CheckCircle,
  Layers,
  ChevronDown,
} from "lucide-react";
import ViewContext from "../../contexts/ViewContext";
import MainContentContext from "../../contexts/MainContentContext";
import MainTabContext from "../../contexts/TabContext";
import { tabs } from "../../enums/sidebarTabsEnums";
import Fetcher from "../../utils/Fetcher";
import ListView from "../ListView";
import LayoutGrid from "../LayoutGrid";
import Pagination from "../Pagination";
import ClassicCard from "./ClassicCard";
import PropertyCard from "./PropertyCard";
import { ActionTypes, actionSections } from "../../enums/actionTypesEnums.jsx";
import { toast } from "react-toastify";


// Property Card Component

// Main CardGrid Component
const CardGrid = ({ cards }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(8);

  const { viewType } = useContext(ViewContext);
  const [selectListingArray, setSelectListingArray] = useState([]);
  const { mainContent } = useContext(MainContentContext);
  const { setMainTab } = useContext(MainTabContext);
  const [authToken, setAuthToken] = useState(localStorage.getItem("authToken"));
  const [selectAllChecked, setSelectAllChecked] = useState(false);

  const { loading, response, error } = Fetcher({
    isGetAll: true,
    url: import.meta.env.VITE_GETALL_LISTING,
    method: "GET",
    headers: {
      Authorization: `Bearer ${authToken}`,
      Accept: "application/json",
    },
    onSuccess: (res) => console.log("Data is:", res),
  });

  console.log("error outside is: ", error);

  // Set the main tab
  useEffect(() => {
    setMainTab(tabs.OFFPLAN);
  }, [setMainTab]);

  const isClassicView = viewType === "classic";
  const isListView = viewType === "list";

  // Determine if we're using the API data or mock data
  const listings = response ? response : [];
  console.log("response outside is: ", response);

  console.log("listings are: ", listings);

  // Calculate pagination
  const totalItems = listings.length || 0;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentListings = listings.slice(indexOfFirstItem, indexOfLastItem);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  useEffect(()=>{
    console.log("listing selection array: ", selectListingArray);
    
  }, [selectAllChecked, selectListingArray])

  const handleSelectAllChange = () => {
    if (selectAllChecked) {
      // Uncheck: clear all selected listings
      setSelectListingArray([]);
    } else {
      // Check: select all visible listings
      const allIds = listings.map((listing) => listing.id);
      setSelectListingArray(allIds);
    }
    setSelectAllChecked(!selectAllChecked);
  };

  const performAction = async (actionField, listingArray) => {
  const toastId = toast.loading("Performing action...");

  try {
    const response = await fetch("https://backend.myemirateshome.com/api/listing/action", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${authToken}`,
      },
      body: JSON.stringify({
        action: actionField,
        propertyId: listingArray,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Something went wrong.");
    }

    const result = await response.json();
    console.log("Action success:", result);

    toast.update(toastId, {
      render: "Action completed successfully.",
      type: "success",
      isLoading: false,
      autoClose: 3000,
    });

    // Reset selection, close dropdown, refresh data if needed
    setSelectListingArray([]);
    setDropdownOpen(false);

    // You can optionally refresh data here
    // e.g. refetch the listings if Fetcher supports it

  } catch (err) {
    console.error("Action error:", err);
    toast.update(toastId, {
      render: `Failed: ${err.message}`,
      type: "error",
      isLoading: false,
      autoClose: 4000,
    });
  }
};


const handleAction = (actionField, listingArray) => {
  if (listingArray.length === 0) {
    toast.warning("Please select at least one listing.");
    return;
  }

  const actionName = actionField.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase());

  toast.info(
    ({ closeToast }) => (
      <div>
        <p>Are you sure you want to perform:</p>
        <strong>{actionName}</strong>
        <div className="mt-2 flex justify-end gap-2">
          <button
            onClick={() => {
              closeToast();
              performAction(actionField, listingArray);
            }}
            className="px-3 py-1 text-sm bg-indigo-600 text-white rounded hover:bg-indigo-700"
          >
            Confirm
          </button>
          <button
            onClick={closeToast}
            className="px-3 py-1 text-sm border rounded hover:bg-gray-100"
          >
            Cancel
          </button>
        </div>
      </div>
    ),
    { autoClose: false }
  );
};


  return (
    <div className="container mx-auto px-4 py-8">
      <div className="relative flex justify-end mx-4">
        <div>
          <button
            className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded-md shadow-sm transition-colors duration-200 mb-4"
            onClick={toggleDropdown}
          >
            <Layers size={18} />
            <span>Bulk Actions</span>
            <ChevronDown
              size={16}
              className={`transition-transform duration-200 ${
                dropdownOpen ? "rotate-180" : ""
              }`}
            />
          </button>

          {dropdownOpen && (
            <div className="absolute top-full right-0 mt-1 w-56 bg-white rounded-md shadow-lg py-1 z-20 text-sm max-h-96 overflow-y-auto">
              {/* SELECT ALL TICK */}
              <label className="flex items-center gap-2 px-2 py-4 hover:bg-gray-100 rounded cursor-pointer">
                <input
                  type="checkbox"
                  className="w-5 h-5 text-indigo-600 rounded focus:ring-indigo-500"
                  checked={selectAllChecked}
                  onChange={handleSelectAllChange}
                />

                <span className="text-gray-800 text-md font-medium">
                  Select All
                </span>
              </label>

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
                        onClick={() => handleAction(action.action_field, selectListingArray)}
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
      </div>

      <div className="min-h-[600px]">
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : error ? (
          <div className="text-center text-red-500">
            Error {error.status} : {error.message}
          </div>
        ) : (
          <>
            {isListView ? (
              <ListView currentCards={currentListings} />
            ) : (
              <div
                className={`
                ${
                  isClassicView
                    ? "space-y-6"
                    : "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-y-6 gap-x-3"
                }
                  `}
              >
                {currentListings.map((listing, index) => (
                  <div
                    key={listing.id || index}
                    className={`
                    ${isClassicView ? "mb-6 last:mb-0" : "h-full"}
                    transition-transform duration-200 hover:scale-102
                    hover:shadow-lg rounded-lg cursor-pointer
                    `}
                    // onClick={() => handleCardClick(listing.id)}
                  >
                    {isClassicView ? (
                      <ClassicCard listing={listing} />
                    ) : (
                      <div className="h-full">
                        <PropertyCard
                          listing={listing}
                          selectListingArray={selectListingArray}
                          setSelectListingArray={setSelectListingArray}
                          handleAction = {handleAction}
                        />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* Pagination Component */}
            {totalItems > 0 && (
              <div className="mt-8 flex justify-center">
                <Pagination
                  itemsPerPage={itemsPerPage}
                  setItemsPerPage={setItemsPerPage}
                  currentPage={currentPage}
                  setCurrentPage={setCurrentPage}
                  totalItems={totalItems}
                />
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default CardGrid;
