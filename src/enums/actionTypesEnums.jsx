import { Upload, ChevronRight, Download, Archive, Trash2 } from "lucide-react";

export const ActionTypes = {
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
    DUBIZZLE: {
      type: "UNPUBLISH_DUBIZZLE",
      action_field: "unpublish_dubizzle",
    },
    WEBSITE: { type: "UNPUBLISH_WEBSITE", action_field: "unpublish_website" },
  },
  REMOVE: {
    ARCHIVE: { type: "ARCHIVE", action_field: "archived" },
    DELETE: { type: "DELETE", action_field: "deleted" },
  },
};

export const actionSections = [
  {
    title: "Publish",
    actions: Object.values(ActionTypes.PUBLISH),
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
    actions: Object.values(ActionTypes.UNPUBLISH),
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
    actions: Object.values(ActionTypes.REMOVE),
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
];
