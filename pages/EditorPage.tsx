import React, { useState, useCallback, useRef, useEffect } from 'react';
import { ChatPanel } from '../components/ChatPanel';
import { ImagePanel } from '../components/ImagePanel';
import { Header } from '../components/Header';
import { PropertyImageNavigator } from '../components/PropertyImageNavigator';
import type { PropertyListing } from '../types';
import { downloadDataUrl } from '../utils/fileUtils';
import { FullScreenViewer } from '../components/FullScreenViewer';

interface EditorPageProps {
    property: PropertyListing;
    activeImageProjectId: string;
    activeVersionIndex: number;
    onGoToProperty: () => void;
    onSelectImageProject: (imageProjectId: string) => void;
    sendMessage: (message: string, maskDataUrl?: string) => void;
    onPresetSubmit: (prompt: string, userMessage: string) => void;
    toggleSaveVersion: (versionId: string) => void;
    addWatermark: (versionId: string) => void;
    goToNextVersion: () => void;
    goToPrevVersion: () => void;
    isLoading: boolean;
    error: string | null;
}


const EditorPage: React.FC<EditorPageProps> = ({
    property,
    activeImageProjectId,
    activeVersionIndex,
    onGoToProperty,
    onSelectImageProject,
    sendMessage,
    onPresetSubmit,
    toggleSaveVersion,
    addWatermark,
    goToNextVersion,
    goToPrevVersion,
    isLoading,
    error,
}) => {
  const [chatPanelWidth, setChatPanelWidth] = useState(400);
  const [isMobile, setIsMobile] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(true);
  const [activeMask, setActiveMask] = useState<string | null>(null);
  const [isNavigatorVisible, setIsNavigatorVisible] = useState(true);
  const [fullScreenImageUrl, setFullScreenImageUrl] = useState<string | null>(null);
  const isResizing = useRef(false);
  
  const activeImageProject = property.imageProjects.find(ip => ip.id === activeImageProjectId);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    isResizing.current = true;
    document.body.style.cursor = 'col-resize';
    document.body.style.userSelect = 'none';
  }, []);

  const handleMouseUp = useCallback(() => {
    if (isResizing.current) {
        isResizing.current = false;
        document.body.style.cursor = 'default';
        document.body.style.userSelect = 'auto';
    }
  }, []);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (isResizing.current) {
      setChatPanelWidth(prevWidth => {
        const newWidth = e.clientX;
        if (newWidth >= 320 && newWidth <= 800) { // Set min/max width for usability
          return newWidth;
        }
        return prevWidth;
      });
    }
  }, []);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth < 768) {
        setIsChatOpen(false);
      }
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);

    return () => {
      window.removeEventListener('resize', checkMobile);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [handleMouseMove, handleMouseUp]);

  const handleSendMessage = (message: string) => {
    sendMessage(message, activeMask);
    setActiveMask(null); // Clear mask after sending
  };
  
  const handleDownload = () => {
    const activeVersion = activeImageProject?.versions[activeVersionIndex];
    if (activeVersion) {
        const cleanAddress = property.address.replace(/[^\w\s]/gi, '').replace(/\s+/g, '_');
        const filename = `${cleanAddress}_v${activeVersionIndex + 1}.png`;
        downloadDataUrl(activeVersion.dataUrl, filename);
    }
  };

  const handleDownloadChatImage = (url: string, filename: string) => {
      downloadDataUrl(url, filename);
  };


  if (!activeImageProject) {
    return (
        <div className="flex items-center justify-center h-screen">
            <p>Error: Could not find the selected image project.</p>
        </div>
    );
  }

  const activeVersion = activeImageProject.versions[activeVersionIndex];

  if (!activeVersion) {
    return (
        <div className="flex items-center justify-center h-screen">
            <p>Error: Could not find the selected image version. Please go back and try again.</p>
        </div>
    );
  }


  return (
    <div className="flex flex-col h-screen bg-gray-900 text-gray-200 overflow-hidden">
      <Header
        onGoToProperty={onGoToProperty}
        currentView="editor"
        isNavigatorVisible={isNavigatorVisible}
        onToggleNavigator={() => setIsNavigatorVisible(prev => !prev)}
      />
      {isNavigatorVisible && (
        <PropertyImageNavigator
            imageProjects={property.imageProjects}
            activeImageProjectId={activeImageProjectId}
            onSelect={onSelectImageProject}
        />
      )}

      {isMobile && (
        <div className="flex items-center justify-center p-2 bg-gray-800 border-b border-gray-700">
          <Button
            onClick={() => setIsChatOpen(!isChatOpen)}
            variant="ghost"
            size="sm"
            className="text-teal-400"
          >
            {isChatOpen ? 'Hide AI Chat' : 'Show AI Chat'}
          </Button>
        </div>
      )}

      <div className="flex flex-col md:flex-row flex-grow overflow-hidden">
        {(!isMobile || isChatOpen) && (
          <>
            <ChatPanel
              messages={activeImageProject.chatHistory}
              onSendMessage={handleSendMessage}
              onPresetSubmit={onPresetSubmit}
              isLoading={isLoading}
              isDisabled={false}
              style={isMobile ? {} : { width: `${chatPanelWidth}px` }}
              onViewFullScreen={setFullScreenImageUrl}
              onDownloadImage={handleDownloadChatImage}
              onAddWatermark={addWatermark}
            />
            {!isMobile && (
              <div
                className="w-1.5 cursor-col-resize bg-gray-800 hover:bg-teal-600 transition-colors duration-200 flex-shrink-0"
                onMouseDown={handleMouseDown}
                aria-label="Resize chat panel"
                role="separator"
              />
            )}
          </>
        )}
        <main className="flex-grow flex flex-col relative">
            <ImagePanel
              key={activeVersion.id} // Add key to force re-mount on version change for canvas
              image={activeVersion}
              versions={activeImageProject.versions}
              activeVersionIndex={activeVersionIndex}
              onSaveToggle={toggleSaveVersion}
              onNextVersion={goToNextVersion}
              onPrevVersion={goToPrevVersion}
              isLoading={isLoading}
              error={error}
              activeMask={activeMask}
              onMaskChange={setActiveMask}
              onViewFullScreen={() => setFullScreenImageUrl(activeVersion.dataUrl)}
              onDownload={handleDownload}
              onAddWatermark={() => addWatermark(activeVersion.id)}
            />
        </main>
      </div>
       {fullScreenImageUrl && (
            <FullScreenViewer 
                imageUrl={fullScreenImageUrl} 
                onClose={() => setFullScreenImageUrl(null)} 
            />
        )}
    </div>
  );
}

export default EditorPage;