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
    offeringType: "",
    titleDeed: "",
    propertyType: "",
    size: "",
    unitNo: "",
    bedrooms: "",
    bathrooms: "",
    parkingSpaces: "",
    isFurnished: false,
    totalPlotSize: "",
    lotSize: "",
    builtUpArea: "",
    layoutType: "",
    ownership: "",
    developer: "",
    // Management
    referenceNumber: "",
    company: "",
    listingAgent: "",
    pfAgent: "",
    bayutAgent: "",
    websiteAgent: "",
    listingOwner: "",
    landlordName: "",
    landlordEmail: "",
    landlordContact: "",
    availableFrom: "",
    // PermitDetails
    reraPermitNumber: "",
    reraIssueDate: "",
    reraExpirationDate: "",
    dtcmPermitNumber: "",
    dtcmExpirationDate: "",
    // Pricing
    price: "",
    hidePrice: false,
    paymentMethod: "",
    downPayment: "",
    numberOfCheques: "",
    serviceCharges: "",
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
    property_finder_location: "",
    property_finder_city: "",
    property_finder_community: "",
    property_finder_sub_community: "",
    property_finder_tower: "",
    property_finder_street_direction: "",
    property_finder_uaeEmirates: "",

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
    publishPF: false,
    publishBayutPlatform: false,
    publishBayut: false,
    publishDubizzle: false,
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

  // 5) Fetch dropdown data once on mount
  useEffect(() => {
    async function loadOptions() {
      const API_BASE_URL = "https://backend.myemirateshome.com/api";
      const headers = getAuthHeaders();
      const user = JSON.parse(localStorage.getItem("userData") || "{}");
      try {
        // a) Companies & agents logic (unchanged)
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

        // b) Developers, owners, amenities
        const [devRes, ownerRes, amenRes] = await Promise.all([
          fetch(`${API_BASE_URL}/developers`, { headers }),
          fetch(`${API_BASE_URL}/listOwners`, { headers }),
          fetch(`${API_BASE_URL}/amenities`, { headers }),
        ]);
        const [devData, ownerData, amenData] = await Promise.all([
          devRes.json(),
          ownerRes.json(),
          amenRes.json(),
        ]);

        setFormData((f) => ({
          ...f,
          developers: devData,
          // keep full owner list for filtering, but only populate owners[] for non-superadmins
          allOwners: ownerData.owners,
          owners: user.role.name === "super_admin" ? [] : ownerData.owners,
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
