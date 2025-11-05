import type { Project } from '../types';

const STORAGE_KEY = 'propertylens_projects';

export const storageService = {
  saveProjects: (projects: Project[]): void => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(projects));
    } catch (error) {
      console.error('Failed to save projects:', error);
    }
  },

  loadProjects: (): Project[] => {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Failed to load projects:', error);
      return [];
    }
  },

  clearProjects: (): void => {
    localStorage.removeItem(STORAGE_KEY);
  }
};
