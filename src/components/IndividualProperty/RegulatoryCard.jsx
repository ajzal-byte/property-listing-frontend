import React from 'react';
import { Info } from 'lucide-react';

const RegulatoryInfoCard = () => {
  const infoItems = [
    { label: "Reference", value: "HLS-006334" },
    { label: "Listed", value: "5 days ago" },
    { label: "Broker License", value: "358", hasInfo: true },
    { label: "Zone name", value: "Jabal Ali First" },
    { label: "DLD Permit Number:", value: "65362761970", hasInfo: true },
    { label: "Agent License", value: "25584", hasInfo: true },
  ];

  return (
    <div className="max-w-lg bg-gradient-to-br from-white to-blue-50 rounded-xl shadow-lg p-8 border border-blue-100">
      <h2 className="text-xl font-semibold text-blue-800 mb-6">Regulatory information</h2>
      
      <div className="flex flex-row gap-6">
        <div className="flex-grow">
          <div className="grid grid-cols-2 gap-y-4">
            {infoItems.map((item, index) => (
              <React.Fragment key={index}>
                <div className="text-blue-600 flex items-center text-sm font-medium">
                  {item.label}
                  {item.hasInfo && (
                    <Info size={14} className="ml-1 text-blue-400 hover:text-blue-600 cursor-pointer transition-colors" />
                  )}
                </div>
                <div className={`font-medium ${item.label === "DLD Permit Number:" ? "text-blue-700" : "text-gray-700"}`}>
                  {item.value}
                </div>
              </React.Fragment>
            ))}
          </div>
        </div>
        
        <div className="flex flex-col items-center">
          <div className="bg-white p-2 rounded-lg shadow-md border border-blue-100">
            <img 
              src="/public/sample-qr.png" 
              alt="QR Code" 
              className="w-24 h-24"
            />
          </div>
          <span className="text-xs text-blue-600 mt-3 font-medium">DLD Permit Number</span>
        </div>
      </div>
    </div>
  );
};

export default RegulatoryInfoCard;