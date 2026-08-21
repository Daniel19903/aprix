import React, { useState } from 'react';
 
const CATEGORIES = [
  { id: 'agora', label: 'Agora', icon: '🔴', color: '#ef4444' },
  { id: 'planejar', label: 'Planejar', icon: '🟡', color: '#facc15' },
  { id: 'pode-esperar', label: 'Pode Esperar', icon: '🔵', color: '#38bdf8' }
];
 
// acceptableCategories: array de categorias válidas para aquele cenário.
// As 4 primeiras têm 1 única resposta certa (situações claras).
// As 4 últimas têm 2 respostas aceitáveis (situações ambíguas de propósito,
// para forçar reflexão em vez de padrão decorado).
const CARDS = [
  { id: 'c1', text: 'Pagar a conta de luz que vence hoje', acceptableCategories: ['agora'] },
  { id: 'c2', text: 'Juntar dinheiro para um curso que você quer fazer daqui a 3 meses', acceptableCategories: ['planejar'] },
  { id: 'c3', text: 'Comprar a atualização mais recente de um jogo que você já tem', acceptableCategories: ['pode-esperar'] },
  { id: 'c4', text: 'Comprar um remédio necessário porque você está passando mal', acceptableCategories: ['agora'] },
 
  { id: 'c5', text: 'Uma inscrição com desconto termina hoje, mas você ainda não tem certeza se vai fazer o curso', acceptableCategories: ['agora', 'pode-esperar'] },
  { id: 'c6', text: 'Seu fone de ouvido ainda funciona, mas o fio está começando a gastar', acceptableCategories: ['planejar', 'pode-esperar'] },
  { id: 'c7', text: 'Sua família comentou sobre uma possível viagem, mas ainda não decidiram nada', acceptableCategories: ['planejar', 'pode-esperar'] },
  { id: 'c8', text: 'Sua mochila tem um rasgo pequeno, mas ainda dá pra usar por enquanto', acceptableCategories: ['agora', 'planejar'] }
];
 
const COMBO_BONUS_THRESHOLD = 3;
const COMBO_BONUS_XP = 1;
 
export function Mission8PriorityRanking({ onComplete, onError }) {
  const [cardIndex, setCardIndex] = useState(0);
  const [combo, setCombo] = useState(0);
  const [totalXp, setTotalXp] = useState(0);
  const [wrongCategoryId, setWrongCategoryId] = useState(null);
  const [correctCategoryId, setCorrectCategoryId] = useState(null);
  const [feedback, setFeedback] = useState(null);
  const [isFinishing, setIsFinishing] = useState(false);
 
  const card = CARDS[cardIndex];
  const isLastCard = cardIndex === CARDS.length - 1;
 
  const handleChoice = (categoryId) => {
    if (wrongCategoryId || correctCategoryId || isFinishing) return;
 
    const isCorrect = card.acceptableCategories.includes(categoryId);
 
    if (!isCorrect) {
      // Erro: reseta combo, tira vida, NÃO soma XP, NÃO avança o card,
      // NÃO revela qual era a categoria certa.
      setCombo(0);
      setWrongCategoryId(categoryId);
      setFeedback('Pensa de novo sobre a urgência real disso.');
 
      if (onError) onError();
 
      setTimeout(() => {
        setWrongCategoryId(null);
        setFeedback(null);
      }, 900);
 
      return;
    }
 
    // Acerto: soma 1 XP + bônus de combo, avança para o próximo card.
    const newCombo = combo + 1;
    const bonus = newCombo >= COMBO_BONUS_THRESHOLD ? COMBO_BONUS_XP : 0;
    const gained = 1 + bonus;
    const newTotalXp = totalXp + gained;
 
    setCombo(newCombo);
    setTotalXp(newTotalXp);
    setCorrectCategoryId(categoryId);
    setFeedback(`+${gained} XP${bonus > 0 ? ' (combo!)' : ''}`);
 
    setTimeout(() => {
      setCorrectCategoryId(null);
      setFeedback(null);
 
      if (isLastCard) {
        setIsFinishing(true);
        if (onComplete) {
          onComplete({ success: true, xpEarned: newTotalXp });
        }
      } else {
        setCardIndex((prev) => prev + 1);
      }
    }, 600);
  };
 
  return (
    <div style={{ color: '#fff', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <div style={{ backgroundColor: '#1e293b', padding: '1rem', borderRadius: '12px', border: '1px solid #334155' }}>
        <p style={{ margin: 0, fontSize: '0.85rem', color: '#cbd5e1' }}>
          <strong>Aprix diz:</strong> "Nem tudo tem a mesma prioridade. Algumas situações aqui não têm uma única resposta óbvia — pensa com calma."
        </p>
      </div>
 
      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: '#94a3b8' }}>
        <span>Carta {cardIndex + 1} de {CARDS.length}</span>
        <span style={{ color: combo >= COMBO_BONUS_THRESHOLD ? '#facc15' : '#94a3b8', fontWeight: 'bold' }}>
          🔥 Combo: {combo}
        </span>
        <span style={{ color: '#38bdf8', fontWeight: 'bold' }}>XP: {totalXp}</span>
      </div>
 
      <div style={{ backgroundColor: '#0f172a', border: '1px solid #334155', borderRadius: '12px', padding: '1rem' }}>
        <p style={{ margin: 0, fontSize: '0.9rem', fontWeight: 'bold', lineHeight: '1.4' }}>
          {card.text}
        </p>
      </div>
 
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '8px' }}>
        {CATEGORIES.map((cat) => {
          const isWrong = wrongCategoryId === cat.id;
          const isCorrectPick = correctCategoryId === cat.id;
 
          let border = `1.5px solid ${cat.color}88`;
          let bg = `${cat.color}15`;
 
          if (isWrong) {
            border = '2px solid #ef4444';
            bg = 'rgba(239, 68, 68, 0.2)';
          } else if (isCorrectPick) {
            border = '2px solid #22c55e';
            bg = 'rgba(34, 197, 94, 0.2)';
          }
 
          return (
            <button
              key={cat.id}
              onClick={() => handleChoice(cat.id)}
              disabled={isFinishing}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '4px',
                padding: '0.8rem 0.4rem',
                borderRadius: '10px',
                border,
                backgroundColor: bg,
                color: '#fff',
                cursor: isFinishing ? 'not-allowed' : 'pointer',
                fontSize: '0.78rem',
                fontWeight: 'bold',
                transition: 'all 0.15s ease'
              }}
            >
              <span style={{ fontSize: '1.4rem' }}>{cat.icon}</span>
              <span>{cat.label}</span>
            </button>
          );
        })}
      </div>
 
      {feedback && (
        <div
          style={{
            textAlign: 'center',
            fontSize: '0.8rem',
            fontWeight: 'bold',
            color: wrongCategoryId ? '#f87171' : '#4ade80'
          }}
        >
          {feedback}
        </div>
      )}
    </div>
  );
}