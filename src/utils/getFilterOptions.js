import {
  PropertyTypeEnum,
  OfferingTypeEnum,
  statusOptions,
  portalOptions,
  bedroomOptions,
  bathroomOptions,
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

// Fetch Agents
export const fetchAgentsByRole = async () => {
  const { role } = JSON.parse(localStorage.getItem("userData") || "{}") || {};
  const url = `${API_BASE_URL}/getAgentsByRole`;
  try {
    const response = await fetch(
      role?.name === "superadmin" ? `${url}?include_companies=true` : url,
      { headers: getAuthHeaders() }
    );
    if (!response.ok) throw new Error("Failed to fetch agents");
    return await response.json();
  } catch (error) {
    console.error("Error fetching agents:", error);
    return {};
  }
};

// Get all filter options
export const getAllFilterOptions = async (locationFilters = {}) => {
  const [locations, developers, ownersRaw, agentsRes] = await Promise.all([
    fetchLocations(locationFilters),
    fetchDevelopers(),
    fetchOwners(),
    fetchAgentsByRole(),
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

  //Build `owners` with grouping when `company` is present:
  let owners;
  if (ownersRaw.some((o) => o.company && o.company.name)) {
    // superadmin: group by o.company.name
    const grouped = {};
    ownersRaw.forEach((o) => {
      const compName = o.company?.name;
      if (!grouped[compName]) grouped[compName] = [];
      grouped[compName].push({ value: o.id, label: o.name });
    });
    owners = Object.entries(grouped).map(([label, options]) => ({
      label,
      options,
    }));
  } else {
    // normal user: flat list
    owners = ownersRaw.map((o) => ({ value: o.id, label: o.name }));
  }

  // Build agent options, grouping by company for superadmins
  let agents;
  if (Array.isArray(agentsRes.companies)) {
    // superadmin: each company has its own agents array
    agents = agentsRes.companies?.map((company) => ({
      label: company?.name,
      options: company?.agents.map((agent) => ({
        value: agent.id,
        label: agent.name,
      })),
    }));
  } else if (Array.isArray(agentsRes.agents)) {
    // normal user: flat agent list
    agents = agentsRes.agents.map((agent) => ({
      value: agent.id,
      label: agent.name,
    }));
  } else {
    agents = [];
  }

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
    bedroomOptions: bedroomOptions.map((opt) => ({
      value: opt,
      label: opt,
    })),
    bathroomOptions: bathroomOptions.map((opt) => ({
      value: opt,
      label: opt === "none" ? "0" : opt,
    })),
    cities,
    communities,
    subCommunities,
    buildings,
    developers: developers.map((dev) => ({ value: dev.id, label: dev.name })),
    owners,
    agents,
  };
};
