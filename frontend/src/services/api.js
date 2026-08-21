// 1. URL base da API (Backend Node / Express);
//
// Em produção na Vercel, front-end e API ficam no MESMO domínio (graças aos
// rewrites do vercel.json), então um caminho relativo evita CORS por
// completo. Em desenvolvimento local, configure o proxy no vite.config.js
// (server.proxy['/api'] -> http://localhost:3001) para que esse mesmo
// caminho relativo funcione também sem precisar mudar nada aqui.
//
// Se preferir apontar manualmente (ex: backend em outro domínio), defina
// VITE_API_URL no seu .env — ele tem prioridade sobre o padrão relativo.
const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';
 
// 2. URL do Google Apps Script (Webhook Planilha)
// 👉 Cole aqui a URL real do seu Apps Script publicado (Implantar > Nova implantação > Web app)
const GOOGLE_SHEETS_URL = 'https://script.google.com/macros/s/SUA_URL_AQUI/exec';
 
// Auxiliar para obter dados do jogador salvos localmente (Fallback)
function getLocalPlayerData() {
  const stored = localStorage.getItem('aprix_user_profile');
  if (stored) {
    return JSON.parse(stored);
  }
  return {
    name: 'Jogador Aprix',
    gender: 'boy',
    avatarUrl: '',
    lives: 3,
    xp: 0,
    completedMissions: []
  };
}
 
// Busca dados do jogador
export async function fetchPlayerData() {
  try {
    const response = await fetch(`${API_BASE_URL}/player`);
    if (!response.ok) throw new Error('Erro ao buscar dados do jogador');
    return await response.json();
  } catch (error) {
    console.warn('Backend indisponível. Usando perfil do localStorage.');
    return getLocalPlayerData();
  }
}
 
// Busca lista de missões
export async function fetchMissions() {
  try {
    const response = await fetch(`${API_BASE_URL}/missions`);
    if (!response.ok) throw new Error('Erro ao buscar missões');
    return await response.json();
  } catch (error) {
    console.warn('Backend indisponível. Usando lista de missões locais.');
    return []; // Retorna array vazio
  }
}
 
// Busca a missão de recuperação de vida
export async function fetchRecoveryQuest() {
  try {
    const response = await fetch(`${API_BASE_URL}/player/recovery-quest`);
    if (!response.ok) throw new Error('Erro ao buscar quest de recarga');
    return await response.json();
  } catch (error) {
    console.warn('Backend indisponível para quest de recuperação.');
    return null;
  }
}
 
// Envia resposta ou conclusão da missão
export async function submitAnswer(missionId, choice) {
  try {
    const response = await fetch(`${API_BASE_URL}/player/answer`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ missionId, choice }),
    });
    if (!response.ok) throw new Error('Erro ao enviar resposta');
    return await response.json();
  } catch (error) {
    console.warn('Backend offline. Atualizando progresso localmente.');
 
    // Atualização mock no localStorage.
    // CORRIGIDO: antes somava +100 XP fixo, ignorando o xpEarned real da
    // missão. Agora usa o valor que veio em `choice.xpEarned` (o mesmo
    // payload { completed, xpEarned } que o App.jsx envia), com fallback
    // de 10 apenas se por algum motivo não vier nenhum valor.
    const player = getLocalPlayerData();
    if (!player.completedMissions.includes(missionId)) {
      const xpToAdd = Number(choice?.xpEarned ?? 10);
      player.completedMissions.push(missionId);
      player.xp += xpToAdd;
      localStorage.setItem('aprix_user_profile', JSON.stringify(player));
    }
 
    return { success: true, player };
  }
}
 
// Adiciona uma vida ao jogador
export async function addPlayerLife() {
  try {
    const response = await fetch(`${API_BASE_URL}/player/add-life`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    });
    if (!response.ok) throw new Error('Erro ao adicionar vida');
    return await response.json();
  } catch (error) {
    console.warn('Backend offline. Adicionando vida localmente.');
 
    const player = getLocalPlayerData();
    player.lives = (player.lives || 0) + 1;
    localStorage.setItem('aprix_user_profile', JSON.stringify(player));
 
    return { success: true, lives: player.lives };
  }
}
 
// ==========================================
// INTEGRAÇÃO QUIZ DIÁRIO
// ==========================================
 
// Registra a conclusão do Quiz Diário
export async function completeDailyQuiz(quizData) {
  try {
    const response = await fetch(`${API_BASE_URL}/player/daily-quiz`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(quizData),
    });
    if (!response.ok) throw new Error('Erro ao registrar quiz diário');
    return await response.json();
  } catch (error) {
    console.warn('Backend offline. Salvando recompensa do Quiz Diário localmente.');
 
    const player = getLocalPlayerData();
    player.xp = (player.xp || 0) + (quizData?.xpEarned || 10);
    localStorage.setItem('aprix_user_profile', JSON.stringify(player));
 
    return { success: true, xpEarned: quizData?.xpEarned || 10 };
  }
}
 
// ==========================================
// INTEGRAÇÃO RANKING (SQLITE VIA BACKEND)
// ==========================================
 
// Busca a lista real de jogadores do banco de dados (sem dados fictícios)
export async function fetchLeaderboard() {
  try {
    const response = await fetch(`${API_BASE_URL}/leaderboard`);
    if (!response.ok) throw new Error('Erro ao buscar ranking');
    return await response.json();
  } catch (error) {
    console.warn('Backend indisponível para carregar o ranking.');
    return []; // Retorna lista vazia caso o servidor esteja fora do ar
  }
}
 
// Envia ou atualiza a pontuação do jogador real no SQLite
export async function updatePlayerScore(playerData) {
  try {
    const response = await fetch(`${API_BASE_URL}/player/score`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        playerId: playerData.id || playerData.name || 'player_local',
        name: playerData.name || 'Jogador',
        avatar: playerData.avatarUrl || '',
        xp: playerData.xp || 0
      }),
    });
    return await response.json();
  } catch (error) {
    console.warn('Backend offline. Não foi possível salvar o XP no ranking.');
    return { success: false };
  }
}
 
// ==========================================
// INTEGRAÇÃO GOOGLE SHEETS (FEEDBACK E PRÊMIOS)
// ==========================================
 
// Envia o formulário de Feedback para a planilha
export async function sendFeedback(feedbackData) {
  try {
    await fetch(GOOGLE_SHEETS_URL, {
      method: 'POST',
      mode: 'no-cors',
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body: JSON.stringify(feedbackData),
    });
    return { success: true };
  } catch (error) {
    console.error('Erro ao enviar feedback para a planilha:', error);
    return { success: false, error };
  }
}
 
// Envia o registro de Indicação/Prêmio para a planilha
export async function sendReferral(referrer, newUser) {
  try {
    await fetch(GOOGLE_SHEETS_URL, {
      method: 'POST',
      mode: 'no-cors',
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body: JSON.stringify({
        action: 'referral',
        referrer: referrer,
        newUser: newUser,
      }),
    });
    return { success: true };
  } catch (error) {
    console.error('Erro ao enviar indicação para a planilha:', error);
    return { success: false, error };
  }
}