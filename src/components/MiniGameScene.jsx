import { useCallback, useEffect, useRef, useState } from 'react'
import { MINI_GAMES } from '../data/minigames'
import { rand } from '../utils/gameUtils'
import './MiniGameScene.css'

function createCoffeeRound(previous = null) {
  const round = previous ? previous.round + 1 : 0

  return {
    round,
    hits: previous?.hits || 0,
    misses: previous?.misses || 0,
    needle: 0,
    zoneStart: 0.18 + Math.random() * 0.52,
    zoneWidth: Math.max(0.13, 0.22 - round * 0.018),
    speed: 1.18 + round * 0.16,
    startedAt: performance.now(),
    feedback: previous?.feedback || '',
  }
}

export default function MiniGameScene({ sceneId, gameId, onComplete, updateFlags }) {
  const game = MINI_GAMES[gameId || sceneId.replace('mini-', '')]
  const [started, setStarted] = useState(false)
  const [score, setScore] = useState(0)
  const [timeLeft, setTimeLeft] = useState(0)
  const [papers, setPapers] = useState([])
  const [coffeeState, setCoffeeState] = useState(null)

  const timerRef = useRef(null)
  const spawnRef = useRef(null)
  const animationRef = useRef(null)
  const finishedRef = useRef(false)
  const scoreRef = useRef(0)
  const coffeeRef = useRef(null)
  const hiddenAtRef = useRef(null)
  const onCompleteRef = useRef(onComplete)
  const updateFlagsRef = useRef(updateFlags)

  useEffect(() => {
    onCompleteRef.current = onComplete
    updateFlagsRef.current = updateFlags
  }, [onComplete, updateFlags])

  const clearTimers = useCallback(() => {
    if (timerRef.current) {
      window.clearInterval(timerRef.current)
      timerRef.current = null
    }

    if (spawnRef.current) {
      window.clearInterval(spawnRef.current)
      spawnRef.current = null
    }

    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current)
      animationRef.current = null
    }
  }, [])

  const finishGame = useCallback((success = false, finalScore = scoreRef.current) => {
    if (!game || finishedRef.current) {
      return
    }

    finishedRef.current = true
    clearTimers()

    const won = game.id === 'papers' ? finalScore >= game.goal : success

    if (won && game.rewardFlag) {
      updateFlagsRef.current({ [game.rewardFlag]: true })
    }

    window.setTimeout(() => {
      onCompleteRef.current(won ? game.nextSuccess : game.nextFail)
    }, 420)
  }, [clearTimers, game])

  useEffect(() => {
    finishedRef.current = false
    scoreRef.current = 0
    setStarted(false)
    setScore(0)
    setPapers([])
    clearTimers()

    if (!game) {
      setCoffeeState(null)
      setTimeLeft(0)
      return undefined
    }

    if (game.id === 'papers') {
      setTimeLeft(game.duration / 1000)
      setCoffeeState(null)
    }

    if (game.id === 'coffee') {
      const initialRound = createCoffeeRound()
      coffeeRef.current = initialRound
      setCoffeeState(initialRound)
      setTimeLeft(0)
    }

    return clearTimers
  }, [game, clearTimers])

  useEffect(() => {
    if (!started || !game || game.id !== 'papers') {
      return undefined
    }

    const spawnPaper = () => {
      setPapers((prev) => [
        ...prev.slice(-11),
        {
          id: `${Date.now()}-${Math.random()}`,
          x: rand(9, 91),
          y: rand(12, 88),
          rotation: rand(-15, 15),
        },
      ])
    }

    spawnPaper()

    timerRef.current = window.setInterval(() => {
      setTimeLeft((prev) => {
        const nextTime = Math.max(0, prev - 0.1)

        if (nextTime <= 0) {
          finishGame(false, scoreRef.current)
        }

        return nextTime
      })
    }, 100)

    spawnRef.current = window.setInterval(spawnPaper, 980)

    return clearTimers
  }, [started, game, finishGame, clearTimers])

  useEffect(() => {
    if (!started || !game || game.id !== 'coffee' || !coffeeState) {
      return undefined
    }

    const startedAt = coffeeState.startedAt

    const animate = (currentTime) => {
      if (document.hidden) {
        animationRef.current = requestAnimationFrame(animate)
        return
      }

      const current = coffeeRef.current
      if (!current || current.startedAt !== startedAt || finishedRef.current) {
        return
      }

      const elapsed = (currentTime - current.startedAt) / 1000
      const wave = (Math.sin(elapsed * current.speed * Math.PI * 2) + 1) / 2
      const next = { ...current, needle: wave }

      coffeeRef.current = next
      setCoffeeState(next)
      animationRef.current = requestAnimationFrame(animate)
    }

    animationRef.current = requestAnimationFrame(animate)

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
        animationRef.current = null
      }
    }
  }, [started, game, coffeeState?.startedAt])

  const handleStart = () => {
    if (finishedRef.current) {
      return
    }

    setStarted(true)
  }

  const handlePaperClick = (paperId) => {
    if (finishedRef.current || !game) {
      return
    }

    setPapers((prev) => prev.filter((paper) => paper.id !== paperId))

    const nextScore = scoreRef.current + 1
    scoreRef.current = nextScore
    setScore(nextScore)

    if (nextScore >= game.goal) {
      finishGame(true, nextScore)
    }
  }

  const handleCoffeeStop = useCallback(() => {
    if (!game || game.id !== 'coffee' || finishedRef.current) {
      return
    }

    const current = coffeeRef.current
    if (!current) {
      return
    }

    const center = current.zoneStart + current.zoneWidth / 2
    const distance = Math.abs(current.needle - center)
    const hit = distance <= current.zoneWidth / 2
    const hits = current.hits + (hit ? 1 : 0)
    const misses = current.misses + (hit ? 0 : 1)

    if (hits >= game.rounds) {
      const completed = { ...current, hits, misses, feedback: 'Попадание.' }
      coffeeRef.current = completed
      setCoffeeState(completed)
      finishGame(true)
      return
    }

    if (misses > game.maxMisses) {
      const completed = { ...current, hits, misses, feedback: 'Кофе убежал.' }
      coffeeRef.current = completed
      setCoffeeState(completed)
      finishGame(false)
      return
    }

    const nextRound = createCoffeeRound({
      ...current,
      hits,
      misses,
      feedback: hit ? 'Попадание.' : 'Мимо.',
    })

    coffeeRef.current = nextRound
    setCoffeeState(nextRound)
  }, [finishGame, game])

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!started || finishedRef.current) {
        return
      }

      if (e.code === 'Space' && game?.id === 'coffee') {
        e.preventDefault()
        handleCoffeeStop()
      }

      if (e.code === 'Escape') {
        e.preventDefault()
        finishGame(false, scoreRef.current)
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [started, game, handleCoffeeStop, finishGame])

  useEffect(() => {
    const handleVisibilityChange = () => {
      const now = performance.now()

      if (document.hidden) {
        hiddenAtRef.current = now
        return
      }

      if (!hiddenAtRef.current) {
        return
      }

      const hiddenDuration = now - hiddenAtRef.current
      hiddenAtRef.current = null

      if (started && game?.id === 'coffee' && coffeeRef.current && !finishedRef.current) {
        const next = {
          ...coffeeRef.current,
          startedAt: coffeeRef.current.startedAt + hiddenDuration,
        }

        coffeeRef.current = next
        setCoffeeState(next)
      }
    }

    document.addEventListener('visibilitychange', handleVisibilityChange)
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange)
  }, [started, game])

  if (!game) {
    return <div className="mini-loading">Загрузка мини-игры...</div>
  }

  return (
    <section className="mini-panel card">
      <div className="mini-top">
        <div className="mini-headline">
          <p className="eyebrow">{game.tag}</p>
          <h2 className="mini-title">{game.title}</h2>
        </div>
        {started && game.id === 'papers' && (
          <div className="mini-meta">
            Собрано: {score} / {game.goal}
            <br />
            Время: {Math.ceil(timeLeft)}с
          </div>
        )}
        {started && game.id === 'coffee' && coffeeState && (
          <div className="mini-meta">
            Попадания: {coffeeState.hits} / {game.rounds}
            <br />
            Промахи: {coffeeState.misses} / {game.maxMisses}
          </div>
        )}
      </div>

      <p className="mini-text">{game.text}</p>

      {!started ? (
        <div className="mini-stage mini-start">
          <div className="mini-start-content">
            <p className="mini-hint">{game.hint}</p>
            <button className="restart" type="button" onClick={handleStart}>
              Начать
            </button>
          </div>
        </div>
      ) : (
        <>
          {game.id === 'papers' && (
            <div className="mini-stage mini-papers-stage">
              {papers.map((paper) => (
                <button
                  key={paper.id}
                  className="mini-paper"
                  style={{
                    left: `${paper.x}%`,
                    top: `${paper.y}%`,
                    '--rotation': `${paper.rotation}deg`,
                  }}
                  type="button"
                  onClick={() => handlePaperClick(paper.id)}
                >
                  <span aria-hidden="true">📄</span>
                </button>
              ))}
            </div>
          )}

          {game.id === 'coffee' && coffeeState && (
            <div className="mini-stage mini-coffee-stage">
              <div className="mini-coffee-bar" aria-label="Таймер кофе">
                <div
                  className="mini-coffee-zone"
                  style={{
                    left: `${coffeeState.zoneStart * 100}%`,
                    width: `${coffeeState.zoneWidth * 100}%`,
                  }}
                />
                <div
                  className="mini-coffee-needle"
                  style={{ left: `${coffeeState.needle * 100}%` }}
                />
              </div>
              <p className="mini-feedback" aria-live="polite">
                {coffeeState.feedback || 'Жди момент.'}
              </p>
              <button className="restart" type="button" onClick={handleCoffeeStop}>
                {game.actionLabel}
              </button>
            </div>
          )}
        </>
      )}

      {started && (
        <div className="mini-actions">
          <button
            className="restart mini-surrender"
            type="button"
            onClick={() => finishGame(false, scoreRef.current)}
          >
            Сдаться
          </button>
        </div>
      )}
    </section>
  )
}
