import {
  OfferingTypeEnum,
  PropertyTypeEnum,
} from "../enums/createListingsEnums";

export const prepareSpecificationsData = (formData, resolvedData) => {
  return [
    {
      label: "Offering Type",
      value: OfferingTypeEnum.find((i) => i.value === formData.offeringType)
        ?.name,
    },
    {
      label: "Property Type",
      value: PropertyTypeEnum.find((i) => i.value === formData.propertyType)
        ?.name,
    },
    { label: "Size", value: `${formData.size} sq.ft` },
    { label: "Unit No", value: formData.unitNo },
    { label: "Bedrooms", value: formData.bedrooms },
    { label: "Bathrooms", value: formData.bathrooms },
    { label: "Parking", value: formData.parkingSpaces },
    { label: "Furnished", value: formData.isFurnished ? "Yes" : "No" },
    { label: "Total Plot Size", value: formData.totalPlotSize },
    { label: "Lot Size", value: formData.lotSize },
    { label: "Built-up Area", value: formData.builtUpArea },
    { label: "Layout Type", value: formData.layoutType },
    { label: "Ownership", value: formData.ownership },
    { label: "Developer", value: resolvedData.developerName },
  ];
};

export const prepareManagementData = (formData, resolvedData) => {
  return [
    { label: "Reference No", value: formData.referenceNumber },
    { label: "Company", value: resolvedData.companyName },
    { label: "Listing Agent", value: resolvedData.listingAgentName },
    { label: "PF Agent", value: resolvedData.pfAgentName },
    { label: "Bayut Agent", value: resolvedData.bayutAgentName },
    { label: "Website Agent", value: resolvedData.websiteAgentName },
    { label: "Listing Owner", value: resolvedData.listingOwnerName },
    { label: "Landlord Name", value: formData.landlordName },
    { label: "Landlord Email", value: formData.landlordEmail },
    { label: "Landlord Contact", value: formData.landlordContact },
    {
      label: "Available From",
      value:
        formData.availableFrom &&
        new Date(formData.availableFrom).toLocaleDateString(),
    },
  ];
};

export const preparePermitData = (formData) => {
  return [
    { label: "RERA Permit No", value: formData.reraPermitNumber },
    {
      label: "RERA Issue Date",
      value:
        formData.reraIssueDate &&
        new Date(formData.reraIssueDate).toLocaleDateString(),
    },
    {
      label: "RERA Expiry Date",
      value:
        formData.reraExpirationDate &&
        new Date(formData.reraExpirationDate).toLocaleDateString(),
    },
    { label: "DTCM Permit No", value: formData.dtcmPermitNumber },
  ];
};

export const preparePricingData = (formData, formatPrice) => {
  const baseItems = [
    { label: "No. of Cheques", value: formData.numberOfCheques },
    {
      label: "Service Charges",
      value: formData.serviceCharges && `AED ${formData.serviceCharges}`,
    },
    { label: "Financial Status", value: formData.financialStatus },
    { label: "Cheques", value: formData.cheques },
  ];

  if (["RS", "CS"].includes(formData.offeringType)) {
    return [
      ...baseItems,
      { label: "Hide Price", value: formData.hidePrice ? "Yes" : "No" },
      { label: "Payment Method", value: formData.paymentMethod },
      { label: "Down Payment", value: formatPrice(formData.downPayment) },
    ];
  }

  return baseItems;
};

export const prepareAmenitiesData = (resolvedData) => {
  return resolvedData.amenityNames || [];
};

export const prepareMediaData = (formData) => {
  return [
    {
      label: "Watermark Applied",
      value: formData.watermark === 1 ? "Yes" : "No",
    },
    {
      label: "Video Tour",
      value: formData.video_tour_url,
      useLinkComponent: true,
    },
    {
      label: "360° View",
      value: formData.view_360_url,
      useLinkComponent: true,
    },
    {
      label: "QR Code (Property Booster)",
      value: formData.qr_code_property_booster,
    },
    {
      label: "QR Code (Website)",
      value: formData.qr_code_image_websites,
    },
  ];
};
