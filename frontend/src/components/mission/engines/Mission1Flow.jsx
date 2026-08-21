import React, { useState } from 'react';

const ITEMS = [
  { id: 'celular', label: 'Celular', desc: 'Plano, recarga ou compra de aplicativos podem gerar gastos.', isCorrect: true },
  { id: 'videogame', label: 'Videogame', desc: 'Jogos, assinaturas e acessórios podem envolver gastos.', isCorrect: true },
  { id: 'travesseiro', label: 'Travesseiro / Cama', desc: 'Objeto do quarto, sem representar uma decisão financeira específica.', isCorrect: false },
  { id: 'cofre', label: 'Cofrinho de Moedas', desc: 'Representa a escolha de separar parte do dinheiro para guardar.', isCorrect: true },
  { id: 'cortina', label: 'Cortina da Janela', desc: 'Objeto do quarto, sem representar uma decisão financeira específica.', isCorrect: false },
  { id: 'conta', label: 'Conta de Luz / Internet', desc: 'Representa despesas que precisam ser consideradas no orçamento.', isCorrect: true }
];

export function Mission1Flow({ onComplete, onError }) {
  const [selectedIds, setSelectedIds] = useState([]);
  const [wrongId, setWrongId] = useState(null);
  const [feedback, setFeedback] = useState(null);

  const handleToggle = (item) => {
    // Se o item clicado for errado
    if (!item.isCorrect) {
      setWrongId(item.id);
      setFeedback('Ops! Esse item não representa um impacto financeiro direto.');
      
      // Notifica o App para descontar 1 vida global
      if (onError) onError();

      // Limpa a marcação de erro após um momento sem avançar a tela
      setTimeout(() => {
        setWrongId(null);
        setFeedback(null);
      }, 1200);

      return;
    }

    // Se o item for correto, adiciona ou remove da seleção
    setWrongId(null);
    setFeedback(null);
    setSelectedIds((prev) =>
      prev.includes(item.id) ? prev.filter((id) => id !== item.id) : [...prev, item.id]
    );
  };

  const handleVerify = () => {
    const correctItemsCount = ITEMS.filter((i) => i.isCorrect).length;

    // Só conclui se selecionou EXATAMENTE todos os itens corretos
    if (selectedIds.length === correctItemsCount) {
      // Conclui e concede exatamente 10 XP para o Quiz
      if (onComplete) {
        onComplete({ success: true, xpEarned: 10 });
      }
    } else {
      setFeedback('Ainda faltam itens corretos para selecionar!');
    }
  };

  return (
    <div style={{ color: '#fff', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <div style={{ backgroundColor: '#1e293b', padding: '1rem', borderRadius: '12px', border: '1px solid #334155' }}>
        <p style={{ margin: 0, fontSize: '0.85rem', color: '#cbd5e1' }}>
          <strong>Aprix diz:</strong> "Antes de controlar seu dinheiro, você precisa perceber uma coisa: várias escolhas do seu dia podem mexer com ele. Vamos testar seu olhar?"
        </p>
      </div>

      <p style={{ margin: 0, fontSize: '0.8rem', color: '#38bdf8', fontWeight: 'bold' }}>
        💸 Clique nas coisas que podem fazer você gastar dinheiro sem precisar!
      </p>

      {/* GRID DE CARDS */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
        {ITEMS.map((item) => {
          const isSelected = selectedIds.includes(item.id);
          const isWrong = wrongId === item.id;

          // Define as cores sem revelar respostas certas não clicadas
          let border = '1px solid #334155';
          let bg = '#0f172a';

          if (isWrong) {
            border = '2px solid #ef4444'; // Vermelho apenas no item errado clicado
            bg = 'rgba(239, 68, 68, 0.2)';
          } else if (isSelected) {
            border = '2px solid #22c55e'; // Verde no item selecionado correto
            bg = 'rgba(34, 197, 94, 0.15)';
          }

          return (
            <div
              key={item.id}
              onClick={() => handleToggle(item)}
              style={{
                padding: '0.75rem',
                borderRadius: '10px',
                border,
                backgroundColor: bg,
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
            >
              <h4 style={{ margin: '0 0 4px 0', fontSize: '0.85rem', color: '#fff' }}>{item.label}</h4>
              <p style={{ margin: 0, fontSize: '0.7rem', color: '#94a3b8', lineHeight: '1.2' }}>{item.desc}</p>
            </div>
          );
        })}
      </div>

      {feedback && (
        <div style={{ textAlign: 'center', color: '#f87171', fontSize: '0.8rem', fontWeight: 'bold' }}>
          {feedback}
        </div>
      )}

      <button
        onClick={handleVerify}
        disabled={selectedIds.length === 0}
        style={{
          width: '100%',
          padding: '0.85rem',
          backgroundColor: selectedIds.length > 0 ? '#0284c7' : '#334155',
          color: '#fff',
          border: 'none',
          borderRadius: '8px',
          fontWeight: 'bold',
          cursor: selectedIds.length > 0 ? 'pointer' : 'not-allowed'
        }}
      >
        Verificar
      </button>
    </div>
  );
}