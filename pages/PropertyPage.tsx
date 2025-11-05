import React, { useState } from 'react';
import type { Project, ImageProject } from '../types';
import { Header } from '../components/Header';
import { UploadIcon, EditIcon, CheckIcon } from '../components/icons';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';

const PROPERTY_FILE_INPUT_ID = 'property-image-upload';

interface PropertyPageProps {
  property: Project;
  onSelectImageProject: (imageProjectId: string) => void;
  onAddPhotos: (files: File[]) => void;
  onGoHome: () => void;
  isLoading: boolean;
  onRenameProperty: (propertyId: string, newName: string) => void;
  onRenameImageProject: (imageProjectId: string, newName: string) => void;
}

const ImageProjectCard: React.FC<{ 
    imageProject: ImageProject, 
    onSelect: () => void,
    onRename: (newName: string) => void 
}> = ({ imageProject, onSelect, onRename }) => {
  const savedVersion = imageProject.versions.find(v => v.isSaved);
  const coverImage = savedVersion || imageProject.versions[0];
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(imageProject.name);

  const handleRename = () => {
    if (name.trim() && name.trim() !== imageProject.name) {
      onRename(name.trim());
    }
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleRename();
    } else if (e.key === 'Escape') {
      setName(imageProject.name);
      setIsEditing(false);
    }
  };
  
  return (
    <div className="group relative w-full aspect-[4/3] rounded-lg overflow-hidden bg-gray-800 transition-all duration-200">
      <button onClick={onSelect} className="w-full h-full block">
        {coverImage && (
            <img src={coverImage.dataUrl} alt={imageProject.name} className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" />
        )}
      </button>
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent pointer-events-none" />
      <div className="absolute bottom-0 left-0 p-3 w-full">
        {isEditing ? (
            <div className="flex items-center gap-2" onClick={e => e.stopPropagation()}>
                <Input 
                    autoFocus
                    value={name}
                    onChange={e => setName(e.target.value)}
                    onKeyDown={handleKeyDown}
                    onBlur={handleRename}
                    className="h-8 text-sm"
                />
                <Button size="icon" className="h-8 w-8 flex-shrink-0" onClick={handleRename}>
                    <CheckIcon className="w-4 h-4" />
                </Button>
            </div>
        ) : (
            <div className="flex items-center justify-between">
                <h3 className="text-white text-sm font-semibold truncate" title={imageProject.name}>{imageProject.name}</h3>
                <Button 
                    size="icon" 
                    variant="ghost" 
                    className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity" 
                    onClick={(e) => {
                        e.stopPropagation();
                        setIsEditing(true);
                    }}
                    title="Rename Image"
                >
                    <EditIcon className="w-3 h-3" />
                </Button>
            </div>
        )}
        <p className="text-xs text-gray-300">{imageProject.versions.length} version{imageProject.versions.length !== 1 ? 's' : ''}</p>
      </div>
    </div>
  );
};

const PropertyPage: React.FC<PropertyPageProps> = ({ 
    property, onSelectImageProject, onAddPhotos, onGoHome, isLoading,
    onRenameProperty, onRenameImageProject
}) => {
  
  const [isEditingProperty, setIsEditingProperty] = useState(false);
  const [propertyName, setPropertyName] = useState(property.name);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      onAddPhotos(Array.from(e.target.files));
      if (e.target) e.target.value = '';
    }
  };

  const handleAddPhotosClick = () => {
    document.getElementById(PROPERTY_FILE_INPUT_ID)?.click();
  };
  
  const handleRenameProperty = () => {
    if (propertyName.trim() && propertyName.trim() !== property.name) {
      onRenameProperty(property.id, propertyName.trim());
    }
    setIsEditingProperty(false);
  };
  
  const handlePropertyKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleRenameProperty();
    } else if (e.key === 'Escape') {
      setPropertyName(property.name);
      setIsEditingProperty(false);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gray-900 text-gray-200">
      <input
        id={PROPERTY_FILE_INPUT_ID}
        type="file"
        onChange={handleImageUpload}
        className="hidden"
        accept="image/*"
        multiple
      />
      <Header onGoHome={onGoHome} onAddPhotos={handleAddPhotosClick} currentView="project" />
      <main className="flex-grow overflow-y-auto p-8">
        <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              {isEditingProperty ? (
                <div className="flex items-center gap-2">
                  <Input 
                    autoFocus
                    value={propertyName}
                    onChange={e => setPropertyName(e.target.value)}
                    onKeyDown={handlePropertyKeyDown}
                    onBlur={handleRenameProperty}
                    className="h-10 text-3xl font-bold w-full sm:w-96"
                  />
                  <Button size="icon" className="h-10 w-10 flex-shrink-0" onClick={handleRenameProperty}>
                    <CheckIcon className="w-5 h-5" />
                  </Button>
                </div>
              ) : (
                <>
                  <h1 className="text-3xl font-bold" title={property.name}>{property.name}</h1>
                  <Button size="icon" variant="ghost" onClick={() => setIsEditingProperty(true)} title="Rename Property">
                    <EditIcon className="w-5 h-5 text-gray-400 hover:text-white" />
                  </Button>
                </>
              )}
            </div>
            {isLoading && <div className="w-6 h-6 border-2 border-dashed border-indigo-400 border-t-transparent rounded-full animate-spin"></div>}
        </div>
        
        {property.imageProjects.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {property.imageProjects.map(ip => (
              <ImageProjectCard 
                key={ip.id} 
                imageProject={ip} 
                onSelect={() => onSelectImageProject(ip.id)}
                onRename={(newName) => onRenameImageProject(ip.id, newName)}
              />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-3/4">
            <div className="text-center p-8 border-2 border-dashed border-gray-600 rounded-2xl max-w-lg mx-auto">
              <UploadIcon className="w-12 h-12 mx-auto text-gray-500" />
              <h2 className="mt-4 text-2xl font-bold">This property has no photos yet.</h2>
              <p className="mt-2 text-gray-400">Get started by adding photos to this property listing.</p>
              {/* FIX: Use the imported Button component. */}
              <Button onClick={handleAddPhotosClick} className="mt-6">
                Add Photos
              </Button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default PropertyPage;
