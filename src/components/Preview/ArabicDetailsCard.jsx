import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Edit } from "lucide-react";

const ArabicDetailsCard = ({ titleAr, descriptionAr, onEdit, stepNumber }) => {
  if (!titleAr && !descriptionAr) return null;

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle>Arabic Details</CardTitle>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onEdit(stepNumber)}
          >
            <Edit className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {titleAr && (
          <div className="mb-4">
            <h4 className="text-sm font-medium text-muted-foreground">
              Title (Arabic)
            </h4>
            <p className="font-medium text-lg">{titleAr}</p>
          </div>
        )}

        {descriptionAr && (
          <div>
            <h4 className="text-sm font-medium text-muted-foreground">
              Description (Arabic)
            </h4>
            <p className="line-clamp-3 mb-4">{descriptionAr}</p>
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline">See Full Description</Button>
              </DialogTrigger>
              <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>{titleAr}</DialogTitle>
                </DialogHeader>
                <p className="whitespace-pre-line text-right">
                  {descriptionAr}
                </p>
              </DialogContent>
            </Dialog>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ArabicDetailsCard;
