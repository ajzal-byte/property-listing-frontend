import React from "react";
import { Button } from "@/components/ui/button";
import { Edit } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

const ImageGallery = ({
  photos,
  goToStep,
  watermark,
  showEdit = true,
  publishingStatus,
  renderStatusBadge,
}) => {
  const [carouselOpen, setCarouselOpen] = React.useState(false);
  const photoCount = photos?.length || 0;

  if (photoCount === 0) return null;

  return (
    <div className="space-y-4">
      {/* Section Header */}
      {showEdit && (
        <div className="flex justify-between items-center">
          <h3 className="text-2xl font-semibold tracking-tight">Photos</h3>
          <Button variant="ghost" size="icon" onClick={() => goToStep(1)}>
            <Edit className="h-4 w-4" />
          </Button>
        </div>
      )}

      {/* --- Responsive Image Gallery Grid --- */}
      <div
        className="group w-full cursor-pointer"
        onClick={() => setCarouselOpen(true)}
      >
        {/* Layout for 3 or more photos */}
        {photoCount >= 3 && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
            {/* Primary Image (Left) */}
            <div className="relative md:col-span-2 aspect-video rounded-lg overflow-hidden">
              <img
                src={photos[0]}
                alt="Primary property view"
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
              />
              {/* Badges Overlay */}
              <div className="absolute top-2 left-2 flex flex-wrap gap-2">
                {showEdit && watermark == 1 && (
                  // TODO: Can be replaced with availability status
                  <Badge>Watermark Applied</Badge>
                )}
                {publishingStatus && renderStatusBadge(publishingStatus)}
              </div>
            </div>
            <div className="hidden md:grid grid-rows-2 gap-2">
              {/* Top Thumbnail */}
              <div className="aspect-video rounded-lg overflow-hidden group">
                <img
                  src={photos[1]}
                  alt="Secondary property view"
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
              </div>
              {/* Bottom Thumbnail (with conditional overlay) */}
              <div className="relative aspect-video rounded-lg overflow-hidden group">
                <img
                  src={photos[2]}
                  alt="Third property view"
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
                {photoCount > 3 && (
                  <div className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <p className="text-white font-bold text-xl">
                      + {photoCount - 3} more
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Layout for 2 photos */}
        {photoCount === 2 && (
          <div className="h-80 grid grid-cols-2 gap-2">
            <div className="rounded-lg overflow-hidden">
              <img
                src={photos[0]}
                alt="Property view 1"
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
              />
            </div>
            <div className="rounded-lg overflow-hidden">
              <img
                src={photos[1]}
                alt="Property view 2"
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
              />
            </div>
          </div>
        )}

        {/* Layout for 1 photo */}
        {photoCount === 1 && (
          <div className="h-96 rounded-lg overflow-hidden">
            <img
              src={photos[0]}
              alt="Property view"
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
          </div>
        )}
      </div>
      {/* --- Image Carousel Dialog (Lightbox) --- */}
      <Dialog open={carouselOpen} onOpenChange={setCarouselOpen}>
        <DialogContent className="max-w-screen-xl w-full h-full md:w-auto md:h-auto p-0 border-0">
          <Carousel className="w-full h-full">
            <CarouselContent>
              {photos.map((url, idx) => (
                <CarouselItem key={idx}>
                  <div className="flex items-center justify-center w-full h-screen md:h-[90vh]">
                    <img
                      src={url}
                      alt={`Property image ${idx + 1}`}
                      className="w-full h-full object-contain" // Switched to contain to prevent cropping inside the lightbox
                    />
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="ml-4 md:ml-16" />
            <CarouselNext className="mr-4 md:mr-16" />
          </Carousel>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ImageGallery;
