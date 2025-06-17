import React, { useState, useEffect } from "react";

// ShadCN UI Components
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

// Lucide React Icons
import {
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
  Loader2,
  Pencil,
  Building,
  Globe,
  LinkIcon,
  Paperclip,
  Video,
  QrCode,
} from "lucide-react";

// Project Utilities & Enums
import getAuthHeaders from "@/utils/getAuthHeader";
import {
  OfferingTypeEnum,
  PropertyTypeEnum,
} from "../../enums/createListingsEnums";

// Helper component for displaying key-value pairs
const SpecItem = ({ label, value, icon: Icon }) => {
  if (!value && typeof value !== "boolean" && value !== 0) return null;

  let displayValue = value;
  if (typeof value === "boolean") {
    displayValue = value ? "Yes" : "No";
  }
  if (value === 0) {
    displayValue = "Studio";
  }

  return (
    <div className="flex items-start text-sm">
      {Icon && <Icon className="h-4 w-4 mr-2 mt-0.5 text-muted-foreground" />}
      <div className="flex-1">
        <p className="font-medium text-muted-foreground">{label}</p>
        <p className="font-semibold">{String(displayValue)}</p>
      </div>
    </div>
  );
};

// Helper component for section cards with an edit button
const SectionCard = ({ title, stepIndex, goToStep, children, icon: Icon }) => (
  <Card className="relative">
    <Button
      variant="ghost"
      size="icon"
      className="absolute top-2 right-2 h-7 w-7 text-muted-foreground hover:bg-muted"
      onClick={() => goToStep(stepIndex)}
    >
      <Pencil className="h-4 w-4" />
    </Button>
    <CardHeader>
      <CardTitle className="flex items-center text-lg">
        {Icon && <Icon className="mr-2 h-5 w-5" />}
        {title}
      </CardTitle>
    </CardHeader>
    <CardContent>{children}</CardContent>
  </Card>
);

const PreviewForm = ({ formData, prevStep, onSubmit, isLoading, goToStep }) => {
  const [resolvedData, setResolvedData] = useState({});
  const [loading, setLoading] = useState(true);

  const API_BASE_URL = "https://backend.myemirateshome.com/api";
  const headers = getAuthHeaders();

  // The entire resolveIds function remains the same as it correctly fetches the required data.
  useEffect(() => {
    const resolveIds = async () => {
      setLoading(true);
      const resolved = { ...formData };

      try {
        // This logic is preserved from your original code.
        if (formData.developer) {
          const devRes = await fetch(
            `${API_BASE_URL}/developers/${formData.developer}`,
            { headers }
          );
          const devData = await devRes.json();
          resolved.developerName = devData.data?.name || "Unknown Developer";
        }

        if (formData.company) {
          const compRes = await fetch(
            `${API_BASE_URL}/companies/${formData.company}`,
            { headers }
          );
          const compData = await compRes.json();
          resolved.companyName = compData.data?.name || "Unknown Company";
          resolved.companyUsers = compData.data?.users || []; // Store all users for later
        }

        if (
          formData.selectedAmenities &&
          formData.selectedAmenities.length > 0
        ) {
          const amenityPromises = formData.selectedAmenities.map((id) =>
            fetch(`${API_BASE_URL}/amenities/${id}`, { headers }).then((res) =>
              res.json()
            )
          );
          const amenityResults = await Promise.all(amenityPromises);
          resolved.amenityNames = amenityResults.map(
            (a) => a.data?.amenity_name || "Unknown Amenity"
          );
        }

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

    resolveIds();
  }, [formData]);

  // Helper functions (re-used and new ones)
  const formatPrice = (price) => {
    if (!price) return "N/A";
    return new Intl.NumberFormat("en-AE", {
      style: "currency",
      currency: "AED",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  const getStatusBadgeVariant = (status) => {
    const statusMap = {
      live: "success",
      published: "success",
      draft: "secondary",
      unpublished: "destructive",
      archived: "default",
      pocket: "default",
    };
    return statusMap[status?.toLowerCase()] || "default";
  };

  const findUserNameById = (id) =>
    resolvedData.companyUsers?.find((u) => u.id == id)?.name || "N/A";
  const findUserById = (id) =>
    resolvedData.companyUsers?.find((u) => u.id == id);
  const listingAgentDetails = findUserById(formData.listingAgent);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-96">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  const firstImage = formData.photo_urls?.[0];
  const secondImage = formData.photo_urls?.[1];
  const thirdImage = formData.photo_urls?.[2];

  return (
    <div className="space-y-8">
      {/* --- Image Gallery --- */}
      {formData.photo_urls && formData.photo_urls.length > 0 && (
        <div className="relative">
          <div className="absolute top-4 left-4 z-10 flex flex-col space-y-2">
            {formData.availability && (
              <Badge variant="secondary">{formData.availability}</Badge>
            )}
            {formData.publishingStatus && (
              <Badge variant={getStatusBadgeVariant(formData.publishingStatus)}>
                {formData.publishingStatus}
              </Badge>
            )}
          </div>
          <Dialog>
            <DialogTrigger asChild>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 max-h-[500px] cursor-pointer">
                {firstImage && (
                  <div className="h-full">
                    <img
                      src={firstImage}
                      alt="Property main"
                      className="rounded-lg object-cover w-full h-full"
                    />
                  </div>
                )}
                <div className="grid grid-rows-2 gap-2">
                  {secondImage && (
                    <div className="h-full">
                      <img
                        src={secondImage}
                        alt="Property second"
                        className="rounded-lg object-cover w-full h-full"
                      />
                    </div>
                  )}
                  {thirdImage && (
                    <div className="h-full">
                      <img
                        src={thirdImage}
                        alt="Property third"
                        className="rounded-lg object-cover w-full h-full"
                      />
                    </div>
                  )}
                </div>
              </div>
            </DialogTrigger>
            <DialogContent className="max-w-4xl h-[90vh]">
              <Carousel className="w-full h-full flex items-center">
                <CarouselContent>
                  {formData.photo_urls.map((url, index) => (
                    <CarouselItem key={index}>
                      <div className="p-1 h-[80vh] flex items-center justify-center">
                        <img
                          src={url}
                          alt={`Property image ${index + 1}`}
                          className="object-contain w-full h-full"
                        />
                      </div>
                    </CarouselItem>
                  ))}
                </CarouselContent>
                <CarouselPrevious />
                <CarouselNext />
              </Carousel>
            </DialogContent>
          </Dialog>
        </div>
      )}

      {/* --- Price Header --- */}
      <div className="py-24 mt-36">
        <h1 className="text-4xl font-bold">
          {formData.offeringType === "RS" || formData.offeringType === "CS"
            ? formatPrice(formData.price)
            : `${formatPrice(formData.rentAmount)} / ${
                formData.rentFrequency || ""
              }`}
        </h1>
      </div>

      {/* --- Title & Description --- */}
      <SectionCard
        title="Title & Description"
        stepIndex={1}
        goToStep={goToStep}
      >
        <div className="space-y-4">
          <SpecItem
            label="Title Deed Number"
            value={formData.titleDeed}
          />
          <SpecItem label="Title" value={formData.titleEn} />
          {formData.descriptionEn && (
            <div>
              <p className="font-medium text-muted-foreground">Description</p>
              <p className="line-clamp-3 text-sm">{formData.descriptionEn}</p>
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="link" className="px-0">
                    See full description
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[600px]">
                  <DialogHeader>
                    <DialogTitle>Property Details</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4 max-h-[70vh] overflow-y-auto pr-4">
                    <SpecItem
                      label="Title Deed Number"
                      value={formData.titleDeed}
                    />
                    <SpecItem label="Title" value={formData.titleEn} />
                    <div>
                      <p className="font-medium text-muted-foreground">
                        Description
                      </p>
                      <p className="text-sm whitespace-pre-wrap">
                        {formData.descriptionEn}
                      </p>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          )}
        </div>
      </SectionCard>

      {/* --- Specifications & Management --- */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <SectionCard
          title="Specifications"
          stepIndex={2}
          goToStep={goToStep}
          icon={Home}
        >
          <div className="grid grid-cols-2 gap-4">
            <SpecItem
              label="Offering Type"
              value={
                OfferingTypeEnum.find((i) => i.value === formData.offeringType)
                  ?.name
              }
            />
            <SpecItem
              label="Property Type"
              value={
                PropertyTypeEnum.find((i) => i.value === formData.propertyType)
                  ?.name
              }
            />
            <SpecItem label="Size (sq.ft.)" value={formData.size} />
            <SpecItem label="Unit No." value={formData.unitNo} />
            <SpecItem label="Bedrooms" value={formData.bedrooms} />
            <SpecItem label="Bathrooms" value={formData.bathrooms} />
            <SpecItem label="Parking" value={formData.parkingSpaces} />
            <SpecItem label="Furnished" value={formData.isFurnished} />
            <SpecItem label="Plot Size" value={formData.totalPlotSize} />
            <SpecItem label="Lot Size" value={formData.lotSize} />
            <SpecItem label="Built-up Area" value={formData.builtUpArea} />
            <SpecItem label="Layout Type" value={formData.layoutType} />
            <SpecItem label="Ownership" value={formData.ownership} />
            <SpecItem label="Developer" value={resolvedData.developerName} />
          </div>
        </SectionCard>

        <SectionCard
          title="Management"
          stepIndex={3}
          goToStep={goToStep}
          icon={Building}
        >
          <div className="grid grid-cols-2 gap-4">
            <SpecItem label="Reference #" value={formData.referenceNumber} />
            <SpecItem label="Company" value={resolvedData.companyName} />
            <SpecItem
              label="Listing Agent"
              value={findUserNameById(formData.listingAgent)}
            />
            <SpecItem
              label="Property Finder Agent"
              value={findUserNameById(formData.pfAgent)}
            />
            <SpecItem
              label="Bayut Agent"
              value={findUserNameById(formData.bayutAgent)}
            />
            <SpecItem
              label="Website Agent"
              value={findUserNameById(formData.websiteAgent)}
            />
            <SpecItem
              label="Owner"
              value={findUserNameById(formData.listingOwner)}
            />
            <SpecItem label="Landlord Name" value={formData.landlordName} />
            <SpecItem label="Landlord Email" value={formData.landlordEmail} />
            <SpecItem
              label="Landlord Contact"
              value={formData.landlordContact}
            />
            <SpecItem
              label="Available From"
              value={
                formData.availableFrom
                  ? new Date(formData.availableFrom).toLocaleDateString()
                  : "N/A"
              }
            />
          </div>
        </SectionCard>
      </div>

      {/* --- Permit & Pricing --- */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <SectionCard
          title="Permit Details"
          stepIndex={4}
          goToStep={goToStep}
          icon={FileText}
        >
          <div className="grid grid-cols-2 gap-4">
            <SpecItem label="RERA Permit #" value={formData.reraPermitNumber} />
            <SpecItem
              label="RERA Issue Date"
              value={
                formData.reraIssueDate
                  ? new Date(formData.reraIssueDate).toLocaleDateString()
                  : "N/A"
              }
            />
            <SpecItem
              label="RERA Expiration"
              value={
                formData.reraExpirationDate
                  ? new Date(formData.reraExpirationDate).toLocaleDateString()
                  : "N/A"
              }
            />
            <SpecItem label="DTCM Permit #" value={formData.dtcmPermitNumber} />
          </div>
        </SectionCard>

        <SectionCard
          title="Pricing Details"
          stepIndex={5}
          goToStep={goToStep}
          icon={Wallet}
        >
          <div className="grid grid-cols-2 gap-4">
            <SpecItem label="# of Cheques" value={formData.numberOfCheques} />
            <SpecItem label="Service Charges" value={formData.serviceCharges} />
            <SpecItem
              label="Financial Status"
              value={formData.financialStatus}
            />
            {(formData.offeringType === "RS" ||
              formData.offeringType === "CS") && (
              <>
                <SpecItem label="Hide Price" value={formData.hidePrice} />
                <SpecItem
                  label="Payment Method"
                  value={formData.paymentMethod}
                />
                <SpecItem
                  label="Down Payment (%)"
                  value={formData.downPayment}
                />
              </>
            )}
          </div>
        </SectionCard>
      </div>

      {/* --- Arabic Details --- */}
      {(formData.titleAr || formData.descriptionAr) && (
        <SectionCard
          title="Arabic Details (تفاصيل باللغة العربية)"
          stepIndex={6}
          goToStep={goToStep}
        >
          <div className="space-y-4 text-right" dir="rtl">
            <SpecItem label="العنوان" value={formData.titleAr} />
            {formData.descriptionAr && (
              <div>
                <p className="font-medium text-muted-foreground">الوصف</p>
                <p className="line-clamp-3 text-sm">{formData.descriptionAr}</p>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="link" className="px-0">
                      عرض الوصف الكامل
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[600px]" dir="rtl">
                    <DialogHeader>
                      <DialogTitle>تفاصيل باللغة العربية</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 max-h-[70vh] overflow-y-auto pr-4 text-right">
                      <SpecItem label="العنوان" value={formData.titleAr} />
                      <div>
                        <p className="font-medium text-muted-foreground">
                          الوصف
                        </p>
                        <p className="text-sm whitespace-pre-wrap">
                          {formData.descriptionAr}
                        </p>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            )}
          </div>
        </SectionCard>
      )}

      {/* --- Amenities & Media --- */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <SectionCard
          title="Amenities"
          stepIndex={7}
          goToStep={goToStep}
          icon={Check}
        >
          {resolvedData.amenityNames?.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {resolvedData.amenityNames.map((name, index) => (
                <Badge key={index} variant="secondary">
                  {name}
                </Badge>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">
              No amenities listed.
            </p>
          )}
        </SectionCard>

        <SectionCard
          title="Media"
          stepIndex={8}
          goToStep={goToStep}
          icon={Image}
        >
          <div className="grid grid-cols-1 gap-4">
            <SpecItem
              label="Watermark"
              value={formData.watermark === 1 ? "Applied" : "Not Applied"}
            />
            <SpecItem
              label="Video Tour"
              value={
                formData.video_tour_url ? (
                  <a
                    href={formData.video_tour_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500 hover:underline"
                  >
                    View Video
                  </a>
                ) : (
                  "N/A"
                )
              }
              icon={Video}
            />
            <SpecItem
              label="360° View"
              value={
                formData.view_360_url ? (
                  <a
                    href={formData.view_360_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500 hover:underline"
                  >
                    View 360° Tour
                  </a>
                ) : (
                  "N/A"
                )
              }
              icon={Globe}
            />
            <SpecItem
              label="Property Booster QR"
              value={formData.qr_code_property_booster}
              icon={QrCode}
            />
            <SpecItem
              label="Website Image QR"
              value={formData.qr_code_image_websites}
              icon={QrCode}
            />
          </div>
        </SectionCard>
      </div>

      {/* --- Location --- */}
      <SectionCard
        title="Location"
        stepIndex={9}
        goToStep={goToStep}
        icon={MapPin}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Property Finder Location */}
          <div className="space-y-4 border rounded-lg p-4">
            <h4 className="font-semibold">Property Finder Location</h4>
            <SpecItem
              label="City"
              value={
                resolvedData.pfLocationDetails?.city ||
                formData.property_finder_city ||
                "N/A"
              }
            />
            <SpecItem
              label="Community"
              value={
                resolvedData.pfLocationDetails?.community ||
                formData.property_finder_community ||
                "N/A"
              }
            />
            <SpecItem
              label="Sub-Community"
              value={
                resolvedData.pfLocationDetails?.sub_community ||
                formData.property_finder_sub_community ||
                "N/A"
              }
            />
            <SpecItem
              label="Tower/Building"
              value={
                resolvedData.pfLocationDetails?.building ||
                formData.property_finder_tower ||
                "N/A"
              }
            />
            <SpecItem
              label="Coordinates"
              value={
                formData.property_finder_latitude &&
                `${formData.property_finder_latitude}, ${formData.property_finder_longitude}`
              }
            />
          </div>
          {/* Bayut Location */}
          <div className="space-y-4 border rounded-lg p-4">
            <h4 className="font-semibold">Bayut Location</h4>
            <SpecItem
              label="City"
              value={
                resolvedData.bayutLocationDetails?.city ||
                formData.bayut_city ||
                "N/A"
              }
            />
            <SpecItem
              label="Community"
              value={
                resolvedData.bayutLocationDetails?.community ||
                formData.bayut_community ||
                "N/A"
              }
            />
            <SpecItem
              label="Sub-Community"
              value={
                resolvedData.bayutLocationDetails?.sub_community ||
                formData.bayut_sub_community ||
                "N/A"
              }
            />
            <SpecItem
              label="Tower/Building"
              value={
                resolvedData.bayutLocationDetails?.building ||
                formData.bayut_tower ||
                "N/A"
              }
            />
            <SpecItem
              label="Coordinates"
              value={
                formData.bayut_latitude &&
                `${formData.bayut_latitude}, ${formData.bayut_longitude}`
              }
            />
          </div>
        </div>
      </SectionCard>

      {/* --- Google Map Embed --- */}
      {(formData.property_finder_latitude || formData.bayut_latitude) && (
        <div className="w-full h-96 rounded-lg overflow-hidden border">
          <iframe
            width="100%"
            height="100%"
            style={{ border: 0 }}
            loading="lazy"
            allowFullScreen
            src={`https://www.google.com/maps/embed/v1/place?key=YOUR_API_KEY&q=${
              formData.property_finder_latitude || formData.bayut_latitude
            },${
              formData.property_finder_longitude || formData.bayut_longitude
            }`}
          ></iframe>
          <p className="text-xs text-muted-foreground mt-1">
            Note: A Google Maps API Key is required for the map to display
            correctly on a live website.
          </p>
        </div>
      )}

      {/* --- Links & Contact Info --- */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <SectionCard
          title="Links & Documents"
          stepIndex={10}
          goToStep={goToStep}
          icon={LinkIcon}
        >
          <div className="space-y-4">
            <div>
              <h4 className="font-semibold mb-2">Floor Plans</h4>
              {formData.floor_plan_urls?.length > 0 ? (
                formData.floor_plan_urls.map((url, i) => (
                  <a
                    key={i}
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center text-blue-500 hover:underline text-sm"
                  >
                    <Paperclip className="h-3 w-3 mr-1" />
                    Floor Plan {i + 1}
                  </a>
                ))
              ) : (
                <p className="text-sm text-muted-foreground">
                  No floor plans provided.
                </p>
              )}
            </div>
            <div>
              <h4 className="font-semibold mb-2">Additional Documents</h4>
              {formData.documents?.length > 0 ? (
                formData.documents.map((doc, i) => (
                  <a
                    key={i}
                    href={doc.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center text-blue-500 hover:underline text-sm"
                  >
                    <Paperclip className="h-3 w-3 mr-1" />
                    {doc.name}
                  </a>
                ))
              ) : (
                <p className="text-sm text-muted-foreground">
                  No documents provided.
                </p>
              )}
            </div>
          </div>
        </SectionCard>

        {listingAgentDetails && (
          <SectionCard
            title="Contact Info"
            stepIndex={3}
            goToStep={goToStep}
            icon={User}
          >
            <div className="flex items-center space-x-4">
              <Avatar className="h-20 w-20">
                <AvatarImage
                  src={listingAgentDetails.profile_url}
                  alt={listingAgentDetails.name}
                />
                <AvatarFallback>
                  {listingAgentDetails.name?.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <div className="space-y-1">
                <h3 className="font-bold text-lg">
                  {listingAgentDetails.name}
                </h3>
                {listingAgentDetails.rera_number && (
                  <p className="text-sm text-muted-foreground">
                    RERA: {listingAgentDetails.rera_number}
                  </p>
                )}
                <div className="flex space-x-2 pt-2">
                  <Button size="sm" disabled={!listingAgentDetails.phone}>
                    <a
                      href={`tel:${listingAgentDetails.phone}`}
                      className="flex items-center"
                    >
                      <Phone className="h-4 w-4 mr-2" /> Call
                    </a>
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    disabled={!listingAgentDetails.email}
                  >
                    <a
                      href={`mailto:${listingAgentDetails.email}`}
                      className="flex items-center"
                    >
                      <Mail className="h-4 w-4 mr-2" /> Email
                    </a>
                  </Button>
                </div>
              </div>
            </div>
          </SectionCard>
        )}
      </div>

      {/* --- Publishing Info --- */}
      <SectionCard
        title="Publishing Information"
        stepIndex={11}
        goToStep={goToStep}
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div
            className={`border rounded-lg p-4 ${
              formData.publishPF
                ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
                : "bg-muted/50"
            }`}
          >
            <div className="flex items-center mb-2">
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
                ? "Will be published."
                : "Will not be published."}
            </p>
          </div>
          <div
            className={`border rounded-lg p-4 ${
              formData.publishBayutPlatform
                ? "border-orange-500 bg-orange-50 dark:bg-orange-900/20"
                : "bg-muted/50"
            }`}
          >
            <div className="flex items-center mb-2">
              <h3 className="font-semibold">Bayut/Dubizzle</h3>
              <div className="ml-auto">
                {formData.publishBayutPlatform ? (
                  <Check className="h-5 w-5 text-green-500" />
                ) : (
                  <X className="h-5 w-5 text-red-500" />
                )}
              </div>
            </div>
            <p className="text-sm text-muted-foreground">
              {formData.publishBayutPlatform
                ? "Will be published."
                : "Will not be published."}
            </p>
          </div>
          <div
            className={`border rounded-lg p-4 ${
              formData.publishWebsite
                ? "border-purple-500 bg-purple-50 dark:bg-purple-900/20"
                : "bg-muted/50"
            }`}
          >
            <div className="flex items-center mb-2">
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
                ? "Will be published."
                : "Will not be published."}
            </p>
          </div>
        </div>
      </SectionCard>

      {/* --- Notes --- */}
      {formData.notes && (
        <SectionCard
          title="Additional Notes"
          stepIndex={12}
          goToStep={goToStep}
        >
          <p className="text-sm whitespace-pre-line bg-muted/50 rounded-lg p-4">
            {formData.notes}
          </p>
        </SectionCard>
      )}

      {/* --- Action Buttons --- */}
      <div className="flex justify-between pt-4 border-t">
        <Button type="button" variant="outline" onClick={prevStep}>
          Back
        </Button>
        <Button
          type="button"
          onClick={onSubmit}
          className="bg-green-600 hover:bg-green-700"
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Submitting...
            </>
          ) : (
            "Submit Property"
          )}
        </Button>
      </div>
    </div>
  );
};

export default PreviewForm;
