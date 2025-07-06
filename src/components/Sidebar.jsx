import React, { useState, useMemo } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  CircleChevronLeft,
  CircleChevronRight,
  Home,
  Building2,
  Users,
  Calculator,
  BarChart3,
  GraduationCap,
  HeadphonesIcon,
  MapPin,
  HousePlus,
  User,
  Hand,
  LogOut,
  Settings,
  LaptopMinimalCheck,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Separator } from "@/components/ui/separator";

const NavLink = ({ link, isCollapsed, isActive, isChild, onClick }) => {
  const content = (
    <Button
      variant={isActive ? "secondary" : "ghost"}
      className={cn(
        "w-full justify-start h-10",
        isCollapsed ? "px-3" : "px-4",
        isChild && !isCollapsed && "pl-12"
      )}
      onClick={onClick}
    >
      <link.icon className="h-4 w-4 text-blue-500" />
      {!isCollapsed && <span className="ml-3">{link.label}</span>}
    </Button>
  );

  return isCollapsed ? (
    <TooltipProvider>
      <Tooltip delayDuration={0}>
        <TooltipTrigger asChild>{content}</TooltipTrigger>
        <TooltipContent side="right" className="flex items-center gap-4">
          {link.label}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  ) : (
    content
  );
};

const Sidebar = ({ isCollapsed, setIsCollapsed }) => {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const role = useMemo(
    () => JSON.parse(localStorage.getItem("userData") || "{}")?.role?.name,
    []
  );

  const menuConfig = useMemo(
    () => ({
      main: [
        {
          icon: Home,
          label: "Off plan",
          link: "/off-plan",
        },
        {
          icon: Calculator,
          label: "Mortgage",
          link: "/mortgage",
        },
        { icon: Users, label: "CRM", link: "/crm" },
        {
          icon: Building2,
          label: "Listings",
          link: "/secondary",
        },
        {
          icon: GraduationCap,
          label: "Academy",
          link: "/academy",
        },
        {
          roles: ["super_admin"],
          icon: BarChart3,
          label: "Analytics",
          link: "/analytics",
        },
        {
          roles: ["admin"],
          icon: LaptopMinimalCheck,
          label: "Manage Approvals",
          link: "/manage-approvals",
        },
        {
          roles: ["super_admin", "admin"],
          icon: Users,
          label: "Manage Users",
          link: "/manage-users",
        },
        // The new collapsible group
        {
          roles: ["super_admin"],
          icon: Settings,
          label: "Admin Settings",
          subItems: [
            {
              icon: Building2,
              label: "Manage Companies",
              link: "/manage-companies",
            },
            {
              icon: HousePlus,
              label: "Manage Developers",
              link: "/developers",
            },
            {
              icon: MapPin,
              label: "Manage Locations",
              link: "/locations",
            },
            {
              icon: Hand,
              label: "Manage Permissions",
              link: "/permissions",
            },
          ],
        },
      ],
      bottom: [
        {
          icon: HeadphonesIcon,
          label: "Support",
          link: "https://vortexwebclouds.bitrix24.in/marketplace/app/245/",
          isExternal: true,
        },
        { icon: Building2, label: "My Company", link: "/company" },
        { icon: User, label: "Profile", link: "/profile" },
        { icon: LogOut, label: "Log Out", action: "logout" },
      ],
    }),
    []
  );

  // Filter menu based on role
  const filterMenuByRole = (items) =>
    items.filter((item) => !item.roles || item.roles.includes(role));

  const mainMenuItems = filterMenuByRole(menuConfig.main);
  const bottomMenuItems = menuConfig.bottom;

  // Check if the current path or any sub-item path is active
  const isLinkActive = (item) => {
    if (item.subItems) {
      return item.subItems.some((sub) => pathname.startsWith(sub.link));
    }
    return pathname.startsWith(item.link);
  };

  // State for the collapsible group
  const [isSettingsOpen, setIsSettingsOpen] = useState(
    mainMenuItems.some((item) => item.subItems && isLinkActive(item))
  );

  const handleLinkClick = (item) => {
    if (item.action === "logout") {
      localStorage.removeItem("authToken");
      localStorage.removeItem("userData");
      window.location.href = "/login"; // Redirect to login
    } else if (item.isExternal) {
      window.open(item.link, "_blank", "noopener,noreferrer");
    } else {
      navigate(item.link);
    }
  };

  const renderNavLinks = (items) => {
    return items.map((item, index) => {
      if (item.subItems) {
        // Render Collapsible Group
        return (
          <Collapsible
            key={`${item.label}-${index}`}
            open={isSettingsOpen}
            onOpenChange={setIsSettingsOpen}
            className="w-full"
          >
            <CollapsibleTrigger asChild>
              <Button
                variant={isLinkActive(item) ? "secondary" : "ghost"}
                className={cn(
                  "w-full justify-start h-10",
                  isCollapsed ? "px-3" : "px-4"
                )}
              >
                <item.icon className="h-4 w-4 text-blue-500" />
                {!isCollapsed && (
                  <>
                    <span className="ml-3">{item.label}</span>
                    <CircleChevronRight
                      className={cn(
                        "ml-auto h-4 w-4 transition-transform duration-200",
                        isSettingsOpen && "rotate-90"
                      )}
                    />
                  </>
                )}
              </Button>
            </CollapsibleTrigger>
            <CollapsibleContent className="space-y-1 py-1">
              {item.subItems.map((subItem) => (
                <NavLink
                  key={subItem.link}
                  link={subItem}
                  isCollapsed={isCollapsed}
                  isActive={pathname.startsWith(subItem.link)}
                  isChild={true}
                  onClick={() => handleLinkClick(subItem)}
                />
              ))}
            </CollapsibleContent>
          </Collapsible>
        );
      }
      // Render a regular link
      return (
        <NavLink
          key={item.link || item.label}
          link={item}
          isCollapsed={isCollapsed}
          isActive={isLinkActive(item)}
          onClick={() => handleLinkClick(item)}
        />
      );
    });
  };

  return (
    <div
      className={cn(
        "fixed left-0 top-0 h-screen border-r bg-background z-50 flex flex-col transition-all duration-300 ease-in-out",
        isCollapsed ? "w-20" : "w-62",
        "shadow-lg"
      )}
    >
      {/* Header */}
      <div
        className={cn(
          "flex items-center p-4 h-16",
          isCollapsed ? "justify-center" : "justify-between"
        )}
      >
        {!isCollapsed && (
          <div className="flex items-center gap-2">
            <img src="/user.png" alt="Logo" className="h-8 w-8" />
            <span className="text-lg font-semibold">Property Listing</span>
          </div>
        )}
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8"
          onClick={() => setIsCollapsed(!isCollapsed)}
        >
          {isCollapsed ? (
            <CircleChevronRight className="h-4 w-4" />
          ) : (
            <CircleChevronLeft className="h-4 w-4" />
          )}
        </Button>
      </div>

      {/* Main Menu */}
      <div className="flex-grow overflow-y-auto px-2 space-y-1">
        {renderNavLinks(mainMenuItems)}
      </div>

      {/* Bottom Menu */}
      <div className="p-2">
        <Separator className="my-2" />
        <div className="space-y-1 px-2">{renderNavLinks(bottomMenuItems)}</div>
      </div>
    </div>
  );
};

export default Sidebar;
