import React from 'react'
import'./Aprix.css'

// Mapeamento temporário de emojis para cada estado emocional do Aprix 
const EXPRESSIONS = {
  happy: '🕊️',
  thinking: '🤔',
  excited: '🚀',
  sad: '🩹',
  celebrating: '🎉',
  encouraging: '💪'
}


export function Aprix({state = 'happy', message, size ='medium'}){
    const currentExpression = EXPRESSIONS[state] || EXPRESSIONS.happy

    return (
        <div className={'aprix-container aprix-${size}'}>
            <div className={'aprix-avatar aprix-state-${state}'}>
                <span className="aprix-expression" role="img" aria-label={state}>
                    {currentExpression}
                </span>
            </div>

           {message && (
        <div className="aprix-speech-bubble">
          <p>{message}</p>
        </div>
      )}
    </div>
  )
}

export default Aprix