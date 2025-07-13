// src/hooks/useCreateListingData.jsx
import { useState, useEffect, useCallback } from "react";
import getAuthHeaders from "@/utils/getAuthHeader";

export function useCreateListingData() {
  // 1) Define the wizard steps
  const steps = [
    { id: 0, name: "Property Details", shortName: "Details" },
    { id: 1, name: "Media", shortName: "Media" },
    { id: 2, name: "Location", shortName: "Location" },
    { id: 3, name: "Publishing", shortName: "Publish" },
    { id: 4, name: "Notes", shortName: "Notes" },
    { id: 5, name: "Documents", shortName: "Docs" },
    { id: 6, name: "Publishing Status", shortName: "Status" },
    { id: 7, name: "Preview", shortName: "Preview" },
  ];

  // 2) Load draft from localStorage if exists
  let draft = {};
  try {
    const raw = localStorage.getItem("draftListing");
    draft = raw ? JSON.parse(raw) : {};
  } catch (err) {
    console.error("Malformed draftListing in localStorage:", err);
    localStorage.removeItem("draftListing");
  }

  // 3) Master formData state (all fields across all sections)
  const [formData, setFormData] = useState({
    // PROPERTY DETAILS:
    // Specifications
    category: "",
    title_deed: "",
    property_type: "",
    size: "",
    unit_no: "",
    bedrooms: "",
    bathrooms: "",
    parking: "",
    furnishing_type: "",
    total_plot_size: "",
    lotSize: "",
    built_up_area: "",
    layout_type: "",
    ownership: "",
    developer: "",
    // Management
    reference_no: "",
    company: "",
    agent_id: "",
    pfAgent: "",
    bayutAgent: "",
    websiteAgent: "",
    listingOwner: "",
    landlordName: "",
    landlordEmail: "",
    landlordContact: "",
    availableFrom: "",
    // PermitDetails
    rera_permit_number: "",
    rera_issue_date: "",
    reraExpirationDate: "",
    dtcm_permit_number: "",
    dtcm_expiry_date: "",
    // Pricing
    price: "",
    hide_price: false,
    paymentMethod: "",
    downPayment: "",
    numberOfCheques: "",
    service_charges: "",
    financialStatus: "",
    rentFrequency: "",
    rentAmount: "",
    // Description
    titleEn: "",
    descriptionEn: "",
    titleAr: "",
    descriptionAr: "",
    // Amenities
    selectedAmenities: [],

    // Option lists (populated from APIs)
    propertyTypes: [],
    developers: [],
    companies: [],
    agents: [],
    owners: [],
    amenitiesList: [],

    // MEDIA:
    photo_urls: [],
    watermark: 0,
    video_tour_url: "",
    view_360_url: "",
    qr_code_property_booster: "",
    qr_code_image_websites: "",

    // LOCATION:
    property_finder_location_id: "",
    property_finder_location: "",
    property_finder_city: "",
    property_finder_community: "",
    property_finder_sub_community: "",
    property_finder_tower: "",
    property_finder_street_direction: "",
    property_finder_uae_emirate: "",

    bayut_location: "",
    bayut_city: "",
    bayut_community: "",
    bayut_sub_community: "",
    bayut_tower: "",

    latitude: "",
    longitude: "",

    floor_plan_urls: [],

    // Option lists of all PF and Bayut locations
    pfLocations: [],
    bayutLocations: [],

    // PUBLISHING
    pf_enable: false,
    bayut_platform_enable: false,
    bayut_enable: false,
    dubizzle_enable: false,
    publishWebsite: false,

    // NOTES
    notes: "",

    // DOCUMENTS
    documents: [],

    // PUBLISHING STATUS
    publishingStatus: "",

    // Merge in any draft values
    ...(draft.formData || {}),
  });

  // 4) Track current step index
  const [currentStep, setCurrentStep] = useState(
    typeof draft.currentStep === "number" ? draft.currentStep : 0
  );

  const API_BASE_URL = "https://backend.myemirateshome.com/api";
  // 5) Fetch dropdown data once on mount
  useEffect(() => {
    async function loadOptions() {
      const headers = getAuthHeaders();
      const user = JSON.parse(localStorage.getItem("userData") || "{}");
      try {
        // a) Companies & agents logic
        if (user.role.name === "super_admin") {
          // fetch both companies + each company’s agents
          const res = await fetch(`${API_BASE_URL}/listing/create-info`, {
            headers,
          });
          const { companies } = await res.json();
          setFormData((f) => ({
            ...f,
            companies,
            agents: [],
          }));
        } else if (user.role.name === "admin") {
          // admin: only agents list
          const res = await fetch(`${API_BASE_URL}/listing/agents`, {
            headers,
          });
          const { agents } = await res.json();
          setFormData((f) => ({
            ...f,
            companies: [],
            agents,
          }));
        } else if (user.role.name === "agent") {
          // agent: only their own company
          const res = await fetch(`${API_BASE_URL}/agents/list`, {
            headers,
          });
          const { agents } = await res.json();
          setFormData((f) => ({
            ...f,
            companies: [],
            agents,
          }));
        } else if (user.role.name === "owner") {
          // owner
          const res = await fetch(`${API_BASE_URL}/agents/list/forowners`, {
            headers,
          });
          const { agents } = await res.json();
          setFormData((f) => ({
            ...f,
            companies: [],
            agents,
          }));
        }

        // b) Developers, property‐types & amenities (and owners for non‐super_admin)
        const [devRes, propTypeRes, amenRes] = await Promise.all([
          fetch(`${API_BASE_URL}/developers`, { headers }),
          fetch(`${API_BASE_URL}/property-types`, { headers }),
          fetch(`${API_BASE_URL}/amenities`, { headers }),
        ]);
        const [devData, propTypeData, amenData] = await Promise.all([
          devRes.json(),
          propTypeRes.json(),
          amenRes.json(),
        ]);

        // determine owners list
        let ownersList = [];
        if (user.role.name === "super_admin") {
          // super_admin: start empty, will load when company is selected
          ownersList = [];
        } else {
          // admin, agent, owner: fetch your company’s users
          const myCoRes = await fetch(`${API_BASE_URL}/mycompany`, { headers });
          const { users } = await myCoRes.json();
          ownersList = users;
        }

        setFormData((f) => ({
          ...f,
          developers: devData,
          owners: ownersList,
          propertyTypes: propTypeData.property_types || [],
          amenitiesList: amenData,
        }));

        // c) Fetch initial PF & Bayut locations
        const [pfRes, bayutRes] = await Promise.all([
          fetch(`${API_BASE_URL}/locations?type=pf`, { headers }),
          fetch(`${API_BASE_URL}/locations?type=bayut`, { headers }),
        ]);

        const [pfData, bayutData] = await Promise.all([
          pfRes.json(),
          bayutRes.json(),
        ]);

        setFormData((f) => ({
          ...f,
          pfLocations: pfData.data || [],
          bayutLocations: bayutData.data || [],
        }));
      } catch (err) {
        console.error("Failed to load create-info / agents", err);
      }
    }
    loadOptions();
  }, []);

  // Update Owner list for superadmin accordingly
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("userData") || "{}");
    if (user.role.name === "super_admin" && formData.company) {
      const headers = getAuthHeaders();
      (async () => {
        const res = await fetch(
          `${API_BASE_URL}/companies/${formData.company}`,
          { headers }
        );
        const { users } = await res.json();
        setFormData((f) => ({ ...f, owners: users }));
      })();
    }
  }, [formData.company]);

  // 6) Persist draft to localStorage on every change
  useEffect(() => {
    localStorage.setItem(
      "draftListing",
      JSON.stringify({ formData, currentStep })
    );
  }, [formData, currentStep]);

  // 7) Helpers to update a single field
  const setField = useCallback((name, value) => {
    setFormData((f) => ({
      ...f,
      [name]: value,
    }));
  }, []);

  // 8) Navigation
  const nextStep = useCallback(() => {
    setCurrentStep((i) => Math.min(i + 1, steps.length - 1));
  }, [steps.length]);

  const prevStep = useCallback(() => {
    setCurrentStep((i) => Math.max(i - 1, 0));
  }, []);

  const goToStep = useCallback(
    (stepIndex) => {
      if (stepIndex >= 0 && stepIndex < steps.length) {
        setCurrentStep(stepIndex);
      }
    },
    [steps.length]
  );

  return {
    formData,
    setField,
    setFormData,
    currentStep,
    nextStep,
    prevStep,
    goToStep,
    steps,
  };
}
