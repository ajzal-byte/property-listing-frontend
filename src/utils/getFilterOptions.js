import {
  PropertyTypeEnum,
  OfferingTypeEnum,
  statusOptions,
  portalOptions,
  bedroomBathroomOptions,
} from "@/enums/createListingsEnums";
import getAuthHeaders from "@/utils/getAuthHeader";

const API_BASE_URL = "https://backend.myemirateshome.com/api";

// Fetch locations with optional filters and search
export const fetchLocations = async (filters = {}, searchQuery = "") => {
  try {
    const queryParams = new URLSearchParams();

    // Add search query if provided
    if (searchQuery) {
      queryParams.append("search", searchQuery);
    }

    // Add other filters
    Object.entries(filters).forEach(([key, value]) => {
      if (value) queryParams.append(key, value);
    });

    const response = await fetch(
      `${API_BASE_URL}/filterlocations?${queryParams}`,
      {
        headers: getAuthHeaders(),
      }
    );
    if (!response.ok) throw new Error("Failed to fetch locations");
    const data = await response.json();
    return data.data || [];
  } catch (error) {
    console.error("Error fetching locations:", error);
    return [];
  }
};

// Fetch developers
export const fetchDevelopers = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/developers`, {
      headers: getAuthHeaders(),
    });
    if (!response.ok) throw new Error("Failed to fetch developers");
    return await response.json();
  } catch (error) {
    console.error("Error fetching developers:", error);
    return [];
  }
};

// Fetch owners
export const fetchOwners = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/listOwners`, {
      headers: getAuthHeaders(),
    });
    if (!response.ok) throw new Error("Failed to fetch owners");
    const data = await response.json();
    return data.owners || [];
  } catch (error) {
    console.error("Error fetching owners:", error);
    return [];
  }
};

// Dummy agents data
const dummyAgents = [
  { id: 1, name: "John Doe" },
  { id: 2, name: "Jane Smith" },
  { id: 3, name: "Michael Johnson" },
];

// Get all filter options
export const getAllFilterOptions = async (locationFilters = {}) => {
  const [locations, developers, owners] = await Promise.all([
    fetchLocations(locationFilters),
    fetchDevelopers(),
    fetchOwners(),
  ]);

  // Extract unique values for each location type
  const cities = [...new Set(locations.map((loc) => loc.city))].filter(Boolean);
  const communities = [
    ...new Set(locations.map((loc) => loc.community)),
  ].filter(Boolean);
  const subCommunities = [
    ...new Set(locations.map((loc) => loc.sub_community)),
  ].filter(Boolean);
  const buildings = [...new Set(locations.map((loc) => loc.building))].filter(
    Boolean
  );

  return {
    propertyTypes: PropertyTypeEnum.map((opt) => ({
      value: opt.value,
      label: opt.name,
    })),
    offeringTypes: OfferingTypeEnum.map((opt) => ({
      value: opt.value,
      label: opt.name,
    })),
    statusOptions: statusOptions.map((opt) => ({
      value: opt.value,
      label: opt.label,
    })),
    portalOptions: portalOptions.map((opt) => ({
      value: opt.value,
      label: opt.label,
    })),
    bedroomBathroomOptions: bedroomBathroomOptions.map((opt) => ({
      value: opt,
      label: opt,
    })),
    cities,
    communities,
    subCommunities,
    buildings,
    developers: developers.map((dev) => ({ value: dev.id, label: dev.name })),
    owners: owners.map((owner) => ({ value: owner.id, label: owner.name })),
    agents: dummyAgents.map((agent) => ({
      value: agent.id,
      label: agent.name,
    })),
  };
};
