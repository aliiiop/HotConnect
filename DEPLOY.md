# Инструкция по деплою HotConnect

## Варианты деплоя

### 1. Vercel (Рекомендуется)

Vercel - лучший вариант для React приложений, созданных с Vite.

#### Через веб-интерфейс (самый простой способ)

1. Зарегистрируйтесь на [vercel.com](https://vercel.com)
2. Нажмите "Add New Project"
3. Импортируйте ваш GitHub репозиторий
4. Vercel автоматически определит настройки:
   - Framework Preset: Vite
   - Build Command: `npm run build`
   - Output Directory: `dist`
5. Нажмите "Deploy"
6. Готово! Ваш сайт будет доступен по ссылке типа `hotconnect.vercel.app`

#### Через CLI

```bash
# Установите Vercel CLI
npm install -g vercel

# Войдите в аккаунт
vercel login

# Деплой проекта
vercel

# Для продакшен деплоя
vercel --prod
```

---

### 2. Netlify

Netlify - отличная альтернатива с простым интерфейсом.

#### Через веб-интерфейс

1. Зарегистрируйтесь на [netlify.com](https://netlify.com)
2. Нажмите "Add new site" → "Import an existing project"
3. Подключите GitHub репозиторий
4. Настройки сборки:
   - Build command: `npm run build`
   - Publish directory: `dist`
5. Нажмите "Deploy site"
6. Готово! Сайт будет доступен по ссылке типа `hotconnect.netlify.app`

#### Через CLI

```bash
# Установите Netlify CLI
npm install -g netlify-cli

# Войдите в аккаунт
netlify login

# Инициализация
netlify init

# Деплой
netlify deploy

# Продакшен деплой
netlify deploy --prod
```

#### Через drag-and-drop

1. Соберите проект: `npm run build`
2. Перейдите на [app.netlify.com/drop](https://app.netlify.com/drop)
3. Перетащите папку `dist` в окно браузера
4. Готово!

---

### 3. GitHub Pages

GitHub Pages - бесплатный хостинг для статических сайтов.

#### Настройка

1. Установите пакет для деплоя:
```bash
npm install --save-dev gh-pages
```

2. Добавьте в `package.json`:
```json
{
  "homepage": "https://ваш-username.github.io/HotConnect",
  "scripts": {
    "predeploy": "npm run build",
    "deploy": "gh-pages -d dist"
  }
}
```

3. Обновите `vite.config.js`:
```javascript
export default defineConfig({
  base: '/HotConnect/',
  // ... остальные настройки
})
```

4. Деплой:
```bash
npm run deploy
```

5. Включите GitHub Pages в настройках репозитория:
   - Settings → Pages
   - Source: Deploy from a branch
   - Branch: gh-pages
   - Folder: / (root)

---

### 4. Render

Render - современная платформа с бесплатным тарифом.

1. Зарегистрируйтесь на [render.com](https://render.com)
2. Нажмите "New" → "Static Site"
3. Подключите GitHub репозиторий
4. Настройки:
   - Build Command: `npm run build`
   - Publish Directory: `dist`
5. Нажмите "Create Static Site"

---

### 5. Cloudflare Pages

Cloudflare Pages - быстрый CDN с бесплатным тарифом.

1. Зарегистрируйтесь на [pages.cloudflare.com](https://pages.cloudflare.com)
2. Нажмите "Create a project"
3. Подключите GitHub репозиторий
4. Настройки:
   - Framework preset: Vite
   - Build command: `npm run build`
   - Build output directory: `dist`
5. Нажмите "Save and Deploy"

---

## Подготовка к деплою

### 1. Проверка перед деплоем

```bash
# Проверьте, что проект собирается без ошибок
npm run build

# Проверьте собранную версию локально
npm run preview
```

### 2. Оптимизация (опционально)

Проект уже оптимизирован, но можно добавить:

#### Компрессия изображений
Если добавите изображения, используйте:
- [TinyPNG](https://tinypng.com) для PNG
- [Squoosh](https://squoosh.app) для всех форматов

#### Анализ бандла
```bash
npm install --save-dev rollup-plugin-visualizer

# Добавьте в vite.config.js:
import { visualizer } from 'rollup-plugin-visualizer'

export default defineConfig({
  plugins: [
    react(),
    visualizer()
  ]
})

# Соберите проект
npm run build

# Откройте stats.html для анализа
```

---

## Настройка домена

### Для Vercel

1. Перейдите в настройки проекта
2. Domains → Add Domain
3. Введите ваш домен
4. Следуйте инструкциям по настройке DNS

### Для Netlify

1. Site settings → Domain management
2. Add custom domain
3. Следуйте инструкциям

### Для GitHub Pages

1. Создайте файл `CNAME` в папке `public`:
```
yourdomain.com
```

2. Настройте DNS у вашего регистратора:
```
A Record: 185.199.108.153
A Record: 185.199.109.153
A Record: 185.199.110.153
A Record: 185.199.111.153
```

---

## Переменные окружения

Если в будущем добавите API ключи:

### Vercel
```bash
vercel env add API_KEY
```

### Netlify
Site settings → Environment variables

### GitHub Pages
Не поддерживает серверные переменные окружения

---

## Автоматический деплой

### GitHub Actions для Vercel

Создайте `.github/workflows/deploy.yml`:

```yaml
name: Deploy to Vercel

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
        with:
          node-version: '18'
      - run: npm install
      - run: npm run build
      - uses: amondnet/vercel-action@v20
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.ORG_ID }}
          vercel-project-id: ${{ secrets.PROJECT_ID }}
```

### GitHub Actions для Netlify

```yaml
name: Deploy to Netlify

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
        with:
          node-version: '18'
      - run: npm install
      - run: npm run build
      - uses: netlify/actions/cli@master
        with:
          args: deploy --prod --dir=dist
        env:
          NETLIFY_AUTH_TOKEN: ${{ secrets.NETLIFY_AUTH_TOKEN }}
          NETLIFY_SITE_ID: ${{ secrets.NETLIFY_SITE_ID }}
```

---

## Мониторинг после деплоя

### Проверка работоспособности

1. Откройте сайт в разных браузерах
2. Проверьте на мобильных устройствах
3. Проверьте консоль на ошибки
4. Протестируйте все функции

### Инструменты для проверки

- [Google PageSpeed Insights](https://pagespeed.web.dev/)
- [GTmetrix](https://gtmetrix.com/)
- [WebPageTest](https://www.webpagetest.org/)

### Ожидаемые метрики

- **Performance:** 90+
- **Accessibility:** 95+
- **Best Practices:** 90+
- **SEO:** 90+

---

## Решение проблем

### Проблема: 404 при обновлении страницы

**Решение для Netlify:**
Создайте `public/_redirects`:
```
/*    /index.html   200
```

**Решение для Vercel:**
Создайте `vercel.json`:
```json
{
  "rewrites": [
    { "source": "/(.*)", "destination": "/" }
  ]
}
```

### Проблема: localStorage не работает

Проверьте настройки приватности браузера. localStorage может быть заблокирован в режиме инкогнито.

### Проблема: Медленная загрузка

1. Проверьте размер бандла
2. Включите компрессию на сервере
3. Используйте CDN

---

## Рекомендации

### Лучший выбор для курсовой работы

**Vercel** - потому что:
- ✅ Автоматический деплой при push в GitHub
- ✅ Бесплатный SSL сертификат
- ✅ Глобальный CDN
- ✅ Отличная производительность
- ✅ Простая настройка
- ✅ Красивый URL (hotconnect.vercel.app)

### Альтернатива

**Netlify** - если:
- Нужен drag-and-drop деплой
- Хотите больше контроля над настройками
- Нужны формы и функции (в будущем)

---

## Чек-лист перед деплоем

- [ ] Проект собирается без ошибок (`npm run build`)
- [ ] Все функции протестированы локально
- [ ] README.md обновлён
- [ ] .gitignore настроен правильно
- [ ] package.json содержит правильную информацию
- [ ] Нет секретов в коде
- [ ] Консоль браузера чистая (нет ошибок)

---

## После деплоя

1. Сохраните ссылку на сайт
2. Добавьте ссылку в README.md
3. Протестируйте все функции на продакшене
4. Поделитесь ссылкой с преподавателем

---

## Полезные ссылки

- [Vercel Documentation](https://vercel.com/docs)
- [Netlify Documentation](https://docs.netlify.com)
- [Vite Deployment Guide](https://vitejs.dev/guide/static-deploy.html)
- [React Router Deployment](https://reactrouter.com/en/main/guides/deploying)

---

**Удачи с деплоем! 🚀**
