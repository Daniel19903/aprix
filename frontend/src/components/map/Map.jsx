import React from 'react'
 
export function Map({ missions = [], onSelectMission }) {
  // Ordena por ID numérico para garantir a sequência correta
  const sortedMissions = [...missions].sort((a, b) => Number(a.id) - Number(b.id))
 
  // Identifica o ID da missão atual (onde o jogador está)
  const currentMission = sortedMissions.find((m) => m.isCurrent) || 
                         sortedMissions.find((m) => !m.isCompleted) || 
                         sortedMissions[0]
 
  const currentId = currentMission ? Number(currentMission.id) : 1
 
  return (
    <div style={{ padding: '2rem 1rem', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2rem' }}>
      <h2 style={{ color: '#fff', fontSize: '1.2rem', marginBottom: '1rem' }}>Árvore do Conhecimento</h2>
 
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2.5rem', position: 'relative' }}>
        {sortedMissions.map((mission, index) => {
          const mId = Number(mission.id)
          const isCompleted = Boolean(mission.isCompleted)
          const isCurrentNode = mId === currentId
          // Uma missão está liberada se já foi feita ou se é a missão atual
          const isUnlocked = isCompleted || isCurrentNode
 
          return (
            <div key={mission.id || index} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', position: 'relative' }}>
              
              {/* Tag "VOCÊ ESTÁ AQUI" - Aparece SOMENTE no nó atual */}
              {isCurrentNode && (
                <div
                  style={{
                    position: 'absolute',
                    top: '-35px',
                    backgroundColor: '#eab308',
                    color: '#000',
                    padding: '4px 12px',
                    borderRadius: '20px',
                    fontWeight: '900',
                    fontSize: '0.75rem',
                    boxShadow: '0 0 12px rgba(234, 179, 8, 0.8)',
                    whiteSpace: 'nowrap',
                    zIndex: 10,
                    animation: 'bounce 1.5s infinite'
                  }}
                >
                  🦩 VOCÊ ESTÁ AQUI
                </div>
              )}
 
              {/* Botão do Nó da Missão */}
              <button
                onClick={() => onSelectMission({ ...mission, isLocked: !isUnlocked })}
                style={{
                  width: '70px',
                  height: '70px',
                  borderRadius: '50%',
                  backgroundColor: isCompleted ? '#1e293b' : isCurrentNode ? '#0f172a' : '#090d16',
                  border: isCurrentNode ? '4px solid #eab308' : isCompleted ? '3px solid #22c55e' : '2px solid #1e293b',
                  boxShadow: isCurrentNode ? '0 0 20px rgba(234, 179, 8, 0.6)' : 'none',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: isUnlocked ? 'pointer' : 'not-allowed',
                  position: 'relative',
                  transition: 'all 0.3s ease'
                }}
              >
                {isCompleted && (
                  <span style={{ color: '#22c55e', fontSize: '1.2rem', fontWeight: 'bold' }}>✓</span>
                )}
 
                {!isCompleted && !isUnlocked && (
                  <span style={{ fontSize: '1.2rem' }}>🔒</span>
                )}
 
                {isCurrentNode && !isCompleted && (
                  <span style={{ fontSize: '1.2rem' }}>🎯</span>
                )}
              </button>
 
              {/* Rótulo do Nome da Missão */}
              <span
                style={{
                  marginTop: '8px',
                  color: isCurrentNode ? '#eab308' : isUnlocked ? '#fff' : '#475569',
                  fontWeight: 'bold',
                  fontSize: '0.9rem'
                }}
              >
                Missão {mission.id}
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}
 