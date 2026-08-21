// src/data/treeGraph.js

export const TREE_NODES = {
  // --- INÍCIO LINEAR ---
  1: { id: 1, label: 'Missão 1', type: 'single', nextNodes: [2] },
  2: { id: 2, label: 'Missão 2', type: 'bifurcation', nextNodes: ['3A', '3B'] },

  // --- BIFURCAÇÃO 1 (2 ROTAS: A e B) ---
  '3A': { id: '3A', label: 'Missão 3A', type: 'branch', branchGroup: 'A', nextNodes: ['4A'] },
  '3B': { id: '3B', label: 'Missão 3B', type: 'branch', branchGroup: 'B', nextNodes: ['4B'] },

  '4A': { id: '4A', label: 'Missão 4A', type: 'branch', branchGroup: 'A', nextNodes: ['5A'] },
  '4B': { id: '4B', label: 'Missão 4B', type: 'branch', branchGroup: 'B', nextNodes: ['5B'] },

  '5A': { id: '5A', label: 'Missão 5A', type: 'branch', branchGroup: 'A', nextNodes: [6] },
  '5B': { id: '5B', label: 'Missão 5B', type: 'branch', branchGroup: 'B', nextNodes: [6] },

  // --- JUNÇÃO 1 E FLUXO LINEAR ---
  6: { id: 6, label: 'Missão 6', type: 'junction', nextNodes: [7] },
  7: { id: 7, label: 'Missão 7', type: 'single', nextNodes: [8] },
  8: { id: 8, label: 'Missão 8', type: 'single', nextNodes: [9] },
  9: { id: 9, label: 'Missão 9', type: 'single', nextNodes: [10] },
  10: { id: 10, label: 'Missão 10', type: 'bifurcation', nextNodes: ['11A', '11B', '11C'] },

  // --- BIFURCAÇÃO 2 (3 ROTAS: A, B e C) ---
  '11A': { id: '11A', label: 'Missão 11A', type: 'branch', branchGroup: 'A', nextNodes: ['12A'] },
  '11B': { id: '11B', label: 'Missão 11B', type: 'branch', branchGroup: 'B', nextNodes: ['12B'] },
  '11C': { id: '11C', label: 'Missão 11C', type: 'branch', branchGroup: 'C', nextNodes: ['12C'] },

  '12A': { id: '12A', label: 'Missão 12A', type: 'branch', branchGroup: 'A', nextNodes: ['13A'] },
  '12B': { id: '12B', label: 'Missão 12B', type: 'branch', branchGroup: 'B', nextNodes: ['13B'] },
  '12C': { id: '12C', label: 'Missão 12C', type: 'branch', branchGroup: 'C', nextNodes: ['13C'] },

  '13A': { id: '13A', label: 'Missão 13A', type: 'branch', branchGroup: 'A', nextNodes: [14] },
  '13B': { id: '13B', label: 'Missão 13B', type: 'branch', branchGroup: 'B', nextNodes: [14] },
  '13C': { id: '13C', label: 'Missão 13C', type: 'branch', branchGroup: 'C', nextNodes: [14] },

  // --- JUNÇÃO 2 ATÉ O TOPO ---
  14: { id: 14, label: 'Missão 14', type: 'junction', nextNodes: [15] },
  
  // (As demais missões de 15 a 49 seguem o padrão até o topo)
  15: { id: 15, label: 'Missão 15', type: 'single', nextNodes: [50] },
  50: { id: 50, label: 'Missão 50 (Topo da Árvore)', type: 'topo', nextNodes: [] }
};

// Organização em Camadas (Bottom-Up) para exibição do Mapa que sobe
export const TREE_LAYERS = [
  { level: 1, nodes: [1] },
  { level: 2, nodes: [2] },
  { level: 3, nodes: ['3A', '3B'] },
  { level: 4, nodes: ['4A', '4B'] },
  { level: 5, nodes: ['5A', '5B'] },
  { level: 6, nodes: [6] },
  { level: 7, nodes: [7] },
  { level: 8, nodes: [8] },
  { level: 9, nodes: [9] },
  { level: 10, nodes: [10] },
  { level: 11, nodes: ['11A', '11B', '11C'] },
  { level: 12, nodes: ['12A', '12B', '12C'] },
  { level: 13, nodes: ['13A', '13B', '13C'] },
  { level: 14, nodes: [14] },
  { level: 15, nodes: [15] },
  { level: 50, nodes: [50] }
];