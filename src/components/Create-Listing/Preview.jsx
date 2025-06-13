import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import getAuthHeaders from "@/utils/getAuthHeader";
import {
  OfferingTypeEnum,
  PropertyTypeEnum,
} from "../../enums/createListingsEnums";
import {
  Check,
  Edit,
  Globe,
  Loader2,
  Mail,
  Phone,
  User,
  X,
} from "lucide-react";

const PreviewForm = ({ formData, prevStep, goToStep, onSubmit, isLoading }) => {
  const [resolvedData, setResolvedData] = useState({});
  const [loading, setLoading] = useState(true);
  const [carouselOpen, setCarouselOpen] = useState(false);

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
  };

  // Reusable DetailItem component
  const DetailItem = ({ label, value, icon, isLink }) => {
    if (!value) return null;

    return (
      <div className="flex items-start gap-2">
        {icon && <span className="mt-0.5">{icon}</span>}
        <div>
          <h4 className="text-sm font-medium text-muted-foreground">{label}</h4>
          {isLink ? (
            <a
              href={value}
              target="_blank"
              className="font-medium text-blue-600 hover:underline"
            >
              {value}
            </a>
          ) : (
            <p className="font-medium">{value}</p>
          )}
        </div>
      </div>
    );
  };

  // Specialized component for links
  const DetailItemWithLink = ({ label, value }) => {
    if (!value) return null;

    return (
      <div>
        <h4 className="text-sm font-medium text-muted-foreground mb-1">
          {label}
        </h4>
        <a
          href={value}
          target="_blank"
          className="text-blue-600 hover:underline truncate block"
        >
          {value}
        </a>
      </div>
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
      {/* Property Images */}
      {formData.photo_urls?.length > 0 && (
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>Property Images</CardTitle>
              <Button variant="ghost" size="icon" onClick={() => goToStep(1)}>
                <Edit className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex items-center gap-2 mt-2">
              {formData.watermark == 1 && (
                <Badge variant="success">Watermark Applied</Badge>
              )}
              <Badge>{formData.photo_urls.length} images</Badge>
              {formData?.availability && (
                <Badge variant="secondary">{formData?.availability}</Badge>
              )}
              <Badge>{formData?.publishingStatus}</Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="relative md:col-span-2 h-44">
                <img
                  src={formData.photo_urls[0]}
                  className="w-full h-full object-contain rounded-lg cursor-pointer"
                  onClick={() => setCarouselOpen(true)}
                />
              </div>
              <div className="grid grid-cols-1 gap-4">
                {formData.photo_urls.slice(1, 3).map((url, idx) => (
                  <img
                    key={idx}
                    src={url}
                    className="w-full h-32 object-contain rounded-lg cursor-pointer"
                    onClick={() => setCarouselOpen(true)}
                  />
                ))}
              </div>
            </div>

            {formData.photo_urls.length > 3 && (
              <Button
                variant="outline"
                className="mt-4"
                onClick={() => setCarouselOpen(true)}
              >
                View All {formData.photo_urls.length} Photos
              </Button>
            )}

            {/* Image Carousel */}
            <Dialog open={carouselOpen} onOpenChange={setCarouselOpen}>
              <DialogContent className="max-w-4xl">
                <Carousel>
                  <CarouselContent>
                    {formData.photo_urls.map((url, idx) => (
                      <CarouselItem key={idx}>
                        <img
                          src={url}
                          className="w-full max-h-[70vh] object-contain"
                        />
                      </CarouselItem>
                    ))}
                  </CarouselContent>
                  <CarouselPrevious />
                  <CarouselNext />
                </Carousel>
              </DialogContent>
            </Dialog>
          </CardContent>
        </Card>
      )}
      {/* Property Pricing */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold">
          {["RS", "CS"].includes(formData.offeringType) ? (
            formData.hidePrice ? (
              "Price on Request"
            ) : (
              formatPrice(formData.price)
            )
          ) : (
            <>
              {formatPrice(formData.rentAmount)}
              <span className="text-lg font-normal">
                {" "}
                / {formData.rentFrequency}
              </span>
            </>
          )}
        </h1>
      </div>
      {/* Title & Description */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>{formData.titleEn}</CardTitle>
            <Button variant="ghost" size="icon" onClick={() => goToStep(0)}>
              <Edit className="h-4 w-4" />
            </Button>
          </div>
          <CardDescription>
            {formData.titleDeed && `Title Deed: ${formData.titleDeed}`}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="line-clamp-3 mb-4">{formData.descriptionEn}</p>
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline">See Full Description</Button>
            </DialogTrigger>
            <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>{formData.titleEn}</DialogTitle>
                <DialogDescription>
                  {formData.titleDeed && `Title Deed: ${formData.titleDeed}`}
                </DialogDescription>
              </DialogHeader>
              <p className="whitespace-pre-line">{formData.descriptionEn}</p>
            </DialogContent>
          </Dialog>
        </CardContent>
      </Card>

      {/* Property Details */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Specifications Card */}
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>Specifications</CardTitle>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => goToStep(/* specs step number */)}
              >
                <Edit className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="grid grid-cols-2 gap-4">
            <DetailItem
              label="Offering Type"
              value={
                OfferingTypeEnum.find((i) => i.value === formData.offeringType)
                  ?.name
              }
            />
            <DetailItem
              label="Property Type"
              value={
                PropertyTypeEnum.find((i) => i.value === formData.propertyType)
                  ?.name
              }
            />
            <DetailItem label="Size" value={`${formData.size} sq.ft`} />
            <DetailItem label="Unit No" value={formData.unitNo} />
            <DetailItem label="Bedrooms" value={formData.bedrooms} />
            <DetailItem label="Bathrooms" value={formData.bathrooms} />
            <DetailItem label="Parking" value={formData.parkingSpaces} />
            <DetailItem
              label="Furnished"
              value={formData.isFurnished ? "Yes" : "No"}
            />
            <DetailItem
              label="Total Plot Size"
              value={formData.totalPlotSize}
            />
            <DetailItem label="Lot Size" value={formData.lotSize} />
            <DetailItem label="Built-up Area" value={formData.builtUpArea} />
            <DetailItem label="Layout Type" value={formData.layoutType} />
            <DetailItem label="Ownership" value={formData.ownership} />
            <DetailItem label="Developer" value={resolvedData.developerName} />
          </CardContent>
        </Card>

        {/* Management Card */}
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>Management</CardTitle>
              <Button variant="ghost" size="icon" onClick={() => goToStep(0)}>
                <Edit className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="grid grid-cols-2 gap-4">
            <DetailItem label="Reference No" value={formData.referenceNumber} />
            <DetailItem label="Company" value={resolvedData.companyName} />
            <DetailItem
              label="Listing Agent"
              value={resolvedData.listingAgentName}
            />
            <DetailItem label="PF Agent" value={resolvedData.pfAgentName} />
            <DetailItem
              label="Bayut Agent"
              value={resolvedData.bayutAgentName}
            />
            <DetailItem
              label="Website Agent"
              value={resolvedData.websiteAgentName}
            />
            <DetailItem
              label="Listing Owner"
              value={resolvedData.listingOwnerName}
            />
            <DetailItem label="Landlord Name" value={formData.landlordName} />
            <DetailItem label="Landlord Email" value={formData.landlordEmail} />
            <DetailItem
              label="Landlord Contact"
              value={formData.landlordContact}
            />
            <DetailItem
              label="Available From"
              value={
                formData.availableFrom &&
                new Date(formData.availableFrom).toLocaleDateString()
              }
            />
          </CardContent>
        </Card>
      </div>

      {/* Permit Details & Pricing */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Permit Card */}
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>Permit Details</CardTitle>
              <Button variant="ghost" size="icon" onClick={() => goToStep(0)}>
                <Edit className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="grid grid-cols-2 gap-4">
            <DetailItem
              label="RERA Permit No"
              value={formData.reraPermitNumber}
            />
            <DetailItem
              label="RERA Issue Date"
              value={
                formData.reraIssueDate &&
                new Date(formData.reraIssueDate).toLocaleDateString()
              }
            />
            <DetailItem
              label="RERA Expiry Date"
              value={
                formData.reraExpirationDate &&
                new Date(formData.reraExpirationDate).toLocaleDateString()
              }
            />
            <DetailItem
              label="DTCM Permit No"
              value={formData.dtcmPermitNumber}
            />
          </CardContent>
        </Card>

        {/* Pricing Card */}
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>Pricing</CardTitle>
              <Button variant="ghost" size="icon" onClick={() => goToStep(0)}>
                <Edit className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="grid grid-cols-2 gap-4">
            <DetailItem
              label="No. of Cheques"
              value={formData.numberOfCheques}
            />
            <DetailItem
              label="Service Charges"
              value={
                formData.serviceCharges && `${formData.serviceCharges} AED/year`
              }
            />
            <DetailItem
              label="Financial Status"
              value={formData.financialStatus}
            />

            {["RS", "CS"].includes(formData.offeringType) && (
              <>
                <DetailItem
                  label="Hide Price"
                  value={formData.hidePrice ? "Yes" : "No"}
                />
                <DetailItem
                  label="Payment Method"
                  value={formData.paymentMethod}
                />
                <DetailItem
                  label="Down Payment"
                  value={formatPrice(formData.downPayment)}
                />
              </>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Title & Description Arabic */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Arabic Details</CardTitle>
            <Button variant="ghost" size="icon" onClick={() => goToStep(0)}>
              <Edit className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <h4 className="text-sm font-medium text-muted-foreground">
              Title (Arabic)
            </h4>
            <p className="font-medium text-lg">{formData.titleAr}</p>
          </div>

          <div>
            <h4 className="text-sm font-medium text-muted-foreground">
              Description (Arabic)
            </h4>
            <p className="line-clamp-3 mb-4">{formData.descriptionAr}</p>
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline">See Full Description</Button>
              </DialogTrigger>
              <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>{formData.titleAr}</DialogTitle>
                </DialogHeader>
                <p className="whitespace-pre-line text-right">
                  {formData.descriptionAr}
                </p>
              </DialogContent>
            </Dialog>
          </div>
        </CardContent>
      </Card>

      {/* Amenities & Media */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Amenities Card */}
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>Amenities</CardTitle>
              <Button variant="ghost" size="icon" onClick={() => goToStep(0)}>
                <Edit className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {resolvedData.amenityNames?.map((name, idx) => (
                <Badge key={idx} variant="secondary">
                  {name}
                </Badge>
              ))}
              {!resolvedData.amenityNames?.length && (
                <p className="text-muted-foreground">No amenities selected</p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Media Card */}
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>Media</CardTitle>
              <Button variant="ghost" size="icon" onClick={() => goToStep(1)}>
                <Edit className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <DetailItem
              label="Watermark Applied"
              value={formData.watermark === 1 ? "Yes" : "No"}
            />
            <DetailItemWithLink
              label="Video Tour"
              value={formData.video_tour_url}
            />
            <DetailItemWithLink
              label="360° View"
              value={formData.view_360_url}
            />
            <DetailItem
              label="QR Code (Property Booster)"
              value={formData.qr_code_property_booster}
            />
            <DetailItem
              label="QR Code (Website)"
              value={formData.qr_code_image_websites}
            />
          </CardContent>
        </Card>
      </div>

      {/* Location & Map */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Location</CardTitle>
            <Button variant="ghost" size="icon" onClick={() => goToStep(2)}>
              <Edit className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* PF Location */}
            <div>
              <h3 className="font-semibold mb-3">Property Finder</h3>
              <div className="space-y-2">
                <DetailItem
                  label="City"
                  value={
                    resolvedData.pfLocationDetails?.city ||
                    formData.property_finder_city
                  }
                />
                <DetailItem
                  label="Community"
                  value={
                    resolvedData.pfLocationDetails?.community ||
                    formData.property_finder_community
                  }
                />
                <DetailItem
                  label="Sub Community"
                  value={
                    resolvedData.pfLocationDetails?.sub_community ||
                    formData.property_finder_sub_community
                  }
                />
                <DetailItem
                  label="Tower/Building"
                  value={
                    resolvedData.pfLocationDetails?.building ||
                    formData.property_finder_tower
                  }
                />
                <DetailItem
                  label="Latitude"
                  value={formData.property_finder_latitude}
                />
                <DetailItem
                  label="Longitude"
                  value={formData.property_finder_longitude}
                />
              </div>
            </div>

            {/* Bayut Location */}
            <div>
              <h3 className="font-semibold mb-3">Bayut</h3>
              <div className="space-y-2">
                <DetailItem
                  label="City"
                  value={
                    resolvedData.bayutLocationDetails?.city ||
                    formData.bayut_city
                  }
                />
                <DetailItem
                  label="Community"
                  value={
                    resolvedData.bayutLocationDetails?.community ||
                    formData.bayut_community
                  }
                />
                <DetailItem
                  label="Sub Community"
                  value={
                    resolvedData.bayutLocationDetails?.sub_community ||
                    formData.bayut_sub_community
                  }
                />
                <DetailItem
                  label="Tower/Building"
                  value={
                    resolvedData.bayutLocationDetails?.building ||
                    formData.bayut_tower
                  }
                />
                <DetailItem label="Latitude" value={formData.bayut_latitude} />
                <DetailItem
                  label="Longitude"
                  value={formData.bayut_longitude}
                />
              </div>
            </div>
          </div>

          {/* Map */}
          {(formData?.property_finder_latitude || formData?.bayut_latitude) &&
          (formData?.property_finder_longitude || formData?.bayut_longitude) ? (
            <div className="mt-6 h-64 rounded-lg overflow-hidden">
              <iframe
                className="w-full h-full border-0"
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                src={`https://maps.google.com/maps?q=${encodeURIComponent(
                  formData?.property_finder_latitude || formData?.bayut_latitude
                )},${encodeURIComponent(
                  formData?.property_finder_longitude ||
                    formData?.bayut_longitude
                )}&hl=en&z=14&output=embed`}
              ></iframe>
            </div>
          ) : (
            <div className="mt-6 text-gray-500 text-center">
              Map not available. Please provide longitude and latitude.
            </div>
          )}
        </CardContent>
      </Card>

      {/* Link & Contact Info */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Links Card */}
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>Links</CardTitle>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => goToStep(/* links step number */)}
              >
                <Edit className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="text-sm font-medium text-muted-foreground mb-2">
                Floor Plans
              </h4>
              {formData.floor_plan_urls?.length > 0 ? (
                formData.floor_plan_urls.map((url, idx) => (
                  <a
                    key={idx}
                    href={url}
                    target="_blank"
                    className="block text-blue-600 hover:underline truncate"
                  >
                    Floor Plan {idx + 1}
                  </a>
                ))
              ) : (
                <p className="text-muted-foreground">No floor plans</p>
              )}
            </div>

            <div>
              <h4 className="text-sm font-medium text-muted-foreground mb-2">
                Documents
              </h4>
              {formData.documents?.length > 0 ? (
                formData.documents.map((doc, idx) => (
                  <a
                    key={idx}
                    href={doc.url}
                    target="_blank"
                    className="block text-blue-600 hover:underline truncate"
                  >
                    {doc.name || `Document ${idx + 1}`}
                  </a>
                ))
              ) : (
                <p className="text-muted-foreground">No documents</p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Contact Card */}
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>Contact Info</CardTitle>
              <Button variant="ghost" size="icon" onClick={() => goToStep(0)}>
                <Edit className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4 mb-4">
              <div className="bg-gray-100 dark:bg-gray-800 rounded-full w-16 h-16 flex items-center justify-center">
                <User className="w-8 h-8" />
              </div>
              <div>
                <h3 className="font-semibold">
                  {resolvedData.listingAgentName}
                </h3>
                <p className="text-muted-foreground text-sm">
                  {formData.listingAgent?.rera_number || "RERA: Not specified"}
                </p>
              </div>
            </div>

            <div className="space-y-3">
              <DetailItem
                label="Email"
                value={formData.listingAgent?.email}
                icon={<Mail className="w-4 h-4" />}
              />
              <DetailItem
                label="Phone"
                value={formData.listingAgent?.phone}
                icon={<Phone className="w-4 h-4" />}
              />
              <DetailItem
                label="Profile"
                value={formData.listingAgent?.profile_url}
                isLink={true}
              />
            </div>

            <div className="flex gap-2 mt-4">
              <Button
                variant="outline"
                className="flex-1"
                disabled={!formData.listingAgent?.phone}
              >
                <Phone className="mr-2 h-4 w-4" /> Call
              </Button>
              <Button
                variant="outline"
                className="flex-1"
                disabled={!formData.listingAgent?.email}
              >
                <Mail className="mr-2 h-4 w-4" /> Email
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Publishing Information Card */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Publishing Information</CardTitle>
            <Button variant="ghost" size="icon" onClick={() => goToStep(3)}>
              <Edit className="h-4 w-4" />
            </Button>
          </div>
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

      {/* Notes Card */}
      {formData.notes && (
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>Additional Notes</CardTitle>
              <Button variant="ghost" size="icon" onClick={() => goToStep(4)}>
                <Edit className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="bg-muted/50 rounded-lg p-4">
              <p className="whitespace-pre-line">{formData.notes}</p>
            </div>
          </CardContent>
        </Card>
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
