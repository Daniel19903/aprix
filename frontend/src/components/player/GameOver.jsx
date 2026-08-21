import React, { useState } from 'react'
import { Aprix } from '../aprix/Aprix'
import { fetchRecoveryQuest, addPlayerLife } from '../../services/api'
import './GameOver.css'

export function GameOver({ onLifeRecovered }) {
  const [quest, setQuest] = useState(null)
  const [feedback, setFeedback] = useState(null)

  const handleStartQuest = async () => {
    const q = await fetchRecoveryQuest()
    setQuest(q)
    setFeedback(null)
  }

  const handleAnswerQuest = async (choice) => {
    if (choice.isCorrect) {
      const res = await addPlayerLife()
      if (res && res.success) {
        setFeedback({ success: true, text: choice.feedback })
        setTimeout(() => {
          onLifeRecovered(res.player)
        }, 1500)
      }
    } else {
      setFeedback({ success: false, text: choice.feedback })
    }
  }

  return (
    <div className="game-over-card">
      <Aprix state="sad" message="Suas vidas acabaram! Faça o desafio de recarga para ganhar +1 vida!" />

      <h2 className="game-over-title">Sem Vidas! 💔</h2>

      {!quest && (
        <>
          <p className="game-over-text">
            Aguarde 3 minutos para recuperar vida automaticamente ou responda ao Desafio de Recarga agora!
          </p>
          <button className="reset-button" onClick={handleStartQuest}>
            Fazer Desafio de Recarga (+1 ❤️)
          </button>
        </>
      )}

      {quest && !feedback && (
        <div style={{ width: '100%', textAlign: 'left' }}>
          <h3>{quest.title}</h3>
          <p>{quest.description}</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginTop: '1rem' }}>
            {quest.choices.map((c) => (
              <button
                key={c.id}
                className="reset-button"
                style={{ backgroundColor: '#2196F3' }}
                onClick={() => handleAnswerQuest(c)}
              >
                {c.text}
              </button>
            ))}
          </div>
        </div>
      )}

      {feedback && (
        <p style={{ color: feedback.success ? '#4CAF50' : '#F44336', fontWeight: 'bold' }}>
          {feedback.text}
        </p>
      )}
    </div>
  )
}

export default GameOver