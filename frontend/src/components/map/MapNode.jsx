import React from "react";
import './MapNode.css'

export function MapNode({mission, onSelectMission}) {
    const { id, title, isLocked, isCompleted, isCurrent, isSpecial } = mission

    // Determina a classe de estilo de acordo com o estado
  let statusClass = 'locked'
  let icon = '🔒'

  if (isCompleted) {
    statusClass = 'completed'
    icon = '✅'
  } else if (isCurrent) {
    statusClass = 'current'
    icon = isSpecial ? '⭐' : '✨'
  } else if (!isLocked) {
    statusClass = 'available'
    icon = '📍'
  }

  const handleClick = () => {
    if (!isLocked && onSelectMission) {
      onSelectMission(mission)
    }
  }

  return (
    <div className={`map-node-container ${statusClass}`} onClick={handleClick}>
      <button className="map-node-button" disabled={isLocked} title={title}>
        {icon}
      </button>
      <span className="map-node-title">{id}. {title}</span>
    </div>
  )
}

export default MapNode
