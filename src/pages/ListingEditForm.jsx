import { useState, useEffect } from "react";
import {
  PropertyTypeEnum,
  OfferingTypeEnum,
  StatusEnum,
  TimePeriodEnum,
} from "../enums/createListingsEnums";
import { Save, X, Upload, Image, Trash2, Loader } from "lucide-react";
import removeEmptyFields from "../utils/removeEmptyFields";
import getAuthHeaders from "../utils/getAuthHeader";

export default function ListingEditForm({
  listing,
  authToken,
  developers = [],
  locations = [],
  pfLocations = [],
  bayutLocations = [],
  agents = [],
  amenitiesList = [],
  onSuccess = () => {},
  onCancel = () => {},
}) {
  const editableFields = {
    title_en: "",
    title_ar: "",
    desc_en: "",
    desc_ar: "",
    reference_no: "",
    property_type: "",
    offering_type: "",
    dtcm_permit_number: "",
    rental_period: "",
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
  };

  const [formData, setFormData] = useState(editableFields);
  const [sendableData, setSendableData] = useState(editableFields);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [removeImagesList, setRemoveImagesList] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [currentFile, setCurrentFile] = useState('');
  const [newlyUploadedImages, setNewlyUploadedImages] = useState([]);
  // debugging purpose
  useEffect(() => {
    console.log("formData updated:", formData);
  }, [formData]);

  useEffect(() => {
    console.log("sendableData updated:", sendableData);
  }, [sendableData]);

  useEffect(()=>{
    setSendableData((prev) => ({
      ...prev,
      remove_images: removeImagesList,
    }));
  },[removeImagesList])

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
    console.log("pf location name,value: ", name, value);
    console.log([name], value);

    setFormData({ ...formData, [name]: value });
    setSendableData({ ...sendableData, [name]: value });
    // console.log("formData: ",formData);
    // console.log("sendableData: ",sendableData);
  };

  const handleAmenitiesChange = (selectedAmenity) => {
    const isAlreadySelected = formData.amenities.some(
      (am) => am.id === selectedAmenity.id
    );

    const updatedAmenities = isAlreadySelected
      ? formData.amenities.filter((am) => am.id !== selectedAmenity.id) // remove
      : [...formData.amenities, selectedAmenity]; // add

    setFormData({ ...formData, amenities: updatedAmenities });
    setSendableData({
      ...sendableData,
      amenities: updatedAmenities.flatMap((am) => am.id),
    });
  };

  const handleFileSelect = async (e) => {
    if (uploading) return; // Prevent selecting new file while one is uploading

    const file = e.target.files[0];
    if (!file) return;

    setCurrentFile(file);
    await uploadFile(file);
  };

  // Upload file to S3 via presigned URL
  const uploadFile = async (file) => {
    try {
      
      setUploading(true);

      // Get presigned URL
      const fileName = file.name;
      const fileType = file.type;

      const presignedResponse = await fetch(
        `https://backend.myemirateshome.com/api/s3/presigned-url?fileName=${fileName}&fileType=${fileType}`,
        {
          headers: getAuthHeaders(),
        }
      );

      const presignedData = await presignedResponse.json();
      const { uploadUrl, fileUrl } = presignedData;

      await fetch(uploadUrl, {
        method: "PUT",
        body: file,
        headers: {
          "Content-Type": fileType,
        },
      });

      // Add file URL to form data
      const newPhotoUrl = {
        file_url: fileUrl.replace(/ /g, "%20"), //replaces " " with "%20"
        is_main: formData.photo_urls.length === 0, // First image is main by default
      };
      
      if(formData.photo_urls.find(p=> p.file_url == newPhotoUrl.file_url)){
        setError("Uploading Duplicate Image is not allowed")
        setUploading(false)
        setTimeout(() => {
          setError(null); 
        }, 1500);
        return;
      }
      // setFormData({
      //   ...formData,
      //   photo_urls: [...formData.photo_urls, newPhotoUrl],
      // });

      if(!formData.photo_urls.find(p=> (p.file_url == newPhotoUrl.file_url))){
        setNewlyUploadedImages((prev)=> [...prev, newPhotoUrl.file_url])
      }

      
      setFormData((prev) => ({
        ...prev,
        photo_urls: [...formData.photo_urls, newPhotoUrl]
      }));
  
      setSendableData((prev) => ({
        ...prev,
        photo_urls: [...sendableData.photo_urls,newPhotoUrl]
      }));


      setCurrentFile(null);
      setUploading(false);
    } catch (error) {
      console.error("Error uploading file:", error);
      setUploading(false);
    }
  };

  const handlePhotoDelete = (fileUrl) => {
    // const updatedPhotos = formData.photo_urls.filter(
    //   (photo) => photo.file_url !== fileUrl
    // );

    const photoToRemove = formData.photos.find(
      (photo) => photo.image_url == fileUrl
    );

    console.log("photo to remove:", photoToRemove);
    

    // setSendableData((prev) => ({
    //   ...prev,
    //   photo_urls: formData.photo_urls.filter(p=> p.file_url != fileUrl),
    // }));

    if (photoToRemove?.id) {
      setRemoveImagesList((prev) => [...prev, photoToRemove.id]);
    }

    // console.log(`delete logs:`);
    // formData.photo_urls.map(p=> console.log(p.fileUrl)
    // )
    

    setFormData((prev) => ({
      ...prev,
      photo_urls: formData.photo_urls.filter(p=> p.file_url != fileUrl),
    }));

    setSendableData((prev) => ({
      ...prev,
      photo_urls: sendableData.photo_urls.filter(p=> p.file_url != fileUrl),
      remove_images: removeImagesList,
    }));

    newlyUploadedImages.filter(p => p != fileUrl )

    console.log(formData);

   
  };

  const handleSetMainPhoto = (fileUrl) => {
    const updatedPhotos = formData.photo_urls.map((photo) => ({
      ...photo,
      is_main: photo.file_url == fileUrl,
    }));

    const isMainPhoto = formData.photo_urls.find(p => p.file_url == fileUrl)
    console.log("isMainPhoto : ", isMainPhoto);
    // const isMainId = `${formData.photos.find(p => p.image_url == isMainPhoto.file_url).id}`

    
    console.log(formData.photos);
    
    // console.log(isMainId);
    

    setFormData((prev) => ({
      ...prev,
      photo_urls: updatedPhotos,
    }));

   if (!newlyUploadedImages.find (p => p == fileUrl)){
     setSendableData((prev) => ({
       ...prev,
       main_image: `${formData.photos.find(p => p.image_url == isMainPhoto.file_url).id}`,
     }))
   }else{
    setSendableData((prev) => ({
      ...prev,
      photo_urls: sendableData.photo_urls.map((photo) => ({
        ...photo,
        is_main: photo.file_url == fileUrl,
      }))
    }));
   }
    
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    delete sendableData.photos;
    // If photos are in the wrong format, ensure they're correctly formatted
    // if (submissionData.photos && !submissionData.photo_urls) {
    //   submissionData.photo_urls = submissionData.photos.map(photo => ({
    //     file_url: photo.image_url,
    //     is_main: photo.is_main
    //   }));
    // }

    console.log("Submitting data:", sendableData);
    const cleanData = removeEmptyFields(sendableData);
    console.log("sendable cleaned data: ", cleanData);

    try {
      const response = await fetch(
        `https://backend.myemirateshome.com/api/listings/${listing.id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authToken}`,
          },
          body: JSON.stringify(cleanData),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update listing");
      }

      setSuccess(true);
      alert("Successfully updated");
      onSuccess();
      window.location.href = window.location.pathname + '?reload=' + new Date().getTime();
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
                Offering Type
              </label>
              <select
                name="offering_type"
                value={formData.offering_type || ""}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Select Offering Type</option>
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
                name="rental_period"
                value={formData.rental_period || ""}
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
                {pfLocations.map((location) => (
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
                {bayutLocations.map((location) => (
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
              {amenitiesList.map((amenity) => {
                const isChecked = formData.amenities.some(
                  (am) => am.id === amenity.id
                );
                return (
                  <div key={amenity.id} className="flex items-center">
                    <input
                      type="checkbox"
                      id={`amenity-${amenity.id}`}
                      checked={isChecked}
                      onChange={() => handleAmenitiesChange(amenity)}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label
                      htmlFor={`amenity-${amenity.id}`}
                      className="ml-2 text-sm text-gray-700"
                    >
                      {amenity.amenity_name}
                    </label>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Photos */}
          <div className="space-y-4 col-span-full">
            <h2 className="text-lg font-semibold text-blue-700 border-b border-blue-200 pb-2">
              Photos
            </h2>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
             

              {formData.photo_urls?.map((photo, index) => {
                return (
                  <div
                    key={index}
                    className="relative group border border-gray-200 rounded-lg "
                  >
                    <img
                      src={photo.file_url || photo.image_url}
                      alt={`Property photo`}
                      className="w-full h-40 object-cover"
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-opacity duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
                      <button
                        type="button"
                        onClick={() => handleSetMainPhoto(photo.file_url)}
                        className={`p-2 mr-2 rounded-full ${
                          photo.is_main
                            ? "bg-blue-600 text-white"
                            : "bg-white text-blue-600"
                        }`}
                        title={
                          photo.is_main ? "Main Photo" : "Set as Main Photo"
                        }
                      >
                        <Image size={16} />
                      </button>

                      <button
                        type="button"
                        onClick={() => handlePhotoDelete(photo.file_url)}
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
                );
              })}
            </div>

            <div className="mb-4">
            <div className="flex items-center justify-center w-full">
              <label
                className={`flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 ${
                  uploading ? "opacity-50 cursor-not-allowed" : ""
                }`}
              >
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <Upload className="w-8 h-8 mb-2 text-gray-500" />
                  <p className="mb-2 text-sm text-gray-500">
                    <span className="font-semibold">Click to upload</span> or
                    drag and drop
                  </p>
                  <p className="text-xs text-gray-500">
                    PNG, JPG, GIF up to 10MB
                  </p>
                </div>
                <input
                  type="file"
                  className="hidden"
                  onChange={handleFileSelect}
                  disabled={uploading}
                  accept="image/*"
                />
              </label>
            </div>

            {uploading && (
              <div className="mt-2 flex items-center justify-center">
                <Loader className="animate-spin h-5 w-5 mr-2 text-blue-500" />
                <span className="text-sm text-gray-600">
                  Uploading {currentFile?.name}...
                </span>
              </div>
            )}
          </div>

          </div>
        </div>
      </form>
    </div>
  );
}
