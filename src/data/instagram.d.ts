export interface InstagramPost {
  id: string;
  media_type: "IMAGE" | "CAROUSEL_ALBUM" | "VIDEO";
  media_url: string;
  thumbnail_url?: string;
  permalink: string;
  caption?: string;
  timestamp: string;
}

export interface InstagramData {
  username: string;
  posts: InstagramPost[];
}

declare const data: InstagramData;
export default data;
