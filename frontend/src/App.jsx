import { useEffect, useState } from 'react'
import { Lives } from './components/player/Lives'
import { XPBar } from './components/player/XPBar'
import { GameOver } from './components/player/GameOver'
import { Map } from './components/map/Map'
import { MissionRunner } from './components/mission/MissionRunner'
import { BottomNav } from './components/nav/BottomNav'
import { ProfileSetup } from './components/profile/ProfileSetup'
import { HomeView } from './components/home/HomeView'
import { DailyQuizCard } from './components/DailyQuizCard'
import { fetchPlayerData, fetchMissions, submitAnswer } from './services/api'

// --- COMPONENTE INTERNO: RANKING ---
function RankingTab({ player, userProfile }) {
  const leaderboard = [
    { name: 'Ana Clara', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?top=longHair&eyes=happy&skinColor=f8d5c4', xp: 120 },
    { name: 'Lucas Silva', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?top=shortHair&eyes=squint&skinColor=edb98a', xp: 95 },
    { 
      name: userProfile?.name || 'Você', 
      avatar: userProfile?.avatarUrl || 'https://api.dicebear.com/7.x/avataaars/svg?top=shortHair&eyes=default', 
      xp: player?.xp || 0, 
      isCurrent: true 
    },
    { name: 'Gabriel Souza', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?top=curly&eyes=wink&skinColor=d08b5b', xp: 40 },
    { name: 'Beatriz Lima', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?top=hat&eyes=surprised&skinColor=ae5d29', xp: 20 },
  ].sort((a, b) => b.xp - a.xp)

  return (
    <div style={{ padding: '1rem', color: '#fff', maxWidth: '480px', margin: '0 auto' }}>
      <h3 style={{ textAlign: 'center', marginBottom: '1rem', color: '#38bdf8' }}>🏆 Ranking Geral (Beta)</h3>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {leaderboard.map((user, idx) => (
          <div
            key={idx}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '0.75rem 1rem',
              borderRadius: '12px',
              backgroundColor: user.isCurrent ? 'rgba(56, 189, 248, 0.15)' : '#0f172a',
              border: user.isCurrent ? '2px solid #38bdf8' : '1px solid #334155'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <span style={{ fontWeight: 'bold', width: '24px', color: idx === 0 ? '#facc15' : idx === 1 ? '#cbd5e1' : idx === 2 ? '#b45309' : '#94a3b8' }}>
                #{idx + 1}
              </span>
              <div style={{ width: '32px', height: '32px', borderRadius: '50%', overflow: 'hidden', backgroundColor: '#1e293b', border: '1px solid #334155' }}>
                <img src={user.avatar} alt={user.name} style={{ width: '100%', height: '100%' }} />
              </div>
              <span style={{ fontSize: '0.85rem', fontWeight: user.isCurrent ? 'bold' : 'normal' }}>
                {user.name} {user.isCurrent && '(Você)'}
              </span>
            </div>
            <span style={{ fontSize: '0.85rem', color: '#38bdf8', fontWeight: 'bold' }}>
              {user.xp} XP
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}

// --- COMPONENTE INTERNO: PRÊMIOS & COMPARTILHAMENTO ---
function RewardsTab({ onAddXP }) {
  const [sharesCount, setSharesCount] = useState(() => Number(localStorage.getItem('aprix_shares') || 0))
  const [rewardClaimed, setRewardClaimed] = useState(() => localStorage.getItem('aprix_share_reward') === 'true')

  const handleShare = async () => {
    const shareData = {
      title: 'APRIX - Jogo de Educação Financeira',
      text: 'Vem jogar o APRIX e aprender finanças de forma simples e divertida!',
      url: window.location.href
    }

    try {
      if (navigator.share) {
        await navigator.share(shareData)
      } else {
        await navigator.clipboard.writeText(shareData.url)
        alert('Link do jogo copiado para a área de transferência!')
      }

      const newCount = sharesCount + 1
      setSharesCount(newCount)
      localStorage.setItem('aprix_shares', newCount)

      if (newCount >= 10 && !rewardClaimed) {
        localStorage.setItem('aprix_share_reward', 'true')
        setRewardClaimed(true)
        if (onAddXP) onAddXP(50)
        alert('🎉 Incrível! Você compartilhou com 10 amigos e conquistou +50 XP bônus!')
      }
    } catch (err) {
      console.warn('Compartilhamento cancelado pelo usuário.')
    }
  }

  return (
    <div style={{ padding: '1rem', color: '#fff', maxWidth: '480px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
      <h3 style={{ textAlign: 'center', margin: 0, color: '#facc15' }}>🎁 Prêmios e Bônus Extra</h3>

      {/* CARD VIRALIZAR */}
      <div style={{ backgroundColor: '#0f172a', border: '1px solid #334155', borderRadius: '16px', padding: '1.2rem' }}>
        <h4 style={{ margin: '0 0 6px 0', color: '#38bdf8', fontSize: '0.95rem' }}>🚀 Viralize o APRIX Beta</h4>
        <p style={{ margin: '0 0 12px 0', fontSize: '0.8rem', color: '#94a3b8', lineHeight: '1.4' }}>
          Divulgue o jogo para 10 amigos durante a fase Beta e resgate **+50 XP** instantâneos!
        </p>

        <div 
          role="progressbar"
          aria-valuenow={sharesCount}
          aria-valuemin={0}
          aria-valuemax={10}
          style={{ backgroundColor: '#1e293b', height: '10px', borderRadius: '5px', overflow: 'hidden', marginBottom: '8px' }}
        >
          <div style={{ width: `${Math.min(100, (sharesCount / 10) * 100)}%`, backgroundColor: '#22c55e', height: '100%', transition: 'width 0.3s ease' }} />
        </div>
        
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: '#cbd5e1', marginBottom: '12px' }}>
          <span>Progresso: {sharesCount}/10 envios</span>
          <span>{rewardClaimed ? '✅ +50 XP Resgatado' : 'Prêmio: +50 XP'}</span>
        </div>

        <button
          onClick={handleShare}
          disabled={rewardClaimed}
          style={{
            width: '100%',
            padding: '0.8rem',
            backgroundColor: rewardClaimed ? '#334155' : '#0284c7',
            color: '#fff',
            border: 'none',
            borderRadius: '10px',
            fontWeight: 'bold',
            fontSize: '0.85rem',
            cursor: rewardClaimed ? 'not-allowed' : 'pointer'
          }}
        >
          {rewardClaimed ? 'Recompensa Concluída' : 'Compartilhar Agora 📲'}
        </button>
      </div>

      {/* COMPONENTE DO QUIZ DIÁRIO INTEGRADO */}
      <DailyQuizCard onScoreUpdate={() => onAddXP(10)} />
    </div>
  )
}

function App() {
  const [player, setPlayer] = useState(null)
  const [missions, setMissions] = useState([])
  const [activeMissionId, setActiveMissionId] = useState(null)
  const [currentTab, setCurrentTab] = useState('inicio')
  const [loading, setLoading] = useState(true)

  // Perfil do Jogador
  const [userProfile, setUserProfile] = useState(() => {
    const saved = localStorage.getItem('aprix_user_profile')
    return saved ? JSON.parse(saved) : null
  })

  const baseMissionsTree = [
    { id: 1, title: 'ACORDA, FINANCEIRO!' },
    { id: 2, title: 'O FLUXO DO DINHEIRO' },
    { id: 3, title: 'O DINHEIRO SUMIU' },
    { id: 4, title: 'CAÇA AO VAZAMENTO' },
    { id: 5, title: 'ESCOLHA SEU CAMINHO' },
    { id: 6, title: 'PAGUE-SE PRIMEIRO' },
    { id: 7, title: 'ORÇAMENTO EM EQUILÍBRIO' },
    { id: 8, title: 'PRIORIDADE MÁXIMA' },
    { id: 9, title: 'O LABIRINTO DAS DÍVIDAS' },
    { id: 10, title: 'O DINHEIRO DESAPARECIDO' },
    { id: 11, title: 'A ESCOLHA DE AGORA' },
    { id: 12, title: 'O CÓDIGO DO DINHEIRO' },
    { id: 13, title: 'Efeito Dominó' },
    { id: 14, title: 'O Primeiro Tesouro' },
    { id: 15, title: 'Caça aos Vazamentos' },
    { id: 16, title: 'Aliado ou Peso?' },
    { id: 17, title: 'Construa Sua Máquina' },
    { id: 18, title: 'O Poder do Tempo' },
    { id: 19, title: 'Investidor ou Apostador?' },
  ]

  // Lógica Dinâmica e Escalável de Cálculo de Estados de Missão
  const calculateMissionsState = (allMissions, currentMissionId, completedMissions = []) => {
    const completedSet = new Set(completedMissions.map(Number))
    const currId = Number(currentMissionId)

    const backendList = Array.isArray(allMissions) ? allMissions : []
    const backendIds = new Set(backendList.map((m) => Number(m.id)))
    const missingFromBackend = baseMissionsTree.filter((m) => !backendIds.has(Number(m.id)))
    const sourceList = backendList.length > 0 ? [...backendList, ...missingFromBackend] : baseMissionsTree

    return sourceList.map((m) => {
      const mId = Number(m.id)
      const isCompleted = completedSet.has(mId)
      
      // Regra Escalável:
      // Desbloqueado se for a 1ª missão, se já foi concluída, se for a missão atual do usuário
      // OU se a missão anterior (mId - 1) foi concluída.
      const isUnlocked = mId === 1 || isCompleted || mId === currId || completedSet.has(mId - 1)
      const isLocked = !isUnlocked
      const isCurrent = mId === currId || (!isCompleted && isUnlocked)

      return {
        ...m,
        id: mId,
        isCompleted,
        isCurrent,
        isLocked
      }
    })
  }

  useEffect(() => {
    async function loadData() {
      try {
        let playerDataBackend = null
        let missionsDataRaw = null

        try {
          playerDataBackend = await fetchPlayerData()
          missionsDataRaw = await fetchMissions()
        } catch (e) {
          console.warn('Erro na chamada da API, utilizando dados locais.')
        }

        let missionsData = Array.isArray(missionsDataRaw)
          ? missionsDataRaw
          : Object.values(missionsDataRaw || {})

        // Pega do localStorage
        const savedPlayerLocal = localStorage.getItem('aprix_player_data')
        const localPlayerData = savedPlayerLocal ? JSON.parse(savedPlayerLocal) : null

        // FUSÃO DE DADOS (LOCAL + SERVIDO): Nunca perde o progresso salvo
        const localCompleted = (localPlayerData?.completedMissions || []).map(Number)
        const backendCompleted = (playerDataBackend?.completedMissions || []).map(Number)

        // Junta as duas listas de concluídas sem duplicatas
        const mergedCompleted = Array.from(new Set([...localCompleted, ...backendCompleted]))

        // ✅ FIX: Se não houver progresso salvo, mantém o array vazio (inicia na Missão 1)
        const finalCompleted = mergedCompleted

        // Calcula a maior missão desbloqueada
        const maxCompletedId = finalCompleted.length > 0 ? Math.max(...finalCompleted) : 0
        const calculatedNextMission = maxCompletedId + 1

        const activePlayerData = {
          lives: playerDataBackend?.lives ?? localPlayerData?.lives ?? 3,
          maxLives: playerDataBackend?.maxLives ?? localPlayerData?.maxLives ?? 3,
          xp: Math.max(playerDataBackend?.xp || 0, localPlayerData?.xp || 0),
          targetXP: playerDataBackend?.targetXP ?? localPlayerData?.targetXP ?? 100,
          level: Math.max(playerDataBackend?.level || 1, localPlayerData?.level || 1),
          currentMissionId: Math.max(
            Number(playerDataBackend?.currentMissionId || 1),
            Number(localPlayerData?.currentMissionId || 1),
            calculatedNextMission
          ),
          completedMissions: finalCompleted,
        }

        // Salva de volta no LocalStorage para sincronizar
        localStorage.setItem('aprix_player_data', JSON.stringify(activePlayerData))

        setPlayer(activePlayerData)
        setMissions(calculateMissionsState(missionsData, activePlayerData.currentMissionId, finalCompleted))
      } catch (error) {
        console.error('Erro ao carregar dados:', error)
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [])

  const handleWrongAnswer = () => {
    setPlayer((prev) => {
      if (!prev) return null
      const currentLives = Number(prev.lives ?? 3)
      const newLives = Math.max(0, currentLives - 1)

      if (newLives === 0) setActiveMissionId(null)

      const updated = { ...prev, lives: newLives }
      localStorage.setItem('aprix_player_data', JSON.stringify(updated))
      return updated
    })
  }

  const handleLifeRecovered = (updatedData) => {
    setPlayer((prev) => {
      if (!prev) return null
      const updatedLives = updatedData?.lives ?? Math.min(prev.maxLives || 3, (prev.lives || 0) + 1)
      const updated = { ...prev, ...updatedData, lives: updatedLives }
      localStorage.setItem('aprix_player_data', JSON.stringify(updated))
      return updated
    })
  }

  const handleSelectMission = (mission) => {
    if (mission.isCompleted) {
      setActiveMissionId(mission.id)
      return
    }

    if (mission.isLocked) {
      alert(`A Missão ${mission.id} está bloqueada! Conclua a Missão ${mission.id - 1} primeiro.`)
      return
    }

    setActiveMissionId(mission.id)
  }

  const handleAddDirectXP = (amount) => {
    setPlayer((prev) => {
      if (!prev) return null
      let newXP = (prev.xp || 0) + amount
      let newLevel = prev.level || 1
      let targetXP = prev.targetXP || 100

      while (newXP >= targetXP) {
        newXP -= targetXP
        newLevel += 1
      }

      const updated = { ...prev, xp: newXP, level: newLevel }
      localStorage.setItem('aprix_player_data', JSON.stringify(updated))
      return updated
    })
  }

  const handleFinishMission = async (completedId, resultData) => {
    if (!resultData || resultData.success !== true) {
      console.warn('handleFinishMission chamado sem success === true, ignorando.', { completedId, resultData })
      return
    }

    const numericCompletedId = Number(completedId)
    const nextMissionId = numericCompletedId + 1
    const earnedXP = Number(resultData.xpEarned ?? 0)

    let updatedPlayer = null

    setPlayer((prev) => {
      if (!prev) return null

      let newXP = (prev.xp || 0) + earnedXP
      let newLevel = prev.level || 1
      let targetXP = prev.targetXP || 100

      while (newXP >= targetXP) {
        newXP -= targetXP
        newLevel += 1
      }

      const prevCompleted = (prev.completedMissions || []).map(Number)
      const updatedCompleted = Array.from(new Set([...prevCompleted, numericCompletedId]))

      updatedPlayer = {
        ...prev,
        xp: newXP,
        level: newLevel,
        currentMissionId: Math.max(prev.currentMissionId || 1, nextMissionId),
        completedMissions: updatedCompleted
      }

      // Garante salvamento síncrono no localStorage
      localStorage.setItem('aprix_player_data', JSON.stringify(updatedPlayer))

      return updatedPlayer
    })

    setMissions((prevMissions) => {
      const completedList = updatedPlayer?.completedMissions || [numericCompletedId]
      return calculateMissionsState(prevMissions, nextMissionId, completedList)
    })

    setActiveMissionId(null)

    try {
      await submitAnswer(numericCompletedId, { completed: true, xpEarned: earnedXP })
    } catch (error) {
      console.warn('Erro ao salvar no servidor (progresso preservado localmente):', error)
    }
  }

  if (loading) {
    return (
      <main style={{ padding: '2rem', textAlign: 'center', color: '#fff', backgroundColor: '#060913', minHeight: '100vh' }}>
        <p>Carregando APRIX...</p>
      </main>
    )
  }

  const isGameOver = player && Number(player.lives) === 0
  const activeMissionObj = missions.find((m) => m.isCurrent) || missions[0]

  return (
    <div style={{ backgroundColor: '#060913', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      
      {/* MONTAGEM DE PERFIL / ONBOARDING BLOQUEANTE */}
      {!userProfile && (
        <ProfileSetup onComplete={(profile) => setUserProfile(profile)} />
      )}

      {/* HEADER PRINCIPAL OTIMIZADO PARA MOBILE */}
      <header style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        padding: '0.6rem 0.8rem', 
        backgroundColor: '#080d1a',
        borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
        gap: '8px',
        width: '100%',
        boxSizing: 'border-box'
      }}>
        {userProfile ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', minWidth: 0, flex: '1 1 auto' }}>
            <div style={{ 
              width: '32px', 
              height: '32px', 
              minWidth: '32px', 
              borderRadius: '50%', 
              overflow: 'hidden', 
              border: '2px solid #38bdf8', 
              backgroundColor: '#1e293b',
              flexShrink: 0 
            }}>
              <img src={userProfile.avatarUrl} alt="Avatar" style={{ width: '100%', height: '100%' }} />
            </div>
            <span style={{ 
              color: '#fff', 
              fontSize: '0.8rem', 
              fontWeight: 'bold',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              maxWidth: '120px'
            }}>
              {userProfile.name}
            </span>
          </div>
        ) : (
          <div style={{ flex: '1 1 auto' }} />
        )}

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
          <Lives currentLives={player?.lives} maxLives={player?.maxLives} onLifeRecovered={handleLifeRecovered} />
          <XPBar currentXP={player?.xp} targetXP={player?.targetXP} level={player?.level} />
        </div>
      </header>

      {/* CONTEÚDO PRINCIPAL */}
      <main style={{ flex: 1, paddingBottom: '80px' }}>
        {isGameOver ? (
          <GameOver onLifeRecovered={handleLifeRecovered} />
        ) : (
          <>
            {currentTab === 'inicio' && (
              <HomeView 
                player={userProfile} 
                currentMission={activeMissionObj} 
                onPlayMission={(mission) => handleSelectMission(mission)} 
              />
            )}

            {currentTab === 'jornada' && (
              <Map missions={missions} onSelectMission={handleSelectMission} />
            )}

            {currentTab === 'ranking' && (
              <RankingTab player={player} userProfile={userProfile} />
            )}

            {currentTab === 'premios' && (
              <RewardsTab onAddXP={handleAddDirectXP} />
            )}

            {currentTab === 'perfil' && (
              <div style={{ padding: '1.5rem', textAlign: 'center', color: '#fff', maxWidth: '400px', margin: '0 auto' }}>
                <h3 style={{ color: '#38bdf8', marginBottom: '1rem' }}>👤 Meu Perfil</h3>
                
                {userProfile && (
                  <div style={{ backgroundColor: '#0f172a', border: '1px solid #334155', borderRadius: '16px', padding: '1.2rem', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px' }}>
                    <div style={{ width: '80px', height: '80px', borderRadius: '50%', overflow: 'hidden', border: '3px solid #38bdf8', backgroundColor: '#1e293b' }}>
                      <img src={userProfile.avatarUrl} alt="Avatar" style={{ width: '100%', height: '100%' }} />
                    </div>
                    <h4 style={{ margin: 0, fontSize: '1.1rem' }}>{userProfile.name}</h4>
                    
                    <div style={{ width: '100%', display: 'flex', justifyContent: 'space-around', marginTop: '8px', borderTop: '1px solid #1e293b', paddingTop: '10px', fontSize: '0.85rem', color: '#cbd5e1' }}>
                      <span><strong>Nível:</strong> {player?.level}</span>
                      <span><strong>XP Total:</strong> {player?.xp}</span>
                    </div>

                    <button
                      onClick={() => {
                        if (confirm('Deseja refazer seu avatar?')) {
                          localStorage.removeItem('aprix_user_profile')
                          setUserProfile(null)
                        }
                      }}
                      style={{
                        marginTop: '10px',
                        padding: '0.6rem 1rem',
                        backgroundColor: '#1e293b',
                        border: '1px solid #334155',
                        color: '#f87171',
                        borderRadius: '8px',
                        fontSize: '0.75rem',
                        cursor: 'pointer'
                      }}
                    >
                      Editar Avatar
                    </button>
                  </div>
                )}
              </div>
            )}
          </>
        )}
      </main>

      {/* MISSION RUNNER */}
      {activeMissionId && (
        <MissionRunner
          missionId={activeMissionId}
          onFinishMission={handleFinishMission}
          onError={handleWrongAnswer}
          onClose={() => setActiveMissionId(null)}
        />
      )}

      <BottomNav activeTab={currentTab} onTabChange={setCurrentTab} />
    </div>
  )
}

export default App