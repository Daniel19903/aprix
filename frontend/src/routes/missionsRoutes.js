// src/routes/missionsRoutes.js
const express = require('express');
const router = express.Router();
const { MISSIONS_DATABASE } = require('../data/missionsDatabase');

// 1. Obter detalhes da missão pelo ID
router.get('/missions/:id', (req, res) => {
  const { id } = req.params;
  const mission = MISSIONS_DATABASE[id];

  if (!mission) {
    return res.status(404).json({ success: false, error: 'Missão não encontrada.' });
  }

  return res.json({ success: true, mission });
});

// 2. Concluir a missão e calcular recompensas
router.post('/missions/:id/complete', (req, res) => {
  const { id } = req.params;
  const { userId } = req.body;

  const mission = MISSIONS_DATABASE[id];

  if (!mission) {
    return res.status(404).json({ success: false, error: 'Missão inválida.' });
  }

  // Lógica de salvamento no DB (PostgreSQL, MongoDB, etc.)
  // ex: await User.findByIdAndUpdate(userId, { $inc: { xp: mission.xpReward }, $addToSet: { unlockedMissions: mission.next } })

  return res.json({
    success: true,
    message: "Missão concluída com sucesso!",
    xpGained: mission.xpReward,
    nextMissions: mission.next,
    aprixMessage: mission.aprixMessage
  });
});

module.exports = router;