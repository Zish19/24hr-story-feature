export interface Story {
  id: string;          // uuid
  imageBase64: string; // resized, compressed
  createdAt: number;   // epoch ms
  authorLabel?: string;// optional, for multi-story-per-user grouping later
  seen?: boolean;      // whether the story has been viewed
}
