import React, { useState } from 'react'
 
const ACCENT = '#10b981'
const GOAL = 150
const START_BALANCE = 300
 
const DAYS = [
  {
    day: 'Sexta-feira',
    short: 'Sex',
    icon: '👟',
    situation: 'Uma loja tá com 50% OFF num tênis que você queria. Só hoje!',
    choices: [
      { label: 'Compro agora! Oportunidade única', effect: -159, disciplined: false, note: 'Impacto alto — compra por urgência fabricada.' },
      { label: 'Anoto e espero 48h para decidir', effect: 0, disciplined: true, note: 'Ótimo! A regra das 48h evita arrependimento.' },
    ],
  },
  {
    day: 'Sábado',
    short: 'Sáb',
    icon: '🎉',
    situation: 'Os amigos foram no rolê e te chamaram. Entrada + comer = R$ 85.',
    choices: [
      { label: 'Vou! Não quero ficar de fora', effect: -85, disciplined: false, note: 'Pressão social é real — lembre do seu objetivo.' },
      { label: 'Combino de ir mas gasto só R$ 30', effect: -30, disciplined: true, note: 'Equilíbrio! Você curtiu sem comprometer o plano.' },
    ],
  },
  {
    day: 'Domingo',
    short: 'Dom',
    icon: '🍕',
    situation: 'Você estudou muito essa semana. Merece um delivery de R$ 70.',
    choices: [
      { label: 'Mereço sim! Peço o delivery', effect: -70, disciplined: false, note: 'Recompensa emocional é válida, mas vira hábito se repetir sempre.' },
      { label: 'Faço algo em casa, me custa R$ 20', effect: -20, disciplined: true, note: 'Excelente! Recompensa com consciência.' },
    ],
  },
]
 
export function Mission11ChoiceOfNow({ onComplete }) {
  const [phase, setPhase] = useState('intro') // intro | week | result
  const [dayIndex, setDayIndex] = useState(0)
  const [balance, setBalance] = useState(START_BALANCE)
  const [note, setNote] = useState(null)
  const [disciplinedCount, setDisciplinedCount] = useState(0)
  const [answeredToday, setAnsweredToday] = useState(false)
 
  const currentDay = DAYS[dayIndex]
  const pct = Math.min(100, Math.max(0, (balance / START_BALANCE) * 100))
  const goalPct = (GOAL / START_BALANCE) * 100
  const reachedGoal = balance >= GOAL
 
  const handleChoice = (choice) => {
    if (answeredToday) return
    setBalance((b) => b + choice.effect)
    if (choice.disciplined) setDisciplinedCount((c) => c + 1)
    setNote(choice.note)
    setAnsweredToday(true)
  }
 
  const nextDay = () => {
    setNote(null)
    setAnsweredToday(false)
    if (dayIndex + 1 < DAYS.length) {
      setDayIndex((i) => i + 1)
    } else {
      setPhase('result')
    }
  }
 
  const finish = () => {
    const goalBonus = reachedGoal ? 2 : 0
    const totalXP = disciplinedCount * 2 + goalBonus
    if (onComplete) onComplete({ success: true, xpEarned: totalXP })
  }
 
  // ================= RENDER =================
 
  if (phase === 'intro') {
    return (
      <div style={{ color: '#fff', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <div style={{ backgroundColor: '#1e293b', padding: '1rem', borderRadius: '12px', border: '1px solid #334155' }}>
          <p style={{ margin: 0, fontSize: '0.85rem', color: '#cbd5e1' }}>
            <strong>Aprix diz:</strong> "Uma decisão parece pequena no momento... mas e se ela mudar o final da sua semana? 🌿"
          </p>
        </div>
 
        <div style={{ backgroundColor: '#0f172a', border: '1px solid #334155', borderRadius: '12px', padding: '1.2rem', textAlign: 'center' }}>
          <p style={{ margin: '0 0 4px 0', fontSize: '0.75rem', color: '#94a3b8' }}>Saldo inicial</p>
          <p style={{ margin: 0, fontSize: '1.6rem', fontWeight: 'bold', color: ACCENT }}>R$ {START_BALANCE}</p>
          <p style={{ margin: '10px 0 0 0', fontSize: '0.75rem', color: '#facc15' }}>🎯 Meta: chegue ao fim da semana com pelo menos R$ {GOAL}</p>
        </div>
 
        <button
          onClick={() => setPhase('week')}
          style={{
            width: '100%', padding: '0.85rem', backgroundColor: ACCENT, color: '#08152e',
            border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer', fontSize: '0.9rem'
          }}
        >
          COMEÇAR A SEMANA →
        </button>
      </div>
    )
  }
 
  if (phase === 'week') {
    return (
      <div style={{ color: '#fff', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {/* Linha do tempo da semana */}
        <div style={{ display: 'flex', gap: '6px' }}>
          {DAYS.map((d, i) => (
            <div key={d.short} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
              <div style={{
                width: '30px', height: '30px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '0.9rem', border: `1px solid ${i <= dayIndex ? ACCENT : '#334155'}`,
                backgroundColor: i < dayIndex ? `${ACCENT}33` : i === dayIndex ? ACCENT : '#111c33'
              }}>
                {i < dayIndex ? '✓' : d.icon}
              </div>
              <span style={{ fontSize: '0.6rem', color: '#94a3b8' }}>{d.short}</span>
            </div>
          ))}
        </div>
 
        {/* Barra de saldo */}
        <div style={{ backgroundColor: '#0f172a', border: '1px solid #334155', borderRadius: '12px', padding: '0.9rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', marginBottom: '6px' }}>
            <span style={{ color: '#94a3b8' }}>Saldo atual</span>
            <span style={{ fontWeight: 'bold', color: balance >= GOAL ? '#4ade80' : '#ef4444' }}>R$ {balance}</span>
          </div>
          <div style={{ height: '10px', borderRadius: '999px', backgroundColor: '#1e293b', position: 'relative', overflow: 'hidden' }}>
            <div style={{
              height: '100%', borderRadius: '999px', width: `${pct}%`,
              backgroundColor: balance >= GOAL ? ACCENT : '#ef4444', transition: 'width 0.4s ease'
            }} />
            <div style={{ position: 'absolute', top: 0, left: `${goalPct}%`, width: '2px', height: '100%', backgroundColor: '#facc15' }} />
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.62rem', color: '#64748b', marginTop: '4px' }}>
            <span>R$ 0</span>
            <span style={{ color: '#facc15' }}>🎯 R$ {GOAL}</span>
            <span>R$ {START_BALANCE}</span>
          </div>
        </div>
 
        {/* Card do dia */}
        <div style={{ backgroundColor: '#111c33', border: '1px solid #334155', borderRadius: '12px', padding: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
            <span style={{ fontSize: '1.4rem' }}>{currentDay.icon}</span>
            <div>
              <div style={{ fontWeight: 'bold', fontSize: '0.9rem' }}>{currentDay.day}</div>
              <div style={{ fontSize: '0.7rem', color: '#64748b' }}>Situação do dia</div>
            </div>
          </div>
          <p style={{ margin: 0, fontSize: '0.82rem', color: '#cbd5e1', lineHeight: '1.4' }}>{currentDay.situation}</p>
        </div>
 
        {!answeredToday ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {currentDay.choices.map((choice, i) => (
              <button
                key={i}
                onClick={() => handleChoice(choice)}
                style={{
                  textAlign: 'left', padding: '0.8rem 1rem', borderRadius: '10px',
                  border: '1px solid #334155', backgroundColor: '#1e293b', color: '#fff', cursor: 'pointer'
                }}
              >
                <div style={{ fontSize: '0.82rem', fontWeight: '600' }}>{choice.label}</div>
                <div style={{ fontSize: '0.72rem', color: '#64748b', marginTop: '2px' }}>
                  {choice.effect < 0 ? `− R$ ${Math.abs(choice.effect)}` : 'Sem gasto'}
                </div>
              </button>
            ))}
          </div>
        ) : (
          <>
            <div style={{ backgroundColor: 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.25)', borderRadius: '10px', padding: '0.8rem' }}>
              <p style={{ margin: 0, fontSize: '0.78rem', color: '#cbd5e1', lineHeight: '1.4' }}>{note}</p>
            </div>
            <button
              onClick={nextDay}
              style={{
                width: '100%', padding: '0.85rem', backgroundColor: ACCENT, color: '#08152e',
                border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer', fontSize: '0.9rem'
              }}
            >
              {dayIndex + 1 < DAYS.length ? 'PRÓXIMO DIA →' : 'VER RESULTADO →'}
            </button>
          </>
        )}
      </div>
    )
  }
 
  // phase === 'result'
  return (
    <div style={{
      backgroundColor: '#0f172a', border: '1px solid #334155', borderRadius: '12px', padding: '1.2rem',
      textAlign: 'center', display: 'flex', flexDirection: 'column', gap: '1rem'
    }}>
      <div style={{ fontSize: '2.4rem' }}>{reachedGoal ? '🏆' : '📉'}</div>
      <h3 style={{ margin: 0, color: reachedGoal ? '#4ade80' : '#ef4444' }}>
        {reachedGoal ? 'Meta atingida!' : 'Meta não atingida'}
      </h3>
      <p style={{ margin: 0, fontSize: '1.4rem', fontWeight: 'bold', color: reachedGoal ? ACCENT : '#ef4444' }}>
        Saldo final: R$ {balance}
      </p>
      <p style={{ margin: 0, fontSize: '0.8rem', color: '#94a3b8', lineHeight: '1.4' }}>
        {reachedGoal
          ? 'Suas escolhas criaram um resultado positivo. Consciência financeira em ação!'
          : 'O saldo ficou abaixo da meta — cada escolha tem um impacto acumulado. Da próxima vez, repare nos sinais.'}
      </p>
      <button
        onClick={finish}
        style={{
          width: '100%', padding: '0.85rem', backgroundColor: '#22c55e', color: '#fff',
          border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer', fontSize: '0.9rem'
        }}
      >
        CONCLUIR MISSÃO
      </button>
    </div>
  )
}
 
export default Mission11ChoiceOfNow