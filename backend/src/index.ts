import express, { Express, json } from 'express';
import cors from 'cors';
import bcrypt from 'bcryptjs';
import pool from './db';
import { GoogleGenAI } from "@google/genai";
import dotenv from 'dotenv';

dotenv.config();

// Fix: Explicitly type `app` as `Express` to ensure correct type inference for middleware.
const app: Express = express();
app.use(cors());
// FIX: Use named import `json` to resolve middleware type error.
app.use(json());

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
    const { password_hash, id, ...userResponse } = user;
    res.json({
        username: userResponse.username,
        displayName: userResponse.display_name,
        pictureUrl: userResponse.picture_url,
        uniqueCode: userResponse.unique_code,
        linkedPartnerCode: userResponse.linked_partner_code,
        anniversaryDate: userResponse.anniversary_date
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erro no servidor' });
  }
});

// ROTA DE LOGIN/CADASTRO COM GOOGLE
app.post('/api/google-signin', async (req, res) => {
    const { email, name, picture } = req.body;
    try {
        const userExists = await pool.query('SELECT * FROM users WHERE username = $1 AND auth_method = $2', [email, 'google']);
        if (userExists.rows.length > 0) {
            // Se usuário existe, retorna os dados
            const user = userExists.rows[0];
            return res.json({
                username: user.username,
                displayName: user.display_name,
                pictureUrl: user.picture_url,
                uniqueCode: user.unique_code,
                linkedPartnerCode: user.linked_partner_code,
                anniversaryDate: user.anniversary_date
            });
        } else {
            // Se não existe, cria um novo
            const uniqueCode = generateUniqueCode();
            const newUser = await pool.query(
                `INSERT INTO users (username, display_name, picture_url, auth_method, unique_code)
                 VALUES ($1, $2, $3, $4, $5)
                 RETURNING ${userFields}`,
                [email, name, picture, 'google', uniqueCode]
            );
            return res.status(201).json(newUser.rows[0]);
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Erro no servidor durante o login com Google' });
    }
});

// ROTA PARA VINCULAR PARCEIRO
app.post('/api/link-partner', async (req, res) => {
    const { currentUser, partnerCode } = req.body;
    try {
        if (currentUser.uniqueCode === partnerCode) {
            return res.status(400).json({ message: 'Você não pode se vincular com seu próprio código.' });
        }
        
        const partnerRes = await pool.query('SELECT * FROM users WHERE unique_code = $1', [partnerCode]);
        if (partnerRes.rows.length === 0) {
            return res.status(404).json({ message: 'Código do parceiro(a) não encontrado.' });
        }
        
        const partner = partnerRes.rows[0];
        if (partner.linked_partner_code && partner.linked_partner_code !== currentUser.uniqueCode) {
            return res.status(409).json({ message: 'Este parceiro(a) já está vinculado a outra conta.' });
        }

        // Vincula ambos os usuários
        await pool.query('UPDATE users SET linked_partner_code = $1 WHERE unique_code = $2', [partnerCode, currentUser.uniqueCode]);
        await pool.query('UPDATE users SET linked_partner_code = $1 WHERE unique_code = $2', [currentUser.uniqueCode, partnerCode]);
        
        const updatedUserRes = await pool.query(`SELECT ${userFields} FROM users WHERE unique_code = $1`, [currentUser.uniqueCode]);
        res.json(updatedUserRes.rows[0]);

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Erro no servidor' });
    }
});


// ROTA PARA DEFINIR DATA DE ANIVERSÁRIO
app.post('/api/user/anniversary', async (req, res) => {
    const { userCode, anniversaryDate } = req.body;
    try {
        await pool.query('UPDATE users SET anniversary_date = $1 WHERE unique_code = $2', [anniversaryDate, userCode]);
        
        // Atualiza a data do parceiro também, para manter a consistência
        const partnerRes = await pool.query('SELECT linked_partner_code FROM users WHERE unique_code = $1', [userCode]);
        if (partnerRes.rows.length > 0 && partnerRes.rows[0].linked_partner_code) {
            await pool.query('UPDATE users SET anniversary_date = $1 WHERE unique_code = $2', [anniversaryDate, partnerRes.rows[0].linked_partner_code]);
        }
        
        const updatedUserRes = await pool.query(`SELECT ${userFields} FROM users WHERE unique_code = $1`, [userCode]);
        res.json(updatedUserRes.rows[0]);
    } catch (error) {
        console.error('Erro ao salvar data de aniversário:', error);
        res.status(500).json({ message: 'Erro no servidor' });
    }
});

// ROTA PARA BUSCAR DADOS DO PARCEIRO
app.get('/api/partner/:userCode', async (req, res) => {
    const { userCode } = req.params;
    try {
        const result = await pool.query('SELECT linked_partner_code FROM users WHERE unique_code = $1', [userCode]);
        if (result.rows.length === 0 || !result.rows[0].linked_partner_code) {
            return res.status(404).json({ message: "Parceiro não encontrado ou não vinculado." });
        }
        const partnerCode = result.rows[0].linked_partner_code;
        const partnerResult = await pool.query('SELECT username, display_name AS "displayName", picture_url AS "pictureUrl" FROM users WHERE unique_code = $1', [partnerCode]);
        if (partnerResult.rows.length === 0) {
            return res.status(404).json({ message: "Dados do parceiro não encontrados." });
        }
        res.json(partnerResult.rows[0]);
    } catch (error) {
        console.error('Erro ao buscar parceiro:', error);
        res.status(500).json({ message: 'Erro no servidor' });
    }
});

// --- ROTAS DA GEMINI API ---
app.get('/api/generate-idea', async (req, res) => {
  if (!ai) return res.status(503).json({ message: "Serviço de IA indisponível." });
  try {
    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: "Gere uma ideia criativa e curta para um encontro de casal. Apenas o texto da ideia.",
    });
    res.json({ idea: response.text });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erro ao gerar ideia.' });
  }
});

app.get('/api/generate-question', async (req, res) => {
    if (!ai) return res.status(503).json({ message: "Serviço de IA indisponível." });
    try {
      const response = await ai.models.generateContent({
          model: 'gemini-2.5-flash',
          contents: "Gere uma pergunta interessante para um casal se conhecer melhor. Apenas o texto da pergunta.",
      });
      res.json({ question: response.text });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Erro ao gerar pergunta.' });
    }
});

// --- ROTAS DO JARRINHO DE AMOR (LOVE JAR) ---

// Buscar itens do jarrinho (do usuário e do parceiro)
app.get('/api/love-jar/:userCode', async (req, res) => {
  const { userCode } = req.params;
  try {
    const user = await pool.query('SELECT linked_partner_code FROM users WHERE unique_code = $1', [userCode]);
    if (user.rows.length === 0) {
      return res.status(404).json({ message: 'Usuário não encontrado.' });
    }
    const partnerCode = user.rows[0].linked_partner_code;
    const codesToFetch = partnerCode ? [userCode, partnerCode] : [userCode];
    
    const result = await pool.query(
      `SELECT 
        lj.id, 
        lj.text, 
        lj.user_code AS "authorCode",
        u.picture_url AS "authorPictureUrl"
       FROM love_jar_items lj
       JOIN users u ON lj.user_code = u.unique_code
       WHERE lj.user_code = ANY($1::varchar[])
       ORDER BY lj.created_at DESC`,
      [codesToFetch]
    );
    res.json(result.rows);
  } catch (error) {
    console.error('Erro ao buscar itens do Jarrinho de Amor:', error);
    res.status(500).json({ message: 'Erro no servidor' });
  }
});

// Adicionar um item ao jarrinho
app.post('/api/love-jar', async (req, res) => {
    const { userCode, text } = req.body;
    try {
        const newItem = await pool.query(
            'INSERT INTO love_jar_items (user_code, text) VALUES ($1, $2) RETURNING id, text, user_code AS "authorCode"',
            [userCode, text]
        );
        
        // Busca a foto do autor para retornar o objeto completo
        const author = await pool.query('SELECT picture_url FROM users WHERE unique_code = $1', [userCode]);
        const authorPictureUrl = author.rows.length > 0 ? author.rows[0].picture_url : null;
        
        res.status(201).json({ ...newItem.rows[0], authorPictureUrl });
    } catch (error) {
        console.error('Erro ao adicionar item ao Jarrinho de Amor:', error);
        res.status(500).json({ message: 'Erro no servidor' });
    }
});

// Remover um item do jarrinho
app.delete('/api/love-jar/:id', async (req, res) => {
    const { id } = req.params;
    // Adicional: poderia ter uma verificação para garantir que quem está apagando é um dos dois no casal
    try {
        const result = await pool.query('DELETE FROM love_jar_items WHERE id = $1', [id]);
        if (result.rowCount === 0) {
            return res.status(404).json({ message: 'Item não encontrado.' });
        }
        res.status(204).send(); // 204 No Content
    } catch (error) {
        console.error('Erro ao remover item do Jarrinho de Amor:', error);
        res.status(500).json({ message: 'Erro no servidor' });
    }
});


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});