import React from "react";
import { useForm } from "react-hook-form";
import { Form as FormProvider } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { statusOptions } from "../../enums/createListingsEnums";

const PublishingStatusForm = ({ formData, setField, nextStep, prevStep }) => {
  const form = useForm({
    defaultValues: formData,
  });

  // Destructure setError, clearErrors and errors from form instance
  const {
    handleSubmit,
    setError,
    clearErrors,
    formState: { errors },
  } = form;

  // This function will be called when the form is submitted
  const handleFormSubmit = () => {
    // formData.publishingStatus is updated by the RadioGroup's onValueChange via setField
    if (!formData.publishingStatus || formData.publishingStatus === "") {
      setError("publishingStatus", {
        type: "manual",
        message: "Please select a publishing status.",
      });
      return; // Stop proceeding to nextStep
    }
    // If validation passes, clear any previous error for this field
    clearErrors("publishingStatus");
    nextStep(); // Proceed to the next step
  };

  return (
    <FormProvider {...form}>
      {/* Pass the custom submit handler to RHF's handleSubmit */}
      <form className="space-y-8" onSubmit={handleSubmit(handleFormSubmit)}>
        <div className="border-b pb-4">
          <h2 className="text-2xl font-semibold">Publishing Status</h2>
          <p className="text-muted-foreground text-sm">
            Select the publishing status for this property
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Select Status</CardTitle>
            {/* Display error message here if it exists */}
            {errors.publishingStatus && (
              <p className="text-sm font-medium text-destructive pt-1">
                {errors.publishingStatus.message}
              </p>
            )}
          </CardHeader>
          <CardContent>
            <RadioGroup
              value={formData.publishingStatus}
              onValueChange={(value) => {
                setField("publishingStatus", value);
                // Optionally clear error when user makes a selection
                if (errors.publishingStatus) {
                  clearErrors("publishingStatus");
                }
              }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
            >
              {statusOptions.map((option) => (
                <div key={option.value}>
                  <RadioGroupItem
                    value={option.value}
                    id={option.value}
                    className="peer sr-only"
                  />
                  <Label
                    htmlFor={option.value}
                    className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary cursor-pointer"
                  >
                    <div className="w-full text-center font-medium">
                      {option.label}
                    </div>
                  </Label>
                </div>
              ))}
            </RadioGroup>
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

export default PublishingStatusForm;
