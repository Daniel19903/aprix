const express = require('express');
const router = express.Router();

// BANCO DE DADOS CENTRAL DAS 50 MISSÕES (Fonte da Verdade)
const MISSIONS_DB = {
  "1": {
    id: "1",
    title: "Acorda, Financeiro!",
    phase: "despertar",
    route: null,
    mechanic: "click_objects",
    xpReward: 100,
    aprixMessage: "Boa! Dinheiro não aparece só quando você paga algo. Ele está escondido em várias escolhas do seu dia.",
    next: ["2"],
    data: {
      instruction: "Encontre e clique nos itens que envolvem decisões financeiras!",
      targetObjects: ["celular", "videogame", "cofrinho", "conta"]
    }
  },
  "2": {
    id: "2",
    title: "De Onde Vem o Dinheiro?",
    phase: "despertar",
    route: null,
    mechanic: "drag_drop_categories",
    xpReward: 100,
    aprixMessage: "Agora você começou a enxergar o caminho do dinheiro!",
    next: ["3A", "3B"], // Bifurcação!
    data: {
      categories: ["DINHEIRO ENTRA", "DINHEIRO SAI", "DINHEIRO GUARDADO"],
      items: [
        { id: "i1", label: "Salário / Mesada", category: "DINHEIRO ENTRA" },
        { id: "i2", label: "Lanche da Escola", category: "DINHEIRO SAI" },
        { id: "i3", label: "Cofrinho", category: "DINHEIRO GUARDADO" }
      ]
    }
  },
  "3A": {
    id: "3A",
    title: "Escolha Inteligente",
    phase: "despertar",
    route: "A",
    mechanic: "scenario_choice",
    xpReward: 120,
    aprixMessage: "Pausar antes de gastar ajuda você a entender suas prioridades!",
    next: ["4A"],
    data: {
      scenario: "Você recebeu R$ 50 de presente. O que faz?",
      options: [
        { id: "opt_1", text: "Compro um jogo na hora", isCorrect: false },
        { id: "opt_2", text: "Gardo uma parte e avalio o resto", isCorrect: true }
      ]
    }
  }
};

// 1️⃣ Rota: Buscar os dados de uma missão específica
router.get('/missions/:id', (req, res) => {
  const { id } = req.params;
  const mission = MISSIONS_DB[id];

  if (!mission) {
    return res.status(404).json({ error: 'Missão não encontrada' });
  }

  // Retorna os dados da missão (sem spoilers desnecessários se houver)
  res.json(mission);
});

// 2️⃣ Rota: Validar a conclusão e salvar progresso/XP do jogador
router.post('/missions/:id/complete', async (req, res) => {
  const { id } = req.params;
  const { userId, userAnswers } = req.body;

  const mission = MISSIONS_DB[id];
  if (!mission) {
    return res.status(404).json({ error: 'Missão inválida' });
  }

  // Exemplo de validação no Backend (para evitar burla)
  // Aqui você pode salvar no seu banco de dados real (PostgreSQL, MongoDB, etc.)
  // await User.findByIdAndUpdate(userId, { $inc: { xp: mission.xpReward }, $addToSet: { completedMissions: id } });

  res.json({
    success: true,
    message: "Missão concluída com sucesso!",
    xpGained: mission.xpReward,
    nextMissions: mission.next, // Envia as próximas rotas liberadas (ex: ["3A", "3B"])
    aprixMessage: mission.aprixMessage
  });
});

module.exports = router;