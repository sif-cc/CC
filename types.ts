
export interface SubSectionItem {
  id: string;
  title: string;
  status: 'Ready' | 'Locked' | 'Completed';
  type?: string;
  url?: string;
  content?: string;
}

export interface Chapter {
  id: string;
  title: string;
  description?: string;
  items: SubSectionItem[];
}

export interface Section {
  id: string;
  title: string;
  description: string;
  chapters: Chapter[];
}

export interface SubSection {
  id: string;
  title: string;
  description: string;
  duration?: string;
  type: 'video' | 'reading' | 'quiz' | 'lab';
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  sections: Section[];
}

export interface Module {
  id: string;
  title: string;
  description: string;
  icon: string;
  color: string;
  subSections: SubSection[];
}

export interface Playlist {
  id: string;
  title: string;
  url: string;
  thumbnail: string;
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
}
