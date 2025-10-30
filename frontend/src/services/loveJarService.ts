import type { LoveJarItem } from '@/types';

const API_BASE_URL = '/api';

export const getLoveJarItems = async (userCode: string): Promise<LoveJarItem[]> => {
    const response = await fetch(`${API_BASE_URL}/love-jar/${userCode}`);
    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Erro ao buscar itens do jarrinho.');
    }
    return response.json();
};

export const addLoveJarItem = async (userCode: string, text: string): Promise<LoveJarItem> => {
    const response = await fetch(`${API_BASE_URL}/love-jar`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userCode, text }),
    });
    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Erro ao adicionar item.');
    }
    return response.json();
};

export const deleteLoveJarItem = async (itemId: number): Promise<void> => {
    const response = await fetch(`${API_BASE_URL}/love-jar/${itemId}`, {
        method: 'DELETE',
    });
    if (!response.ok && response.status !== 204) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Erro ao deletar item.');
    }
};
