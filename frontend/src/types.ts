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
  username: string; // Será o e-mail para usuários do Google
  displayName: string;
  pictureUrl?: string;
  uniqueCode: string;
  linkedPartnerCode?: string;
  anniversaryDate?: string; // Formato YYYY-MM-DD
}

export interface Partner {
    username: string;
    displayName: string;
    pictureUrl?: string;
}