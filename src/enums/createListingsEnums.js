export const PropertyTypeEnum = [
  { value: "AP", name: "Apartment / Flat" },
  { value: "TH", name: "Townhouse" },
  { value: "VH", name: "Villa / House" },
  { value: "PH", name: "Penthouse" },
  { value: "LP", name: "Residential / Commercial Land" },
  { value: "FF", name: "Full Floor" },
  { value: "BU", name: "Bulk Units" },
  { value: "CD", name: "Compound" },
  { value: "DX", name: "Duplex" },
  { value: "FA", name: "Factory / Farm" },
  { value: "HA", name: "Hotel Apartment" },
  { value: "HF", name: "Half Floor" },
  { value: "LC", name: "Labor Camp" },
  { value: "OF", name: "Office Space" },
  { value: "RE", name: "Retail / Restaurant" },
  { value: "SA", name: "Staff Accommodation" },
  { value: "WB", name: "Whole / Commercial Building" },
  { value: "SH", name: "Shop" },
  { value: "SR", name: "Show Room" },
  { value: "WH", name: "Warehouse / Storage" },
  { value: "RF", name: "Residential Floor" },
  { value: "CF", name: "Commercial Floor" },
];

export const OfferingTypeEnum = [
  { value: "RR", name: "Residential Rent" },
  { value: "RS", name: "Residential Sale" },
  { value: "CR", name: "Commercial Rent" },
  { value: "CS", name: "Commercial Sale" },
];

export const StatusEnum = [
  { value: "draft", name: "Draft" },
  { value: "live", name: "Live" },
  { value: "archived", name: "Archived" },
  { value: "published", name: "Published" },
  { value: "unpublished", name: "Unpublished" },
  { value: "pocket", name: "Pocket" },
];

export const statusOptions = [
  { value: "draft", label: "Save as Draft" },
  { value: "live", label: "Make it Live" },
  { value: "archived", label: "Make it Archived" },
  { value: "published", label: "Publish" },
  { value: "unpublished", label: "Unpublish" },
  { value: "pocket", label: "Save as Pocket Listing" },
];

export const TimePeriodEnum = [
  { value: "yearly", name: "Yearly" },
  { value: "monthly", name: "Monthly" },
  { value: "quarterly", name: "Quarterly" },
];

export function getEnumName(enumArray, value) {
  const found = enumArray.find((item) => item.value === value);
  return found ? found.name : null;
}

export function getEnumValue(enumArray, name) {
  const found = enumArray.find((item) => item.name === name);
  return found ? found.value : null;
}
