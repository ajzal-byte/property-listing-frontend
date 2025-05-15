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
  X,
  UserRound,
  Users,
  Building2
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
  const [userData, setUserData] = useState(null);
  const [transferDropdownOpen, setTransferDropdownOpen] = useState(false);
  const [transferType, setTransferType] = useState(null);
  const [transferOptions, setTransferOptions] = useState([]);
  const [selectedTransferEntity, setSelectedTransferEntity] = useState(null);
  const [actionSource, setActionSource] = useState("bulk");
  const [selectListing, setSelectListing] = useState();

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

  // Fetch user data from localStorage
  useEffect(() => {
    const storedUserData = localStorage.getItem("userData");
    if (storedUserData) {
      setUserData(JSON.parse(storedUserData));
    }
  }, []);

  // Set the main tab
  useEffect(() => {
    setMainTab(tabs.SECONDARY);
  }, [setMainTab]);

  const isClassicView = viewType === "classic";
  const isListView = viewType === "list";

  // Determine if we're using the API data or mock data
  const listings = response ? response : [];

  // Calculate pagination
  const totalItems = listings.length || 0;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentListings = listings.slice(indexOfFirstItem, indexOfLastItem);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
    // Close transfer dropdown if open
    if (transferDropdownOpen) {
      setTransferDropdownOpen(false);
    }
  };

  useEffect(() => {
    console.log("listing selection array: ", selectListingArray);
  }, [selectAllChecked, selectListingArray]);

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

  // Fetch transfer options (agents or owners)
  const fetchTransferOptions = async (type, source) => {
    if (!userData || !userData.company_id) {
      toast.error("User data not available");
      return;
    }

    try {
      let url = "";
      if (type === "transfer_agent") {
        url = "https://backend.myemirateshome.com/api/agents/list";
      } else if (type === "transfer_owner") {
        url = "https://backend.myemirateshome.com/api/listOwners";
      } else {
        toast.error("Invalid transfer type");
        return;
      }

      const response = await fetch(url, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${authToken}`,
          Accept: "application/json",
        },
      });

      if (!response.ok) {
        console.log("error response:", response);
        throw new Error(
          "Failed to fetch transfer options: ",
          response.statusText
        );
      }

      const data = await response.json();

      if (type === "transfer_agent") {
        setTransferOptions(data.agents);
      } else if (type === "transfer_owner") {
        setTransferOptions(data.owners);
      }

      setTransferDropdownOpen(true);
      setTransferType(type);
      setSelectedTransferEntity(null);
    } catch (error) {
      console.error("Error fetching transfer options:", error);
      toast.error("Failed to load transfer options");
    }
  };

  const handleTransferSelection = (entity) => {
    setSelectedTransferEntity(entity);
    handleAction(
      transferType,
      selectListingArray,
      actionSource,
      transferType,
      entity.id
    );

    setTransferDropdownOpen(false);
  };

  const performAction = async (
    actionField,
    listingArray,
    transferType = "",
    transferEntityId = ""
  ) => {
    const toastId = toast.loading("Performing action...");

    try {
      // Special handling for transfers
      if (
        transferType === "transfer_agent" ||
        transferType === "transfer_owner"
      ) {
        const url =
          transferType === "transfer_agent"
            ? "https://backend.myemirateshome.com/api/listing/agentbulktransfer"
            : "https://backend.myemirateshome.com/api/listing/ownerbulktransfer";

        const payload = {
          action: transferType,
          propertyIds: listingArray,
          [transferType === "transfer_agent" ? "agent_id" : "owner_id"]:
            transferEntityId,
        };

        const response = await fetch(url, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authToken}`,
          },
          body: JSON.stringify(payload),
        });

        if (!response.ok) {
          const errorData = await response.json();
          console.log("error in performAction: ", errorData);
          throw new Error(
            errorData.message || "Something went wrong with transfer."
          );
        }
      } else {
        // Regular actions
        const response = await fetch(
          "https://backend.myemirateshome.com/api/listing/action",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${authToken}`,
            },
            body: JSON.stringify({
              action: actionField,
              propertyId: listingArray,
            }),
          }
        );

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || "Something went wrong.");
        }
      }

      toast.update(toastId, {
        render: "Action completed successfully.",
        type: "success",
        isLoading: false,
        autoClose: 3000,
      });

      // Reset selection, close dropdowns
      setSelectListingArray([]);
      setDropdownOpen(false);
      setTransferDropdownOpen(false);
      setSelectedTransferEntity(null);
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

  const handleAction = (
    actionField,
    listingArray,
    source = "bulk",
    transfer = "",
    transferEntityId = ""
  ) => {
    console.log("actionField, array of listing, source, ");

    setActionSource(source);

    if (listingArray.length === 0) {
      toast.warning("Please select at least one listing.");
      return;
    }
    if (source == "individual") {
      setSelectListingArray(listingArray);
    }
    // Handle transfer actions differently
    if (actionField === "transfer_agent" || actionField === "transfer_owner") {
      // If transferEntityId is provided, it means user has selected an agent/owner
      if (transferEntityId) {
        const actionName = actionField
          .replace(/_/g, " ")
          .replace(/\b\w/g, (l) => l.toUpperCase());

        toast.info(
          ({ closeToast }) => (
            <div>
              <p>Are you sure you want to perform:</p>
              <strong>{actionName}</strong>
              <div className="mt-2 flex justify-end gap-2">
                <button
                  onClick={() => {
                    closeToast();
                    performAction(
                      actionField,
                      listingArray,
                      transfer,
                      transferEntityId
                    );
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
      } else {
        // Fetch and show transfer options
        fetchTransferOptions(actionField, source);
      }
    } else {
      // Other actions proceed as before
      const actionName = actionField
        .replace(/_/g, " ")
        .replace(/\b\w/g, (l) => l.toUpperCase());

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
    }
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

          {/* Transfer entity selection dropdown */}
          {transferDropdownOpen && (
            <div className="absolute top-full right-0 mt-1 w-64 bg-white rounded-md shadow-lg py-1 z-30 text-sm max-h-96 overflow-y-auto">
              <div className="flex items-center justify-between px-3 py-2 border-b border-gray-200">
                <h3 className="font-medium text-gray-800">
                  Select {transferType === "transfer_agent" ? "Agent" : "Owner"}
                </h3>
                <button
                  onClick={() => setTransferDropdownOpen(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X size={16} />
                </button>
              </div>

              {transferOptions.length === 0 ? (
                <div className="px-3 py-2 text-gray-500">
                  No {transferType === "transfer_agent" ? "agents" : "owners"}{" "}
                  available
                </div>
              ) : (
                <div>
                  {transferOptions.map((entity) => (
                    <button
                      key={entity.id}
                      className="w-full text-left px-4 py-2 hover:bg-blue-50 flex items-center"
                      onClick={() => handleTransferSelection(entity)}
                    >
                      <div className="flex items-center w-full">
                        <div className="h-8 w-8 bg-blue-100 rounded-full flex items-center justify-center mr-2">
                          {transferType === "transfer_agent" ? (
                            <UserRound size={16} className="text-blue-600" />
                          ) : (
                            <Users size={16} className="text-blue-600" />
                          )}
                        </div>
                        <div className="flex flex-col">
                          <span className="text-gray-800 font-medium">
                            {entity.name}
                          </span>
                          <span className="text-gray-500 text-xs">
                            {entity.email}
                          </span>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Main bulk actions dropdown */}
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
                        onClick={() =>
                          handleAction(action.action_field, selectListingArray)
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
        ) : currentListings.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 p-6 text-center">
            <div className="text-gray-400 mb-3">
              <Building2 className="h-15 w-15"/>
            </div>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">
              No Listings Available
            </h3>
            <p className="text-gray-500 max-w-md">
              <span className="block mb-1">
                There are currently no property listings to display for your role.
              </span>
              <span className="text-sm">
                Or server has no listing at all. Please contact Admin.
              </span>
            </p>
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
                  >
                    {isClassicView ? (
                      <ClassicCard listing={listing} />
                    ) : (
                      <div className="h-full">
                        <PropertyCard
                          listing={listing}
                          selectListingArray={selectListingArray}
                          setSelectListingArray={setSelectListingArray}
                          handleAction={handleAction}
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
