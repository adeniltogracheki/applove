const API_BASE_URL = '/api';

export const generateDateIdea = async (): Promise<string> => {
  try {
    const response = await fetch(`${API_BASE_URL}/generate-idea`);
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'A resposta da rede não foi ok.');
    }
    const data = await response.json();
    return data.idea;
  } catch (error) {
    console.error("Erro ao gerar ideia de encontro:", error);
    return "Desculpe, não foi possível gerar uma ideia agora.";
  }
};

export const generateCoupleQuestion = async (): Promise<string> => {
  try {
    const response = await fetch(`${API_BASE_URL}/generate-question`);
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'A resposta da rede não foi ok.');
    }
    const data = await response.json();
    return data.question;
  } catch (error) {
    console.error("Erro ao gerar pergunta para o casal:", error);
    return "Desculpe, não foi possível gerar uma pergunta agora.";
  }
};
