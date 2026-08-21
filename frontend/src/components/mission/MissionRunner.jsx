import React, { useRef } from 'react'
import * as DragDropEngineModule from './engines/DragDropEngine'
import * as Mission2FlowModule from './engines/Mission2Flow'
import * as Mission3InvestigationModule from './engines/Mission3Investigation'
import * as Mission4LeakHuntModule from './engines/Mission4LeakHunt'
import * as Mission5ChooseYourPathModule from './engines/Mission5ChooseYourPath'
import * as Mission6PayYourselfFirstModule from './engines/Mission6PayYourselfFirst'
import * as Mission7BalancedBudgetModule from './engines/Mission7BalancedBudget'
import * as Mission8PriorityRankingModule from './engines/Mission8PriorityRanking'
import * as Mission9DebtMazeModule from './engines/Mission9DebtMaze'
// 👉 NOVA MISSÃO — PASSO 1: importe o módulo da nova engine aqui, seguindo o
// mesmo padrão (import * as XModule from './engines/ArquivoDaMissao')
// Exemplo:
// import * as Mission4LeakHuntModule from './engines/Mission4LeakHunt'
 
// Resolve o componente aceitando tanto "export function X" quanto
// "export default function X" — não precisa mexer aqui ao adicionar
// uma nova missão, só segue o mesmo padrão abaixo pra ela.
const DragDropEngine = DragDropEngineModule.DragDropEngine || DragDropEngineModule.default
const Mission2Flow = Mission2FlowModule.Mission2Flow || Mission2FlowModule.default
const Mission3Investigation = Mission3InvestigationModule.Mission3Investigation || Mission3InvestigationModule.default
const Mission4LeakHunt = Mission4LeakHuntModule.Mission4LeakHunt || Mission4LeakHuntModule.default
const Mission5ChooseYourPath = Mission5ChooseYourPathModule.Mission5ChooseYourPath || Mission5ChooseYourPathModule.default
const Mission6PayYourselfFirst = Mission6PayYourselfFirstModule.Mission6PayYourselfFirst || Mission6PayYourselfFirstModule.default
const Mission7BalancedBudget = Mission7BalancedBudgetModule.Mission7BalancedBudget || Mission7BalancedBudgetModule.default
const Mission8PriorityRanking = Mission8PriorityRankingModule.Mission8PriorityRanking || Mission8PriorityRankingModule.default
const Mission9DebtMaze = Mission9DebtMazeModule.Mission9DebtMaze || Mission9DebtMazeModule.default
// 👉 NOVA MISSÃO — PASSO 2: resolva o componente aqui, mesma linha do padrão acima.
// Exemplo:
// const Mission4LeakHunt = Mission4LeakHuntModule.Mission4LeakHunt || Mission4LeakHuntModule.default
 
// IMPORTANTE — contrato de props que TODA engine de missão precisa seguir:
// - onComplete({ success: true, xpEarned: N }) só deve ser chamado em sucesso real
// - onError() deve ser chamado em tempo real, a cada erro individual
// - erro nunca revela resposta certa, nunca avança, só pisca vermelho e reseta
// - missões de 1 rodada única: xpEarned fixo em 10
// - missões de várias rodadas: xpEarned = soma de 1 XP por acerto (+ bônus de combo)
//
// onFinishMission deve ter a assinatura (completedId, resultData) e é chamado
// AQUI como onFinishMission(mId, resultData). No App.jsx, passe a função
// diretamente (ex: onFinishMission={handleFinishMission}) — NUNCA envolva
// em uma arrow function de 1 parâmetro, ou o resultData é descartado
// silenciosamente pelo JS e o XP real da missão se perde.
export function MissionRunner({ missionId, onFinishMission, onError, onClose }) {
  const mId = Number(missionId)
 
  // Evita que uma engine de missão dispare onComplete mais de uma vez
  // (ex: duplo clique) e acabe chamando onFinishMission repetidamente
  // para a mesma missão.
  const hasFinishedRef = useRef(false)
 
  const missionTitles = {
    1: 'ACORDA, FINANCEIRO!',
    2: 'O FLUXO DO DINHEIRO',
    3: 'O DINHEIRO SUMIU',
    4: 'CAÇA AO VAZAMENTO',
    5: 'ESCOLHA SEU CAMINHO',
    6: 'PAGUE-SE PRIMEIRO',
    7: 'ORÇAMENTO EM EQUILÍBRIO',
    8: 'PRIORIDADE MÁXIMA',
    9: 'O LABIRINTO DAS DÍVIDAS',

    // 👉 NOVA MISSÃO — PASSO 3: adicione o título aqui, ex:
    // 4: 'CAÇA AO VAZAMENTO',
  }
 
  const handleMissionComplete = (resultData) => {
    // Trava de segurança: só repassa a conclusão para o App se a missão
    // sinalizar explicitamente sucesso. Isso impede que um bug dentro de
    // qualquer engine conceda XP ou avance de fase em um fluxo de erro.
    if (!resultData || resultData.success !== true) {
      console.warn('[MissionRunner] onComplete chamado sem success === true, ignorando.', {
        missionId: mId,
        resultData
      })
      return
    }
 
    // Evita disparo duplicado (ex: clique duplo no botão de conclusão)
    if (hasFinishedRef.current) return
    hasFinishedRef.current = true
 
    if (onFinishMission) {
      onFinishMission(mId, resultData)
    }
  }
 
  const renderMissionContent = () => {
    switch (mId) {
      case 1:
        return <DragDropEngine onComplete={handleMissionComplete} onError={onError} />
      case 2:
        return <Mission2Flow onComplete={handleMissionComplete} onError={onError} />
      case 3:
        return <Mission3Investigation onComplete={handleMissionComplete} onError={onError} />
      case 4:
        return <Mission4LeakHunt onComplete={handleMissionComplete} onError={onError} /> 
      case 5:
        return <Mission5ChooseYourPath onComplete={handleMissionComplete} onError={onError} />   
      case 6:
        return <Mission6PayYourselfFirst onComplete={handleMissionComplete} onError={onError} />
      case 7:
        return <Mission7BalancedBudget onComplete={handleMissionComplete} onError={onError} />
      case 8:
         return <Mission8PriorityRanking onComplete={handleMissionComplete} onError={onError} />
      case 9:
         return <Mission9DebtMaze onComplete={handleMissionComplete} onError={onError} />
        // 👉 NOVA MISSÃO — PASSO 4 (último passo): adicione o case aqui, ex:
      // case 4:
      //   return <Mission4LeakHunt onComplete={handleMissionComplete} onError={onError} />
      default:
        return (
          <div style={{ padding: '2rem', textAlign: 'center', color: '#94a3b8' }}>
            <p>Conteúdo da missão {mId} em desenvolvimento.</p>
          </div>
        )
    }
  }
 
  return (
    <div style={overlayStyle}>
      <div style={modalStyle}>
        <button onClick={onClose} style={closeBtnStyle}>✕</button>
 
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginBottom: '1rem' }}>
          <span style={{ color: '#38bdf8', fontWeight: 'bold', fontSize: '0.85rem' }}>
            MISSÃO {mId} — {missionTitles[mId] || `MISSÃO ${mId}`}
          </span>
        </div>
 
        {renderMissionContent()}
      </div>
    </div>
  )
}
 
const overlayStyle = { position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', backgroundColor: 'rgba(0,0,0,0.85)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '1rem' }
const modalStyle = { backgroundColor: '#0f172a', borderRadius: '16px', padding: '1.5rem', maxWidth: '520px', width: '100%', border: '1px solid #1e293b', position: 'relative', color: '#fff' }
const closeBtnStyle = { position: 'absolute', top: '1rem', right: '1rem', background: 'none', border: 'none', color: '#94a3b8', fontSize: '1.5rem', cursor: 'pointer' }
 