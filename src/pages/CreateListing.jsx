import React from "react";
import { useCreateListingData } from "@/hooks/useCreateListingData";
import {
  ProgressBar,
  PropertyDetails,
  Media,
  Location,
  Publishing,
  Notes,
  Document,
  PublishingStatus,
  Preview,
} from "@/components/Create-Listing";
import { uploadFilesAndCreateListing } from "@/utils/s3Uploader";

const CreateListing = () => {
  const { formData, setField, currentStep, nextStep, prevStep, steps } =
    useCreateListingData();

  // <-- keep everything else exactly as you have it -->

  // this is the only new function
  const handleFinalSubmit = async () => {
    try {
      await uploadFilesAndCreateListing(formData);
      // clear your draft so it starts fresh next time
      localStorage.removeItem("draftListing");
      alert("Listing created successfully!");
      // optionally redirect the user:
      // window.location.href = "/my-listings";
    } catch (err) {
      console.error(err);
      alert("Failed to create listing: " + err.message);
    }
  };

  // Render the current step component
  const renderCurrentStep = () => {
    const props = {
      formData,
      setField,
      nextStep,
      prevStep,
      onSubmit: handleFinalSubmit, // pass only to Preview
    };

    switch (currentStep) {
      case 0:
        return <PropertyDetails {...props} />;
      case 1:
        return <Media {...props} />;
      case 2:
        return <Location {...props} />;
      case 3:
        return <Publishing {...props} />;
      case 4:
        return <Notes {...props} />;
      case 5:
        return <Document {...props} />;
      case 6:
        return <PublishingStatus {...props} />;
      case 7:
        // Preview uses onSubmit rather than nextStep
        return <Preview {...props} />;
      default:
        return <PropertyDetails {...props} />;
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      <h1 className="text-3xl font-bold mb-6">Create Property Listing</h1>
      <ProgressBar steps={steps} currentStep={currentStep} />
      <div className="mt-8">{renderCurrentStep()}</div>
    </div>
  );
};

export default CreateListing;
