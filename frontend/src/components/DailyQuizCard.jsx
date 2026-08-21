import React, { useState, useEffect } from 'react';
import { DAILY_QUIZZES } from '../data/dailyQuizzes';
import { completeDailyQuiz } from '../services/api';

export function DailyQuizCard({ onScoreUpdate }) {
  const [isOpen, setIsOpen] = useState(false);
  const [completedToday, setCompletedToday] = useState(false);
  const [todayQuiz, setTodayQuiz] = useState(null);
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [feedback, setFeedback] = useState(null);

  const getTodayDateString = () => {
    const today = new Date();
    return `${today.getFullYear()}-${today.getMonth() + 1}-${today.getDate()}`;
  };

  useEffect(() => {
    const todayStr = getTodayDateString();
    const lastCompleted = localStorage.getItem('aprix_daily_quiz_completed_date');

    if (lastCompleted === todayStr) {
      setCompletedToday(true);
    }

    // Algoritmo de sorteio diário determinístico (baseado na data atual)
    const year = new Date().getFullYear();
    const month = new Date().getMonth() + 1;
    const day = new Date().getDate();
    const seed = year * 10000 + month * 100 + day;
    const quizIndex = seed % DAILY_QUIZZES.length;

    setTodayQuiz(DAILY_QUIZZES[quizIndex]);
  }, []);

  const handleConfirmAnswer = async () => {
    if (selectedIndex === null || !todayQuiz || completedToday) return;

    if (selectedIndex === todayQuiz.correctAnswer) {
      const res = await completeDailyQuiz();
      
      const todayStr = getTodayDateString();
      localStorage.setItem('aprix_daily_quiz_completed_date', todayStr);
      setCompletedToday(true);

      setFeedback({ type: 'success', text: '✨ Resposta Correta! +10 XP creditados!' });

      if (onScoreUpdate && res && res.playerState) {
        onScoreUpdate(res.playerState);
      }
    } else {
      setFeedback({ type: 'error', text: '❌ Resposta incorreta! Estude o conceito e tente novamente amanhã.' });
    }
  };

  return (
    <div className="daily-quiz-card" style={{ border: '1px solid #1e293b', padding: '16px', borderRadius: '12px', background: '#0b1120', color: '#fff' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <span>🧠</span>
        <h3 style={{ margin: 0, color: '#facc15' }}>Quiz Financeiro Diário</h3>
      </div>
      <p style={{ fontSize: '0.9rem', color: '#94a3b8', margin: '8px 0 12px 0' }}>
        Teste seus conhecimentos práticos sobre finanças e ganhe pontos adicionais para subir no Ranking.
      </p>

      {!isOpen ? (
        <button 
          onClick={() => setIsOpen(true)}
          disabled={completedToday}
          style={{
            width: '100%',
            padding: '10px',
            borderRadius: '8px',
            border: completedToday ? '1px solid #334155' : '1px solid #38bdf8',
            background: completedToday ? '#1e293b' : 'transparent',
            color: completedToday ? '#64748b' : '#38bdf8',
            fontWeight: 'bold',
            cursor: completedToday ? 'not-allowed' : 'pointer'
          }}
        >
          {completedToday ? 'Quiz de Hoje Concluído! ✅ (Volte amanhã)' : 'Iniciar Quiz Expresso (+10 XP)'}
        </button>
      ) : (
        <div style={{ marginTop: '12px', background: '#0f172a', padding: '12px', borderRadius: '8px' }}>
          {todayQuiz && (
            <>
              <p style={{ fontWeight: 'bold', fontSize: '0.95rem', marginBottom: '12px' }}>
                {todayQuiz.question}
              </p>

              {todayQuiz.options.map((option, idx) => (
                <button
                  key={idx}
                  disabled={feedback !== null}
                  onClick={() => setSelectedIndex(idx)}
                  style={{
                    display: 'block',
                    width: '100%',
                    margin: '6px 0',
                    padding: '10px',
                    borderRadius: '6px',
                    border: selectedIndex === idx ? '2px solid #38bdf8' : '1px solid #334155',
                    background: selectedIndex === idx ? '#1e293b' : '#020617',
                    color: '#fff',
                    textAlign: 'left',
                    cursor: feedback !== null ? 'default' : 'pointer'
                  }}
                >
                  {String.fromCharCode(65 + idx)}) {option}
                </button>
              ))}

              {feedback && (
                <p style={{
                  fontSize: '0.9rem',
                  marginTop: '10px',
                  fontWeight: 'bold',
                  color: feedback.type === 'success' ? '#4ade80' : '#f87171'
                }}>
                  {feedback.text}
                </p>
              )}

              <div style={{ display: 'flex', gap: '8px', marginTop: '12px' }}>
                {!completedToday && !feedback && (
                  <button 
                    onClick={handleConfirmAnswer}
                    disabled={selectedIndex === null}
                    style={{
                      flex: 1,
                      padding: '8px',
                      background: selectedIndex !== null ? '#22c55e' : '#334155',
                      border: 'none',
                      borderRadius: '6px',
                      color: '#fff',
                      fontWeight: 'bold',
                      cursor: selectedIndex !== null ? 'pointer' : 'not-allowed'
                    }}
                  >
                    Confirmar Resposta
                  </button>
                )}

                <button 
                  onClick={() => setIsOpen(false)} 
                  style={{
                    flex: feedback ? 1 : 0.4,
                    padding: '8px',
                    background: '#334155',
                    border: 'none',
                    borderRadius: '6px',
                    color: '#fff',
                    cursor: 'pointer'
                  }}
                >
                  Fechar
                </button>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}