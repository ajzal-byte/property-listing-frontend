import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Edit } from "lucide-react";

const AdditionalNotes = ({ notes, onEdit, stepNumber = 4 }) => {
  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle>Additional Notes</CardTitle>
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
        <div className="bg-muted/50 rounded-lg p-4">
          <p className="whitespace-pre-line">{notes}</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default AdditionalNotes;
