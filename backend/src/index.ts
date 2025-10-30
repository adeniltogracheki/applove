


import express, { Express } from 'express';
import cors from 'cors';
import bcrypt from 'bcryptjs';
import pool from './db';
import { GoogleGenAI } from "@google/genai";
import dotenv from 'dotenv';

dotenv.config();

// FIX: Explicitly type `app` as `Express` to resolve type inference issues with middleware.
const app: Express = express();
app.use(cors());
// FIX: Using `express.json()` and removing the named `json` import to resolve a TypeScript overload error with `app.use()`.
app.use(express.json());

// Inicializa o cliente da API Gemini
let ai: GoogleGenAI | null = null;
if (process.env.API_KEY) {
  ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
} else {
  console.warn("API_KEY do Gemini não encontrada no .env. As funcionalidades de IA estarão desabilitadas.");
}

const generateUniqueCode = (): string => Math.random().toString(36).substring(2, 8).toUpperCase();

const userFields = `
    username, 
    display_name AS "displayName", 
    picture_url AS "pictureUrl", 
    unique_code AS "uniqueCode", 
    linked_partner_code AS "linkedPartnerCode", 
    anniversary_date AS "anniversaryDate"
`;

// ROTA DE CADASTRO
app.post('/api/signup', async (req, res) => {
  const { username, password } = req.body;
  try {
    const userExists = await pool.query('SELECT * FROM users WHERE username = $1', [username]);
    if (userExists.rows.length > 0) {
      return res.status(409).json({ message: 'Nome de usuário já existe.' });
    }
    const passwordHash = await bcrypt.hash(password, 10);
    const uniqueCode = generateUniqueCode();
    const newUser = await pool.query(
      `INSERT INTO users (username, display_name, password_hash, auth_method, unique_code) 
       VALUES ($1, $2, $3, $4, $5) 
       RETURNING ${userFields}`,
      [username, username, passwordHash, 'manual', uniqueCode]
    );
    res.status(201).json(newUser.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erro no servidor' });
  }
});

// ROTA DE LOGIN
app.post('/api/login', async (req, res) => {
  const { username, password } = req.body;
  try {
    const result = await pool.query('SELECT * FROM users WHERE username = $1 AND auth_method = $2', [username, 'manual']);
    if (result.rows.length === 0) {
      return res.status(401).json({ message: 'Nome de usuário ou senha inválidos.' });
    }
    const user = result.rows[0];
    const isPasswordValid = await bcrypt.compare(password, user.password_hash);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Nome de usuário ou senha inválidos.' });
    }
    
    const userDataResult = await pool.query(`SELECT ${userFields} FROM users WHERE username = $1`, [username]);
    res.json(userDataResult.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erro no servidor' });
  }
});

// ROTA DE LOGIN/CADASTRO COM GOOGLE
app.post('/api/google-signin', async (req, res) => {
    const { email, name, picture } = req.body;
    try {
        let result = await pool.query('SELECT * FROM users WHERE username = $1', [email]);
        if (result.rows.length > 0) {
            const user = result.rows[0];
            if (user.auth_method !== 'google') {
                return res.status(409).json({ message: 'Já existe uma conta com este e-mail.' });
            }
        } else {
            const uniqueCode = generateUniqueCode();
            await pool.query(
                'INSERT INTO users (username, display_name, auth_method, picture_url, unique_code) VALUES ($1, $2, $3, $4, $5)',
                [email, name, 'google', picture, uniqueCode]
            );
        }
        const userData = await pool.query(`SELECT ${userFields} FROM users WHERE username = $1`, [email]);
        res.json(userData.rows[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Erro no servidor' });
    }
});


// ROTA PARA VINCULAR PARCEIRO
app.post('/api/link-partner', async (req, res) => {
    const { currentUser, partnerCode } = req.body;
    try {
        const partnerResult = await pool.query('SELECT * FROM users WHERE unique_code = $1', [partnerCode.toUpperCase()]);
        if (partnerResult.rows.length === 0 || partnerResult.rows[0].username === currentUser.username) {
            return res.status(404).json({ message: 'Código de vínculo inválido ou pertence a você.' });
        }

        await pool.query('UPDATE users SET linked_partner_code = $1 WHERE username = $2', [partnerCode.toUpperCase(), currentUser.username]);
        await pool.query('UPDATE users SET linked_partner_code = $1 WHERE unique_code = $2', [currentUser.uniqueCode, partnerCode.toUpperCase()]);
        
        const updatedUserResult = await pool.query(`SELECT ${userFields} FROM users WHERE username = $1`, [currentUser.username]);
        res.json(updatedUserResult.rows[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Erro ao vincular parceiro' });
    }
});

// ROTA PARA DEFINIR DATA DE ANIVERSÁRIO
app.post('/api/user/anniversary', async (req, res) => {
    const { userCode, anniversaryDate } = req.body;
    try {
        // Atualiza a data para o usuário atual e seu parceiro
        await pool.query('UPDATE users SET anniversary_date = $1 WHERE unique_code = $2 OR linked_partner_code = $2', [anniversaryDate, userCode]);
        
        const updatedUserResult = await pool.query(`SELECT ${userFields} FROM users WHERE unique_code = $1`, [userCode]);
        if (updatedUserResult.rows.length === 0) {
            return res.status(404).json({ message: 'Usuário não encontrado.' });
        }

        res.json(updatedUserResult.rows[0]);
    } catch(error) {
        console.error(error);
        res.status(500).json({ message: 'Erro ao salvar data de aniversário.' });
    }
});


// ROTA PARA BUSCAR DADOS DO PARCEIRO
app.get('/api/partner/:user_code', async (req, res) => {
    const { user_code } = req.params;
    try {
        // Primeiro, pega o código do parceiro do usuário atual
        const currentUserResult = await pool.query('SELECT linked_partner_code FROM users WHERE unique_code = $1', [user_code]);
        if (currentUserResult.rows.length === 0 || !currentUserResult.rows[0].linked_partner_code) {
            return res.status(404).json({ message: 'Parceiro não encontrado ou não vinculado.'});
        }
        const partnerCode = currentUserResult.rows[0].linked_partner_code;

        // Agora, busca os dados do parceiro usando o código dele
        const partnerResult = await pool.query(`
            SELECT username, display_name AS "displayName", picture_url AS "pictureUrl" 
            FROM users WHERE unique_code = $1`, [partnerCode]);
        if (partnerResult.rows.length === 0) {
            return res.status(404).json({ message: 'Dados do parceiro não encontrados.' });
        }

        res.json(partnerResult.rows[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Erro ao buscar dados do parceiro.' });
    }
});


// --- ROTAS DA IA (GEMINI) ---

app.get('/api/generate-idea', async (req, res) => {
  if (!ai) {
    return res.status(503).json({ message: 'O serviço de IA não está configurado.' });
  }
  try {
    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: 'Me dê uma ideia criativa, curta e romântica para um encontro de casal. Responda apenas com a ideia, sem frases introdutórias.',
    });
    res.json({ idea: response.text });
  } catch (error) {
    console.error("Erro na API Gemini:", error);
    res.status(500).json({ message: 'Erro ao gerar ideia com IA.' });
  }
});

app.get('/api/generate-question', async (req, res) => {
  if (!ai) {
    return res.status(503).json({ message: 'O serviço de IA não está configurado.' });
  }
  try {
    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: 'Crie uma pergunta interessante e divertida para um casal responder, para que eles se conheçam melhor. Responda apenas com a pergunta.',
    });
    res.json({ question: response.text });
  } catch (error) {
    console.error("Erro na API Gemini:", error);
    res.status(500).json({ message: 'Erro ao gerar pergunta com IA.' });
  }
});


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Backend server is running on port ${PORT}`);
});