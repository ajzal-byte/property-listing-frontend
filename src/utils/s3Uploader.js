import getAuthHeaders from "./getAuthHeader";

// Helper: convert data-URI to Blob
async function dataUriToBlob(dataUri) {
  const res = await fetch(dataUri);
  return res.blob();
}

// Main function: uploads all files in formData to S3, then POSTS listing
export async function uploadFilesAndCreateListing(formData) {
  const API_BASE_URL = "https://backend.myemirateshome.com/api";
  const headers = getAuthHeaders();

  // 1) Gather all files (photos, floor plans, documents)
  const items = [];

  // photos
  (formData.photo_urls || []).forEach((dataUri, i) => {
    items.push({
      category: "photo",
      dataUri,
      filename: `photo_${Date.now()}_${i}.${
        dataUri.substring("data:".length, dataUri.indexOf(";")).split("/")[1]
      }`,
      mimeType: dataUri.split(";")[0].split(":")[1],
    });
  });

  // floor plans
  (formData.floor_plan_urls || []).forEach((dataUri, i) => {
    items.push({
      category: "floorplan",
      dataUri,
      filename: `floorplan_${Date.now()}_${i}.${
        dataUri.substring("data:".length, dataUri.indexOf(";")).split("/")[1]
      }`,
      mimeType: dataUri.split(";")[0].split(":")[1],
    });
  });

  // documents (assume each has a dataUri and type)
  (formData.documents || []).forEach((doc, i) => {
    const dataUri = doc.file;
    const mimeType = dataUri.split(";")[0].split(":")[1];
    const ext = mimeType.split("/")[1];

    items.push({
      category: "document",
      dataUri,
      filename: `doc_${Date.now()}_${i}.${ext}`,
      mimeType,
    });
  });

  // 2) Fetch presigned URLs
  const presigns = await Promise.all(
    items.map((it) =>
      fetch(
        `${API_BASE_URL}/s3/presigned-url?fileName=${encodeURIComponent(
          it.filename
        )}&fileType=${encodeURIComponent(it.mimeType)}`,
        { headers }
      ).then((r) => r.json())
    )
  );
  

  // 3) Upload each blob to S3
  const uploadResults = await Promise.all(
    items.map(async (it, idx) => {
      const blob = await dataUriToBlob(it.dataUri);
      const { uploadUrl, fileUrl } = presigns[idx];
      await fetch(uploadUrl, {
        method: "PUT",
        headers: { "Content-Type": it.mimeType },
        body: blob,
      });
      return { category: it.category, fileUrl };
    })
  );
  console.log("Upload results:", uploadResults);

  // 4) Separate final URLs
  const photo_urls = uploadResults
    .filter((u) => u.category === "photo")
    .map((u) => ({ file_url: u.fileUrl, is_main: false }));
  if (photo_urls.length) photo_urls[0].is_main = true; // mark first as main

  const floor_plan = uploadResults
    .filter((u) => u.category === "floorplan")
    .map((u) => u.fileUrl);

  const documents = uploadResults
    .filter((u) => u.category === "document")
    .map((u) => u.fileUrl);

  // 5) Build final payload (match your API spec)
  const today = new Date();
  const availableFromDate = formData.availableFrom
    ? new Date(formData.availableFrom)
    : null;
  const availability =
    availableFromDate && availableFromDate < today
      ? "not available"
      : "available";

  const payload = {
    reference_no: formData.referenceNumber,
    title: formData.titleEn,
    title_deed: formData.titleDeed,
    property_type: formData.propertyType,
    offering_type: formData.offeringType,
    size: Number(formData.size),
    unit_no: formData.unitNo,
    bedrooms: Number(formData.bedrooms),
    bathrooms: Number(formData.bathrooms),
    parking: Number(formData.parkingSpaces),
    furnished: formData.isFurnished ? "1" : "0",
    total_plot_size: Number(formData.totalPlotSize),
    plot_size: formData.lotSize,
    built_up_area: formData.builtUpArea,
    layout_type: formData.layoutType,
    ownership: formData.ownership,
    developer_id: formData.developer,
    // project_name: formData.developerName || "",
    // project_status: "",           // fill if you have it
    // sale_type: "1",
    // build_year: "",               // add if you collected
    // customer: "",                 // add if you collected
    rera_permit_number: formData.reraPermitNumber,
    rera_issue_date: formData.reraIssueDate,
    rera_expiration_date: formData.reraExpirationDate,
    contract_expiry_date: "",
    rental_period: formData.rentFrequency,
    price: Number(formData.price) || Number(formData.rentAmount),
    hide_price: formData.hidePrice,
    payment_method: formData.paymentMethod,
    down_payment_amount: Number(formData.downPayment) || 0,
    financial_status: formData.financialStatus,
    // sale_type_1: "",              // if needed
    title_en: formData.titleEn,
    title_ar: formData.titleAr,
    desc_en: formData.descriptionEn,
    desc_ar: formData.descriptionAr,
    geopoints: `${formData.property_finder_latitude},${formData.property_finder_longitude}`,
    listing_owner: formData.listingOwner || "",
    landlord_name: formData.landlordName,
    landlord_email: formData.landlordEmail,
    landlord_contact: formData.landlordContact,
    pf_location: formData.property_finder_location,
    bayut_location: formData.bayut_location,
    // availability,
    available_from: formData.availableFrom,
    emirate_amount: Number(formData.serviceCharges),
    payment_option: formData.numberOfCheques
      ? `${formData.numberOfCheques} cheques`
      : "Upfront",
    no_of_cheques: formData.numberOfCheques,
    contract_charges: Number(formData.serviceCharges),
    contract_expiry: "",
    qr_code: formData.qr_code_property_booster,
    qr_code_image: formData.qr_code_image_websites,
    brochure: "",
    video_url: formData.video_tour_url,
    "360_view_url": formData.view_360_url,
    dtcm_permit_number: formData.dtcmPermitNumber,
    watermark: formData.watermark ? "1" : "0",
    pf_enable: formData.publishPF,
    bayut_enable: formData.publishBayut,
    dubizzle_enable: formData.publishDubizzle,
    website_enable: formData.publishWebsite,
    company_id: formData.company,
    agent_id: formData.listingAgent,
    owner_id: formData.listingOwner,
    status: formData.publishingStatus,
    amenities: formData.selectedAmenities,
    comments: formData.notes,
    pf_agent_id: formData.pfAgent,
    website_agent_id: formData.websiteAgent,
    bayut_dubizzle_agent_id: formData.bayutAgent,
    photo_urls,
    floor_plan,
    documents,
  };

  const res = await fetch(`${API_BASE_URL}/listings`, {
    method: "POST",
    headers: { ...headers, "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  // Check if the response is ok (status code in the range 200-299)
  if (!res.ok) {
    // Log the status and response for debugging
    const errorText = await res.text();
    console.error("Create listing failed:", res.status, errorText);
    throw new Error(`Create listing failed with status: ${res.status}`);
  }

  // Log the status of the response
  console.log("Create listing status:", res.status);

  console.log("Raw response: ", res);
  

  // Log the raw HTML response (if any)
  const htmlResponse = await res.text();
  console.log("HTML response:", htmlResponse);

  // Parse and log the JSON response
  const jsonResponse = await res.json();
  console.log("Create listing response:", jsonResponse);

  return jsonResponse; // Return the parsed JSON response
}
