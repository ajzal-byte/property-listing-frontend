import React, { useState, useEffect, useContext } from 'react';
import { pricingData } from '../mockdata/mockData';
import { tabs } from '../enums/sidebarTabsEnums';
import MainTabContext from './../contexts/TabContext';
// Mock data for pricing plans


const PricingPage = () => {
  const [billingCycle, setBillingCycle] = useState('monthly');
  const [hoveredCard, setHoveredCard] = useState(null);
  const { setMainTab } = useContext(MainTabContext);

  useEffect(() => {
    setMainTab(tabs.HIDDEN);
  }, [setMainTab]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-blue-100 flex items-center justify-center p-4 pt-48">
      <div className="max-w-6xl w-full bg-white rounded-lg shadow-lg p-8">
    

        {/* Pricing Header */}
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">Plans & Pricing</h1>
          <p className="text-gray-600 max-w-md mx-auto">
            Whether your time-saving automation needs are large or small, we're here to help you scale.
          </p>
          
          {/* Toggle */}
          <div className="mt-6 inline-flex bg-gray-100 rounded-full p-1">
            <button
              className={`py-2 px-6 rounded-full text-sm ${
                billingCycle === 'monthly' ? 'bg-purple-500 text-white' : 'text-gray-600'
              }`}
              onClick={() => setBillingCycle('monthly')}
            >
              MONTHLY
            </button>
            <button
              className={`py-2 px-6 rounded-full text-sm ${
                billingCycle === 'yearly' ? 'bg-purple-500 text-white' : 'text-gray-600'
              }`}
              onClick={() => setBillingCycle('yearly')}
            >
              YEARLY
            </button>
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-3 gap-6">
          {pricingData[billingCycle].map((plan) => (
            <div
              key={plan.id}
              className={`rounded-lg p-6 transition-all duration-300 ${
                hoveredCard === plan.id 
                    ? 'transform scale-105 bg-indigo-900 text-white' 
                    : 'bg-gray-50'
              }`}
              onMouseEnter={() => setHoveredCard(plan.id)}
              onMouseLeave={() => setHoveredCard(null)}
            >
              {plan.popular && (
                <div className={`text-xs font-medium mb-4 text-center bg-indigo-800 py-1 px-3 rounded-full inline-block text-white`}>
                  MOST POPULAR
                </div>
              )}
              <div className="text-3xl font-bold mb-2">
                AED {plan.price}
                <span className="text-sm font-normal ml-1">/{billingCycle === 'monthly' ? 'month' : 'year'}</span>
              </div>
              <h3 className="text-xl font-bold mb-2">{plan.name}</h3>
              <p className={`text-sm mb-6 ${hoveredCard == plan.id ? 'hover:text-indigo-200' : 'text-gray-600'}`}>
                {plan.description}
              </p>
              <ul className="space-y-3 mb-8">
                {plan.features.map((feature, index) => (
                  <li key={index} className="flex items-start">
                    <svg
                      className={`h-5 w-5 mr-2 text-purple-500`}
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span className="text-sm">{feature}</span>
                  </li>
                ))}
              </ul>
              <button
                className={`w-full py-3 rounded-md transition-colors font-medium ${
                  hoveredCard == plan.id
                    ? 'bg-purple-500 hover:bg-purple-600 text-white'
                    : 'bg-gray-300 hover:bg-gray-400 text-gray-700'
                }`}
              >
                Choose plan
              </button>
            </div>
          ))}
        </div>
        
        {/* Footer */}
        <div className="mt-16 text-center text-gray-500">
          <div className="flex justify-center items-center space-x-4">
            <span className="font-medium">#DesignedByVortexweb</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PricingPage;