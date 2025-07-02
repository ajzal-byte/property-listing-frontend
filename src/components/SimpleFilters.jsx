import React, { useState } from "react";
import {
  Search,
  ChevronDown,
  Map,
  BarChart2,
  PlusCircle,
} from "lucide-react";

import { useContext } from "react";
import ViewContext from "../contexts/ViewContext";
import MainContentContext from "../contexts/MainContentContext";
import { useNavigate } from "react-router-dom";

const FilterDropdown = ({
  label,
  options,
  value,
  onChange,
  className = "",
}) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center justify-between w-full px-4 py-2.5 text-sm bg-white border border-gray-200 rounded-xl hover:border-blue-400 hover:bg-blue-50/50 transition-all duration-200 ${className}`}
      >
        <span className="text-gray-700 font-medium">{value || label}</span>
        <ChevronDown
          size={16}
          className={`ml-2 transition-transform duration-200 text-gray-500 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>
      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-10 bg-black/5"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute z-20 w-full mt-2 bg-white border border-gray-100 rounded-xl shadow-lg">
            {options.map((option) => (
              <div
                key={option}
                className="px-4 py-2.5 text-sm cursor-pointer hover:bg-blue-50 first:rounded-t-xl last:rounded-b-xl transition-colors"
                onClick={() => {
                  onChange(option);
                  setIsOpen(false);
                }}
              >
                {option}
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

const PriceFilter = ({ value, onChange }) => {
  const [isOpen, setIsOpen] = useState(false);

  const priceOptions = [
    "Any",
    "300000 د.ا",
    "350000 د.ا",
    "400000 د.ا",
    "450000 د.ا",
    "500000 د.ا",
    "1000000 د.ا",
  ];

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between w-full px-4 py-2.5 text-sm bg-white border border-gray-200 rounded-xl hover:border-blue-400 hover:bg-blue-50/50 transition-all duration-200"
      >
        <span className="text-gray-700 font-medium">
          {value.from === "Any" && value.to === "Any"
            ? "Price"
            : `${value.from} - ${value.to}`}
        </span>
        <ChevronDown
          size={16}
          className={`ml-2 transition-transform duration-200 text-gray-500 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>
      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-10 bg-black/5"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute z-20 w-72 p-4 mt-2 bg-white border border-gray-100 rounded-xl shadow-lg">
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-gray-600 mb-1.5 font-medium">
                  From
                </label>
                <select
                  value={value.from}
                  onChange={(e) => onChange({ ...value, from: e.target.value })}
                  className="w-full px-3 py-2 text-sm bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                >
                  {priceOptions.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm text-gray-600 mb-1.5 font-medium">
                  To
                </label>
                <select
                  value={value.to}
                  onChange={(e) => onChange({ ...value, to: e.target.value })}
                  className="w-full px-3 py-2 text-sm bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                >
                  {priceOptions.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

const ToggleSwitch = ({ checked, onChange }) => {
  return (
    <div
      onClick={() => onChange(!checked)}
      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 ease-in-out cursor-pointer ${
        checked ? "bg-blue-500" : "bg-gray-200"
      }`}
    >
      <span
        className={`inline-block h-4 w-4 transform rounded-full bg-white shadow-sm transition duration-200 ease-in-out ${
          checked ? "translate-x-6" : "translate-x-1"
        }`}
      />
    </div>
  );
};

const ViewTypeButton = ({ icon: Icon, isActive, onClick }) => (
  <button
    onClick={onClick}
    className={`p-2.5 transition-colors duration-200 ${
      isActive ? "bg-blue-50 text-blue-600" : "hover:bg-gray-50 text-gray-500"
    }`}
  >
    <Icon size={20} />
  </button>
);

const PropertyFilters = () => {
  // const [activeTab, setActiveTab] = useState("Projects");
  //   const [viewType, setViewType] = useState("card");
  const { viewType, setViewType } = useContext(ViewContext);
  const { mainContent, setMainContent } = useContext(MainContentContext);
  const navigate = useNavigate();
  const [showMap, setShowMap] = useState(false);
  const [showAnalytics, setShowAnalytics] = useState(false);
  const [filterForm, setFilterForm] = useState({
    search: "",
    city: "",
    district: "",
    developer: "",
    type: "",
    bedrooms: "",
    price: {
      from: "Any",
      to: "Any",
    },
    relevance: "Relevance",
    launchType: "Any launch type",
    soldOutVisible: false,
  });

  const handleFilterChange = (field, value) => {
    const newForm = { ...filterForm, [field]: value };
    setFilterForm(newForm);
  };

  const resetFilters = () => {
    setFilterForm({
      search: "",
      city: "",
      district: "",
      developer: "",
      type: "",
      bedrooms: "",
      price: {
        from: "Any",
        to: "Any",
      },
      relevance: "Relevance",
      launchType: "Any launch type",
      soldOutVisible: false,
    });
  };

  return (
    <div className="space-y-6 p-6 max-w-[1400px] mx-auto bg-white rounded-2xl shadow-sm">
      {/* Header */}
      {/* <div className="flex items-center justify-between m-0 bg-blue-100 rounded-3xl hover:border border-blue-800">
        <h1 className="text-3xl font-bold text-blue-900 pl-108 p-2 fit-content">Off Plan Listing</h1>
      </div> */}
      {/* <TitleComponent/> */}

      {/* Tabs */}
      <div className="flex border-b border-gray-200">
        <div className="flex flex-between ">
          <button
            onClick={() => setMainContent("Projects")}
            className={`px-6 py-3 -mb-px text-sm font-medium transition-colors ${
              mainContent === "Projects"
                ? "text-blue-600 border-b-2 border-blue-600"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            Projects
          </button>
          {/* <button
            onClick={() => setMainContent("Layouts")}
            className={`px-6 py-3 -mb-px text-sm font-medium transition-colors ${
              mainContent === "Layouts"
                ? "text-blue-600 border-b-2 border-blue-600"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            Layouts
          </button> */}
        </div>

        <div className="absolute gap-2 flex right-8">
          <button
            className={`ml-auto mt-2 md:mt-0 flex items-center px-4 py-2 rounded-lg transition duration-300
                    hover:bg-blue-600 hover:text-white
                    bg-blue-100 text-blue-700 mb-2
                }`}
            onClick={() => {
              navigate("/create-listing");
            }}
          >
            Create Listing
            <PlusCircle className="ml-1 h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Filters */}
      <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
        <div className="space-y-4">
          {/* Search */}
          <div className="relative">
            <Search
              size={20}
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
            />
            <input
              type="text"
              placeholder="Type RC name..."
              value={filterForm.search}
              onChange={(e) => handleFilterChange("search", e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
            />
          </div>

          {/* Main filters */}
          <div className="flex justify-between">
            <div className="flex gap-3">
              <FilterDropdown
                label="City"
                options={["Dubai", "Abu Dhabi", "Sharjah"]}
                value={filterForm.city}
                onChange={(value) => handleFilterChange("city", value)}
              />
              <FilterDropdown
                label="District"
                options={["Downtown", "Marina", "Palm Jumeirah"]}
                value={filterForm.district}
                onChange={(value) => handleFilterChange("district", value)}
              />
              <FilterDropdown
                label="Developer"
                options={["Emaar", "Nakheel", "Dubai Properties"]}
                value={filterForm.developer}
                onChange={(value) => handleFilterChange("developer", value)}
              />
              <FilterDropdown
                label="Type"
                options={["Apartment", "Villa", "Townhouse"]}
                value={filterForm.type}
                onChange={(value) => handleFilterChange("type", value)}
              />
              <FilterDropdown
                label="Bedrooms"
                options={["Studio", "1", "2", "3", "4+"]}
                value={filterForm.bedrooms}
                onChange={(value) => handleFilterChange("bedrooms", value)}
              />
              <PriceFilter
                value={filterForm.price}
                onChange={(value) => handleFilterChange("price", value)}
              />
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                className="px-4 py-2.5 text-sm border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors font-medium"
              >
                Other Filters
              </button>

              {Object.values(filterForm).some(Boolean) && (
                <button
                  type="button"
                  onClick={resetFilters}
                  className="px-4 py-2.5 text-sm text-blue-600 hover:text-blue-700 font-medium"
                >
                  Clear all
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Secondary filters row */}
        <div className="flex items-center justify-between pt-2">
          <div className="flex items-center gap-4">
            {/* UNCOMMENT WHEN CLASSIC CARD ALSO HAS ACTIONS/BULK ACTIONS FUNCTIONALITY */}

            {/* <div className="flex border border-gray-200 rounded-lg overflow-hidden">
              <ViewTypeButton
                icon={LayoutGrid}
                isActive={viewType === "card"}
                onClick={() => setViewType("card")}
              />
              <ViewTypeButton
                icon={LayoutList}
                isActive={viewType === "classic"}
                onClick={() => setViewType("classic")}
              />
          
            </div> */}

            <FilterDropdown
              label="Relevance"
              options={[
                "Most relevant",
                "Newest",
                "Price: Low to High",
                "Price: High to Low",
              ]}
              value={filterForm.relevance}
              onChange={(value) => handleFilterChange("relevance", value)}
              className="bg-gray-50"
            />
            <FilterDropdown
              label="Any launch type"
              options={["Pre-launch", "Launching Soon", "Ready"]}
              value={filterForm.launchType}
              onChange={(value) => handleFilterChange("launchType", value)}
              className="bg-gray-50"
            />

            <div className="flex items-center gap-3">
              <span className="text-sm text-gray-700 font-medium">
                Sold Out visible
              </span>
              <ToggleSwitch
                checked={filterForm.soldOutVisible}
                onChange={(checked) =>
                  handleFilterChange("soldOutVisible", checked)
                }
              />
            </div>
          </div>

          {/* Map & Analytics */}
          <div className="flex items-center gap-3 pt-2">
            <button
              type="button"
              onClick={() => setShowMap(!showMap)}
              className={`flex items-center px-4 py-2.5 text-sm rounded-xl transition-colors ${
                showMap
                  ? "bg-blue-50 text-blue-600 font-medium"
                  : "hover:bg-gray-50 text-gray-700"
              }`}
            >
              <Map size={18} className="mr-2" />
              On map
            </button>
            <button
              type="button"
              onClick={() => setShowAnalytics(!showAnalytics)}
              className={`flex items-center px-4 py-2.5 text-sm ${
                showAnalytics
                  ? "bg-blue-600 text-white"
                  : "border border-blue-500 text-gray-500"
              } rounded-xl hover:bg-blue-700 transition-colors font-medium`}
            >
              <BarChart2 size={18} className="mr-2" />
              Analytics
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default PropertyFilters;
