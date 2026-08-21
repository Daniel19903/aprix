const express = require('express');
const cors = require('cors');
 
const app = express();
 
app.use(cors());
app.use(express.json());
 
// 👉 Cole aqui suas rotas reais (ranking, pontuação, etc).
// Se você já tem um server.js com app.use('/rota', handler), é só mover
// esse conteúdo pra cá, mantendo os mesmos paths.
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});
 
// Exemplo de estrutura esperada para as rotas do jogo:
// app.get('/api/ranking', ...)
// app.post('/api/ranking', ...)
// app.get('/api/player/:id', ...)
 
// IMPORTANTE: só sobe um servidor "de verdade" quando rodando localmente
// (fora da Vercel). Em produção, a Vercel importa `app` e cuida do resto.
if (process.env.NODE_ENV !== 'production' && !process.env.VERCEL) {
  const PORT = process.env.PORT || 3001;
  app.listen(PORT, () => {
    console.log(`API rodando localmente em http://localhost:${PORT}`);
  });
}
 
// Export necessário para a Vercel tratar este arquivo como Serverless Function
module.exports = app;
 