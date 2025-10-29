import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY! });

export const generateDateIdea = async (): Promise<string> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: 'Gere uma única ideia de encontro romântico, criativo e curto para um casal. Mantenha em menos de 15 palavras e formule como uma sugestão. Exemplo: "Ir observar as estrelas em um parque juntos."'
    });
    return response.text;
  } catch (error) {
    console.error("Erro ao gerar ideia de encontro:", error);
    return "Não foi possível gerar uma ideia. Verifique sua chave de API e tente novamente.";
  }
};

export const generateCoupleQuestion = async (): Promise<string> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: 'Gere uma pergunta perspicaz e divertida para um casal fazer um ao outro para aprofundar sua conexão. A pergunta deve ser aberta e não uma pergunta de sim/não.'
    });
    return response.text;
  } catch (error) {
    console.error("Erro ao gerar pergunta para casal:", error);
    return "Não foi possível gerar uma pergunta. Verifique sua chave de API e tente novamente.";
  }
};