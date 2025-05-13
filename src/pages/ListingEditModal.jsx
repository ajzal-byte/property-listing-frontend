import { useState, useEffect } from "react";
import { X } from "lucide-react";
import ListingEditForm from "./ListingEditForm"; // Import your existing form component

export function ListingEditModal({ 
  isOpen, 
  onClose, 
  listing, 
  authToken, 
  developers, 
  locations, 
  pfLocations, 
  bayutLocations, 
  agents, 
  amenitiesList,
  onSuccess 
}) {
  if (!isOpen) return null;

  

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto backdrop-blur-md bg-opacity-50 flex items-center justify-center ml-64 p-24">
      <div className="relative w-full max-w-6xl max-h-[90vh] overflow-y-auto bg-white rounded-lg shadow-xl">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-700"
        >
          <X size={20} />
        </button>
        
        <div className="p-2">
          <ListingEditForm 
            listing={listing}
            authToken={authToken}
            developers={developers}
            locations={locations}
            pfLocations={pfLocations}
            bayutLocations={bayutLocations}
            agents={agents}
            amenitiesList={amenitiesList}
            onSuccess={() => {
              onSuccess?.();
              setTimeout(() => onClose(), 1500); // Close after showing success message
            }}
            onCancel={onClose}
          />
        </div>
      </div>
    </div>
  );
}