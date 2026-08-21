import React from 'react'
import { Aprix } from '../aprix/Aprix'
import './MissionResult.css'

export function MissionResult({ isCorrect, choice, xpReward, onContinue }) {
  const aprixState = isCorrect ? 'celebrating' : 'sad'
  const aprixMessage = isCorrect
    ? `Parabéns! Você mandou muito bem e ganhou +${xpReward} XP!`
    : 'Ops! Essa não é a melhor escolha. Tente novamente para aprender!'

  return (
    <div className={`mission-result-card ${isCorrect ? 'success' : 'error'}`}>
      <Aprix state={aprixState} message={aprixMessage} />

      <h2 className={`result-title ${isCorrect ? 'success' : 'error'}`}>
        {isCorrect ? 'Você Venceu! 🎉' : 'Que pena! 💔'}
      </h2>

      <p className="result-feedback">{choice?.feedback}</p>

      <button className="action-button" onClick={onContinue}>
        {isCorrect ? 'Continuar no Mapa' : 'Tentar Novamente'}
      </button>
    </div>
  )
}

export default MissionResult