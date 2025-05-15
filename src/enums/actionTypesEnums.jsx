// import { Upload, ChevronRight, Download, Archive, Trash2, ArrowLeftRight } from "lucide-react";

// export const ActionTypes = {
//   TRANSFER:{
//     AGENT: { type: "TRANSFER_AGENT", action_field: "transfer_agent" },
//     OWNER : { type: "TRANSFER_OWNER", action_field: "transfer_owner" }
//   },
//   PUBLISH: {
//     ALL: { type: "PUBLISH_ALL", action_field: "publish_all" },
//     PF: { type: "PUBLISH_PF", action_field: "publish_pf" },
//     BAYUT: { type: "PUBLISH_BAYUT", action_field: "publish_bayut" },
//     DUBIZZLE: { type: "PUBLISH_DUBIZZLE", action_field: "publish_dubizzle" },
//     WEBSITE: { type: "PUBLISH_WEBSITE", action_field: "publish_website" },
//   },
//   UNPUBLISH: {
//     ALL: { type: "UNPUBLISH_ALL", action_field: "unpublish_all" },
//     PF: { type: "UNPUBLISH_PF", action_field: "unpublish_pf" },
//     BAYUT: { type: "UNPUBLISH_BAYUT", action_field: "unpublish_bayut" },
//     DUBIZZLE: {
//       type: "UNPUBLISH_DUBIZZLE",
//       action_field: "unpublish_dubizzle",
//     },
//     WEBSITE: { type: "UNPUBLISH_WEBSITE", action_field: "unpublish_website" },
//   },
//   REMOVE: {
//     ARCHIVE: { type: "ARCHIVE", action_field: "archived" },
//     DELETE: { type: "DELETE", action_field: "deleted" },
//   },
// };

// export const actionSections = [
//   {
//     title: "Transfer",
//     actions: Object.values(ActionTypes.TRANSFER),
//     icon: (type) => <ArrowLeftRight className="h-4 w-4 mr-2 text-blue-600" />,
//     textColor: "text-gray-700",
//     hoverBg: "hover:bg-blue-50",
//   },
//   {
//     title: "Publish",
//     actions: Object.values(ActionTypes.PUBLISH),
//     icon: (type) =>
//       type === "PUBLISH_ALL" ? (
//         <Upload className="h-4 w-4 mr-2 text-blue-600" />
//       ) : (
//         <ChevronRight className="h-4 w-4 mr-2 text-blue-600" />
//       ),
//     textColor: "text-gray-700",
//     hoverBg: "hover:bg-blue-50",
//   },
//   {
//     title: "Unpublish",
//     actions: Object.values(ActionTypes.UNPUBLISH),
//     icon: (type) =>
//       type === "UNPUBLISH_ALL" ? (
//         <Download className="h-4 w-4 mr-2 text-amber-600" />
//       ) : (
//         <ChevronRight className="h-4 w-4 mr-2 text-amber-600" />
//       ),
//     textColor: "text-gray-700",
//     hoverBg: "hover:bg-blue-50",
//   },
//   {
//     title: "Remove",
//     actions: Object.values(ActionTypes.REMOVE),
//     icon: (type) =>
//       type === "ARCHIVE" ? (
//         <Archive className="h-4 w-4 mr-2 text-gray-600" />
//       ) : (
//         <Trash2 className="h-4 w-4 mr-2 text-red-600" />
//       ),
//     textColor: (type) => (type === "DELETE" ? "text-red-600" : "text-gray-700"),
//     hoverBg: (type) =>
//       type === "DELETE" ? "hover:bg-red-50" : "hover:bg-blue-50",
//   },
// ];


import { Upload, ChevronRight, Download, Archive, Trash2, ArrowLeftRight } from "lucide-react";

export const ActionTypes = {
  TRANSFER: {
    AGENT: { type: "TRANSFER_AGENT", action_field: "transfer_agent" },
    OWNER: { type: "TRANSFER_OWNER", action_field: "transfer_owner" }
  },
  PUBLISH: {
    ALL: { type: "PUBLISH_ALL", action_field: "publish_all" },
    PF: { type: "PUBLISH_PF", action_field: "publish_pf" },
    BAYUT: { type: "PUBLISH_BAYUT", action_field: "publish_bayut" },
    DUBIZZLE: { type: "PUBLISH_DUBIZZLE", action_field: "publish_dubizzle" },
    WEBSITE: { type: "PUBLISH_WEBSITE", action_field: "publish_website" },
  },
  UNPUBLISH: {
    ALL: { type: "UNPUBLISH_ALL", action_field: "unpublish_all" },
    PF: { type: "UNPUBLISH_PF", action_field: "unpublish_pf" },
    BAYUT: { type: "UNPUBLISH_BAYUT", action_field: "unpublish_bayut" },
    DUBIZZLE: { type: "UNPUBLISH_DUBIZZLE", action_field: "unpublish_dubizzle" },
    WEBSITE: { type: "UNPUBLISH_WEBSITE", action_field: "unpublish_website" },
  },
  REMOVE: {
    ARCHIVE: { type: "ARCHIVE", action_field: "archived" },
    DELETE: { type: "DELETE", action_field: "deleted" },
  },
};

// Extract role from localStorage
const userData = JSON.parse(localStorage.getItem("userData") || "{}");
const role = userData.role;

const filterActionsByRole = () => {
  return [
    {
      title: "Transfer",
      actions: Object.values(ActionTypes.TRANSFER).filter(action => {
        if (action.action_field === "transfer_agent" && role === "agent") return true;
        if (action.action_field === "transfer_owner" && role === "owner") return true;
        return false;
      }),
      icon: (type) => <ArrowLeftRight className="h-4 w-4 mr-2 text-blue-600" />,
      textColor: "text-gray-700",
      hoverBg: "hover:bg-blue-50",
    },
    {
      title: "Publish",
      actions: ["admin", "super_admin"].includes(role) ? Object.values(ActionTypes.PUBLISH) : [],
      icon: (type) =>
        type === "PUBLISH_ALL" ? (
          <Upload className="h-4 w-4 mr-2 text-blue-600" />
        ) : (
          <ChevronRight className="h-4 w-4 mr-2 text-blue-600" />
        ),
      textColor: "text-gray-700",
      hoverBg: "hover:bg-blue-50",
    },
    {
      title: "Unpublish",
      actions: ["admin", "super_admin"].includes(role) ? Object.values(ActionTypes.UNPUBLISH) : [],
      icon: (type) =>
        type === "UNPUBLISH_ALL" ? (
          <Download className="h-4 w-4 mr-2 text-amber-600" />
        ) : (
          <ChevronRight className="h-4 w-4 mr-2 text-amber-600" />
        ),
      textColor: "text-gray-700",
      hoverBg: "hover:bg-blue-50",
    },
    {
      title: "Remove",
      actions: Object.values(ActionTypes.REMOVE), // Assume all roles can remove
      icon: (type) =>
        type === "ARCHIVE" ? (
          <Archive className="h-4 w-4 mr-2 text-gray-600" />
        ) : (
          <Trash2 className="h-4 w-4 mr-2 text-red-600" />
        ),
      textColor: (type) => (type === "DELETE" ? "text-red-600" : "text-gray-700"),
      hoverBg: (type) =>
        type === "DELETE" ? "hover:bg-red-50" : "hover:bg-blue-50",
    },
  ].filter(section => section.actions.length > 0); // Only return sections with visible actions
};

export const actionSections = filterActionsByRole();
