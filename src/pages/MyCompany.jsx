import React from 'react';
import CompanyDetailsSection from './../components/Profile/Company/CompanyDetails';
import InterfaceSettingsSection from './../components/Profile/Company/InterfaceSettings';
import PresentationSettingsSection from './../components/Profile/Company/PresentationSettings';

const MyCompany = () => {
  return (
    <div className="container mx-auto max-w-7xl px-4 py-8">
      <CompanyDetailsSection />
      <InterfaceSettingsSection />
      <PresentationSettingsSection />
    </div>
  );
};

export default MyCompany;