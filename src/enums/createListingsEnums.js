export const PropertyTypeEnum = [
  {
    value: "compound",
    name: "Compound",
    types: ["Building"],
    category: ["residential"],
  },
  {
    value: "whole-building",
    name: "Whole Building",
    types: ["Building", "Land"],
    category: ["residential", "commercial"],
  },
  {
    value: "factory",
    name: "Factory",
    types: ["Building"],
    category: ["commercial"],
  },
  {
    value: "land",
    name: "Land",
    types: ["Land"],
    category: ["residential", "commercial"],
  },
  { value: "rest-house", name: "Rest House", types: [], category: [] },
  {
    value: "apartment",
    name: "Apartment",
    types: ["Unit"],
    category: ["residential"],
  },
  {
    value: "shop",
    name: "Shop",
    types: ["Building"],
    category: ["commercial"],
  },
  {
    value: "warehouse",
    name: "Warehouse",
    types: ["Building"],
    category: ["commercial"],
  },
  { value: "chalet", name: "Chalet", types: [], category: [] },
  {
    value: "office-space",
    name: "Office Space",
    types: ["Building"],
    category: ["commercial"],
  },
  {
    value: "full-floor",
    name: "Full Floor",
    types: ["Unit"],
    category: ["residential", "commercial"],
  },
  {
    value: "villa",
    name: "Villa",
    types: ["Villa", "Land"],
    category: ["residential", "commercial"],
  },
  { value: "farm", name: "Farm", types: ["Land"], category: ["commercial"] },
  {
    value: "show-room",
    name: "Show Room",
    types: ["Building"],
    category: ["commercial"],
  },
  {
    value: "bulk-sale-unit",
    name: "Bulk Sale Unit",
    types: ["Building"],
    category: ["residential", "commercial"],
  },
  { value: "restaurant", name: "Restaurant", types: [], category: [] },
  { value: "roof", name: "Roof", types: [], category: [] },
  {
    value: "half-floor",
    name: "Half Floor",
    types: ["Unit"],
    category: ["residential", "commercial"],
  },
  { value: "twin-house", name: "Twin House", types: [], category: [] },
  { value: "cabin", name: "Cabin", types: [], category: [] },
  {
    value: "bulk-rent-unit",
    name: "Bulk Rent Unit",
    types: ["Building"],
    category: ["residential", "commercial"],
  },
  { value: "ivilla", name: "iVilla", types: [], category: [] },
  {
    value: "co-working-space",
    name: "Co-working Space",
    types: ["Building"],
    category: ["commercial"],
  },
  {
    value: "hotel-apartment",
    name: "Hotel Apartment",
    types: ["Unit"],
    category: ["residential"],
  },
  {
    value: "retail",
    name: "Retail",
    types: ["Building"],
    category: ["commercial"],
  },
  {
    value: "duplex",
    name: "Duplex",
    types: ["Unit"],
    category: ["residential"],
  },
  {
    value: "townhouse",
    name: "Townhouse",
    types: ["Villa", "Land"],
    category: ["residential"],
  },
  {
    value: "staff-accommodation",
    name: "Staff Accommodation",
    types: ["Building"],
    category: ["commercial"],
  },
  {
    value: "medical-facility",
    name: "Medical Facility",
    types: [],
    category: [],
  },
  { value: "palace", name: "Palace", types: [], category: [] },
  {
    value: "penthouse",
    name: "Penthouse",
    types: ["Unit"],
    category: ["residential"],
  },
  { value: "clinic", name: "Clinic", types: [], category: [] },
  { value: "cafeteria", name: "Cafeteria", types: [], category: [] },
  {
    value: "bungalow",
    name: "Bungalow",
    types: ["Villa", "Land"],
    category: ["residential"],
  },
  {
    value: "labor-camp",
    name: "Labor Camp",
    types: ["Building"],
    category: ["commercial"],
  },
  {
    value: "business-center",
    name: "Business Center",
    types: ["Building"],
    category: ["commercial"],
  },
];

export const OfferingTypeEnum = [
  { value: "residential", name: "Residential" },
  { value: "commercial", name: "Commercial" },
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
  { value: "sendforapproval", label: "Send for Approval" },
];

export const portalOptions = [
  { value: "pf_enable", label: "Property Finder" },
  { value: "bayut_enable", label: "Bayut" },
  { value: "dubizzle_enable", label: "Dubizzle" },
  { value: "website_enable", label: "Website" },
];

export const bedroomOptions = [
  "studio",
  "1",
  "2",
  "3",
  "4",
  "5",
  "6",
  "7",
  "8",
  "9",
  "10",
  "11",
  "12",
  "13",
  "14",
  "15",
  "16",
  "17",
  "18",
  "19",
  "20",
];

export const bathroomOptions = [
  "none",
  "1",
  "2",
  "3",
  "4",
  "5",
  "6",
  "7",
  "8",
  "9",
  "10",
  "11",
  "12",
  "13",
  "14",
  "15",
  "16",
  "17",
  "18",
  "19",
  "20",
];

export const TimePeriodEnum = [
  { value: "sale", name: "Sale" },
  { value: "yearly", name: "Yearly" },
  { value: "monthly", name: "Monthly" },
  { value: "weekly", name: "Weekly" },
  { value: "daily", name: "Daily" },
];

export const furnishing_typeEnum = [
  { value: "unfurnished", name: "Unfurnished" },
  { value: "semi-furnished", name: "Semi-Furnished" },
  { value: "furnished", name: "Furnished" },
];

export const finishingTypeEnum = [
  { value: "unfinished", name: "Unfinished" },
  { value: "semi-finished", name: "Semi-Finished" },
  { value: "fully-finished", name: "Fully-Finished" },
];

export const projectStautusEnum = [
  { value: "completed", name: "Completed" },
  { value: "off_plan", name: "Off Plan" },
  { value: "completed_primary", name: "Completed Primary" },
  { value: "off_plan_primary", name: "Off Plan Primary" },
];

export const uaeEmirateEnum = [
  { value: "dubai", name: "Dubai" },
  { value: "abu_dhabi", name: "Abu Dhabi" },
  { value: "northern_emirates", name: "Northern Emirates" },
];

export const amenitiesEnum = [{ value: "parking", name: "Parking" }];

export function getEnumName(enumArray, value) {
  const found = enumArray.find((item) => item.value === value);
  return found ? found.name : null;
}

export function getEnumValue(enumArray, name) {
  const found = enumArray.find((item) => item.name === name);
  return found ? found.value : null;
}
