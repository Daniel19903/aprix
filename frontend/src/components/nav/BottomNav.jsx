import React from 'react'
import './BottomNav.css'

export function BottomNav({ activeTab = 'jornada', onTabChange }) {
  const tabs = [
    { id: 'inicio', label: 'Início', icon: '🏠' },
    { id: 'jornada', label: 'Jornada', icon: '🌲' },
    { id: 'ranking', label: 'Ranking', icon: '🏆' },
    { id: 'premios', label: 'Prêmios', icon: '🎁' },
    { id: 'perfil', label: 'Perfil', icon: '👤' },
  ]

  return (
    <nav className="bottom-nav">
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id
        return (
          <button
            key={tab.id}
            className={`nav-item ${isActive ? 'active' : ''}`}
            onClick={() => onTabChange && onTabChange(tab.id)}
          >
            <div className="nav-icon-wrapper">
              <span className="nav-icon">{tab.icon}</span>
            </div>
            <span className="nav-label">{tab.label}</span>
          </button>
        )
      })}
    </nav>
  )
}

export default BottomNav