import { useState, useEffect } from "react";
import {
  PropertyTypeEnum,
  OfferingTypeEnum,
  StatusEnum,
  TimePeriodEnum,
} from "../enums/createListingsEnums";
import { Save, X, Upload, Image, Trash2 } from "lucide-react";

export default function ListingEditForm({
  listing,
  authToken,
  developers = [],
  locations = [],
  agents = [],
  amenitiesList = [],
  onSuccess = () => {},
  onCancel = () => {},
}) {
  const [formData, setFormData] = useState({
    title_en: "",
    title_ar: "",
    desc_en: "",
    desc_ar: "",
    reference_no: "",
    property_type: "",
    offering_type: "",
    dtcm_permit_number: "",
    amount_type: "",
    size: "",
    bedrooms: "",
    bathrooms: "",
    furnished: "",
    developer_id: "",
    pf_location: "",
    bayut_location: "",
    company_id: "",
    agent_id: "",
    financial_status_id: "",
    rera_permit_number: "",
    rera_issue_date: "",
    rera_expiration_date: "",
    contract_expiry_date: "",
    available_from: "",
    status: "",
    amenities: [],
    photo_urls: [],
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  // Pre-fill form with existing listing data
  useEffect(() => {
    if (listing) {
      // Transform photos if needed to match expected format
      const transformedListing = {
        ...listing,
        // Ensure photo_urls is correctly formatted
        photo_urls:
          listing.photos?.map((photo) => ({
            file_url: photo.image_url,
            is_main: photo.is_main,
          })) ||
          listing.photo_urls ||
          [],
      };

      setFormData(transformedListing);
    }
  }, [listing]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleAmenitiesChange = (amenityId) => {
    const updatedAmenities = [...formData.amenities];
    const index = updatedAmenities.indexOf(amenityId);

    if (index === -1) {
      updatedAmenities.push(amenityId);
    } else {
      updatedAmenities.splice(index, 1);
    }

    setFormData({ ...formData, amenities: updatedAmenities });
  };

  const handlePhotoDelete = (index) => {
    const updatedPhotos = [...formData.photo_urls];
    updatedPhotos.splice(index, 1);
    setFormData({ ...formData, photo_urls: updatedPhotos });
  };

  const handleSetMainPhoto = (index) => {
    const updatedPhotos = formData.photo_urls.map((photo, i) => ({
      ...photo,
      is_main: i === index,
    }));
    setFormData({ ...formData, photo_urls: updatedPhotos });
  };

  const [originalData, setOriginalData] = useState({});

  // Store original data for comparison
  useEffect(() => {
    if (listing) {
      // Transform the photos if needed to ensure consistent format
      const transformedListing = {
        ...listing,
        // Ensure photo_urls is correctly formatted
        photo_urls:
          listing.photos?.map((photo) => ({
            file_url: photo.image_url,
            is_main: photo.is_main,
          })) ||
          listing.photo_urls ||
          [],
      };

      // Store original data for later comparison
      setOriginalData(transformedListing);
    }
  }, [listing]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    // Only include fields that have changed
    const changedFields = {};

    // Compare each field with original data
    Object.keys(formData).forEach((key) => {
      // Skip if the field is undefined or null in the form
      if (formData[key] === undefined || formData[key] === null) return;

      // Special handling for arrays
      if (Array.isArray(formData[key])) {
        // Simple check for amenities which are just IDs
        if (key === "amenities") {
          // If arrays are different lengths or content changed
          if (
            !originalData[key] ||
            JSON.stringify(formData[key].sort()) !==
              JSON.stringify(originalData[key].sort())
          ) {
            changedFields[key] = formData[key];
          }
        }
        // For photo_urls with objects inside
        else if (key === "photo_urls") {
          // Photos likely changed if user interacted with them
          if (
            !originalData[key] ||
            JSON.stringify(formData[key]) !== JSON.stringify(originalData[key])
          ) {
            changedFields[key] = formData[key];
          }
        }
      }
      // For primitive values
      else if (formData[key] !== originalData[key]) {
        changedFields[key] = formData[key];
      }
    });

    // If photos are in the wrong format, ensure they're correctly formatted
    if (changedFields.photos && !changedFields.photo_urls) {
      changedFields.photo_urls = changedFields.photos.map((photo) => ({
        file_url: photo.image_url,
        is_main: photo.is_main,
      }));
      delete changedFields.photos;
    }

    console.log("Submitting changed fields:", JSON.stringify(changedFields));

    // If nothing changed, just return
    if (Object.keys(changedFields).length === 0) {
      setIsSubmitting(false);
      setSuccess(true);
      alert("No changes to update");
      return;
    }

    try {
      const response = await fetch(
        `https://backend.myemirateshome.com/api/listings/${listing.id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authToken}`,
          },
          body: JSON.stringify(changedFields),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update listing");
      }

      setSuccess(true);
      alert("Successfully updated");
      onSuccess();
    } catch (err) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white shadow-lg rounded-lg p-6 max-w-6xl mx-auto">
      <div className="mb-6 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-blue-800">Edit Listing</h1>
        <div className="flex gap-4">
          <button
            onClick={onCancel}
            className="px-4 py-2 rounded-md flex items-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-700"
          >
            <X size={16} /> Cancel
          </button>
          <button
            type="submit"
            form="listing-form"
            disabled={isSubmitting}
            className="px-4 py-2 rounded-md flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white"
          >
            <Save size={16} /> Save Changes
          </button>
        </div>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-md">
          {error}
        </div>
      )}

      {success && (
        <div className="mb-6 p-4 bg-green-100 border border-green-400 text-green-700 rounded-md">
          Listing updated successfully!
        </div>
      )}

      <form id="listing-form" onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Basic Information */}
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-blue-700 border-b border-blue-200 pb-2">
              Basic Information
            </h2>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Title (English)
              </label>
              <input
                type="text"
                name="title_en"
                value={formData.title_en || ""}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Title (Arabic)
              </label>
              <input
                type="text"
                name="title_ar"
                value={formData.title_ar || ""}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                dir="rtl"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Reference Number
              </label>
              <input
                type="text"
                name="reference_no"
                value={formData.reference_no || ""}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>

          {/* Property Details */}
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-blue-700 border-b border-blue-200 pb-2">
              Property Details
            </h2>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Property Type
              </label>
              <select
                name="property_type"
                value={formData.property_type || ""}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Select Property Type</option>
                {PropertyTypeEnum.map((type) => (
                  <option key={type.value} value={type.value}>
                    {type.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Category
              </label>
              <select
                name="offering_type"
                value={formData.offering_type || ""}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Select Category</option>
                {OfferingTypeEnum.map((type) => (
                  <option key={type.value} value={type.value}>
                    {type.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Size (sqft)
              </label>
              <input
                type="text"
                name="size"
                value={formData.size || ""}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Bedrooms
                </label>
                <input
                  type="text"
                  name="bedrooms"
                  value={formData.bedrooms || ""}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Bathrooms
                </label>
                <input
                  type="text"
                  name="bathrooms"
                  value={formData.bathrooms || ""}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Furnished
              </label>
              <select
                name="furnished"
                value={formData.furnished || ""}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Select Option</option>
                <option value="1">Yes</option>
                <option value="0">No</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Rental Period
              </label>
              <select
                name="amount_type"
                value={formData.amount_type || ""}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Select Rental Period</option>
                {TimePeriodEnum.map((period) => (
                  <option key={period.value} value={period.value}>
                    {period.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Additional Information */}
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-blue-700 border-b border-blue-200 pb-2">
              Additional Information
            </h2>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Developer
              </label>
              <select
                name="developer_id"
                value={formData.developer_id || ""}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Select Developer</option>
                {developers.map((developer) => (
                  <option key={developer.id} value={developer.id}>
                    {developer.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Property Finder Location
              </label>
              <select
                name="pf_location"
                value={formData.pf_location || ""}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Select Location</option>
                {locations.map((location) => (
                  <option key={location.id} value={location.id}>
                    {location.location}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Bayut Location
              </label>
              <select
                name="bayut_location"
                value={formData.bayut_location || ""}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Select Location</option>
                {locations.map((location) => (
                  <option key={location.id} value={location.id}>
                    {location.location}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Agent
              </label>
              <select
                name="agent_id"
                value={formData.agent_id || ""}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Select Agent</option>
                {agents.map((agent) => (
                  <option key={agent.id} value={agent.id}>
                    {agent.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Financial Status
              </label>
              <select
                name="financial_status_id"
                value={formData.financial_status_id || ""}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Select Financial Status</option>
                <option value="1">Mortgage</option>
                <option value="2">Cash</option>
                <option value="3">Bank</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Status
              </label>
              <select
                name="status"
                value={formData.status || ""}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Select Status</option>
                {StatusEnum.map((status) => (
                  <option key={status.value} value={status.value}>
                    {status.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Permits & Dates */}
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-blue-700 border-b border-blue-200 pb-2">
              Permits & Dates
            </h2>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                DTCM Permit Number
              </label>
              <input
                type="text"
                name="dtcm_permit_number"
                value={formData.dtcm_permit_number || ""}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                RERA Permit Number
              </label>
              <input
                type="text"
                name="rera_permit_number"
                value={formData.rera_permit_number || ""}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                RERA Issue Date
              </label>
              <input
                type="date"
                name="rera_issue_date"
                value={formData.rera_issue_date || ""}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                RERA Expiration Date
              </label>
              <input
                type="date"
                name="rera_expiration_date"
                value={formData.rera_expiration_date || ""}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Contract Expiry Date
              </label>
              <input
                type="date"
                name="contract_expiry_date"
                value={formData.contract_expiry_date || ""}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Available From
              </label>
              <input
                type="date"
                name="available_from"
                value={formData.available_from || ""}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>

          {/* Description */}
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-blue-700 border-b border-blue-200 pb-2">
              Description
            </h2>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description (English)
              </label>
              <textarea
                name="desc_en"
                value={formData.desc_en || ""}
                onChange={handleChange}
                rows="5"
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              ></textarea>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description (Arabic)
              </label>
              <textarea
                name="desc_ar"
                value={formData.desc_ar || ""}
                onChange={handleChange}
                rows="5"
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                dir="rtl"
              ></textarea>
            </div>
          </div>

          {/* Amenities */}
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-blue-700 border-b border-blue-200 pb-2">
              Amenities
            </h2>

            <div className="grid grid-cols-2 gap-2">
              {amenitiesList.map((amenity) => (
                <div key={amenity.id} className="flex items-center">
                  <input
                    type="checkbox"
                    id={`amenity-${amenity.id}`}
                    checked={formData.amenities?.includes(amenity.id)}
                    onChange={() => handleAmenitiesChange(amenity.id)}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label
                    htmlFor={`amenity-${amenity.id}`}
                    className="ml-2 text-sm text-gray-700"
                  >
                    {amenity.amenity_name}
                  </label>
                </div>
              ))}
            </div>
          </div>

          {/* Photos */}
          <div className="space-y-4 col-span-full">
            <h2 className="text-lg font-semibold text-blue-700 border-b border-blue-200 pb-2">
              Photos
            </h2>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {formData.photo_urls?.map((photo, index) => (
                <div
                  key={index}
                  className="relative group border border-gray-200 rounded-lg overflow-hidden"
                >
                  <img
                    src={photo.file_url || photo.image_url}
                    alt={`Property photo ${index + 1}`}
                    className="w-full h-40 object-cover"
                  />

                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-opacity duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
                    <button
                      type="button"
                      onClick={() => handleSetMainPhoto(index)}
                      className={`p-2 mr-2 rounded-full ${
                        photo.is_main
                          ? "bg-blue-600 text-white"
                          : "bg-white text-blue-600"
                      }`}
                      title={photo.is_main ? "Main Photo" : "Set as Main Photo"}
                    >
                      <Image size={16} />
                    </button>

                    <button
                      type="button"
                      onClick={() => handlePhotoDelete(index)}
                      className="p-2 rounded-full bg-white text-red-600"
                      title="Delete Photo"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>

                  {photo.is_main && (
                    <div className="absolute top-2 left-2 bg-blue-600 text-white text-xs px-2 py-1 rounded-md">
                      Main
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
