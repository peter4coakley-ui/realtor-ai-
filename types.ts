import type { ComponentType } from 'react';

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  image?: string; // data URL of the generated image
  versionId?: string; // ID of the image version associated with this message
}

export interface ImageVersion {
  id:string;
  dataUrl: string;
  prompt: string;
  type: 'original' | 'preset' | 'chat' | 'inpaint';
  timestamp: string;
  isNew?: boolean; // For optimistic UI updates
  isSaved?: boolean; // For saved/favorite versions
}

export interface ImageProject {
  id: string;
  name: string;
  versions: ImageVersion[];
  chatHistory: ChatMessage[];
  originalFile: File;
}

export interface PropertyListing {
    id: string;
    address: string;
    imageProjects: ImageProject[];
}


export interface EditAgent {
  id: 'room_clearout' | 'flooring_upgrade' | 'repaint_walls' | 'declutter' | 'twilight_conversion' | 'exterior_boost' | 'repaint_exterior';
  name: string;
  description: string;
  prompt: string; // Can be a template string with '{userInput}'
  icon: ComponentType<{ className?: string }>;
  category: 'Interior' | 'Exterior';
  requiresInput: boolean;
  inputPlaceholder: string;
}
