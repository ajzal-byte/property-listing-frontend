import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Edit, LinkIcon, Paperclip } from "lucide-react";

const LinksCard = ({ floorPlanUrls, documents, onEdit, stepNumber, showEdit = true }) => {
  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle className="flex items-center">
            <LinkIcon className="mr-2 h-5 w-5" />
            Links & Documents
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
      <CardContent className="space-y-4">
        <div>
          <h4 className="text-sm font-medium text-muted-foreground mb-2">
            Floor Plans
          </h4>
          {floorPlanUrls?.length > 0 ? (
            floorPlanUrls.map((url, idx) => (
              <a
                key={idx}
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center text-blue-500 hover:underline text-sm truncate"
              >
                <Paperclip className="h-3 w-3 mr-1" />
                Floor Plan {idx + 1}
              </a>
            ))
          ) : (
            <p className="text-muted-foreground">No floor plans</p>
          )}
        </div>

        <div>
          <h4 className="text-sm font-medium text-muted-foreground mb-2">
            Documents
          </h4>
          {documents?.length > 0 ? (
            documents.map((doc, idx) => (
              <a
                key={idx}
                href={doc.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center text-blue-600 hover:underline truncate"
              >
                <Paperclip className="h-3 w-3 mr-1" />
                {doc.name || `Document ${idx + 1}`}
              </a>
            ))
          ) : (
            <p className="text-muted-foreground">No documents</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default LinksCard;
