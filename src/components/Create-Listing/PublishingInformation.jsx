import React from "react";
import { useForm } from "react-hook-form";
import { Form as FormProvider } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Toggle } from "@/components/ui/toggle";
import { Checkbox } from "@/components/ui/checkbox";
import { Globe } from "lucide-react";

const PublishingInformationForm = ({
  formData,
  setField,
  nextStep,
  prevStep,
}) => {
  const form = useForm({
    defaultValues: formData,
  });

  const onSubmit = () => nextStep();

  // Handle platform toggling
  const handlePlatformToggle = (platform, pressed) => {
    setField(platform, pressed);

    // Special handling for Bayut
    if (platform === "publishBayutPlatform") {
      if (pressed) {
        // When Bayut is toggled on, enable and check both sub-platforms
        setField("publishBayut", true);
        setField("publishDubizzle", true);
      } else {
        // When Bayut is toggled off, uncheck both sub-platforms
        setField("publishBayut", false);
        setField("publishDubizzle", false);
      }
    }
  };

  // Handle Bayut sub-platform changes
  const handleBayutSubPlatformChange = (field, checked) => {
    setField(field, checked);

    // If both sub-platforms are unchecked, untoggle the Bayut card
    if (
      !checked &&
      !formData.publishBayut &&
      !formData.publishDubizzle
    ) {
      setField("publishBayutPlatform", false);
    }
  };

  return (
    <FormProvider {...form}>
      <form className="space-y-8" onSubmit={form.handleSubmit(onSubmit)}>
        <div className="border-b pb-4">
          <h2 className="text-2xl font-semibold">Publishing Information</h2>
          <p className="text-muted-foreground text-sm">
            Select platforms where you want to publish this property
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Property Finder Card */}
          <Card className="h-full flex flex-col">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center">
                  <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-2 mr-3">
                    <div className="bg-blue-600 w-8 h-8 rounded flex items-center justify-center">
                      <span className="text-white font-bold text-xs">PF</span>
                    </div>
                  </div>
                  <span>Property Finder</span>
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent className="flex-grow flex flex-col justify-between">
              <div className="mb-6">
                <p className="text-muted-foreground text-sm">
                  Publish this property on Property Finder platform
                </p>
              </div>
              <div className="mt-auto">
                <Toggle
                  pressed={formData.publishPF}
                  onPressedChange={(pressed) =>
                    handlePlatformToggle("publishPF", pressed)
                  }
                  className="w-full py-3 data-[state=on]:bg-blue-600 data-[state=on]:text-white"
                >
                  {formData.publishPF ? "Published" : "Publish"}
                </Toggle>
              </div>
            </CardContent>
          </Card>

          {/* Bayut Card */}
          <Card className="h-full flex flex-col">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center">
                  <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-2 mr-3">
                    <div className="bg-orange-500 w-8 h-8 rounded flex items-center justify-center">
                      <span className="text-white font-bold text-xs">B</span>
                    </div>
                  </div>
                  <span>Bayut</span>
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent className="flex-grow flex flex-col justify-between">
              <div className="mb-4">
                <p className="text-muted-foreground text-sm mb-3">
                  Publish this property on Bayut platforms
                </p>

                <div className="space-y-3 mt-3">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="bayut-platform"
                      checked={formData.publishBayut}
                      onCheckedChange={(checked) =>
                        handleBayutSubPlatformChange(
                          "publishBayut",
                          checked
                        )
                      }
                      disabled={!formData.publishBayutPlatform}
                    />
                    <label
                      htmlFor="bayut-platform"
                      className={`text-sm font-medium leading-none ${
                        !formData.publishBayutPlatform ? "text-muted-foreground" : ""
                      }`}
                    >
                      Bayut
                    </label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="dubizzle"
                      checked={formData.publishDubizzle}
                      onCheckedChange={(checked) =>
                        handleBayutSubPlatformChange("publishDubizzle", checked)
                      }
                      disabled={!formData.publishBayutPlatform}
                    />
                    <label
                      htmlFor="dubizzle"
                      className={`text-sm font-medium leading-none ${
                        !formData.publishBayutPlatform ? "text-muted-foreground" : ""
                      }`}
                    >
                      Dubizzle
                    </label>
                  </div>
                </div>
              </div>
              <div className="mt-auto">
                <Toggle
                  pressed={formData.publishBayutPlatform}
                  onPressedChange={(pressed) =>
                    handlePlatformToggle("publishBayutPlatform", pressed)
                  }
                  className="w-full py-3 data-[state=on]:bg-orange-500 data-[state=on]:text-white"
                >
                  {formData.publishBayutPlatform ? "Published" : "Publish"}
                </Toggle>
              </div>
            </CardContent>
          </Card>

          {/* Website Card */}
          <Card className="h-full flex flex-col">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center">
                  <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-2 mr-3">
                    <div className="bg-purple-600 w-8 h-8 rounded flex items-center justify-center">
                      <Globe className="text-white w-5 h-5" />
                    </div>
                  </div>
                  <span>Website</span>
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent className="flex-grow flex flex-col justify-between">
              <div className="mb-6">
                <p className="text-muted-foreground text-sm">
                  Publish this property on your website
                </p>
              </div>
              <div className="mt-auto">
                <Toggle
                  pressed={formData.publishWebsite}
                  onPressedChange={(pressed) =>
                    handlePlatformToggle("publishWebsite", pressed)
                  }
                  className="w-full py-3 data-[state=on]:bg-purple-600 data-[state=on]:text-white"
                >
                  {formData.publishWebsite ? "Published" : "Publish"}
                </Toggle>
              </div>
            </CardContent>
          </Card>
        </div>

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

export default PublishingInformationForm;
