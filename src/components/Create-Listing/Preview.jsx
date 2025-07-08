import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import getAuthHeaders from "@/utils/getAuthHeader";
import {
  Building,
  FileText,
  Home,
  Image,
  Loader2,
  Wallet,
  Wifi,
} from "lucide-react";
import {
  prepareSpecificationsData,
  prepareManagementData,
  prepareAmenitiesData,
  prepareMediaData,
  preparePermitData,
  preparePricingData,
} from "../../utils/prepareCardData";
import {
  ImageGallery,
  PropertyHeader,
  DetailCard,
  ArabicDetailsCard,
  LocationCard,
  LinksCard,
  ContactCard,
  PublishingInformationCard,
  AdditionalNotes,
} from "../Preview";
import { role } from "../../utils/getUserRole";

const PreviewForm = ({ formData, prevStep, goToStep, onSubmit, isLoading }) => {
  const [resolvedData, setResolvedData] = useState({});
  const [loading, setLoading] = useState(true);

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
      let compRes;
      if (role === "super_admin") {
        if (formData.company) {
          console.log("user is superadmin");
          compRes = await fetch(
            `${API_BASE_URL}/companies/${formData.company}`,
            { headers }
          );
        }
      } else {
        compRes = await fetch(`${API_BASE_URL}/mycompany`, { headers });
      }

      const compData = await compRes.json();

      resolved.companyName = compData?.name || "Unknown Company";

      // Resolve agents and owners
      resolved.listingAgentName =
        compData?.users?.find((u) => u.id == formData.listingAgent)?.name ||
        "Unknown Agent";
      resolved.listingAgentReraNumber =
        compData?.users?.find((u) => u.id == formData.listingAgent)
          ?.rera_number || "Not specified";
      resolved.listingAgentEmail =
        compData?.users?.find((u) => u.id == formData.listingAgent)?.email ||
        "Not specified";
      resolved.listingAgentPhone =
        compData?.users?.find((u) => u.id == formData.listingAgent)?.phone ||
        "Not specified";
      resolved.listingAgentProfileUrl =
        compData?.users?.find((u) => u.id == formData.listingAgent)
          ?.profile_url || "Not specified";
      resolved.pfAgentName = formData.pfAgent
        ? compData?.users?.find((u) => u.id == formData.pfAgent)?.name ||
          "Unknown Agent"
        : undefined;
      resolved.bayutAgentName = formData.bayutAgent
        ? compData?.users?.find((u) => u.id == formData.bayutAgent)?.name ||
          "Unknown Agent"
        : undefined;
      resolved.websiteAgentName = formData.websiteAgent
        ? compData?.users?.find((u) => u.id == formData.websiteAgent)?.name ||
          "Unknown Agent"
        : undefined;
      resolved.listingOwnerName =
        compData?.users?.find((u) => u.id == formData.listingOwner)?.name ||
        "Unknown Owner";
      resolved.listingOwnerEmail =
        compData?.users?.find((u) => u.id == formData.listingOwner)?.email ||
        "Not specified";
      resolved.listingOwnerPhone =
        compData?.users?.find((u) => u.id == formData.listingOwner)?.phone ||
        "Not specified";
      resolved.listingOwnerProfileUrl =
        compData?.users?.find((u) => u.id == formData.listingOwner)
          ?.profile_url || "Not specified";

      if (formData.selectedAmenities && formData.selectedAmenities.length > 0) {
        const amenityPromises = formData.selectedAmenities.map((id) =>
          fetch(`${API_BASE_URL}/amenities/${id}`, { headers }).then((res) =>
            res.json()
          )
        );
        // console.log(`api url: ${API_BASE_URL}/amenities/${id}`);
        const amenityResults = await Promise.all(amenityPromises);
        resolved.amenityNames = amenityResults.map(
          (a) => a?.amenity_name || "Unknown Amenity"
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
      draft: { label: "Draft", color: "bg-gray-500 text-white" },
      live: { label: "Live", color: "bg-green-500 text-white" },
      archived: { label: "Archived", color: "bg-yellow-500 text-white" },
      published: { label: "Published", color: "bg-blue-500 text-white" },
      unpublished: { label: "Unpublished", color: "bg-red-500 text-white" },
      pocket: { label: "Pocket Listing", color: "bg-purple-500 text-white" },
    };

    const info = statusMap[status] || {
      label: "Unknown",
      color: "bg-gray-300 text-black",
    };

    return <Badge className={info.color}>{info.label}</Badge>;
  };

  const photos = formData.photo_urls || [];
  const photoCount = photos.length;

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
      {/* Property Images */}
      {photoCount > 0 && (
        <ImageGallery
          photos={photos}
          goToStep={goToStep}
          watermark={formData.watermark}
          publishingStatus={formData.publishingStatus}
          renderStatusBadge={renderStatusBadge}
        />
      )}
      <PropertyHeader
        category={formData.category}
        price={formData.price}
        rentAmount={formData.rentAmount}
        rentFrequency={formData.rentFrequency}
        titleEn={formData.titleEn}
        title_deed={formData.title_deed}
        descriptionEn={formData.descriptionEn}
        onEdit={() => goToStep(0)}
        formatPrice={formatPrice}
      />

      {/* Property Details */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <DetailCard
          title="Specifications"
          icon={Home}
          items={prepareSpecificationsData(formData, resolvedData)}
          onEdit={goToStep}
          stepNumber={0}
        />

        <DetailCard
          title="Management"
          icon={Building}
          items={prepareManagementData(formData, resolvedData)}
          onEdit={goToStep}
          stepNumber={0}
        />
      </div>

      {/* Permit Details & Pricing */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <DetailCard
          title="Permit Details"
          icon={FileText}
          items={preparePermitData(formData)}
          onEdit={goToStep}
          stepNumber={0}
        />

        <DetailCard
          title="Pricing"
          icon={Wallet}
          items={preparePricingData(formData, formatPrice)}
          onEdit={goToStep}
          stepNumber={0}
        />
      </div>

      {/* Title & Description Arabic */}
      {formData.titleAr || formData.descriptionAr ? (
        <ArabicDetailsCard
          titleAr={formData.titleAr}
          descriptionAr={formData.descriptionAr}
          onEdit={goToStep}
          stepNumber={0}
        />
      ) : null}

      {/* Amenities & Media */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <DetailCard
          title="Amenities"
          icon={Wifi}
          badges={prepareAmenitiesData(resolvedData)}
          onEdit={goToStep}
          stepNumber={0}
        />

        <DetailCard
          title="Media"
          icon={Image}
          items={prepareMediaData(formData)}
          onEdit={goToStep}
          stepNumber={1}
        />
      </div>

      {/* Location & Map */}
      <LocationCard
        pfLocationDetails={resolvedData.pfLocationDetails}
        bayutLocationDetails={resolvedData.bayutLocationDetails}
        formData={formData}
        onEdit={goToStep}
        stepNumber={2}
      />

      {/* Link & Contact Info */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 my-8">
        <LinksCard
          floorPlanUrls={formData.floor_plan_urls}
          documents={formData.documents}
          onEdit={goToStep}
          stepNumber={5}
        />

        <ContactCard
          profileUrl={resolvedData.listingOwnerProfileUrl}
          name={resolvedData.listingOwnerName}
          email={resolvedData.listingOwnerEmail}
          phone={resolvedData.listingOwnerPhone}
          onEdit={goToStep}
          stepNumber={0}
        />

        <ContactCard
          profileUrl={resolvedData.listingAgentProfileUrl}
          name={resolvedData.listingAgentName}
          reraNumber={resolvedData.listingAgentReraNumber}
          email={resolvedData.listingAgentEmail}
          phone={resolvedData.listingAgentPhone}
          onEdit={goToStep}
          stepNumber={0}
        />
      </div>

      {/* Publishing Information Card */}
      <PublishingInformationCard formData={formData} goToStep={goToStep} />

      {/* Notes Card */}
      {formData.notes && (
        <AdditionalNotes
          notes={formData.notes}
          onEdit={goToStep}
          stepNumber={4}
        />
      )}

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
          disabled={isLoading}
        >
          {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {isLoading ? "Submitting..." : "Submit Property"}
        </Button>
      </div>
    </div>
  );
};

export default PreviewForm;
