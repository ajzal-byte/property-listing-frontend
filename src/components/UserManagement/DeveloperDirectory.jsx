import { useState, useEffect } from "react";
import {
  Users,
  Globe,
  Phone,
  Mail,
  Loader2,
  Search,
  RefreshCw,
  PlusCircle,
  Trash2,
} from "lucide-react";
import AddDeveloper from "./AddDeveloper";

export default function DeveloperDirectory() {
  const [developers, setDevelopers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [openAddDeveloper, setOpenAddDeveloper] = useState(false);

  const fetchDevelopers = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(
        "https://backend.myemirateshome.com/api/developers",
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error(`API request failed with status ${response.status}`);
      }

      const data = await response.json();
      setDevelopers(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDevelopers();
  }, []);

  const filteredDevelopers = developers.filter(
    (dev) =>
      dev.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      dev.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      dev.website.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-AE", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const handleDelete = async (developerId) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this developer?"
    );
    if (!confirmed) return;

    try {
      const res = await fetch(
        `https://backend.myemirateshome.com/api/developers/${developerId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
        }
      );

      if (res.ok) {
        alert("Developer deleted successfully.");
        setDevelopers((prev) => prev.filter((dev) => dev.id !== developerId));
      } 
      else {
        const errorData = await res.json();
        alert(
          `Failed to delete location: ${errorData.message || res.statusText}`
        );
      }
    } catch (error) {
      alert("An error occurred while deleting the location.");
      console.error(error);
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center space-x-3">
            <div className="bg-blue-600 p-2 rounded-lg">
              <Users className="h-6 w-6 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-gray-800">
              Developer Directory
            </h1>
          </div>
          <button
            onClick={fetchDevelopers}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition-colors"
          >
            <RefreshCw className="h-4 w-4" />
            <span>Refresh</span>
          </button>
        </div>

        {/* Search Bar */}
        <div className="relative mb-6">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search by name, email or website..."
            className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Developer Cards */}
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <Loader2 className="h-8 w-8 text-blue-600 animate-spin" />
            <span className="ml-2 text-lg text-gray-600">
              Loading developers...
            </span>
          </div>
        ) : error && developers.length === 0 ? (
          <div className="bg-red-50 p-4 rounded-lg border border-red-200">
            <p className="text-red-600">Error: {error}</p>
            <p className="text-gray-600 mt-2">
              Please try again later or contact support.
            </p>
          </div>
        ) : (
          <>
            <div className="flex mb-4 relative items-center">
              <p className="text-gray-600 mb-4">
                Showing {filteredDevelopers.length} developer
                {filteredDevelopers.length !== 1 ? "s" : ""}
              </p>
              <button
                onClick={() => setOpenAddDeveloper(true)}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors flex items-center absolute top-2 right-2"
              >
                <PlusCircle size={16} className="mr-2" />
                Add Developer
              </button>

              <AddDeveloper
                isModalOpen={openAddDeveloper}
                onClose={() => setOpenAddDeveloper(false)}
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredDevelopers.map((dev) => (
                <div
                  key={dev.id}
                  className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow border border-gray-100 overflow-hidden relative"
                >
                  {/* Delete Button */}
                  <button
                    onClick={() => handleDelete(dev.id)}
                    className="absolute top-5 right-3 text-gray-400 hover:text-red-600 transition-colors z-10"
                    aria-label="Delete developer"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>

                  {/* Top border color strip */}
                  <div className="bg-blue-600 h-2" />

                  {/* Card content */}
                  <div className="p-6">
                    <h2 className="text-xl font-bold text-gray-800 mb-2">
                      {dev.name}
                    </h2>

                    <div className="space-y-3 mt-4">
                      <div className="flex items-start space-x-3">
                        <Mail className="h-5 w-5 text-blue-500 mt-0.5" />
                        <div>
                          <p className="text-sm text-gray-500">Email</p>
                          <a
                            href={`mailto:${dev.email}`}
                            className="text-gray-800 hover:text-blue-600 transition-colors"
                          >
                            {dev.email}
                          </a>
                        </div>
                      </div>

                      <div className="flex items-start space-x-3">
                        <Phone className="h-5 w-5 text-blue-500 mt-0.5" />
                        <div>
                          <p className="text-sm text-gray-500">Phone</p>
                          <a
                            href={`tel:${dev.phone}`}
                            className="text-gray-800 hover:text-blue-600 transition-colors"
                          >
                            {dev.phone}
                          </a>
                        </div>
                      </div>

                      <div className="flex items-start space-x-3">
                        <Globe className="h-5 w-5 text-blue-500 mt-0.5" />
                        <div>
                          <p className="text-sm text-gray-500">Website</p>
                          <a
                            href={dev.website}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:text-blue-800 transition-colors"
                          >
                            {dev.website.replace(/^https?:\/\//, "")}
                          </a>
                        </div>
                      </div>
                    </div>

                    <div className="mt-4 pt-4 border-t border-gray-100">
                      <p className="text-xs text-gray-500">
                        Added on {formatDate(dev.created_at)}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {filteredDevelopers.length === 0 && (
              <div className="text-center py-16">
                <p className="text-gray-500">
                  No developers found matching your search.
                </p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
