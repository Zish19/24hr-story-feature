import React, { useState, useEffect, useRef, useCallback } from 'react';
import type { Story } from '../types';
import styles from './StoryViewer.module.css';

interface StoryViewerProps {
  stories: Story[];
  initialIndex: number;
  onClose: () => void;
  onStoryViewed: (id: string) => void;
}

export const StoryViewer: React.FC<StoryViewerProps> = ({ stories, initialIndex, onClose, onStoryViewed }) => {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [isPaused, setIsPaused] = useState(false);
  const [progress, setProgress] = useState(0);
  
  useEffect(() => {
    const currentStory = stories[currentIndex];
    if (currentStory && !currentStory.seen) {
      onStoryViewed(currentStory.id);
    }
  }, [currentIndex, stories, onStoryViewed]);
  
  const requestRef = useRef<number>(0);
  const startTimeRef = useRef<number | null>(null);
  const pausedTimeRef = useRef<number>(0);
  const clickStartTimeRef = useRef<number>(0);
  const STORY_DURATION = 3000;

  const nextStory = useCallback(() => {
    if (currentIndex < stories.length - 1) {
      setCurrentIndex(prev => prev + 1);
      setProgress(0);
      startTimeRef.current = null;
      pausedTimeRef.current = 0;
    } else {
      onClose();
    }
  }, [currentIndex, stories.length, onClose]);

  const prevStory = useCallback(() => {
    if (currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
      setProgress(0);
      startTimeRef.current = null;
      pausedTimeRef.current = 0;
    }
  }, [currentIndex]);

  const animate = useCallback((time: number) => {
    if (isPaused) {
      requestRef.current = requestAnimationFrame(animate);
      return;
    }

    if (startTimeRef.current === null) {
      startTimeRef.current = time - pausedTimeRef.current;
    }

    const elapsed = time - startTimeRef.current;
    const currentProgress = Math.min((elapsed / STORY_DURATION) * 100, 100);
    
    setProgress(currentProgress);

    if (currentProgress >= 100) {
      nextStory();
    } else {
      requestRef.current = requestAnimationFrame(animate);
    }
  }, [isPaused, nextStory]);

  useEffect(() => {
    requestRef.current = requestAnimationFrame(animate);
    return () => {
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current);
      }
    };
  }, [animate]);

  const handlePause = () => {
    setIsPaused(true);
    pausedTimeRef.current = (progress / 100) * STORY_DURATION;
    startTimeRef.current = null;
  };

  const handleResume = () => {
    setIsPaused(false);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') prevStory();
      else if (e.key === 'ArrowRight') nextStory();
      else if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [prevStory, nextStory, onClose]);

  const handleClick = (clientX: number) => {
    const oneThird = window.innerWidth / 3;
    if (clientX < oneThird) prevStory();
    else nextStory();
  };

  const handleMouseDown = () => {
    clickStartTimeRef.current = Date.now();
    handlePause();
  };

  const handleMouseUp = (e: React.MouseEvent) => {
    handleResume();
    const duration = Date.now() - clickStartTimeRef.current;
    if (duration < 200) {
      handleClick(e.clientX);
    }
  };

  const touchStartRef = useRef<{ x: number; y: number } | null>(null);

  const handleTouchStart = (e: React.TouchEvent) => {
    clickStartTimeRef.current = Date.now();
    handlePause();
    touchStartRef.current = {
      x: e.touches[0].clientX,
      y: e.touches[0].clientY,
    };
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    handleResume();
    if (!touchStartRef.current) return;

    const touchEndX = e.changedTouches[0].clientX;
    const touchEndY = e.changedTouches[0].clientY;
    const dx = touchEndX - touchStartRef.current.x;
    const dy = touchEndY - touchStartRef.current.y;

    if (Math.abs(dx) > Math.abs(dy)) {
      if (Math.abs(dx) > 50) {
        if (dx > 0) prevStory();
        else nextStory();
      } else {
        const duration = Date.now() - clickStartTimeRef.current;
        if (duration < 200) handleClick(touchEndX);
      }
    } else {
      if (dy > 50) onClose();
      else {
        const duration = Date.now() - clickStartTimeRef.current;
        if (duration < 200) handleClick(touchEndX);
      }
    }
    touchStartRef.current = null;
  };

  if (!stories[currentIndex]) return null;

  return (
    <div className={styles.overlay}>
      <div 
        className={styles.viewerContainer}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleResume}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        onTouchCancel={handleResume}
      >
        <div className={styles.progressContainer}>
          {stories.map((story, idx) => {
            let width = '0%';
            if (idx < currentIndex) width = '100%';
            else if (idx === currentIndex) width = `${progress}%`;

            return (
              <div key={story.id} className={styles.progressBarWrapper}>
                <div 
                  className={styles.progressBarFill} 
                  style={{ width }} 
                />
              </div>
            );
          })}
        </div>

        <img 
          src={stories[currentIndex].imageBase64} 
          alt="Story" 
          className={styles.storyImage}
          draggable="false"
        />
        
        <button 
          className={styles.closeButton} 
          onClick={(e) => { e.stopPropagation(); onClose(); }}
        >
          &times;
        </button>
      </div>
    </div>
  );
};
