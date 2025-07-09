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
    ...formData,

    // Add the processed URLs
    photo_urls,
    floor_plan,
    documents,

    // Rest of your payload fields
    title_en: formData.titleEn,
    title_ar: formData.titleAr,
    desc_en: formData.descriptionEn,
    desc_ar: formData.descriptionAr,
    company_id: formData.company,
    developer_id: formData.developer,
    listing_owner: formData.listingOwner || "",

    collectionpf_location: {
      id: formData.property_finder_location_id,
      city: formData.property_finder_city,
      community: formData.property_finder_community,
      sub_community: formData.property_finder_sub_community,
      building: formData.property_finder_tower,
      street_direction: formData.property_finder_street_direction,
      uae_emirate: formData.property_finder_uae_emirate,
    },

    size: Number(formData.size),
    total_plot_size: Number(formData.total_plot_size),  
    built_up_area: formData.built_up_area,
    plot_size: Number(formData.lotSize),
    parking: Number(formData.parking),
    price: Number(formData.price),
    down_payment_amount: Number(formData.downPayment) || 0,
    emirate_amount: Number(formData.service_charges),
    contract_charges: Number(formData.service_charges),
    amount_type: formData.amountType,
    uae_emirate: formData.property_finder_uae_emirate,
    listing_advertisement_number: "ADV-999",

    payment_option: formData.numberOfCheques
      ? `${formData.numberOfCheques} cheques`
      : "Upfront",

    watermark: formData.watermark ? "1" : "0",

    contract_expiry_date: "",
    contract_expiry: "",
    brochure: "",
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
