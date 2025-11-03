import React from 'react';
import { LogoIcon, PlusCircleIcon, LayoutGridIcon, ChevronLeftIcon, ChevronUpIcon, ChevronDownIcon } from './icons';
import { Button } from './ui/Button';

interface HeaderProps {
    onNewListing?: () => void;
    onGoHome?: () => void;
    onGoToProperty?: () => void;
    onAddPhotos?: () => void;
    currentView: 'home' | 'property' | 'editor';
    isNavigatorVisible?: boolean;
    onToggleNavigator?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ 
    onNewListing, 
    onGoHome, 
    onGoToProperty, 
    onAddPhotos, 
    currentView,
    isNavigatorVisible,
    onToggleNavigator
}) => {
  return (
    <header className="flex items-center justify-between p-4 border-b border-gray-700 bg-gray-900/50 backdrop-blur-sm z-20 flex-shrink-0">
      <div className="flex items-center">
        <LogoIcon className="w-8 h-8 text-indigo-400" />
        <h1 className="text-xl font-bold ml-3">RealtorAI Studio</h1>
      </div>
      <div className="flex items-center gap-4">
        {currentView === 'editor' && (
          <>
            {onGoToProperty && (
              <Button onClick={onGoToProperty} variant="ghost">
                  <ChevronLeftIcon className="w-5 h-5 mr-2" />
                  Back to Property
              </Button>
            )}
            {onToggleNavigator && (
              <Button 
                onClick={onToggleNavigator} 
                variant="ghost" 
                size="icon" 
                title={isNavigatorVisible ? 'Hide Photo Gallery' : 'Show Photo Gallery'}
              >
                  {isNavigatorVisible ? <ChevronUpIcon className="w-5 h-5" /> : <ChevronDownIcon className="w-5 h-5" />}
              </Button>
            )}
          </>
        )}
        {currentView === 'property' && onGoHome && (
            <Button onClick={onGoHome} variant="ghost">
                <LayoutGridIcon className="w-5 h-5 mr-2" />
                Dashboard
            </Button>
        )}
        {currentView === 'property' && onAddPhotos && (
            <Button onClick={onAddPhotos} variant="default">
                <PlusCircleIcon className="w-5 h-5 mr-2" />
                Add Photos
            </Button>
        )}
        {currentView === 'home' && onNewListing && (
            <Button onClick={onNewListing} variant="default">
                <PlusCircleIcon className="w-5 h-5 mr-2" />
                New Property
            </Button>
        )}
      </div>
    </header>
  );
};
