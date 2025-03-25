import React from 'react';
import { ArrowRight, PlayCircle, Users, CreditCard, BarChart } from 'lucide-react';
import RichInsights from '../components/RichInsights';

const HomePage = () => {
  return (
    <div className="font-sans">
      {/* Hero Section */}
      <div className="relative  py-2">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center pl-8">
          <div>
      <h1 className="text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-green-600 mb-4">
        VortexEstate<sup className="text-sm">TM</sup>
      </h1>
      <h2 className="text-2xl font-semibold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-green-600 mb-6">
        Best-In-Class Property Management Software
      </h2>
      <p className="bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-green-500 mb-8">
        VortexWeb™ is a robust listings management software, available to all registered agents on major property listing apps.
      </p>
      <div className="flex space-x-4">
        <button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-md transition duration-300 ease-in-out flex items-center">
          REQUEST A DEMO <ArrowRight className="ml-2" size={16} />
        </button>
        <button className="bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold py-3 px-6 rounded-md transition duration-300 ease-in-out flex items-center">
          WATCH NOW <PlayCircle className="ml-2" size={16} />
        </button>
      </div>
    </div>
            <div className="relative">
              <img src="/laptop2.png" alt="Laptop" className="rounded-lg" />
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-teal-200 rounded-full blur-3xl opacity-50"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="bg-white py-4 px-8 mx-4">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Lead Management */}
            <div className="text-center p-6 shadow-2xl hover:shadow-md rounded-lg transition duration-300 ease-in-out transform hover:-translate-y-1">
              <BarChart className="mx-auto text-blue-600 mb-4" size={48} />
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Lead Management</h3>
              <p className="text-gray-600">View, sort, and manage all your leads in one location.</p>
            </div>
            {/* Agency Management */}
            <div className="text-center p-6 shadow-2xl hover:shadow-md rounded-lg transition duration-300 ease-in-out transform hover:-translate-y-1">
              <Users className="mx-auto text-blue-600 mb-4" size={48} />
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Agency Management</h3>
              <p className="text-gray-600">Manage agent profiles, quotas, and listings.</p>
            </div>
            {/* Payment Gateway */}
            <div className="text-center p-6 shadow-2xl hover:shadow-md rounded-lg transition duration-300 ease-in-out transform hover:-translate-y-1">
              <CreditCard className="mx-auto text-blue-600 mb-4" size={48} />
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Payment Gateway</h3>
              <p className="text-gray-600">Automate your billing and simplify your payments to Bayut.</p>
            </div>
          </div>
        </div>
      </div>
      <RichInsights/>
    </div>
  );
};

export default HomePage;