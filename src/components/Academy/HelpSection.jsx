import React, { useState } from 'react';
import { Headphones, MessageCircle } from 'lucide-react';
import HelpModal from './HelpModal.jsx'

const HelpSection = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <>
      {/* Help Section */}
      <div className="w-full bg-gradient-to-r from-green-50 to-emerald-50 border-t border-green-100">
        <div className="max-w-4xl mx-auto py-12 px-6 text-center">
          <div className="flex justify-center mb-4">
            <div className="bg-green-100 p-4 rounded-full">
              <Headphones size={32} className="text-green-600" />
            </div>
          </div>
          
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
            Still Need Help?
          </h2>
          
          <p className="text-gray-600 mb-8 max-w-2xl mx-auto text-lg">
            Can't find what you're looking for? Our support team is here to help you get the most out of your Academy experience.
          </p>
          
          <button
            onClick={openModal}
            className="inline-flex items-center gap-3 bg-green-600 hover:bg-green-700 text-white font-semibold px-8 py-4 rounded-xl transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl"
          >
            <MessageCircle size={20} />
            Contact Us
          </button>
          
          <p className="text-sm text-gray-500 mt-4">
            We typically respond within 24 hours
          </p>
        </div>
      </div>

      {/* Contact Modal */}
      <HelpModal isOpen={isModalOpen} onClose={closeModal} />
    </>
  );
};

export default HelpSection;