// src/components/missions/engines/BudgetSliderEngine.jsx
import React, { useState } from 'react'

export function BudgetSliderEngine({ config, onComplete }) {
  const { totalBudget, categories } = config.data
  const [allocations, setAllocations] = useState(
    categories.reduce((acc, cat) => ({ ...acc, [cat.id]: 0 }), {})
  )

  const currentTotal = Object.values(allocations).reduce((a, b) => a + b, 0)
  const remaining = totalBudget - currentTotal

  const handleChange = (id, value) => {
    const numValue = Number(value)
    const otherSum = Object.entries(allocations)
      .filter(([k]) => k !== id)
      .reduce((a, [, v]) => a + v, 0)

    if (otherSum + numValue <= totalBudget) {
      setAllocations((prev) => ({ ...prev, [id]: numValue }))
    }
  }

  const handleValidate = () => {
    if (remaining !== 0) {
      alert(`Você ainda tem R$ ${remaining} para distribuir!`)
      return
    }

    // Valida se atendeu aos mínimos das categorias
    const isValid = categories.every((cat) => {
      const val = allocations[cat.id]
      if (cat.min && val < cat.min) return false
      return true
    })

    if (isValid) {
      onComplete(true)
    } else {
      alert('Atenção aos saldos mínimos necessários em cada área essencial!')
    }
  }

  return (
    <div className="budget-engine-container">
      <div className="budget-header">
        <h3>Saldo Restante: <span className={remaining === 0 ? 'perfect' : ''}>R$ {remaining}</span> / R$ {totalBudget}</h3>
      </div>

      <div className="sliders-list">
        {categories.map((cat) => (
          <div key={cat.id} className="slider-group">
            <div className="slider-label">
              <span>{cat.label}</span>
              <strong>R$ {allocations[cat.id]}</strong>
            </div>
            <input
              type="range"
              min="0"
              max={totalBudget}
              step="5"
              value={allocations[cat.id]}
              onChange={(e) => handleChange(cat.id, e.target.value)}
            />
          </div>
        ))}
      </div>

      <button 
        className="confirm-budget-btn" 
        disabled={remaining !== 0}
        onClick={handleValidate}
      >
        Confirmar Orçamento
      </button>
    </div>
  )
}