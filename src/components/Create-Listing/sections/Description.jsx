import React, { useState } from "react";
import { useFormContext } from "react-hook-form";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const Description = ({ setField }) => {
  const [activeTab, setActiveTab] = useState("english");
  const { control, setValue, trigger, watch } = useFormContext();

  const handleChange = (name, value) => {
    setValue(name, value);
    setField(name, value);
    trigger(name);
  };

  // Watch input values for character count
  const titleEn = watch("titleEn") || "";
  const descriptionEn = watch("descriptionEn") || "";
  const titleAr = watch("titleAr") || "";
  const descriptionAr = watch("descriptionAr") || "";

  const moj_deed_location_description =
    watch("moj_deed_location_description") || "";

  return (
    <div className="space-y-8 rounded-lg bg-background p-6 shadow-sm">
      <div className="border-b pb-4">
        <h2 className="text-2xl font-semibold">Property Description</h2>
        <p className="mt-1 text-base text-muted-foreground">
          Provide title and description for your property listing
        </p>
      </div>

      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        className="border-b pb-3"
      >
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="english" className="text-base">
            English
          </TabsTrigger>
          <TabsTrigger value="arabic" className="text-base">
            Arabic
          </TabsTrigger>
        </TabsList>

        <TabsContent value="english" className="mt-6">
          <div className="space-y-6">
            <FormField
              control={control}
              name="titleEn"
              rules={{
                required: "Please enter a title in English",
                minLength: {
                  value: 30,
                  message: "Title must be at least 30 characters",
                },
                maxLength: {
                  value: 50,
                  message: "Title must not exceed 50 characters",
                },
              }}
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel className="text-base font-medium flex items-center gap-1">
                    Title <span className="text-red-500">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter title in English (30–50 characters)"
                      value={field.value || ""}
                      onChange={(e) => handleChange("titleEn", e.target.value)}
                      maxLength={50}
                      className="h-10 w-full text-base"
                    />
                  </FormControl>
                  <div className="text-base text-muted-foreground">
                    {titleEn.length}/50 characters
                  </div>
                  <FormMessage className="text-base" />
                </FormItem>
              )}
            />

            <FormField
              control={control}
              name="descriptionEn"
              rules={{
                required: "Please enter a description in English",
                // minLength: {
                //   value: 750,
                //   message: "Description must be at least 750 characters",
                // },
                maxLength: {
                  value: 2000,
                  message: "Description must not exceed 2000 characters",
                },
              }}
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel className="text-base font-medium flex items-center gap-1">
                    Description <span className="text-red-500">*</span>
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Enter description in English (750–2000 characters)"
                      className="min-h-[200px] w-full text-base"
                      value={field.value || ""}
                      onChange={(e) =>
                        handleChange("descriptionEn", e.target.value)
                      }
                    />
                  </FormControl>
                  <div className="text-base text-muted-foreground">
                    {descriptionEn.length}/2000 characters
                  </div>
                  <FormMessage className="text-base" />
                </FormItem>
              )}
            />
          </div>
        </TabsContent>

        <TabsContent value="arabic" className="mt-6">
          <div className="space-y-6">
            <FormField
              control={control}
              name="titleAr"
              rules={{
                minLength: {
                  value: 30,
                  message: "Title must be at least 30 characters",
                },
                maxLength: {
                  value: 50,
                  message: "Title must not exceed 50 characters",
                },
              }}
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel className="text-base font-medium">Title</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter title in Arabic (30–50 characters)"
                      value={field.value || ""}
                      onChange={(e) => handleChange("titleAr", e.target.value)}
                      maxLength={50}
                      dir="rtl"
                      className="h-10 w-full text-base"
                    />
                  </FormControl>
                  <div className="text-base text-muted-foreground">
                    {titleAr.length}/50 characters
                  </div>
                  <FormMessage className="text-base" />
                </FormItem>
              )}
            />

            <FormField
              control={control}
              name="descriptionAr"
              rules={{
                // minLength: {
                //   value: 750,
                //   message: "Description must be at least 750 characters",
                // },
                maxLength: {
                  value: 2000,
                  message: "Description must not exceed 2000 characters",
                },
              }}
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel className="text-base font-medium">
                    Description
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Enter description in Arabic (750–2000 characters)"
                      className="min-h-[200px] w-full text-base"
                      value={field.value || ""}
                      onChange={(e) =>
                        handleChange("descriptionAr", e.target.value)
                      }
                      dir="rtl"
                    />
                  </FormControl>
                  <div className="text-base text-muted-foreground">
                    {descriptionAr.length}/2000 characters
                  </div>
                  <FormMessage className="text-base" />
                </FormItem>
              )}
            />
          </div>
        </TabsContent>
      </Tabs>

      {/* MOJ Deed Location Description */}
      <FormField
        control={control}
        name="moj_deed_location_description"
        rules={{
          // minLength: {
          //   value: 200,
          //   message: "Description must be at least 200 characters",
          // },
          maxLength: {
            value: 1000,
            message: "Description must not exceed 1000 characters",
          },
        }}
        render={({ field }) => (
          <FormItem className="w-full">
            <FormLabel className="text-base font-medium flex items-center gap-1">
              MOJ Deed Location Description
            </FormLabel>
            <FormControl>
              <Textarea
                placeholder="Enter description in English (200–1000 characters)"
                className="min-h-[200px] w-full text-base"
                value={field.value || ""}
                onChange={(e) =>
                  handleChange("moj_deed_location_description", e.target.value)
                }
              />
            </FormControl>
            <div className="text-base text-muted-foreground">
              {moj_deed_location_description.length}/1000 characters
            </div>
            <FormMessage className="text-base" />
          </FormItem>
        )}
      />
    </div>
  );
};

export default Description;
