import { useMemo } from "react";
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
  FileStack,
  HeadphonesIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  TooltipProvider,
} from "@/components/ui/tooltip";
import { Separator } from "@/components/ui/separator";

const MenuItem = ({
  icon: Icon,
  label,
  link,
  isCollapsed,
  isActive,
  onClick,
}) => {
  const content = (
    <Button
      variant={isActive ? "secondary" : "ghost"}
      className={`w-full justify-start ${isCollapsed ? "px-3" : "px-4"}`}
      onClick={onClick}
    >
      <Icon className="h-4 w-4 text-blue-500" />
      {!isCollapsed && <span className="ml-3">{label}</span>}
    </Button>
  );

  return isCollapsed ? (
    <TooltipProvider>
      <Tooltip delayDuration={0}>
        <TooltipTrigger asChild>{content}</TooltipTrigger>
        <TooltipContent side="right" className="flex items-center gap-4">
          {label}
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

  // Build your menu arrays (with `.link`)
  const role = JSON.parse(localStorage.getItem("userData") || "{}")?.role?.name;
  const mainMenuItems = [
    { icon: Home, label: "Off plan", link: "/off-plan" },
    { icon: Building2, label: "Secondary", link: "/secondary" },
    { icon: GraduationCap, label: "Academy", link: "/academy" },
    { icon: Users, label: "CRM", link: "/crm" },
    { icon: Calculator, label: "Mortgage", link: "/mortgage" },
    { icon: BarChart3, label: "Analytics", link: "/analytics" },
    { icon: FileStack, label: "Pricing", link: "/pricing" },
    ...(role === "super_admin" || role === "admin"
      ? [{ icon: Users, label: "Manage Users", link: "/manage-users" }]
      : []),
    ...(role === "super_admin"
      ? [
          {
            icon: Building2,
            label: "Manage Companies",
            link: "/manage-companies",
          },
        ]
      : []),
  ];

  const bottomMenuItems = [
    { icon: HeadphonesIcon, label: "Support", link: "/support" },
  ];

  // Derive active label by matching the current pathname.
  const activeLabel = useMemo(() => {
    // find the first menu item whose link equals or is a prefix of the pathname
    const match = [...mainMenuItems, ...bottomMenuItems].find((item) =>
      pathname === item.link
        ? true
        : // if you want prefix-based (e.g. nested routes)
          pathname.startsWith(item.link + "/")
    ) || { label: "" };
    return match.label;
  }, [pathname, mainMenuItems, bottomMenuItems]);

  const renderSection = (items) => (
    <div className="space-y-1 px-2 py-2">
      {items.map((item) => (
        <MenuItem
          key={item.link}
          icon={item.icon}
          label={item.label}
          link={item.link}
          isCollapsed={isCollapsed}
          isActive={activeLabel === item.label}
          onClick={() => navigate(item.link)}
        />
      ))}
    </div>
  );

  return (
    <div
      className={`fixed left-0 top-0 h-screen bg-background border-r transition-all duration-300 ease-in-out flex flex-col z-[999]
        ${isCollapsed ? "w-16" : "w-60"}
      `}
    >
      {/* Header */}
      <div
        className={`flex items-center p-4 ${
          isCollapsed ? "justify-center" : "justify-between"
        }`}
      >
        {!isCollapsed && (
          <div className="flex items-center">
            <img src="user.png" alt="User" className="h-8 w-8 rounded-full" />
            <span className="ml-2 text-sm font-medium">Property Listing</span>
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
      <div className="flex-grow">{renderSection(mainMenuItems)}</div>

      {/* Bottom Menu */}
      <div className="p-2">
        <Separator className="mb-2" />
        {renderSection(bottomMenuItems)}
      </div>
    </div>
  );
};

export default Sidebar;
