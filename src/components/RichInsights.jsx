import React from 'react';

const RichInsights = () => {
  return (
    <div className="bg-white py-16 px-4 md:px-10">
      <div className="container mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Left Section */}
        <div>
          <h2 className="text-5xl font-semibold bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-green-500 mb-8">Rich Insights</h2>
          <p className="text-gray-600 mb-6 text-xl">
            Understand data and analyse your performance on Bayut with this exclusive section on Profolio.
            Gain detailed information on traffic, ROI and demand for properties in specific geographies and
            discover areas with the most earning potential for agents.
          </p>
          <ul className="list-disc list-inside text-gray-600 mb-8">
            <li>Competitive Insights</li>
            <li>Market Insights</li>
          </ul>
          <button className="bg-green-500 hover:bg-green-600 text-white font-semibold py-3 px-6 rounded-md transition duration-300 ease-in-out">
            WATCH NOW
          </button>
        </div>

        {/* Right Section (Image Placeholder) */}
        <div>
          <img
            src="/analysis_ss.png" // Replace with the actual image path
            alt="Rich Insights Data"
            className="w-full rounded-lg shadow-lg"
          />
        </div>
      </div>
    </div>
  );
};

export default RichInsights;