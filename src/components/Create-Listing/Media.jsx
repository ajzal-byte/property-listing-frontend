import React, { useRef, useState, useCallback, useEffect } from "react";
import { useForm } from "react-hook-form";
import { Form as FormProvider } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Camera, Upload, X } from "lucide-react";

const MediaForm = ({ formData, setField, nextStep, prevStep }) => {
  const form = useForm({
    defaultValues: formData,
  });

  const fileInputRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [imageError, setImageError] = useState("");
  const [previewUrls, setPreviewUrls] = useState([]);

  // Generate preview URLs when images change, and drop invalid entries
  useEffect(() => {
    if (!Array.isArray(formData.photo_urls)) {
      setPreviewUrls([]);
      return;
    }
    let cleanedFiles = [];
    const urls = formData.photo_urls.reduce((acc, file) => {
      try {
        // only Files/Blobs are valid
        if (file instanceof File || file instanceof Blob) {
          const url = URL.createObjectURL(file);
          acc.push(url);
          cleanedFiles.push(file);
        }
      } catch (err) {
        // skip invalid entries
      }
      return acc;
    }, []);

    // if some files were invalid, update formData
    if (cleanedFiles.length !== formData.photo_urls.length) {
      setField("photo_urls", cleanedFiles);
    }

    setPreviewUrls(urls);

    // Cleanup object URLs
    return () => {
      urls.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [formData.photo_urls, setField]);

  const handleImageChange = useCallback(
    (newFiles) => {
      const updatedFiles = [...(formData.photo_urls || []), ...newFiles];
      setField("photo_urls", updatedFiles);

      if (updatedFiles.length >= 3) {
        setImageError("");
      }
    },
    [formData.photo_urls, setField]
  );

  const handleFileUpload = (files) => {
    const validImageTypes = ["image/jpeg", "image/png", "image/webp"];
    const maxSizeMB = 10;
    const uploadedFiles = [];
    let hasError = false;

    Array.from(files).forEach((file) => {
      if (!validImageTypes.includes(file.type)) {
        setImageError("Only JPG, PNG, or WEBP images are allowed");
        hasError = true;
        return;
      }

      if (file.size > maxSizeMB * 1024 * 1024) {
        setImageError(`File size exceeds ${maxSizeMB}MB limit`);
        hasError = true;
        return;
      }

      uploadedFiles.push(file);
    });

    if (!hasError && uploadedFiles.length > 0) {
      handleImageChange(uploadedFiles);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFileUpload(e.dataTransfer.files);
    }
  };

  const handleClickUpload = () => {
    fileInputRef.current.click();
  };

  const removeImage = (index) => {
    const updatedFiles = [...(formData.photo_urls || [])];
    const [removed] = updatedFiles.splice(index, 1);
    setField("photo_urls", updatedFiles);

    // Revoke the object URL immediately
    if (previewUrls[index]) URL.revokeObjectURL(previewUrls[index]);
    const newPreviewUrls = [...previewUrls];
    newPreviewUrls.splice(index, 1);
    setPreviewUrls(newPreviewUrls);

    if (imageError && updatedFiles.length === 0) {
      setImageError("");
    }
  };

  const onSubmit = () => {
    const photoFiles = formData.photo_urls || [];

    // Check for duplicates (basic check)
    const uniqueFiles = new Set(
      photoFiles.map((file) => file.name + file.size)
    );
    if (uniqueFiles.size !== photoFiles.length) {
      setImageError("Duplicate images detected. Please remove duplicates.");
      return;
    }

    if (photoFiles.length < 3) {
      setImageError("Please select at least 3 images to continue");
      return;
    }

    setImageError("");
    nextStep();
  };

  return (
    <FormProvider {...form}>
      <form className="space-y-8" onSubmit={form.handleSubmit(onSubmit)}>
        <div className="border-b pb-4">
          <h2 className="text-2xl font-semibold">Media Upload</h2>
          <p className="text-muted-foreground text-sm">
            Upload property photos and media links
          </p>
        </div>

        {/* Photo Upload Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Camera className="mr-2" size={20} />
              <span>Property Photos</span>
              <span className="ml-2 bg-muted text-muted-foreground text-xs px-2 py-1 rounded-full">
                {formData.photo_urls?.length || 0}
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div
              className={`border-2 border-dashed rounded-lg p-8 text-center bg-muted/50 cursor-pointer transition-colors ${
                isDragging
                  ? "border-primary bg-primary/10"
                  : "border-muted-foreground"
              }`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={handleClickUpload}
            >
              <Upload
                className={`mx-auto mb-4 ${
                  isDragging ? "text-primary" : "text-muted-foreground"
                }`}
                size={48}
              />
              <p className="text-muted-foreground mb-2">
                Drop files here or click to upload
              </p>
              <p className="text-sm text-muted-foreground">
                Supports JPG, PNG, WEBP up to 10MB
              </p>
              <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                accept="image/jpeg, image/png, image/webp"
                multiple
                onChange={(e) => handleFileUpload(e.target.files)}
              />
            </div>

            {/* Watermark Checkbox */}
            <div className="mt-4 flex items-center space-x-2">
              <Checkbox
                id="watermark"
                checked={formData.watermark === 1}
                onCheckedChange={(checked) =>
                  setField("watermark", checked ? 1 : 0)
                }
              />
              <label
                htmlFor="watermark"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Watermark?
              </label>
            </div>

            {imageError && (
              <p className="text-red-500 text-sm mt-2">{imageError}</p>
            )}

            {/* Photo Previews */}
            {previewUrls.length > 0 && (
              <div className="mt-6 grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                {previewUrls.map((url, index) => (
                  <div key={index} className="relative group">
                    <div className="aspect-square overflow-hidden rounded-lg border">
                      <img
                        src={url}
                        alt={`Property ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <button
                      type="button"
                      className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={() => removeImage(index)}
                    >
                      <X size={16} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Media URLs Section */}
        <Card>
          <CardHeader>
            <CardTitle>Media Links</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="video_tour_url">Video Tour URL</Label>
                <Input
                  id="video_tour_url"
                  type="url"
                  value={formData.video_tour_url}
                  onChange={(e) => setField("video_tour_url", e.target.value)}
                  placeholder="https://..."
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="view_360_url">View 360 URL</Label>
                <Input
                  id="view_360_url"
                  type="url"
                  value={formData.view_360_url}
                  onChange={(e) => setField("view_360_url", e.target.value)}
                  placeholder="https://..."
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* QR Codes Section */}
        <Card>
          <CardHeader>
            <CardTitle>QR Codes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="qr_code_property_booster">
                  QR Code (Property Booster)
                </Label>
                <Input
                  id="qr_code_property_booster"
                  value={formData.qr_code_property_booster}
                  type="url"
                  onChange={(e) =>
                    setField("qr_code_property_booster", e.target.value)
                  }
                  placeholder="Enter QR code data"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="qr_code_image_websites">
                  QR Code Image (Websites)
                </Label>
                <Input
                  id="qr_code_image_websites"
                  value={formData.qr_code_image_websites}
                  type="url"
                  onChange={(e) =>
                    setField("qr_code_image_websites", e.target.value)
                  }
                  placeholder="Enter QR code data"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex justify-between pt-4 border-t">
          <Button
            type="button"
            variant="outline"
            onClick={prevStep}
            className="w-full sm:w-auto"
          >
            Back
          </Button>
          <Button type="submit" className="w-full sm:w-auto">
            Continue to Next Step
          </Button>
        </div>
      </form>
    </FormProvider>
  );
};

export default MediaForm;
