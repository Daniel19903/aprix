import { useState } from 'react'

export function HomeView({ player, currentMission, onPlayMission }) {
  // Cole aqui a URL gerada na implantação do Google Apps Script
 const GOOGLE_SHEET_URL = 'https://script.google.com/macros/s/AKfycbxMkx2gqSaTckWf6CTfRP9yL0M5ImhyhljD4vYEYYxpBEkeOVOgwOERI0UlyA3bTsIB/exec'

  const [rating, setRating] = useState(5)
  const [liked, setLiked] = useState('Sim')
  const [favoriteFeature, setFavoriteFeature] = useState('Missões')
  const [wouldUseApp, setWouldUseApp] = useState('Sim')
  const [comment, setComment] = useState('')
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)

  const handleSendFeedback = async (e) => {
    e.preventDefault()
    setLoading(true)

    const payload = {
      playerName: player?.name || 'Jogador',
      rating,
      liked,
      favoriteFeature,
      wouldUseApp,
      comment
    }

    try {
      await fetch(GOOGLE_SHEET_URL, {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })
      setSent(true)
    } catch (err) {
      console.error('Erro ao enviar feedback:', err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      gap: '1.2rem',
      padding: '1rem',
      maxWidth: '420px',
      margin: '0 auto',
      color: '#fff',
      paddingBottom: '5rem'
    }}>

      {/* CARD DE MISSÃO ATUAL */}
      <div style={{
        backgroundColor: '#0d1527',
        border: '2px solid #38bdf8',
        borderRadius: '20px',
        padding: '1.25rem',
        textAlign: 'center',
        boxShadow: '0 0 20px rgba(56, 189, 248, 0.2)'
      }}>
        <div style={{ fontSize: '2.2rem', marginBottom: '0.3rem' }}>⚔️</div>
        <span style={{ color: '#38bdf8', fontSize: '0.75rem', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '1px' }}>
          Sua Missão Atual
        </span>
        
        <h3 style={{ margin: '0.4rem 0 1rem 0', color: '#f8fafc', fontSize: '1.1rem' }}>
          {currentMission ? currentMission.title : 'Todas as missões concluídas!'}
        </h3>

        {currentMission && (
          <button
            onClick={() => onPlayMission(currentMission)}
            style={{
              width: '100%',
              padding: '0.85rem',
              backgroundColor: '#22c55e',
              color: '#060913',
              border: 'none',
              borderRadius: '12px',
              fontWeight: '900',
              fontSize: '1rem',
              cursor: 'pointer',
              boxShadow: '0 4px 15px rgba(34, 197, 94, 0.4)',
              transition: 'transform 0.1s ease'
            }}
          >
            JOGAR AGORA 🚀
          </button>
        )}
      </div>

      {/* FEEDBACK DO JOGO */}
      <div style={{
        backgroundColor: '#0d1527',
        border: '1px solid #1e293b',
        borderRadius: '20px',
        padding: '1.25rem',
        boxShadow: '0 8px 20px rgba(0,0,0,0.4)'
      }}>
        <h3 style={{ margin: '0 0 0.2rem 0', color: '#38bdf8', fontSize: '1rem' }}>
          O que está achando do jogo? 💬
        </h3>
        <p style={{ margin: '0 0 1rem 0', color: '#94a3b8', fontSize: '0.8rem' }}>
          Responda rápido para nos ajudar a melhorar!
        </p>

        {sent ? (
          <div style={{
            padding: '1rem',
            backgroundColor: '#064e3b',
            border: '1px solid #059669',
            borderRadius: '12px',
            textAlign: 'center',
            color: '#34d399',
            fontWeight: 'bold',
            fontSize: '0.9rem'
          }}>
            Obrigado pelo seu feedback! 🌟
          </div>
        ) : (
          <form onSubmit={handleSendFeedback} style={{ display: 'flex', flexDirection: 'column', gap: '0.9rem' }}>
            
            {/* 1. NOTA / ESTRELAS */}
            <div>
              <label style={{ display: 'block', color: '#cbd5e1', fontSize: '0.8rem', marginBottom: '4px', fontWeight: 'bold' }}>
                Sua nota para o Aprix:
              </label>
              <div style={{ display: 'flex', justifyContent: 'center', gap: '8px' }}>
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    type="button"
                    key={star}
                    onClick={() => setRating(star)}
                    style={{
                      background: 'none',
                      border: 'none',
                      fontSize: '1.5rem',
                      cursor: 'pointer',
                      opacity: star <= rating ? 1 : 0.25,
                      transform: star <= rating ? 'scale(1.1)' : 'scale(1)',
                      transition: 'all 0.1s ease'
                    }}
                  >
                    ⭐
                  </button>
                ))}
              </div>
            </div>

            {/* 2. GOSTOU DO JOGO? */}
            <div>
              <label style={{ display: 'block', color: '#cbd5e1', fontSize: '0.8rem', marginBottom: '4px', fontWeight: 'bold' }}>
                Está gostando do jogo?
              </label>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '6px' }}>
                {['Muito!', 'Mais ou menos', 'Não'].map((opt) => (
                  <button
                    type="button"
                    key={opt}
                    onClick={() => setLiked(opt)}
                    style={{
                      padding: '0.5rem 0.2rem',
                      backgroundColor: liked === opt ? '#0284c7' : '#1e293b',
                      color: liked === opt ? '#fff' : '#94a3b8',
                      border: liked === opt ? '1px solid #38bdf8' : '1px solid #334155',
                      borderRadius: '8px',
                      fontSize: '0.75rem',
                      fontWeight: 'bold',
                      cursor: 'pointer'
                    }}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </div>

            {/* 3. DO QUE MAIS GOSTOU? */}
            <div>
              <label style={{ display: 'block', color: '#cbd5e1', fontSize: '0.8rem', marginBottom: '4px', fontWeight: 'bold' }}>
                Do que você mais gostou?
              </label>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '6px' }}>
                {['Missões e Desafios', 'Criar Avatar', 'Visual / Design', 'Aprender Finanças'].map((opt) => (
                  <button
                    type="button"
                    key={opt}
                    onClick={() => setFavoriteFeature(opt)}
                    style={{
                      padding: '0.5rem',
                      backgroundColor: favoriteFeature === opt ? '#0284c7' : '#1e293b',
                      color: favoriteFeature === opt ? '#fff' : '#94a3b8',
                      border: favoriteFeature === opt ? '1px solid #38bdf8' : '1px solid #334155',
                      borderRadius: '8px',
                      fontSize: '0.75rem',
                      fontWeight: 'bold',
                      cursor: 'pointer'
                    }}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </div>

            {/* 4. TER UM APP AJUDARIA? */}
            <div>
              <label style={{ display: 'block', color: '#cbd5e1', fontSize: '0.8rem', marginBottom: '4px', fontWeight: 'bold' }}>
                Um aplicativo no celular te ajudaria?
              </label>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '6px' }}>
                {['Sim, ajudaria muito!', 'Tanto faz'].map((opt) => (
                  <button
                    type="button"
                    key={opt}
                    onClick={() => setWouldUseApp(opt)}
                    style={{
                      padding: '0.5rem',
                      backgroundColor: wouldUseApp === opt ? '#0284c7' : '#1e293b',
                      color: wouldUseApp === opt ? '#fff' : '#94a3b8',
                      border: wouldUseApp === opt ? '1px solid #38bdf8' : '1px solid #334155',
                      borderRadius: '8px',
                      fontSize: '0.75rem',
                      fontWeight: 'bold',
                      cursor: 'pointer'
                    }}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </div>

            {/* 5. MENSAGEM CURTA OPCIONAL */}
            <div>
              <label style={{ display: 'block', color: '#cbd5e1', fontSize: '0.8rem', marginBottom: '4px', fontWeight: 'bold' }}>
                Quer deixar um recado? (Opcional)
              </label>
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Escreva algo curto aqui..."
                rows={2}
                maxLength={150}
                style={{
                  width: '100%',
                  padding: '0.6rem',
                  backgroundColor: '#1e293b',
                  border: '1px solid #334155',
                  borderRadius: '8px',
                  color: '#fff',
                  fontSize: '0.8rem',
                  resize: 'none',
                  outline: 'none',
                  boxSizing: 'border-box'
                }}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              style={{
                marginTop: '0.4rem',
                padding: '0.75rem',
                backgroundColor: loading ? '#334155' : '#38bdf8',
                color: '#060913',
                border: 'none',
                borderRadius: '10px',
                fontWeight: 'bold',
                fontSize: '0.85rem',
                cursor: loading ? 'not-allowed' : 'pointer'
              }}
            >
              {loading ? 'Enviando...' : 'Enviar Opinião 📤'}
            </button>
          </form>
        )}
      </div>

    </div>
  )
}