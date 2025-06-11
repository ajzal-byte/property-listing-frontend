import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Globe,
  MapPin,
  Home,
  Bed,
  Bath,
  Car,
  Ruler,
  Calendar,
  Wallet,
  FileText,
  Image,
  User,
  Phone,
  Mail,
  Check,
  X,
  Loader2
} from "lucide-react";
import getAuthHeaders from "@/utils/getAuthHeader";
import { toast } from "sonner";

const PreviewForm = ({ formData, prevStep, onSubmit }) => {
  const [resolvedData, setResolvedData] = useState({});
  const [loading, setLoading] = useState(true);

  const [isLoading, setIsLoading] = useState(false); // State to manage loading status

  const onClick = async () => {
    setIsLoading(true); // Set loading to true when submission starts

    try {
      // Simulate an API call or async operation
      // Replace this with your actual form submission logic (e.g., API call using fetch or axios)
      await new Promise((resolve) => setTimeout(resolve, 2000)); // Simulate a 2-second delay

      // Show the beautiful success toast
      toast.success("🎉 Listing Created Successfully!", {
        description: "Your property has been added.",
        duration: 3000,
        position: "bottom-right", // Added for completeness, you can adjust
      });

    } catch (error) {
      console.error("Failed to submit property:", error);
      toast.error("Failed to Create Listing", {
        description:
          "There was an error submitting your property. Please try again.",
        position: "bottom-right", // Added for completeness
      });
    } finally {
      setIsLoading(false); // Set loading to false once the operation is complete (success or error)
    }
  };

  // API base URL
  const API_BASE_URL = "https://backend.myemirateshome.com/api";
  const headers = getAuthHeaders();

  // Function to resolve IDs to names
  const resolveIds = async () => {
    const resolved = { ...formData };

    try {
      // Resolve developer
      if (formData.developer) {
        const devRes = await fetch(
          `${API_BASE_URL}/developers/${formData.developer}`,
          { headers }
        );
        const devData = await devRes.json();
        resolved.developerName = devData.data?.name || "Unknown Developer";
      }

      // Resolve company
      if (formData.company) {
        const compRes = await fetch(
          `${API_BASE_URL}/companies/${formData.company}`,
          { headers }
        );
        const compData = await compRes.json();
        resolved.companyName = compData.data?.name || "Unknown Company";

        // Resolve agents and owners
        resolved.listingAgentName =
          compData.data?.users?.find((u) => u.id == formData.listingAgent)
            ?.name || "Unknown Agent";
        resolved.pfAgentName =
          compData.data?.users?.find((u) => u.id == formData.pfAgent)?.name ||
          "Unknown Agent";
        resolved.bayutAgentName =
          compData.data?.users?.find((u) => u.id == formData.bayutAgent)
            ?.name || "Unknown Agent";
        resolved.websiteAgentName =
          compData.data?.users?.find((u) => u.id == formData.websiteAgent)
            ?.name || "Unknown Agent";
        resolved.listingOwnerName =
          compData.data?.users?.find((u) => u.id == formData.listingOwner)
            ?.name || "Unknown Owner";
      }

      // Resolve amenities
      console.log("here");
      console.log("formData.selectedAmenities", formData.selectedAmenities);

      if (formData.selectedAmenities && formData.selectedAmenities.length > 0) {
        const amenityPromises = formData.selectedAmenities.map((id) =>
          fetch(`${API_BASE_URL}/amenities/${id}`, { headers }).then((res) =>
            res.json()
          )
        );
        // console.log(`api url: ${API_BASE_URL}/amenities/${id}`);
        const amenityResults = await Promise.all(amenityPromises);
        resolved.amenityNames = amenityResults.map(
          (a) => a.data?.amenity_name || "Unknown Amenity"
        );
      }

      // Resolve locations
      if (formData.property_finder_location) {
        const locRes = await fetch(
          `${API_BASE_URL}/locations/${formData.property_finder_location}`,
          { headers }
        );
        const locData = await locRes.json();
        resolved.pfLocationDetails = locData.data || {};
      }

      if (formData.bayut_location) {
        const locRes = await fetch(
          `${API_BASE_URL}/locations/${formData.bayut_location}`,
          { headers }
        );
        const locData = await locRes.json();
        resolved.bayutLocationDetails = locData.data || {};
      }
    } catch (error) {
      console.error("Error resolving data:", error);
    } finally {
      setResolvedData(resolved);
      setLoading(false);
    }
  };

  useEffect(() => {
    resolveIds();
  }, []);

  // Helper functions
  const formatPrice = (price) => {
    if (!price) return "Not specified";
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "AED",
      minimumFractionDigits: 0,
    }).format(price);
  };

  const renderStatusBadge = (status) => {
    const statusMap = {
      draft: { label: "Draft", color: "bg-gray-500" },
      live: { label: "Live", color: "bg-green-500" },
      archived: { label: "Archived", color: "bg-yellow-500" },
      published: { label: "Published", color: "bg-blue-500" },
      unpublished: { label: "Unpublished", color: "bg-red-500" },
      pocket: { label: "Pocket Listing", color: "bg-purple-500" },
    };

    const statusInfo = statusMap[status] || {
      label: "Unknown",
      color: "bg-gray-300",
    };
    return (
      <span
        className={`${statusInfo.color} text-white text-xs px-2 py-1 rounded-full`}
      >
        {statusInfo.label}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="border-b pb-4">
        <h2 className="text-2xl font-semibold">Property Preview</h2>
        <p className="text-muted-foreground text-sm">
          Review all details before submitting your property listing
        </p>
      </div>

      {/* Status Banner */}
      <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-200 dark:border-blue-800 flex items-center justify-between">
        <div>
          <h3 className="font-semibold text-blue-800 dark:text-blue-200">
            Property Status: {renderStatusBadge(formData.publishingStatus)}
          </h3>
          <p className="text-blue-600 dark:text-blue-300 text-sm mt-1">
            This property will be submitted with the selected publishing status
          </p>
        </div>
        <Button variant="outline" onClick={prevStep}>
          Edit Status
        </Button>
      </div>

      {/* Property Overview */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center">
            <Home className="mr-2 h-5 w-5" />
            Property Overview
          </CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="space-y-2">
            <h4 className="text-sm font-medium text-muted-foreground">
              Offering Type
            </h4>
            <p className="font-medium">
              {formData.offeringType === "RR"
                ? "Residential Rent"
                : formData.offeringType === "RS"
                ? "Residential Sale"
                : formData.offeringType === "CS"
                ? "Commercial Sale"
                : formData.offeringType === "CR"
                ? "Commercial Rent"
                : "Unknown"}
            </p>
          </div>

          <div className="space-y-2">
            <h4 className="text-sm font-medium text-muted-foreground">
              Property Type
            </h4>
            <p className="font-medium">
              {formData.propertyType === "AP" ? "Apartment" : "Villa"}
            </p>
          </div>

          <div className="space-y-2">
            <h4 className="text-sm font-medium text-muted-foreground">Size</h4>
            <p className="font-medium">{formData.size} sq.ft.</p>
          </div>

          <div className="space-y-2">
            <h4 className="text-sm font-medium text-muted-foreground">
              Unit No.
            </h4>
            <p className="font-medium">{formData.unitNo || "Not specified"}</p>
          </div>

          <div className="space-y-2 flex items-center">
            <Bed className="mr-2 h-4 w-4 text-muted-foreground" />
            <div>
              <h4 className="text-sm font-medium text-muted-foreground">
                Bedrooms
              </h4>
              <p className="font-medium">{formData.bedrooms}</p>
            </div>
          </div>

          <div className="space-y-2 flex items-center">
            <Bath className="mr-2 h-4 w-4 text-muted-foreground" />
            <div>
              <h4 className="text-sm font-medium text-muted-foreground">
                Bathrooms
              </h4>
              <p className="font-medium">{formData.bathrooms}</p>
            </div>
          </div>

          <div className="space-y-2 flex items-center">
            <Car className="mr-2 h-4 w-4 text-muted-foreground" />
            <div>
              <h4 className="text-sm font-medium text-muted-foreground">
                Parking Spaces
              </h4>
              <p className="font-medium">{formData.parkingSpaces}</p>
            </div>
          </div>

          <div className="space-y-2 flex items-center">
            <Ruler className="mr-2 h-4 w-4 text-muted-foreground" />
            <div>
              <h4 className="text-sm font-medium text-muted-foreground">
                Furnished
              </h4>
              <p className="font-medium">
                {formData.isFurnished ? "Yes" : "No"}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Pricing Information */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center">
            <Wallet className="mr-2 h-5 w-5" />
            Pricing Information
          </CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {formData.offeringType === "RR" ? (
            <>
              <div className="space-y-2">
                <h4 className="text-sm font-medium text-muted-foreground">
                  Rent Amount
                </h4>
                <p className="font-medium text-xl">
                  {formatPrice(formData.rentAmount)}
                </p>
                <p className="text-sm text-muted-foreground">
                  Per {formData.rentFrequency}
                </p>
              </div>

              <div className="space-y-2">
                <h4 className="text-sm font-medium text-muted-foreground">
                  Available From
                </h4>
                <p className="font-medium">
                  {formData.availableFrom
                    ? new Date(formData.availableFrom).toLocaleDateString()
                    : "Not specified"}
                </p>
              </div>
            </>
          ) : (
            <>
              <div className="space-y-2">
                <h4 className="text-sm font-medium text-muted-foreground">
                  Price
                </h4>
                <p className="font-medium text-xl">
                  {formData.hidePrice
                    ? "Price on Request"
                    : formatPrice(formData.price)}
                </p>
              </div>

              <div className="space-y-2">
                <h4 className="text-sm font-medium text-muted-foreground">
                  Payment Method
                </h4>
                <p className="font-medium">
                  {formData.paymentMethod || "Not specified"}
                </p>
              </div>
            </>
          )}

          <div className="space-y-2">
            <h4 className="text-sm font-medium text-muted-foreground">
              Service Charges
            </h4>
            <p className="font-medium">
              {formData.serviceCharges
                ? `${formData.serviceCharges} AED/year`
                : "Not specified"}
            </p>
          </div>

          <div className="space-y-2">
            <h4 className="text-sm font-medium text-muted-foreground">
              Financial Status
            </h4>
            <p className="font-medium">
              {formData.financialStatus || "Not specified"}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Property Images */}
      {formData.photo_urls?.length > 0 && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center">
              <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-2 mr-3">
                <div className="bg-blue-600 w-8 h-8 rounded flex items-center justify-center">
                  <span className="text-white font-bold text-xs">PF</span>
                </div>
              </div>
              Property Images
              <span className="ml-2 bg-muted text-muted-foreground text-xs px-2 py-1 rounded-full">
                {formData.photo_urls.length}
              </span>
              {formData.watermark === 1 && (
                <span className="ml-2 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 text-xs px-2 py-1 rounded-full">
                  Watermark Applied
                </span>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {formData.photo_urls.map((url, index) => (
                <div
                  key={index}
                  className="aspect-square overflow-hidden rounded-lg border"
                >
                  <img
                    src={url}
                    alt={`Property image ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Media & QR Codes */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {(formData.video_tour_url || formData.view_360_url) && (
          <Card>
            <CardHeader className="pb-3">
              <CardTitle>Virtual Tours</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {formData.video_tour_url && (
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground mb-1">
                    Video Tour
                  </h4>
                  <a
                    href={formData.video_tour_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline truncate block"
                  >
                    {formData.video_tour_url}
                  </a>
                </div>
              )}

              {formData.view_360_url && (
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground mb-1">
                    360° View
                  </h4>
                  <a
                    href={formData.view_360_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline truncate block"
                  >
                    {formData.view_360_url}
                  </a>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {(formData.qr_code_property_booster ||
          formData.qr_code_image_websites) && (
          <Card>
            <CardHeader className="pb-3">
              <CardTitle>QR Codes</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {formData.qr_code_property_booster && (
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground mb-1">
                    Property Booster
                  </h4>
                  <p className="font-medium">
                    {formData.qr_code_property_booster}
                  </p>
                </div>
              )}

              {formData.qr_code_image_websites && (
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground mb-1">
                    Website Image
                  </h4>
                  <p className="font-medium">
                    {formData.qr_code_image_websites}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </div>

      {/* Location Information */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center">
            <MapPin className="mr-2 h-5 w-5" />
            Location Information
          </CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Property Finder Location */}
          <div className="border rounded-lg p-4">
            <div className="flex items-center mb-3">
              <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-2 mr-3">
                <div className="bg-blue-600 w-8 h-8 rounded flex items-center justify-center">
                  <span className="text-white font-bold text-xs">PF</span>
                </div>
              </div>
              <h3 className="font-semibold">Property Finder Location</h3>
            </div>

            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground">
                    City
                  </h4>
                  <p className="font-medium">
                    {resolvedData.pfLocationDetails?.city ||
                      formData.property_finder_city ||
                      "Not specified"}
                  </p>
                </div>

                <div>
                  <h4 className="text-sm font-medium text-muted-foreground">
                    Community
                  </h4>
                  <p className="font-medium">
                    {resolvedData.pfLocationDetails?.community ||
                      formData.property_finder_community ||
                      "Not specified"}
                  </p>
                </div>
              </div>

              <div>
                <h4 className="text-sm font-medium text-muted-foreground">
                  Sub Community
                </h4>
                <p className="font-medium">
                  {resolvedData.pfLocationDetails?.sub_community ||
                    formData.property_finder_sub_community ||
                    "Not specified"}
                </p>
              </div>

              <div>
                <h4 className="text-sm font-medium text-muted-foreground">
                  Tower/Building
                </h4>
                <p className="font-medium">
                  {resolvedData.pfLocationDetails?.building ||
                    formData.property_finder_tower ||
                    "Not specified"}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground">
                    Latitude
                  </h4>
                  <p className="font-medium">
                    {formData.property_finder_latitude || "Not specified"}
                  </p>
                </div>

                <div>
                  <h4 className="text-sm font-medium text-muted-foreground">
                    Longitude
                  </h4>
                  <p className="font-medium">
                    {formData.property_finder_longitude || "Not specified"}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Bayut Location */}
          <div className="border rounded-lg p-4">
            <div className="flex items-center mb-3">
              <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-2 mr-3">
                <div className="bg-orange-500 w-8 h-8 rounded flex items-center justify-center">
                  <span className="text-white font-bold text-xs">B</span>
                </div>
              </div>
              <h3 className="font-semibold">Bayut Location</h3>
            </div>

            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground">
                    City
                  </h4>
                  <p className="font-medium">
                    {resolvedData.bayutLocationDetails?.city ||
                      formData.bayut_city ||
                      "Not specified"}
                  </p>
                </div>

                <div>
                  <h4 className="text-sm font-medium text-muted-foreground">
                    Community
                  </h4>
                  <p className="font-medium">
                    {resolvedData.bayutLocationDetails?.community ||
                      formData.bayut_community ||
                      "Not specified"}
                  </p>
                </div>
              </div>

              <div>
                <h4 className="text-sm font-medium text-muted-foreground">
                  Sub Community
                </h4>
                <p className="font-medium">
                  {resolvedData.bayutLocationDetails?.sub_community ||
                    formData.bayut_sub_community ||
                    "Not specified"}
                </p>
              </div>

              <div>
                <h4 className="text-sm font-medium text-muted-foreground">
                  Tower/Building
                </h4>
                <p className="font-medium">
                  {resolvedData.bayutLocationDetails?.building ||
                    formData.bayut_tower ||
                    "Not specified"}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground">
                    Latitude
                  </h4>
                  <p className="font-medium">
                    {formData.bayut_latitude || "Not specified"}
                  </p>
                </div>

                <div>
                  <h4 className="text-sm font-medium text-muted-foreground">
                    Longitude
                  </h4>
                  <p className="font-medium">
                    {formData.bayut_longitude || "Not specified"}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Publishing Information */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle>Publishing Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Property Finder */}
            <div
              className={`border rounded-lg p-4 ${
                formData.publishPF
                  ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
                  : "bg-muted/50"
              }`}
            >
              <div className="flex items-center mb-3">
                <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-2 mr-3">
                  <div className="bg-blue-600 w-8 h-8 rounded flex items-center justify-center">
                    <span className="text-white font-bold text-xs">PF</span>
                  </div>
                </div>
                <h3 className="font-semibold">Property Finder</h3>
                <div className="ml-auto">
                  {formData.publishPF ? (
                    <Check className="h-5 w-5 text-green-500" />
                  ) : (
                    <X className="h-5 w-5 text-red-500" />
                  )}
                </div>
              </div>
              <p className="text-sm text-muted-foreground">
                {formData.publishPF
                  ? "This property will be published on Property Finder"
                  : "Not publishing on Property Finder"}
              </p>
            </div>

            {/* Bayut */}
            <div
              className={`border rounded-lg p-4 ${
                formData.publishBayutPlatform
                  ? "border-orange-500 bg-orange-50 dark:bg-orange-900/20"
                  : "bg-muted/50"
              }`}
            >
              <div className="flex items-center mb-3">
                <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-2 mr-3">
                  <div className="bg-orange-500 w-8 h-8 rounded flex items-center justify-center">
                    <span className="text-white font-bold text-xs">B</span>
                  </div>
                </div>
                <h3 className="font-semibold">Bayut</h3>
                <div className="ml-auto">
                  {formData.publishBayutPlatform ? (
                    <Check className="h-5 w-5 text-green-500" />
                  ) : (
                    <X className="h-5 w-5 text-red-500" />
                  )}
                </div>
              </div>

              {formData.publishBayutPlatform && (
                <div className="mt-3 space-y-2">
                  <div className="flex items-center">
                    <Checkbox
                      id="bayut-platform"
                      checked={formData.publishBayut}
                      disabled
                      className="mr-2"
                    />
                    <label htmlFor="bayut-platform" className="text-sm">
                      Bayut
                    </label>
                  </div>

                  <div className="flex items-center">
                    <Checkbox
                      id="dubizzle"
                      checked={formData.publishDubizzle}
                      disabled
                      className="mr-2"
                    />
                    <label htmlFor="dubizzle" className="text-sm">
                      Dubizzle
                    </label>
                  </div>
                </div>
              )}
            </div>

            {/* Website */}
            <div
              className={`border rounded-lg p-4 ${
                formData.publishWebsite
                  ? "border-purple-500 bg-purple-50 dark:bg-purple-900/20"
                  : "bg-muted/50"
              }`}
            >
              <div className="flex items-center mb-3">
                <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-2 mr-3">
                  <div className="bg-purple-600 w-8 h-8 rounded flex items-center justify-center">
                    <Globe className="text-white w-4 h-4" />
                  </div>
                </div>
                <h3 className="font-semibold">Website</h3>
                <div className="ml-auto">
                  {formData.publishWebsite ? (
                    <Check className="h-5 w-5 text-green-500" />
                  ) : (
                    <X className="h-5 w-5 text-red-500" />
                  )}
                </div>
              </div>
              <p className="text-sm text-muted-foreground">
                {formData.publishWebsite
                  ? "This property will be published on your website"
                  : "Not publishing on website"}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Notes & Documents */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Notes */}
        {formData.notes && (
          <Card>
            <CardHeader className="pb-3">
              <CardTitle>Additional Notes</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="bg-muted/50 rounded-lg p-4">
                <p className="whitespace-pre-line">{formData.notes}</p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Documents */}
        {formData.documents?.length > 0 && (
          <Card>
            <CardHeader className="pb-3">
              <CardTitle>Documents</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {formData.documents.map((doc, index) => (
                  <div
                    key={index}
                    className="border rounded-lg p-3 flex items-center"
                  >
                    <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-2 mr-3">
                      {doc.type === "pdf" ? (
                        <FileText className="w-5 h-5 text-red-500" />
                      ) : (
                        <Image className="w-5 h-5 text-blue-500" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-medium truncate">{doc.name}</div>
                      <div className="text-sm text-muted-foreground">
                        {doc.type === "pdf" ? "PDF Document" : "Image File"} •
                        {Math.round(doc.size / 1024)} KB
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Action Buttons */}
      <div className="flex justify-between pt-4 border-t">
        <Button
          type="button"
          variant="outline"
          onClick={prevStep}
          className="w-full sm:w-auto"
        >
          Back
        </Button>
        <Button
          type="button"
          onClick={onSubmit}
          className="w-full sm:w-auto bg-green-600 hover:bg-green-700"
          disabled={isLoading} // Disable the button while loading
        >
          {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}{" "}
          {/* Show loader if loading */}
          {isLoading ? "Submitting..." : "Submit Property"}{" "}
          {/* Change button text */}
        </Button>
      </div>
    </div>
  );
};

export default PreviewForm;
