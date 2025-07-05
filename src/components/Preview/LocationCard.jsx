import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Edit, MapPin } from "lucide-react";
import { DetailItem } from "./DetailItem";

const LocationCard = ({
  pfLocationDetails,
  bayutLocationDetails,
  formData,
  onEdit,
  stepNumber,
  showEdit = true,
}) => {
  const hasMapCoordinates = formData?.latitude && formData?.longitude;

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle className="flex items-center">
            <MapPin className="mr-2 h-5 w-5" />
            Location
          </CardTitle>
          {showEdit && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onEdit(stepNumber)}
            >
              <Edit className="h-4 w-4" />
            </Button>
          )}
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Main grid for PF and Bayut sections */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-8 gap-y-6">
          {/* Property Finder Location */}
          <div className="space-y-3">
            <h3 className="font-semibold border-b pb-2">Property Finder</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-3 pt-2">
              <DetailItem
                label="City"
                value={pfLocationDetails?.city || formData.property_finder_city}
              />
              <DetailItem
                label="Community"
                value={
                  pfLocationDetails?.community ||
                  formData.property_finder_community
                }
              />
              <DetailItem
                label="Sub Community"
                value={
                  pfLocationDetails?.sub_community ||
                  formData.property_finder_sub_community
                }
              />
              <DetailItem
                label="Tower/Building"
                value={
                  pfLocationDetails?.building || formData.property_finder_tower
                }
              />
            </div>
          </div>

          {/* Bayut Location */}
          <div className="space-y-3 border-l pl-4 sm:pl-6">
            <h3 className="font-semibold border-b pb-2">Bayut</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-3 pt-2">
              <DetailItem
                label="City"
                value={bayutLocationDetails?.city || formData.bayut_city}
              />
              <DetailItem
                label="Community"
                value={
                  bayutLocationDetails?.community || formData.bayut_community
                }
              />
              <DetailItem
                label="Sub Community"
                value={
                  bayutLocationDetails?.sub_community ||
                  formData.bayut_sub_community
                }
              />
              <DetailItem
                label="Tower/Building"
                value={bayutLocationDetails?.building || formData.bayut_tower}
              />
            </div>
          </div>
        </div>

        {/* Shared Latitude & Longitude */}
        <div className="flex flex-col sm:flex-row gap-6 border-t pt-4">
          <DetailItem label="Latitude" value={formData.latitude} />
          <DetailItem label="Longitude" value={formData.longitude} />
        </div>

        {/* Map Section */}
        {hasMapCoordinates ? (
          <div className="mt-4 h-64 rounded-lg overflow-hidden border">
            <iframe
              title="Location Map"
              className="w-full h-full border-0"
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              src={`https://maps.google.com/maps?q=${encodeURIComponent(
                formData.latitude
              )},${encodeURIComponent(
                formData.longitude
              )}&hl=en&z=14&output=embed`}
            ></iframe>
          </div>
        ) : (
          <div className="mt-6 text-muted-foreground text-center py-10 border rounded-lg">
            Map not available. Please provide longitude and latitude.
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default LocationCard;
