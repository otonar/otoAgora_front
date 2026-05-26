export interface User {
  id: string;
  username: string;
  email: string;
}

export interface Topic {
  id: string;
  title: string;
  description: string;
  createdBy: string;
  createdAt: string;
  thesesCount?: number;
}

export interface Thesis {
  id: string;
  topicId: string;
  authorId: string;
  perspectiveId: string | null;
  content: string;
  createdAt: string;
  endorseCount?: number;
}

export interface Argument {
  id: string;
  thesisId: string;
  parentId: string | null;
  authorId: string;
  content: string;
  stance: 'SUPPORT' | 'OPPOSE' | 'NEUTRAL';
  createdAt: string;
  endorseCount?: number;
}

export interface Perspective {
  id: string;
  name: string;
  description: string;
  createdBy: string;
  createdAt: string;
  followerCount?: number;
  thesesCount?: number;
}

export interface FeedItem {
  id: string;
  topicId: string;
  topicTitle: string;
  authorId: string;
  perspectiveId: string | null;
  perspectiveName: string | null;
  content: string;
  createdAt: string;
  endorseCount: number;
}
