// src/data/missionsDatabase.js

const MISSIONS_DATABASE = {
  // --- FASE 1: O DESPERTAR (1 a 5) ---
  "1": {
    id: "1",
    title: "Acorda, Financeiro!",
    phase: "despertar",
    route: null,
    mechanic: "click_objects",
    difficulty: "easy",
    xpReward: 100,
    educationalGoal: "Educação financeira começa quando você percebe que suas escolhas têm impacto.",
    aprixMessage: "Boa! Dinheiro não aparece só quando você paga algo. Ele está escondido em várias escolhas do seu dia.",
    next: ["2"],
    data: {
      instruction: "Clique em todos os objetos do quarto que representam decisões financeiras!",
      targetObjects: [
        { id: "celular", name: "Celular (Plano de Dados)" },
        { id: "videogame", name: "Videogame (Jogos / Skins)" },
        { id: "cofrinho", name: "Cofrinho de Moedas" },
        { id: "conta", name: "Conta de Luz/Net" }
      ]
    }
  },
  "2": {
    id: "2",
    title: "De Onde Vem o Dinheiro?",
    phase: "despertar",
    route: null,
    mechanic: "drag_drop_categories",
    difficulty: "easy",
    xpReward: 100,
    educationalGoal: "Diferenciar entradas, saídas e reserva.",
    aprixMessage: "Agora você começou a enxergar o caminho do dinheiro. Saber de onde vem e para onde vai muda tudo!",
    next: ["3A", "3B"], // Primeiras duas rotas!
    data: {
      categories: ["DINHEIRO ENTRA", "DINHEIRO SAI", "DINHEIRO GUARDADO"],
      items: [
        { id: "i1", label: "Salário / Mesada", category: "DINHEIRO ENTRA" },
        { id: "i2", label: "Lanche da Escola", category: "DINHEIRO SAI" },
        { id: "i3", label: "Reserva de Emergência", category: "DINHEIRO GUARDADO" }
      ]
    }
  },

  // --- ROTA A (3A a 5A) ---
  "3A": {
    id: "3A",
    title: "Escolha Inteligente",
    phase: "despertar",
    route: "A",
    mechanic: "scenario_choice",
    difficulty: "easy",
    xpReward: 120,
    aprixMessage: "Pausar antes de gastar ajuda você a entender se precisa mesmo daquilo ou se é só impulso!",
    next: ["4A"],
    data: {
      scenario: "Você recebeu R$ 50 de presente de aniversário. O que faz?",
      options: [
        { id: "opt1", text: "Compro um jogo imediatamente na promoção", isCorrect: false, feedback: "Gasto por impulso!" },
        { id: "opt2", text: "Separo R$ 25 para minha meta e penso antes de gastar o resto", isCorrect: true, feedback: "Excelente equilíbrio!" }
      ]
    }
  },
  "4A": {
    id: "4A",
    title: "Caça ao Desperdício",
    phase: "despertar",
    route: "A",
    mechanic: "click_objects",
    difficulty: "medium",
    xpReward: 120,
    aprixMessage: "Viu só? Pequenos desperdícios repetidos todos os dias esvaziam o bolso sem a gente notar.",
    next: ["5A"],
    data: {
      instruction: "Procure na cena os hábitos que geram desperdício financeiro!",
      targetObjects: [
        { id: "assinatura", name: "Assinatura não usada" },
        { id: "luzes", name: "Luzes acesas sem ninguém" },
        { id: "comida", name: "Comida estragando" }
      ]
    }
  },
  "5A": {
    id: "5A",
    title: "O Cofrinho Cresce",
    phase: "despertar",
    route: "A",
    mechanic: "rhythm_timing",
    difficulty: "medium",
    xpReward: 150,
    aprixMessage: "Guardar dinheiro não é sobre dar passos gigantes de uma vez, mas sim manter o ritmo constante!",
    next: ["6"], // Convergência para a 6
    data: { requiredClicks: 5 }
  },

  // --- ROTA B (3B a 5B) ---
  "3B": {
    id: "3B",
    title: "Dinheiro ou Desejo?",
    phase: "despertar",
    route: "B",
    mechanic: "drag_drop_categories",
    difficulty: "easy",
    xpReward: 120,
    aprixMessage: "Saber priorizar o que é necessidade e o que pode esperar salva qualquer orçamento!",
    next: ["4B"],
    data: {
      categories: ["PRECISO AGORA", "POSSO PENSAR ANTES"],
      items: [
        { id: "b1", label: "Passagem de Ônibus", category: "PRECISO AGORA" },
        { id: "b2", label: "Skin Nova no Jogo", category: "POSSO PENSAR ANTES" }
      ]
    }
  },
  "4B": {
    id: "4B",
    title: "Não Caia Nessa!",
    phase: "despertar",
    route: "B",
    mechanic: "quick_timer",
    difficulty: "medium",
    xpReward: 120,
    aprixMessage: "Mandou bem! O desespero da 'promoção por tempo limitado' é o maior gatilho para compras erradas.",
    next: ["5B"],
    data: { timeLimitSec: 10 }
  },
  "5B": {
    id: "5B",
    title: "Detetive das Compras",
    phase: "despertar",
    route: "B",
    mechanic: "investigation",
    difficulty: "medium",
    xpReward: 150,
    aprixMessage: "Investigar preço, uso e necessidade transforma você em um consumidor blindado!",
    next: ["6"], // Convergência para a 6
    data: { cluesRequired: 3 }
  },

  // --- CONVERGÊNCIA (6 a 10) ---
  "6": {
    id: "6",
    title: "O Dinheiro Sumiu!",
    phase: "controle",
    route: null,
    mechanic: "investigation",
    difficulty: "medium",
    xpReward: 150,
    aprixMessage: "Opa! Seu dinheiro sumiu mais rápido que eu voando contra o vento. Mas agora você sabe rastrear os pequenos gastos!",
    next: ["7"]
  },
  "7": { id: "7", title: "Organiza essa Bagunça", phase: "controle", mechanic: "drag_drop_categories", xpReward: 150, next: ["8"] },
  "8": { id: "8", title: "Explosão do Orçamento", phase: "controle", mechanic: "rebalance_bars", xpReward: 160, next: ["9"] },
  "9": { id: "9", title: "Nota Fiscal Misteriosa", phase: "controle", mechanic: "investigation", xpReward: 160, next: ["10"] },
  "10": { id: "10", title: "Desafio dos R$100", phase: "controle", mechanic: "budget_allocation", xpReward: 200, next: ["11A", "11B", "11C"] }, // Bifurcação em 3 Rotas!

  // --- TRÊS CAMINHOS (11 a 14) ---
  "11A": { id: "11A", title: "Xadrez Financeiro", route: "A", mechanic: "turn_strategy", xpReward: 180, next: ["12A"] },
  "12A": { id: "12A", title: "Monte Seu Plano", route: "A", mechanic: "sequence_order", xpReward: 180, next: ["13A"] },
  "13A": { id: "13A", title: "Sinal Financeiro", route: "A", mechanic: "traffic_light", xpReward: 180, next: ["14A"] },
  "14A": { id: "14A", title: "Construa sua Meta", route: "A", mechanic: "goal_builder", xpReward: 200, next: ["15"] },

  "11B": { id: "11B", title: "Onde Está o Erro?", route: "B", mechanic: "find_error", xpReward: 180, next: ["12B"] },
  "12B": { id: "12B", title: "O Conselho do Aprix", route: "B", mechanic: "dialogue_choice", xpReward: 180, next: ["13B"] },
  "13B": { id: "13B", title: "Verdade ou Armadilha?", route: "B", mechanic: "quick_cards", xpReward: 180, next: ["14B"] },
  "14B": { id: "14B", title: "Memória do Dinheiro", route: "B", mechanic: "memory_game", xpReward: 200, next: ["15"] },

  "11C": { id: "11C", title: "Um Dia na Sua Vida", route: "C", mechanic: "narrative_sim", xpReward: 180, next: ["12C"] },
  "12C": { id: "12C", title: "Carrinho Perigoso", route: "C", mechanic: "cart_management", xpReward: 180, next: ["13C"] },
  "13C": { id: "13C", title: "Mensagem do Amigo", route: "C", mechanic: "chat_sim", xpReward: 180, next: ["14C"] },
  "14C": { id: "14C", title: "Decisão em 10 Segundos", route: "C", mechanic: "quick_timer", xpReward: 200, next: ["15"] },

  // --- INTERMEDIÁRIAS E CHEFÕES (15 a 50) ---
  "15": { id: "15", title: "A Ponte das Consequências", mechanic: "cause_effect", xpReward: 220, next: ["16"] },
  "16": { id: "16", title: "Efeito Borboleta Financeiro", mechanic: "visual_sequence", xpReward: 220, next: ["17"] },
  "17": { id: "17", title: "Pequeno Hoje, Grande Amanhã", mechanic: "timeline", xpReward: 220, next: ["18"] },
  "18": { id: "18", title: "Dados da Decisão", mechanic: "roulette", xpReward: 220, next: ["19"] },
  "19": { id: "19", title: "Sequência de Escolhas", mechanic: "combo_decisions", xpReward: 250, next: ["20"] },
  "20": { id: "20", title: "CHEFÃO: Labirinto Financeiro", mechanic: "boss_maze", xpReward: 500, next: ["21"] },

  // ... [21 a 49 continuam com a mesma estrutura estendida] ...

  "50": {
    id: "50",
    title: "O Primeiro Controle Real",
    phase: "topo",
    route: null,
    mechanic: "final_boss_simulation",
    difficulty: "hard",
    xpReward: 1000,
    aprixMessage: "Olha só até onde você chegou! No início, você estava começando a perceber suas escolhas. Agora consegue observar, pensar e planejar antes de decidir. E essa é só a primeira parte da sua jornada.",
    next: [],
    data: { stages: 6 }
  }
};

module.exports = { MISSIONS_DATABASE };