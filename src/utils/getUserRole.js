export const role =
  JSON.parse(localStorage.getItem("userData") || "{}")?.role?.name || "Unknown";
