import React, { useState } from "react";
import Sidebar from "./components/Sidebar";
import Navbar from "./components/Navbar";
import SimpleFilters from "./components/SimpleFilters";
import CardGrid from "./components/DataView/CardGrid";
import { cards } from "./mockdata/mockData";
import LayoutGrid from "./components/LayoutGrid";
import { ViewProvider } from "./contexts/ViewContext";
import { MainContentProvider } from "./contexts/MainContentContext";
import {MainTabProvider} from "./contexts/TabContext";
import AcademyCard from './components/Academy/AcademyCard'

const App = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <ViewProvider>
      <div className="flex h-screen">
        <Sidebar isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />

        <div
          className={`flex-1 flex flex-col pt-[4rem] transition-all duration-300 ${
            isCollapsed ? "ml-20" : "ml-60"
          }`}
        >
          <Navbar />

        <MainTabProvider>
          <MainContentProvider>
            <main className="flex-1 p-6 bg-gray-50">
              <SimpleFilters />
              <div className="container mx-auto p-4">
                <CardGrid cards={cards} />
              </div>
              <AcademyCard title={"Enrolled Students"} targetNumber={5000}/>
            </main>
          </MainContentProvider>
        </MainTabProvider>
        </div>
      </div>
    </ViewProvider>
  );
};

export default App;
