import { useState } from 'react'

export function ProfileSetup({ onComplete }) {
  const [name, setName] = useState('')
  const [gender, setGender] = useState('boy') // 'boy' ou 'girl'
  const [skinColor, setSkinColor] = useState('f8d5c4')
  const [top, setTop] = useState('shortFlat')
  const [eyes, setEyes] = useState('happy')
  const [accessories, setAccessories] = useState('none')

  // --- OPÇÕES DE PELE ---
  const skinOptions = [
    { label: 'Clara', value: 'f8d5c4' },
    { label: 'Morena Clara', value: 'edb98a' },
    { label: 'Morena', value: 'd08b5b' },
    { label: 'Parda', value: 'ae5d29' },
    { label: 'Negra', value: '614335' }
  ]

  // --- OPÇÕES DE CABELO POR GÊNERO (VALORES OFICIAIS DICEBEAR AVATAAARS) ---
  const hairOptionsByGender = {
    boy: [
      { label: 'Cabelo Curto', value: 'shortFlat' },
      { label: 'Topete / Estiloso', value: 'shortSides' },
      { label: 'Cabelo Cacheado', value: 'shortCurly' },
      { label: 'Chapéu / Boné', value: 'hat' },
      { label: 'Tapa-Olho', value: 'eyepatch' }
    ],
    girl: [
      { label: 'Cabelo Longo', value: 'longStraight' },
      { label: 'Cabelo Cacheado', value: 'curly' },
      { label: 'Chanel / Bob', value: 'bob' },
      { label: 'Cabelo Ondulado', value: 'curvy' },
      { label: 'Chapéu / Boné', value: 'hat' }
    ]
  }

  // --- VALORES CORRIGIDOS DOS OLHOS ---
  const eyesOptions = [
    { label: 'Feliz', value: 'happy' },
    { label: 'Piscando', value: 'wink' },
    { label: 'Surpreso', value: 'surprised' },
    { label: 'Sério / Apertado', value: 'squint' },
    { label: 'Padrão', value: 'default' }
  ]

  const accessoriesOptions = [
    { label: 'Nenhum', value: 'none' },
    { label: 'Óculos Mágico', value: 'kurt' },
    { label: 'Óculos Escuros', value: 'sunglasses' },
    { label: 'Óculos Redondo', value: 'round' }
  ]

  // Handler para troca de gênero ajustando o primeiro cabelo padrão do gênero selecionado
  const handleGenderChange = (newGender) => {
    setGender(newGender)
    setTop(hairOptionsByGender[newGender][0].value)
  }

  // Monta a URL válida do DiceBear (Corrigido o parâmetro eyes=)
  const facialHairProb = gender === 'girl' ? 0 : 20
  const avatarUrl = `https://api.dicebear.com/7.x/avataaars/svg?skinColor=${skinColor}&top=${top}&eyes=${eyes}&facialHairProbability=${facialHairProb}${
    accessories !== 'none' ? `&accessories=${accessories}&accessoriesProbability=100` : '&accessoriesProbability=0'
  }`

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!name.trim()) {
      alert('Por favor, digite seu nome ou apelido!')
      return
    }

    const profileData = {
      name: name.trim(),
      gender,
      avatarUrl
    }

    localStorage.setItem('aprix_user_profile', JSON.stringify(profileData))
    if (onComplete) onComplete(profileData)
  }

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(6, 9, 19, 0.95)',
      zIndex: 9999,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '1.5rem',
      overflowY: 'auto'
    }}>
      <div style={{
        width: '100%',
        maxWidth: '420px',
        backgroundColor: '#0d1527',
        border: '1px solid #1e293b',
        borderRadius: '20px',
        padding: '1.5rem',
        boxShadow: '0 10px 25px rgba(0,0,0,0.5)',
        textAlign: 'center'
      }}>
        <h2 style={{ color: '#38bdf8', marginTop: 0, marginBottom: '0.5rem' }}>Crie seu Perfil</h2>
        <p style={{ color: '#94a3b8', fontSize: '0.85rem', marginBottom: '1.2rem' }}>
          Personalize seu avatar para iniciar a jornada!
        </p>

        {/* PRÉ-VISUALIZAÇÃO DO AVATAR */}
        <div style={{
          width: '100px',
          height: '100px',
          borderRadius: '50%',
          margin: '0 auto 1.2rem auto',
          border: '3px solid #38bdf8',
          boxShadow: '0 0 15px rgba(56, 189, 248, 0.4)',
          overflow: 'hidden',
          backgroundColor: '#1e293b'
        }}>
          <img 
            src={avatarUrl} 
            alt="Avatar do jogador" 
            style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
          />
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem', textAlign: 'left' }}>
          
          {/* NOME */}
          <div>
            <label style={{ display: 'block', color: '#cbd5e1', fontSize: '0.8rem', marginBottom: '4px', fontWeight: 'bold' }}>
              Nome ou Apelido:
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Digite seu nome ou apelido..."
              style={{
                width: '100%',
                padding: '0.75rem',
                backgroundColor: '#1e293b',
                border: '1px solid #334155',
                borderRadius: '10px',
                color: '#fff',
                fontSize: '0.9rem',
                outline: 'none',
                boxSizing: 'border-box'
              }}
            />
          </div>

          {/* SEXO / PERSONAGEM */}
          <div>
            <label style={{ display: 'block', color: '#cbd5e1', fontSize: '0.8rem', marginBottom: '6px', fontWeight: 'bold' }}>
              Sexo / Personagem:
            </label>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '6px' }}>
              <button
                type="button"
                onClick={() => handleGenderChange('boy')}
                style={{
                  padding: '0.5rem',
                  backgroundColor: gender === 'boy' ? '#0284c7' : '#1e293b',
                  color: gender === 'boy' ? '#fff' : '#94a3b8',
                  border: gender === 'boy' ? '1px solid #38bdf8' : '1px solid #334155',
                  borderRadius: '8px',
                  fontSize: '0.8rem',
                  fontWeight: 'bold',
                  cursor: 'pointer'
                }}
              >
                👦 Garoto
              </button>
              <button
                type="button"
                onClick={() => handleGenderChange('girl')}
                style={{
                  padding: '0.5rem',
                  backgroundColor: gender === 'girl' ? '#0284c7' : '#1e293b',
                  color: gender === 'girl' ? '#fff' : '#94a3b8',
                  border: gender === 'girl' ? '1px solid #38bdf8' : '1px solid #334155',
                  borderRadius: '8px',
                  fontSize: '0.8rem',
                  fontWeight: 'bold',
                  cursor: 'pointer'
                }}
              >
                👧 Garota
              </button>
            </div>
          </div>

          {/* TOM DE PELE */}
          <div>
            <label style={{ display: 'block', color: '#cbd5e1', fontSize: '0.8rem', marginBottom: '6px', fontWeight: 'bold' }}>
              Tom de Pele:
            </label>
            <div style={{ display: 'flex', gap: '8px' }}>
              {skinOptions.map((opt) => (
                <button
                  type="button"
                  key={opt.value}
                  onClick={() => setSkinColor(opt.value)}
                  style={{
                    flex: 1,
                    height: '32px',
                    backgroundColor: `#${opt.value}`,
                    border: skinColor === opt.value ? '3px solid #38bdf8' : '1px solid #334155',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    transform: skinColor === opt.value ? 'scale(1.05)' : 'scale(1)',
                    transition: 'all 0.15s ease'
                  }}
                  title={opt.label}
                />
              ))}
            </div>
          </div>

          {/* CABELO / CABEÇA */}
          <div>
            <label style={{ display: 'block', color: '#cbd5e1', fontSize: '0.8rem', marginBottom: '6px', fontWeight: 'bold' }}>
              Cabelo / Cabeça:
            </label>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '6px' }}>
              {hairOptionsByGender[gender].map((opt) => (
                <button
                  type="button"
                  key={opt.value}
                  onClick={() => setTop(opt.value)}
                  style={{
                    padding: '0.5rem',
                    backgroundColor: top === opt.value ? '#0284c7' : '#1e293b',
                    color: top === opt.value ? '#fff' : '#94a3b8',
                    border: top === opt.value ? '1px solid #38bdf8' : '1px solid #334155',
                    borderRadius: '8px',
                    fontSize: '0.75rem',
                    fontWeight: 'bold',
                    cursor: 'pointer',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis'
                  }}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* OLHOS */}
          <div>
            <label style={{ display: 'block', color: '#cbd5e1', fontSize: '0.8rem', marginBottom: '6px', fontWeight: 'bold' }}>
              Olhos:
            </label>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '6px' }}>
              {eyesOptions.map((opt) => (
                <button
                  type="button"
                  key={opt.value}
                  onClick={() => setEyes(opt.value)}
                  style={{
                    padding: '0.5rem',
                    backgroundColor: eyes === opt.value ? '#0284c7' : '#1e293b',
                    color: eyes === opt.value ? '#fff' : '#94a3b8',
                    border: eyes === opt.value ? '1px solid #38bdf8' : '1px solid #334155',
                    borderRadius: '8px',
                    fontSize: '0.75rem',
                    fontWeight: 'bold',
                    cursor: 'pointer'
                  }}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* ACESSÓRIOS */}
          <div>
            <label style={{ display: 'block', color: '#cbd5e1', fontSize: '0.8rem', marginBottom: '6px', fontWeight: 'bold' }}>
              Acessórios:
            </label>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '6px' }}>
              {accessoriesOptions.map((opt) => (
                <button
                  type="button"
                  key={opt.value}
                  onClick={() => setAccessories(opt.value)}
                  style={{
                    padding: '0.5rem',
                    backgroundColor: accessories === opt.value ? '#0284c7' : '#1e293b',
                    color: accessories === opt.value ? '#fff' : '#94a3b8',
                    border: accessories === opt.value ? '1px solid #38bdf8' : '1px solid #334155',
                    borderRadius: '8px',
                    fontSize: '0.75rem',
                    fontWeight: 'bold',
                    cursor: 'pointer'
                  }}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          <button
            type="submit"
            style={{
              marginTop: '0.8rem',
              padding: '0.85rem',
              backgroundColor: '#22c55e',
              color: '#060913',
              border: 'none',
              borderRadius: '12px',
              fontWeight: 'bold',
              fontSize: '0.95rem',
              cursor: 'pointer',
              boxShadow: '0 4px 12px rgba(34, 197, 94, 0.3)'
            }}
          >
            Confirmar Perfil 🚀
          </button>
        </form>
      </div>
    </div>
  )
}