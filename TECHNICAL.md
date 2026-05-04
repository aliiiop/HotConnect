# Техническая документация HotConnect

## Архитектура приложения

### Общая структура

Приложение построено по принципу SPA (Single Page Application) с использованием React и React Router. Данные хранятся в localStorage браузера.

### Компонентная архитектура

```
App (AuthProvider)
├── Routes
    ├── LoginPage
    ├── RegisterPage
    ├── GamePage
    │   ├── StoryScene
    │   ├── BattleScene
    │   └── MiniGameScene
    └── NotFoundPage
```

## Основные модули

### 1. Аутентификация (useAuth.jsx)

**Функции:**
- `register(username, password)` - регистрация нового пользователя
- `login(username, password)` - вход в систему
- `logout()` - выход из системы

**Валидация:**
- Имя пользователя: минимум 3 символа
- Пароль: минимум 6 символов
- Проверка на существование пользователя
- Проверка совпадения паролей при регистрации

**Хранение:**
```javascript
localStorage.setItem('users', JSON.stringify([
  {
    id: "timestamp",
    username: "user",
    password: "base64_encoded",
    createdAt: "ISO_date"
  }
]))

localStorage.setItem('currentUser', JSON.stringify({
  id: "timestamp",
  username: "user",
  createdAt: "ISO_date"
}))
```

### 2. Игровая логика (GamePage.jsx)

**State управление:**
```javascript
{
  currentScene: "scene_id",
  flags: {
    paperSuccess: boolean,
    coffeeSuccess: boolean,
    spared: {
      printer: boolean,
      dean: boolean,
      // ... другие боссы
    }
  }
}
```

**Сохранение прогресса:**
```javascript
localStorage.setItem('game_progress_${userId}', JSON.stringify({
  currentScene: "scene_id",
  flags: {...},
  lastSaved: "ISO_date"
}))
```

### 3. Боевая система (BattleScene.jsx)

**Структура боя:**
```javascript
{
  boss: BossData,
  playerMaxHp: number,
  playerHp: number,
  enemyMaxHp: number,
  enemyHp: number,
  calm: number,        // Уровень спокойствия врага
  turn: number,        // Номер хода
  phase: "menu" | "timing" | "attack",
  items: Array,
  acts: Array,
  attacks: Array,
  soul: {
    x: 0.5,           // Позиция души (0-1)
    y: 0.5,
    speed: 0.4,
    size: 28
  }
}
```

**Фазы боя:**
1. **menu** - выбор действия (Удар/Действие/Предмет)
2. **timing** - мини-игра с таймингом для атаки
3. **attack** - фаза атаки врага

**Система бонусов:**
- Успех в мини-игре "Бумаги" даёт бонусы против Принтера и Библиотекаря
- Успех в мини-игре "Кофе" даёт бонусы против Вахтёра, Методистки и Чата
- Оба успеха дают максимальный бонус против финального босса

### 4. Мини-игры (MiniGameScene.jsx)

**Типы мини-игр:**

1. **papers** (Поймай журнал)
   - Цель: собрать 8 бумаг за 18 секунд
   - Механика: клик по появляющимся элементам
   - Награда: флаг `paperSuccess`

2. **coffee** (Кофейный таймер)
   - Цель: 3 попадания в зелёную зону
   - Механика: остановка движущейся стрелки
   - Максимум промахов: 2
   - Награда: флаг `coffeeSuccess`

## Система тем

### Динамическое переключение тем

Темы применяются через data-атрибут на элементе:
```javascript
<div data-theme="battle-printer">
```

### CSS переменные

Каждая тема определяет набор CSS переменных:
```css
[data-theme="home"] {
  --bg-top: #ffffff;
  --bg-bottom: #f5f5f5;
  --text: #111111;
  --muted: #676767;
  /* ... и т.д. */
}
```

### Список тем

- `home` - домашняя сцена
- `work` - рабочие сцены
- `sleep` - ночные сцены
- `dry` - кофейные сцены
- `battle-printer` - бой с принтером
- `battle-dean` - бой с деканом
- `battle-chat` - бой с чатом
- `battle-librarian` - бой с библиотекарем
- `battle-security` - бой с вахтёром
- `battle-methodist` - бой с методисткой
- `battle-mold` - бой с плесенью
- `battle-final` - финальный бой
- `mini-papers` - мини-игра с бумагами
- `mini-coffee` - мини-игра с кофе

## Структура данных

### Сцены (scenes.js)

```javascript
{
  "scene-id": {
    kind: "story" | "battle" | "minigame",
    theme: "theme-name",
    tag: "Метка",
    title: "Заголовок",
    text: "Текст" | function(state),
    choices: [
      { label: "Выбор", next: "next-scene-id" }
    ],
    ending: "Текст концовки" | function(state)
  }
}
```

### Боссы (bosses.js)

```javascript
{
  "boss-id": {
    id: "boss-id",
    theme: "battle-theme",
    tag: "Босс",
    enemyName: "Имя врага",
    title: "Заголовок боя",
    intro: "Вступительный текст",
    playerMaxHp: 34,
    enemyMaxHp: 32,
    soulSpeed: 0.4,      // Опционально
    baseItems: [
      { label: "Предмет", heal: 8, message: "Сообщение" }
    ],
    acts: [
      {
        label: "Действие",
        message: "Сообщение",
        calm: 1,           // Увеличение спокойствия
        damage: 0,         // Урон (опционально)
        heal: 0            // Лечение (опционально)
      }
    ],
    attacks: [
      {
        line: "Текст атаки",
        pattern: "pattern-name",
        duration: 3800,
        interval: 250,
        speed: 150,
        damage: 2
      }
    ],
    winScene: "next-scene-id"
  }
}
```

### Мини-игры (minigames.js)

```javascript
{
  "game-id": {
    id: "game-id",
    theme: "mini-theme",
    tag: "Мини-игра",
    title: "Заголовок",
    text: "Описание",
    hint: "Подсказка",
    actionLabel: "Кнопка",
    
    // Для papers:
    duration: 18000,
    goal: 8,
    
    // Для coffee:
    rounds: 3,
    maxMisses: 2,
    
    nextSuccess: "success-scene",
    nextFail: "fail-scene",
    rewardFlag: "flagName"
  }
}
```

## Утилиты (gameUtils.js)

### Математические функции

```javascript
rand(min, max)           // Случайное число в диапазоне
clamp(value, min, max)   // Ограничение значения
percent(current, max)    // Процент от максимума
```

### Игровые функции

```javascript
resolveValue(value, state)           // Разрешение значения или функции
createFlags()                        // Создание начальных флагов
saveGameProgress(userId, progress)   // Сохранение прогресса
loadGameProgress(userId)             // Загрузка прогресса
clearGameProgress(userId)            // Очистка прогресса
```

## Производительность

### Оптимизации

1. **Минификация кода** - через esbuild
2. **Code splitting** - автоматически через Vite
3. **Lazy loading** - для компонентов (можно добавить)
4. **Мемоизация** - через React.memo (можно добавить)

### Метрики

- Размер бандла: ~196 KB (64 KB gzip)
- Размер CSS: ~27 KB (5 KB gzip)
- Время сборки: ~1.3 секунды

## Безопасность

### Текущая реализация

- Пароли кодируются в base64 (для демонстрации)
- Данные хранятся локально в браузере
- Нет серверной части

### Рекомендации для продакшена

1. Использовать настоящий бэкенд
2. Хешировать пароли с bcrypt
3. Использовать JWT токены
4. Добавить HTTPS
5. Валидация на сервере

## Расширение функционала

### Добавление новой сцены

1. Добавить данные в `src/data/scenes.js`
2. Если нужна новая тема, добавить в `src/index.css`
3. Связать с существующими сценами через `choices`

### Добавление нового босса

1. Добавить данные в `src/data/bosses.js`
2. Создать сцену типа `battle` в `scenes.js`
3. Добавить тему в `src/index.css`
4. Опционально: добавить бонусы в `applyBattleBonus()`

### Добавление новой мини-игры

1. Добавить данные в `src/data/minigames.js`
2. Создать сцену типа `minigame` в `scenes.js`
3. Добавить логику в `MiniGameScene.jsx`
4. Добавить тему в `src/index.css`

## Отладка

### Полезные команды

```bash
# Запуск в режиме разработки
npm run dev

# Сборка проекта
npm run build

# Предварительный просмотр сборки
npm run preview

# Проверка кода
npm run lint
```

### Инструменты разработчика

- React DevTools - для отладки компонентов
- Redux DevTools - не используется, но можно добавить
- Console - для логирования
- localStorage - можно просмотреть в Application tab

### Очистка данных

Для сброса всех данных:
```javascript
localStorage.clear()
```

Для сброса конкретных данных:
```javascript
localStorage.removeItem('users')
localStorage.removeItem('currentUser')
localStorage.removeItem('game_progress_${userId}')
```

## Известные ограничения

1. Боевая система упрощена (нет реальных снарядов)
2. Мини-игры базовые
3. Нет звуковых эффектов
4. Нет анимаций переходов между сценами
5. Нет мультиплеера
6. Нет облачного сохранения

## Планы развития

1. Добавить звуковые эффекты
2. Улучшить боевую систему (реальные снаряды)
3. Добавить больше мини-игр
4. Создать систему достижений
5. Добавить таблицу лидеров
6. Реализовать облачное сохранение

## Поддержка браузеров

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Контрибьюция

Для добавления новых функций:
1. Создайте новую ветку
2. Внесите изменения
3. Протестируйте
4. Создайте pull request

## Лицензия

Проект создан в образовательных целях для курсовой работы.
