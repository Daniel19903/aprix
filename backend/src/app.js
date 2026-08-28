require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { createClient } = require('@libsql/client');
 
const app = express();
 
// Configuração do CORS para permitir o frontend na Vercel e dev local
app.use(cors({
  origin: '*', // Permite chamadas do frontend na Vercel
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
 
app.use(express.json());
 
// --- CONEXÃO COM O TURSO (BANCO EM NUVEM) ---
const db = createClient({
  url: process.env.TURSO_DATABASE_URL,
  authToken: process.env.TURSO_AUTH_TOKEN,
});
 
// Inicialização da tabela de ranking no Turso
async function initDb() {
  try {
    await db.execute(`
      CREATE TABLE IF NOT EXISTS leaderboard (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        avatar TEXT,
        xp INTEGER DEFAULT 0
      )
    `);
    console.log('⚡ Conectado ao banco Turso em nuvem com sucesso!');
  } catch (err) {
    console.error('❌ Erro ao inicializar tabela no Turso:', err);
  }
}
initDb();
 
// --- ESTADO INICIAL DO JOGADOR LOCAL ---
let player = {
  lives: 3,
  maxLives: 3,
  xp: 0,
  targetXP: 100,
  level: 1,
  currentMissionId: "1",
  completedMissions: []
};
 
// --- BASE DE DADOS DAS MISSÕES ---
const missionsData = {
  "1": {
    id: "1",
    title: "Acorda, Financeiro!",
    phase: "despertar",
    route: null,
    mechanic: "click_objects",
    xpReward: 10,
    aprixMessage: "Boa! Dinheiro não aparece só quando você paga algo. Ele está escondido em várias escolhas do seu dia.",
    next: ["2"],
    data: {
      instruction: "Clique apenas nos objetos do quarto que representam DECISÕES FINANCEIRAS!",
      targetObjects: [
        { id: "celular", name: "Celular (Plano de Dados)", isCorrect: true },
        { id: "videogame", name: "Videogame (Jogos / Skins)", isCorrect: true },
        { id: "cama", name: "Travesseiro / Cama", isCorrect: false },
        { id: "cofrinho", name: "Cofrinho de Moedas", isCorrect: true },
        { id: "janela", name: "Cortina da Janela", isCorrect: false },
        { id: "conta", name: "Conta de Luz/Net", isCorrect: true }
      ]
    }
  },
  "2": {
    id: "2",
    title: "De Onde Vem o Dinheiro?",
    phase: "despertar",
    route: null,
    mechanic: "click_objects",
    xpReward: 10,
    aprixMessage: "Agora você começou a enxergar o caminho do dinheiro. Saber de onde vem e para onde vai muda tudo!",
    next: ["3A", "3B"],
    data: {
      instruction: "Identifique as fontes e destinos do seu dinheiro:",
      targetObjects: [
        { id: "salario", name: "Salário / Mesada" },
        { id: "lanche", name: "Lanche da Escola" },
        { id: "reserva", name: "Cofrinho / Reserva" }
      ]
    }
  }
};
 
function processXP(amount) {
  player.xp += amount;
  while (player.xp >= player.targetXP) {
    player.xp -= player.targetXP;
    player.level += 1;
  }
}

// --- BANCO DE PERGUNTAS DA TELA DE RECUPERAÇÃO DE VIDA ---
// Cada pergunta segue o contrato que o GameOver.jsx espera:
// { title, description, choices: [{ id, text, isCorrect, feedback }] }
const recoveryQuizzes = [
  {
    title: "Desafio de Recarga",
    description: "O que é mais importante fazer ANTES de gastar seu dinheiro com algo que você quer (não precisa)?",
    choices: [
      { id: "a", text: "Comprar na hora, para não perder a vontade", isCorrect: false, feedback: "Isso é agir por impulso — tente de novo!" },
      { id: "b", text: "Verificar se isso cabe no que você já planejou gastar", isCorrect: true, feedback: "Isso mesmo! Planejar antes evita arrependimento depois. +1 vida!" },
      { id: "c", text: "Pedir emprestado para alguém", isCorrect: false, feedback: "Isso pode criar uma dívida desnecessária — tente de novo!" }
    ]
  },
  {
    title: "Desafio de Recarga",
    description: "Você ganhou uma mesada. Qual é a atitude mais consciente?",
    choices: [
      { id: "a", text: "Gastar tudo no primeiro dia", isCorrect: false, feedback: "Gastar tudo de uma vez deixa você sem opções depois — tente de novo!" },
      { id: "b", text: "Guardar uma parte antes de gastar o resto", isCorrect: true, feedback: "Exato! Guardar uma parte primeiro é a base de qualquer planejamento. +1 vida!" },
      { id: "c", text: "Emprestar tudo para um amigo", isCorrect: false, feedback: "Isso não te ajuda a construir sua própria reserva — tente de novo!" }
    ]
  },
  {
    title: "Desafio de Recarga",
    description: "O que significa 'gasto por impulso'?",
    choices: [
      { id: "a", text: "Uma compra planejada com calma", isCorrect: false, feedback: "Isso é o oposto de impulso — tente de novo!" },
      { id: "b", text: "Uma compra feita sem pensar, geralmente por emoção do momento", isCorrect: true, feedback: "Correto! Reconhecer o impulso é o primeiro passo para controlá-lo. +1 vida!" },
      { id: "c", text: "Guardar dinheiro todo mês", isCorrect: false, feedback: "Isso é o contrário de impulso, é planejamento — tente de novo!" }
    ]
  }
];

function getRandomRecoveryQuiz() {
  const index = Math.floor(Math.random() * recoveryQuizzes.length);
  return recoveryQuizzes[index];
}
 
// --- ROTAS DO JOGADOR LOCAL & MISSÕES (Suporta /api e / direto) ---
 
// Player GET
const getPlayerHandler = (req, res) => res.json(player);
app.get('/player', getPlayerHandler);
app.get('/api/player', getPlayerHandler);
 
// Player Answer POST
const postAnswerHandler = (req, res) => {
  const { missionId } = req.body;
  const mission = missionsData[missionId];
  const xpGained = mission ? mission.xpReward : 10;
 
  processXP(xpGained);
 
  if (missionId && !player.completedMissions.includes(String(missionId))) {
    player.completedMissions.push(String(missionId));
  }
 
  res.json({
    success: true,
    message: "Resposta processada com sucesso!",
    playerState: player,
    xpGained: xpGained,
    aprixMessage: mission ? mission.aprixMessage : "Parabéns por concluir!"
  });
};
app.post('/player/answer', postAnswerHandler);
app.post('/api/player/answer', postAnswerHandler);

// Recovery Quest GET — pergunta de educação financeira da tela de 0 vidas
const getRecoveryQuestHandler = (req, res) => {
  const quiz = getRandomRecoveryQuiz();
  res.json(quiz);
};
app.get('/player/recovery-quest', getRecoveryQuestHandler);
app.get('/api/player/recovery-quest', getRecoveryQuestHandler);

// Add Life POST — concede +1 vida (respeitando o teto de maxLives)
const postAddLifeHandler = (req, res) => {
  if (player.lives < player.maxLives) {
    player.lives += 1;
  }
  res.json({
    success: true,
    player: player
  });
};
app.post('/player/add-life', postAddLifeHandler);
app.post('/api/player/add-life', postAddLifeHandler);
 
// Missions GET
const getMissionsHandler = (req, res) => res.json(Object.values(missionsData));
app.get('/missions', getMissionsHandler);
app.get('/api/missions', getMissionsHandler);
 
// Mission Single GET
const getMissionByIdHandler = (req, res) => {
  const { id } = req.params;
  const mission = missionsData[id] || {
    id: id,
    title: `Missão ${id}`,
    xpReward: 10,
    aprixMessage: "Mandou muito bem!",
    next: [String(Number(id) || 1)],
    data: {
      instruction: "Conclua a tarefa para avançar:",
      targetObjects: [{ id: "t1", name: "Objetivo Principal" }]
    }
  };
 
  res.json({ success: true, mission });
};
app.get('/missions/:id', getMissionByIdHandler);
app.get('/api/missions/:id', getMissionByIdHandler);
 
// Mission Complete POST
const postCompleteMissionHandler = (req, res) => {
  const { id } = req.params;
  const mission = missionsData[id];
  const xpGained = mission ? mission.xpReward : 10;
  const nextMissions = mission ? mission.next : [];
 
  processXP(xpGained);
 
  if (!player.completedMissions.includes(id)) {
    player.completedMissions.push(id);
  }
 
  res.json({
    success: true,
    message: "Missão concluída com sucesso!",
    xpGained: xpGained,
    playerState: player,
    nextMissions: nextMissions,
    aprixMessage: mission ? mission.aprixMessage : "Parabéns por concluir mais uma etapa!"
  });
};
app.post('/missions/:id/complete', postCompleteMissionHandler);
app.post('/api/missions/:id/complete', postCompleteMissionHandler);
 
// Daily Quiz POST
const postDailyQuizHandler = (req, res) => {
  const { xpEarned } = req.body;
  const gained = xpEarned || 10;
 
  processXP(gained);
 
  return res.status(200).json({
    success: true,
    message: 'Quiz diário concluído com sucesso!',
    xpEarned: gained,
    playerState: player
  });
};
app.post('/player/daily-quiz', postDailyQuizHandler);
app.post('/api/player/daily-quiz', postDailyQuizHandler);
 
// --- ROTAS DE RANKING COM TURSO ---
const getLeaderboardHandler = async (req, res) => {
  try {
    const result = await db.execute('SELECT * FROM leaderboard ORDER BY xp DESC');
    res.json(result.rows);
  } catch (err) {
    console.error('Erro ao buscar o ranking no Turso:', err);
    res.status(500).json({ error: 'Erro ao buscar o ranking' });
  }
};
app.get('/leaderboard', getLeaderboardHandler);
app.get('/api/leaderboard', getLeaderboardHandler);
 
const postScoreHandler = async (req, res) => {
  const { playerId, name, avatar, xp } = req.body;
 
  if (!name) {
    return res.status(400).json({ error: 'Nome do jogador é obrigatório' });
  }
 
  const numericXP = Number.isInteger(xp) ? xp : Number(xp) || 0;
  const id = playerId || name.toLowerCase().replace(/\s+/g, '_');
 
  try {
    await db.execute({
      sql: `
        INSERT INTO leaderboard (id, name, avatar, xp)
        VALUES (?, ?, ?, ?)
        ON CONFLICT(id) DO UPDATE SET
          name = excluded.name,
          avatar = excluded.avatar,
          xp = excluded.xp
      `,
      args: [id, name, avatar || '', numericXP]
    });
 
    res.json({ success: true, id, name, xp: numericXP });
  } catch (err) {
    console.error('Erro ao atualizar o ranking no Turso:', err);
    res.status(500).json({ error: 'Erro ao atualizar o ranking' });
  }
};
app.post('/player/score', postScoreHandler);
app.post('/api/player/score', postScoreHandler);
 
// Roda servidor local apenas fora do ambiente da Vercel
if (process.env.NODE_ENV !== 'production') {
  const PORT = process.env.PORT || 3001;
  app.listen(PORT, () => {
    console.log(`🚀 Backend do Aprix rodando localmente em http://localhost:${PORT}`);
  });
}
 
module.exports = app;