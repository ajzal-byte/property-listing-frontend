// components/DetailCard.jsx
import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { DetailItem, DetailItemWithLink } from "./DetailItem";
import { Edit } from "lucide-react";

const DetailCard = ({
  title,
  icon: Icon,
  items,
  badges,
  onEdit,
  cols = 2,
  stepNumber,
  children,
}) => {
  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle className="flex items-center">
            {Icon && <Icon className="mr-2 h-5 w-5" />}
            {title}
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
      <CardContent
        className={
          !badges && !children ? `grid grid-cols-${cols} gap-4` : "space-y-4"
        }
      >
        {/* Render badges if provided */}
        {badges && (
          <div className="flex flex-wrap gap-2">
            {badges.length > 0 ? (
              badges.map((name, idx) => (
                <Badge key={idx} variant="secondary">
                  {name}
                </Badge>
              ))
            ) : (
              <p className="text-muted-foreground">No {title.toLowerCase()}</p>
            )}
          </div>
        )}

        {/* Render items if provided */}
        {items?.map((item, index) => {
          if (item.useLinkComponent) {
            return (
              <DetailItemWithLink
                key={index}
                label={item.label}
                value={item.value}
              />
            );
          }
          return (
            <DetailItem
              key={index}
              label={item.label}
              value={item.value}
              icon={item.icon}
              isLink={item.isLink}
            />
          );
        })}

        {/* Render children if provided */}
        {children}
      </CardContent>
    </Card>
  );
};

export default DetailCard;
