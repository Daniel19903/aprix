const express = require('express');
const cors = require('cors');
const { createClient } = require('@libsql/client');
require('dotenv').config();

const app = express();
app.use(cors());
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

// --- ROTAS DO JOGADOR LOCAL & MISSÕES ---
app.get('/api/player', (req, res) => {
  res.json(player);
});

app.post('/api/player/answer', (req, res) => {
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
});

app.get('/api/missions', (req, res) => {
  res.json(Object.values(missionsData));
});

app.get('/api/missions/:id', (req, res) => {
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
});

app.post('/api/missions/:id/complete', (req, res) => {
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
});

// Endpoint para registrar a conclusão do Quiz Diário
app.post('/api/player/daily-quiz', (req, res) => {
  const { xpEarned } = req.body;
  const gained = xpEarned || 10;

  processXP(gained);

  return res.status(200).json({
    success: true,
    message: 'Quiz diário concluído com sucesso!',
    xpEarned: gained,
    playerState: player
  });
});

// --- ROTAS DE RANKING COM TURSO (ASYNC/AWAIT) ---
app.get('/api/leaderboard', async (req, res) => {
  try {
    const result = await db.execute('SELECT * FROM leaderboard ORDER BY xp DESC');
    res.json(result.rows);
  } catch (err) {
    console.error('Erro ao buscar o ranking no Turso:', err);
    res.status(500).json({ error: 'Erro ao buscar o ranking' });
  }
});

app.post('/api/player/score', async (req, res) => {
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
});

// Exporta o aplicativo Express para ser consumido como Vercel Serverless Function
module.exports = app;

// Roda servidor local apenas fora do ambiente da Vercel
if (process.env.NODE_ENV !== 'production') {
  const PORT = process.env.PORT || 3001;
  app.listen(PORT, () => {
    console.log(`🚀 Backend do Aprix rodando localmente em http://localhost:${PORT}`);
  });
}