// src/data/missionsContent.js

export const MISSIONS_CONFIG = {
  // BLOCO 1: DESPERTAR
  1: {
    id: 1,
    title: "Acorda, Financeiro!",
    engine: "TAP_ENGINE",
    instruction: "Encontre e toque nos 3 itens relacionados a dinheiro no ambiente!",
    data: {
      background: "room-scene",
      items: [
        { id: "cofrinho", name: "Cofrinho de Porquinho", isCorrect: true, x: 25, y: 60, icon: "🐷" },
        { id: "moeda", name: "Moeda no chão", isCorrect: true, x: 70, y: 80, icon: "🪙" },
        { id: "carteira", name: "Carteira na mesa", isCorrect: true, x: 45, y: 40, icon: "👛" },
        { id: "planta", name: "Planta", isCorrect: false, x: 10, y: 30, icon: "🪴" },
        { id: "livro", name: "Livro", isCorrect: false, x: 80, y: 20, icon: "📚" }
      ]
    },
    learningTip: "Dinheiro está no nosso dia a dia de várias formas: guardado, esquecido ou pronto para ser usado com sabedoria!"
  },

  2: {
    id: 2,
    title: "De Onde Vem o Dinheiro?",
    engine: "DRAG_DROP_ENGINE",
    type: "MATCHING",
    instruction: "Conecte a fonte de origem até o tipo de dinheiro que ela gera!",
    data: {
      sources: [
        { id: "trabalho", label: "Trabalho / Emprego", icon: "💼" },
        { id: "mesada", label: "Apoio Familiar / Mesada", icon: "🤝" },
        { id: "vendas", label: "Venda de Desapegos", icon: "📦" }
      ],
      targets: [
        { id: "t_trabalho", accepts: "trabalho", label: "Salário no fim do mês" },
        { id: "t_mesada", accepts: "mesada", label: "Valor semanal/mensal para aprender a gerir" },
        { id: "t_vendas", accepts: "vendas", label: "Renda extra com itens sem uso" }
      ]
    },
    learningTip: "Todo dinheiro vem de um esforço, serviço ou troca de valor. Entender de onde ele vem valoriza o seu orçamento!"
  },

  3: {
    id: 3,
    title: "A Escolha Inteligente",
    engine: "CHOICE_SCENARIO_ENGINE",
    instruction: "Você recebeu R$ 50 no seu aniversário. Qual a melhor decisão?",
    data: {
      scenarios: [
        {
          id: "opt1",
          text: "Gastar tudo imediatamente em doces e jogos rápidos.",
          isCorrect: false,
          feedback: "Você se divertiu por 1 hora, mas o dinheiro acabou e não sobrou nada para suas metas futuras."
        },
        {
          id: "opt2",
          text: "Guardar R$ 30 para o seu fone de ouvido dos sonhos e usar R$ 20 para um lanche.",
          isCorrect: true,
          feedback: "Excelente! Você equilibrou o prazer do presente sem esquecer seus objetivos futuros."
        },
        {
          id: "opt3",
          text: "Emprestar para um amigo que promete devolver o dobro amanhã sem explicação.",
          isCorrect: false,
          feedback: "Cuidado! Promessas de ganho fácil geralmente são ciladas financeiras."
        }
      ]
    },
    learningTip: "Pensar alguns segundos antes de decidir evita o arrependimento financeiro!"
  },

  10: {
    id: 10,
    title: "Desafio dos R$100",
    engine: "BUDGET_SLIDER_ENGINE",
    instruction: "Distribua R$ 100 entre as categorias abaixo de forma equilibrada!",
    data: {
      totalBudget: 100,
      categories: [
        { id: "alimentacao", label: "🍔 Alimentação / Lanche", min: 10, recommended: 30 },
        { id: "transporte", label: "轨 Transporte / Passagens", min: 10, recommended: 20 },
        { id: "lazer", label: "🎮 Lazer / Diversão", max: 30, recommended: 20 },
        { id: "guardar", label: "💰 Guardar / Reserva", min: 10, recommended: 30 }
      ]
    },
    learningTip: "Priorizar necessidades antes do lazer garante que você não fique sem o essencial no final do mês."
  },

  50: {
    id: 50,
    title: "O Primeiro Controle Real",
    engine: "BOSS_DASHBOARD_ENGINE",
    instruction: "Você chegou ao topo! Gerencie o orçamento de um mês inteiro cumprindo as metas e contornando o imprevisto.",
    data: {
      initialBudget: 1500,
      requiredSavings: 300,
      unexpectedEvent: {
        title: "⚡ Celular quebrou a tela!",
        cost: 200,
        options: [
          { text: "Usar reserva de emergência", impact: "safe" },
          { text: "Parcelar no cartão de crédito em 12x com juros", impact: "danger" }
        ]
      }
    },
    learningTip: "Parabéns! Você domina o planejamento, controle, prevenção e disciplina financeira!"
  }
};