import type { User, Partner } from '@/types';

const API_BASE_URL = '/api'; // URL relativa, o Traefik/Proxy do Vite vai rotear

export const login = async (username: string, password: string): Promise<User> => {
    const response = await fetch(`${API_BASE_URL}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
    });
    const data = await response.json();
    if (!response.ok) {
        throw new Error(data.message || 'Erro ao fazer login.');
    }
    return data;
};

export const signUp = async (username: string, password: string): Promise<User> => {
    const response = await fetch(`${API_BASE_URL}/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
    });
    const data = await response.json();
    if (!response.ok) {
        throw new Error(data.message || 'Erro ao criar conta.');
    }
    return data;
};

interface GoogleUser {
    email: string;
    name: string;
    picture: string;
}

export const loginOrSignUpWithGoogle = async (googleUser: GoogleUser): Promise<User> => {
    const response = await fetch(`${API_BASE_URL}/google-signin`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(googleUser),
    });
    const data = await response.json();
    if (!response.ok) {
        throw new Error(data.message || 'Erro ao entrar com Google.');
    }
    return data;
};

export const linkPartner = async (currentUser: User, partnerCode: string): Promise<User> => {
    const response = await fetch(`${API_BASE_URL}/link-partner`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ currentUser, partnerCode }),
    });
    const data = await response.json();
    if (!response.ok) {
        throw new Error(data.message || 'Erro ao vincular parceiro.');
    }
    return data;
};

export const setAnniversary = async (userCode: string, anniversaryDate: string): Promise<User> => {
    const response = await fetch(`${API_BASE_URL}/user/anniversary`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userCode, anniversaryDate }),
    });
    const data = await response.json();
    if (!response.ok) {
        throw new Error(data.message || 'Erro ao salvar data.');
    }
    return data;
};

export const getPartner = async (userCode: string): Promise<Partner> => {
    const response = await fetch(`${API_BASE_URL}/partner/${userCode}`);
     const data = await response.json();
    if (!response.ok) {
        throw new Error(data.message || 'Erro ao buscar parceiro.');
    }
    return data;
};
