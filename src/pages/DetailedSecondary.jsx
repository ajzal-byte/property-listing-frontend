import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Building, Home, Image, Loader2, Wifi } from "lucide-react";
import getAuthHeaders from "@/utils/getAuthHeader";
import {
  AdditionalNotes,
  ContactCard,
  DetailCard,
  ImageGallery,
  LinksCard,
  LocationCard,
  PropertyHeader,
  PublishingInformationCard,
} from "../components/Preview";

const API_BASE_URL = "https://backend.myemirateshome.com/api";

const DetailedSecondary = () => {
  const { id } = useParams();
  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchListing = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/listings/${id}`, {
          headers: getAuthHeaders(),
        });

        if (!response.ok) {
          throw new Error("Failed to fetch listing");
        }

        const data = await response.json();
        setListing(data.listing);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchListing();
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="h-12 w-12 animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-red-500">Error: {error}</p>
      </div>
    );
  }

  if (!listing) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p>Listing not found</p>
      </div>
    );
  }

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

  // Helper function to format price
  const formatPrice = (price) => {
    if (!price) return "Price not available";
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "AED",
      minimumFractionDigits: 0,
    }).format(price);
  };

  // Extract main photo URLs
  const photos = listing.photos?.map((photo) => photo.image_url) || [];

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Image Gallery */}
      {photos.length > 0 && (
        // In your DetailedSecondary component
        <ImageGallery
          photos={photos}
          watermark={listing.watermark === "1"}
          publishingStatus={listing.status}
          showEdit={false}
          renderStatusBadge={renderStatusBadge}
        />
      )}

      {/* Property Header (Price, Title, Description) */}
      <PropertyHeader
        offeringType={listing.offering_type}
        price={listing.price}
        rentAmount={listing.price} // Adjust based on your data structure
        rentFrequency="year" // Adjust based on your data structure
        titleEn={listing.title_en}
        titleDeed={listing.title_deed}
        descriptionEn={listing.desc_en}
        formatPrice={formatPrice}
        showEdit={false}
      />

      {/* Property Details Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-8">
        {/* Specifications Card */}
        <DetailCard
          title="Specifications"
          icon={Home}
          showEdit={false}
          items={[
            { label: "Reference No", value: listing.reference_no },
            { label: "Property Type", value: listing.property_type },
            { label: "Size", value: `${listing.size} sq.ft` },
            { label: "Unit No", value: listing.unit_no },
            { label: "Bedrooms", value: listing.bedrooms },
            { label: "Bathrooms", value: listing.bathrooms },
            { label: "Parking", value: listing.parking },
            {
              label: "Furnished",
              value: listing.furnished === "1" ? "Yes" : "No",
            },
            { label: "Developer", value: listing.developer?.name },
          ]}
        />

        {/* Management Card */}
        <DetailCard
          title="Management"
          icon={Building}
          showEdit={false}
          items={[
            { label: "Company", value: listing.company?.name },
            { label: "Listing Agent", value: listing.agent?.name },
            { label: "Landlord Name", value: listing.landlord_name },
            { label: "Landlord Contact", value: listing.landlord_contact },
            { label: "Landlord Email", value: listing.landlord_email },
            {
              label: "Available From",
              value:
                listing.available_from &&
                new Date(listing.available_from).toLocaleDateString(),
            },
          ]}
        />
      </div>

      {/* Location Card with Map */}
      <LocationCard
        pfLocationDetails={listing.pf_location}
        bayutLocationDetails={listing.bayut_location}
        showEdit={false}
        formData={{
          latitude: listing.geopoints?.split(",")[0],
          longitude: listing.geopoints?.split(",")[1],
        }}
      />

      {/* Amenities & Media */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-8">
        {/* Amenities Card */}
        <DetailCard
          title="Amenities"
          icon={Wifi}
          showEdit={false}
          badges={listing.amenities?.map((a) => a.amenity_name) || []}
        />

        {/* Media Card */}
        <DetailCard
          title="Media"
          icon={Image}
          showEdit={false}
          items={[
            {
              label: "Video Tour",
              value: listing.video_url,
              useLinkComponent: true,
            },
            {
              label: "360° View",
              value: listing["360_view_url"],
              useLinkComponent: true,
            },
          ]}
        />
      </div>

      {/* Links & Contact Info */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 my-8">
        <LinksCard
          floorPlanUrls={listing.floor_plan}
          documents={listing.documents?.map((url) => ({ url }))}
          showEdit={false}
        />

        {listing.owner && (
          <ContactCard
            profileUrl={listing.owner.profile_url}
            name={listing.owner.name}
            email={listing.owner.email}
            phone={listing.owner.phone}
            showEdit={false}
          />
        )}

        <ContactCard
          profileUrl={listing.agent?.profile_url}
          name={listing.agent?.name}
          reraNumber={listing.agent?.rera_number}
          email={listing.agent?.email}
          phone={listing.agent?.phone}
          showEdit={false}
        />
      </div>

      {/* Publishing Information */}
      <PublishingInformationCard
        formData={{
          publishPF: listing.pf_enable === 1,
          publishBayutPlatform: listing.bayut_enable === 1,
          publishBayut: listing.bayut_enable === 1,
          publishDubizzle: listing.dubizzle_enable === 1,
          publishWebsite: listing.website_enable === 1,
        }}
        showEdit={false}
      />

      {/* Additional Notes */}
      {listing.comments && (
        <AdditionalNotes notes={listing.comments} showEdit={false} />
      )}
    </div>
  );
};

export default DetailedSecondary;
