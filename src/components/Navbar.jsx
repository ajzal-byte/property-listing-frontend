import React, { useState } from "react";
import {
  ChevronDown,
  User,
  Building2,
  FileText,
  Link2,
  LogOut,
  MapPin,
  Heart,
  Globe,
  Share2,
  Hand,
  Building,

} from "lucide-react";
import Flag from "react-world-flags";
import { useNavigate } from "react-router-dom";

const Dropdown = ({ trigger, items, align = "right", onSelect, selectedValue }) => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const handleItemClick = (item) => {
    // Close dropdown
    setIsOpen(false);
    
    // Handle navigation if needed
    if (item.label === 'Permission Management') {
      navigate('/permissions');
    } else if (item.label === 'My profile') {
      navigate('/profile');
    } else if (item.label === 'My company') {
      navigate('/company');
    } else if (item.label === 'My subscriptions') {
      navigate('/pricing');
    } else if (item.label === 'Manage Developers') {
      navigate('/developers');
    } else if (item.label === 'Manage Locations') {
      navigate('/locations');
    }
    else if (item.label === 'Log Out'){
      localStorage.removeItem("authToken")
      window.location.reload()
    }
    
    // Call onSelect if provided
    if (onSelect) {
      onSelect(item);
    }
  };

  // Update the trigger component if selectedValue is available
  const triggerComponent = selectedValue ? 
    React.cloneElement(trigger, { children: React.Children.map(trigger.props.children, child => {
      // Find and update the text span element
      if (child.type === 'span' && child.props.className?.includes('font-semibold')) {
        return React.cloneElement(child, {}, selectedValue.label);
      }
      // If flag is needed, update it
      if (selectedValue.country && child.type === Flag) {
        return React.cloneElement(child, { code: selectedValue.country });
      }
      return child;
    })}) : trigger;

  return (
    <div className="relative">
      <div
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center cursor-pointer"
      >
        {triggerComponent}
      </div>
      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-10"
            onClick={() => setIsOpen(false)}
          />
          <div
            className={`absolute z-20 mt-4 p-1 w-64 bg-white rounded-xl shadow-lg border border-gray-100
              ${align === "right" ? "right-0" : "left-0"}
              transform transition-all duration-200
            `}
          >
            {items.map((item, index) => (
              <div
                key={index}
                onClick={() => handleItemClick(item)}
                className={`px-4 py-3.5 text-sm cursor-pointer transition-all duration-200 rounded-2xl
                  ${
                    item.danger
                      ? "text-red-600 hover:bg-red-50 hover:text-red-700"
                      : "text-gray-700 hover:bg-blue-100"
                  }
                  ${item.active || (selectedValue && item.label === selectedValue.label) 
                    ? "bg-blue-500 text-white hover:bg-blue-600 hover:text-white" 
                    : ""}
                  flex items-center gap-3
                `}
              >
                {item.country && (
                  <span className="inline-block w-6">
                    {item.country && <Flag code={item.country} />}
                  </span>
                )}
                {item.icon && (
                  <item.icon
                    size={18}
                    className={(item.active || (selectedValue && item.label === selectedValue.label)) 
                      ? "text-white" 
                      : "text-gray-400"}
                  />
                )}
                <span className={`font-medium ${(item.active || (selectedValue && item.label === selectedValue.label)) 
                  ? "text-white" 
                  : ""}`}>
                  {item.label}
                </span>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

// Rest of the Navbar component with state management
const Navbar = () => {
  const navigate = useNavigate();
  const [selectedCountry, setSelectedCountry] = useState({ label: "United States", country: "us", active: true });
  const [selectedCurrency, setSelectedCurrency] = useState({ label: "AED", country: "are", active: true });
  const [selectedLanguage, setSelectedLanguage] = useState({ label: "English", active: true });
  const [selectedUnit, setSelectedUnit] = useState({ label: "m²", active: true });

const profileItems = [
  { icon: User, label: "My profile", active: false },
  { icon: Building2, label: "My company", active: false },
  { icon: FileText, label: "My subscriptions", active: false },
  { icon: FileText, label: "My transactions", active: false },
  { icon: Link2, label: "My integrations", active: false },

  ...(JSON.parse(localStorage.getItem("userData")).role.name == "super_admin"        //conditionally shows these two tabs only when role is super_admin
    ? [
        { icon: Building, label: "Manage Developers", active: false },
        { icon: MapPin, label: "Manage Locations", active: false },
      ]
    : []),

  { icon: Building2, label: "My properties", active: false },
  { icon: Share2, label: "Invite", active: false },
  { icon: Hand, label: "Permission Management", active: false },
  { icon: LogOut, label: "Log Out", danger: true, active: false },
];
  const countryItems = [
    { label: "All", country: "", active: false },
    { label: "United States", country: "us", active: false },
    { label: "United Kingdom", country: "gbr", active: false },
    { label: "Emirates", country: "ae", active: false },
    { label: "Canada", country: "can", active: false },
  ];

  const currencyItems = [
    { label: "AED", country: "are", active: false },
    { label: "USD", country: "us", active: false },
    { label: "GBP", country: "gbr" , active: false},
  ];

  const languageItems = [
    { label: "English", active: false }, 
    { label: "Arabic", active: false }
  ];

  const unitItems = [
    { label: "m²", active: false },
    { label: "ft²", active: false },
  ];

  return (
    <nav className="bg-gradient-to-b from-white to-gray-50/80 border-b border-gray-100 px-6 pb-6">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center">
          <Dropdown
            align="left"
            selectedValue={selectedCountry}
            onSelect={setSelectedCountry}
            trigger={
              <div className="flex items-center text-gray-700 bg-white shadow-lg shadow-blue-500/5 hover:shadow-blue-500/10 transition-all rounded-2xl py-3 px-5">
                <Globe size={18} className="mr-3 text-blue-500" />
                <span className="text-sm font-semibold">United States</span>
                <ChevronDown size={16} className="ml-3 text-blue-500" />
              </div>
            }
            items={countryItems}
          />
        </div>

        <div className="flex items-center gap-6">
          <div className="flex items-center gap-3 bg-white shadow-lg shadow-blue-500/5 rounded-2xl p-1.5">
            <Dropdown
              selectedValue={selectedCurrency}
              onSelect={setSelectedCurrency}
              trigger={
                <div className="flex items-center gap-2 text-gray-700 hover:bg-blue-100 transition-all rounded-xl py-2 px-3">
                  <Flag code="are" className="w-5 h-5" />
                  <span className="text-sm font-semibold">AED</span>
                  <ChevronDown size={16} className="ml-1 text-blue-500" />
                </div>
              }
              items={currencyItems}
            />

            <div className="w-px h-6 bg-gray-100" />

            <Dropdown
              selectedValue={selectedLanguage}
              onSelect={setSelectedLanguage}
              trigger={
                <div className="flex items-center gap-2 text-gray-700 hover:bg-blue-100 transition-all rounded-xl py-2 px-3">
                  <span className="text-sm font-semibold">English</span>
                  <ChevronDown size={16} className="text-blue-500" />
                </div>
              }
              items={languageItems}
            />

            <div className="w-px h-6 bg-gray-100" />

            <Dropdown
              selectedValue={selectedUnit}
              onSelect={setSelectedUnit}
              trigger={
                <div className="flex items-center gap-2 text-gray-700 hover:bg-blue-100 transition-all rounded-xl py-2 px-3">
                  <span className="text-sm font-semibold">m²</span>
                  <ChevronDown size={16} className="text-blue-500" />
                </div>
              }
              items={unitItems}
            />
          </div>

          <div className="flex items-center gap-3">
            <button className="flex items-center gap-2 text-gray-700 bg-white shadow-lg shadow-blue-500/5 hover:shadow-blue-500/10 transition-all rounded-2xl py-3 px-5">
              <Heart size={18} className="text-blue-500" />
              <span className="text-sm font-semibold">Favorites</span>
              <span className="flex items-center justify-center w-5 h-5 text-xs font-bold bg-gray-100 rounded-lg">0</span>
            </button>

            <Dropdown
              trigger={
                <div className="flex items-center gap-2 text-gray-700 bg-white shadow-lg shadow-blue-500/5 hover:shadow-blue-500/10 transition-all rounded-2xl p-2">
                  <div className="w-8 h-8 bg-blue-500 text-white rounded-xl flex items-center justify-center">
                    <User size={16} />
                  </div>
                </div>
              }
              items={profileItems}
            />
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;