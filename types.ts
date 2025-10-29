export type View = 'dashboard' | 'lovejar' | 'qa' | 'memories' | 'chat' | 'location' | 'games' | 'pet' | 'shop';
export type AuthView = 'welcome' | 'login' | 'signup';

export interface LoveJarItem {
  id: number;
  text: string;
}

export interface MemoryItem {
  id: number;
  src: string;
}

export interface User {
  username: string; // Will be email for Google users
  displayName?: string;
  pictureUrl?: string;
  uniqueCode: string;
  linkedPartnerCode?: string;
}
