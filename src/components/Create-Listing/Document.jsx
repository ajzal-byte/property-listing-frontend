import React, { useRef, useState, useCallback, useEffect } from "react";
import { useForm } from "react-hook-form";
import { Form as FormProvider } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, Image, X, File as FileIcon, UploadCloud } from "lucide-react";

const DocumentsForm = ({ formData, setField, nextStep, prevStep }) => {
  const form = useForm({
    defaultValues: formData,
  });

  const fileInputRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [uploadError, setUploadError] = useState("");

  // clean up any stale/non‑File entries on mount
  useEffect(() => {
    const docs = formData.documents;
    if (!Array.isArray(docs)) return;

    const valid = docs.every((f) => f instanceof File || f instanceof Blob);
    if (!valid) {
      setField("documents", []);
    }
  }, []);

  const handleFileChange = useCallback(
    (newFiles) => {
      const updatedFiles = [...(formData.documents || []), ...newFiles];
      setField("documents", updatedFiles);
      setUploadError("");
    },
    [formData.documents, setField]
  );

  const handleFileUpload = (files) => {
    const validFileTypes = [
      "image/jpeg",
      "image/png",
      "image/webp",
      "application/pdf",
    ];
    const maxSizeMB = 10;

    const uploadedFiles = Array.from(files).map((file) => {
      if (!validFileTypes.includes(file.type)) {
        throw new Error("Only JPG, PNG, WEBP images and PDF files are allowed");
      }

      if (file.size > maxSizeMB * 1024 * 1024) {
        throw new Error(`File size exceeds ${maxSizeMB}MB limit`);
      }

      return file;
    });

    handleFileChange(uploadedFiles);
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
      try {
        handleFileUpload(e.dataTransfer.files);
      } catch (error) {
        setUploadError(error.message);
      }
    }
  };

  const handleClickUpload = () => {
    fileInputRef.current.click();
  };

  const removeFile = (index) => {
    const updatedFiles = [...formData.documents];
    updatedFiles.splice(index, 1);
    setField("documents", updatedFiles);
  };

  const getFileIcon = (file) => {
    if (file.type === "application/pdf")
      return <FileText className="w-5 h-5 text-red-500" />;
    return <Image className="w-5 h-5 text-blue-500" />;
  };

  const getFileType = (file) => {
    if (file.type === "application/pdf") return "PDF Document";
    return "Image File";
  };

  const onSubmit = () => nextStep();

  return (
    <FormProvider {...form}>
      <form className="space-y-8" onSubmit={form.handleSubmit(onSubmit)}>
        <div className="border-b pb-4">
          <h2 className="text-2xl font-semibold">Property Documents</h2>
          <p className="text-muted-foreground text-sm">
            Upload supporting documents for this property (images and PDFs)
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <FileIcon className="mr-2" size={20} />
              <span>Property Documents</span>
              <span className="ml-2 bg-muted text-muted-foreground text-xs px-2 py-1 rounded-full">
                {formData.documents?.length || 0}
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
              <UploadCloud
                className={`mx-auto mb-4 ${
                  isDragging ? "text-primary" : "text-muted-foreground"
                }`}
                size={48}
              />
              <p className="text-muted-foreground mb-2">
                Drop files here or click to upload
              </p>
              <p className="text-sm text-muted-foreground">
                Supports JPG, PNG, WEBP, and PDF files up to 10MB
              </p>
              <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                accept=".jpg,.jpeg,.png,.webp,.pdf"
                multiple
                onChange={(e) => {
                  try {
                    if (e.target.files) handleFileUpload(e.target.files);
                  } catch (error) {
                    setUploadError(error.message);
                  }
                }}
              />
            </div>

            {uploadError && (
              <p className="text-red-500 text-sm mt-2">{uploadError}</p>
            )}

            {/* File Cards */}
            {formData.documents?.length > 0 && (
              <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {formData.documents.map((file, index) => (
                  <div
                    key={index}
                    className="border rounded-lg p-4 flex items-start hover:bg-muted/50 transition-colors relative"
                  >
                    <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-2 mr-3">
                      {getFileIcon(file)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-medium truncate">{file.name}</div>
                      <div className="text-sm text-muted-foreground">
                        {getFileType(file)}
                      </div>
                      <div className="text-xs text-muted-foreground mt-1">
                        {Math.round(file.size / 1024)} KB
                      </div>
                    </div>
                    <button
                      type="button"
                      className="text-muted-foreground hover:text-red-500 transition-colors p-1"
                      onClick={() => removeFile(index)}
                    >
                      <X size={16} />
                    </button>
                  </div>
                ))}
              </div>
            )}
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

export default DocumentsForm;
