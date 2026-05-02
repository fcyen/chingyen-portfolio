export interface SubstackPost {
  title: string;
  link: string;
  pubDate: string;
  description: string;
}

declare const posts: SubstackPost[];
export default posts;
