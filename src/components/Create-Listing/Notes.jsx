import React from "react";
import { useForm } from "react-hook-form";
import { Form as FormProvider } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";

const NotesForm = ({ formData, setField, nextStep, prevStep }) => {
  const form = useForm({
    defaultValues: formData,
  });

  const onSubmit = () => nextStep();

  return (
    <FormProvider {...form}>
      <form className="space-y-8" onSubmit={form.handleSubmit(onSubmit)}>
        <div className="border-b pb-4">
          <h2 className="text-2xl font-semibold">Additional Notes</h2>
          <p className="text-muted-foreground text-sm">
            Add any final notes or comments for this property listing
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Property Notes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Textarea
                id="notes"
                value={formData.notes}
                onChange={(e) => setField("notes", e.target.value)}
                placeholder="Enter any additional information about this property..."
                className="min-h-[250px]"
              />
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

export default NotesForm;
