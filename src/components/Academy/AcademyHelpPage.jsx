import React from "react";
import { Mail, Phone, Globe, BadgeHelp } from "lucide-react";
import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import FAQAccordion from "../Support/FAQAccordion";
import MainTabContext from "./../../contexts/TabContext";
import { tabs } from "./../../enums/sidebarTabsEnums";
import faqs from './academyFaqs';
import HelpSection from "./HelpSection";

const AcademyHelpPage = () => {
    const { setMainTab } = useContext(MainTabContext);
    // const navigate = useNavigate();
    setMainTab(tabs.SUPPORT)
  return (

    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">

      {/* Contact Cards Section */}
      <div className="container mx-auto px-6 py-16 md:py-24">


        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {/* Email Card */}
          <div className="bg-white rounded-2xl shadow-lg transition-transform duration-300 hover:scale-105 overflow-hidden">
            <div className="bg-blue-600 h-2"></div>
            <div className="p-8 flex flex-col items-center">
              <div className="bg-blue-100 p-4 rounded-full mb-6">
                <Mail size={36} className="text-blue-600" />
              </div>
              <h3 className="text-2xl font-semibold text-blue-900 mb-2">
                Email Us
              </h3>
              <p className="text-gray-600 text-center mb-6">
                Get a response within 24 hours from our support team
              </p>
              <a
                href="mailto:support@vortexweb.com"
                className="inline-flex items-center justify-center bg-blue-600 hover:bg-blue-700 text-white py-3 px-6 rounded-lg font-medium transition-colors duration-300 w-full"
              >
                support@vortexweb.com
              </a>
            </div>
          </div>

          {/* WhatsApp Card */}
          <div className="bg-white rounded-2xl shadow-lg transition-transform duration-300 hover:scale-105 overflow-hidden">
            <div className="bg-blue-600 h-2"></div>
            <div className="p-8 flex flex-col items-center">
              <div className="bg-blue-100 p-4 rounded-full mb-6">
                <Phone size={36} className="text-blue-600" />
              </div>
              <h3 className="text-2xl font-semibold text-blue-900 mb-2">
                WhatsApp
              </h3>
              <p className="text-gray-600 text-center mb-6">
                Quick responses for urgent issues via WhatsApp
              </p>
              <a
                href="https://wa.me/97142886713"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center bg-blue-600 hover:bg-blue-700 text-white py-3 px-6 rounded-lg font-medium transition-colors duration-300 w-full"
              >
                Chat with Us
              </a>
            </div>
          </div>

          {/* Website Card */}
          <div className="bg-white rounded-2xl shadow-lg transition-transform duration-300 hover:scale-105 overflow-hidden">
            <div className="bg-blue-600 h-2"></div>
            <div className="p-8 flex flex-col items-center">
              <div className="bg-blue-100 p-4 rounded-full mb-6">
                <Globe size={36} className="text-blue-600" />
              </div>
              <h3 className="text-2xl font-semibold text-blue-900 mb-2">
                Visit Website
              </h3>
              <p className="text-gray-600 text-center mb-6">
                Explore our knowledge base and product information
              </p>
              <a
                href="https://vortexweb.cloud/contact.html"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center bg-blue-600 hover:bg-blue-700 text-white py-3 px-6 rounded-lg font-medium transition-colors duration-300 w-full"
              >
                Visit VortexWeb
              </a>
            </div>
          </div>
        </div>
 
        <HelpSection/>

        <FAQAccordion faqs={faqs} />
      </div>


    </div>
  );
};

export default AcademyHelpPage;
