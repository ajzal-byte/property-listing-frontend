import { useState, useEffect } from "react";
import { Upload, Check, Loader, X, Home, Calendar, Info } from "lucide-react";
import MainTabContext from "../contexts/TabContext";
import { useContext } from "react";
import { tabs } from "../enums/sidebarTabsEnums";
import { PropertyTypeEnum, OfferingTypeEnum, StatusEnum, TimePeriodEnum  } from "../enums/createListingsEnums";


export default function ListingForm() {
  const { mainTab, setMainTab } = useContext(MainTabContext);

  const [isLocationDubai, setIsLocationDubai] = useState(false);
  const [isListingRental, setIsListingRental] = useState(false)

  // State for form data
  const [formData, setFormData] = useState({
    title_deed: "",
    title: "",
    title_en: "",
    title_ar: "",
    desc_en: "",
    desc_ar: "",
    reference_no: "",
    property_type: "",
    offering_type: "Sale",
    dtcm_permit_number: "",
    rental_period: "",
    size: "",
    bedrooms: "",
    bathrooms: "",
    furnished: "0",
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
    status: "1",
    amenities: [],
    photo_urls: [],
  });

  // State for dropdown options
  const [locations, setLocations] = useState([]);
  const [developers, setDevelopers] = useState([]);
  const [amenities, setAmenities] = useState([]);
  const [agents, setAgents] = useState([]);
  const [companies, setCompanies] = useState([]);

  // State for form submission
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitResult, setSubmitResult] = useState(null);

  // State for image upload
  const [uploading, setUploading] = useState(false);
  const [currentFile, setCurrentFile] = useState(null);

  // Financial status options (mocked)
  const financialStatuses = [
    { id: 1, name: "Mortgage Available" },
    { id: 2, name: "Cash Only" },
    { id: 3, name: "Bank Transfer" },
    { id: 4, name: "Payment Plan Available" },
  ];
  const getAuthHeaders = () => {
    return {
      Authorization: `Bearer ${localStorage.getItem("authToken")}`,
      "Content-Type": "application/json",
    };
  };
  // Fetch all dropdown data on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch locations
        const locResponse = await fetch("http://3.111.31.34/api/locations", {
          headers: getAuthHeaders(),
        });
        const locData = await locResponse.json();
        setLocations(locData);

        // Fetch developers
        const devResponse = await fetch("http://3.111.31.34/api/developers", {
          headers: getAuthHeaders(),
        });
        const devData = await devResponse.json();
        setDevelopers(devData);

        // Fetch amenities
        const amenResponse = await fetch("http://3.111.31.34/api/amenities", {
          headers: getAuthHeaders(),
        });
        const amenData = await amenResponse.json();
        setAmenities(amenData);

        // Fetch company and agent info
        const infoResponse = await fetch(
          "http://3.111.31.34/api/listing/create-info",
          {
            headers: getAuthHeaders(),
          }
        );

        const infoData = await infoResponse.json();
        console.log(infoData);

        // Extract companies and agents from infoData (assuming structure)
        // This may need adjustment based on actual API response structure
        setCompanies(infoData.companies); // Replace with actual data
        console.log(
          "agents are:",
          infoData.companies.flatMap((company) => company.agents || [])
        );

        formData.company_id &&
          setAgents(
            infoData.companies.filter(
              (company) => company.id == formData.company_id
            )[0].agents || []
          );
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    console.log(formData.pf_location);
    console.log(locations);

    if (
      locations &&
      (locations
        .find((loc) => loc.id == formData.pf_location)
        ?.location?.toLowerCase()
        .includes("dubai") ||
        locations
          .find((loc) => loc.id == formData.bayut_location)
          ?.location?.toLowerCase()
          .includes("dubai"))
    ) {
      setIsLocationDubai(true);
      console.log(isLocationDubai);
    } else {
      setIsLocationDubai(false);
    }

    if (["RR", "CR"].includes(formData.offering_type)) {
      setIsListingRental(true)
    } else {
      setIsListingRental(false)
    }


    setMainTab(tabs.HIDDEN);
    fetchData();
  }, [
    setMainTab,
    formData.company_id,
    formData.pf_location,
    formData.bayut_location,
    isLocationDubai,
    isListingRental,
    formData.offering_type
  ]);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // Handle checkbox/multi-select changes for amenities
  const handleAmenityChange = (amenityId) => {
    const updatedAmenities = formData.amenities.includes(amenityId)
      ? formData.amenities.filter((id) => id !== amenityId)
      : [...formData.amenities, amenityId];

    setFormData({
      ...formData,
      amenities: updatedAmenities,
    });
  };

  // Handle file selection
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
        `http://3.111.31.34/api/s3/presigned-url?fileName=${fileName}&fileType=${fileType}`,
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

      setFormData({
        ...formData,
        photo_urls: [...formData.photo_urls, newPhotoUrl],
      });

      setCurrentFile(null);
      setUploading(false);
    } catch (error) {
      console.error("Error uploading file:", error);
      setUploading(false);
    }
  };

  // Set image as main
  const setMainImage = (index) => {
    const updatedPhotos = formData.photo_urls.map((photo, i) => ({
      ...photo,
      is_main: i === index,
    }));

    setFormData({
      ...formData,
      photo_urls: updatedPhotos,
    });
  };

  // Remove image
  const removeImage = (index) => {
    let updatedPhotos = [...formData.photo_urls];
    updatedPhotos.splice(index, 1);

    // If we removed the main image and there are other images, set the first one as main
    if (
      updatedPhotos.length > 0 &&
      !updatedPhotos.some((photo) => photo.is_main)
    ) {
      updatedPhotos[0].is_main = true;
    }

    setFormData({
      ...formData,
      photo_urls: updatedPhotos,
    });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate form data
    if (
      !formData.title_deed ||
      !formData.pf_location ||
      !formData.bayut_location ||
      !formData.developer_id ||
      formData.photo_urls.length === 0
    ) {
      alert("Please fill all required fields and upload at least one image");
      return;
    }

    try {
      setIsSubmitting(true);

      // Log form data before submission
      console.log("Form data to be submitted:", JSON.stringify(formData));

      // Submit form data
      const response = await fetch("http://3.111.31.34/api/listings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      setSubmitResult({
        success: response.ok,
        message: response.ok
          ? "Listing created successfully!"
          : "Failed to create listing",
      });

      if (response.ok) {
        // Reset form on success
        setFormData({
          title: "",
          title_deed: "",
          reference_no: "",
          property_type: "",
          dtcm_permit_number: "",
          offering_type: "Sale",
          size: "",
          bedrooms: "",
          bathrooms: "",
          furnished: "0",
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
          status: "1",
          amenities: [],
          photo_urls: [],
        });
        setIsLocationDubai(false);
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      setSubmitResult({
        success: false,
        message: "Error submitting form: " + error.message,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full max-w-6xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
        <Home className="mr-2" /> Create New Property Listing
      </h1>

      {submitResult && (
        <div
          className={`mb-6 p-4 rounded-md ${
            submitResult.success
              ? "bg-green-100 text-green-700"
              : "bg-red-100 text-red-700"
          }`}
        >
          {submitResult.message}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Information */}
        <div className="bg-gray-50 p-4 rounded-md">
          <h2 className="text-lg font-semibold text-gray-700 mb-4">
            Basic Information
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Title *
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Title Deed *
              </label>
              <input
                type="text"
                name="title_deed"
                value={formData.title_deed}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Reference Number
              </label>
              <input
                type="text"
                name="reference_no"
                value={formData.reference_no}
                onChange={handleChange}
                placeholder="REF-2025-001"
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Title Arabic *
              </label>
              <input
                type="text"
                name="title_ar"
                value={formData.title_ar}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Title English *
              </label>
              <input
                type="text"
                name="title_en"
                value={formData.title_en}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description (Arabic) *
              </label>
              <textarea
                type="text"
                name="desc_ar"
                value={formData.desc_ar}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description English*
              </label>
              <textarea
                type="text"
                name="desc_en"
                value={formData.desc_en}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Property Type *
              </label>
              <select
                name="property_type"
                value={formData.property_type}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                required
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
              {/* <select
                name="offering_type"
                value={formData.offering_type}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="Sale">Sale</option>
                <option value="Rent">Rent</option>
                <option value="Off-Plan">Off-Plan</option>
              </select> */}
              <select
                name="offering_type"
                value={formData.offering_type}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                required
              >
                <option value="">Select Offering Type</option>
                {OfferingTypeEnum.map((type) => (
                  <option key={type.value} value={type.value}>
                    {type.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Property Details */}
        <div className="bg-gray-50 p-4 rounded-md">
          <h2 className="text-lg font-semibold text-gray-700 mb-4">
            Property Details
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Size (sq.ft)
              </label>
              <input
                type="number"
                name="size"
                value={formData.size}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Bedrooms
              </label>
              <input
                type="number"
                name="bedrooms"
                value={formData.bedrooms}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Bathrooms
              </label>
              <input
                type="number"
                name="bathrooms"
                value={formData.bathrooms}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Furnished
              </label>
              <select
                name="furnished"
                value={formData.furnished}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="0">No</option>
                <option value="1">Yes</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                PropertyFinder Location *
              </label>
              <select
                name="pf_location"
                value={formData.pf_location}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                required
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
                Bayut Location *
              </label>
              <select
                name="bayut_location"
                value={formData.bayut_location}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                required
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
                Developer *
              </label>
              <select
                name="developer_id"
                value={formData.developer_id}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                required
              >
                <option value="">Select Developer</option>
                {developers.map((dev) => (
                  <option key={dev.id} value={dev.id}>
                    {dev.name} ({dev.email})
                  </option>
                ))}
              </select>
            </div>

{ isListingRental &&
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Rental Period *
              </label>
              <select
                name="rental_period"
                value={formData.rental_period}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                required = {isListingRental}
              >
              <option value="">Select Period</option>
                {TimePeriodEnum.map((type) => (
                  <option key={type.value} value={type.value}>
                    {type.name}
                  </option>
                ))}
              </select>
            </div>

}

          </div>
        </div>

        {/* Organization Details */}
        <div className="bg-gray-50 p-4 rounded-md">
          <h2 className="text-lg font-semibold text-gray-700 mb-4">
            Organization Details
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Company
              </label>
              <select
                name="company_id"
                value={formData.company_id}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Select Company</option>
                {companies.map((company) => (
                  <option key={company.id} value={company.id}>
                    {company.name}
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
                value={formData.agent_id}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                disabled={formData.company_id == ""}
              >
                <option value="">
                  {formData.company_id
                    ? "Select Agent"
                    : "Select Company First"}
                </option>
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
                value={formData.financial_status_id}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Select Financial Status</option>
                {financialStatuses.map((status) => (
                  <option key={status.id} value={status.id}>
                    {status.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Status
              </label>
              
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                required
              >
                <option value="">Select Status</option>
                {StatusEnum.map((type) => (
                  <option key={type.value} value={type.value}>
                    {type.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Permit Numbers */}
        <div className="bg-gray-50 p-4 rounded-md">
          <h2 className="text-lg font-semibold text-gray-700 mb-4 flex items-center">
            Permit Numbers
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                RERA Permit No. {isLocationDubai && "(MANDATORY FOR DUBAI)"} *
              </label>
              <input
                type="text"
                name="rera_permit_number"
                value={formData.rera_permit_number}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                required={isLocationDubai}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                DTCM No.*
              </label>
              <input
                type="text"
                name="dtcm_permit_number"
                value={formData.dtcm_permit_number}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>
          </div>
        </div>

        {/* Dates */}
        <div className="bg-gray-50 p-4 rounded-md">
          <h2 className="text-lg font-semibold text-gray-700 mb-4 flex items-center">
            <Calendar className="mr-2 h-5 w-5" /> Important Dates
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                RERA Permit Issue Date
              </label>
              <input
                type="date"
                name="rera_issue_date"
                value={formData.rera_issue_date}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                RERA Expiration Date
              </label>
              <input
                type="date"
                name="rera_expiration_date"
                value={formData.rera_expiration_date}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Contract Expiry Date
              </label>
              <input
                type="date"
                name="contract_expiry_date"
                value={formData.contract_expiry_date}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Available From
              </label>
              <input
                type="date"
                name="available_from"
                value={formData.available_from}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
        </div>

        {/* Amenities */}
        <div className="bg-gray-50 p-4 rounded-md">
          <h2 className="text-lg font-semibold text-gray-700 mb-4">
            Amenities
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {amenities.map((amenity) => (
              <div key={amenity.id} className="flex items-center">
                <input
                  type="checkbox"
                  id={`amenity-${amenity.id}`}
                  checked={formData.amenities.includes(amenity.id)}
                  onChange={() => handleAmenityChange(amenity.id)}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label
                  htmlFor={`amenity-${amenity.id}`}
                  className="ml-2 block text-sm text-gray-700"
                >
                  {amenity.amenity_name}
                </label>
              </div>
            ))}
          </div>
        </div>

        {/* Image Upload */}
        <div className="bg-gray-50 p-4 rounded-md">
          <h2 className="text-lg font-semibold text-gray-700 mb-4 flex items-center">
            <Upload className="mr-2 h-5 w-5" /> Property Images *
          </h2>

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

          {formData.photo_urls.length > 0 && (
            <div>
              <h3 className="text-sm font-medium text-gray-700 mb-2">
                Uploaded Images
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {formData.photo_urls.map((photo, index) => (
                  <div
                    key={index}
                    className="relative border rounded-md overflow-hidden"
                  >
                    <img
                      src={photo.file_url}
                      alt={`Property image ${index + 1}`}
                      className="w-full h-32 object-cover"
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 hover:opacity-100 transition-opacity flex flex-col justify-between p-2">
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                      >
                        <X className="h-4 w-4" />
                      </button>

                      <div className="mt-auto flex items-center">
                        <label className="flex items-center space-x-1 text-white cursor-pointer">
                          <input
                            type="radio"
                            name="main_image"
                            checked={photo.is_main}
                            onChange={() => setMainImage(index)}
                            className="h-3 w-3"
                          />
                          <span className="text-xs">Main image</span>
                        </label>
                        {photo.is_main && (
                          <span className="ml-1 bg-green-500 text-white text-xs px-1 py-0.5 rounded">
                            <Check className="h-3 w-3 inline" />
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {formData.photo_urls.length === 0 && (
            <div className="flex items-center text-amber-600 text-sm mt-2">
              <Info className="h-4 w-4 mr-1" />
              At least one image is required. The first image will be set as the
              main image by default.
            </div>
          )}
        </div>

        {/* Submit Button */}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={isSubmitting || formData.photo_urls.length === 0}
            className={`px-6 py-2 bg-blue-600 text-white font-medium rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 flex items-center ${
              isSubmitting || formData.photo_urls.length === 0
                ? "opacity-50 cursor-not-allowed"
                : ""
            }`}
          >
            {isSubmitting ? (
              <>
                <Loader className="animate-spin h-5 w-5 mr-2" />
                Submitting...
              </>
            ) : (
              "Create Listing"
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
