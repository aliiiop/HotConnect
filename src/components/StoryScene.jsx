import { resolveValue } from '../utils/gameUtils'
import './StoryScene.css'

export default function StoryScene({ scene, flags, onChoice, onRestart }) {
  const text = resolveValue(scene.text, { flags })
  const ending = scene.ending ? resolveValue(scene.ending, { flags }) : null

  return (
    <section className="story-panel card">
      <p className="eyebrow">{scene.tag || 'История'}</p>
      <h1 className="title">{scene.title || ''}</h1>
      <p className="text story-text">{text}</p>

      {ending ? (
        <div className="ending">
          <p className="ending-text">{ending}</p>
          <button className="restart" type="button" onClick={onRestart}>
            Начать заново
          </button>
        </div>
      ) : (
        <div className="choices">
          {scene.choices?.map((choice, index) => (
            <button
              key={index}
              className="choice"
              type="button"
              onClick={() => onChoice(choice.next)}
            >
              {choice.label}
            </button>
          ))}
        </div>
      )}
    </section>
  )
}
