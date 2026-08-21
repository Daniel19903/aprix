import React from 'react'
import './XPBar.css'

export function XPBar({currentXP = 0, targetXP = 500, level = 1}){
    const percentage = Math.min(Math.round((currentXP / targetXP) * 100), 100)

    return (
        <div className="xp-bar-container">
            <div className="xp-header">
                <span className="xp-level-badge">Nivel {level}</span>
                <span className="xp-amount">{currentXP} / {targetXP} XP</span>

            </div>
            <div className="xp-track">
                <div className="xp-fill" style={{ width: '${percentage}%'}}>

                </div>
            </div>
        </div>
    )
}

export default XPBar 