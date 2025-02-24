import React from 'react';

const LeadCards = ({leadData}) => {
  
  // Calculate metrics
  const totalLeads = leadData.length;
  const convertedLeads = leadData.filter(lead => lead.status === "Closed").length;
  const junkLeads = leadData.filter(lead => lead.status === "Junk").length;
  
  const conversionRate = totalLeads > 0 ? ((convertedLeads / totalLeads) * 100).toFixed(1) : 0;
  const lostRate = totalLeads > 0 ? ((junkLeads / totalLeads) * 100).toFixed(1) : 0;

  return (
    <div className="p-6 bg-gray-50 rounded-lg">
      <div className="flex flex-col space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Active Leads Card */}
          <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-lg shadow-md overflow-hidden">
            <div className="p-4 flex justify-between items-center">
              <h3 className="text-white font-medium text-lg">Number of active leads</h3>
              <div className="text-white opacity-70">
              </div>
            </div>
            <div className="px-6 pb-6 flex justify-center items-center">
              <span className="text-7xl font-light text-white">{totalLeads}</span>
            </div>
          </div>
          
          {/* Conversion Rate Card */}
          <div className="bg-gradient-to-br from-blue-400 to-blue-500 rounded-lg shadow-md overflow-hidden">
            <div className="p-4 flex justify-between items-center">
              <h3 className="text-white font-medium text-lg">Conversion</h3>
              <div className="text-white opacity-70">
              </div>
            </div>
            <div className="px-6 pb-6 flex justify-center items-center">
              <span className="text-7xl font-light text-white">{conversionRate}%</span>
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {/* Converted Leads Card */}
          <div className="bg-gradient-to-br from-blue-300 to-blue-400 rounded-lg shadow-md overflow-hidden">
            <div className="p-4">
              <h3 className="text-white font-medium text-lg">Number of converted leads</h3>
            </div>
            <div className="px-6 pb-6 flex justify-center items-center">
              <span className="text-6xl font-light text-white">{convertedLeads}</span>
            </div>
          </div>
          
          {/* Junk Leads Card */}
          <div className="bg-gradient-to-br from-yellow-400 to-yellow-500 rounded-lg shadow-md overflow-hidden">
            <div className="p-4">
              <h3 className="text-white font-medium text-lg">Number of junk leads</h3>
            </div>
            <div className="px-6 pb-6 flex justify-center items-center">
              <span className="text-6xl font-light text-white">{junkLeads}</span>
            </div>
          </div>
          
          {/* Lost Rate Card */}
          <div className="bg-gradient-to-br from-red-500 to-red-600 rounded-lg shadow-md overflow-hidden">
            <div className="p-4">
              <h3 className="text-white font-medium text-lg">Lost</h3>
            </div>
            <div className="px-6 pb-6 flex justify-center items-center">
              <span className="text-6xl font-light text-white">{lostRate}%</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LeadCards;