import { createContext, useState } from "react";

const MainContentContext = createContext();

export function MainContentProvider({ children }) {
  const [mainContent, setMainContent] = useState("Projects");

  return (
    <MainContentContext.Provider value={{ mainContent, setMainContent }}>
      {children}
    </MainContentContext.Provider>
  );
}

export default MainContentContext;
