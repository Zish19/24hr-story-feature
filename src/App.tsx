import { useState, useEffect } from 'react';
import { StoryTray } from './components/StoryTray';
import { StoryViewer } from './components/StoryViewer';
import { processImage } from './utils/imageProcessing';
import { pruneStories, saveStory, updateStory } from './utils/storyStorage';
import type { Story } from './types';
import './App.css';

function App() {
  const [stories, setStories] = useState<Story[]>([]);
  const [viewerIndex, setViewerIndex] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  const loadStories = () => {
    const validStories = pruneStories();
    setStories(validStories);
  };

  useEffect(() => {
    loadStories();

    const interval = setInterval(() => {
      loadStories();
    }, 60000);

    return () => clearInterval(interval);
  }, []);

  const handleAddStory = async (file: File) => {
    setError(null);
    try {
      const base64 = await processImage(file);
      const newStory: Story = {
        id: crypto.randomUUID(),
        imageBase64: base64,
        createdAt: Date.now(),
      };
      
      saveStory(newStory);
      loadStories();
    } catch (err: any) {
      setError(err.message || 'Failed to process image');
    }
  };

  const handleStoryClick = (index: number) => {
    setViewerIndex(index);
  };

  const handleCloseViewer = () => {
    setViewerIndex(null);
  };

  const handleStoryViewed = (id: string) => {
    updateStory(id, { seen: true });
    setStories(prev => prev.map(s => s.id === id ? { ...s, seen: true } : s));
  };

  return (
    <div className="appContainer">
      <StoryTray 
        stories={stories} 
        onAddStory={handleAddStory}
        onStoryClick={handleStoryClick}
        error={error}
      />
      
      <main className="mainContent">
        <h1>Stories Feature Clone</h1>
        <p>Upload an image above to add a story. It will expire in 24 hours.</p>
        <p>Supports image resizing, localStorage persistence, and swiping.</p>
      </main>

      {viewerIndex !== null && (
        <StoryViewer 
          stories={stories}
          initialIndex={viewerIndex}
          onClose={handleCloseViewer}
          onStoryViewed={handleStoryViewed}
        />
      )}
    </div>
  );
}

export default App;
