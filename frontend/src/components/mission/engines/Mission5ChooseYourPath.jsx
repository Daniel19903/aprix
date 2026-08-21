import React, { useState } from 'react';
 
const STARTING_BALANCE = 100;
 
// Cada opção tem:
// - cost: quanto sai do saldo ao escolher (pode ser 0)
// - quality: 'smart' | 'neutral' | 'wasteful' — NUNCA é mostrado durante o
//   jogo, só no resumo final. O jogador precisa avaliar o contexto na hora,
//   sem feedback imediato — só descobre o resultado real no fim da missão.
const ROUNDS = [
  {
    id: 'r1',
   title: 'Celular quebrado',

prompt: 'A tela do seu celular quebrou. Para consertá-la e usar o celular normalmente, você precisa pagar R$ 35. Você também pode gastar R$ 15 em um jogo novo, mas o celular continuará quebrado.',
    options: [
      { id: 'r1a', label: 'Pagar o conserto da tela (R$ 35)', cost: 35, quality: 'smart' },
      { id: 'r1b', label: ' Você também pode gastar em um jogo novo (R$ 15)', cost: 15, quality: 'wasteful' },
      { id: 'r1c', label: 'Não fazer nada por enquanto (R$ 0)', cost: 0, quality: 'neutral' }
    ]
  },
  {
    id: 'r2',
    title: 'Aniversário de um amigo',
    prompt: 'Aniversário de um amigo próximo. Um presente que ele realmente vai gostar custa R$ 25. Qualquer coisa genérica custa R$ 8.',
    options: [
      { id: 'r2a', label: 'Dar o presente que ele vai gostar de verdade (R$ 25)', cost: 25, quality: 'smart' },
      { id: 'r2b', label: 'Comprar qualquer coisa só para "ter presente" (R$ 8)', cost: 8, quality: 'wasteful' },
      { id: 'r2c', label: 'Não levar presente e economizar (R$ 0)', cost: 0, quality: 'neutral' }
    ]
  },
  {
    id: 'r3',
    title: 'Promoção de jogo',

prompt: 'Um jogo que você queria comprar há muito tempo entrou em promoção por R$ 40. Outro jogo que você nem conhecia apareceu em uma oferta por R$ 25. Pense antes de escolher.',
    options: [
      { id: 'r3a', label: 'Comprar o jogo que você já pesquisava e queria (R$ 50)', cost: 50, quality: 'smart' },
      { id: 'r3b', label: 'Comprar o jogo aleatório só porque "tá barato" (R$ 25)', cost: 25, quality: 'wasteful' },
      { id: 'r3c', label: 'Esperar mais um pouco antes de decidir (R$ 0)', cost: 0, quality: 'neutral' }
    ]
  },
  {
    id: 'r4',
    title: 'Conta de internet',
    prompt: 'A conta de internet venceu. Pagar agora custa R$ 40. Deixar pra depois custa R$ 50 (com multa).',
    options: [
      { id: 'r4a', label: 'Pagar agora e evitar a multa (R$ 40)', cost: 40, quality: 'smart' },
      { id: 'r4b', label: 'Deixar pra depois e pagar com multa (R$ 50)', cost: 50, quality: 'wasteful' },
      { id: 'r4c', label: 'Pedir um novo prazo sem multa (R$ 0)', cost: 0, quality: 'neutral' }
    ]
  },
  {
    id: 'r5',
    title: 'Fim do mês',
    // Rodada final: usa o saldo atual, resolvido em runtime.
    dynamic: true,
    prompt: 'Fim do mês fictício chegou. Sobrou uma parte do dinheiro. O que fazer com o que restou?',
    buildOptions: (balance) => [
      { id: 'r5a', label: `Gastar tudo que sobrou (R$ ${balance}) só para não deixar sobrando`, cost: balance, quality: 'wasteful' },
      { id: 'r5b', label: `Guardar metade e gastar a outra metade com algo que gosta (R$ ${Math.round(balance / 2)})`, cost: Math.round(balance / 2), quality: 'smart' },
      { id: 'r5c', label: 'Guardar tudo que sobrou (R$ 0)', cost: 0, quality: 'neutral' }
    ]
  }
];
 
const QUALITY_CONFIG = {
  smart: { xp: 5, losesLife: false, label: 'Melhor escolha', color: '#22c55e' },
  neutral: { xp: 1, losesLife: false, label: 'Escolha mediana', color: '#facc15' },
  wasteful: { xp: 0, losesLife: true, label: 'Pior escolha', color: '#ef4444' }
};
 
export function Mission5ChooseYourPath({ onComplete, onError }) {
  const [roundIndex, setRoundIndex] = useState(0);
  const [balance, setBalance] = useState(STARTING_BALANCE);
  const [roundResults, setRoundResults] = useState([]); // guardado em silêncio, só exibido no final
  const [isResolving, setIsResolving] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
 
  const round = ROUNDS[roundIndex];
  const isLastRound = roundIndex === ROUNDS.length - 1;
  const options = round.dynamic ? round.buildOptions(balance) : round.options;
 
  const totalXp = roundResults.reduce((sum, r) => sum + r.xp, 0);
  const livesLost = roundResults.filter((r) => r.losesLife).length;
 
  const handleChoice = (option) => {
    if (isResolving) return;
 
    const config = QUALITY_CONFIG[option.quality];
    const newBalance = Math.max(0, balance - option.cost);
 
    setIsResolving(true);
    setBalance(newBalance);
 
    // Vida ainda é descontada em tempo real (o Header já reflete isso
    // globalmente) — só o "porquê" e o XP ficam escondidos até o final.
    if (config.losesLife && onError) {
      onError();
    }
 
    setRoundResults((prev) => [
      ...prev,
      { roundTitle: round.title, quality: option.quality, xp: config.xp, losesLife: config.losesLife }
    ]);
 
    // Pequena pausa neutra entre rodadas, sem revelar nada sobre a escolha.
    setTimeout(() => {
      setIsResolving(false);
 
      if (isLastRound) {
        setIsFinished(true);
      } else {
        setRoundIndex((prev) => prev + 1);
      }
    }, 500);
  };
 
  const handleFinishMission = () => {
    if (isSubmitting) return;
    setIsSubmitting(true);
 
    if (onComplete) {
      onComplete({ success: true, xpEarned: totalXp });
    }
  };
 
  if (isFinished) {
    return (
      <div style={{ color: '#fff', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <div style={{ backgroundColor: '#1e293b', padding: '1rem', borderRadius: '12px', border: '1px solid #334155' }}>
          <p style={{ margin: 0, fontSize: '0.85rem', color: '#cbd5e1' }}>
            <strong>Aprix diz:</strong> "Vamos ver como foram suas escolhas ao longo do caminho."
          </p>
        </div>
 
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {roundResults.map((r, idx) => (
            <div
              key={idx}
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '0.65rem 0.85rem',
                borderRadius: '10px',
                border: `1px solid ${QUALITY_CONFIG[r.quality].color}55`,
                backgroundColor: '#0f172a'
              }}
            >
              <span style={{ fontSize: '0.8rem' }}>{r.roundTitle}</span>
              <span style={{ fontSize: '0.78rem', fontWeight: 'bold', color: QUALITY_CONFIG[r.quality].color }}>
                {QUALITY_CONFIG[r.quality].label}{r.xp > 0 ? ` (+${r.xp} XP)` : ''}
              </span>
            </div>
          ))}
        </div>
 
        <div style={{ backgroundColor: '#0f172a', border: '1px solid #334155', borderRadius: '12px', padding: '0.9rem', display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
          <span>💰 Saldo final: <strong>R$ {balance}</strong></span>
          <span>⭐ XP total: <strong>{totalXp}</strong></span>
        </div>
 
        {livesLost > 0 && (
          <div style={{ textAlign: 'center', fontSize: '0.78rem', color: '#f87171' }}>
            Você perdeu {livesLost} {livesLost === 1 ? 'vida' : 'vidas'} com decisões de desperdício ao longo do caminho.
          </div>
        )}
 
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
 
  return (
    <div style={{ color: '#fff', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <div style={{ backgroundColor: '#1e293b', padding: '1rem', borderRadius: '12px', border: '1px solid #334155' }}>
        <p style={{ margin: 0, fontSize: '0.85rem', color: '#cbd5e1', lineHeight: '1.5' }}>
          <strong>Aprix diz:</strong> "Cada escolha tira dinheiro do seu saldo de verdade. Você só vai saber se decidiu bem no final — pense com calma."
        </p>
      </div>
 
      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', color: '#94a3b8' }}>
        <span>Rodada {roundIndex + 1} de {ROUNDS.length}</span>
        <span style={{ color: '#38bdf8', fontWeight: 'bold' }}>💰 Saldo: R$ {balance}</span>
      </div>
 
      <div style={{ backgroundColor: '#0f172a', border: '1px solid #334155', borderRadius: '12px', padding: '1rem' }}>
        <p style={{ margin: '0 0 0.75rem 0', fontSize: '0.88rem', fontWeight: 'bold', lineHeight: '1.4' }}>
          {round.prompt}
        </p>
 
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {options.map((option) => (
            <button
              key={option.id}
              onClick={() => handleChoice(option)}
              disabled={isResolving}
              style={{
                textAlign: 'left',
                padding: '0.75rem 0.9rem',
                borderRadius: '10px',
                border: '1px solid #334155',
                backgroundColor: '#111c33',
                color: '#fff',
                cursor: isResolving ? 'not-allowed' : 'pointer',
                fontSize: '0.82rem',
                transition: 'background-color 0.15s ease'
              }}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}