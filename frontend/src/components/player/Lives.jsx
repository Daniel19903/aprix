import React, { useState, useEffect } from 'react'

const RECOVERY_TIME_SECONDS = 180 // 3 minutos

export function Lives({ currentLives = 3, maxLives = 3, onLifeRecovered }) {
  const [timeLeft, setTimeLeft] = useState(RECOVERY_TIME_SECONDS)

  useEffect(() => {
    // Se o jogador já tem o número máximo de vidas, reseta e remove o timer
    if (currentLives >= maxLives) {
      localStorage.removeItem('aprix_life_timer_start')
      setTimeLeft(RECOVERY_TIME_SECONDS)
      return
    }

    // Registra o tempo inicial se ainda não existir
    let startTime = localStorage.getItem('aprix_life_timer_start')
    if (!startTime) {
      startTime = Date.now().toString()
      localStorage.setItem('aprix_life_timer_start', startTime)
    }

    const interval = setInterval(() => {
      const now = Date.now()
      const elapsedSeconds = Math.floor((now - Number(startTime)) / 1000)
      const remaining = RECOVERY_TIME_SECONDS - elapsedSeconds

      if (remaining <= 0) {
        // Tempo esgotado! Recupera +1 vida
        clearInterval(interval)
        localStorage.removeItem('aprix_life_timer_start')
        setTimeLeft(RECOVERY_TIME_SECONDS)

        const newLives = Math.min(maxLives, currentLives + 1)
        
        console.log(`⏱️ Cronômetro zerou! Vida recuperada: ${currentLives} -> ${newLives}`)

        if (onLifeRecovered) {
          onLifeRecovered({
            lives: newLives,
            maxLives
          })
        }
      } else {
        setTimeLeft(remaining)
      }
    }, 1000)

    return () => clearInterval(interval)
  }, [currentLives, maxLives, onLifeRecovered])

  // Formata os segundos em MM:SS
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`
  }

  // Gera os corações (vermelho ou cinza/desativado)
  const renderHearts = () => {
    const hearts = []
    for (let i = 0; i < maxLives; i++) {
      const isFilled = i < currentLives
      hearts.push(
        <span
          key={i}
          style={{
            fontSize: '1.2rem',
            filter: isFilled ? 'none' : 'grayscale(100%) opacity(30%)',
            transition: 'all 0.3s'
          }}
        >
          ❤️
        </span>
      )
    }
    return hearts
  }

  return (
    <div
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '8px',
        backgroundColor: '#0f172a',
        border: '1px solid #334155',
        borderRadius: '20px',
        padding: '0.4rem 0.9rem',
        color: '#fff',
        fontWeight: 'bold',
        fontSize: '0.9rem'
      }}
    >
      <div style={{ display: 'flex', gap: '4px' }}>{renderHearts()}</div>

      {currentLives < maxLives && (
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#cbd5e1', marginLeft: '4px' }}>
          <span>⏱️</span>
          <span style={{ fontSize: '0.85rem' }}>{formatTime(timeLeft)}</span>
        </div>
      )}
    </div>
  )
}