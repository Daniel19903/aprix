import React, { useState } from 'react'
 
const COLORS = {
  bg: '#0f172a',
  card: '#111c33',
  cardAlt: '#1e293b',
  border: '#334155',
  accent: '#38bdf8',
  success: '#4ade80',
  successBg: 'rgba(74,222,128,0.12)',
  error: '#ef4444',
  errorBg: 'rgba(239,68,68,0.12)',
  warning: '#facc15',
  warningBg: 'rgba(250,204,21,0.1)',
  textMuted: '#94a3b8',
  textFaint: '#64748b',
}
 
// ---------- QUEST 1: Radar Mental ----------
const Q1_ITEMS = [
  { id: 1, text: '"Eu nunca consigo guardar dinheiro."', category: 'automático', hint: 'Uma reação automática de resignação.' },
  { id: 2, text: '"Antes de decidir, posso olhar como isso afeta meu objetivo."', category: 'útil', hint: 'Demonstra pausa e reflexão prévia.' },
  { id: 3, text: '"É só uma compra pequena, não faz diferença."', category: 'questionar', hint: 'Várias pequenas compras somadas causam impacto.' },
  { id: 4, text: '"Tenho que comprar AGORA ou a oferta some."', category: 'automático', hint: 'Gatilho de urgência artificial.' },
  { id: 5, text: '"Todo mundo está comprando, então eu também preciso."', category: 'questionar', hint: 'Pressão social — vale questionar a real necessidade.' },
]
 
// ---------- QUEST 2: E o que acontece depois? ----------
const Q2_SCENARIOS = [
  {
    thought: '"É só uma compra pequena. Não vai fazer diferença."',
    options: [
      { label: 'A) Parar e verificar quanto dinheiro possui.', correct: false },
      { label: 'B) Comprar imediatamente sem verificar o impacto.', correct: true },
      { label: 'C) Reorganizar o objetivo antes de decidir.', correct: false },
    ],
    consequence: 'O dinheiro disponível diminuiu e o objetivo acumulado ficou mais distante.',
  },
  {
    thought: '"Se eu esperar 2 dias, a promoção pode acabar."',
    options: [
      { label: 'A) Agir por impulso para não sentir que perdeu algo.', correct: true },
      { label: 'B) Refletir se o item realmente era necessário ontem.', correct: false },
      { label: 'C) Apagar o aplicativo de compras imediatamente.', correct: false },
    ],
    consequence: 'Decisão acelerada por medo de perda, gerando gasto não orçado.',
  },
]
 
// ---------- QUEST 3: Quebre o código ----------
const TARGET_SEQUENCE = ['PARAR', 'QUESTIONAR', 'ANALISAR', 'ESCOLHER']
const AVAILABLE_ACTIONS = ['ESCOLHER', 'ANALISAR', 'PARAR', 'QUESTIONAR']
 
// ---------- Desafio da Estrela ----------
const STAR_BLOCKS = [
  { id: 'p1', text: '💭 1. Pensamento: "Preciso disso agora"' },
  { id: 'p2', text: '⚡ 2. Emoção: Impaciência' },
  { id: 'stop', text: '🛑 3. INTERRUPÇÃO: Parar e Respirar' },
  { id: 'dec', text: '🛒 4. Decisão Consciente: Esperar 24h' },
]
const STAR_TARGET = ['p1', 'p2', 'stop', 'dec']
 
export function Mission12ThoughtDecoder({ onComplete, onError }) {
  const [phase, setPhase] = useState('intro')
  const [feedback, setFeedback] = useState(null) // { text, type: 'success'|'error' }
 
  // XP acumulado por quest, somado só no final
  const [q1XP, setQ1XP] = useState(0)
  const [q2XP, setQ2XP] = useState(0)
  const [q3XP, setQ3XP] = useState(0)
  const [q4XP, setQ4XP] = useState(0)
  const [starXP, setStarXP] = useState(0)
 
  // Quest 1
  const [q1Index, setQ1Index] = useState(0)
 
  // Quest 2
  const [q2Index, setQ2Index] = useState(0)
  const [q2Selected, setQ2Selected] = useState(null)
 
  // Quest 3
  const [userSequence, setUserSequence] = useState([])
  const [q3Attempts, setQ3Attempts] = useState(0)
 
  // Quest 4
  const [q4Step, setQ4Step] = useState(1)
  const [q4Thought, setQ4Thought] = useState('')
  const [q4Question, setQ4Question] = useState('')
  const [q4Decision, setQ4Decision] = useState('')
 
  // Estrela
  const [starSequence, setStarSequence] = useState([])
  const [hasStar, setHasStar] = useState(false)
 
  const totalXP = q1XP + q2XP + q3XP + q4XP + starXP
 
  // ---------- Handlers Quest 1 ----------
  const handleQ1Answer = (selectedCategory) => {
    const current = Q1_ITEMS[q1Index]
    if (selectedCategory === current.category) {
      setFeedback({ text: 'Boa! Você percebeu o sinal antes de agir. 📡', type: 'success' })
      setQ1XP((prev) => prev + 1)
      setTimeout(() => {
        setFeedback(null)
        if (q1Index + 1 < Q1_ITEMS.length) {
          setQ1Index(q1Index + 1)
        } else {
          setPhase('quest2')
        }
      }, 1000)
    } else {
      // Erro simples: não tira vida, só orienta e libera nova tentativa.
      setFeedback({ text: `Quase. ${current.hint}`, type: 'error' })
      setTimeout(() => setFeedback(null), 1200)
    }
  }
 
  // ---------- Handlers Quest 2 ----------
  const handleQ2Select = (idx) => {
    setQ2Selected(idx)
    const scenario = Q2_SCENARIOS[q2Index]
    if (scenario.options[idx].correct) {
      setQ2XP((prev) => prev + 1)
      setFeedback({ text: 'Percebeu a conexão! Veja o impacto:', type: 'success' })
    } else {
      setFeedback({ text: 'Analise qual decisão nasce diretamente desse pensamento específico.', type: 'error' })
    }
  }
 
  const handleQ2Next = () => {
    setQ2Selected(null)
    setFeedback(null)
    if (q2Index + 1 < Q2_SCENARIOS.length) {
      setQ2Index(q2Index + 1)
    } else {
      setPhase('quest3')
    }
  }
 
  // ---------- Handlers Quest 3 ----------
  const addAction = (action) => {
    if (userSequence.length < 4 && !userSequence.includes(action)) {
      setUserSequence((prev) => [...prev, action])
    }
  }
  const removeAction = (index) => {
    setUserSequence((prev) => prev.filter((_, i) => i !== index))
  }
  const validateQ3 = () => {
    const isCorrect = JSON.stringify(userSequence) === JSON.stringify(TARGET_SEQUENCE)
    if (isCorrect) {
      const gained = q3Attempts === 0 ? 2 : 1
      setQ3XP(gained)
      setFeedback({ text: 'Esse é o segredo! 🔓 Você criou um filtro consciente.', type: 'success' })
      setTimeout(() => {
        setFeedback(null)
        setPhase('quest4')
      }, 1300)
    } else {
      const nextAttempts = q3Attempts + 1
      setQ3Attempts(nextAttempts)
      // Desafio crítico: só perde vida se errar de novo após a primeira tentativa.
      if (nextAttempts >= 2 && onError) onError()
      setFeedback({ text: 'A ordem da pausa consciente importa. Primeiro pare, depois questione...', type: 'error' })
      setUserSequence([])
      setTimeout(() => setFeedback(null), 1400)
    }
  }
 
  // ---------- Handlers Quest 4 (guiado, sempre conclui) ----------
  const finishQ4 = () => {
    setQ4XP(2)
    setPhase('star_challenge')
  }
 
  // ---------- Handlers Estrela ----------
  const toggleStar = (id) => {
    setStarSequence((prev) => (prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]))
  }
  const validateStar = () => {
    if (JSON.stringify(starSequence) === JSON.stringify(STAR_TARGET)) {
      setHasStar(true)
      setStarXP(2)
      setFeedback({ text: '⭐ ESTRELA CONQUISTADA! Código Oculto Decifrado!', type: 'success' })
      setTimeout(() => setPhase('completion'), 1300)
    } else {
      setFeedback({ text: 'Sequência incorreta. Coloque a interrupção após o gatilho emocional.', type: 'error' })
    }
  }
  const skipStar = () => setPhase('completion')
 
  const finish = () => {
    if (onComplete) onComplete({ success: true, xpEarned: totalXP })
  }
 
  // ================= UI helpers =================
  const Feedback = () =>
    feedback ? (
      <div style={{
        padding: '0.7rem', borderRadius: '10px', textAlign: 'center', fontSize: '0.75rem',
        border: `1px solid ${feedback.type === 'success' ? COLORS.success : COLORS.error}`,
        backgroundColor: feedback.type === 'success' ? COLORS.successBg : COLORS.errorBg,
        color: feedback.type === 'success' ? COLORS.success : '#fca5a5',
      }}>
        {feedback.text}
      </div>
    ) : null
 
  const QuestProgress = ({ step }) => (
    <div style={{ display: 'flex', gap: '6px', margin: '0.5rem 0 1rem' }}>
      {[1, 2, 3, 4].map((i) => (
        <div key={i} style={{
          flex: 1, height: '6px', borderRadius: '4px',
          backgroundColor: i < step ? COLORS.success : i === step ? COLORS.accent : COLORS.cardAlt,
          border: `1px solid ${COLORS.border}`,
        }} />
      ))}
    </div>
  )
 
  const primaryBtn = {
    width: '100%', padding: '0.85rem', backgroundColor: COLORS.accent, color: '#08152e',
    border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer', fontSize: '0.9rem',
  }
 
  // ================= RENDER =================
 
  if (phase === 'intro') {
    return (
      <div style={{ color: '#fff', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <div style={{ backgroundColor: COLORS.cardAlt, padding: '1rem', borderRadius: '12px', border: `1px solid ${COLORS.border}`, textAlign: 'center' }}>
          <div style={{ fontSize: '2.2rem', marginBottom: '6px' }}>🧠🔐</div>
          <p style={{ margin: 0, fontSize: '0.72rem', color: COLORS.accent, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Decifrador de Pensamentos</p>
        </div>
 
        <div style={{ backgroundColor: COLORS.card, border: `1px solid ${COLORS.border}`, borderRadius: '12px', padding: '1rem' }}>
          <p style={{ margin: '0 0 6px 0', fontSize: '0.78rem', color: COLORS.accent, fontWeight: 'bold' }}>Aprix diz:</p>
          <p style={{ margin: '0 0 6px 0', fontSize: '0.8rem', color: '#cbd5e1' }}>"Seu dinheiro não toma decisões sozinho. 👀"</p>
          <p style={{ margin: '0 0 6px 0', fontSize: '0.8rem', color: '#cbd5e1' }}>"Antes de agir, um pensamento aparece — e às vezes passa tão rápido que você nem percebe."</p>
          <p style={{ margin: 0, fontSize: '0.8rem', color: COLORS.textMuted }}>"Vamos decifrar esse código? 🧠🔍"</p>
        </div>
 
        <button onClick={() => setPhase('quest1')} style={primaryBtn}>[ DECIFRAR O CÓDIGO ]</button>
      </div>
    )
  }
 
  if (phase === 'quest1') {
    const current = Q1_ITEMS[q1Index]
    const options = [
      { key: 'automático', label: 'Automático', desc: 'Reação imediata sem reflexão', color: COLORS.error, icon: '⚡' },
      { key: 'questionar', label: 'Vale Questionar', desc: 'Ideia que precisa de análise prévia', color: COLORS.warning, icon: '❓' },
      { key: 'útil', label: 'Útil / Consciente', desc: 'Reflexão alinhada aos seus objetivos', color: COLORS.success, icon: '✅' },
    ]
    return (
      <div style={{ color: '#fff', display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
        <p style={{ margin: 0, fontSize: '0.75rem', color: COLORS.textMuted }}>Quest 1 de 4 — Radar Mental</p>
        <QuestProgress step={1} />
 
        <div style={{ backgroundColor: COLORS.card, border: `1px solid ${COLORS.border}`, borderRadius: '12px', padding: '1.2rem', textAlign: 'center' }}>
          <span style={{ fontSize: '0.65rem', color: COLORS.accent, textTransform: 'uppercase' }}>Pensamento #{q1Index + 1}</span>
          <p style={{ margin: '8px 0 0 0', fontSize: '0.9rem', fontStyle: 'italic' }}>{current.text}</p>
        </div>
 
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {options.map((opt) => (
            <button
              key={opt.key}
              onClick={() => handleQ1Answer(opt.key)}
              style={{
                display: 'flex', alignItems: 'center', gap: '10px', padding: '0.8rem',
                backgroundColor: COLORS.card, border: `1px solid ${COLORS.border}`, borderRadius: '10px',
                color: '#fff', cursor: 'pointer', textAlign: 'left',
              }}
            >
              <span style={{ fontSize: '1.1rem' }}>{opt.icon}</span>
              <div>
                <div style={{ fontWeight: 'bold', fontSize: '0.82rem', color: opt.color }}>{opt.label}</div>
                <div style={{ fontSize: '0.68rem', color: COLORS.textFaint }}>{opt.desc}</div>
              </div>
            </button>
          ))}
        </div>
 
        <Feedback />
      </div>
    )
  }
 
  if (phase === 'quest2') {
    const scenario = Q2_SCENARIOS[q2Index]
    const showConsequence = q2Selected !== null && scenario.options[q2Selected].correct
    return (
      <div style={{ color: '#fff', display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
        <p style={{ margin: 0, fontSize: '0.75rem', color: COLORS.textMuted }}>Quest 2 de 4 — Pensamento → Decisão</p>
        <QuestProgress step={2} />
 
        <div style={{ backgroundColor: COLORS.card, border: `1px solid ${COLORS.accent}55`, borderRadius: '12px', padding: '1rem' }}>
          <span style={{ fontSize: '0.65rem', color: COLORS.accent, display: 'block', marginBottom: '4px' }}>GATILHO MENTAL:</span>
          <p style={{ margin: 0, fontSize: '0.85rem', fontStyle: 'italic' }}>{scenario.thought}</p>
        </div>
 
        <p style={{ margin: 0, fontSize: '0.78rem', color: '#cbd5e1' }}>Qual decisão tem maior relação direta com esse pensamento?</p>
 
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {scenario.options.map((opt, idx) => {
            const isSelected = q2Selected === idx
            return (
              <button
                key={idx}
                onClick={() => handleQ2Select(idx)}
                style={{
                  padding: '0.75rem', borderRadius: '10px', textAlign: 'left', fontSize: '0.78rem', color: '#fff', cursor: 'pointer',
                  border: isSelected ? `1px solid ${opt.correct ? COLORS.success : COLORS.error}` : `1px solid ${COLORS.border}`,
                  backgroundColor: isSelected ? (opt.correct ? COLORS.successBg : COLORS.errorBg) : COLORS.card,
                }}
              >
                {opt.label}
              </button>
            )
          })}
        </div>
 
        {showConsequence && (
          <div style={{ backgroundColor: COLORS.card, border: `1px solid ${COLORS.warning}55`, borderRadius: '10px', padding: '0.8rem' }}>
            <span style={{ fontSize: '0.68rem', color: COLORS.warning, fontWeight: 'bold', display: 'block' }}>📉 CONSEQUÊNCIA:</span>
            <p style={{ margin: '4px 0 0 0', fontSize: '0.76rem', color: '#cbd5e1' }}>{scenario.consequence}</p>
          </div>
        )}
 
        <Feedback />
 
        {showConsequence && (
          <button onClick={handleQ2Next} style={primaryBtn}>
            {q2Index + 1 < Q2_SCENARIOS.length ? 'PRÓXIMO CENÁRIO →' : 'AVANÇAR PARA QUEST 3 →'}
          </button>
        )}
      </div>
    )
  }
 
  if (phase === 'quest3') {
    return (
      <div style={{ color: '#fff', display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
        <p style={{ margin: 0, fontSize: '0.75rem', color: COLORS.textMuted }}>Quest 3 de 4 — Quebre o Código</p>
        <QuestProgress step={3} />
 
        <p style={{ margin: 0, fontSize: '0.76rem', color: '#cbd5e1' }}>Ordene as ações para interromper uma reação automática impulsiva.</p>
 
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '6px' }}>
          {Array.from({ length: 4 }).map((_, idx) => {
            const action = userSequence[idx]
            return (
              <div
                key={idx}
                onClick={() => action && removeAction(idx)}
                style={{
                  height: '60px', borderRadius: '10px', display: 'flex', flexDirection: 'column',
                  alignItems: 'center', justifyContent: 'center', cursor: action ? 'pointer' : 'default',
                  border: action ? `1px solid ${COLORS.accent}` : `1px dashed ${COLORS.border}`,
                  backgroundColor: action ? `${COLORS.accent}22` : 'transparent',
                }}
              >
                <span style={{ fontSize: '0.6rem', color: COLORS.textFaint }}>#{idx + 1}</span>
                <span style={{ fontSize: '0.65rem', fontWeight: 'bold', textAlign: 'center' }}>{action || '---'}</span>
              </div>
            )
          })}
        </div>
 
        <p style={{ margin: 0, fontSize: '0.72rem', color: COLORS.textFaint }}>Ações disponíveis:</p>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px' }}>
          {AVAILABLE_ACTIONS.map((act) => {
            const used = userSequence.includes(act)
            return (
              <button
                key={act}
                disabled={used}
                onClick={() => addAction(act)}
                style={{
                  padding: '0.65rem', borderRadius: '10px', fontSize: '0.72rem', fontWeight: 'bold', textAlign: 'center',
                  border: `1px solid ${used ? '#1e293b' : COLORS.border}`,
                  backgroundColor: used ? 'transparent' : COLORS.card,
                  color: used ? COLORS.textFaint : '#fff', cursor: used ? 'not-allowed' : 'pointer',
                }}
              >
                + {act}
              </button>
            )
          })}
        </div>
 
        <Feedback />
 
        <button
          disabled={userSequence.length < 4}
          onClick={validateQ3}
          style={{
            ...primaryBtn,
            backgroundColor: userSequence.length === 4 ? COLORS.accent : COLORS.cardAlt,
            color: userSequence.length === 4 ? '#08152e' : COLORS.textFaint,
            cursor: userSequence.length === 4 ? 'pointer' : 'not-allowed',
          }}
        >
          VALIDAR SEQUÊNCIA 🔓
        </button>
      </div>
    )
  }
 
  if (phase === 'quest4') {
    const steps = {
      1: {
        label: 'ETAPA 1: Qual pensamento surgiu primeiro?',
        options: ['💭 "É uma oportunidade única!"', '💭 "Todo mundo está comprando."', '💭 "Como isso afeta meu objetivo de guardar R$ 100?"'],
        onPick: (t) => { setQ4Thought(t); setQ4Step(2) },
      },
      2: {
        label: 'ETAPA 2: Escolha uma pergunta reflexiva:',
        options: ['❓ "Eu preciso disso hoje ou só estou reagindo ao desconto?"', '❓ "Se eu gastar R$ 80, ainda atingo minha meta?"', '❓ "Existe alguma opção usada ou alternativa mais barata?"'],
        onPick: (q) => { setQ4Question(q); setQ4Step(3) },
      },
      3: {
        label: 'ETAPA 3: Tome sua decisão final consciente:',
        options: ['🛒 Comprar agora (R$ 80) e ajustar a meta para depois.', '⏳ Esperar 48 horas para ver se o desejo continua.', '🎯 Manter o foco total e guardar os R$ 100 previstos.'],
        onPick: (d) => { setQ4Decision(d); setQ4Step(4) },
      },
    }
 
    return (
      <div style={{ color: '#fff', display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
        <p style={{ margin: 0, fontSize: '0.75rem', color: COLORS.textMuted }}>Quest 4 de 4 — Escolha Sua Rota</p>
        <QuestProgress step={4} />
 
        <div style={{ display: 'flex', justifyContent: 'space-between', backgroundColor: COLORS.card, border: `1px solid ${COLORS.border}`, borderRadius: '10px', padding: '0.7rem', fontSize: '0.72rem' }}>
          <div><span style={{ color: COLORS.textFaint, display: 'block' }}>DISPONÍVEL</span><span style={{ color: COLORS.success, fontWeight: 'bold' }}>R$ 150</span></div>
          <div style={{ textAlign: 'right' }}><span style={{ color: COLORS.textFaint, display: 'block' }}>OBJETIVO</span><span style={{ color: COLORS.accent, fontWeight: 'bold' }}>Guardar R$ 100</span></div>
        </div>
 
        <div style={{ backgroundColor: COLORS.warningBg, border: `1px solid ${COLORS.warning}55`, borderRadius: '10px', padding: '0.7rem', fontSize: '0.75rem', color: '#fde68a' }}>
          ⚠️ <strong>SITUAÇÃO:</strong> Um produto desejado entrou em promoção por <strong>R$ 80</strong>.
        </div>
 
        {q4Step < 4 ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <span style={{ fontSize: '0.72rem', color: COLORS.accent }}>{steps[q4Step].label}</span>
            {steps[q4Step].options.map((opt, idx) => (
              <button
                key={idx}
                onClick={() => steps[q4Step].onPick(opt)}
                style={{ padding: '0.7rem', borderRadius: '10px', textAlign: 'left', fontSize: '0.75rem', backgroundColor: COLORS.card, border: `1px solid ${COLORS.border}`, color: '#fff', cursor: 'pointer' }}
              >
                {opt}
              </button>
            ))}
          </div>
        ) : (
          <div style={{ backgroundColor: COLORS.card, border: `1px solid ${COLORS.accent}55`, borderRadius: '10px', padding: '0.9rem', display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '0.75rem' }}>
            <span style={{ color: COLORS.accent, fontWeight: 'bold' }}>RESUMO DA SUA ROTA:</span>
            <div><span style={{ color: COLORS.textFaint }}>Pensamento:</span> <p style={{ margin: '2px 0' }}>{q4Thought}</p></div>
            <div><span style={{ color: COLORS.textFaint }}>Análise:</span> <p style={{ margin: '2px 0' }}>{q4Question}</p></div>
            <div><span style={{ color: COLORS.textFaint }}>Decisão:</span> <p style={{ margin: '2px 0', color: COLORS.success, fontWeight: '600' }}>{q4Decision}</p></div>
            <p style={{ margin: '6px 0 0 0', paddingTop: '6px', borderTop: `1px solid ${COLORS.border}`, fontStyle: 'italic', color: COLORS.textFaint }}>
              "O objetivo do APRIX não é proibir compras, mas garantir que você saiba por que está decidindo."
            </p>
          </div>
        )}
 
        {q4Step === 4 && <button onClick={finishQ4} style={primaryBtn}>FINALIZAR PROCESSAMENTO →</button>}
      </div>
    )
  }
 
  if (phase === 'star_challenge') {
    return (
      <div style={{ color: '#fff', display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
        <div style={{ textAlign: 'center' }}>
          <span style={{ fontSize: '0.7rem', color: COLORS.warning, fontWeight: 'bold' }}>⭐ DESAFIO ESPECIAL DESBLOQUEADO</span>
          <h3 style={{ margin: '4px 0 0 0', fontSize: '1rem' }}>O CÓDIGO OCULTO</h3>
        </div>
 
        <p style={{ margin: 0, fontSize: '0.75rem', color: '#cbd5e1', textAlign: 'center' }}>
          Ordene os blocos (Gatilho → Emoção → Interrupção → Ação):
        </p>
 
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          {STAR_BLOCKS.map((block) => {
            const selected = starSequence.includes(block.id)
            return (
              <button
                key={block.id}
                onClick={() => toggleStar(block.id)}
                style={{
                  padding: '0.7rem', borderRadius: '10px', textAlign: 'left', fontSize: '0.76rem', cursor: 'pointer',
                  border: selected ? `1px solid ${COLORS.warning}` : `1px solid ${COLORS.border}`,
                  backgroundColor: selected ? COLORS.warningBg : COLORS.card,
                  color: selected ? '#fde68a' : '#fff',
                }}
              >
                {block.text} {selected && '✓'}
              </button>
            )
          })}
        </div>
 
        <Feedback />
 
        <div style={{ display: 'flex', gap: '8px' }}>
          <button onClick={skipStar} style={{ ...primaryBtn, flex: 1, backgroundColor: COLORS.cardAlt, color: '#cbd5e1' }}>PULAR ESTRELA</button>
          <button onClick={validateStar} style={{ ...primaryBtn, flex: 1, backgroundColor: COLORS.warning, color: '#08152e' }}>RESGATAR ⭐</button>
        </div>
      </div>
    )
  }
 
  // phase === 'completion'
  return (
    <div style={{ backgroundColor: COLORS.bg, border: `1px solid ${COLORS.border}`, borderRadius: '12px', padding: '1.2rem', textAlign: 'center', display: 'flex', flexDirection: 'column', gap: '1rem', color: '#fff' }}>
      <div style={{ fontSize: '2.2rem' }}>🔓</div>
      <div>
        <span style={{ fontSize: '0.68rem', color: COLORS.accent }}>MISSÃO 12 CONCLUÍDA</span>
        <h3 style={{ margin: '4px 0 0 0' }}>CÓDIGO DECIFRADO!</h3>
        {hasStar && (
          <span style={{ display: 'inline-block', marginTop: '6px', padding: '4px 10px', borderRadius: '999px', fontSize: '0.62rem', fontWeight: 'bold', backgroundColor: COLORS.warningBg, border: `1px solid ${COLORS.warning}55`, color: '#fde68a' }}>
            🧠 DECIFRADOR DE PADRÕES
          </span>
        )}
      </div>
      <p style={{ margin: 0, fontSize: '0.78rem', color: COLORS.textMuted, fontStyle: 'italic' }}>
        "Antes de uma decisão, existe um pensamento. Ao percebê-lo, você ganha o poder de escolha: Parar. Pensar. Decidir."
      </p>
      <div>
        <p style={{ margin: '0 0 4px 0', fontSize: '0.75rem', color: COLORS.textMuted }}>XP conquistado</p>
        <p style={{ margin: 0, fontSize: '1.8rem', fontWeight: 'bold', color: COLORS.warning }}>+{totalXP} XP</p>
      </div>
      <button onClick={finish} style={primaryBtn}>CONTINUAR A JORNADA →</button>
    </div>
  )
}
 
export default Mission12ThoughtDecoder