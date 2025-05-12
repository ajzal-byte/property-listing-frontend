import { useState, useEffect } from "react";
import { Save, ArrowRight, Loader2 } from "lucide-react";

// LocationForm component receives the type as a prop
export default function LocationForm({ isModalOpen, onClose, type }) {
  const [localType, setLocalType] = useState("pf");
  const [formData, setFormData] = useState({
    city: "",
    community: "",
    sub_community: "",
    building: "",
    location: "",
    type: localType,
  });

  useEffect(() => {
    setLocalType(type);
    setFormData((prev) => ({
      ...prev,
      type: localType,
    }));
  }, [localType, type]);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  // Auto-construct the location field when other fields change
  useEffect(() => {
    const { city, community, sub_community, building } = formData;
    const parts = [city, community, sub_community, building].filter(
      (part) => part.trim() !== ""
    );
    const constructedLocation = parts.join(" - ");

    setFormData((prev) => ({
      ...prev,
      location: constructedLocation,
    }));
  }, [
    formData.city,
    formData.community,
    formData.sub_community,
    formData.building,
  ]);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");
    setSuccess(false);

    try {
      const authToken = localStorage.getItem("authToken") || "demo-auth-token";
      console.log("location form is: ", formData);

      const response = await fetch(
        "https://backend.myemirateshome.com/api/locations",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authToken}`,
          },
          body: JSON.stringify(formData),
        }
      );

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }

      const data = await response.json();
      setSuccess(true);
      window.alert("Added new Location successfully!");
      // Clear form after successful submission
      setFormData({
        city: "",
        community: "",
        sub_community: "",
        building: "",
        location: "",
        type: localType,
      });
    } catch (err) {
      setError(err.message || "Failed to create location");
    } finally {
      setIsSubmitting(false);

      setTimeout(() => {
        setSuccess(false);
        setError(false);
        onClose(); // close the modal
      }, 1000); // 1 second delay
    }
  };

  if (!isModalOpen) return;

  return (
    <div className="fixed inset-0 z-50 backdrop-blur-md bg-opacity-60 flex items-center justify-center">
      <div className="w-full max-w-2xl h-[70%] p-6 bg-white rounded-lg shadow-lg overflow-auto relative">
        <h2 className="text-2xl font-bold mb-6 text-blue-800">
          Create New Location
        </h2>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-md">
            {error}
          </div>
        )}

        {success && (
          <div className="mb-4 p-3 bg-green-50 border border-green-200 text-green-700 rounded-md">
            Location created successfully!
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="city"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                City *
              </label>
              <input
                type="text"
                id="city"
                name="city"
                value={formData.city}
                onChange={handleChange}
                required
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label
                htmlFor="community"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Community *
              </label>
              <input
                type="text"
                id="community"
                name="community"
                value={formData.community}
                onChange={handleChange}
                required
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label
                htmlFor="sub_community"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Sub Community
              </label>
              <input
                type="text"
                id="sub_community"
                name="sub_community"
                value={formData.sub_community}
                onChange={handleChange}
                required
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label
                htmlFor="building"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Building
              </label>
              <input
                type="text"
                id="building"
                name="building"
                value={formData.building}
                onChange={handleChange}
                required
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="location"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Location
            </label>
            <input
              type="text"
              id="location"
              name="location"
              value={formData.location}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            <p className="mt-1 text-xs text-gray-500"></p>
          </div>

          <div>
            <label
              htmlFor="type"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Type
            </label>
            <input
              type="text"
              id="type"
              name="type"
              value={localType}
              readOnly
              className="w-full p-2 bg-gray-100 border border-gray-300 rounded-md cursor-not-allowed"
            />
          </div>

          <div className="pt-4 flex gap-3">
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex items-center justify-center w-full md:w-auto px-2 py-2 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Submitting...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  Create Location
                </>
              )}
            </button>
            <button
              className="flex items-center justify-center w-full md:w-auto px-2 py-2 bg-gray-400 text-white font-medium rounded-md hover:bg-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors"
              onClick={() => onClose()}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
