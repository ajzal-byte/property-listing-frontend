import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Building2, Edit, Globe, Mail, Phone, Users } from "lucide-react";
import EditCompanyDialog from "./EditCompany";

export const CompanyCard = ({ company, handleRefresh }) => {
  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader className="pb-4">
        <div className="flex justify-between items-start">
          <div className="flex items-center space-x-4">
            {company.logo_url ? (
              <Avatar className="h-12 w-12">
                <AvatarImage
                  src={company.logo_url}
                  alt={`${company.name} logo`}
                />
                <AvatarFallback>
                  <Building2 className="h-6 w-6" />
                </AvatarFallback>
              </Avatar>
            ) : (
              <Avatar className="h-12 w-12">
                <AvatarFallback className="bg-blue-100 text-blue-600">
                  <Building2 className="h-6 w-6" />
                </AvatarFallback>
              </Avatar>
            )}
            <div>
              <CardTitle className="text-lg">{company.name}</CardTitle>
              <div className="flex items-center mt-1 space-x-2">
                <Badge variant="outline" className="text-sm">
                  {company.users?.length || 0} Users
                  <Users className="inline h-4 w-4 ml-1" />
                </Badge>
              </div>
            </div>
          </div>
          <EditCompanyDialog company={company} onSuccess={handleRefresh} />
        </div>
      </CardHeader>

      <CardContent className="grid gap-3">
        <div className="flex items-center space-x-2 text-sm">
          <Mail className="h-4 w-4 text-muted-foreground" />
          <a href={`mailto:${company.email}`} className="hover:underline">
            {company.email}
          </a>
        </div>

        <div className="flex items-center space-x-2 text-sm">
          <Phone className="h-4 w-4 text-muted-foreground" />
          <span>{company.phone}</span>
        </div>

        {company.website && (
          <div className="flex items-center space-x-2 text-sm">
            <Globe className="h-4 w-4 text-muted-foreground" />
            <a
              href={company.website}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:underline truncate"
            >
              {company.website}
            </a>
          </div>
        )}
      </CardContent>

      <CardFooter className="border-t pt-4">
        <div className="w-full">
          <h4 className="text-sm font-medium mb-2">Team Members</h4>
          <div className="flex flex-wrap gap-2">
            {company.admin_users?.map((admin) => (
              <Badge key={admin.id} variant="secondary" className="px-3 py-1">
                <span className="font-medium mr-1">Admin:</span>
                {admin.name}
              </Badge>
            ))}
            {company.users
              ?.filter((user) => user.role.name !== "admin")
              .map((user) => (
                <Badge key={user.id} variant="outline" className="px-3 py-1">
                  <span className="capitalize mr-1">{user.role.name}:</span>
                  {user.name}
                </Badge>
              ))}
          </div>
        </div>
      </CardFooter>
    </Card>
  );
};
