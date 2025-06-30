import getAuthHeaders from "@/utils/getAuthHeader";
import { toast } from "sonner";

export const uploadFileToS3 = async (file) => {
  try {
    // Get file extension
    const fileExt = file.name.split(".").pop();
    const fileName = `profile_${Date.now()}.${fileExt}`;
    const fileType = file.type;

    // Get presigned URL
    const presignedUrlResponse = await fetch(
      `https://backend.myemirateshome.com/api/s3/presigned-url?fileName=${fileName}&fileType=${fileType}`,
      {
        headers: getAuthHeaders(),
      }
    );
    const { uploadUrl, fileUrl } = await presignedUrlResponse.json();

    // Upload file to S3
    const uploadResponse = await fetch(uploadUrl, {
      method: "PUT",
      body: file,
      headers: {
        "Content-Type": fileType,
      },
    });

    if (!uploadResponse.ok) {
      throw new Error("Failed to upload file");
    }

    return fileUrl;
  } catch (error) {
    console.error("Error uploading file:", error);
    toast.error("Failed to upload profile photo", {
      variant: "destructive",
    });
    return null;
  }
};
