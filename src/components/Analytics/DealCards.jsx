import React from 'react';

const DealCards = ({ dealData }) => {
  // Group 1: Deal values by status
  const totalDealsValue = dealData.reduce((sum, deal) => sum + (deal.amount || 0), 0);
  const wonDealsValue = dealData.filter(deal => deal.status === "won").reduce((sum, deal) => sum + (deal.amount || 0), 0);
  const inProgressDealsValue = dealData.filter(deal => deal.status === "progress").reduce((sum, deal) => sum + (deal.amount || 0), 0);
  
  // Group 2: Deal values by invoice type
  const invoicedSalesValue = dealData.filter(deal => deal.type === "invoiced").reduce((sum, deal) => sum + (deal.amount || 0), 0);
  const uninvoicedSalesValue = dealData.filter(deal => deal.type === "uninvoiced").reduce((sum, deal) => sum + (deal.amount || 0), 0);
  
  // Group 3: Deal counts and activity metrics
  const inProgressDealsCount = dealData.filter(deal => deal.status === "progress").length;
  const onHoldDealsCount = dealData.filter(deal => deal.status === "hold").length;
  
  // Group 4: Deal category metrics
  const offplanDealsCount = dealData.filter(deal => deal.category === "offplan").length;
  const secondaryDealsCount = dealData.filter(deal => deal.category === "secondary").length;
  
  // Calculate total activity (sum of calls, meetings, emails across all deals)
  const totalActivity = dealData.reduce((sum, deal) => {
    const callCount = deal.details?.calls || 0;
    const meetingCount = deal.details?.meetings || 0;
    const emailCount = deal.details?.emails || 0;
    return sum + callCount + meetingCount + emailCount;
  }, 0);
  
  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "AED",
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="p-6 bg-gray-50 rounded-lg">
      <div className="flex flex-col space-y-6">
        {/* Group 1: Deal Values by Status */}
        <div>
          <h2 className="text-xl font-bold text-gray-800 mb-3">Deal Value Analytics</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Total Value Card */}
            <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg shadow-md overflow-hidden">
              <div className="p-4">
                <h3 className="text-white font-medium text-lg">Total Value of Deals</h3>
                <div className="text-white opacity-80 mt-2">
                  <div className="font-semibold text-white">Amount:</div>
                  {formatCurrency(totalDealsValue)}
                </div>
              </div>
              <div className="px-6 pb-6 flex justify-center items-center">
                <span className="text-5xl font-light text-white">{dealData.length} Deals</span>
              </div>
            </div>
            
            {/* Won Deals Value Card */}
            <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-lg shadow-md overflow-hidden">
              <div className="p-4">
                <h3 className="text-white font-medium text-lg">Won Deals Value</h3>
                <div className="text-white opacity-80 mt-2">
                  <div className="font-semibold text-white">Amount:</div>
                  {formatCurrency(wonDealsValue)}
                </div>
              </div>
              <div className="px-6 pb-6 flex justify-center items-center">
                <span className="text-5xl font-light text-white">
                  {dealData.filter(deal => deal.status === "won").length} Deals
                </span>
              </div>
            </div>
            
            {/* In Progress Deals Value Card */}
            <div className="bg-gradient-to-br from-blue-400 to-blue-500 rounded-lg shadow-md overflow-hidden">
              <div className="p-4">
                <h3 className="text-white font-medium text-lg">In-Progress Value</h3>
                <div className="text-white opacity-80 mt-2">
                  <div className="font-semibold text-white">Amount:</div>
                  {formatCurrency(inProgressDealsValue)}
                </div>
              </div>
              <div className="px-6 pb-6 flex justify-center items-center">
                <span className="text-5xl font-light text-white">
                  {inProgressDealsCount} Deals
                </span>
              </div>
            </div>
          </div>
        </div>
        
        {/* Group 2: Invoice Type Values */}
        <div>
          <h2 className="text-xl font-bold text-gray-800 mb-3">Sales Type Analytics</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Invoiced Sales Card */}
            <div className="bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-lg shadow-md overflow-hidden">
              <div className="p-4">
                <h3 className="text-white font-medium text-lg">Invoiced Sales</h3>
                <div className="text-white opacity-80 mt-2">
                  <div className="font-semibold text-white">Amount:</div>
                  {formatCurrency(invoicedSalesValue)}
                </div>
              </div>
              <div className="px-6 pb-6 flex justify-center items-center">
                <span className="text-5xl font-light text-white">
                  {dealData.filter(deal => deal.type === "invoiced").length} Deals
                </span>
              </div>
            </div>
            
            {/* Uninvoiced Sales Card */}
            <div className="bg-gradient-to-br from-yellow-400 to-yellow-500 rounded-lg shadow-md overflow-hidden">
              <div className="p-4">
                <h3 className="text-white font-medium text-lg">Uninvoiced Sales</h3>
                <div className="text-white opacity-80 mt-2">
                  <div className="font-semibold text-white">Amount:</div>
                  {formatCurrency(uninvoicedSalesValue)}
                </div>
              </div>
              <div className="px-6 pb-6 flex justify-center items-center">
                <span className="text-5xl font-light text-white">
                  {dealData.filter(deal => deal.type === "uninvoiced").length} Deals
                </span>
              </div>
            </div>
            
            {/* Won Deals Card (again) */}
            <div className="bg-gradient-to-br from-green-400 to-green-500 rounded-lg shadow-md overflow-hidden">
              <div className="p-4">
                <h3 className="text-white font-medium text-lg">Won Deals</h3>
                <div className="text-white opacity-80 mt-2">
                  <div className="font-semibold text-white">Amount:</div>
                  {formatCurrency(wonDealsValue)}
                </div>
              </div>
              <div className="px-6 pb-6 flex justify-center items-center">
                <span className="text-5xl font-light text-white">
                  {dealData.filter(deal => deal.status === "won").length} Deals
                </span>
              </div>
            </div>
          </div>
        </div>
        
        {/* Group 3: Activity Metrics */}
        <div>
          <h2 className="text-xl font-bold text-gray-800 mb-3">Activity Metrics</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Deals in Progress Count Card */}
            <div className="bg-gradient-to-br from-blue-300 to-blue-400 rounded-lg shadow-md overflow-hidden">
              <div className="p-4">
                <h3 className="text-white font-medium text-lg">Deals in Progress</h3>
              </div>
              <div className="px-6 pb-6 flex justify-center items-center">
                <span className="text-6xl font-light text-white">{inProgressDealsCount}</span>
              </div>
            </div>
            
            {/* Activity Count Card */}
            <div className="bg-gradient-to-br from-pink-400 to-pink-500 rounded-lg shadow-md overflow-hidden">
              <div className="p-4">
                <h3 className="text-white font-medium text-lg">Total Activities</h3>
                <div className="text-white opacity-80 mt-2">
                  <div className="text-sm">
                    Calls, Meetings & Emails
                  </div>
                </div>
              </div>
              <div className="px-6 pb-6 flex justify-center items-center">
                <span className="text-6xl font-light text-white">{totalActivity}</span>
              </div>
            </div>
            
            {/* On Hold Deals Count Card */}
            <div className="bg-gradient-to-br from-red-400 to-red-500 rounded-lg shadow-md overflow-hidden">
              <div className="p-4">
                <h3 className="text-white font-medium text-lg">Deals On Hold</h3>
              </div>
              <div className="px-6 pb-6 flex justify-center items-center">
                <span className="text-6xl font-light text-white">{onHoldDealsCount}</span>
              </div>
            </div>
          </div>
        </div>
        
        {/* Group 4: Category Metrics */}
        <div>
          <h2 className="text-xl font-bold text-gray-800 mb-3">Category Metrics</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Deals in Progress Count Card */}
            <div className="bg-gradient-to-br from-orange-300 to-orange-400 rounded-lg shadow-md overflow-hidden">
              <div className="p-4">
                <h3 className="text-white font-medium text-lg">Off-plan Deals</h3>
              </div>
              <div className="px-6 pb-6 flex justify-center items-center">
                <span className="text-6xl font-light text-white">{offplanDealsCount}</span>
              </div>
            </div>
            
            {/* On Hold Deals Count Card */}
            <div className="bg-gradient-to-br from-purple-400 to-purple-500 rounded-lg shadow-md overflow-hidden">
              <div className="p-4">
                <h3 className="text-white font-medium text-lg">Secondary Deals</h3>
              </div>
              <div className="px-6 pb-6 flex justify-center items-center">
                <span className="text-6xl font-light text-white">{secondaryDealsCount}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DealCards;