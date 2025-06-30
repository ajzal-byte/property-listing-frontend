// components/PublishingInfoCard.jsx
import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Check, Edit, Globe, X } from "lucide-react";

const PlatformBox = ({
  enabled,
  title,
  icon,
  description,
  children,
  borderColor,
  bgColor,
}) => (
  <div
    className={`border rounded-lg p-4 ${
      enabled ? `${borderColor} ${bgColor}` : "bg-muted/50"
    }`}
  >
    <div className="flex items-center mb-3">
      <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-2 mr-3">
        <div
          className={`w-8 h-8 rounded flex items-center justify-center ${icon.bg}`}
        >
          {icon.content}
        </div>
      </div>
      <h3 className="font-semibold">{title}</h3>
      <div className="ml-auto">
        {enabled ? (
          <Check className="h-5 w-5 text-green-500" />
        ) : (
          <X className="h-5 w-5 text-red-500" />
        )}
      </div>
    </div>
    <p className="text-sm text-muted-foreground">{description}</p>
    {enabled && children}
  </div>
);

const PublishingInfoCard = ({ formData, goToStep, showEdit = true }) => {
  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle>Publishing Information</CardTitle>
          {showEdit && (
            <Button variant="ghost" size="icon" onClick={() => goToStep(3)}>
              <Edit className="h-4 w-4" />
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Property Finder */}
          <PlatformBox
            enabled={formData.publishPF}
            title="Property Finder"
            icon={{
              content: (
                <img
                  src="/pf-logo.png"
                  alt="Property Finder"
                  className="w-6 h-6 object-contain"
                />
              ),
            }}
            description={
              formData.publishPF
                ? "This property will be published on Property Finder"
                : "Not publishing on Property Finder"
            }
            borderColor="border-blue-500"
            bgColor="bg-blue-50 dark:bg-blue-900/20"
          />

          {/* Bayut */}
          <PlatformBox
            enabled={formData.publishBayutPlatform}
            title="Bayut"
            icon={{
              content: (
                <img
                  src="/bayut-logo.png"
                  alt="Bayut"
                  className="w-6 h-6 object-contain"
                />
              ),
            }}
            description={
              formData.publishBayutPlatform
                ? "Bayut group platforms selected below"
                : "Not publishing on Bayut"
            }
            borderColor="border-orange-500"
            bgColor="bg-orange-50 dark:bg-orange-900/20"
          >
            <div className="mt-3 space-y-2">
              <div className="flex items-center">
                <Checkbox
                  id="bayut-platform"
                  checked={formData.publishBayut}
                  disabled
                  className="mr-2"
                />
                <label htmlFor="bayut-platform" className="text-sm">
                  Bayut
                </label>
              </div>
              <div className="flex items-center">
                <Checkbox
                  id="dubizzle"
                  checked={formData.publishDubizzle}
                  disabled
                  className="mr-2"
                />
                <label htmlFor="dubizzle" className="text-sm">
                  Dubizzle
                </label>
              </div>
            </div>
          </PlatformBox>

          {/* Website */}
          <PlatformBox
            enabled={formData.publishWebsite}
            title="Website"
            icon={{
              bg: "bg-purple-600",
              content: <Globe className="text-white w-4 h-4" />,
            }}
            description={
              formData.publishWebsite
                ? "This property will be published on your website"
                : "Not publishing on website"
            }
            borderColor="border-purple-500"
            bgColor="bg-purple-50 dark:bg-purple-900/20"
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default PublishingInfoCard;
