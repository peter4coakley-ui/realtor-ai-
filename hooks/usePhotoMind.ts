import { useState, useCallback, useEffect } from 'react';
import type { ChatMessage, ImageVersion, EditAgent, PropertyListing, ImageProject } from '../types';
import { fileToBase64, dataUrlToFile } from '../utils/fileUtils';
import { interpretUserIntent, generateImageEdit, analyzeImageAndSuggestEdits, analyzeAndNameImage } from '../services/geminiService';
import { scrapeListingUrl } from '../services/listingScraperService';
import { applyWatermark } from '../utils/imageUtils';


interface PhotoMindState {
  propertyListings: PropertyListing[];
  activePropertyId: string | null;
  activeImageProjectId: string | null;
  activeVersionIndex: number;
  isLoading: boolean;
  error: string | null;
  lastViewedVersions: Record<string, number>;
}

export const usePhotoMind = () => {
  const [state, setState] = useState<PhotoMindState>({
    propertyListings: [],
    activePropertyId: null,
    activeImageProjectId: null,
    activeVersionIndex: 0,
    isLoading: false,
    error: null,
    lastViewedVersions: {},
  });

  const createPropertyFromFiles = useCallback(async (files: File[]): Promise<string | undefined> => {
    if (files.length === 0) return;
    setState(prev => ({ ...prev, isLoading: true, error: null }));

    try {
        const timestamp = Date.now();
        const newPropertyId = `prop-${timestamp}`;
        const address = files[0].name.split('.').slice(0, -1).join('.') || `New Property ${state.propertyListings.length + 1}`;
        
        const imageProjectsPromises = files.map(async (file, index) => {
            const dataUrl = await fileToBase64(file);
            const versionTimestamp = timestamp + index;
            const newImageProjectId = `ip-${versionTimestamp}`;

            let imageName = file.name; // Default name
            try {
                const aiName = await analyzeAndNameImage(dataUrl);
                if (aiName) imageName = aiName;
            } catch (e) {
                console.error(`AI naming failed for ${file.name}, using filename as fallback.`, e);
            }


            const originalVersion: ImageVersion = {
                id: `v-${versionTimestamp}`,
                dataUrl,
                prompt: 'Original Image',
                type: 'original',
                timestamp: new Date().toISOString(),
            };

            const newImageProject: ImageProject = {
                id: newImageProjectId,
                name: imageName,
                versions: [originalVersion],
                chatHistory: [{ id: `msg-${versionTimestamp}`, role: 'assistant', content: 'Image loaded! How can I help you transform it?' }],
                originalFile: file,
            };
            return newImageProject;
        });

        const newImageProjects = await Promise.all(imageProjectsPromises);

        const newProperty: PropertyListing = {
            id: newPropertyId,
            address,
            imageProjects: newImageProjects,
        };
        
        setState(prev => ({
            ...prev,
            propertyListings: [...prev.propertyListings, newProperty],
            isLoading: false,
        }));
        return newPropertyId;

    } catch (error) {
        console.error("Failed to create property", error);
        setState(prev => ({ ...prev, isLoading: false, error: "Failed to process one or more images."}));
    }
  }, [state.propertyListings.length]);

  const importFromUrl = async (url: string): Promise<string | undefined> => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));
    try {
        const scrapedData = await scrapeListingUrl(url);
        
        const filePromises = scrapedData.images.map(image => dataUrlToFile(image.base64, image.name));
        const files = await Promise.all(filePromises);

        // This function will create ONE property with all the images inside it.
        const newPropertyId = await createPropertyFromFiles(files);
        if (newPropertyId) {
            setState(prev => {
                const newProp = prev.propertyListings.find(p => p.id === newPropertyId);
                if (newProp) {
                    return {
                        ...prev,
                        propertyListings: prev.propertyListings.map(p => p.id === newPropertyId ? { ...p, address: scrapedData.address } : p)
                    }
                }
                return prev;
            });
        }
        return newPropertyId;


    } catch (error) {
        console.error('Error importing from URL:', error);
        const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred.';
        setState(prev => ({ ...prev, isLoading: false, error: `Failed to import from URL. ${errorMessage}` }));
        return undefined;
    }
  };
  
  const addImageProjectsToProperty = useCallback(async (propertyId: string, files: File[]) => {
      if (files.length === 0) return;
      setState(prev => ({ ...prev, isLoading: true, error: null }));
      
      try {
        const imageProjectsPromises = files.map(async (file, index) => {
            const dataUrl = await fileToBase64(file);
            const versionTimestamp = Date.now() + index;
            const newImageProjectId = `ip-${versionTimestamp}`;
            
            let imageName = file.name; // Default name
            try {
                const aiName = await analyzeAndNameImage(dataUrl);
                if (aiName) imageName = aiName;
            } catch (e) {
                console.error(`AI naming failed for ${file.name}, using filename as fallback.`, e);
            }

            const originalVersion: ImageVersion = {
                id: `v-${versionTimestamp}`,
                dataUrl,
                prompt: 'Original Image',
                type: 'original',
                timestamp: new Date().toISOString(),
            };
            const newImageProject: ImageProject = {
                id: newImageProjectId,
                name: imageName,
                versions: [originalVersion],
                chatHistory: [{ id: `msg-${versionTimestamp}`, role: 'assistant', content: 'Image loaded! How can I help you transform it?' }],
                originalFile: file,
            };
            return newImageProject;
        });

        const newImageProjects = await Promise.all(imageProjectsPromises);

        setState(prev => {
            const updatedListings = prev.propertyListings.map(prop => {
                if (prop.id === propertyId) {
                    return { ...prop, imageProjects: [...prop.imageProjects, ...newImageProjects] };
                }
                return prop;
            });
            return { ...prev, propertyListings: updatedListings, isLoading: false };
        });

      } catch (error) {
          console.error("Failed to add images to property", error);
          setState(prev => ({ ...prev, isLoading: false, error: "Failed to add one or more images."}));
      }
  }, []);

  const setActiveProperty = useCallback((propertyId: string | null) => {
    setState(prev => ({
        ...prev,
        activePropertyId: propertyId,
        activeImageProjectId: null, // Reset active image when changing property
        activeVersionIndex: 0,
    }));
  }, []);

  const setActiveImageProject = useCallback((imageProjectId: string) => {
    setState(prev => {
        const activeProperty = prev.propertyListings.find(p => p.id === prev.activePropertyId);
        const activeImageProject = activeProperty?.imageProjects.find(ip => ip.id === imageProjectId);

        if (prev.activeImageProjectId) {
            prev.lastViewedVersions[prev.activeImageProjectId] = prev.activeVersionIndex;
        }

        const newVersionIndex = prev.lastViewedVersions[imageProjectId] ?? (activeImageProject ? activeImageProject.versions.length - 1 : 0);

        return {
            ...prev,
            activeImageProjectId: imageProjectId,
            activeVersionIndex: newVersionIndex,
            lastViewedVersions: { ...prev.lastViewedVersions },
        }
    });
  }, []);
  
  const modifyActiveImageProject = (updater: (imageProject: ImageProject) => ImageProject) => {
      setState(prev => {
        if (!prev.activePropertyId || !prev.activeImageProjectId) return prev;
        
        const updatedPropertyListings = prev.propertyListings.map(prop => {
            if (prop.id === prev.activePropertyId) {
                const updatedImageProjects = prop.imageProjects.map(imgProj => {
                    if (imgProj.id === prev.activeImageProjectId) {
                        return updater(imgProj);
                    }
                    return imgProj;
                });
                return { ...prop, imageProjects: updatedImageProjects };
            }
            return prop;
        });
        return { ...prev, propertyListings: updatedPropertyListings };
      });
  };

  // Removed useCallback from handleAIEdit to ensure it always captures the latest state.
  const handleAIEdit = async (prompt: string, type: ImageVersion['type'], maskDataUrl?: string) => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));

    const latestState = { ...state }; // Get a snapshot of the current state
    
    const activeProp = latestState.propertyListings.find(p => p.id === latestState.activePropertyId);
    const activeImageProject = activeProp?.imageProjects.find(ip => ip.id === latestState.activeImageProjectId);

    if (!activeImageProject) {
        setState(prev => ({ ...prev, isLoading: false, error: "Active image project not found." }));
        return;
    }

    const activeVersion = activeImageProject.versions[latestState.activeVersionIndex];
    if (!activeVersion) {
        setState(prev => ({ ...prev, isLoading: false, error: "Active version not found at the current index." }));
        return;
    }

    try {
        const resultDataUrl = await generateImageEdit(activeVersion.dataUrl, prompt, maskDataUrl);
        
        const newVersion: ImageVersion = {
            id: `v-${Date.now()}`,
            dataUrl: resultDataUrl,
            prompt,
            type: type === 'chat' && maskDataUrl ? 'inpaint' : type,
            timestamp: new Date().toISOString(),
        };

        const imageChatMessage: ChatMessage = {
            id: `msg-${Date.now()}`,
            role: 'assistant',
            content: `Here is the edited image based on your request.`,
            image: newVersion.dataUrl,
            versionId: newVersion.id,
        };
        
        let messagesToAdd = [imageChatMessage];

        try {
          const suggestionText = await analyzeImageAndSuggestEdits(resultDataUrl);
          const suggestionMessage: ChatMessage = {
            id: `msg-sugg-${Date.now()}`,
            role: 'assistant',
            content: suggestionText,
          };
          messagesToAdd.push(suggestionMessage);
        } catch (analysisError) {
            console.error("Failed to get image suggestions:", analysisError);
            // Silently fail, just don't add the suggestion message.
        }

        setState(prev => {
            let newVersionIndex = prev.activeVersionIndex;
            const updatedPropertyListings = prev.propertyListings.map(prop => {
                if (prop.id === prev.activePropertyId) {
                    const updatedImageProjects = prop.imageProjects.map(imgProj => {
                        if (imgProj.id === prev.activeImageProjectId) {
                            const newVersions = [...imgProj.versions, newVersion];
                            newVersionIndex = newVersions.length - 1;
                            return {
                                ...imgProj,
                                versions: newVersions,
                                chatHistory: [...imgProj.chatHistory, ...messagesToAdd]
                            };
                        }
                        return imgProj;
                    });
                    return { ...prop, imageProjects: updatedImageProjects };
                }
                return prop;
            });
            return {
                ...prev,
                propertyListings: updatedPropertyListings,
                activeVersionIndex: newVersionIndex,
                isLoading: false
            };
        });
    } catch (error) {
        console.error('Error performing AI edit:', error);
        const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred.';
        setState(prev => ({ ...prev, isLoading: false, error: `Failed to edit image. ${errorMessage}` }));
    }
  };

  const sendMessage = useCallback(async (message: string, maskDataUrl?: string) => {
    if (!state.activePropertyId || !state.activeImageProjectId) return;
    
    const userMessage: ChatMessage = { id: `msg-${Date.now()}`, role: 'user', content: message };
    
    let activeImageProjectHistory: ChatMessage[] = [];

    setState(prev => ({ ...prev, isLoading: true, error: null }));
    modifyActiveImageProject(ip => {
        const updatedHistory = [...ip.chatHistory, userMessage];
        activeImageProjectHistory = updatedHistory; // capture for API call
        return { ...ip, chatHistory: updatedHistory };
    });

    try {
      const editCommand = await interpretUserIntent(activeImageProjectHistory, message);
      if (editCommand && editCommand.prompt) {
        await handleAIEdit(editCommand.prompt, 'chat', maskDataUrl);
      } else {
        const newChatMessage: ChatMessage = { id: `msg-${Date.now()}`, role: 'assistant', content: "I couldn't determine an edit from your message. Could you be more specific?" };
        modifyActiveImageProject(ip => ({ ...ip, chatHistory: [...ip.chatHistory, newChatMessage] }));
        setState(prev => ({...prev, isLoading: false }));
      }
    } catch (error) {
       console.error('Error interpreting message:', error);
       const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred.';
       const newChatMessage: ChatMessage = { id: `msg-${Date.now()}`, role: 'assistant', content: "Sorry, I encountered an error. Please try again." };
       modifyActiveImageProject(ip => ({ ...ip, chatHistory: [...ip.chatHistory, newChatMessage] }));
       setState(prev => ({ ...prev, isLoading: false, error: `Failed to process message. ${errorMessage}` }));
    }

  }, [state.activePropertyId, state.activeImageProjectId]);
  
  const handlePresetSubmit = useCallback((prompt: string, userMessageText: string) => {
    if (!state.activePropertyId || !state.activeImageProjectId) return;
    const userMessage: ChatMessage = { id: `msg-${Date.now()}`, role: 'user', content: userMessageText };
    modifyActiveImageProject(ip => ({ ...ip, chatHistory: [...ip.chatHistory, userMessage] }));
    handleAIEdit(prompt, 'preset');
  }, [state.activePropertyId, state.activeImageProjectId]);

  
  const toggleSaveVersion = useCallback((versionId: string) => {
    modifyActiveImageProject(ip => {
        const isCurrentlySaved = ip.versions.find(v => v.id === versionId)?.isSaved;

        const updatedVersions = ip.versions.map(v => {
            // If this is the version we clicked...
            if (v.id === versionId) {
                // ...toggle its saved state.
                return { ...v, isSaved: !isCurrentlySaved };
            }
            // If we are saving a NEW version (i.e., the one we clicked was not previously saved)...
            if (!isCurrentlySaved) {
                // ...then unsave all OTHER versions.
                return { ...v, isSaved: false };
            }
            // Otherwise (we are unsaving the clicked version), leave the others as they are.
            return v;
        });
        return { ...ip, versions: updatedVersions };
    });
  }, []);

  const addWatermark = useCallback((versionId: string) => {
    setState(prev => ({...prev, isLoading: true, error: null}));

    const prop = state.propertyListings.find(p => p.id === state.activePropertyId);
    const ip = prop?.imageProjects.find(ip => ip.id === state.activeImageProjectId);
    const sourceVersion = ip?.versions.find(v => v.id === versionId);

    if (!sourceVersion) {
        setState(prev => ({...prev, isLoading: false, error: "Source image not found."}));
        return;
    }

    applyWatermark(sourceVersion.dataUrl)
        .then(watermarkedDataUrl => {
            const newVersion: ImageVersion = {
                id: `v-${Date.now()}`,
                dataUrl: watermarkedDataUrl,
                prompt: `${sourceVersion.prompt} (Watermarked)`,
                type: 'chat',
                timestamp: new Date().toISOString(),
            };

            setState(prev => {
                let newActiveIndex = prev.activeVersionIndex;
                const updatedListings = prev.propertyListings.map(prop => {
                    if (prop.id === prev.activePropertyId) {
                        const updatedImageProjects = prop.imageProjects.map(imgProj => {
                            if (imgProj.id === prev.activeImageProjectId) {
                                const sourceVersionIndex = imgProj.versions.findIndex(v => v.id === versionId);
                                if (sourceVersionIndex !== -1) {
                                    const newVersions = [...imgProj.versions];
                                    newVersions.splice(sourceVersionIndex + 1, 0, newVersion);
                                    newActiveIndex = sourceVersionIndex + 1;
                                    return { ...imgProj, versions: newVersions };
                                }
                            }
                            return imgProj;
                        });
                        return { ...prop, imageProjects: updatedImageProjects };
                    }
                    return prop;
                });
                return { 
                    ...prev, 
                    propertyListings: updatedListings, 
                    activeVersionIndex: newActiveIndex,
                    isLoading: false 
                };
            });
        })
        .catch(err => {
            console.error(err);
            setState(prev => ({...prev, isLoading: false, error: "Failed to apply watermark."}));
        });

  }, [state.activePropertyId, state.activeImageProjectId, state.propertyListings]);

  const goToNextVersion = useCallback(() => {
    setState(prev => {
        const activeProperty = prev.propertyListings.find(p => p.id === prev.activePropertyId);
        const activeImageProject = activeProperty?.imageProjects.find(ip => ip.id === prev.activeImageProjectId);
        if (!activeImageProject || activeImageProject.versions.length <= 1) return prev;

        const newIndex = (prev.activeVersionIndex + 1) % activeImageProject.versions.length;
        const updatedLastViewed = { ...prev.lastViewedVersions };
        if (prev.activeImageProjectId) {
            updatedLastViewed[prev.activeImageProjectId] = newIndex;
        }
        return { ...prev, activeVersionIndex: newIndex, lastViewedVersions: updatedLastViewed };
    });
  }, []);

  const goToPrevVersion = useCallback(() => {
    setState(prev => {
        const activeProperty = prev.propertyListings.find(p => p.id === prev.activePropertyId);
        const activeImageProject = activeProperty?.imageProjects.find(ip => ip.id === prev.activeImageProjectId);
        if (!activeImageProject || activeImageProject.versions.length <= 1) return prev;

        const newIndex = (prev.activeVersionIndex - 1 + activeImageProject.versions.length) % activeImageProject.versions.length;
        const updatedLastViewed = { ...prev.lastViewedVersions };
        if (prev.activeImageProjectId) {
            updatedLastViewed[prev.activeImageProjectId] = newIndex;
        }
        return { ...prev, activeVersionIndex: newIndex, lastViewedVersions: updatedLastViewed };
    });
  }, []);

  const renameProperty = useCallback((propertyId: string, newAddress: string) => {
    setState(prev => ({
        ...prev,
        propertyListings: prev.propertyListings.map(p => 
            p.id === propertyId ? { ...p, address: newAddress } : p
        )
    }));
  }, []);

  const renameImageProject = useCallback((imageProjectId: string, newName: string) => {
    setState(prev => {
        if (!prev.activePropertyId) return prev;

        const updatedListings = prev.propertyListings.map(prop => {
            if (prop.id === prev.activePropertyId) {
                const updatedImageProjects = prop.imageProjects.map(imgProj => {
                    if (imgProj.id === imageProjectId) {
                        return { ...imgProj, name: newName };
                    }
                    return imgProj;
                });
                return { ...prop, imageProjects: updatedImageProjects };
            }
            return prop;
        });
        return { ...prev, propertyListings: updatedListings };
    });
  }, []);
  
  // Expose the active version index for the editor to use
  const activeImageProject = state.propertyListings.find(p => p.id === state.activePropertyId)?.imageProjects.find(ip => ip.id === state.activeImageProjectId);
  const derivedActiveVersion = activeImageProject?.versions[state.activeVersionIndex];

  return {
    state,
    createPropertyFromFiles,
    importFromUrl,
    addImageProjectsToProperty,
    sendMessage,
    handlePresetSubmit,
    setActiveProperty,
    setActiveImageProject,
    toggleSaveVersion,
    addWatermark,
    goToNextVersion,
    goToPrevVersion,
    renameProperty,
    renameImageProject,
    activeVersionIndex: state.activeVersionIndex,
    derivedActiveVersion,
  };
};
