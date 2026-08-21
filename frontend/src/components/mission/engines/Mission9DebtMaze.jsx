import React, { useState } from 'react';

const STAGES = [
  {
    id: 'stage1',
    title: 'Estágio 1: Entrada do Labirinto',
    scenario: 'Sua renda inicial é de R$ 500. Um serviço de streaming oferece 5 planos e promoções na entrada:',
    paths: [
      { id: 'p1_1', label: 'Assinar plano Premium anual parcelado no cartão sem testar', impact: -150 },
      { id: 'p1_2', label: 'Aceitar oferta com brinde exclusivo que cobra renovação automática', impact: -50 },
      { id: 'p1_3', label: 'Manter a conta gratuita com anúncios por enquanto', impact: 0 },
      { id: 'p1_4', label: 'Dividir a assinatura básica com um amigo', impact: +50 },
      { id: 'p1_5', label: 'Usar cupom de 30 dias grátis e anotar para cancelar antes da cobrança', impact: +100 }
    ]
  },
  {
    id: 'stage2',
    title: 'Estágio 2: O Corredor de Ofertas',
    scenario: 'Você precisa de um equipamento para trabalhar/estudar. Escolha como adquirir:',
    paths: [
      { id: 'p2_1', label: 'Comprar o modelo top de linha parcelado em 18x com juros embutidos', impact: -200 },
      { id: 'p2_2', label: 'Pegar emprestado com um conhecido pagando uma taxa simbólica', impact: 0 },
      { id: 'p2_3', label: 'Comprar um seminovo revisado com pagamento à vista negociado', impact: +100 },
      { id: 'p2_4', label: 'Pesquisar e encontrar um cupom de desconto em dinheiro de volta (cashback)', impact: +150 }
    ]
  },
  {
    id: 'stage3',
    title: 'Estágio 3: A Bifurcação das Imprevistos',
    scenario: 'Surgiu um imprevisto financeiro no final do mês. Como você reage?',
    paths: [
      { id: 'p3_1', label: 'Usar o limite do cartão / crédito especial sem olhar as taxas', impact: -150 },
      { id: 'p3_2', label: 'Reorganizar o orçamento cortando lazer até o próximo mês', impact: 0 },
      { id: 'p3_3', label: 'Usar uma reserva guardada anteriormente sem gerar dívidas', impact: +100 }
    ]
  },
  {
    id: 'stage4',
    title: 'Estágio 4: A Porta de Saída',
    scenario: 'Sua última decisão para sair do labirinto com a vida financeira intacta:',
    paths: [
      { id: 'p4_1', label: 'Pegar um empréstimo rápido para ter dinheiro sobressalente', impact: -100 },
      { id: 'p4_2', label: 'Investir o valor economizado em uma aplicação segura de liquidez diária', impact: +150 }
    ]
  }
];

export function Mission9DebtMaze({ onComplete, onError }) {
  const [stageIndex, setStageIndex] = useState(0);
  const [balance, setBalance] = useState(500); // Saldo base R$ 500
  const [selectedPathId, setSelectedPathId] = useState(null);
  const [summary, setSummary] = useState(null);

  const currentStage = STAGES[stageIndex];
  const isLastStage = stageIndex === STAGES.length - 1;

  const handleSelectPath = (path) => {
    if (selectedPathId !== null) return;

    const newBalance = Math.min(1000, balance + path.impact); // Teto de R$ 1000
    setSelectedPathId(path.id);

    setTimeout(() => {
      setSelectedPathId(null);
      setBalance(newBalance);

      if (isLastStage) {
        evaluateFinalResult(newBalance);
      } else {
        setStageIndex((prev) => prev + 1);
      }
    }, 600);
  };

  const evaluateFinalResult = (finalBalance) => {
    let xpEarned = 0;
    let status = '';

    if (finalBalance < 500) {
      status = 'FAILED';
    } else if (finalBalance === 500) {
      xpEarned = 1;
      status = 'NEUTRAL';
    } else if (finalBalance < 700) {
      xpEarned = 2;
      status = 'GOOD';
    } else if (finalBalance < 1000) {
      xpEarned = 3;
      status = 'GREAT';
    } else {
      // finalBalance === 1000 (Teto Máximo)
      xpEarned = 10;
      status = 'PERFECT';
    }

    setSummary({ finalBalance, xpEarned, status });
  };

  const handleFinish = () => {
    if (!summary) return;

    if (summary.status === 'FAILED') {
      if (onError) onError();
      // Reseta o labirinto para tentar novamente
      setStageIndex(0);
      setBalance(500);
      setSummary(null);
    } else {
      if (onComplete) {
        onComplete({ success: true, xpEarned: summary.xpEarned });
      }
    }
  };

  return (
    <div style={{ color: '#fff', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <div style={{ backgroundColor: '#1e293b', padding: '1rem', borderRadius: '12px', border: '1px solid #334155' }}>
        <p style={{ margin: 0, fontSize: '0.85rem', color: '#cbd5e1' }}>
          <strong>Aprix diz:</strong> "O labirinto do endividamento começa amplo e vai afunilando. Analise bem as escolhas sem olhar para números — o contexto revelará o caminho."
        </p>
      </div>

      {!summary ? (
        <>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: '#94a3b8' }}>
            <span>🌀 Trecho {stageIndex + 1} de {STAGES.length}</span>
            <span>🚪 Caminhos disponíveis: {currentStage.paths.length}</span>
          </div>

          {/* Progresso do Funil */}
          <div style={{ display: 'flex', gap: '6px', justifyContent: 'center' }}>
            {STAGES.map((s, idx) => (
              <div
                key={s.id}
                style={{
                  flex: 1,
                  height: '8px',
                  borderRadius: '4px',
                  backgroundColor: idx < stageIndex ? '#22c55e' : idx === stageIndex ? '#facc15' : '#1e293b',
                  border: '1px solid #334155'
                }}
              />
            ))}
          </div>

          <div style={{ backgroundColor: '#0f172a', border: '1px solid #334155', borderRadius: '12px', padding: '1rem' }}>
            <h4 style={{ margin: '0 0 6px 0', fontSize: '0.9rem', color: '#38bdf8' }}>{currentStage.title}</h4>
            <p style={{ margin: 0, fontSize: '0.82rem', lineHeight: '1.4' }}>{currentStage.scenario}</p>
          </div>

          {/* Opções de Caminhos */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {currentStage.paths.map((path) => {
              const isSelected = selectedPathId === path.id;

              return (
                <button
                  key={path.id}
                  onClick={() => handleSelectPath(path)}
                  disabled={selectedPathId !== null}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    textAlign: 'left',
                    padding: '0.8rem 1rem',
                    borderRadius: '10px',
                    border: isSelected ? '2px solid #38bdf8' : '1px solid #334155',
                    backgroundColor: isSelected ? 'rgba(56, 189, 248, 0.2)' : '#111c33',
                    color: '#fff',
                    cursor: selectedPathId !== null ? 'not-allowed' : 'pointer',
                    fontSize: '0.82rem',
                    transition: 'all 0.15s ease'
                  }}
                >
                  <span style={{ fontSize: '1rem' }}>🚪</span>
                  <span>{path.label}</span>
                </button>
              );
            })}
          </div>
        </>
      ) : (
        /* Tela de Resultado e Avaliação Final */
        <div style={{ backgroundColor: '#0f172a', border: '1px solid #334155', borderRadius: '12px', padding: '1.2rem', textAlign: 'center', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <h3 style={{ margin: 0, color: summary.status === 'FAILED' ? '#ef4444' : '#4ade80' }}>
            {summary.status === 'FAILED' ? '🚨 Preso na Dívida!' : '🏆 Labirinto Concluído!'}
          </h3>

          <div>
            <p style={{ margin: '0 0 4px 0', fontSize: '0.85rem', color: '#94a3b8' }}>Seu Saldo Final acumulado:</p>
            <p style={{ margin: 0, fontSize: '1.8rem', fontWeight: 'bold', color: summary.finalBalance < 500 ? '#ef4444' : '#38bdf8' }}>
              R$ {summary.finalBalance}
            </p>
          </div>

          <div style={{ fontSize: '0.85rem', color: '#cbd5e1', lineHeight: '1.4' }}>
            {summary.status === 'FAILED' && 'Você terminou abaixo dos R$ 500 iniciais devido a más escolhas. Perdeu 1 vida e precisa tentar novamente.'}
            {summary.status === 'NEUTRAL' && 'Você terminou com os R$ 500 exatos. Passou com sufoco e sem margem financeira. (+1 XP)'}
            {summary.status === 'GOOD' && 'Você gerenciou bem o orçamento e saiu com lucro moderado! (+2 XP)'}
            {summary.status === 'GREAT' && 'Excelente planejamento! Você tomou decisões muito conscientes. (+3 XP)'}
            {summary.status === 'PERFECT' && 'Perfeito! Alcançou o teto máximo de R$ 1.000 através de escolhas impecáveis! (+10 XP)'}
          </div>

          <button
            onClick={handleFinish}
            style={{
              width: '100%',
              padding: '0.85rem',
              backgroundColor: summary.status === 'FAILED' ? '#ef4444' : '#22c55e',
              color: '#fff',
              border: 'none',
              borderRadius: '8px',
              fontWeight: 'bold',
              cursor: 'pointer',
              fontSize: '0.9rem'
            }}
          >
            {summary.status === 'FAILED' ? 'Tentar Novamente (-1 Vida)' : 'Concluir Missão'}
          </button>
        </div>
      )}
    </div>
  );
}