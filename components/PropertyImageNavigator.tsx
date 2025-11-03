import React from 'react';
import type { ImageProject } from '../types';

interface PropertyImageNavigatorProps {
    imageProjects: ImageProject[];
    activeImageProjectId: string;
    onSelect: (imageProjectId: string) => void;
}

export const PropertyImageNavigator: React.FC<PropertyImageNavigatorProps> = ({ imageProjects, activeImageProjectId, onSelect }) => {
    return (
        <div className="flex-shrink-0 bg-gray-800/50 border-b border-gray-700 p-2">
            <div className="flex items-center space-x-3 overflow-x-auto" style={{ scrollbarWidth: 'none' }}>
                {imageProjects.map(ip => {
                    const isActive = ip.id === activeImageProjectId;
                    const coverImage = ip.versions[0]?.dataUrl;

                    return (
                        <button
                            key={ip.id}
                            onClick={() => onSelect(ip.id)}
                            className={`flex-shrink-0 w-28 h-20 rounded-md overflow-hidden relative group transition-all duration-200 ${isActive ? 'ring-2 ring-indigo-500' : 'hover:ring-2 hover:ring-indigo-500/50'}`}
                            title={ip.name}
                        >
                            {coverImage && (
                                <img src={coverImage} alt={ip.name} className="w-full h-full object-cover" />
                            )}
                            <div className={`absolute inset-0 bg-black/50 ${isActive ? 'opacity-0' : 'opacity-100 group-hover:opacity-0'} transition-opacity`}></div>
                            <div className="absolute bottom-0 left-0 w-full p-1.5 bg-gradient-to-t from-black/80 to-transparent">
                                <p className="text-xs text-white truncate">{ip.name}</p>
                            </div>
                        </button>
                    )
                })}
            </div>
        </div>
    );
};
