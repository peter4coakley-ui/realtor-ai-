import React, { useState, useMemo } from 'react';
import type { Project } from '../types';
import { Header } from '../components/Header';
import { UploadIcon, LinkIcon } from '../components/icons';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';

const MAIN_FILE_INPUT_ID = 'main-image-upload';

interface HomePageProps {
  propertyListings: Project[];
  onCreateProperty: (files: File[]) => void;
  onSelectProperty: (propertyId: string) => void;
  onImportFromUrl: (url: string) => void;
  isLoading: boolean;
  error: string | null;
}

const PropertyCard: React.FC<{ property: Project, onSelect: () => void }> = ({ property, onSelect }) => {
  const firstImageProject = property.imageProjects[0];
  const savedVersion = firstImageProject?.versions.find(v => v.isSaved);
  const coverImage = savedVersion || firstImageProject?.versions[0];
  
  return (
    <button onClick={onSelect} className="group relative block w-full aspect-[4/3] rounded-lg overflow-hidden bg-gray-800 hover:ring-2 hover:ring-teal-500 transition-all duration-200">
      {coverImage && (
        <img src={coverImage.dataUrl} alt={property.name} className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" />
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
      <div className="absolute bottom-0 left-0 p-4 w-full">
        <h3 className="text-white font-semibold truncate" title={property.name}>{property.name}</h3>
        <p className="text-sm text-gray-300">{property.imageProjects.length} photo{property.imageProjects.length !== 1 ? 's' : ''}</p>
      </div>
    </button>
  );
};

const AppDashboard: React.FC<HomePageProps> = ({ propertyListings: projects, onCreateProperty, onSelectProperty, onImportFromUrl, isLoading, error }) => {
  const [urlInput, setUrlInput] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      onCreateProperty(Array.from(e.target.files));
      if (e.target) e.target.value = '';
    }
  };

  const handleUrlImport = (e: React.FormEvent) => {
    e.preventDefault();
    if (urlInput.trim()) {
      onImportFromUrl(urlInput);
    }
  };

  const handleNewListingClick = () => {
    document.getElementById(MAIN_FILE_INPUT_ID)?.click();
  };
  
  const filteredListings = useMemo(() => {
    if (!searchTerm) return projects;
    return projects.filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase()));
  }, [projects, searchTerm]);

  return (
    <div className="flex flex-col h-screen bg-gray-900 text-gray-200">
      <input
        id={MAIN_FILE_INPUT_ID}
        type="file"
        onChange={handleImageUpload}
        className="hidden"
        accept="image/*"
        multiple
      />
      <Header onNewListing={handleNewListingClick} currentView="home" />
      <main className="flex-grow overflow-y-auto p-8">
        {isLoading && (
            <div className="flex flex-col items-center justify-center h-full">
                <div className="text-center p-8">
                    <div className="w-16 h-16 border-4 border-dashed border-teal-400 border-t-transparent rounded-full animate-spin mx-auto"></div>
                    <h2 className="mt-4 text-2xl font-bold">Importing Project...</h2>
                    <p className="mt-2 text-gray-400">Please wait while we fetch the project details and images.</p>
                </div>
            </div>
        )}
        {!isLoading && error && (
            <div className="flex flex-col items-center justify-center h-full">
                <div className="text-center p-8 bg-red-900/20 border border-red-500/50 rounded-lg max-w-lg mx-auto">
                    <h2 className="text-2xl font-bold text-red-400">Import Failed</h2>
                    <p className="mt-2 text-gray-300">{error}</p>
                    <Button onClick={() => window.location.reload()} variant="destructive" className="mt-4">Try Again</Button>
                </div>
            </div>
        )}
        {!isLoading && !error && projects.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full">
            <div className="text-center p-8 border-2 border-dashed border-gray-600 rounded-2xl max-w-2xl mx-auto">
              <UploadIcon className="w-16 h-16 mx-auto text-gray-500" />
              <h2 className="mt-4 text-3xl font-bold">Welcome to PropertyLens AI</h2>
              <p className="mt-2 text-gray-400">Create your first project by uploading photos or importing from a web link.</p>
              <label htmlFor={MAIN_FILE_INPUT_ID} className="mt-6 inline-block bg-teal-500 hover:bg-teal-600 text-white font-semibold py-3 px-6 rounded-lg cursor-pointer transition-colors">
                Select Images to Start
              </label>
              <div className="my-6 text-gray-500">OR</div>
              <form onSubmit={handleUrlImport} className="flex flex-col sm:flex-row items-center gap-3 justify-center">
                <Input
                    type="url"
                    value={urlInput}
                    onChange={(e) => setUrlInput(e.target.value)}
                    placeholder="Paste a URL to import images from"
                    className="w-full sm:w-80"
                    disabled={isLoading}
                />
                <Button type="submit" disabled={isLoading || !urlInput.trim()} className="w-full sm:w-auto">
                    <LinkIcon className="w-5 h-5 mr-2"/>
                    Import from Link
                </Button>
              </form>
            </div>
          </div>
        )}
        {!isLoading && !error && projects.length > 0 && (
          <div>
            <div className="flex flex-col sm:flex-row justify-between sm:items-center mb-6 gap-4">
                <h1 className="text-3xl font-bold">Your Projects</h1>
                <Input 
                    type="search"
                    placeholder="Search by project name..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full sm:w-64"
                />
            </div>
            {filteredListings.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                {filteredListings.map(listing => (
                    <PropertyCard key={listing.id} property={listing} onSelect={() => onSelectProperty(listing.id)} />
                ))}
                </div>
            ) : (
                <div className="text-center py-16 text-gray-500">
                    <p>No properties match your search.</p>
                </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
};

export default AppDashboard;