import { Trash2 } from "lucide-react";

export default function LocationsList({ locations = [], isLoading = false, onDeleteSuccess  }) {

   const handleDelete = async (locationId) => {
    const confirmed = window.confirm("Are you sure you want to delete this location?");
    if (!confirmed) return;

    try {
      const res = await fetch(`https://backend.myemirateshome.com/api/locations/${locationId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
      });

      if (res.ok) {
        alert("Location deleted successfully.");
        if (onDeleteSuccess) onDeleteSuccess(locationId); // optional callback to refresh or remove from UI
      } else {
        const errorData = await res.json();
        alert(`Failed to delete location: ${errorData.message || res.statusText}`);
      }
    } catch (error) {
      alert("An error occurred while deleting the location.");
      console.error(error);
    }
  };

  return (
    <div className="w-[100%] mx-auto px-4 sm:px-6 lg:px-8 py-6 ">
      {isLoading ? (
        <div className="bg-white p-8 rounded-b-lg shadow-md flex flex-col items-center justify-center">
          <div className="inline-block h-10 w-10 animate-spin rounded-full border-4 border-solid border-blue-600 border-r-transparent"></div>
          <p className="mt-4 text-gray-600 font-medium">Loading locations...</p>
        </div>
      ) : locations.length > 0 ? (
        <div className="bg-white rounded-b-lg shadow-md p-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {locations.map((location) => (
              <div
                key={location.id}
                className="relative bg-white border border-gray-200 rounded-lg hover:shadow-lg transition-all duration-200 hover:border-blue-300 h-full"
              >
                {/* Delete Icon */}
                <button
                  onClick={() => handleDelete(location.id)} 
                  className="absolute top-2 right-2 p-1 text-gray-400 hover:text-red-500 "
                  aria-label="Delete"
                >
                  <Trash2 className="w-5 h-5" />
                </button>

                <div className="bg-gradient-to-r from-blue-50 to-white p-4 border-b border-gray-100">
                  <h3 className="text-lg font-medium text-gray-800">
                    {location.location ||
                      location.building ||
                      location.sub_community}
                  </h3>
                </div>

                <div className="p-4 text-gray-700 space-y-2">
                  {location.building && (
                    <div className="flex flex-col sm:flex-row sm:items-center py-1">
                      <span className="font-medium text-gray-600 sm:w-32 text-sm">
                        Building:
                      </span>
                      <span className="text-gray-800">{location.building}</span>
                    </div>
                  )}
                  {location.sub_community && (
                    <div className="flex flex-col sm:flex-row sm:items-center py-1">
                      <span className="font-medium text-gray-600 sm:w-32 text-sm">
                        Sub Community:
                      </span>
                      <span className="text-gray-800">
                        {location.sub_community}
                      </span>
                    </div>
                  )}
                  {location.community && (
                    <div className="flex flex-col sm:flex-row sm:items-center py-1">
                      <span className="font-medium text-gray-600 sm:w-32 text-sm">
                        Community:
                      </span>
                      <span className="text-gray-800">
                        {location.community}
                      </span>
                    </div>
                  )}
                  {location.city && (
                    <div className="flex flex-col sm:flex-row sm:items-center py-1">
                      <span className="font-medium text-gray-600 sm:w-32 text-sm">
                        City:
                      </span>
                      <span className="text-gray-800">{location.city}</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="bg-white p-12 rounded-b-lg shadow-md text-center">
          <div className="text-blue-600 mb-4">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-12 w-12 mx-auto"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <p className="text-gray-600 text-lg font-medium">
            No locations found
          </p>
          <p className="text-gray-500">Try adjusting your search criteria</p>
        </div>
      )}
    </div>
  );
}
