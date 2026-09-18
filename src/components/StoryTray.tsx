import React, { useRef } from 'react';
import type { Story } from '../types';
import styles from './StoryTray.module.css';

interface StoryTrayProps {
  stories: Story[];
  onAddStory: (file: File) => void;
  onStoryClick: (index: number) => void;
  error?: string | null;
}

export const StoryTray: React.FC<StoryTrayProps> = ({ stories, onAddStory, onStoryClick, error }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleAddClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onAddStory(file);
    }
    e.target.value = '';
  };

  return (
    <div className={styles.container}>
      {error && <div className={styles.errorBanner}>{error}</div>}
      <div className={styles.tray}>
        <div className={styles.addItem} onClick={handleAddClick}>
          <div className={styles.addIcon}>+</div>
          <span className={styles.addText}>Add Story</span>
        </div>
        <input
          type="file"
          accept="image/*"
          ref={fileInputRef}
          style={{ display: 'none' }}
          onChange={handleFileChange}
        />
        
        {stories.map((story, index) => (
          <div 
            key={story.id} 
            className={styles.storyItem}
            onClick={() => onStoryClick(index)}
          >
            <div className={story.seen ? styles.seenRing : styles.avatarRing}>
              <img src={story.imageBase64} alt="Story" className={styles.avatarImage} />
            </div>
          </div>
        ))}
        {stories.length === 0 && (
          <div className={styles.emptyState}>
            No stories yet.
          </div>
        )}
      </div>
    </div>
  );
};
