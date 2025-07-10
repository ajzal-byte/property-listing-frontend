import React, { useState, useEffect } from "react";
import { Camera, X, CheckCircle } from "lucide-react";
import {
  PropertyTypeEnum,
  OfferingTypeEnum,
  StatusEnum,
  TimePeriodEnum,
} from "../enums/createListingsEnums";

const EditListingForm = ({
  listing,
  locations,
  developers,
  agents,
  authToken,
}) => {
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);
  const [photos, setPhotos] = useState([]);

  useEffect(() => {
    // Initialize form data with existing listing data
    if (listing) {
      const initialData = {
        reference_no: listing.reference_no || "",
        title: listing.title || "",
        title_deed: listing.title_deed || "",
        property_type: listing.property_type || "",
        offering_type: listing.offering_type || "",
        size: listing.size || "",
        unit_no: listing.unit_no || "",
        bedrooms: listing.bedrooms || "",
        bathrooms: listing.bathrooms || "",
        parking: listing.parking || "",
        furnished: listing.furnished || "",
        total_plot_size: listing.total_plot_size || "",
        built_up_area: listing.built_up_area || "",
        layout_type: listing.layout_type || "",
        project_name: listing.project_name || "",
        project_status: listing.project_status || "",
        sale_type: listing.sale_type || "",
        developer_id: listing.developer_id || "",
        build_year: listing.build_year || "",
        customer: listing.customer || "",
        rera_permit_number: listing.rera_permit_number || "",
        rera_issue_date: listing.rera_issue_date || "",
        rera_expiration_date: listing.rera_expiration_date || "",
        contract_expiry: listing.contract_expiry || "",
        amount_type: listing.amount_type || "",
        price: listing.price || "",
        payment_method: listing.payment_method || "",
        financial_status: listing.financial_status || "",
        financial_status_id: listing.financial_status_id || "",
        sale_type_1: listing.sale_type_1 || "",
        title_en: listing.title_en || "",
        title_ar: listing.title_ar || "",
        desc_en: listing.desc_en || "",
        desc_ar: listing.desc_ar || "",
        geopoints: listing.geopoints || "",
        listing_owner: listing.listing_owner || "",
        landlord_name: listing.landlord_name || "",
        landlord_contact: listing.landlord_contact || "",
        pf_location: listing.pf_location?.id || "",
        availability: listing.availability || "",
        available_from: listing.available_from || "",
        emirate_amount: listing.emirate_amount || "",
        payment_option: listing.payment_option || "",
        no_of_cheques: listing.no_of_cheques || "",
        contract_charges: listing.contract_charges || "",
        contract_expiry: listing.contract_expiry || "",
        dtcm_permit_number: listing.dtcm_permit_number || "",
        status: listing.status || "",
        watermark: listing.watermark || "0",
        pf_enable: listing.pf_enable ? 1 : 0,
        bayut_enable: listing.bayut_enable ? 1 : 0,
        dubizzle_enable: listing.dubizzle_enable ? 1 : 0,
        website_enable: listing.website_enable ? 1 : 0,
        company_id: listing.company_id || "",
        agent_id: listing.agent_id || "",
        amenities: listing.amenities?.map((a) => a.id) || [],
      };

      setFormData(initialData);

      // Initialize photos
      if (listing.photos && listing.photos.length > 0) {
        setPhotos(
          listing.photos.map((photo) => ({
            id: photo.id,
            image_url: photo.image_url,
            is_main: photo.is_main === 1,
          }))
        );
      }
    }
  }, [listing]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (type === "checkbox") {
      setFormData({
        ...formData,
        [name]: checked ? 1 : 0,
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  const handleRemovePhoto = (photoId) => {
    setPhotos(photos.filter((photo) => photo.id !== photoId));
  };

  const handleSetMainPhoto = (photoId) => {
    setPhotos(
      photos.map((photo) => ({
        ...photo,
        is_main: photo.id === photoId,
      }))
    );
  };

  const prepareDataForSubmission = () => {
    const dataToSubmit = { ...formData };

    // Format photos for API
    if (photos.length > 0) {
      dataToSubmit.photo_urls = photos.map((photo) => ({
        file_url: photo.image_url,
        is_main: photo.is_main,
      }));
    }

    // Convert amenities to array of IDs if present
    if (formData.amenities && Array.isArray(formData.amenities)) {
      dataToSubmit.amenities = formData.amenities;
    }

    return dataToSubmit;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const data = prepareDataForSubmission();

      const response = await fetch(
        `https://backend.myemirateshome.com/api/listings/${listing.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authToken}`,
          },
          body: JSON.stringify(data),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to update listing");
      }

      setSuccess(true);
      window.scrollTo(0, 0);

      // Reset success message after 3 seconds
      setTimeout(() => {
        setSuccess(false);
      }, 3000);
    } catch (err) {
      setError(err.message || "An error occurred while updating the listing");
      window.scrollTo(0, 0);
    } finally {
      setLoading(false);
    }
  };

  // Group form fields for better layout
  const formGroups = {
    basicInfo: [
      "reference_no",
      "title",
      "title_deed",
      "property_type",
      "offering_type",
      "status",
    ],
    propertyDetails: [
      "size",
      "unit_no",
      "bedrooms",
      "bathrooms",
      "parking",
      "furnished",
      "total_plot_size",
      "built_up_area",
      "layout_type",
      "project_name",
      "project_status",
      "build_year",
    ],
    pricing: [
      "price",
      "payment_method",
      "financial_status",
      "financial_status_id",
      "amount_type",
      "emirate_amount",
      "payment_option",
      "no_of_cheques",
      "contract_charges",
    ],
    dates: [
      "available_from",
      "rera_issue_date",
      "rera_expiration_date",
      "contract_expiry",
      "contract_expiry",
    ],
    permits: ["rera_permit_number", "dtcm_permit_number"],
    descriptions: ["title_en", "title_ar", "desc_en", "desc_ar"],
    additional: [
      "geopoints",
      "listing_owner",
      "landlord_name",
      "landlord_contact",
      "customer",
      "sale_type",
      "sale_type_1",
      "availability",
      "watermark",
    ],
    relations: ["pf_location", "developer_id", "agent_id", "company_id"],
    visibility: [
      "pf_enable",
      "bayut_enable",
      "dubizzle_enable",
      "website_enable",
    ],
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="bg-blue-600 p-6">
            <h1 className="text-2xl font-bold text-white">
              Edit Listing: {listing?.title || "Property"}
            </h1>
            <p className="text-blue-100 mt-1">
              Reference: {listing?.reference_no}
            </p>
          </div>

          {success && (
            <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 mb-6 mx-6 mt-6">
              <p className="font-medium">
                Success! The listing has been updated.
              </p>
            </div>
          )}

          {error && (
            <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6 mx-6 mt-6">
              <p className="font-medium">Error: {error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="p-6">
            {/* Photos Section */}
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">
                Property Photos
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {photos.map((photo) => (
                  <div
                    key={photo.id}
                    className="relative group border rounded-lg overflow-hidden"
                  >
                    <img
                      src={photo.image_url}
                      alt="Property"
                      className="w-full h-48 object-cover"
                    />
                    <div className="absolute top-2 right-2 flex space-x-2">
                      <button
                        type="button"
                        onClick={() => handleSetMainPhoto(photo.id)}
                        className={`p-1 rounded-full ${
                          photo.is_main
                            ? "bg-green-500 text-white"
                            : "bg-white text-gray-600 hover:bg-blue-100"
                        }`}
                      >
                        <CheckCircle size={20} />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleRemovePhoto(photo.id)}
                        className="p-1 rounded-full bg-white text-red-600 hover:bg-red-100"
                      >
                        <X size={20} />
                      </button>
                    </div>
                    {photo.is_main && (
                      <div className="absolute bottom-0 left-0 right-0 bg-green-500 text-white text-xs py-1 text-center">
                        Main Photo
                      </div>
                    )}
                  </div>
                ))}
                <div className="border rounded-lg border-dashed border-gray-300 h-48 flex items-center justify-center hover:bg-gray-50 cursor-pointer">
                  <div className="text-center">
                    <Camera className="mx-auto h-12 w-12 text-gray-400" />
                    <span className="mt-2 block text-sm font-medium text-gray-600">
                      Add Photo
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Basic Information */}
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">
                Basic Information
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Number of Cheques
                  </label>
                  <input
                    type="number"
                    name="no_of_cheques"
                    value={formData.no_of_cheques || ""}
                    onChange={handleChange}
                    className="w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Contract Charges
                  </label>
                  <input
                    type="number"
                    name="contract_charges"
                    value={formData.contract_charges || ""}
                    onChange={handleChange}
                    className="w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>
            </div>

            {/* Permits & Dates */}
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">
                Permits & Dates
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    RERA Permit Number
                  </label>
                  <input
                    type="text"
                    name="rera_permit_number"
                    value={formData.rera_permit_number || ""}
                    onChange={handleChange}
                    className="w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
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
                    className="w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
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
                    className="w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Contract Expiry Date
                  </label>
                  <input
                    type="date"
                    name="contract_expiry"
                    value={formData.contract_expiry || ""}
                    onChange={handleChange}
                    className="w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Contract Expiry
                  </label>
                  <input
                    type="date"
                    name="contract_expiry"
                    value={formData.contract_expiry || ""}
                    onChange={handleChange}
                    className="w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
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
                    className="w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    DTCM Permit Number
                  </label>
                  <input
                    type="text"
                    name="dtcm_permit_number"
                    value={formData.dtcm_permit_number || ""}
                    onChange={handleChange}
                    className="w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Availability
                  </label>
                  <input
                    type="text"
                    name="availability"
                    value={formData.availability || ""}
                    onChange={handleChange}
                    className="w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>
            </div>

            {/* Property Descriptions */}
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">
                Property Descriptions
              </h2>
              <div className="grid grid-cols-1 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    English Title
                  </label>
                  <input
                    type="text"
                    name="title_en"
                    value={formData.title_en || ""}
                    onChange={handleChange}
                    className="w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Arabic Title
                  </label>
                  <input
                    type="text"
                    name="title_ar"
                    value={formData.title_ar || ""}
                    onChange={handleChange}
                    className="w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    dir="rtl"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    English Description
                  </label>
                  <textarea
                    name="desc_en"
                    value={formData.desc_en || ""}
                    onChange={handleChange}
                    rows={4}
                    className="w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Arabic Description
                  </label>
                  <textarea
                    name="desc_ar"
                    value={formData.desc_ar || ""}
                    onChange={handleChange}
                    rows={4}
                    className="w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    dir="rtl"
                  />
                </div>
              </div>
            </div>

            {/* Additional Details */}
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">
                Additional Details
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Sale Type
                  </label>
                  <input
                    type="text"
                    name="sale_type"
                    value={formData.sale_type || ""}
                    onChange={handleChange}
                    className="w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Sale Type 1
                  </label>
                  <input
                    type="text"
                    name="sale_type_1"
                    value={formData.sale_type_1 || ""}
                    onChange={handleChange}
                    className="w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Watermark
                  </label>
                  <select
                    name="watermark"
                    value={formData.watermark || "0"}
                    onChange={handleChange}
                    className="w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="0">No</option>
                    <option value="1">Yes</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Visibility Options */}
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">
                Visibility Options
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="pf_enable"
                    name="pf_enable"
                    checked={formData.pf_enable === 1}
                    onChange={handleChange}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label
                    htmlFor="pf_enable"
                    className="ml-2 block text-sm text-gray-700"
                  >
                    PF Enable
                  </label>
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="bayut_enable"
                    name="bayut_enable"
                    checked={formData.bayut_enable === 1}
                    onChange={handleChange}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label
                    htmlFor="bayut_enable"
                    className="ml-2 block text-sm text-gray-700"
                  >
                    Bayut Enable
                  </label>
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="dubizzle_enable"
                    name="dubizzle_enable"
                    checked={formData.dubizzle_enable === 1}
                    onChange={handleChange}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label
                    htmlFor="dubizzle_enable"
                    className="ml-2 block text-sm text-gray-700"
                  >
                    Dubizzle Enable
                  </label>
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="website_enable"
                    name="website_enable"
                    checked={formData.website_enable === 1}
                    onChange={handleChange}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label
                    htmlFor="website_enable"
                    className="ml-2 block text-sm text-gray-700"
                  >
                    Website Enable
                  </label>
                </div>
              </div>
            </div>

            {/* Form Submit */}
            <div className="pt-5">
              <div className="flex justify-end">
                <button
                  type="button"
                  className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 mr-3"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className={`inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
                    loading ? "opacity-75 cursor-not-allowed" : ""
                  }`}
                >
                  {loading ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
