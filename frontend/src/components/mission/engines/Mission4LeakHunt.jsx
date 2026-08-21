import React, { useState } from 'react';
 
// isLeak: true = gasto recorrente que merece atenção (vazamento real)
// isLeak: false = parece recorrente/pequeno, mas é planejado ou necessário
// (armadilha proposital para não ensinar "recorrente = sempre ruim")
const EXPENSES = [
  {
    id: 'assinatura-esquecida',
    label: 'Assinatura de app que você esqueceu que ainda paga',
    icon: '📲',
    isLeak: true
  },
  {
    id: 'lanche-impulso',
    label: 'Lanche extra comprado por impulso quase todo dia',
    icon: '🍔',
    isLeak: true
  },
  {
    id: 'transporte-escola',
    label: 'Passagem de ônibus para ir à escola',
    icon: '🚌',
    isLeak: false
  },
  {
    id: 'presente-planejado',
    label: 'Guardando aos poucos para o presente de um amigo',
    icon: '🎁',
    isLeak: false
  },
  {
    id: 'streaming-usado',
    label: 'Assinatura de streaming que você assiste toda semana',
    icon: '🎬',
    isLeak: false
  },
  {
    id: 'material-escolar',
    label: 'Material escolar necessário para as aulas',
    icon: '✏️',
    isLeak: false
  }
];
 
export function Mission4LeakHunt({ onComplete, onError }) {
  const [sealedIds, setSealedIds] = useState([]);
  const [wrongId, setWrongId] = useState(null);
  const [feedback, setFeedback] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
 
  const totalLeaks = EXPENSES.filter((e) => e.isLeak).length;
  const allSealed = sealedIds.length === totalLeaks;
  const fillPercent = Math.round((sealedIds.length / totalLeaks) * 100);
 
  const handleItemClick = (item) => {
    if (wrongId) return;
    if (sealedIds.includes(item.id)) return;
 
    if (!item.isLeak) {
      setWrongId(item.id);
      setFeedback('Esse gasto é planejado ou necessário — não é um vazamento.');
 
      if (onError) onError();
 
      setTimeout(() => {
        setWrongId(null);
        setFeedback(null);
      }, 1200);
 
      return;
    }
 
    setWrongId(null);
    setFeedback(null);
    setSealedIds((prev) => [...prev, item.id]);
  };
 
  const handleFinish = () => {
    if (isSubmitting) return;
    if (!allSealed) return;
 
    setIsSubmitting(true);
    if (onComplete) {
      onComplete({ success: true, xpEarned: 10 });
    }
  };
 
  return (
    <div style={{ color: '#fff', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <div style={{ backgroundColor: '#1e293b', padding: '1rem', borderRadius: '12px', border: '1px solid #334155' }}>
        <p style={{ margin: 0, fontSize: '0.85rem', color: '#cbd5e1' }}>
          <strong>Aprix diz:</strong> "Nem todo gasto pequeno é um problema — mas alguns vazam sem você perceber. Ache só os que realmente merecem atenção."
        </p>
      </div>
 
      {/* Reservatório visual */}
      <div style={{ backgroundColor: '#0f172a', border: '1px solid #334155', borderRadius: '12px', padding: '0.9rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: '#94a3b8', marginBottom: '6px' }}>
          <span>💧 Vazamentos consertados</span>
          <span>{sealedIds.length}/{totalLeaks}</span>
        </div>
        <div style={{ height: '14px', borderRadius: '999px', backgroundColor: '#1e293b', overflow: 'hidden' }}>
          <div
            style={{
              height: '100%',
              width: `${fillPercent}%`,
              backgroundColor: '#22c55e',
              transition: 'width 0.3s ease'
            }}
          />
        </div>
      </div>
 
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {EXPENSES.map((item) => {
          const isSealed = sealedIds.includes(item.id);
          const isWrong = wrongId === item.id;
 
          let border = '1px solid #334155';
          let bg = '#0f172a';
 
          if (isWrong) {
            border = '2px solid #ef4444';
            bg = 'rgba(239, 68, 68, 0.2)';
          } else if (isSealed) {
            border = '2px solid #22c55e';
            bg = 'rgba(34, 197, 94, 0.15)';
          }
 
          return (
            <button
              key={item.id}
              onClick={() => handleItemClick(item)}
              disabled={isSealed}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                padding: '0.7rem 0.85rem',
                borderRadius: '10px',
                border,
                backgroundColor: bg,
                color: '#fff',
                cursor: isSealed ? 'default' : 'pointer',
                textAlign: 'left',
                fontSize: '0.82rem',
                transition: 'all 0.2s ease'
              }}
            >
              <span style={{ fontSize: '1.3rem' }}>{item.icon}</span>
              <span>{item.label}</span>
              {isSealed && <span style={{ marginLeft: 'auto', fontSize: '0.75rem', color: '#4ade80' }}>Vedado ✓</span>}
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
        disabled={!allSealed || isSubmitting}
        style={{
          width: '100%',
          padding: '0.85rem',
          backgroundColor: allSealed && !isSubmitting ? '#0284c7' : '#334155',
          color: '#fff',
          border: 'none',
          borderRadius: '8px',
          fontWeight: 'bold',
          cursor: allSealed && !isSubmitting ? 'pointer' : 'not-allowed'
        }}
      >
        {allSealed ? 'Concluir Caça ao Vazamento' : `Vede os vazamentos (${sealedIds.length}/${totalLeaks})`}
      </button>
    </div>
  );
}