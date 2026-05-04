import { Link } from 'react-router-dom'
import './NotFoundPage.css'

export default function NotFoundPage() {
  return (
    <div className="not-found-page">
      <div className="not-found-card">
        <div className="not-found-header">
          <h1 className="not-found-title">404</h1>
          <p className="not-found-subtitle">Страница не найдена</p>
        </div>

        <p className="not-found-text">
          Похоже, вы заблудились в коридорах колледжа. Эта страница не существует.
        </p>

        <div className="not-found-actions">
          <Link to="/login" className="not-found-button">
            На главную
          </Link>
        </div>
      </div>
    </div>
  )
}
