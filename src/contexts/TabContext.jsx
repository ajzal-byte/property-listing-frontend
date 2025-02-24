import { createContext, useState } from "react";
import { tabs } from "./../enums/enums";

const MainTabContext = createContext();

export function MainTabProvider({ children }) {
  const [mainTab, setMainTab] = useState(tabs.OFFPLAN);

  return (
    <MainTabContext.Provider value={{ mainTab, setMainTab }}>
      {children}
    </MainTabContext.Provider>
  );
}

export default MainTabContext;
