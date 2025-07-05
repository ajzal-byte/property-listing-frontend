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
  const { control, setValue, trigger, getValues } = useFormContext();

  const handleChange = (name, value) => {
    setValue(name, value);
    setField(name, value);
    trigger(name);
  };

  return (
    <div className="space-y-6">
      <div className="border-b pb-4">
        <h2 className="text-xl font-semibold">Property Description</h2>
        <p className="text-muted-foreground text-sm">
          Enter title and description for your property listing.
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="english">English</TabsTrigger>
          <TabsTrigger value="arabic">Arabic</TabsTrigger>
        </TabsList>

        <TabsContent value="english" className="mt-6">
          <div className="space-y-4">
            <FormField
              control={control}
              name="titleEn"
              rules={{ required: "Title is required." }}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-1">
                    Title <span className="text-red-500">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter title in English"
                      value={field.value}
                      onChange={(e) => handleChange("titleEn", e.target.value)}
                      onBlur={() => trigger("titleEn")}
                      maxLength={50}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={control}
              name="descriptionEn"
              rules={{ required: "Description is required." }}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-1">
                    Description <span className="text-red-500">*</span>
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Enter description in English"
                      className="min-h-[200px]"
                      value={field.value}
                      onChange={(e) =>
                        handleChange("descriptionEn", e.target.value)
                      }
                      onBlur={() => trigger("descriptionEn")}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </TabsContent>

        <TabsContent value="arabic" className="mt-6">
          <div className="space-y-4">
            <FormField
              control={control}
              name="titleAr"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter title in Arabic"
                      value={field.value}
                      onChange={(e) => handleChange("titleAr", e.target.value)}
                      onBlur={() => trigger("titleAr")}
                      maxLength={50}
                      dir="rtl"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={control}
              name="descriptionAr"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Enter description in Arabic"
                      className="min-h-[200px]"
                      value={field.value}
                      onChange={(e) =>
                        handleChange("descriptionAr", e.target.value)
                      }
                      onBlur={() => trigger("descriptionAr")}
                      dir="rtl"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Description;
