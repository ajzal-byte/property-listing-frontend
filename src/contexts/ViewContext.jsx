import { createContext, useState } from "react";

const ViewContext = createContext();

export function ViewProvider({ children }) {
  const [viewType, setViewType] = useState("grid");

  return (
    <ViewContext.Provider value={{ viewType, setViewType }}>
      {children}
    </ViewContext.Provider>
  );
}

export default ViewContext;
