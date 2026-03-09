
export interface Repository {
  id: string;
  name: string;
  owner: string;
  description: string;
  language: string;
  stars: number;
  updatedAt: string;
}

export interface FileNode {
  name: string;
  path: string;
  type: 'file' | 'folder';
  children?: FileNode[];
  content?: string;
  isLoaded?: boolean;
}

// We no longer rely on static mock data for the viewer, 
// but we keep the interfaces for type safety.
