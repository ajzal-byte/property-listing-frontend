import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Edit, Mail, Phone, User } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { DetailItem } from "./DetailItem";

const ContactCard = ({
  profileUrl,
  name,
  reraNumber,
  email,
  phone,
  onEdit,
  stepNumber,
  showEdit = true,
}) => {
  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle>Contact Info</CardTitle>
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
      <CardContent>
        <div className="flex items-center gap-4 mb-4">
          <Avatar className="h-16 w-16">
            <AvatarImage src={profileUrl} alt={name || "Listing Agent"} />
            <AvatarFallback>
              <User className="h-8 w-8" />
            </AvatarFallback>
          </Avatar>
          <div>
            <h3 className="font-semibold">{name}</h3>
            <p className="text-muted-foreground text-sm">
              BRN: {reraNumber || "Not specified"}
            </p>
          </div>
        </div>

        <div className="space-y-3">
          <DetailItem
            label="Email"
            value={email}
            icon={<Mail className="w-4 h-4" />}
          />
          <DetailItem
            label="Phone"
            value={phone}
            icon={<Phone className="w-4 h-4" />}
          />
        </div>

        <div className="flex gap-2 mt-4">
          <Button
            variant="outline"
            className="flex-1"
            disabled={!phone}
            asChild
          >
            <a href={`tel:${phone}`} target="_blank" rel="noopener noreferrer">
              <Phone className="mr-2 h-4 w-4" /> Call
            </a>
          </Button>
          <Button
            variant="outline"
            className="flex-1"
            disabled={!email}
            asChild
          >
            <a
              href={`mailto:${email}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Mail className="mr-2 h-4 w-4" /> Email
            </a>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ContactCard;
