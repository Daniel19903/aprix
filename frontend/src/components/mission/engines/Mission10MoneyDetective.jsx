import React, { useState } from 'react'
 
// Pistas/recibos escondidos no cenário — valores fictícios, editáveis aqui.
const CLUES = [
  { id: 'c1', icon: '🍔', label: 'Delivery de lanche', value: 58, category: 'Lazer' },
  { id: 'c2', icon: '🎮', label: 'Jogo online (impulso)', value: 79, category: 'Compras não planejadas' },
  { id: 'c3', icon: '👟', label: 'Tênis importado', value: 189, category: 'Compras não planejadas' },
  { id: 'c4', icon: '🎵', label: '3 assinaturas de streaming', value: 67, category: 'Gastos recorrentes' },
  { id: 'c5', icon: '🧋', label: 'Bebidas ao longo do mês', value: 42, category: 'Lazer' },
  { id: 'c6', icon: '🚕', label: 'Corridas de app', value: 65, category: 'Necessidades' },
]
 
const CATEGORIES = ['Necessidades', 'Lazer', 'Compras não planejadas', 'Gastos recorrentes']
 
const PATTERN_OPTIONS = [
  { id: 'a', label: 'O dinheiro desapareceu sozinho.', correct: false },
  { id: 'b', label: 'Vários gastos e decisões, somados, tiveram grande impacto no saldo.', correct: true },
  { id: 'c', label: 'Ter dinheiro significa que não é preciso acompanhar gastos.', correct: false },
]
 
const BUDGET_CATEGORIES = [
  { id: 'necessidades', label: 'Necessidades', icon: '🏠' },
  { id: 'objetivos', label: 'Objetivos', icon: '🎯' },
  { id: 'lazer', label: 'Lazer', icon: '🎉' },
  { id: 'reserva', label: 'Dinheiro reservado', icon: '💰' },
]
 
const TOTAL_BUDGET = 500
 
export function Mission10MoneyDetective({ onComplete, onError }) {
  const [phase, setPhase] = useState('intro') // intro | clues | organize | pattern | control | summary
  const [revealed, setRevealed] = useState([])
  const [classified, setClassified] = useState({}) // { clueId: categoryChosen }
  const [wrongAttempt, setWrongAttempt] = useState(null) // id do clue com tentativa errada recente
  const [classifyXP, setClassifyXP] = useState(0)
 
  const [patternSelected, setPatternSelected] = useState(null)
  const [patternAttempts, setPatternAttempts] = useState(0)
  const [patternXP, setPatternXP] = useState(0)
  const [patternDone, setPatternDone] = useState(false)
 
  const [budget, setBudget] = useState({ necessidades: 0, objetivos: 0, lazer: 0, reserva: 0 })
 
  const allRevealed = revealed.length === CLUES.length
  const allClassified = Object.keys(classified).length === CLUES.length
 
  const budgetSpent = Object.values(budget).reduce((sum, v) => sum + v, 0)
  const budgetRemaining = TOTAL_BUDGET - budgetSpent
 
  // ---------- QUEST 1: Encontrar pistas ----------
  const revealClue = (id) => {
    if (revealed.includes(id)) return
    setRevealed((prev) => [...prev, id])
  }
 
  // ---------- QUEST 2: Organizar evidências ----------
  const classify = (clueId, category) => {
    if (classified[clueId]) return
    const clue = CLUES.find((c) => c.id === clueId)
    const isCorrect = clue.category === category
 
    if (isCorrect) {
      setClassified((prev) => ({ ...prev, [clueId]: category }))
      setClassifyXP((prev) => prev + 1)
    } else {
      // Erro simples de classificação: não tira vida, só avisa e libera nova tentativa.
      setWrongAttempt(clueId)
      setTimeout(() => setWrongAttempt(null), 900)
    }
  }
 
  // ---------- QUEST 3: Descobrir o padrão ----------
  const selectPattern = (optionId) => {
    if (patternDone) return
    const option = PATTERN_OPTIONS.find((o) => o.id === optionId)
    setPatternSelected(optionId)
 
    if (option.correct) {
      const gained = patternAttempts === 0 ? 2 : 1
      setPatternXP(gained)
      setPatternDone(true)
    } else {
      const nextAttempts = patternAttempts + 1
      setPatternAttempts(nextAttempts)
      if (nextAttempts >= 2) {
        // Errou o desafio crítico mesmo após a tentativa extra: perde vida.
        if (onError) onError()
      }
      setTimeout(() => setPatternSelected(null), 900)
    }
  }
 
  // ---------- QUEST 4: Assumir o controle ----------
  const adjustBudget = (categoryId, delta) => {
    setBudget((prev) => {
      const next = Math.max(0, prev[categoryId] + delta)
      const others = Object.entries(prev)
        .filter(([k]) => k !== categoryId)
        .reduce((sum, [, v]) => sum + v, 0)
      if (others + next > TOTAL_BUDGET) return prev
      return { ...prev, [categoryId]: next }
    })
  }
 
  const finishControl = () => {
    const controlXP = budgetRemaining >= 0 && budgetSpent > 0 ? 2 : 0
    const totalXP = classifyXP + patternXP + controlXP
    setPhase('summary')
    setTimeout(() => {
      if (onComplete) onComplete({ success: true, xpEarned: totalXP })
    }, 1400)
  }
 
  // ================= RENDER =================
 
  if (phase === 'intro') {
    return (
      <div style={{ color: '#fff', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <div style={{ backgroundColor: '#1e293b', padding: '1rem', borderRadius: '12px', border: '1px solid #334155' }}>
          <p style={{ margin: 0, fontSize: '0.85rem', color: '#cbd5e1' }}>
            <strong>Aprix diz:</strong> "ALERTA! 🚨 Você tinha R$ 500... agora só restam R$ 47. Isso não é mágica — cada saída deixou uma pista. Vamos descobrir para onde foi seu dinheiro? 👀"
          </p>
        </div>
 
        <div style={{ backgroundColor: '#0f172a', border: '1px solid #334155', borderRadius: '12px', padding: '1.2rem', textAlign: 'center' }}>
          <div style={{ display: 'flex', justifyContent: 'space-around', marginBottom: '0.5rem' }}>
            <div>
              <p style={{ margin: 0, fontSize: '0.75rem', color: '#94a3b8' }}>Saldo inicial</p>
              <p style={{ margin: 0, fontSize: '1.4rem', fontWeight: 'bold', color: '#4ade80' }}>R$ 500</p>
            </div>
            <div>
              <p style={{ margin: 0, fontSize: '0.75rem', color: '#94a3b8' }}>Saldo atual</p>
              <p style={{ margin: 0, fontSize: '1.4rem', fontWeight: 'bold', color: '#ef4444' }}>R$ 47</p>
            </div>
          </div>
        </div>
 
        <button
          onClick={() => setPhase('clues')}
          style={{
            width: '100%', padding: '0.85rem', backgroundColor: '#38bdf8', color: '#08152e',
            border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer', fontSize: '0.9rem'
          }}
        >
          🔍 INVESTIGAR O CASO
        </button>
      </div>
    )
  }
 
  if (phase === 'clues') {
    return (
      <div style={{ color: '#fff', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <QuestHeader step={1} label="Encontre as pistas" />
        <p style={{ margin: 0, fontSize: '0.8rem', color: '#94a3b8' }}>
          Encontradas: {revealed.length}/{CLUES.length} pistas
        </p>
 
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
          {CLUES.map((clue) => {
            const isRevealed = revealed.includes(clue.id)
            return (
              <button
                key={clue.id}
                onClick={() => revealClue(clue.id)}
                style={{
                  display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                  minHeight: '90px', padding: '0.8rem', borderRadius: '10px',
                  border: isRevealed ? '1px solid #38bdf8' : '1px solid #334155',
                  backgroundColor: isRevealed ? 'rgba(56,189,248,0.12)' : '#111c33',
                  color: '#fff', cursor: 'pointer', transition: 'all 0.15s ease'
                }}
              >
                {isRevealed ? (
                  <>
                    <span style={{ fontSize: '1.5rem', marginBottom: '4px' }}>{clue.icon}</span>
                    <span style={{ fontSize: '0.72rem', textAlign: 'center', fontWeight: 'bold' }}>{clue.label}</span>
                    <span style={{ fontSize: '0.8rem', color: '#facc15', fontWeight: 'bold', marginTop: '2px' }}>R$ {clue.value}</span>
                  </>
                ) : (
                  <>
                    <span style={{ fontSize: '1.6rem', opacity: 0.4 }}>🃏</span>
                    <span style={{ fontSize: '0.7rem', color: '#64748b' }}>Toque para revelar</span>
                  </>
                )}
              </button>
            )
          })}
        </div>
 
        {allRevealed && (
          <button
            onClick={() => setPhase('organize')}
            style={{
              width: '100%', padding: '0.85rem', backgroundColor: '#38bdf8', color: '#08152e',
              border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer', fontSize: '0.9rem'
            }}
          >
            ORGANIZAR EVIDÊNCIAS →
          </button>
        )}
      </div>
    )
  }
 
  if (phase === 'organize') {
    return (
      <div style={{ color: '#fff', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <QuestHeader step={2} label="Organize as evidências" />
        <p style={{ margin: 0, fontSize: '0.8rem', color: '#94a3b8' }}>Toque no gasto e escolha a categoria certa.</p>
 
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {CLUES.map((clue) => {
            const chosen = classified[clue.id]
            const isWrongNow = wrongAttempt === clue.id
            return (
              <div
                key={clue.id}
                style={{
                  padding: '0.7rem', borderRadius: '10px',
                  border: chosen ? '1px solid #4ade80' : isWrongNow ? '1px solid #ef4444' : '1px solid #334155',
                  backgroundColor: chosen ? 'rgba(74,222,128,0.1)' : isWrongNow ? 'rgba(239,68,68,0.12)' : '#111c33',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                  <span>{clue.icon}</span>
                  <span style={{ fontSize: '0.78rem', fontWeight: 'bold' }}>{clue.label}</span>
                  <span style={{ marginLeft: 'auto', fontSize: '0.78rem', color: '#facc15', fontWeight: 'bold' }}>R$ {clue.value}</span>
                </div>
                {!chosen && (
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                    {CATEGORIES.map((cat) => (
                      <button
                        key={cat}
                        onClick={() => classify(clue.id, cat)}
                        style={{
                          fontSize: '0.68rem', padding: '4px 10px', borderRadius: '999px',
                          border: '1px solid #334155', backgroundColor: '#1e293b', color: '#cbd5e1', cursor: 'pointer'
                        }}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                )}
                {chosen && <span style={{ fontSize: '0.72rem', color: '#4ade80' }}>✓ {chosen}</span>}
              </div>
            )
          })}
        </div>
 
        {allClassified && (
          <button
            onClick={() => setPhase('pattern')}
            style={{
              width: '100%', padding: '0.85rem', backgroundColor: '#38bdf8', color: '#08152e',
              border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer', fontSize: '0.9rem'
            }}
          >
            VER PADRÃO ({classifyXP}/{CLUES.length} corretos) →
          </button>
        )}
      </div>
    )
  }
 
  if (phase === 'pattern') {
    return (
      <div style={{ color: '#fff', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <QuestHeader step={3} label="Descubra o padrão" />
        <p style={{ margin: 0, fontSize: '0.85rem', fontWeight: 'bold' }}>Qual foi a maior descoberta deste caso?</p>
 
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {PATTERN_OPTIONS.map((opt) => {
            const isSelected = patternSelected === opt.id
            const showResult = isSelected && (opt.correct || patternDone === false)
            return (
              <button
                key={opt.id}
                onClick={() => selectPattern(opt.id)}
                disabled={patternDone}
                style={{
                  textAlign: 'left', padding: '0.8rem 1rem', borderRadius: '10px',
                  border: showResult ? (opt.correct ? '2px solid #4ade80' : '2px solid #ef4444') : '1px solid #334155',
                  backgroundColor: showResult ? (opt.correct ? 'rgba(74,222,128,0.15)' : 'rgba(239,68,68,0.15)') : '#111c33',
                  color: '#fff', cursor: patternDone ? 'default' : 'pointer', fontSize: '0.8rem'
                }}
              >
                {opt.label}
              </button>
            )
          })}
        </div>
 
        {patternDone && (
          <>
            <div style={{ backgroundColor: '#1e293b', padding: '0.8rem', borderRadius: '10px', border: '1px solid #334155' }}>
              <p style={{ margin: 0, fontSize: '0.78rem', color: '#cbd5e1' }}>
                💡 Exatamente! Nem sempre existe um único vilão. Às vezes são várias decisões pequenas acontecendo sem acompanhamento.
              </p>
            </div>
            <button
              onClick={() => setPhase('control')}
              style={{
                width: '100%', padding: '0.85rem', backgroundColor: '#38bdf8', color: '#08152e',
                border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer', fontSize: '0.9rem'
              }}
            >
              ASSUMIR O CONTROLE →
            </button>
          </>
        )}
      </div>
    )
  }
 
  if (phase === 'control') {
    return (
      <div style={{ color: '#fff', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <QuestHeader step={4} label="Assuma o controle" />
        <div style={{ backgroundColor: '#1e293b', padding: '0.8rem', borderRadius: '10px', border: '1px solid #334155' }}>
          <p style={{ margin: 0, fontSize: '0.78rem', color: '#cbd5e1' }}>
            Desta vez, decida o destino do seu dinheiro <strong>antes</strong>. Distribua os R$ 500 entre as categorias. 🎯
          </p>
        </div>
 
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
          <span>TOTAL: R$ {TOTAL_BUDGET}</span>
          <span style={{ color: budgetRemaining === 0 ? '#4ade80' : '#facc15' }}>RESTANTE: R$ {budgetRemaining}</span>
        </div>
 
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {BUDGET_CATEGORIES.map((cat) => (
            <div key={cat.id} style={{
              display: 'flex', alignItems: 'center', gap: '8px', padding: '0.6rem 0.8rem',
              borderRadius: '10px', border: '1px solid #334155', backgroundColor: '#111c33'
            }}>
              <span style={{ fontSize: '1.1rem' }}>{cat.icon}</span>
              <span style={{ fontSize: '0.78rem', flex: 1 }}>{cat.label}</span>
              <button onClick={() => adjustBudget(cat.id, -25)} style={budgetBtnStyle}>-</button>
              <span style={{ fontSize: '0.8rem', fontWeight: 'bold', minWidth: '54px', textAlign: 'center' }}>
                R$ {budget[cat.id]}
              </span>
              <button onClick={() => adjustBudget(cat.id, 25)} style={budgetBtnStyle}>+</button>
            </div>
          ))}
        </div>
 
        <button
          onClick={finishControl}
          disabled={budgetSpent === 0 || budgetRemaining < 0}
          style={{
            width: '100%', padding: '0.85rem',
            backgroundColor: budgetSpent === 0 ? '#334155' : '#22c55e',
            color: '#fff', border: 'none', borderRadius: '8px', fontWeight: 'bold',
            cursor: budgetSpent === 0 ? 'not-allowed' : 'pointer', fontSize: '0.9rem'
          }}
        >
          FINALIZAR MISSÃO
        </button>
      </div>
    )
  }
 
  // phase === 'summary'
  const totalXP = classifyXP + patternXP + (budgetRemaining >= 0 && budgetSpent > 0 ? 2 : 0)
  return (
    <div style={{ backgroundColor: '#0f172a', border: '1px solid #334155', borderRadius: '12px', padding: '1.2rem', textAlign: 'center', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <h3 style={{ margin: 0, color: '#4ade80' }}>🏆 Caso Resolvido!</h3>
      <p style={{ margin: 0, fontSize: '0.82rem', color: '#cbd5e1', lineHeight: '1.4' }}>
        "O dinheiro não desapareceu. Cada saída teve uma decisão por trás. Controlar não é deixar de viver — é entender melhor para onde seu dinheiro está indo."
      </p>
      <div>
        <p style={{ margin: '0 0 4px 0', fontSize: '0.75rem', color: '#94a3b8' }}>XP conquistado</p>
        <p style={{ margin: 0, fontSize: '1.8rem', fontWeight: 'bold', color: '#facc15' }}>+{totalXP} XP</p>
      </div>
    </div>
  )
}
 
function QuestHeader({ step, label }) {
  return (
    <div>
      <div style={{ display: 'flex', gap: '6px', marginBottom: '6px' }}>
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            style={{
              flex: 1, height: '6px', borderRadius: '4px',
              backgroundColor: i < step ? '#4ade80' : i === step ? '#facc15' : '#1e293b',
              border: '1px solid #334155'
            }}
          />
        ))}
      </div>
      <p style={{ margin: 0, fontSize: '0.75rem', color: '#94a3b8' }}>Quest {step} de 4 — {label}</p>
    </div>
  )
}
 
const budgetBtnStyle = {
  width: '26px', height: '26px', borderRadius: '6px', border: '1px solid #334155',
  backgroundColor: '#1e293b', color: '#fff', cursor: 'pointer', fontWeight: 'bold', fontSize: '0.85rem'
}
 
export default Mission10MoneyDetective