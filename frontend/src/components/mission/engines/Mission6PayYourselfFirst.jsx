import React, { useState, useEffect, useRef } from 'react';

const TOTAL_COINS = 10;
const TIME_LIMIT_SECONDS = 20; 

const CATEGORIES = [
  { id: 'guardar', label: 'Guardar', icon: '🛡️', color: '#22c55e' },
  { id: 'objetivo', label: 'Objetivo', icon: '🎯', color: '#38bdf8' },
  { id: 'necessidades', label: 'Necessidades', icon: '🧾', color: '#facc15' },
  { id: 'lazer', label: 'Lazer', icon: '🎮', color: '#f472b6' }
];

const emptyAllocation = () => ({ guardar: 0, objetivo: 0, necessidades: 0, lazer: 0});

export function Mission6PayYourselfFirst({ onComplete, onError }) {
    const [coinsRemaining, setCoinsRemaining] = useState(TOTAL_COINS);
    const [allocation, setAllocation] = useState(emptyAllocation());
    const [timeLeft, setTimeLeft] = useState(TIME_LIMIT_SECONDS);
    const [phase, setPhase] = useState('playing'); // 'playing' | 'retry-message' | 'result'
    
    const [retryMessage, setRetryMessage] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const timerRef = useRef(null);

    const clearTimer = () => {
        if (timerRef.current){
            clearInterval(timerRef.current);
            timerRef.current = null;
        }
    };

    // Timer regressivo, só roda durante a fase 'playing'
  useEffect(() => {
    if (phase !== 'playing') {
      clearTimer();
      return;
    }
 
    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearTimer();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
 
    return clearTimer;
  }, [phase]);
 
  // Quando o tempo acaba, empurra o restante pro Lazer (consequência de não decidir a tempo)
  useEffect(() => {
    if (phase === 'playing' && timeLeft === 0 && coinsRemaining > 0) {
      setAllocation((prev) => ({ ...prev, lazer: prev.lazer + coinsRemaining }));
      setCoinsRemaining(0);
    }
  }, [timeLeft, phase, coinsRemaining]);
 
  // Assim que as moedas acabam (por escolha ou por tempo), avalia
  useEffect(() => {
    if (phase === 'playing' && coinsRemaining === 0) {
      evaluate();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [coinsRemaining, phase]);
 
  const evaluate = () => {
    setAllocation((current) => {
      const values = Object.values(current);
      const maxCategory = Math.max(...values);
 
      const hasSavings = current.guardar >= 1;
      const hasNecessities = current.necessidades >= 1;
      const isBalanced = maxCategory < TOTAL_COINS; // ninguém pode levar 100%
 
      const success = hasSavings && hasNecessities && isBalanced;
 
      if (success) {
        setPhase('result');
      } else {
        let reason = 'Seu orçamento ficou desequilibrado.';
        if (!hasSavings) reason = 'Você não guardou nenhuma moeda — "pague-se primeiro" começa por aí.';
        else if (!hasNecessities) reason = 'Você esqueceu completamente das necessidades básicas.';
        else if (!isBalanced) reason = 'Todo o dinheiro foi para um único pote — falta equilíbrio.';
 
        setRetryMessage(reason);
        if (onError) onError();
        setPhase('retry-message');
      }
 
      return current;
    });
  };
 
  const handleCatch = (categoryId) => {
    if (phase !== 'playing' || coinsRemaining <= 0) return;
 
    setAllocation((prev) => ({ ...prev, [categoryId]: prev[categoryId] + 1 }));
    setCoinsRemaining((prev) => prev - 1);
  };
 
  const handleRetryContinue = () => {
    setAllocation(emptyAllocation());
    setCoinsRemaining(TOTAL_COINS);
    setTimeLeft(TIME_LIMIT_SECONDS);
    setRetryMessage(null);
    setPhase('playing');
  };
 
  const handleFinishMission = () => {
    if (isSubmitting) return;
    setIsSubmitting(true);
    if (onComplete) {
      onComplete({ success: true, xpEarned: 10 });
    }
  };
 
  if (phase === 'retry-message') {
    return (
      <div style={{ color: '#fff', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <div style={{ backgroundColor: '#1e293b', padding: '1rem', borderRadius: '12px', border: '1px solid #ef4444' }}>
          <p style={{ margin: 0, fontSize: '0.85rem', color: '#fca5a5' }}>
            <strong>Aprix diz:</strong> "{retryMessage}"
          </p>
        </div>
        <button
          onClick={handleRetryContinue}
          style={{
            width: '100%',
            padding: '0.85rem',
            backgroundColor: '#0284c7',
            color: '#fff',
            border: 'none',
            borderRadius: '8px',
            fontWeight: 'bold',
            cursor: 'pointer'
          }}
        >
          Tentar de novo
        </button>
      </div>
    );
  }
 
  if (phase === 'result') {
    return (
      <div style={{ color: '#fff', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <div style={{ backgroundColor: '#1e293b', padding: '1rem', borderRadius: '12px', border: '1px solid #334155' }}>
          <p style={{ margin: 0, fontSize: '0.85rem', color: '#cbd5e1' }}>
            <strong>Aprix diz:</strong> "Você conseguiu equilibrar seu orçamento! Não existe uma única porcentagem certa — o importante é ter guardado algo e cuidado das necessidades antes do resto."
          </p>
        </div>
 
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {CATEGORIES.map((cat) => (
            <div
              key={cat.id}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                padding: '0.6rem 0.85rem',
                borderRadius: '10px',
                border: `1px solid ${cat.color}55`,
                backgroundColor: '#0f172a'
              }}
            >
              <span style={{ fontSize: '1.2rem' }}>{cat.icon}</span>
              <span style={{ flex: 1, fontSize: '0.82rem' }}>{cat.label}</span>
              <span style={{ fontWeight: 'bold', color: cat.color }}>{allocation[cat.id]} moedas</span>
            </div>
          ))}
        </div>
 
        <button
          onClick={handleFinishMission}
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
          Concluir Missão
        </button>
      </div>
    );
  }
 
  // phase === 'playing'
  return (
    <div style={{ color: '#fff', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <div style={{ backgroundColor: '#1e293b', padding: '1rem', borderRadius: '12px', border: '1px solid #334155' }}>
        <p style={{ margin: 0, fontSize: '0.85rem', color: '#cbd5e1' }}>
          <strong>Aprix diz:</strong> "Uma chuva de moedas está caindo! Distribua rápido entre os potes antes que o tempo acabe."
        </p>
      </div>
 
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>🪙 Moedas restantes: {coinsRemaining}</span>
        <span style={{ fontSize: '0.9rem', fontWeight: 'bold', color: timeLeft <= 5 ? '#ef4444' : '#38bdf8' }}>
          ⏱ {timeLeft}s
        </span>
      </div>
 
      <div style={{ height: '8px', borderRadius: '999px', backgroundColor: '#1e293b', overflow: 'hidden' }}>
        <div
          style={{
            height: '100%',
            width: `${(timeLeft / TIME_LIMIT_SECONDS) * 100}%`,
            backgroundColor: timeLeft <= 5 ? '#ef4444' : '#38bdf8',
            transition: 'width 1s linear'
          }}
        />
      </div>
 
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
        {CATEGORIES.map((cat) => (
          <button
            key={cat.id}
            onClick={() => handleCatch(cat.id)}
            disabled={coinsRemaining <= 0}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '6px',
              padding: '1rem 0.5rem',
              borderRadius: '12px',
              border: `2px solid ${cat.color}`,
              backgroundColor: `${cat.color}22`,
              color: '#fff',
              cursor: coinsRemaining > 0 ? 'pointer' : 'not-allowed',
              transition: 'transform 0.1s ease'
            }}
            onMouseDown={(e) => { e.currentTarget.style.transform = 'scale(0.96)'; }}
            onMouseUp={(e) => { e.currentTarget.style.transform = 'scale(1)'; }}
          >
            <span style={{ fontSize: '1.8rem' }}>{cat.icon}</span>
            <span style={{ fontSize: '0.8rem', fontWeight: 'bold' }}>{cat.label}</span>
            <span style={{ fontSize: '0.75rem', color: cat.color }}>{allocation[cat.id]}</span>
          </button>
        ))}
      </div>
    </div>
  );
}