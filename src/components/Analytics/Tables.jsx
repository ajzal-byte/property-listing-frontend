import React from "react";
import ReusableTable from "./Table";
import { mockLeads, mockDeals } from "../../mockdata/mockData";

const AgentTablePage = ({ statType }) => {
  return (
    <div className="container mx-auto p-4">
      {statType == "lead" ? (
        <>
          <div className="mb-8">
            <ReusableTable
              data={mockLeads}
              tableType="leads"
              title="Agent Lead Statistics"
              currencyCode="AED"
            />
          </div>
        </>
      ) : (
        <>
          <div>
            <ReusableTable
              data={mockDeals}
              tableType="deals"
              title="Agent Deal Statistics"
              currencyCode="AED"
            />
          </div>
        </>
      )}
    </div>
  );
};

export default AgentTablePage;
