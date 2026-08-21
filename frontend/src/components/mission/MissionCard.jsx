import React, { useState } from 'react'
import './MissionCard.css'

export function MissionCard({ mission, onAnswer }) {
  const [selectedChoiceId, setSelectedChoiceId] = useState(null)

  if (!mission) return null

  const handleChoiceClick = (choice) => {
    setSelectedChoiceId(choice.id)
    if (onAnswer) {
      onAnswer(choice)
    }
  }

  return (
    <div className="mission-card">
      <div className="mission-header">
        <span className="mission-badge">Missão {mission.id}</span>
        <span className="mission-reward">+{mission.xpReward} XP ⭐</span>
      </div>

      <h2 className="mission-title">{mission.title}</h2>
      <p className="mission-description">{mission.description}</p>

      <div className="choices-list">
        {mission.choices?.map((choice) => (
          <button
            key={choice.id}
            className={`choice-button ${selectedChoiceId === choice.id ? 'selected' : ''}`}
            onClick={() => handleChoiceClick(choice)}
          >
            {choice.text}
          </button>
        ))}
      </div>
    </div>
  )
}

export default MissionCard