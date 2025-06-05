import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { Form as FormProvider } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

// Import all section components
import {
  Specifications,
  Management,
  PermitDetails,
  Pricing,
  Description,
  Amenities,
} from "./sections";

const PropertyDetails = ({ formData, setField, nextStep, prevStep }) => {
  const form = useForm({
    defaultValues: formData,
    mode: "onSubmit",
    reValidateMode: "onBlur",
  });

  const sectionComponents = [
    { id: "specifications", Component: Specifications },
    { id: "management", Component: Management },
    { id: "permits", Component: PermitDetails },
    { id: "pricing", Component: Pricing },
    { id: "description", Component: Description },
    { id: "amenities", Component: Amenities },
  ];

  // Once the user finishes the entire block, we move to the next wizard step
  const onSubmit = () => {
    nextStep();
  };

  const onError = (errors) => {
    console.error("Form submission errors:", errors);
    // Determine if there are actual validation errors (not just a missed field)
    if (Object.keys(errors).length > 0) {
      toast.error("Validation Error", {
        description:
          "Please fill in all required fields and correct any errors.",
        duration: 3000,
        position: "top-right",
      });
    }
  };

  return (
    <FormProvider {...form}>
      <form className="space-y-8" onSubmit={form.handleSubmit(onSubmit, onError)}>
        <div className="border-b pb-4">
          <h2 className="text-2xl font-semibold">Property Details</h2>
          <p className="text-muted-foreground text-sm">
            Fill in all sections below, then continue to the next step.
          </p>
        </div>

        {sectionComponents.map(({ id, Component }) => (
          <div key={id} className="bg-white rounded-lg shadow p-6">
            <Component formData={formData} setField={setField} />
          </div>
        ))}

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

export default PropertyDetails;
