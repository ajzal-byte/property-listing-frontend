import React, { useState, useContext } from "react";
import { Building, GraduationCap, ChevronDown, BadgeHelp, ChartNoAxesCombined, Signature, ClipboardCheck } from "lucide-react";
import TabContext from "./../contexts/TabContext";
import { tabs } from "../enums/sidebarTabsEnums";

const PageHeader = () => {
  const [isHovered, setIsHovered] = useState(false);
  const { mainTab } = useContext(TabContext);

  if (mainTab === tabs.HIDDEN) {
    return null;
  }

  return (
    <div
      className="relative mx-5 transform transition-all duration-300 ease-in-out"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div
        className={`
      ${
        mainTab == tabs.OFFPLAN || mainTab == tabs.SUPPORT
          ? "bg-gradient-to-r from-blue-600 to-blue-800 "
          : mainTab == tabs.SECONDARY
          ? "bg-gradient-to-r from-blue-300 to-blue-500 "
          : mainTab == tabs.ACADEMY
          ? "bg-gradient-to-r from-green-600 to-green-800 "
          : mainTab == tabs.ANALYTICS
          ? "bg-gradient-to-r from-blue-400 to-blue-500 "
          : "bg-gradient-to-r from-yellow-600 to-yellow-800 "
      }
        bg-gradient-to-r from-blue-600 to-blue-800 
        rounded-xl shadow-lg 
        transition-all duration-500 ease-in-out
        ${isHovered ? "scale-[1.02] shadow-xl" : ""}
      `}
      >
        {/* Main Content */}
        <div className="relative z-10 p-8">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-start space-x-6">
              {/* Icon Container */}
              <div
                className={`
                bg-white/10 p-3 rounded-xl
                transform transition-all duration-300
                ${isHovered ? "rotate-6 scale-110" : ""}
              `}
              >
                {mainTab == tabs.OFFPLAN || mainTab == tabs.SECONDARY ? (
                  <Building
                    className={`
                  w-8 h-8 text-white
                  transition-all duration-300
                  ${isHovered ? "animate-pulse" : ""}
                `}
                  />
                ) : mainTab == tabs.ACADEMY ? (
                  <GraduationCap
                    className={`w-8 h-8 text-white transition-all duration-300 ${
                      isHovered ? "animate-pulse" : ""
                    }`}
                  />
                ) : mainTab == tabs.ANALYTICS ? (
                  <ChartNoAxesCombined
                    className={`w-8 h-8 text-white transition-all duration-300 ${
                      isHovered ? "animate-pulse" : ""
                    }`}
                  />
                ) : mainTab == tabs.APPROVALS ? (
                  <Signature
                    className={`w-8 h-8 text-white transition-all duration-300 ${
                      isHovered ? "animate-pulse" : ""
                    }`}
                  />
                ) : mainTab == tabs.MY_REQUESTS ? (
                  <ClipboardCheck
                    className={`w-8 h-8 text-white transition-all duration-300 ${
                      isHovered ? "animate-pulse" : ""
                    }`}
                  />
                ) : mainTab == tabs.SUPPORT ? (
                  <BadgeHelp
                    className={`w-8 h-8 text-white transition-all duration-300 ${
                      isHovered ? "animate-pulse" : ""
                    }`}
                  />
                ) : (
                  <GraduationCap
                    className={`
                  w-8 h-8 text-white
                  transition-all duration-300
                  ${isHovered ? "animate-pulse" : ""}
                `}
                  />
                )}
              </div>

              {/* Text Content */}
              <div className="flex-1">
                <h1
                  className={`
                  text-3xl font-bold text-white
                  tracking-tight leading-tight
                  transition-all duration-300
                  ${isHovered ? "text-4xl" : ""}
                `}
                >
                  {mainTab == tabs.OFFPLAN
                    ? "Off Plan Listings"
                    : mainTab == tabs.SECONDARY
                    ? "Listings"
                    : mainTab == tabs.ACADEMY
                    ? "Welcome to our Academy"
                    : mainTab == tabs.ANALYTICS
                    ? "Take insight into Analytics"
                    : mainTab == tabs.APPROVALS
                    ? "Manage Approvals"
                    : mainTab == tabs.MY_REQUESTS
                    ? "My Listing Requests"
                    : mainTab == tabs.SUPPORT
                    ? "Welcome to VortexWeb Support"
                    : ""}
                </h1>
                {/* Description - Slides down on hover */}
                <div
                  className={`
                  overflow-hidden transition-all duration-500 ease-in-out
                  ${
                    isHovered
                      ? "mt-4 max-h-32 opacity-100"
                      : "max-h-0 opacity-0"
                  }
                `}
                >
                  <p className="text-blue-100 text-lg leading-relaxed">
                    {mainTab == tabs.OFFPLAN ? (
                      "Browse our top Offplan Listings "
                    ) : mainTab == tabs.SECONDARY ? (
                      "Browse our top Property Listings "
                    ) : mainTab == tabs.ACADEMY ? (
                      "Explore our platform to discover new opportunities for growth and learning"
                    ) : mainTab == tabs.ANALYTICS ? (
                      "Gain insights into your listings metrics"
                    ) : mainTab == tabs.APPROVALS ? (
                      "Manage and review property approvals"
                    ) : mainTab == tabs.MY_REQUESTS ? (
                      "View your listing requests"
                    ) : mainTab == tabs.SUPPORT ? (
                      <div className="bg-white/10 backdrop-blur-sm p-6 rounded-xl border border-white/20 max-w-md">
                        {" "}
                        We're here to help you with any questions or concerns
                        about our services.
                      </div>
                    ) : (
                      " "
                    )}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Hover Indicator */}
      {/* <ChevronDown
        className={`
        w-6 h-6 text-blue-500 mx-auto mt-2
        transition-all duration-300
        ${isHovered ? "opacity-0" : "opacity-50 animate-bounce"}
      `}
      /> */}
    </div>
  );
};

export default PageHeader;
