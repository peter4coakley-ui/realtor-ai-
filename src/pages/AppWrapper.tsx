import React, { useState } from 'react'
import { Routes, Route, useNavigate, Navigate } from 'react-router-dom'
import { usePhotoMind } from '../hooks/usePhotoMind'
import AppDashboard from '../../pages/AppDashboard'
import EditorPage from '../../pages/EditorPage'
import PropertyPage from '../../pages/PropertyPage'

export function AppWrapper() {
  const photoMind = usePhotoMind()
  const navigate = useNavigate()

  const handleCreateProperty = async (files: File[]) => {
    const newPropertyId = await photoMind.createPropertyFromFiles(files)
    if (newPropertyId) {
      photoMind.setActiveProperty(newPropertyId)
      navigate(`/app/project/${newPropertyId}`)
    }
  }

  const handleImportFromUrl = async (url: string) => {
    const newPropertyId = await photoMind.importFromUrl(url)
    if (newPropertyId) {
      photoMind.setActiveProperty(newPropertyId)
      navigate(`/app/project/${newPropertyId}`)
    }
  }

  const handleSelectProperty = (propertyId: string) => {
    photoMind.setActiveProperty(propertyId)
    navigate(`/app/project/${propertyId}`)
  }

  const handleSelectImageProject = (imageProjectId: string) => {
    photoMind.setActiveImageProject(imageProjectId)
    navigate(`/app/editor/${imageProjectId}`)
  }

  const handleGoToProperty = () => {
    if (photoMind.state.activeProjectId) {
      navigate(`/app/project/${photoMind.state.activeProjectId}`)
    } else {
      navigate('/app')
    }
  }

  const handleGoHome = () => {
    photoMind.setActiveProperty(null)
    navigate('/app')
  }

  const activeProperty = photoMind.state.projects.find(
    p => p.id === photoMind.state.activeProjectId
  )
  const activeImageProject = activeProperty?.imageProjects.find(
    ip => ip.id === photoMind.state.activeImageProjectId
  )

  return (
    <Routes>
      <Route
        index
        element={
          <AppDashboard
            propertyListings={photoMind.state.projects}
            onCreateProperty={handleCreateProperty}
            onSelectProperty={handleSelectProperty}
            onImportFromUrl={handleImportFromUrl}
            isLoading={photoMind.state.isLoading}
            error={photoMind.state.error}
          />
        }
      />
      <Route
        path="project/:propertyId"
        element={
          activeProperty ? (
            <PropertyPage
              property={activeProperty}
              onSelectImageProject={handleSelectImageProject}
              onAddPhotos={(files) =>
                photoMind.addImageProjectsToProperty(activeProperty.id, files)
              }
              onGoHome={handleGoHome}
              isLoading={photoMind.state.isLoading}
              onRenameProperty={photoMind.renameProperty}
              onRenameImageProject={photoMind.renameImageProject}
            />
          ) : (
            <Navigate to="/app" replace />
          )
        }
      />
      <Route
        path="editor/:imageProjectId"
        element={
          activeProperty && activeImageProject ? (
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
          ) : (
            <Navigate to="/app" replace />
          )
        }
      />
    </Routes>
  )
}
