import React, { useState } from 'react';
import { StudioTab } from '../types/studio';
import { StudioAuthProvider, useStudioAuth } from './context/StudioAuthContext';
import { StudioLayout } from './StudioLayout';
import { StudioLoginPage } from './pages/StudioLoginPage';
import { StudioDashboardPage } from './pages/StudioDashboardPage';
import { StudioContentPage } from './pages/StudioContentPage';
import { StudioEditorPage } from './pages/StudioEditorPage';
import { StudioProductsPage } from './pages/StudioProductsPage';
import { StudioEngineeringPage } from './pages/StudioEngineeringPage';
import { StudioResearchPage } from './pages/StudioResearchPage';
import { StudioUpdatesPage } from './pages/StudioUpdatesPage';
import { StudioMediaPage } from './pages/StudioMediaPage';
import { StudioHomepageBuilderPage } from './pages/StudioHomepageBuilderPage';
import { StudioPagesPage } from './pages/StudioPagesPage';
import { StudioNavigationPage } from './pages/StudioNavigationPage';
import { StudioNewsletterPage } from './pages/StudioNewsletterPage';
import { StudioAnalyticsPage } from './pages/StudioAnalyticsPage';
import { StudioUsersPage } from './pages/StudioUsersPage';
import { StudioSettingsPage } from './pages/StudioSettingsPage';

interface StudioAppProps {
  onBackToPublicSite: () => void;
  initialSubTab?: StudioTab;
}

const StudioAppContent: React.FC<StudioAppProps> = ({
  onBackToPublicSite,
  initialSubTab = 'dashboard',
}) => {
  const { isAuthenticated, isLoading } = useStudioAuth();
  const [activeTab, setActiveTab] = useState<StudioTab>(initialSubTab);
  const [activeEditorId, setActiveEditorId] = useState<string | undefined>(undefined);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FAFAFA] dark:bg-[#0B0D11] text-xs font-mono text-neutral-400">
        Verifying cryptographic session...
      </div>
    );
  }

  if (!isAuthenticated) {
    return <StudioLoginPage onBackToPublicSite={onBackToPublicSite} />;
  }

  const handleOpenEditor = (contentId?: string) => {
    setActiveEditorId(contentId);
    setActiveTab('editor');
  };

  const renderActiveModule = () => {
    switch (activeTab) {
      case 'dashboard':
        return <StudioDashboardPage onNavigateTab={setActiveTab} onOpenEditor={handleOpenEditor} />;
      case 'content':
        return <StudioContentPage onOpenEditor={handleOpenEditor} />;
      case 'editor':
        return (
          <StudioEditorPage
            contentId={activeEditorId}
            onBack={() => {
              setActiveEditorId(undefined);
              setActiveTab('content');
            }}
            onPublished={() => {
              setActiveEditorId(undefined);
              setActiveTab('content');
            }}
          />
        );
      case 'products':
        return <StudioProductsPage />;
      case 'engineering':
        return <StudioEngineeringPage />;
      case 'research':
        return <StudioResearchPage />;
      case 'updates':
        return <StudioUpdatesPage />;
      case 'media':
        return <StudioMediaPage />;
      case 'homepage':
        return <StudioHomepageBuilderPage />;
      case 'pages':
        return <StudioPagesPage />;
      case 'navigation':
        return <StudioNavigationPage />;
      case 'newsletter':
        return <StudioNewsletterPage />;
      case 'analytics':
        return <StudioAnalyticsPage />;
      case 'users':
        return <StudioUsersPage />;
      case 'settings':
        return <StudioSettingsPage />;
      default:
        return <StudioDashboardPage onNavigateTab={setActiveTab} onOpenEditor={handleOpenEditor} />;
    }
  };

  return (
    <StudioLayout
      currentTab={activeTab}
      onSelectTab={(tab) => {
        if (tab !== 'editor') setActiveEditorId(undefined);
        setActiveTab(tab);
      }}
      onOpenEditor={handleOpenEditor}
      onOpenPublicSite={onBackToPublicSite}
    >
      {renderActiveModule()}
    </StudioLayout>
  );
};

export const StudioApp: React.FC<StudioAppProps> = (props) => {
  return (
    <StudioAuthProvider>
      <StudioAppContent {...props} />
    </StudioAuthProvider>
  );
};
