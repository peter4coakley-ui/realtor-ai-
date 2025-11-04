import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { usePhotoMind } from './hooks/usePhotoMind';
import LandingPage from './pages/LandingPage';
import AuthPage from './pages/AuthPage';
import HomePage from './pages/HomePage';
import EditorPage from './pages/EditorPage';
import PropertyPage from './pages/PropertyPage';

type AppView = 'landing' | 'auth' | 'home' | 'property' | 'editor';

function AppContent() {
  const { user, loading: authLoading } = useAuth();
  const photoMind = usePhotoMind();
  const [view, setView] = useState<AppView>('landing');
  const [authMode, setAuthMode] = useState<'signin' | 'signup'>('signin');

  useEffect(() => {
    if (!user && view !== 'landing' && view !== 'auth') {
      setView('landing');
    }

    if (user && (view === 'landing' || view === 'auth')) {
      setView('home');
    }
  }, [user, view]);

  if (authLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-900">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-dashed border-teal-400 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-gray-400">Loading...</p>
        </div>
      </div>
    );
  }

  const handleCreateProperty = async (files: File[]) => {
    const newPropertyId = await photoMind.createPropertyFromFiles(files);
    if (newPropertyId) {
      photoMind.setActiveProperty(newPropertyId);
      setView('property');
    }
  };

  const handleImportFromUrl = async (url: string) => {
    const newPropertyId = await photoMind.importFromUrl(url);
    if (newPropertyId) {
      photoMind.setActiveProperty(newPropertyId);
      setView('property');
    }
  };

  const handleSelectProperty = (propertyId: string) => {
    photoMind.setActiveProperty(propertyId);
    setView('property');
  };

  const handleSelectImageProject = (imageProjectId: string) => {
    photoMind.setActiveImageProject(imageProjectId);
    setView('editor');
  };

  const handleGoToProperty = () => {
    setView('property');
  };

  const handleGoHome = () => {
    photoMind.setActiveProperty(null);
    setView('home');
  };

  const handleGetStarted = () => {
    setAuthMode('signup');
    setView('auth');
  };

  const handleSignIn = () => {
    setAuthMode('signin');
    setView('auth');
  };

  const handleBackToLanding = () => {
    setView('landing');
  };

  const activeProperty = photoMind.state.propertyListings.find(p => p.id === photoMind.state.activePropertyId);
  const activeImageProject = activeProperty?.imageProjects.find(ip => ip.id === photoMind.state.activeImageProjectId);

  const renderContent = () => {
    switch (view) {
      case 'landing':
        return <LandingPage onGetStarted={handleGetStarted} onSignIn={handleSignIn} />;

      case 'auth':
        return <AuthPage onBack={handleBackToLanding} initialMode={authMode} />;

      case 'editor':
        if (activeProperty && activeImageProject) {
          return (
            <EditorPage
              key={activeImageProject.id}
              property={activeProperty}
              activeImageProjectId={activeImageProject.id}
              activeVersionIndex={photoMind.activeVersionIndex}
              onSelectImageProject={handleSelectImageProject}
              onGoToProperty={handleGoToProperty}
              sendMessage={photoMind.sendMessage}
              onPresetSubmit={photoMind.handlePresetSubmit}
              toggleSaveVersion={photoMind.toggleSaveVersion}
              addWatermark={photoMind.addWatermark}
              goToNextVersion={photoMind.goToNextVersion}
              goToPrevVersion={photoMind.goToPrevVersion}
              isLoading={photoMind.state.isLoading}
              error={photoMind.state.error}
            />
          );
        }
        return (
          <HomePage
            propertyListings={photoMind.state.propertyListings}
            onCreateProperty={handleCreateProperty}
            onSelectProperty={handleSelectProperty}
            onImportFromUrl={handleImportFromUrl}
            isLoading={photoMind.state.isLoading}
            error={photoMind.state.error}
          />
        );

      case 'property':
        if (activeProperty) {
          return (
            <PropertyPage
              property={activeProperty}
              onSelectImageProject={handleSelectImageProject}
              onAddPhotos={(files) => photoMind.addImageProjectsToProperty(activeProperty.id, files)}
              onGoHome={handleGoHome}
              isLoading={photoMind.state.isLoading}
              onRenameProperty={photoMind.renameProperty}
              onRenameImageProject={photoMind.renameImageProject}
            />
          );
        }
        return (
          <HomePage
            propertyListings={photoMind.state.propertyListings}
            onCreateProperty={handleCreateProperty}
            onSelectProperty={handleSelectProperty}
            onImportFromUrl={handleImportFromUrl}
            isLoading={photoMind.state.isLoading}
            error={photoMind.state.error}
          />
        );

      case 'home':
      default:
        return (
          <HomePage
            propertyListings={photoMind.state.propertyListings}
            onCreateProperty={handleCreateProperty}
            onSelectProperty={handleSelectProperty}
            onImportFromUrl={handleImportFromUrl}
            isLoading={photoMind.state.isLoading}
            error={photoMind.state.error}
          />
        );
    }
  };

  return <>{renderContent()}</>;
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
