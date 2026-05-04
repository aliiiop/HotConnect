export const SCENES = {
  intro: {
    kind: "story",
    theme: "home",
    tag: "Утро",
    title: "Гоша и будильник",
    text: "Гоша, преподавательница колледжа, смотрит на будильник как на врага.",
    choices: [
      { label: "Иду на работу", next: "work-road" },
      { label: "Ещё полежать", next: "home-dive" },
    ],
  },
  "work-road": {
    kind: "story",
    theme: "work",
    tag: "Колледж",
    title: "Серый вход",
    text: "Вход в колледж уже пахнет усталостью. Это только начало.",
    choices: [
      { label: "В архив", next: "archive-menu" },
      { label: "Прямо к принтеру", next: "battle-printer" },
      { label: "В буфет", next: "mini-coffee" },
    ],
  },
  "archive-menu": {
    kind: "story",
    theme: "work",
    tag: "Архив",
    title: "Выбор мини-игры",
    text: "Архив полон заданий. Листай быстрее или держи ритм.",
    choices: [
      { label: "Поймать журнал", next: "mini-papers" },
      { label: "Вернуться назад", next: "work-road" },
    ],
  },
  "after-printer": {
    kind: "story",
    theme: "work",
    tag: "Коридор",
    title: "Принтер сдох",
    text: "Бумажный дым осел. Впереди ещё полколледжа и ни капли стыда.",
    choices: [
      { label: "К декану", next: "battle-dean" },
      { label: "В библиотеку", next: "battle-librarian" },
      { label: "На вахту", next: "battle-security" },
    ],
  },
  "after-dean": {
    kind: "story",
    theme: "work",
    tag: "Кабинет",
    title: "Решение не закончилось",
    text: "Декан отступил, но день всё ещё не сломан. Пока.",
    choices: [
      { label: "В библиотеку", next: "battle-librarian" },
      { label: "На вахту", next: "battle-security" },
      { label: "К методистке", next: "battle-methodist" },
    ],
  },
  "home-dive": {
    kind: "story",
    theme: "home",
    tag: "Дом",
    title: "Диван держит",
    text: "Диван тёплый, а жизнь - нет. Решайся.",
    choices: [
      { label: "Кофе и в путь", next: "mini-coffee" },
      { label: "Похер, спать", next: "sleep-sofa" },
    ],
  },
  "after-chat": {
    kind: "story",
    theme: "home",
    tag: "Уведомления",
    title: "Телефон затих",
    text: "Чат выдохся, но день всё ещё шипит в углу.",
    choices: [
      { label: "К финалу", next: "battle-final" },
      { label: "К вахте", next: "battle-security" },
      { label: "Домой", next: "ending-home" },
    ],
  },
  "sleep-sofa": {
    kind: "story",
    theme: "sleep",
    tag: "Ночь",
    title: "Сон на диване",
    text: "Гоша вырубается на диване. Из холодильника тянет холодом, и в этом холоде уже что-то шевелится.",
    choices: [
      { label: "Открыть глаза", next: "battle-mold" },
    ],
  },
  "after-papers": {
    kind: "story",
    theme: "work",
    tag: "Архив",
    title: "Журнал спасён",
    text: (state) =>
      state.flags.paperSuccess
        ? "Журнал цел. Теперь можно идти ломать всё остальное."
        : "Журнал как-то доехал до руки. Колледж уже нервничает.",
    choices: [
      { label: "К принтеру", next: "battle-printer" },
      { label: "К декану", next: "battle-dean" },
      { label: "На вахту", next: "battle-security" },
    ],
  },
  "after-coffee": {
    kind: "story",
    theme: "dry",
    tag: "Кофе",
    title: "Эспрессо в голову",
    text: (state) =>
      state.flags.coffeeSuccess
        ? "Кофе сделал Гошу почти опасной. Это пугает всех вокруг."
        : "Кофе не вышел, но Гоша хотя бы не спит стоя.",
    choices: [
      { label: "К чату", next: "battle-chat" },
      { label: "К вахте", next: "battle-security" },
      { label: "К декану", next: "battle-dean" },
    ],
  },
  "after-librarian": {
    kind: "story",
    theme: "work",
    tag: "Тишина",
    title: "Полки дрожат",
    text: "Книги успокоились. Сами полки - нет.",
    choices: [
      { label: "К методистке", next: "battle-methodist" },
      { label: "К чату", next: "battle-chat" },
      { label: "На вахту", next: "battle-security" },
    ],
  },
  "after-security": {
    kind: "story",
    theme: "work",
    tag: "Пост",
    title: "Пропуск почти сожрали",
    text: "Вахтёр посмотрел так, будто знает твой пароль.",
    choices: [
      { label: "К методистке", next: "battle-methodist" },
      { label: "К чату", next: "battle-chat" },
      { label: "К финалу", next: "battle-final" },
    ],
  },
  "after-methodist": {
    kind: "story",
    theme: "work",
    tag: "Методкабинет",
    title: "Формы кончились",
    text: "Методистка сдалась. Впереди только самый тупой финал.",
    choices: [
      { label: "К финалу", next: "battle-final" },
      { label: "К декану", next: "battle-dean" },
      { label: "В чат", next: "battle-chat" },
    ],
  },
  "after-mold": {
    kind: "story",
    theme: "sleep",
    tag: "Кухня",
    title: "Холодильник молчит",
    text: "Гоша отползает от липкой кухни. Плесень с холодильника больше не шевелится, но запах ещё спорит за жизнь.",
    choices: [
      { label: "Пойти на работу", next: "work-road" },
      { label: "Вернуться к дивану", next: "ending-home" },
    ],
  },
  "ending-final": {
    kind: "story",
    theme: "battle-final",
    tag: "Финал",
    title: "Последний звонок",
    text: (state) => {
      const cleared = Object.values(state.flags.spared).filter(Boolean).length;
      const bonuses = [state.flags.paperSuccess && "журнал", state.flags.coffeeSuccess && "кофе"].filter(Boolean);
      if (cleared >= 6 && bonuses.length === 2) {
        return "Гоша прошла весь колледж как сбой в системе. И ещё не умерла.";
      }
      if (cleared >= 4) {
        return "Почти все боссы сломались. Последний всё равно полез вперёд.";
      }
      return "Гоша дошла до конца дня. Это уже абсурдная победа.";
    },
    ending: (state) => {
      const cleared = Object.values(state.flags.spared).filter(Boolean).length;
      if (state.flags.paperSuccess && state.flags.coffeeSuccess) {
        return `Гоша вынесла ${cleared} боссов, кофе и бумажный ад. Колледж запомнит это надолго.`;
      }
      if (cleared >= 5) {
        return `Гоша вынесла ${cleared} боссов и всё равно осталась на ногах.`;
      }
      return `День закончен. За спиной ${cleared} боссов и много кринжа.`;
    },
  },
  "ending-home": {
    kind: "story",
    theme: "home",
    tag: "Финиш",
    title: "Тишина",
    text: (state) => {
      if (state.flags.coffeeSuccess) {
        return "Кофе помог пережить вечер. Чат наконец выдохся.";
      }
      return "Диван победил. Чат тоже устал.";
    },
    ending: (state) => {
      if (state.flags.spared.chat) {
        return "Телефон и Гоша заключили мир на один вечер.";
      }
      return "Диван официально сильнее всех.";
    },
  },
  "battle-printer": {
    kind: "battle",
    boss: "printer",
  },
  "battle-dean": {
    kind: "battle",
    boss: "dean",
  },
  "battle-librarian": {
    kind: "battle",
    boss: "librarian",
  },
  "battle-security": {
    kind: "battle",
    boss: "security",
  },
  "battle-methodist": {
    kind: "battle",
    boss: "methodist",
  },
  "battle-chat": {
    kind: "battle",
    boss: "chat",
  },
  "battle-mold": {
    kind: "battle",
    boss: "mold",
  },
  "battle-final": {
    kind: "battle",
    boss: "final",
  },
  "mini-papers": {
    kind: "minigame",
    mini: "papers",
  },
  "mini-coffee": {
    kind: "minigame",
    mini: "coffee",
  },
};
