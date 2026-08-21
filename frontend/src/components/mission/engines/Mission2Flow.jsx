import React, { useState } from 'react';
 
// Cada "carta" é uma rodada do minigame: uma pergunta rápida com opções,
// onde só uma é a ação financeira correta para a situação descrita.
const CARDS = [
  {
    id: 'c1',
    prompt: 'Você recebeu R$ 20 de mesada. Qual a atitude mais inteligente agora?',
    options: [
      { id: 'gastar-tudo', label: 'Gastar tudo em doces', isCorrect: false },
      { id: 'guardar-parte', label: 'Guardar uma parte no cofrinho', isCorrect: true },
      { id: 'emprestar', label: 'Emprestar tudo sem anotar', isCorrect: false }
    ]
  },
  {
    id: 'c2',
    prompt: 'A conta de internet vence amanhã. O que fazer?',
    options: [
      { id: 'ignorar', label: 'Ignorar e assistir vídeos', isCorrect: false },
      { id: 'avisar', label: 'Avisar um responsável sobre o vencimento', isCorrect: true },
      { id: 'comprar-jogo', label: 'Aproveitar para comprar um jogo', isCorrect: false }
    ]
  },
  {
    id: 'c3',
    prompt: 'Você quer um videogame novo de R$ 300. Qual o melhor plano?',
    options: [
      { id: 'pedir-emprestado', label: 'Pedir emprestado para amigos', isCorrect: false },
      { id: 'juntar-mesadas', label: 'Juntar parte da mesada por algumas semanas', isCorrect: true },
      { id: 'usar-tudo-cofre', label: 'Gastar todo o cofrinho de uma vez', isCorrect: false }
    ]
  },
  {
    id: 'c4',
    prompt: 'Sobrou dinheiro depois de pagar tudo que precisava. O que fazer?',
    options: [
      { id: 'gastar-impulso', label: 'Gastar por impulso em algo aleatório', isCorrect: false },
      { id: 'guardar-objetivo', label: 'Guardar pensando em um objetivo futuro', isCorrect: true },
      { id: 'esquecer', label: 'Deixar o dinheiro solto na mochila', isCorrect: false }
    ]
  },
  {
    id: 'c5',
    prompt: 'Um amigo quer te vender um brinquedo quebrado, cobrando o mesmo preço de um novo. O que você faz?',
    options: [
      { id: 'compra-mesmo-assim', label: 'Compra mesmo assim sem checar', isCorrect: false },
      { id: 'avalia-preco', label: 'Avalia se o preço é justo pelo estado do item', isCorrect: true },
      { id: 'promete-pagar-depois', label: 'Promete pagar depois sem combinar nada', isCorrect: false }
    ]
  }
];
 
// Combo mínimo de acertos seguidos para ganhar XP bônus por acerto
const COMBO_BONUS_THRESHOLD = 3;
const COMBO_BONUS_XP = 1;
 
// Fisher-Yates: embaralha sem mutar o array original
function shuffleArray(array) {
  const result = [...array];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}
 
// Embaralha a ordem das cartas E a ordem das opções dentro de cada carta,
// para que a resposta certa nunca fique sempre na mesma posição.
function buildShuffledCards() {
  return shuffleArray(CARDS).map((card) => ({
    ...card,
    options: shuffleArray(card.options)
  }));
}
 
export function Mission2Flow({ onComplete, onError }) {
  // Inicializador preguiçoso: embaralha só UMA vez, na primeira renderização
  // desta instância da missão — não re-embaralha a cada re-render.
  const [cards] = useState(() => buildShuffledCards());
 
  const [roundIndex, setRoundIndex] = useState(0);
  const [combo, setCombo] = useState(0);
  const [totalXpEarned, setTotalXpEarned] = useState(0);
  const [wrongOptionId, setWrongOptionId] = useState(null);
  const [lastGain, setLastGain] = useState(null); // feedback visual de "+1" / "+2" no acerto
  const [feedback, setFeedback] = useState(null);
  const [isFinishing, setIsFinishing] = useState(false);
 
  const currentCard = cards[roundIndex];
  const isLastCard = roundIndex === cards.length - 1;
 
  const handleChoice = (option) => {
    // Ignora cliques enquanto o flash de erro ainda está sendo exibido
    if (wrongOptionId) return;
    // Ignora cliques depois que a última carta já foi resolvida
    if (isFinishing) return;
 
    if (!option.isCorrect) {
      // ERRO: reseta o combo, tira 1 vida, NÃO soma XP, NÃO avança o card,
      // NÃO revela qual era a opção correta.
      setCombo(0);
      setWrongOptionId(option.id);
      setFeedback('Não foi dessa vez! Pensa de novo.');
 
      if (onError) onError();
 
      setTimeout(() => {
        setWrongOptionId(null);
        setFeedback(null);
      }, 900);
 
      return;
    }
 
    // ACERTO: soma 1 XP + bônus de combo, avança para o próximo card.
    const newCombo = combo + 1;
    const bonus = newCombo >= COMBO_BONUS_THRESHOLD ? COMBO_BONUS_XP : 0;
    const gained = 1 + bonus;
 
    setCombo(newCombo);
    setTotalXpEarned((prev) => prev + gained);
    setLastGain(gained);
    setFeedback(null);
 
    setTimeout(() => {
      setLastGain(null);
 
      if (isLastCard) {
        // Minigame completo: reporta o XP total acumulado nas rodadas.
        setIsFinishing(true);
        if (onComplete) {
          onComplete({ success: true, xpEarned: totalXpEarned + gained });
        }
      } else {
        setRoundIndex((prev) => prev + 1);
      }
    }, 500);
  };
 
  return (
    <div style={{ color: '#fff', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <div style={{ backgroundColor: '#1e293b', padding: '1rem', borderRadius: '12px', border: '1px solid #334155' }}>
        <p style={{ margin: 0, fontSize: '0.85rem', color: '#cbd5e1' }}>
          <strong>Aprix diz:</strong> "Agora é rapidez e olho vivo! Escolha a atitude certa em cada situação — acertos seguidos rendem bônus de XP."
        </p>
      </div>
 
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.75rem', color: '#94a3b8' }}>
        <span>Carta {roundIndex + 1} de {cards.length}</span>
        <span style={{ color: combo >= COMBO_BONUS_THRESHOLD ? '#facc15' : '#94a3b8', fontWeight: 'bold' }}>
          🔥 Combo: {combo}
        </span>
        <span style={{ color: '#38bdf8', fontWeight: 'bold' }}>XP: {totalXpEarned}</span>
      </div>
 
      <div style={{ backgroundColor: '#0f172a', border: '1px solid #334155', borderRadius: '12px', padding: '1rem' }}>
        <p style={{ margin: '0 0 0.75rem 0', fontSize: '0.9rem', fontWeight: 'bold', color: '#fff' }}>
          {currentCard.prompt}
        </p>
 
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {currentCard.options.map((option) => {
            const isWrong = wrongOptionId === option.id;
 
            let border = '1px solid #334155';
            let bg = '#111c33';
 
            if (isWrong) {
              border = '2px solid #ef4444';
              bg = 'rgba(239, 68, 68, 0.2)';
            }
 
            return (
              <button
                key={option.id}
                onClick={() => handleChoice(option)}
                disabled={isFinishing}
                style={{
                  textAlign: 'left',
                  padding: '0.7rem 0.85rem',
                  borderRadius: '8px',
                  border,
                  backgroundColor: bg,
                  color: '#fff',
                  cursor: isFinishing ? 'not-allowed' : 'pointer',
                  fontSize: '0.82rem',
                  transition: 'all 0.15s ease'
                }}
              >
                {option.label}
              </button>
            );
          })}
        </div>
      </div>
 
      {feedback && (
        <div style={{ textAlign: 'center', color: '#f87171', fontSize: '0.8rem', fontWeight: 'bold' }}>
          {feedback}
        </div>
      )}
 
      {lastGain !== null && (
        <div style={{ textAlign: 'center', color: '#22c55e', fontSize: '0.85rem', fontWeight: 'bold' }}>
          +{lastGain} XP{lastGain > 1 ? ' (combo!)' : ''}
        </div>
      )}
    </div>
  );
}