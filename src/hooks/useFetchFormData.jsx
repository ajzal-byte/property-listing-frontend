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
  const draft = JSON.parse(localStorage.getItem("draftListing") || "{}");

  // 3) Master formData state (all fields across all sections)
  const [formData, setFormData] = useState({
    // …―― Property Details section (unchanged) ――…
    category: "",
    title_deed: "",
    property_type: "",
    size: "",
    unit_no: "",
    bedrooms: "",
    bathrooms: "",
    parking: "",
    furnishing_type: false,
    total_plot_size: "",
    lotSize: "",
    built_up_area: "",
    layout_type: "",
    ownership: "",
    developer: "",
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
    rera_permit_number: "",
    rera_issue_date: "",
    reraExpirationDate: "",
    dtcm_permit_number: "",
    price: "",
    hide_price: false,
    paymentMethod: "",
    downPayment: "",
    numberOfCheques: "",
    service_charges: "",
    financialStatus: "",
    rentFrequency: "",
    rentAmount: "",
    titleEn: "",
    descriptionEn: "",
    titleAr: "",
    descriptionAr: "",
    // Amenities (we already migrated to “selectedAmenities”)
    selectedAmenities: [],
    amenitiesList: [],

    // — NEW: Media step defaults —
    photo_urls: [],
    watermark: 0,
    video_tour_url: "",
    view_360_url: "",
    qr_code_property_booster: "",
    qr_code_image_websites: "",

    // — NEW: Location step defaults —
    // (These hold the user’s chosen ID, not the raw strings)
    property_finder_location: "", // selected PF location ID
    property_finder_city: "",
    property_finder_community: "",
    property_finder_sub_community: "",
    property_finder_tower: "",
    property_finder_latitude: "",
    property_finder_longitude: "",

    bayut_location: "", // selected Bayut location ID
    bayut_city: "",
    bayut_community: "",
    bayut_sub_community: "",
    bayut_tower: "",
    bayut_latitude: "",
    bayut_longitude: "",

    floor_plan_urls: [],

    // Hold the raw lists of all PF and Bayut locations (objects from the API)
    pfLocations: [],
    bayutLocations: [],

    // Option lists (populated from APIs)
    developers: [],
    companies: [],
    agents: [],
    owners: [],

    // Merge in any draft values
    ...(draft.formData || {}),
  });

  // 4) Track current step index
  const [currentStep, setCurrentStep] = useState(
    typeof draft.currentStep === "number" ? draft.currentStep : 0
  );

  // 5) Fetch dropdown data once on mount (including PF & Bayut locations)
  useEffect(() => {
    async function loadOptions() {
      const API_BASE_URL = "https://backend.myemirateshome.com/api";
      const headers = getAuthHeaders();
      const user = JSON.parse(localStorage.getItem("userData") || "{}");

      try {
        // a) Companies & agents logic (unchanged)
        if (user.role.name === "super_admin") {
          const res = await fetch(`${API_BASE_URL}/listing/create-info`, {
            headers,
          });
          const { companies } = await res.json();
          setFormData((f) => ({
            ...f,
            companies,
            agents: [],
          }));
        } else {
          const res = await fetch(`${API_BASE_URL}/listing/agents`, {
            headers,
          });
          const { agents } = await res.json();
          setFormData((f) => ({
            ...f,
            companies: [],
            agents,
          }));
        }

        // b) Developers, owners, amenities (unchanged)
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
          owners: ownerData.owners,
          amenitiesList: amenData,
        }));

        // c) ―― NEW ―― Fetch initial PF & Bayut locations
        //    (no search query, so just type=pf or type=bayut)
        const [pfRes, bayutRes] = await Promise.all([
          fetch(`${API_BASE_URL}/locations?type=pf`, { headers }),
          fetch(`${API_BASE_URL}/locations?type=bayut`, { headers }),
        ]);

        const [pfData, bayutData] = await Promise.all([
          pfRes.json(),
          bayutRes.json(),
        ]);

        // We expect pfData.data and bayutData.data to be arrays of objects { id, city, community, sub_community, building, location, type }
        setFormData((f) => ({
          ...f,
          pfLocations: pfData.data || [],
          bayutLocations: bayutData.data || [],
        }));
      } catch (err) {
        console.error("Failed to load create-info / agents / locations", err);
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

  return {
    formData,
    setField,
    setFormData,
    currentStep,
    nextStep,
    prevStep,
    steps,
  };
}
