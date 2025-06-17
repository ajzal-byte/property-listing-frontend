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
}) => {
  const hasMapCoordinates =
    (formData?.property_finder_latitude || formData?.bayut_latitude) &&
    (formData?.property_finder_longitude || formData?.bayut_longitude);

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle className="flex items-center">
            <MapPin className="mr-2 h-5 w-5" />
            Location
          </CardTitle>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onEdit(stepNumber)}
          >
            <Edit className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Property Finder Location */}
          <div className="border-r pr-4">
            <h3 className="font-semibold mb-3">Property Finder</h3>
            <div className="space-y-2">
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
              <DetailItem
                label="Latitude"
                value={formData.property_finder_latitude}
              />
              <DetailItem
                label="Longitude"
                value={formData.property_finder_longitude}
              />
            </div>
          </div>

          {/* Bayut Location */}
          <div className="pl-4">
            <h3 className="font-semibold mb-3">Bayut</h3>
            <div className="space-y-2">
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
              <DetailItem label="Latitude" value={formData.bayut_latitude} />
              <DetailItem label="Longitude" value={formData.bayut_longitude} />
            </div>
          </div>
        </div>

        {/* Map Section */}
        {hasMapCoordinates ? (
          <div className="mt-6 h-64 rounded-lg overflow-hidden">
            <iframe
              className="w-full h-full border-0"
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              src={`https://maps.google.com/maps?q=${encodeURIComponent(
                formData?.property_finder_latitude || formData?.bayut_latitude
              )},${encodeURIComponent(
                formData?.property_finder_longitude || formData?.bayut_longitude
              )}&hl=en&z=14&output=embed`}
            ></iframe>
          </div>
        ) : (
          <div className="mt-6 text-gray-500 text-center">
            Map not available. Please provide longitude and latitude.
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default LocationCard;
