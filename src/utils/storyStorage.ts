import type { Story } from '../types';

const STORAGE_KEY = 'stories_v1';
const EXPIRY_TIME_MS = 24 * 60 * 60 * 1000; // 24 hours

export const getStories = (): Story[] => {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) return [];
    
    const parsed = JSON.parse(data);
    if (!Array.isArray(parsed)) return [];
    return parsed as Story[];
  } catch (error) {
    console.error('Error reading stories from localStorage:', error);
    return [];
  }
};

export const pruneStories = (): Story[] => {
  const stories = getStories();
  const now = Date.now();
  const validStories = stories.filter(story => now - story.createdAt <= EXPIRY_TIME_MS);
  
  if (validStories.length !== stories.length) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(validStories));
    } catch (e) {
      console.error('Failed to update localStorage after pruning', e);
    }
  }
  
  return validStories;
};

export const saveStory = (story: Story): void => {
  const stories = pruneStories();
  stories.push(story);
  
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(stories));
  } catch (e: any) {
    if (e.name === 'QuotaExceededError' || e.code === 22) {
      throw new Error('Local storage quota exceeded. Please wait for stories to expire or clear some data.');
    }
    throw new Error('Failed to save story.');
  }
};

export const updateStory = (id: string, updates: Partial<Story>): void => {
  const stories = pruneStories();
  const index = stories.findIndex(s => s.id === id);
  if (index !== -1) {
    stories[index] = { ...stories[index], ...updates };
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(stories));
    } catch (e) {
      console.error('Failed to update story in localStorage', e);
    }
  }
};
