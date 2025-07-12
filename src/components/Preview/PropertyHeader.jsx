import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Edit } from "lucide-react";

const PropertyHeader = ({
  category,
  price,
  amountType,
  titleEn,
  title_deed,
  descriptionEn,
  onEdit,
  formatPrice,
  showEdit = true,
}) => {
  return (
    <div className="space-y-8 mt-4">
      {/* Pricing Section */}
      <div className="mb-4">
        <h1 className="text-3xl font-bold">
          AED {price}
          {amountType?.toLowerCase() == "sale"
            ? ""
            : ` / ${amountType?.toLowerCase()}`}
        </h1>
      </div>

      {/* Title & Description Section */}
      <div className="space-y-4">
        <div>
          <div className="flex justify-between items-start">
            <h2 className="text-4xl font-semibold tracking-tight">{titleEn}</h2>
            {showEdit && (
              <Button variant="ghost" size="icon" onClick={() => onEdit(0)}>
                <Edit className="h-4 w-4" />
              </Button>
            )}
          </div>
          <p className="text-sm font-extrabold text-muted-foreground mt-2 mb-2">
            Category: {category.toUpperCase()}
          </p>
          {title_deed && (
            <p className="text-sm text-muted-foreground">
              Title Deed: {title_deed}
            </p>
          )}
        </div>

        <div>
          <p className="text-sm line-clamp-3">{descriptionEn}</p>
        </div>

        <Dialog>
          <DialogTrigger asChild>
            <Button variant="outline">See Full Description</Button>
          </DialogTrigger>
          <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{titleEn}</DialogTitle>
              {title_deed && (
                <DialogDescription>Title Deed: {title_deed}</DialogDescription>
              )}
            </DialogHeader>
            <p className="whitespace-pre-line text-sm">{descriptionEn}</p>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default PropertyHeader;
