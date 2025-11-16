import React, { useState } from 'react';
import { LandingPage } from './components/LandingPage';
import { MainApp } from './components/MainApp';
import { PricingPage } from './components/PricingPage';

type Page = 'LANDING' | 'APP' | 'PRICING';

const App: React.FC = () => {
    const [currentPage, setCurrentPage] = useState<Page>('LANDING');

    const navigateToApp = () => setCurrentPage('APP');
    const navigateToPricing = () => setCurrentPage('PRICING');
    const navigateToLanding = () => setCurrentPage('LANDING');

    const renderCurrentPage = () => {
        switch (currentPage) {
            case 'APP':
                return <MainApp onNavigateToPricing={navigateToPricing} />;
            case 'PRICING':
                return <PricingPage onLogin={navigateToApp} />;
            case 'LANDING':
            default:
                return <LandingPage onNavigateToApp={navigateToApp} onNavigateToPricing={navigateToPricing} />;
        }
    };

    return (
      <div className="min-h-screen bg-gray-900 text-white p-4 sm:p-6 md:p-8 flex flex-col items-center">
          {renderCurrentPage()}
      </div>
    );
};

export default App;