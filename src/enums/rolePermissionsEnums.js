export const Roles = Object.freeze({
    AGENT: "Agent",
    ADMIN: "Admin",
    SUPER_ADMIN: "Super Admin"
  });
  
  // Define enums for permission types
  export const PermissionType = Object.freeze({
    SIMPLE: "simple",
    COMPLEX: "complex"
  });
  
  // Define enums for possible values
  export const PermissionValues = Object.freeze({
    YES: "Yes",
    NO: "No",
    OWN: "Own",
    ALL: "All",
    AGENTS: "Agents"
  });
  
  // Define enums for permission categories
  export const PermissionCategory = Object.freeze({
    PROPERTY_LISTING: "Property Listing Permissions",
    USER_MANAGEMENT: "User Management Permissions",
    FINANCIAL: "Financial Permissions",
    SETTINGS: "Settings Permissions",
    LISTING_TYPE: "Listing Type Permissions"
  });
  
  // Define enums for listing subcategories
  export const ListingSubCategory = Object.freeze({
    POCKET: "Pocket Listings",
    LIVE: "Live Listings",
    PUBLISH: "Publish Listings",
    DRAFT: "Draft Listings"
  });
  
  // Define enums for common permission names
  export const CommonPermissionName = Object.freeze({
    VIEW: "View",
    EDIT: "Edit",
    DELETE: "Delete",
    PUBLISH: "Publish",
    UNPUBLISH: "Unpublish",
    MANAGE: "Manage",
    CREATE: "Add/Create"
  });
  