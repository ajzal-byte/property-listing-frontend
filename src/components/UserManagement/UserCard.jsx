import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Mail, Phone, User } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import EditUserDialog from "./EditUserDialog";

const UserCard = ({ onUserUpdated, ...user }) => {
  return (
    <Card key={user.id} className="mb-4 hover:shadow-lg transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <Avatar className="h-10 w-10">
              <AvatarImage src={user.profile_url} alt={user.name} />
              <AvatarFallback>
                {user.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </AvatarFallback>
            </Avatar>
            <div>
              <CardTitle className="text-lg">{user.name}</CardTitle>
              <Badge variant="outline" className="mt-1">
                {user.role?.name.toUpperCase()}
              </Badge>
            </div>
          </div>
          <EditUserDialog user={user} onUserUpdated={onUserUpdated} />
        </div>
      </CardHeader>
      <CardContent className="grid gap-2">
        <div className="flex items-center space-x-2">
          <Mail className="h-4 w-4 text-muted-foreground" />
          <span>{user.email}</span>
        </div>
        {user.phone && (
          <div className="flex items-center space-x-2">
            <Phone className="h-4 w-4 text-muted-foreground" />
            <span>{user.phone}</span>
          </div>
        )}
        {user.rera_number && (
          <div className="flex items-center space-x-2">
            <User className="h-4 w-4 text-muted-foreground" />
            <span>RERA: {user.rera_number}</span>
          </div>
        )}
      </CardContent>
      <CardFooter className="flex space-x-2">
        {user.phone && (
          <Button variant="outline" size="sm" asChild>
            <a href={`tel:${user.phone}`} target="_blank">
              <Phone className="mr-2 h-4 w-4" /> Call
            </a>
          </Button>
        )}
        <Button variant="outline" size="sm" asChild>
          <a href={`mailto:${user.email}`} target="_blank">
            <Mail className="mr-2 h-4 w-4" /> Email
          </a>
        </Button>
      </CardFooter>
    </Card>
  );
};

export default UserCard;
