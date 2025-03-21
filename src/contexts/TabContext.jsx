import { createContext, useState } from "react";
import { tabs } from "../enums/sidebarTabsEnums";

const MainTabContext = createContext();

export function MainTabProvider({ children }) {
  const [mainTab, setMainTab] = useState(tabs.HIDDEN);

  return (
    <MainTabContext.Provider value={{ mainTab, setMainTab }}>
      {children}
    </MainTabContext.Provider>
  );
}

export default MainTabContext;
