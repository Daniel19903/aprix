import React, { useState } from 'react';
 
const AVAILABLE_BUDGET = 500;
 
const CATEGORIES = [
  { id: 'necessidades', label: 'Necessidades', icon: '🧾', color: '#facc15' },
  { id: 'objetivo', label: 'Objetivo', icon: '🎯', color: '#38bdf8' },
  { id: 'lazer', label: 'Lazer', icon: '🎮', color: '#f472b6' },
  { id: 'reserva', label: 'Reserva', icon: '🛡️', color: '#22c55e' }
];
 
export function Mission7BalancedBudget({ onComplete, onError }) {
  const [values, setValues] = useState({ necessidades: 0, objetivo: 0, lazer: 0, reserva: 0 });
  const [feedback, setFeedback] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
 
  const total = Object.values(values).reduce((sum, v) => sum + v, 0);
  const isOverBudget = total > AVAILABLE_BUDGET;
  const remaining = AVAILABLE_BUDGET - total;
 
  const handleSliderChange = (categoryId, newValue) => {
    setFeedback(null);
    setValues((prev) => ({ ...prev, [categoryId]: Number(newValue) }));
  };
 
  const handleConfirm = () => {
    if (isSubmitting) return;
 
    if (isOverBudget) {
      setFeedback('⚠️ Seu planejamento ultrapassou o dinheiro disponível. Ajuste os sliders.');
      if (onError) onError();
      return;
    }
 
    if (total === 0) {
      setFeedback('Distribua pelo menos uma parte do seu orçamento antes de confirmar.');
      return;
    }
 
    setIsSubmitting(true);
    if (onComplete) {
      onComplete({ success: true, xpEarned: 10 });
    }
  };
 
  return (
    <div style={{ color: '#fff', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <div style={{ backgroundColor: '#1e293b', padding: '1rem', borderRadius: '12px', border: '1px solid #334155' }}>
        <p style={{ margin: 0, fontSize: '0.85rem', color: '#cbd5e1' }}>
          <strong>Aprix diz:</strong> "Você tem R$ {AVAILABLE_BUDGET} disponíveis este mês. Distribua entre as categorias sem ultrapassar o total."
        </p>
      </div>
 
      {/* Barra de equilíbrio (balança) */}
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', color: '#94a3b8', marginBottom: '6px' }}>
          <span>💰 Usado: R$ {total} / R$ {AVAILABLE_BUDGET}</span>
          <span style={{ color: isOverBudget ? '#ef4444' : '#22c55e', fontWeight: 'bold' }}>
            {isOverBudget ? `Excedeu R$ ${Math.abs(remaining)}` : `Sobra: R$ ${remaining}`}
          </span>
        </div>
        <div style={{
          height: '16px',
          borderRadius: '999px',
          backgroundColor: '#1e293b',
          overflow: 'hidden',
          display: 'flex',
          border: isOverBudget ? '2px solid #ef4444' : '1px solid #334155'
        }}>
          {CATEGORIES.map((cat) => {
            const widthPercent = Math.min((values[cat.id] / AVAILABLE_BUDGET) * 100, 100);
            return (
              <div
                key={cat.id}
                style={{
                  width: `${widthPercent}%`,
                  backgroundColor: cat.color,
                  transition: 'width 0.15s ease'
                }}
              />
            );
          })}
        </div>
      </div>
 
      {/* Sliders */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
        {CATEGORIES.map((cat) => (
          <div key={cat.id}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', marginBottom: '4px' }}>
              <span>{cat.icon} {cat.label}</span>
              <span style={{ fontWeight: 'bold', color: cat.color }}>R$ {values[cat.id]}</span>
            </div>
            <input
              type="range"
              min="0"
              max={AVAILABLE_BUDGET}
              step="10"
              value={values[cat.id]}
              onChange={(e) => handleSliderChange(cat.id, e.target.value)}
              style={{ width: '100%', accentColor: cat.color, cursor: 'pointer' }}
            />
          </div>
        ))}
      </div>
 
      {feedback && (
        <div style={{ textAlign: 'center', color: '#f87171', fontSize: '0.8rem', fontWeight: 'bold' }}>
          {feedback}
        </div>
      )}
 
      <button
        onClick={handleConfirm}
        disabled={isSubmitting}
        style={{
          width: '100%',
          padding: '0.85rem',
          backgroundColor: !isSubmitting ? '#0284c7' : '#334155',
          color: '#fff',
          border: 'none',
          borderRadius: '8px',
          fontWeight: 'bold',
          cursor: !isSubmitting ? 'pointer' : 'not-allowed'
        }}
      >
        Confirmar Orçamento
      </button>
    </div>
  );
}