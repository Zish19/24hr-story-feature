# 24hr Story Feature

A client-side only React application that replicates the 24-hour disappearing "Stories" feature found in Instagram and WhatsApp.

## Features

- **Ephemeral Storage**: Stories are stored locally as Base64 strings and automatically expire and disappear after 24 hours.
- **Image Processing**: Automatically resizes uploaded images to maintain aspect ratio (max 1080x1920) before saving.
- **Story Viewer**: Full-screen immersive viewer with a 3-second auto-advance progress bar per story.
- **Interaction**: 
  - Click the left/right sides of the screen to navigate.
  - Swipe left/right on touch devices.
  - Hold down to pause the progress timer.
- **Visual Cues**: Colorful gradient ring for unwatched stories, which turns grey once viewed.

## Tech Stack

- **Framework**: React with TypeScript
- **Bundler**: Vite
- **Styling**: Vanilla CSS Modules (Dark Mode Theme)
- **State/Persistence**: React State & `localStorage`

## Quick Start

1. Clone the repository:
   ```bash
   git clone https://github.com/Zish19/24hr-story-feature.git
   ```
2. Navigate into the directory and install dependencies:
   ```bash
   cd 24hr-story-feature
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```

## Requirements & Constraints Met
- Client-side only (no backend/database used).
- Fully responsive design.
- Image dimensions constrained to max 1080px x 1920px without aspect ratio distortion.
- Graceful error handling for quota constraints.
