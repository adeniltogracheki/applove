import type { User } from '../types';

const USERS_KEY = 'loveSpaceUsers';
const CURRENT_USER_KEY = 'loveSpaceCurrentUser';

// Estrutura do usuário armazenado internamente
interface StoredUser {
  passwordHash?: string; // Opcional para login com Google
  authMethod: 'manual' | 'google';
  uniqueCode: string;
  linkedPartnerCode?: string;
  displayName?: string;
  pictureUrl?: string;
}

// Helper para obter todos os usuários do localStorage
const getUsers = (): Record<string, StoredUser> => {
  try {
    const users = localStorage.getItem(USERS_KEY);
    return users ? JSON.parse(users) : {};
  } catch (e) {
    return {};
  }
};

// Helper para salvar todos os usuários no localStorage
const saveUsers = (users: Record<string, any>) => {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
};

// Gera um código único simples
const generateUniqueCode = (): string => {
  return Math.random().toString(36).substring(2, 8).toUpperCase();
};

// Função de "hash" de senha simples (NÃO USE EM PRODUÇÃO)
const fakeHash = (password: string): string => `hashed_${password}`;

export const signUp = async (username: string, password: string): Promise<User | null> => {
  const users = getUsers();
  if (users[username]) {
    throw new Error('Nome de usuário já existe.');
  }

  const newUser: StoredUser = {
    passwordHash: fakeHash(password),
    uniqueCode: generateUniqueCode(),
    authMethod: 'manual',
    displayName: username,
  };

  users[username] = newUser;
  saveUsers(users);
  
  const user: User = { username, uniqueCode: newUser.uniqueCode, displayName: newUser.displayName };
  localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
  return user;
};

export const login = async (username: string, password: string): Promise<User | null> => {
  const users = getUsers();
  const storedUser = users[username];

  if (!storedUser || storedUser.authMethod !== 'manual' || storedUser.passwordHash !== fakeHash(password)) {
    throw new Error('Nome de usuário ou senha inválidos.');
  }

  const user: User = {
    username,
    uniqueCode: storedUser.uniqueCode,
    linkedPartnerCode: storedUser.linkedPartnerCode,
    displayName: storedUser.displayName,
    pictureUrl: storedUser.pictureUrl,
  };
  localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
  return user;
};

export const loginOrSignUpWithGoogle = async (googleUser: {email: string, name: string, picture: string}): Promise<User> => {
  const users = getUsers();
  const username = googleUser.email;
  let storedUser = users[username];

  if (!storedUser) {
    // Se o usuário não existe, cria uma nova conta para ele
    storedUser = {
      uniqueCode: generateUniqueCode(),
      authMethod: 'google',
      displayName: googleUser.name,
      pictureUrl: googleUser.picture,
    };
    users[username] = storedUser;
    saveUsers(users);
  } else if (storedUser.authMethod !== 'google') {
    // Opcional: Lidar com conflito de email se já existir uma conta manual
    throw new Error("Já existe uma conta com este e-mail. Tente fazer login com seu nome de usuário e senha.");
  }
  
  const user: User = {
    username,
    uniqueCode: storedUser.uniqueCode,
    linkedPartnerCode: storedUser.linkedPartnerCode,
    displayName: storedUser.displayName || googleUser.name,
    pictureUrl: storedUser.pictureUrl || googleUser.picture,
  };
  
  localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
  return user;
};


export const linkPartner = async (currentUser: User, partnerCode: string): Promise<User> => {
    const users = getUsers();
    let partnerUsername: string | null = null;

    // Encontra o parceiro pelo código
    for (const username in users) {
        if (users[username].uniqueCode === partnerCode.toUpperCase()) {
            partnerUsername = username;
            break;
        }
    }

    if (!partnerUsername || partnerUsername === currentUser.username) {
        throw new Error('Código de vínculo inválido ou pertence a você.');
    }
    
    // Atualiza ambos os usuários com os códigos vinculados
    users[currentUser.username].linkedPartnerCode = partnerCode.toUpperCase();
    users[partnerUsername].linkedPartnerCode = currentUser.uniqueCode;
    saveUsers(users);

    const updatedUser: User = { ...currentUser, linkedPartnerCode: partnerCode.toUpperCase() };
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(updatedUser));
    return updatedUser;
};


export const getCurrentUser = async (): Promise<User | null> => {
  try {
    const user = localStorage.getItem(CURRENT_USER_KEY);
    return user ? JSON.parse(user) : null;
  } catch (e) {
    return null;
  }
};

export const logout = () => {
  localStorage.removeItem(CURRENT_USER_KEY);
};