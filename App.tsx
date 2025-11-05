import React, { useState } from 'react';
import { usePhotoMind } from './hooks/usePhotoMind';
import HomePage from './pages/HomePage';
import EditorPage from './pages/EditorPage';
import PropertyPage from './pages/PropertyPage';

type AppView = 'home' | 'property' | 'editor';

function App() {
  const photoMind = usePhotoMind();
  const [view, setView] = useState<AppView>('home');

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

  const activeProperty = photoMind.state.projects.find(p => p.id === photoMind.state.activeProjectId);
  const activeImageProject = activeProperty?.imageProjects.find(ip => ip.id === photoMind.state.activeImageProjectId);

  const renderContent = () => {
    switch (view) {
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
              onEnhancePrompt={photoMind.handleEnhancePrompt}
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
            propertyListings={photoMind.state.projects}
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
            propertyListings={photoMind.state.projects}
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
            propertyListings={photoMind.state.projects}
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

export default App;
