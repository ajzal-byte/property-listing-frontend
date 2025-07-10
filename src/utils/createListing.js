import getAuthHeaders from "./getAuthHeader";

export async function uploadFilesAndCreateListing(formData) {
  const API_BASE_URL = "https://backend.myemirateshome.com/api";
  const headers = getAuthHeaders();

  // 1) Gather all files (all as File objects now)
  const items = [];

  // Handle photos (File objects)
  (formData.photo_urls || []).forEach((file, i) => {
    if (!(file instanceof File)) {
      console.warn("Invalid file object in photo_files:", file);
      return;
    }

    const ext = file.name.split(".").pop() || file.type.split("/")[1] || "jpg";
    items.push({
      category: "photo",
      file,
      filename: `photo_${Date.now()}_${i}.${ext}`,
      mimeType: file.type,
    });
  });

  // Handle floor plans (File objects)
  (formData.floor_plan_urls || []).forEach((file, i) => {
    if (!(file instanceof File)) {
      console.warn("Invalid file object in floor_plan_files:", file);
      return;
    }

    const ext = file.name.split(".").pop() || file.type.split("/")[1] || "png";
    items.push({
      category: "floorplan",
      file,
      filename: `floorplan_${Date.now()}_${i}.${ext}`,
      mimeType: file.type,
    });
  });

  // Handle documents (File objects)
  (formData.documents || []).forEach((file, i) => {
    if (!(file instanceof File)) {
      console.warn("Invalid file object in document_files:", file);
      return;
    }

    const ext = file.name.split(".").pop() || file.type.split("/")[1] || "pdf";
    items.push({
      category: "document",
      file,
      filename: `doc_${Date.now()}_${i}.${ext}`,
      mimeType: file.type,
    });
  });

  // 2) Fetch presigned URLs
  let presigns = [];
  try {
    presigns = await Promise.all(
      items.map((it) =>
        fetch(
          `${API_BASE_URL}/s3/presigned-url?fileName=${encodeURIComponent(
            it.filename
          )}&fileType=${encodeURIComponent(it.mimeType)}`,
          { headers }
        ).then(async (response) => {
          if (!response.ok) {
            const text = await response.text();
            throw new Error(`Presign API: ${response.status} - ${text}`);
          }
          return response.json();
        })
      )
    );
  } catch (error) {
    console.error("Presigned URL error:", error);
    throw new Error(`Failed to get upload permissions: ${error.message}`);
  }

  // 3) Upload files directly to S3
  let uploadResults = [];
  try {
    uploadResults = await Promise.all(
      items.map(async (it, idx) => {
        try {
          const { uploadUrl, fileUrl } = presigns[idx];

          const uploadResponse = await fetch(uploadUrl, {
            method: "PUT",
            headers: { "Content-Type": it.mimeType },
            body: it.file,
          });

          if (!uploadResponse.ok) {
            const errorText = await uploadResponse.text();
            throw new Error(
              `S3 upload failed: ${uploadResponse.status} - ${errorText}`
            );
          }

          return { category: it.category, fileUrl };
        } catch (error) {
          console.error(`Upload failed for ${it.filename}:`, error);
          throw new Error(`Upload failed for ${it.filename}: ${error.message}`);
        }
      })
    );
  } catch (error) {
    throw new Error(`File uploads failed: ${error.message}`);
  }

  // 4) Separate final URLs
  const photo_urls = uploadResults
    .filter((u) => u.category === "photo")
    .map((u) => ({ file_url: u.fileUrl, is_main: false }));
  if (photo_urls.length) photo_urls[0].is_main = true;

  const floor_plan = uploadResults
    .filter((u) => u.category === "floorplan")
    .map((u) => u.fileUrl);

  const documents = uploadResults
    .filter((u) => u.category === "document")
    .map((u) => u.fileUrl);

  // 5) Build final payload
  const today = new Date();
  const availableFromDate = formData.availableFrom
    ? new Date(formData.availableFrom)
    : null;
  const availability =
    availableFromDate && availableFromDate < today
      ? "not available"
      : "available";

  const payload = {
    // Property details
    category: formData.category,
    property_type: formData.property_type,
    title_deed: formData.title_deed,
    size: formData.size ? Number(formData.size) : null,
    bedrooms: formData.bedrooms,
    bathrooms: formData.bathrooms,
    furnishing_type: formData.furnishing_type,
    finishing_type: formData.finishingType,
    parking: formData.parking ? Number(formData.parking) : null,
    unit_no: formData.unit_no,
    // total_plot_size: formData.total_plot_size
    //   ? Number(formData.total_plot_size)
    //   : null,
    plot_size: formData.total_plot_size
      ? Number(formData.total_plot_size)
      : null,
    built_up_area: formData.built_up_area,
    layout_type: formData.layout_type,
    ownership: formData.ownership,
    developer_id: formData.developer ? Number(formData.developer) : null,
    has_garden: formData.hasGarden || false,
    has_kitchen: formData.hasKitchen || false,
    project_name: formData.project_name,
    project_status: formData.project_status,
    build_year: formData.build_year,
    floor_number: formData.floor_number,
    plot_number: formData.plot_number,

    // Management
    reference_no: formData.reference_no,
    company_id: formData.company ? Number(formData.company) : null,
    agent_id: Number(formData.agent_id) ? Number(formData.agent_id) : null,
    pf_agent_id: Number(formData.pfAgent) ? Number(formData.pfAgent) : null,
    bayut_dubizzle_agent_id: Number(formData.bayutAgent)
      ? Number(formData.bayutAgent)
      : null,
    website_agent_id: Number(formData.websiteAgent)
      ? Number(formData.websiteAgent)
      : null,
    owner_id: Number(formData.listingOwner)
      ? Number(formData.listingOwner)
      : null,
    landlord_name: formData.landlordName,
    landlord_email: formData.landlordEmail,
    landlord_contact: formData.landlordContact,
    available_from: formData.availableFrom,
    contract_expiry: formData.contract_expiration_date,
    contract_charges: formData.contract_charges
      ? Number(formData.contract_charges)
      : null,

    // Permit details
    rera_permit_number: formData.rera_permit_number,
    rera_issue_date: formData.rera_issue_date,
    rera_expiration_date: formData.reraExpirationDate,
    dtcm_permit_number: formData.dtcm_permit_number,
    dtcm_expiry_date: formData.dtcm_expiry_date,

    // Pricing
    price: formData.price ? Number(formData.price) : null,
    hide_price: formData.hide_price,
    payment_method: formData.paymentMethod,
    down_payment_amount: formData.downPayment
      ? Number(formData.downPayment)
      : null,
    service_charges: formData.service_charges
      ? Number(formData.service_charges)
      : null,
    cheques: formData.cheques,
    financial_status: formData.financialStatus,
    amount_type: formData.amountType?.toLowerCase(),

    // Description
    title_en: formData.titleEn,
    title_ar: formData.titleAr,
    desc_en: formData.descriptionEn,
    desc_ar: formData.descriptionAr,
    moj_deed_location_description: formData.moj_deed_location_description,
    title: formData.titleEn || formData.titleAr || null,

    // Amenities
    amenities: formData.selectedAmenities,

    // Media
    watermark: formData.watermark ? "1" : "0",
    video_url: formData.video_tour_url,
    "360_view_url": formData.view_360_url,
    qr_code: formData.qr_code_property_booster,
    qr_code_image: formData.qr_code_image_websites,

    // Location
    collection_pf_location: {
      id: formData.property_finder_location_id,
      city: formData.property_finder_city,
      community: formData.property_finder_community,
      sub_community: formData.property_finder_sub_community,
      building: formData.property_finder_tower,
      street_direction: formData.property_finder_street_direction,
      uae_emirate: formData.property_finder_uae_emirate,
    },
    collection_bayut_location: {
      city: formData.bayut_city,
      community: formData.bayut_community,
      sub_community: formData.bayut_sub_community,
      tower: formData.bayut_tower,
    },
    bayut_location: formData.bayut_location,
    geopoints:
      formData.latitude && formData.longitude
        ? `${formData.latitude},${formData.longitude}`
        : undefined,

    // Publishing
    pf_enable: formData.pf_enable,
    bayut_enable: formData.bayut_enable,
    dubizzle_enable: formData.dubizzle_enable,
    website_enable: formData.publishWebsite,

    //  Notes
    notes: formData.notes,

    // Publishing Status
    status: formData.publishingStatus,

    // Files URLs
    photo_urls,
    floor_plan,
    documents,

    // Other
    created_by: Number(JSON.parse(localStorage.getItem("userData")).id),
  };

  // Clean up the payload
  Object.keys(payload).forEach((key) => {
    if (payload[key] === undefined || payload[key] === "") {
      delete payload[key];
    }
  });

  // Remove unused fields
  const fieldsToRemove = [
    "agents",
    "allOwners",
    "amenitiesList",
    "bayutLocations",
    "pfLocations",
    "companies",
    "developers",
    "owners",
    "descriptionAr",
    "descriptionEn",
    "titleAr",
    "titleEn",
  ];

  fieldsToRemove.forEach((field) => {
    delete payload[field];
  });

  console.log("Final payload: ", payload);

  // 6) POST create listing
  const res = await fetch(`${API_BASE_URL}/listings`, {
    method: "POST",
    headers: {
      ...headers,
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(
      `Failed to create listing: ${errorData.message || "Unknown error"}`
    );
  }
  return res.json();
}
