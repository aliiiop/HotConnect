import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { SCENES } from '../data/scenes'
import { BOSSES } from '../data/bosses'
import { MINI_GAMES } from '../data/minigames'
import {
  clearGameProgress,
  createFlags,
  loadGameProgress,
  normalizeFlags,
  saveGameProgress,
} from '../utils/gameUtils'
import StoryScene from '../components/StoryScene'
import BattleScene from '../components/BattleScene'
import MiniGameScene from '../components/MiniGameScene'
import './GamePage.css'

function getSceneTheme(scene) {
  if (scene.theme) {
    return scene.theme
  }

  if (scene.kind === 'battle') {
    return BOSSES[scene.boss]?.theme || `battle-${scene.boss}`
  }

  if (scene.kind === 'minigame') {
    return MINI_GAMES[scene.mini]?.theme || `mini-${scene.mini}`
  }

  return 'home'
}

export default function GamePage() {
  const { user, logout, loading: authLoading } = useAuth()
  const navigate = useNavigate()
  const [currentScene, setCurrentScene] = useState('intro')
  const [flags, setFlags] = useState(createFlags())
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (authLoading) {
      return
    }

    if (!user) {
      navigate('/login', { replace: true })
      return
    }

    // Загружаем прогресс игры
    const savedProgress = loadGameProgress(user.id)
    if (savedProgress) {
      setCurrentScene(savedProgress.currentScene || 'intro')
      setFlags(normalizeFlags(savedProgress.flags))
    } else {
      setFlags(createFlags())
      setCurrentScene('intro')
    }
    setLoading(false)
  }, [authLoading, user, navigate])

  useEffect(() => {
    // Сохраняем прогресс при изменении
    if (user && !authLoading && !loading) {
      saveGameProgress(user.id, {
        currentScene,
        flags,
        lastSaved: new Date().toISOString()
      })
    }
  }, [currentScene, flags, user, authLoading, loading])

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const handleRestart = () => {
    if (user) {
      clearGameProgress(user.id)
    }
    setFlags(createFlags())
    goToScene('intro')
  }

  const goToScene = (sceneId) => {
    setCurrentScene(sceneId)
  }

  const updateFlags = (newFlags) => {
    setFlags(prev => ({ ...prev, ...newFlags }))
  }

  if (authLoading || loading) {
    return (
      <div className="game-page">
        <div className="game-loading">Загрузка...</div>
      </div>
    )
  }

  const scene = SCENES[currentScene]

  if (!scene) {
    return (
      <div className="game-page">
        <div className="game-error">
          <p>Сцена не найдена: {currentScene}</p>
          <button onClick={() => goToScene('intro')}>Начать заново</button>
        </div>
      </div>
    )
  }

  return (
    <div className="game-page" data-theme={getSceneTheme(scene)}>
      <div className="game-header">
        <div className="game-user-info">
          <span className="game-username">{user?.username}</span>
          <div className="game-header-actions">
            <button className="game-secondary-btn" onClick={handleRestart}>
              Заново
            </button>
            <button className="game-logout-btn" onClick={handleLogout}>
              Выйти
            </button>
          </div>
        </div>
      </div>

      <main className="game-content">
        {scene.kind === 'story' && (
          <StoryScene
            scene={scene}
            flags={flags}
            onChoice={goToScene}
            onRestart={() => {
              setFlags(createFlags())
              goToScene('intro')
            }}
          />
        )}

        {scene.kind === 'battle' && (
          <BattleScene
            sceneId={currentScene}
            bossId={scene.boss}
            flags={flags}
            onWin={goToScene}
            onLose={() => {
              setFlags(createFlags())
              goToScene('intro')
            }}
            updateFlags={updateFlags}
          />
        )}

        {scene.kind === 'minigame' && (
          <MiniGameScene
            sceneId={currentScene}
            gameId={scene.mini}
            onComplete={goToScene}
            updateFlags={updateFlags}
          />
        )}
      </main>
    </div>
  )
}
