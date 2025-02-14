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
  Share2
} from "lucide-react";
import Flag from "react-world-flags";

const Dropdown = ({ trigger, items, align = "right" }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <div
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center cursor-pointer"
      >
        {trigger}
      </div>
      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-10"
            onClick={() => setIsOpen(false)}
          />
          <div
            className={`absolute z-20 mt-4 p-1 w-64 bg-white rounded-3xl shadow-lg border border-gray-100
              ${align === "right" ? "right-0" : "left-0"}
              transform transition-all duration-200
            `}
          >
            {items.map((item, index) => (
              <div
                key={index}
                onClick={() => {
                  item.onClick?.();
                  setIsOpen(false);
                }}
                className={`px-4 py-3.5 text-sm cursor-pointer transition-all duration-200 rounded-2xl
                  ${
                    item.danger
                      ? "text-red-600 hover:bg-red-50 hover:text-red-700"
                      : "text-gray-700 hover:bg-gray-50"
                  }
                  ${item.active ? "bg-blue-500 text-white hover:bg-blue-600 hover:text-white" : ""}
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
                    className={item.active ? "text-white" : "text-gray-400"}
                  />
                )}
                <span className="font-medium">{item.label}</span>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

// Rest of the Navbar component remains the same...
const Navbar = () => {
  const profileItems = [
    { icon: User, label: "My profile" },
    { icon: Building2, label: "My company" },
    { icon: FileText, label: "My subscriptions" },
    { icon: FileText, label: "My transactions" },
    { icon: Link2, label: "My integrations" },
    { icon: Building2, label: "My properties" },
    { icon: Share2, label: "Invite" },
    { icon: LogOut, label: "Log Out", danger: true },

  ];

  const countryItems = [
    { label: "United States", country: "us", active: true },
    { label: "United Kingdom", country: "gbr" },
    { label: "Canada", country: "can" },
  ];

  const currencyItems = [
    { label: "AED", active: true, country: "are" },
    { label: "USD", country: "us" },
    { label: "GBP", country: "gbr" },
  ];

  const unitItems = [
    { label: "m²", active: true },
    { label: "ft²" },
  ];

  return (
    <nav className="bg-gradient-to-b from-white to-gray-50/80 border-b border-gray-100 px-6 py-4">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center">
          <Dropdown
            align="left"
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
              trigger={
                <div className="flex items-center gap-2 text-gray-700 hover:bg-gray-50 transition-all rounded-xl py-2 px-3">
                  <Flag code="are" className="w-5 h-5" />
                  <span className="text-sm font-semibold">AED</span>
                  <ChevronDown size={16} className="ml-1 text-blue-500" />
                </div>
              }
              items={currencyItems}
            />

            <div className="w-px h-6 bg-gray-100" />

            <Dropdown
              trigger={
                <div className="flex items-center gap-2 text-gray-700 hover:bg-gray-50 transition-all rounded-xl py-2 px-3">
                  <span className="text-sm font-semibold">English</span>
                  <ChevronDown size={16} className="text-blue-500" />
                </div>
              }
              items={[{ label: "English", active: true }, { label: "Arabic" }]}
            />

            <div className="w-px h-6 bg-gray-100" />

            <Dropdown
              trigger={
                <div className="flex items-center gap-2 text-gray-700 hover:bg-gray-50 transition-all rounded-xl py-2 px-3">
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