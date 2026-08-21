import React, { useState } from 'react';
 
const ROOM_ITEMS = [
  { id: 'celular', label: 'Celular', desc: 'Plano, recarga ou compra de aplicativos podem gerar gastos.', isFinancial: true, icon: '📱' },
  { id: 'videogame', label: 'Videogame', desc: 'Jogos, assinaturas e acessórios podem envolver gastos.', isFinancial: true, icon: '🎮' },
  { id: 'cama', label: 'Travesseiro / Cama', desc: 'Objeto do quarto, sem representar uma decisão financeira específica.', isFinancial: false, icon: '🛏️' },
  { id: 'cofrinho', label: 'Cofrinho de Moedas', desc: 'Representa a escolha de separar parte do dinheiro para guardar.', isFinancial: true, icon: '🐷' },
  { id: 'cortina', label: 'Cortina da Janela', desc: 'Objeto do quarto, sem representar uma decisão financeira específica.', isFinancial: false, icon: '🪟' },
  { id: 'conta', label: 'Conta de Luz / Internet', desc: 'Representa despesas que precisam ser consideradas no orçamento.', isFinancial: true, icon: '🧾' }
];
 
// IMPORTANTE: o export nomeado precisa ser "DragDropEngine" e o arquivo
// precisa se chamar "DragDropEngine.jsx" (sem "And") para bater com o
// import em MissionRunner.jsx: import * as ... from './engines/DragDropEngine'
export function DragDropEngine({ onComplete, onError }) {
  const [selectedIds, setSelectedIds] = useState([]);
  const [wrongId, setWrongId] = useState(null);
  const [feedback, setFeedback] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
 
  const handleToggle = (item) => {
    // Ignora novos cliques enquanto um erro ainda está sendo exibido
    // (evita descontar vida múltiplas vezes por cliques repetidos no mesmo erro)
    if (wrongId) return;
 
    // Item errado: desconta vida em tempo real, pisca vermelho, reseta.
    // NÃO revela quais eram os itens corretos, NÃO avança, NÃO dá XP.
    if (!item.isFinancial) {
      setWrongId(item.id);
      setFeedback('Ops! Esse item não representa um impacto financeiro direto.');
 
      if (onError) onError();
 
      setTimeout(() => {
        setWrongId(null);
        setFeedback(null);
      }, 1200);
 
      return;
    }
 
    // Item correto: adiciona/remove da seleção. Só fica verde o que o
    // próprio jogador clicou — nada é revelado antecipadamente.
    setWrongId(null);
    setFeedback(null);
    setSelectedIds((prev) =>
      prev.includes(item.id) ? prev.filter((id) => id !== item.id) : [...prev, item.id]
    );
  };
 
  const handleVerify = () => {
    // Evita disparo duplicado (duplo clique)
    if (isSubmitting) return;
 
    const correctCount = ROOM_ITEMS.filter((i) => i.isFinancial).length;
 
    // Como itens errados nunca entram em selectedIds (handleToggle barra isso
    // acima), bater a contagem já garante que só os itens corretos foram
    // selecionados — igual à mesma regra usada no Mission1Flow.
    if (selectedIds.length === correctCount) {
      setIsSubmitting(true);
      if (onComplete) {
        onComplete({ success: true, xpEarned: 10 });
      }
    } else {
      setFeedback('Ainda faltam itens corretos para selecionar!');
    }
  };
 
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', color: '#fff' }}>
      {/* Fala do Aprix */}
      <div style={{ display: 'flex', gap: '12px', backgroundColor: '#1e293b', padding: '1rem', borderRadius: '12px', border: '1px solid #334155' }}>
        <span style={{ fontSize: '2rem' }}>🐦</span>
        <p style={{ margin: 0, fontSize: '0.88rem', color: '#cbd5e1', lineHeight: '1.4' }}>
          <strong>Aprix diz:</strong> "Antes de controlar seu dinheiro, você precisa perceber uma coisa: várias escolhas do seu dia podem mexer com ele. Vamos testar seu olhar?"
        </p>
      </div>
 
      <p style={{ margin: '0.25rem 0 0 0', fontSize: '0.85rem', color: '#38bdf8', fontWeight: 'bold' }}>
        💰 Clique nas coisas que envolvem o seu dinheiro! Elas podem fazer você gastar, pagar ou guardar dinheiro.
      </p>
 
      {/* Grid de opções */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
        {ROOM_ITEMS.map((item) => {
          const isSelected = selectedIds.includes(item.id);
          const isWrong = wrongId === item.id;
 
          // Cores sem revelar respostas certas não clicadas:
          // - vermelho só no item errado que acabou de ser clicado
          // - verde só no item correto que o jogador já selecionou
          let borderColor = '#334155';
          let bgColor = '#0f172a';
 
          if (isWrong) {
            borderColor = '#ef4444';
            bgColor = 'rgba(239, 68, 68, 0.15)';
          } else if (isSelected) {
            borderColor = '#22c55e';
            bgColor = 'rgba(34, 197, 94, 0.15)';
          }
 
          return (
            <button
              key={item.id}
              onClick={() => handleToggle(item)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                padding: '0.75rem',
                backgroundColor: bgColor,
                border: `1.5px solid ${borderColor}`,
                borderRadius: '10px',
                cursor: 'pointer',
                textAlign: 'left',
                color: '#fff',
                transition: 'all 0.2s ease'
              }}
            >
              <span style={{ fontSize: '1.5rem' }}>{item.icon}</span>
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <span style={{ fontSize: '0.85rem', fontWeight: 'bold', color: isSelected ? '#22c55e' : '#e2e8f0' }}>
                  {item.label}
                </span>
                <span style={{ fontSize: '0.7rem', color: '#94a3b8', marginTop: '2px' }}>
                  {item.desc}
                </span>
              </div>
            </button>
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
        disabled={selectedIds.length === 0 || isSubmitting}
        style={{
          marginTop: '0.5rem',
          padding: '0.85rem',
          backgroundColor: selectedIds.length > 0 && !isSubmitting ? '#0284c7' : '#334155',
          color: '#fff',
          border: 'none',
          borderRadius: '8px',
          fontWeight: 'bold',
          fontSize: '0.95rem',
          cursor: selectedIds.length > 0 && !isSubmitting ? 'pointer' : 'not-allowed',
          transition: 'background-color 0.2s'
        }}
      >
        Confirmar Respostas
      </button>
    </div>
  );
}