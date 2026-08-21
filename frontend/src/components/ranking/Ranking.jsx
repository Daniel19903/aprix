import React, { useEffect, useState } from 'react';
import { fetchLeaderboard, updatePlayerScore } from '../../services/api';

export function Ranking({ currentPlayer }) {
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadRanking() {
      setLoading(true);

      // Sincroniza os pontos do jogador atual no banco SQLite antes de carregar
      if (currentPlayer) {
        await updatePlayerScore(currentPlayer);
      }

      // Busca apenas Jogadores reais do banco de dados
      const data = await fetchLeaderboard();
      setLeaderboard(Array.isArray(data) ? data : []);
      setLoading(false);
    }

    loadRanking();
  }, [currentPlayer]);

  if (loading) {
    return <div className="ranking-loading">Carregando ranking...</div>;
  }

  return (
    <div className="ranking-container">
      <h2>🏆 Ranking Geral</h2>

      {leaderboard.length === 0 ? (
        <p className="empty-msg">Nenhum jogador cadastrado no ranking ainda. Seja o primeiro!</p>
      ) : (
        <div className="ranking-list">
          {leaderboard.map((player, index) => {
            const isCurrentPlayer =
              player.id === currentPlayer?.id || player.name === currentPlayer?.name;

            return (
              <div
                key={player.id || index}
                className={`ranking-card ${isCurrentPlayer ? 'active-player' : ''}`}
              >
                <span className="rank-position">#{index + 1}</span>
                {player.avatar && (
                  <img src={player.avatar} alt={player.name} className="player-avatar" />
                )}
                <span className="player-name">
                  {player.name} {isCurrentPlayer && '(Você)'}
                </span>
                <span className="player-xp">{player.xp || 0} XP</span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}