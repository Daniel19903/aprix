import React, { useState } from 'react';

// R$ 100 - R$42 = R$58 "sumiram ". As pistas corretas somam exatamente R$58

// as duas ultimas são distrações: não são gastos (uma é presente ganho, outra é dinheiro guardado, não perdidos).

const CLUES = [
   { id: 'lanche', label: 'Lanche na cantina', icon: '🍫', amount: 12, isRelevant: true },
   { id: 'jogo', label: 'Compra dentro de um jogo', icon: '🎮', amount: 20, isRelevant: true },
   { id: 'bebida', label: 'Bebida gelada', icon: '🥤', amount: 8, isRelevant: true },
   { id: 'app', label: 'Assinatura de aplicativo', icon: '📱', amount: 10, isRelevant: true },
   { id: 'transporte', label: 'Transporte', icon: '🚌', amount: 8, isRelevant: true },
   { id: 'presente', label: 'Presente que ganhou de aniversário', icon: '🎁', amount: 0, isRelevant: false },
   { id: 'guardado', label: 'Dinheiro que está guardado no cofrinho', icon: '🐷', amount: 0, isRelevant: false }
];

const TOTAL_INICIAL = 100;
const TOTAL_RESTANTE = 42;
const TOTAL_ESPERADO = TOTAL_INICIAL - TOTAL_RESTANTE; // 58

export function Mission3Investigation ({ onComplete, onError }) {
    const [foundIds, setFoundIds] = useState([]);
  const [wrongId, setWrongId] = useState(null);
  const [feedback, setFeedback] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
 
  const foundTotal = CLUES
    .filter((c) => foundIds.includes(c.id))
    .reduce((sum, c) => sum + c.amount, 0);
 
  const relevantCount = CLUES.filter((c) => c.isRelevant).length;
  const allFound = foundIds.length === relevantCount;
 
  const handleClueClick = (clue) => {
    if (wrongId) return;
    if (foundIds.includes(clue.id)) return; // já encontrada, ignora
 
    if (!clue.isRelevant) {
      setWrongId(clue.id);
      setFeedback('Isso não explica o dinheiro que sumiu.');
 
      if (onError) onError();
 
      setTimeout(() => {
        setWrongId(null);
        setFeedback(null);
      }, 1200);
 
      return;
    }
 
    setWrongId(null);
    setFeedback(null);
    setFoundIds((prev) => [...prev, clue.id]);
  };
 
  const handleFinish = () => {
    if (isSubmitting) return;
    if (!allFound) return;
 
    setIsSubmitting(true);
    if (onComplete) {
      onComplete({ success: true, xpEarned: 10 });
    }
  };
 
  return (
    <div style={{ color: '#fff', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <div style={{ backgroundColor: '#1e293b', padding: '1rem', borderRadius: '12px', border: '1px solid #334155' }}>
        <p style={{ margin: 0, fontSize: '0.85rem', color: '#cbd5e1' }}>
          <strong>Aprix diz:</strong> "Você tinha R$ {TOTAL_INICIAL} fictícios. Agora sobraram R$ {TOTAL_RESTANTE}. Investigue o quarto e encontre para onde o dinheiro foi!"
        </p>
      </div>
 
      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: '#94a3b8' }}>
        <span>Pistas encontradas: {foundIds.length}/{relevantCount}</span>
        <span style={{ color: '#38bdf8', fontWeight: 'bold' }}>
          Total explicado: R$ {foundTotal} / R$ {TOTAL_ESPERADO}
        </span>
      </div>
 
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
        {CLUES.map((clue) => {
          const isFound = foundIds.includes(clue.id);
          const isWrong = wrongId === clue.id;
 
          let border = '1px solid #334155';
          let bg = '#0f172a';
 
          if (isWrong) {
            border = '2px solid #ef4444';
            bg = 'rgba(239, 68, 68, 0.2)';
          } else if (isFound) {
            border = '2px solid #22c55e';
            bg = 'rgba(34, 197, 94, 0.15)';
          }
 
          return (
            <button
              key={clue.id}
              onClick={() => handleClueClick(clue)}
              disabled={isFound}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                padding: '0.75rem',
                borderRadius: '10px',
                border,
                backgroundColor: bg,
                color: '#fff',
                cursor: isFound ? 'default' : 'pointer',
                textAlign: 'left',
                transition: 'all 0.2s ease'
              }}
            >
              <span style={{ fontSize: '1.4rem' }}>{clue.icon}</span>
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <span style={{ fontSize: '0.82rem', fontWeight: 'bold' }}>{clue.label}</span>
                {isFound && (
                  <span style={{ fontSize: '0.72rem', color: '#4ade80' }}>Gasto: R$ {clue.amount}</span>
                )}
              </div>
            </button>
          );
        })}
      </div>
 
      {feedback && (
        <div style={{ textAlign: 'center', color: '#f87171', fontSize: '0.8rem', fontWeight: 'bold' }}>
          {feedback}
        </div>
      )}
 
      <button
        onClick={handleFinish}
        disabled={!allFound || isSubmitting}
        style={{
          width: '100%',
          padding: '0.85rem',
          backgroundColor: allFound && !isSubmitting ? '#0284c7' : '#334155',
          color: '#fff',
          border: 'none',
          borderRadius: '8px',
          fontWeight: 'bold',
          cursor: allFound && !isSubmitting ? 'pointer' : 'not-allowed'
        }}
      >
        {allFound ? 'Concluir Investigação' : `Encontre todas as pistas (${foundIds.length}/${relevantCount})`}
      </button>
    </div>
  );
}