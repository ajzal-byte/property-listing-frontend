import getAuthHeaders from "./getAuthHeader";

// Helper: convert data-URI to Blob
async function dataUriToBlob(dataUri) {
  try {
    const res = await fetch(dataUri);
    if (!res.ok) {
      throw new Error(`Failed to convert data URI: ${res.status}`);
    }
    return res.blob();
  } catch (error) {
    console.error("Data URI conversion error:", error);
    throw new Error(`Data URI processing failed: ${error.message}`);
  }
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

  // 3) Upload each blob to S3
  let uploadResults = [];
  try {
    uploadResults = await Promise.all(
      items.map(async (it, idx) => {
        try {
          const blob = await dataUriToBlob(it.dataUri);
          const { uploadUrl, fileUrl } = presigns[idx];

          const uploadResponse = await fetch(uploadUrl, {
            method: "PUT",
            headers: { "Content-Type": it.mimeType },
            body: blob,
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
    ...formData,

    title_en: formData.titleEn,
    title_ar: formData.titleAr,
    desc_en: formData.descriptionEn,
    desc_ar: formData.descriptionAr,
    developer_id: formData.developer,
    listing_owner: formData.listingOwner || "",

    // Structured location field
    collectionpf_location: {
      id: formData.property_finder_location_id,
      city: formData.property_finder_city,
      community: formData.property_finder_community,
      sub_community: formData.property_finder_sub_community,
      building: formData.property_finder_tower,
      street_direction: formData.property_finder_street_direction,
      uaeEmirates: formData.property_finder_uae_emirate,
    },

    // Transformed fields
    size: Number(formData.size),
    total_plot_size: Number(formData.total_plot_size),
    built_up_area: Number(formData.built_up_area),
    plot_size: Number(formData.lotSize),
    parking: Number(formData.parking),
    price: Number(formData.price),
    down_payment_amount: Number(formData.downPayment) || 0,
    emirate_amount: Number(formData.service_charges),
    contract_charges: Number(formData.service_charges),

    // Logic-based formatting
    payment_option: formData.numberOfCheques
      ? `${formData.numberOfCheques} cheques`
      : "Upfront",

    watermark: formData.watermark ? "1" : "0",

    // Defaults
    contract_expiry_date: "",
    contract_expiry: "",
    brochure: "",

    photo_urls,
    floor_plan,
    documents,
  };

  // Remove unused fields
  delete payload.agents;
  delete payload.allOwners;
  delete payload.amenitiesList;
  delete payload.bayutLocations;
  delete payload.pfLocations;
  delete payload.companies;
  delete payload.developers;
  delete payload.owners;
  delete payload.descriptionAr;
  delete payload.descriptionEn;
  delete payload.titleAr;
  delete payload.titleEn;
  // Remove empty fields
  Object.keys(payload).forEach((key) => {
    if (payload[key] === "") delete payload[key];
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
