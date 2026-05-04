const SCENES = {
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
      { label: "Сложить папки", next: "mini-folders" },
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
    text:
      "Гоша вырубается на диване. Из холодильника тянет холодом, и в этом холоде уже что-то шевелится.",
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
  "after-folders": {
    kind: "story",
    theme: "work",
    tag: "Архив",
    title: "Папки разложены",
    text: (state) =>
      state.flags.folderSuccess
        ? "Папки на полках. Колледж будет ненамного спокойнее."
        : "Архив взял своё. Папок не хватило.",
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
  "after-clock": {
    kind: "story",
    theme: "dry",
    tag: "Кофе",
    title: "Точный глоток",
    text: (state) =>
      state.flags.clockSuccess
        ? "Отличный ритм. Время повернулось в твою пользу."
        : "Стрелка убежала. Зато ты пытался.",
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
    text:
      "Гоша отползает от липкой кухни. Плесень с холодильника больше не шевелится, но запах ещё спорит за жизнь.",
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
  "ending-work": {
    kind: "story",
    theme: "work",
    tag: "Финиш",
    title: "Звонок",
    text: (state) => {
      const spared = Object.values(state.flags.spared).filter(Boolean).length;
      if (spared >= 2) {
        return "Гоша провела день почти по-доброму. Колледж это не понял.";
      }
      if (state.flags.paperSuccess) {
        return "Журнал пойман. Пары выжили. Это уже почти успех.";
      }
      return "Гоша дожила до звонка. Уже победа.";
    },
    ending: (state) => {
      const spared = Object.values(state.flags.spared).filter(Boolean).length;
      if (spared >= 2) {
        return "Мирный день, который никто не заслужил.";
      }
      return "Рабочий день закрыт.";
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
  "ending-printer": {
    kind: "story",
    theme: "battle-printer",
    tag: "Поражение",
    title: "Принтер победил",
    text: "Лоток выиграл.",
    ending: "Папка сегодня сильнее.",
  },
  "ending-dean": {
    kind: "story",
    theme: "battle-dean",
    tag: "Поражение",
    title: "Декан победил",
    text: "Взгляд оказался оружием.",
    ending: "Очки - страшная вещь.",
  },
  "ending-chat": {
    kind: "story",
    theme: "battle-chat",
    tag: "Поражение",
    title: "Чат победил",
    text: "Уведомления не умолкают.",
    ending: "Телефон победил без пота.",
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

const BOSSES = {
  printer: {
    id: "printer",
    theme: "battle-printer",
    tag: "Босс",
    enemyName: "Принтер-3000",
    title: "Бумажный зверь",
    intro: "Принтер кашляет бумагой.",
    playerMaxHp: 34,
    enemyMaxHp: 32,
    baseItems: [
      { label: "Чай", heal: 8, message: "Чай смазал нервы." },
    ],
    acts: [
      {
        label: "Починить",
        message: "Лоток щёлкнул.",
        calm: 1,
      },
      {
        label: "Похвалить",
        message: "Принтер смущён.",
        calm: 1,
      },
      {
        label: "Пнуть",
        message: "Нехорошо, но громко.",
        damage: 4,
      },
    ],
    attacks: [
      {
        line: "Лоток жует бумагу.",
        pattern: "printerRain",
        duration: 3800,
        interval: 250,
        speed: 150,
        damage: 2,
      },
      {
        line: "Листы летят в лицо.",
        pattern: "printerSides",
        duration: 3900,
        interval: 230,
        speed: 165,
        damage: 2,
      },
      {
        line: "Принтер заклинило.",
        pattern: "printerJam",
        duration: 3700,
        interval: 220,
        speed: 145,
        damage: 3,
      },
    ],
    winScene: "after-printer",
  },
  dean: {
    id: "dean",
    theme: "battle-dean",
    tag: "Босс",
    enemyName: "Декан",
    title: "Взгляд поверх очков",
    intro: "Декан уже всё понял, но всё равно спрашивает.",
    playerMaxHp: 34,
    enemyMaxHp: 34,
    baseItems: [
      { label: "Мел", heal: 10, message: "Мел вернул тебе голос." },
    ],
    acts: [
      {
        label: "Показать план",
        message: "План существует. Уже неплохо.",
        calm: 1,
      },
      {
        label: "Улыбнуться",
        message: "Декан моргнул. Почти победа.",
        calm: 1,
      },
      {
        label: "Признаться",
        message: "Честность бьёт по гордости.",
        calm: 2,
        heal: 2,
      },
    ],
    attacks: [
      {
        line: "Документы идут строем.",
        pattern: "deanStamp",
        duration: 3900,
        interval: 235,
        speed: 160,
        damage: 3,
      },
      {
        line: "Вопросы летят сверху.",
        pattern: "deanCross",
        duration: 4000,
        interval: 220,
        speed: 170,
        damage: 3,
      },
      {
        line: "Декан подводит итог.",
        pattern: "deanSweep",
        duration: 3900,
        interval: 225,
        speed: 165,
        damage: 3,
      },
    ],
    winScene: "after-dean",
  },
  chat: {
    id: "chat",
    theme: "battle-chat",
    tag: "Босс",
    enemyName: "Чат группы",
    title: "Уведомления",
    intro: "Телефон уже дрожит. Сейчас будет плохо.",
    playerMaxHp: 32,
    enemyMaxHp: 30,
    baseItems: [
      { label: "Беззвучный", heal: 6, message: "Тишина вернулась на секунду." },
    ],
    acts: [
      {
        label: "Без звука",
        message: "Уведомления глохнут.",
        calm: 1,
      },
      {
        label: "Архив",
        message: "Лента оседает.",
        calm: 1,
        damage: 2,
      },
      {
        label: "Точка",
        message: "Сухой ответ сбивает ритм.",
        calm: 2,
      },
    ],
    attacks: [
      {
        line: "Пинг-пинг-пинг.",
        pattern: "chatFlood",
        duration: 3800,
        interval: 190,
        speed: 170,
        damage: 3,
      },
      {
        line: "Новые сообщения сверху.",
        pattern: "chatMessage",
        duration: 3900,
        interval: 180,
        speed: 175,
        damage: 3,
      },
      {
        line: "Куратор читает всё.",
        pattern: "chatBurst",
        duration: 3900,
        interval: 200,
        speed: 180,
        damage: 3,
      },
    ],
    winScene: "after-chat",
  },
  librarian: {
    id: "librarian",
    theme: "battle-librarian",
    tag: "Босс",
    enemyName: "Библиотекарь",
    title: "Тсс, не шуми",
    intro: "Книга уже летит в лицо, а тишина свистит.",
    playerMaxHp: 34,
    enemyMaxHp: 32,
    baseItems: [
      { label: "Закладка", heal: 6, message: "Закладка удержала здравый смысл." },
    ],
    acts: [
      {
        label: "Вернуть книгу",
        message: "Библиотекарь на секунду растаял.",
        calm: 1,
      },
      {
        label: "Сделать тише",
        message: "Воздух стал мягче.",
        calm: 1,
      },
      {
        label: "Спросить дорогу",
        message: "Ответ вышел очень сухим.",
        calm: 2,
      },
    ],
    attacks: [
      {
        line: "Книги сыпятся сверху.",
        pattern: "bookRain",
        duration: 3900,
        interval: 210,
        speed: 155,
        damage: 2,
      },
      {
        line: "Полки двигаются.",
        pattern: "shelfSweep",
        duration: 4000,
        interval: 200,
        speed: 170,
        damage: 3,
      },
      {
        line: "Закладка вошла в бой.",
        pattern: "bookmarkCross",
        duration: 3800,
        interval: 195,
        speed: 160,
        damage: 3,
      },
    ],
    winScene: "after-librarian",
  },
  security: {
    id: "security",
    theme: "battle-security",
    tag: "Босс",
    enemyName: "Вахтёр",
    title: "Покажи пропуск",
    intro: "Он уже знает, что ты не по списку.",
    playerMaxHp: 34,
    enemyMaxHp: 36,
    baseItems: [
      { label: "Термокружка", heal: 7, message: "Тепло вернуло наглость." },
    ],
    acts: [
      {
        label: "Показать пропуск",
        message: "Вахтёр прищурился, но пропуск не сжёг.",
        calm: 1,
      },
      {
        label: "Пошутить",
        message: "Шутка прошла опасно близко.",
        calm: 1,
      },
      {
        label: "Сделать вид, что звонили",
        message: "Ложь почти сработала.",
        calm: 2,
        damage: 2,
      },
    ],
    attacks: [
      {
        line: "Пропуск-сканер пошёл в атаку.",
        pattern: "badgeRain",
        duration: 3900,
        interval: 210,
        speed: 165,
        damage: 3,
      },
      {
        line: "Свет бьёт по глазам.",
        pattern: "spotlightSweep",
        duration: 4100,
        interval: 190,
        speed: 175,
        damage: 3,
      },
      {
        line: "Лента натягивается.",
        pattern: "tapeLine",
        duration: 4000,
        interval: 200,
        speed: 170,
        damage: 3,
      },
    ],
    winScene: "after-security",
  },
  methodist: {
    id: "methodist",
    theme: "battle-methodist",
    tag: "Босс",
    enemyName: "Методистка",
    title: "Справка, печать, ещё справка",
    intro: "Стол завален формами. Это оружие.",
    playerMaxHp: 34,
    enemyMaxHp: 34,
    baseItems: [
      { label: "Сахар", heal: 6, message: "Сахар сделал мир чуть менее бюрократичным." },
    ],
    acts: [
      {
        label: "Заполнить форму",
        message: "Она удивилась, что ты реально можешь писать.",
        calm: 1,
      },
      {
        label: "Сказать 'я уже отправила'",
        message: "Методистка зависла на полсекунды.",
        calm: 2,
      },
      {
        label: "Попросить одну печать",
        message: "Печать стукнула как угроза.",
        damage: 2,
      },
    ],
    attacks: [
      {
        line: "Формы летят как снег.",
        pattern: "formRain",
        duration: 3900,
        interval: 205,
        speed: 155,
        damage: 2,
      },
      {
        line: "Подпись идёт в разнос.",
        pattern: "signatureWall",
        duration: 4000,
        interval: 195,
        speed: 170,
        damage: 3,
      },
      {
        line: "Дедлайн наступает.",
        pattern: "deadlineRush",
        duration: 3900,
        interval: 190,
        speed: 175,
        damage: 3,
      },
    ],
    winScene: "after-methodist",
  },
  final: {
    id: "final",
    theme: "battle-final",
    tag: "Финал",
    enemyName: "Ночной обход",
    title: "Скелет смены",
    intro: "Из темноты выходит тот, кто знает твой маршрут.",
    playerMaxHp: 38,
    enemyMaxHp: 54,
    soulSpeed: 0.28,
    baseItems: [
      { label: "Кофе", heal: 8, message: "Кофе ударил по нервам и вернул форму." },
    ],
    acts: [
      {
        label: "Пошутить",
        message: "Шутка не смешная, но он замялся.",
        calm: 1,
      },
      {
        label: "Сделать шаг",
        message: "Он отступил на один очень злой миллиметр.",
        calm: 1,
        damage: 2,
      },
      {
        label: "Сказать 'я устала'",
        message: "Впервые за бой стало чуть тише.",
        calm: 2,
        heal: 2,
      },
    ],
    attacks: [
      {
        line: "Кости идут сверху.",
        pattern: "sansBoneRain",
        duration: 4300,
        interval: 150,
        speed: 240,
        damage: 4,
      },
      {
        line: "Стены сжимаются.",
        pattern: "sansBoneWalls",
        duration: 4400,
        interval: 150,
        speed: 240,
        damage: 4,
      },
      {
        line: "Лучи вылезли из темноты.",
        pattern: "sansBlasterFan",
        duration: 4500,
        interval: 158,
        speed: 255,
        damage: 5,
      },
      {
        line: "Скрещённый удар.",
        pattern: "sansCross",
        duration: 4300,
        interval: 155,
        speed: 238,
        damage: 4,
      },
      {
        line: "Сдвиг по диагонали.",
        pattern: "sansSweep",
        duration: 4400,
        interval: 150,
        speed: 250,
        damage: 5,
      },
      {
        line: "Двойной налёт.",
        pattern: "sansBarrier",
        duration: 4500,
        interval: 148,
        speed: 245,
        damage: 5,
      },
      {
        line: "Последний грязный трюк.",
        pattern: "sansTrap",
        duration: 4600,
        interval: 145,
        speed: 260,
        damage: 5,
      },
    ],
    winScene: "ending-final",
  },
  mold: {
    id: "mold",
    theme: "battle-mold",
    tag: "Босс",
    enemyName: "Плесень из холодильника",
    title: "Холодный грибок",
    intro: "Дверца холодильника скрипит. Из неё лезет зелёный ад.",
    playerMaxHp: 36,
    enemyMaxHp: 52,
    soulSpeed: 0.28,
    baseItems: [
      { label: "Антисептик", heal: 7, message: "Запах стал чуть менее убийственным." },
    ],
    acts: [
      {
        label: "Проветрить",
        message: "Споры поперхнулись воздухом.",
        calm: 1,
      },
      {
        label: "Включить свет",
        message: "Плесень зашипела от наглости.",
        calm: 1,
        damage: 2,
      },
      {
        label: "Швырнуть содой",
        message: "Сода попала прямо в настроение врага.",
        calm: 1,
        damage: 3,
      },
    ],
    attacks: [
      {
        line: "Споры пошли по кухне.",
        pattern: "moldSporeRain",
        duration: 4100,
        interval: 135,
        speed: 255,
        damage: 4,
      },
      {
        line: "Стена дверец.",
        pattern: "moldBarrier",
        duration: 4200,
        interval: 140,
        speed: 265,
        damage: 5,
      },
      {
        line: "Из щелей полезла слизь.",
        pattern: "slimeFlood",
        duration: 4500,
        interval: 145,
        speed: 250,
        damage: 5,
      },
      {
        line: "Молочный туман.",
        pattern: "moldCross",
        duration: 4200,
        interval: 140,
        speed: 260,
        damage: 5,
      },
      {
        line: "Сырная атака.",
        pattern: "fridgeSlice",
        duration: 4500,
        interval: 125,
        speed: 300,
        damage: 6,
      },
    ],
    winScene: "after-mold",
  },
};

const MINI_GAMES = {
  papers: {
    id: "papers",
    theme: "mini-papers",
    tag: "Мини-игра",
    title: "Поймай журнал",
    text: "Листы летят. Собери 8 до звонка.",
    hint: "Кликай по листам. Esc - сдаться.",
    actionLabel: "Сдаться",
    duration: 18000,
    goal: 8,
    nextSuccess: "after-papers",
    nextFail: "after-papers",
    rewardFlag: "paperSuccess",
  },
  folders: {
    id: "folders",
    theme: "mini-folders",
    tag: "Мини-игра",
    title: "Сложи папки",
    text: "Папки летят. Убери 10 за 16 секунд.",
    hint: "Кликай по папкам. Esc - сдаться.",
    actionLabel: "Сдаться",
    duration: 16000,
    goal: 10,
    nextSuccess: "after-folders",
    nextFail: "after-folders",
    rewardFlag: "folderSuccess",
  },
  coffee: {
    id: "coffee",
    theme: "mini-coffee",
    tag: "Мини-игра",
    title: "Бодрящий ритуал",
    text: "Останови стрелку в зелёной зоне три раза.",
    hint: "Space - стоп. 3 попадания.",
    actionLabel: "Стоп",
    rounds: 3,
    maxMisses: 2,
    nextSuccess: "after-coffee",
    nextFail: "after-coffee",
    rewardFlag: "coffeeSuccess",
  },
  clock: {
    id: "clock",
    theme: "mini-clock",
    tag: "Мини-игра",
    title: "Тихий счёт",
    text: "Останови стрелку 4 раза подряд.",
    hint: "Space - стоп. 4 попадания.",
    actionLabel: "Стоп",
    rounds: 4,
    maxMisses: 1,
    nextSuccess: "after-clock",
    nextFail: "after-clock",
    rewardFlag: "clockSuccess",
  },
};

const ui = {
  storyPanel: document.getElementById("story-panel"),
  storyTag: document.getElementById("story-tag"),
  storyTitle: document.getElementById("story-title"),
  storyText: document.getElementById("story-text"),
  storyChoices: document.getElementById("story-choices"),
  storyEnding: document.getElementById("story-ending"),
  storyEndingText: document.getElementById("story-ending-text"),
  restartButton: document.getElementById("restart-button"),
  battlePanel: document.getElementById("battle-panel"),
  battleTag: document.getElementById("battle-tag"),
  battleTitle: document.getElementById("battle-title"),
  battleEnemyName: document.getElementById("battle-enemy-name"),
  battlePlayerHp: document.getElementById("battle-player-hp"),
  battleEnemyHp: document.getElementById("battle-enemy-hp"),
  battlePlayerFill: document.getElementById("battle-player-fill"),
  battleEnemyFill: document.getElementById("battle-enemy-fill"),
  battleMessage: document.getElementById("battle-message"),
  battleArena: document.getElementById("battle-arena"),
  battleProjectiles: document.getElementById("battle-projectiles"),
  battleSoul: document.getElementById("battle-soul"),
  battleControls: document.getElementById("battle-controls"),
  battleSubmenu: document.getElementById("battle-submenu"),
  battleTiming: document.getElementById("battle-timing"),
  battleTimingLabel: document.getElementById("battle-timing-label"),
  battleTimingZone: document.getElementById("battle-timing-zone"),
  battleTimingNeedle: document.getElementById("battle-timing-needle"),
  battleTimingButton: document.getElementById("battle-timing-button"),
  miniPanel: document.getElementById("mini-panel"),
  miniTag: document.getElementById("mini-tag"),
  miniTitle: document.getElementById("mini-title"),
  miniText: document.getElementById("mini-text"),
  miniMeta: document.getElementById("mini-meta"),
  miniStage: document.getElementById("mini-stage"),
  miniSurrender: document.getElementById("mini-surrender"),
  fxFlash: document.getElementById("fx-flash"),
};

const state = {
  currentScene: "intro",
  mode: "story",
  typeToken: 0,
  rafId: 0,
  timers: new Set(),
  keys: new Set(),
  flags: createFlags(),
  battle: null,
  mini: null,
};

function createFlags() {
  return {
    paperSuccess: false,
    coffeeSuccess: false,
    folderSuccess: false,
    clockSuccess: false,
    spared: {
      printer: false,
      dean: false,
      librarian: false,
      security: false,
      methodist: false,
      chat: false,
      mold: false,
      final: false,
    },
  };
}

function rand(min, max) {
  return min + Math.random() * (max - min);
}

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function percent(current, max) {
  if (max <= 0) {
    return 0;
  }
  return clamp((current / max) * 100, 0, 100);
}

function resolveValue(value) {
  if (typeof value === "function") {
    return value(state);
  }
  return value ?? "";
}

function setMode(mode, theme) {
  state.mode = mode;
  document.body.dataset.mode = mode;
  document.body.dataset.theme = theme;
}

function clearTimers() {
  for (const id of state.timers) {
    clearTimeout(id);
  }
  state.timers.clear();
}

function schedule(fn, delay) {
  const id = window.setTimeout(() => {
    state.timers.delete(id);
    fn();
  }, delay);
  state.timers.add(id);
  return id;
}

function stopLoop() {
  if (state.rafId) {
    cancelAnimationFrame(state.rafId);
    state.rafId = 0;
  }
}

function cancelActiveModes() {
  clearTimers();
  stopLoop();
  state.battle = null;
  state.mini = null;
  state.keys.clear();
  document.body.classList.remove("shake", "low-hp");
  ui.fxFlash.classList.remove("visible");
}

function setFlash(color, duration = 180) {
  ui.fxFlash.style.setProperty("--flash-color", color);
  ui.fxFlash.classList.remove("visible");
  void ui.fxFlash.offsetWidth;
  ui.fxFlash.classList.add("visible");
  schedule(() => ui.fxFlash.classList.remove("visible"), duration);
}

function shake(duration = 220) {
  document.body.classList.remove("shake");
  void document.body.offsetWidth;
  document.body.classList.add("shake");
  schedule(() => document.body.classList.remove("shake"), duration);
}

function updateLowHp() {
  const battle = state.battle;
  document.body.classList.toggle("low-hp", Boolean(battle && battle.playerHp <= 8));
}

function renderButtons(container, buttons, handler, className = "choice") {
  container.replaceChildren();
  if (!buttons.length) {
    container.hidden = true;
    return;
  }

  container.hidden = false;
  for (const entry of buttons) {
    const button = document.createElement("button");
    button.type = "button";
    button.className = className;
    button.textContent = entry.label;
    button.addEventListener("click", () => handler(entry));
    container.appendChild(button);
  }
}

function typeText(target, text, speed = 16) {
  const token = ++state.typeToken;
  const content = String(text);
  target.textContent = "";

  let index = 0;
  const tick = () => {
    if (token !== state.typeToken) {
      return;
    }
    target.textContent = content.slice(0, index);
    if (index < content.length) {
      index += 1;
      schedule(tick, speed);
    }
  };

  tick();
}

function resetScenePanels() {
  ui.storyPanel.hidden = true;
  ui.battlePanel.hidden = true;
  ui.miniPanel.hidden = true;
  ui.battlePanel.classList.remove("is-visible");
  ui.miniPanel.classList.remove("is-visible");
}

function revealPanel(panel) {
  panel.classList.remove("is-visible");
  void panel.offsetWidth;
  requestAnimationFrame(() => {
    if (!panel.hidden) {
      panel.classList.add("is-visible");
    }
  });
}

function goTo(sceneId) {
  const scene = SCENES[sceneId];
  if (!scene) {
    throw new Error(`Scene not found: ${sceneId}`);
  }

  state.currentScene = sceneId;
  cancelActiveModes();
  state.typeToken += 1;

  if (scene.kind === "story") {
    renderStory(sceneId);
    return;
  }

  if (scene.kind === "battle") {
    startBattle(sceneId);
    return;
  }

  if (scene.kind === "minigame") {
    startMiniGame(sceneId);
    return;
  }

  throw new Error(`Unknown scene kind: ${scene.kind}`);
}

function renderStory(sceneId) {
  const scene = SCENES[sceneId];
  resetScenePanels();
  ui.storyPanel.hidden = false;
  setMode("story", scene.theme || "home");

  ui.storyTag.textContent = scene.tag || "История";
  ui.storyTitle.textContent = scene.title || "";
  typeText(ui.storyText, resolveValue(scene.text));

  if (scene.ending) {
    ui.storyEnding.hidden = false;
    ui.storyEndingText.textContent = resolveValue(scene.ending);
    ui.storyChoices.hidden = true;
    ui.restartButton.hidden = false;
    return;
  }

  ui.storyEnding.hidden = true;
  ui.storyChoices.hidden = false;
  ui.restartButton.hidden = true;
  renderButtons(ui.storyChoices, scene.choices || [], (choice) => goTo(choice.next));
}

function restartGame() {
  state.flags = createFlags();
  goTo("intro");
}

function applyBattleBonus(boss) {
  const extras = [];
  let enemyHpBonus = 0;
  let playerHpBonus = 0;
  let calmBonus = 0;

  if (boss.id === "printer" && state.flags.paperSuccess) {
    enemyHpBonus -= 4;
    calmBonus += 1;
    extras.push({
      label: "Журнал-щит",
      heal: 6,
      message: "Журнал ловит удар.",
    });
  }

  if (boss.id === "librarian" && state.flags.paperSuccess) {
    enemyHpBonus -= 3;
    calmBonus += 1;
    extras.push({
      label: "Закладка",
      heal: 5,
      message: "Закладка помогает не сгореть.",
    });
  }

  if (boss.id === "security" && state.flags.coffeeSuccess) {
    playerHpBonus += 3;
    extras.push({
      label: "Термокружка",
      heal: 7,
      message: "Кофе вернул наглость.",
    });
  }

  if (boss.id === "methodist" && state.flags.coffeeSuccess) {
    enemyHpBonus -= 3;
    calmBonus += 1;
    extras.push({
      label: "Сахар",
      heal: 6,
      message: "Сахар делает формы менее страшными.",
    });
  }

  if (boss.id === "chat" && state.flags.coffeeSuccess) {
    playerHpBonus += 2;
    enemyHpBonus -= 4;
    extras.push({
      label: "Беззвучный",
      heal: 8,
      message: "Кофе бьёт в голову и спасает день.",
    });
  }

  if (boss.id === "final" && state.flags.paperSuccess && state.flags.coffeeSuccess) {
    enemyHpBonus -= 6;
    playerHpBonus += 4;
    calmBonus += 1;
    extras.push({
      label: "Фартук Гоши",
      heal: 8,
      message: "Гоша выглядит как баг, который никто не смог закрыть.",
    });
  }

  return {
    enemyHpBonus,
    playerHpBonus,
    calmBonus,
    items: extras,
  };
}

function startBattle(sceneId) {
  const scene = SCENES[sceneId];
  const boss = BOSSES[scene.boss];
  const bonus = applyBattleBonus(boss);

  resetScenePanels();
  ui.battlePanel.hidden = false;
  setMode("battle", boss.theme);
  revealPanel(ui.battlePanel);

  state.battle = {
    sceneId,
    boss,
    playerMaxHp: boss.playerMaxHp + bonus.playerHpBonus,
    playerHp: boss.playerMaxHp + bonus.playerHpBonus,
    enemyMaxHp: Math.max(1, boss.enemyMaxHp + bonus.enemyHpBonus),
    enemyHp: Math.max(1, boss.enemyMaxHp + bonus.enemyHpBonus),
    calm: bonus.calmBonus,
    turn: 0,
    phase: "menu",
    items: [...boss.baseItems, ...bonus.items],
    acts: boss.acts,
    attacks: boss.attacks,
    projectiles: [],
    soul: {
      x: 0.5,
      y: 0.5,
      speed: boss.soulSpeed ?? 0.4,
      size: boss.soulSize ?? 28,
    },
    timing: null,
    attack: null,
    attackStartedAt: 0,
    nextSpawnAt: 0,
    attackEndsAt: 0,
    lastFrameAt: 0,
    invulnUntil: 0,
    quietCounter: 0,
    finished: false,
  };

  ui.battleTag.textContent = boss.tag;
  ui.battleTitle.textContent = boss.title;
  ui.battleEnemyName.textContent = boss.enemyName;
  ui.battleMessage.textContent = boss.intro;
  ui.battleSubmenu.hidden = true;
  ui.battleTiming.hidden = true;
  renderBattleHud();
  renderBattleControls();
  updateLowHp();
  flashBattleTheme();
  state.rafId = requestAnimationFrame(battleLoop);
}

function flashBattleTheme() {
  const battle = state.battle;
  if (!battle) {
    return;
  }
  const theme = battle.boss.theme;
  if (theme === "battle-printer") {
    setFlash("rgba(255,255,255,0.45)", 160);
  } else if (theme === "battle-dean") {
    setFlash("rgba(120,80,255,0.26)", 180);
  } else if (theme === "battle-librarian") {
    setFlash("rgba(120,255,220,0.18)", 170);
  } else if (theme === "battle-security") {
    setFlash("rgba(255,200,90,0.18)", 170);
  } else if (theme === "battle-methodist") {
    setFlash("rgba(140,255,160,0.18)", 170);
  } else if (theme === "battle-mold") {
    setFlash("rgba(152,255,110,0.18)", 180);
  } else if (theme === "battle-final") {
    setFlash("rgba(190,255,255,0.22)", 180);
  } else {
    setFlash("rgba(75,220,255,0.22)", 180);
  }
}

function renderBattleHud() {
  const battle = state.battle;
  if (!battle) {
    return;
  }

  ui.battlePlayerHp.textContent = `${Math.ceil(battle.playerHp)} / ${battle.playerMaxHp}`;
  ui.battleEnemyHp.textContent = `${Math.ceil(battle.enemyHp)} / ${battle.enemyMaxHp}`;
  ui.battlePlayerFill.style.width = `${percent(battle.playerHp, battle.playerMaxHp)}%`;
  ui.battleEnemyFill.style.width = `${percent(battle.enemyHp, battle.enemyMaxHp)}%`;

  updateLowHp();
}

function renderBattleControls(disabled = false) {
  const battle = state.battle;
  const visible = Boolean(battle && battle.phase === "menu" && ui.battleSubmenu.hidden);
  ui.battleControls.hidden = !visible;
  for (const button of ui.battleControls.querySelectorAll("button")) {
    button.disabled = disabled || !visible;
  }
}

function openBattleSubmenu(type) {
  const battle = state.battle;
  if (!battle || battle.phase !== "menu") {
    return;
  }

  ui.battleSubmenu.hidden = false;
  ui.battleTiming.hidden = true;

  if (type === "act") {
    renderButtons(ui.battleSubmenu, battle.acts, executeAct, "choice battle-option");
    ui.battleMessage.textContent = "Выбирай действие.";
    renderBattleControls(true);
    return;
  }

  if (type === "item") {
    if (!battle.items.length) {
      ui.battleSubmenu.textContent = "Пусто.";
      renderBattleControls(true);
      schedule(beginEnemyAttack, 420);
      return;
    }
    renderButtons(
      ui.battleSubmenu,
      battle.items.map((item, index) => ({
        label: `${item.label} +${item.heal}`,
        index,
        item,
      })),
      (entry) => useItem(entry.index),
      "choice battle-option",
    );
    ui.battleMessage.textContent = "Выбирай предмет.";
    renderBattleControls(true);
    return;
  }
}

function hideBattleSubmenu() {
  ui.battleSubmenu.hidden = true;
  ui.battleSubmenu.replaceChildren();
}

function setBattleMessage(message) {
  ui.battleMessage.textContent = message;
}

function beginEnemyAttack() {
  const battle = state.battle;
  if (!battle || battle.finished || battle.enemyHp <= 0 || battle.playerHp <= 0) {
    return;
  }

  const attack = battle.attacks[battle.turn % battle.attacks.length];
  const calmFactor = battle.boss.id === "final"
    ? 1
    : 1 - Math.min(0.35, battle.calm * 0.08);
  const difficultyPush = 1 + Math.min(0.22, battle.turn * 0.02);
  battle.attack = {
    ...attack,
    interval: Math.max(100, attack.interval * (1 + battle.calm * 0.04) * 0.88),
    speed: attack.speed * calmFactor * difficultyPush,
    damage: attack.damage + Math.floor(battle.turn / 3),
  };
  battle.phase = "attack";
  battle.attackStartedAt = performance.now();
  battle.nextSpawnAt = battle.attackStartedAt + 120;
  battle.attackEndsAt = battle.attackStartedAt + battle.attack.duration;
  battle.projectiles = [];
  ui.battleProjectiles.replaceChildren();
  ui.battleTiming.hidden = true;
  hideBattleSubmenu();
  renderBattleControls(true);
  setBattleMessage(attack.line);
  battle.turn += 1;
}

function finishBattle(outcome) {
  const battle = state.battle;
  if (!battle || battle.finished) {
    return;
  }

  battle.finished = true;
  state.flags.spared[battle.boss.id] = outcome === "win" || outcome === "spare";
  clearTimers();
  stopLoop();
  renderBattleControls(true);
  hideBattleSubmenu();
  ui.battleTiming.hidden = true;

  if (outcome === "win" || outcome === "spare") {
    setFlash("rgba(255,255,255,0.72)", 200);
    shake(150);
    schedule(() => goTo(battle.boss.winScene), 560);
    return;
  }

  setFlash("rgba(255,80,80,0.44)", 220);
  shake(240);
  schedule(restartGame, 620);
}

function executeAct(entry) {
  const battle = state.battle;
  if (!battle || battle.phase !== "menu") {
    return;
  }

  hideBattleSubmenu();
  battle.calm += entry.calm || 0;
  battle.playerHp = clamp(battle.playerHp + (entry.heal || 0), 0, battle.playerMaxHp);
  const isLibrarian = battle.boss.id === "librarian";
  const damage = isLibrarian ? 0 : (entry.damage || 0);
  battle.enemyHp = clamp(battle.enemyHp - damage, 0, battle.enemyMaxHp);

  if (isLibrarian && entry.calm) {
    battle.quietCounter += 1;
    setBattleMessage(`${entry.message} Тишина растёт (${battle.quietCounter}/3).`);
    renderBattleHud();
    renderBattleControls(true);
    setFlash("rgba(170,255,220,0.26)", 120);

    if (battle.quietCounter >= 3) {
      setBattleMessage("Библиотекарь не выдерживает тишины. Бой окончен.");
      finishBattle("win");
      return;
    }

    schedule(beginEnemyAttack, 620);
    return;
  }

  setBattleMessage(entry.message);
  renderBattleHud();
  renderBattleControls(true);
  setFlash("rgba(255,255,255,0.16)", 120);

  if (battle.enemyHp <= 0) {
    finishBattle("win");
    return;
  }

  schedule(beginEnemyAttack, 420);
}

function useItem(index) {
  const battle = state.battle;
  if (!battle || battle.phase !== "menu") {
    return;
  }

  const item = battle.items[index];
  if (!item) {
    return;
  }

  battle.items.splice(index, 1);
  battle.playerHp = clamp(battle.playerHp + item.heal, 0, battle.playerMaxHp);
  setBattleMessage(item.message);
  hideBattleSubmenu();
  renderBattleHud();
  renderBattleControls(true);
  setFlash("rgba(70,255,210,0.18)", 120);
  schedule(beginEnemyAttack, 420);
}

function startFightTiming() {
  const battle = state.battle;
  if (!battle || battle.phase !== "menu") {
    return;
  }

  hideBattleSubmenu();
  battle.phase = "timing";
  battle.timing = {
    startedAt: performance.now(),
    needle: 0,
    zoneStart: rand(0.58, 0.74),
    zoneWidth: clamp(0.26 - battle.calm * 0.015, 0.14, 0.30),
    speed: 1.32 + battle.turn * 0.095,
    expired: false,
  };
  ui.battleTiming.hidden = false;
  ui.battleTimingLabel.textContent = "Попади в зелёную зону";
  ui.battleTimingButton.textContent = "Стоп";
  renderBattleControls(true);
  setBattleMessage("Смотри на полосу.");
}

function resolveFightStrike() {
  const battle = state.battle;
  if (!battle || battle.phase !== "timing" || !battle.timing) {
    return;
  }

  const timing = battle.timing;
  const center = timing.zoneStart + timing.zoneWidth / 2;
  const distance = Math.abs(timing.needle - center);
  const zoneHalf = timing.zoneWidth / 2;
  const hitRatio = clamp(1 - distance / Math.max(0.001, zoneHalf), 0, 1);
  const isLibrarian = battle.boss.id === "librarian";
  const damage = isLibrarian
    ? 0
    : distance <= zoneHalf
      ? Math.round(18 + hitRatio * 14)
      : Math.round(8 + hitRatio * 6);

  battle.enemyHp = clamp(battle.enemyHp - damage, 0, battle.enemyMaxHp);
  battle.phase = "menu";
  battle.timing = null;
  ui.battleTiming.hidden = true;
  renderBattleControls(false);
  renderBattleHud();

  if (isLibrarian) {
    setBattleMessage("Удар нарушает тишину. Она не сдаётся от силы.");
    setFlash("rgba(255,100,100,0.28)", 120);
  } else if (hitRatio > 0.84) {
    setBattleMessage(`Точный удар! -${damage}`);
    setFlash("rgba(255,255,255,0.72)", 140);
  } else if (distance <= zoneHalf) {
    setBattleMessage(`Удар! -${damage}`);
    setFlash("rgba(255,255,255,0.38)", 120);
  } else {
    setBattleMessage(`Скользящий удар. -${damage}`);
    setFlash("rgba(255,120,120,0.28)", 120);
  }

  if (battle.enemyHp <= 0) {
    finishBattle("win");
    return;
  }

  renderBattleControls(true);
  schedule(beginEnemyAttack, 360);
} 

function updateBattleTiming(now) {
  const battle = state.battle;
  if (!battle || battle.phase !== "timing" || !battle.timing) {
    return;
  }

  const timing = battle.timing;
  const elapsed = (now - timing.startedAt) / 1000;
  const wave = (Math.sin(elapsed * timing.speed * Math.PI * 2) + 1) / 2;
  timing.needle = wave;

  ui.battleTimingNeedle.style.left = `${timing.needle * 100}%`;
  ui.battleTimingZone.style.left = `${timing.zoneStart * 100}%`;
  ui.battleTimingZone.style.width = `${timing.zoneWidth * 100}%`;

  if (elapsed > 4.6 && !timing.expired) {
    timing.expired = true;
    setBattleMessage("Промах.");
    setFlash("rgba(255,100,100,0.22)", 110);
    schedule(resolveFightStrike, 140);
  }
}

function updateBattleSoul(dt, now) {
  const battle = state.battle;
  if (!battle || battle.phase !== "attack") {
    return;
  }

  const bounds = {
    width: ui.battleArena.clientWidth || 1,
    height: ui.battleArena.clientHeight || 1,
  };

  const speed = battle.soul.speed;
  let dx = 0;
  let dy = 0;

  if (state.keys.has("ArrowLeft") || state.keys.has("KeyA")) {
    dx -= 1;
  }
  if (state.keys.has("ArrowRight") || state.keys.has("KeyD")) {
    dx += 1;
  }
  if (state.keys.has("ArrowUp") || state.keys.has("KeyW")) {
    dy -= 1;
  }
  if (state.keys.has("ArrowDown") || state.keys.has("KeyS")) {
    dy += 1;
  }

  const len = Math.hypot(dx, dy) || 1;
  dx /= len;
  dy /= len;

  battle.soul.x = clamp(battle.soul.x + (dx * speed * dt) / bounds.width, 0, 1);
  battle.soul.y = clamp(battle.soul.y + (dy * speed * dt) / bounds.height, 0, 1);

  const soulX = battle.soul.x * bounds.width - battle.soul.size / 2;
  const soulY = battle.soul.y * bounds.height - battle.soul.size / 2;
  ui.battleSoul.style.transform = `translate(${soulX}px, ${soulY}px)`;
}

function makeProjectile(type, x, y, vx, vy, width, height, damage, spin = 0) {
  const node = document.createElement("div");
  node.className = `projectile projectile--${type}`;
  node.style.width = `${width}px`;
  node.style.height = `${height}px`;
  node.style.setProperty("--spin", `${spin}deg`);
  ui.battleProjectiles.appendChild(node);

  return {
    type,
    x,
    y,
    vx,
    vy,
    width,
    height,
    damage,
    spin,
    node,
    hit: false,
  };
}

function spawnBattlePattern(attack, battle) {
  const width = ui.battleArena.clientWidth || 560;
  const height = ui.battleArena.clientHeight || 280;
  const turn = battle.turn;

  switch (attack.pattern) {
    case "printerRain": {
      const count = 2 + (turn % 2);
      for (let i = 0; i < count; i += 1) {
        battle.projectiles.push(
          makeProjectile(
            "paper",
            rand(0, width - 24),
            -18 - i * 10,
            rand(-26, 26),
            rand(attack.speed * 0.82, attack.speed * 1.08),
            rand(16, 24),
            rand(7, 11),
            attack.damage,
            rand(-14, 14),
          ),
        );
      }
      if (turn % 2 === 1) {
        battle.projectiles.push(
          makeProjectile(
            "paper",
            -18,
            rand(30, height - 30),
            rand(attack.speed * 1.0, attack.speed * 1.3),
            rand(-24, 24),
            18,
            8,
            attack.damage,
            rand(-10, 10),
          ),
        );
      }
      break;
    }
    case "printerSides": {
      battle.projectiles.push(
        makeProjectile(
          "paper",
          -18,
          rand(20, height - 20),
          attack.speed * 1.15,
          rand(-16, 16),
          20,
          8,
          attack.damage,
          rand(-10, 10),
        ),
      );
      battle.projectiles.push(
        makeProjectile(
          "paper",
          width + 18,
          rand(20, height - 20),
          -attack.speed * 1.15,
          rand(-16, 16),
          20,
          8,
          attack.damage,
          rand(-10, 10),
        ),
      );
      break;
    }
    case "printerJam": {
      for (let i = 0; i < 3; i += 1) {
        battle.projectiles.push(
          makeProjectile(
            "paper",
            rand(20, width - 20),
            -20,
            rand(-18, 18),
            attack.speed * (1.1 + i * 0.08),
            rand(18, 28),
            rand(8, 12),
            attack.damage + 1,
            rand(-18, 18),
          ),
        );
      }
      battle.projectiles.push(
        makeProjectile(
          "paper",
          rand(width * 0.2, width * 0.8),
          height + 18,
          rand(-12, 12),
          -attack.speed * 1.08,
          30,
          10,
          attack.damage,
          rand(-14, 14),
        ),
      );
      break;
    }
    case "deanStamp": {
      battle.projectiles.push(
        makeProjectile(
          "stamp",
          rand(0, width - 20),
          -16,
          rand(-14, 14),
          attack.speed,
          20,
          20,
          attack.damage,
          rand(-8, 8),
        ),
      );
      battle.projectiles.push(
        makeProjectile(
          "stamp",
          -18,
          rand(0, height - 20),
          attack.speed * 0.95,
          rand(-34, 34),
          18,
          18,
          attack.damage,
          rand(-8, 8),
        ),
      );
      battle.projectiles.push(
        makeProjectile(
          "stamp",
          width + 18,
          rand(0, height - 20),
          -attack.speed * 0.95,
          rand(-34, 34),
          18,
          18,
          attack.damage,
          rand(-8, 8),
        ),
      );
      break;
    }
    case "deanCross": {
      battle.projectiles.push(
        makeProjectile(
          "stamp",
          rand(0, width - 24),
          -18,
          rand(-30, 30),
          attack.speed * 1.08,
          22,
          22,
          attack.damage,
          rand(-8, 8),
        ),
      );
      battle.projectiles.push(
        makeProjectile(
          "stamp",
          rand(0, width - 24),
          height + 18,
          rand(-30, 30),
          -attack.speed * 1.08,
          22,
          22,
          attack.damage,
          rand(-8, 8),
        ),
      );
      break;
    }
    case "deanSweep": {
      const fromLeft = turn % 2 === 0;
      battle.projectiles.push(
        makeProjectile(
          "stamp",
          fromLeft ? -18 : width + 18,
          rand(20, height - 20),
          fromLeft ? attack.speed * 1.2 : -attack.speed * 1.2,
          rand(-14, 14),
          24,
          24,
          attack.damage + 1,
          rand(-8, 8),
        ),
      );
      battle.projectiles.push(
        makeProjectile(
          "stamp",
          rand(width * 0.15, width * 0.85),
          -18,
          rand(-10, 10),
          attack.speed * 0.92,
          22,
          22,
          attack.damage,
          rand(-8, 8),
        ),
      );
      battle.projectiles.push(
        makeProjectile(
          "laser",
          fromLeft ? -24 : width + 24,
          rand(24, height - 24),
          fromLeft ? attack.speed * 1.35 : -attack.speed * 1.35,
          rand(-6, 6),
          220,
          12,
          attack.damage,
          0,
        ),
      );
      break;
    }
    case "chatFlood": {
      battle.projectiles.push(
        makeProjectile(
          "message",
          rand(0, width - 26),
          -16,
          rand(-10, 10),
          attack.speed,
          26,
          18,
          attack.damage,
          rand(-5, 5),
        ),
      );
      if (turn % 2 === 0) {
        battle.projectiles.push(
          makeProjectile(
            "ping",
            -18,
            rand(20, height - 20),
            attack.speed * 1.12,
            rand(-12, 12),
            16,
            16,
            attack.damage,
            rand(-5, 5),
          ),
        );
      } else {
        battle.projectiles.push(
          makeProjectile(
            "ping",
            width + 18,
            rand(20, height - 20),
            -attack.speed * 1.12,
            rand(-12, 12),
            16,
            16,
            attack.damage,
            rand(-5, 5),
          ),
        );
      }
      break;
    }
    case "chatMessage": {
      battle.projectiles.push(
        makeProjectile(
          "message",
          rand(0, width - 28),
          -18,
          rand(-18, 18),
          attack.speed * 1.02,
          28,
          20,
          attack.damage,
          rand(-5, 5),
        ),
      );
      battle.projectiles.push(
        makeProjectile(
          "message",
          width + 18,
          rand(0, height - 20),
          -attack.speed * 1.02,
          rand(-20, 20),
          28,
          20,
          attack.damage,
          rand(-5, 5),
        ),
      );
      break;
    }
    case "chatBurst": {
      for (let i = 0; i < 3; i += 1) {
        battle.projectiles.push(
          makeProjectile(
            "ping",
            rand(0, width - 16),
            rand(0, height - 16),
            rand(-attack.speed, attack.speed),
            rand(-attack.speed, attack.speed),
            16,
            16,
            attack.damage + (i > 1 ? 1 : 0),
            rand(-5, 5),
          ),
        );
      }
      battle.projectiles.push(
        makeProjectile(
          "laser",
          rand(20, width - 20),
          -18,
          0,
          attack.speed * 1.22,
          18,
          120,
          attack.damage + 1,
          0,
        ),
      );
      break;
    }
    case "bookRain": {
      const count = 2 + (turn % 2);
      for (let i = 0; i < count; i += 1) {
        battle.projectiles.push(
          makeProjectile(
            "book",
            rand(0, width - 28),
            -22 - i * 8,
            rand(-18, 18),
            attack.speed * rand(0.92, 1.08),
            rand(22, 30),
            rand(10, 14),
            attack.damage,
            rand(-12, 12),
          ),
        );
      }
      break;
    }
    case "shelfSweep": {
      const fromLeft = turn % 2 === 0;
      battle.projectiles.push(
        makeProjectile(
          "book",
          fromLeft ? -24 : width + 24,
          rand(24, height - 24),
          fromLeft ? attack.speed * 1.18 : -attack.speed * 1.18,
          rand(-12, 12),
          30,
          14,
          attack.damage + 1,
          rand(-12, 12),
        ),
      );
      battle.projectiles.push(
        makeProjectile(
          "book",
          rand(width * 0.2, width * 0.8),
          -18,
          rand(-10, 10),
          attack.speed * 0.95,
          24,
          12,
          attack.damage,
          rand(-10, 10),
        ),
      );
      break;
    }
    case "bookmarkCross": {
      battle.projectiles.push(
        makeProjectile(
          "book",
          rand(0, width - 26),
          -18,
          rand(-14, 14),
          attack.speed * 1.02,
          26,
          12,
          attack.damage,
          rand(-10, 10),
        ),
      );
      battle.projectiles.push(
        makeProjectile(
          "book",
          rand(0, width - 26),
          height + 18,
          rand(-14, 14),
          -attack.speed * 1.02,
          26,
          12,
          attack.damage,
          rand(-10, 10),
        ),
      );
      battle.projectiles.push(
        makeProjectile(
          "stripe",
          rand(0, width - 180),
          rand(24, height - 24),
          0,
          attack.speed * 0.68,
          180,
          12,
          attack.damage,
          0,
        ),
      );
      break;
    }
    case "badgeRain": {
      for (let i = 0; i < 3; i += 1) {
        battle.projectiles.push(
          makeProjectile(
            "badge",
            rand(0, width - 22),
            -18 - i * 6,
            rand(-10, 10),
            attack.speed * (0.95 + i * 0.05),
            22,
            22,
            attack.damage,
            rand(-8, 8),
          ),
        );
      }
      break;
    }
    case "spotlightSweep": {
      const targetY = clamp(battle.soul.y * height - 8, 12, height - 20);
      battle.projectiles.push(
        makeProjectile(
          "beam",
          -240,
          targetY,
          attack.speed * 1.45,
          0,
          240,
          16,
          attack.damage + 1,
          0,
        ),
      );
      battle.projectiles.push(
        makeProjectile(
          "beam",
          width + 240,
          rand(10, height - 26),
          -attack.speed * 1.45,
          0,
          240,
          16,
          attack.damage + 1,
          0,
        ),
      );
      break;
    }
    case "tapeLine": {
      const fromTop = turn % 2 === 0;
      battle.projectiles.push(
        makeProjectile(
          "badge",
          rand(16, width - 36),
          fromTop ? -20 : height + 20,
          rand(-8, 8),
          fromTop ? attack.speed * 1.12 : -attack.speed * 1.12,
          24,
          24,
          attack.damage,
          rand(-8, 8),
        ),
      );
      battle.projectiles.push(
        makeProjectile(
          "beam",
          fromTop ? -220 : width + 220,
          rand(20, height - 20),
          fromTop ? attack.speed * 1.3 : -attack.speed * 1.3,
          0,
          220,
          12,
          attack.damage,
          0,
        ),
      );
      break;
    }
    case "formRain": {
      for (let i = 0; i < 3; i += 1) {
        battle.projectiles.push(
          makeProjectile(
            "form",
            rand(0, width - 24),
            -20 - i * 8,
            rand(-12, 12),
            attack.speed * (0.98 + i * 0.06),
            24,
            16,
            attack.damage,
            rand(-8, 8),
          ),
        );
      }
      break;
    }
    case "signatureWall": {
      battle.projectiles.push(
        makeProjectile(
          "form",
          -22,
          rand(18, height - 18),
          attack.speed * 1.12,
          rand(-14, 14),
          26,
          16,
          attack.damage + 1,
          rand(-8, 8),
        ),
      );
      battle.projectiles.push(
        makeProjectile(
          "form",
          width + 22,
          rand(18, height - 18),
          -attack.speed * 1.12,
          rand(-14, 14),
          26,
          16,
          attack.damage + 1,
          rand(-8, 8),
        ),
      );
      break;
    }
    case "deadlineRush": {
      battle.projectiles.push(
        makeProjectile(
          "form",
          rand(20, width - 20),
          height + 18,
          rand(-10, 10),
          -attack.speed * 1.15,
          28,
          18,
          attack.damage,
          rand(-8, 8),
        ),
      );
      battle.projectiles.push(
        makeProjectile(
          "stripe",
          rand(0, width - 220),
          rand(24, height - 24),
          0,
          attack.speed * 0.82,
          220,
          14,
          attack.damage,
          0,
        ),
      );
      battle.projectiles.push(
        makeProjectile(
          "badge",
          rand(0, width - 20),
          -18,
          rand(-10, 10),
          attack.speed * 1.12,
          20,
          20,
          attack.damage,
          rand(-8, 8),
        ),
      );
      break;
    }
    case "sansBoneRain": {
      const count = 3 + (turn % 2);
      for (let i = 0; i < count; i += 1) {
        battle.projectiles.push(
          makeProjectile(
            "bone",
            rand(0, width - 30),
            -30 - i * 14,
            rand(-16, 16),
            attack.speed * rand(0.9, 1.12),
            rand(22, 34),
            rand(12, 16),
            attack.damage,
            rand(-12, 12),
          ),
        );
      }
      break;
    }
    case "sansBoneWalls": {
      const fromLeft = turn % 2 === 0;
      battle.projectiles.push(
        makeProjectile(
          "bone",
          fromLeft ? -28 : width + 28,
          rand(24, height - 24),
          fromLeft ? attack.speed * 1.28 : -attack.speed * 1.28,
          rand(-12, 12),
          34,
          16,
          attack.damage + 1,
          0,
        ),
      );
      battle.projectiles.push(
        makeProjectile(
          "bone",
          rand(18, width - 18),
          -24,
          rand(-8, 8),
          attack.speed * 1.05,
          22,
          14,
          attack.damage,
          0,
        ),
      );
      battle.projectiles.push(
        makeProjectile(
          "bone",
          rand(18, width - 18),
          height + 24,
          rand(-8, 8),
          -attack.speed * 1.05,
          22,
          14,
          attack.damage,
          0,
        ),
      );
      break;
    }
    case "sansBlasterFan": {
      const y = clamp(battle.soul.y * height - 7, 12, height - 24);
      battle.projectiles.push(
        makeProjectile(
          "beam",
          -260,
          y,
          attack.speed * 1.55,
          0,
          260,
          14,
          attack.damage + 1,
          0,
        ),
      );
      battle.projectiles.push(
        makeProjectile(
          "beam",
          width + 260,
          rand(12, height - 26),
          -attack.speed * 1.55,
          0,
          260,
          14,
          attack.damage + 1,
          0,
        ),
      );
      break;
    }
    case "sansCross": {
      battle.projectiles.push(
        makeProjectile(
          "bone",
          rand(0, width - 28),
          -20,
          rand(-12, 12),
          attack.speed * 1.08,
          28,
          16,
          attack.damage,
          0,
        ),
      );
      battle.projectiles.push(
        makeProjectile(
          "bone",
          rand(0, width - 28),
          height + 20,
          rand(-12, 12),
          -attack.speed * 1.08,
          28,
          16,
          attack.damage,
          0,
        ),
      );
      battle.projectiles.push(
        makeProjectile(
          "beam",
          turn % 2 === 0 ? -180 : width + 180,
          rand(24, height - 24),
          turn % 2 === 0 ? attack.speed * 1.2 : -attack.speed * 1.2,
          0,
          180,
          12,
          attack.damage,
          0,
        ),
      );
      break;
    }
    case "sansBarrier": {
      battle.projectiles.push(
        makeProjectile(
          "beam",
          -260,
          rand(24, height - 34),
          attack.speed * 1.25,
          0,
          260,
          16,
          attack.damage + 1,
          0,
        ),
      );
      battle.projectiles.push(
        makeProjectile(
          "beam",
          width + 260,
          rand(24, height - 34),
          -attack.speed * 1.25,
          0,
          260,
          16,
          attack.damage + 1,
          0,
        ),
      );
      battle.projectiles.push(
        makeProjectile(
          "bone",
          rand(20, width - 40),
          rand(20, height - 20),
          rand(-attack.speed * 0.4, attack.speed * 0.4),
          attack.speed * 0.7,
          26,
          18,
          attack.damage,
          0,
        ),
      );
      break;
    }
    case "sansSweep": {
      const fromTop = turn % 2 === 0;
      battle.projectiles.push(
        makeProjectile(
          "bone",
          rand(24, width - 24),
          fromTop ? -24 : height + 24,
          rand(-10, 10),
          fromTop ? attack.speed * 1.22 : -attack.speed * 1.22,
          30,
          18,
          attack.damage + 1,
          0,
        ),
      );
      battle.projectiles.push(
        makeProjectile(
          "bone",
          fromTop ? -24 : width + 24,
          rand(24, height - 24),
          fromTop ? attack.speed * 1.22 : -attack.speed * 1.22,
          rand(-12, 12),
          30,
          18,
          attack.damage + 1,
          0,
        ),
      );
      break;
    }
    case "sansTrap": {
      const gapY = clamp(battle.soul.y * height - 6, 16, height - 32);
      battle.projectiles.push(
        makeProjectile(
          "bone",
          -24,
          gapY,
          attack.speed * 1.2,
          0,
          36,
          14,
          attack.damage + 1,
          0,
        ),
      );
      battle.projectiles.push(
        makeProjectile(
          "bone",
          width + 24,
          gapY + 18,
          -attack.speed * 1.2,
          0,
          36,
          14,
          attack.damage + 1,
          0,
        ),
      );
      battle.projectiles.push(
        makeProjectile(
          "beam",
          rand(0, width - 210),
          rand(16, height - 28),
          rand(-6, 6),
          0,
          210,
          12,
          attack.damage,
          0,
        ),
      );
      break;
    }
    case "moldSporeRain": {
      const count = 4 + (turn % 2);
      for (let i = 0; i < count; i += 1) {
        battle.projectiles.push(
          makeProjectile(
            "spore",
            rand(0, width - 18),
            -18 - i * 10,
            rand(-20, 20),
            attack.speed * rand(1.0, 1.22),
            rand(14, 18),
            rand(14, 18),
            attack.damage,
            rand(-20, 20),
          ),
        );
      }
      if (turn % 2 === 0) {
        battle.projectiles.push(
          makeProjectile(
            "slime",
            -20,
            rand(18, height - 18),
            attack.speed * 1.1,
            rand(-10, 10),
            18,
            18,
            attack.damage,
            rand(-10, 10),
          ),
        );
      } else {
        battle.projectiles.push(
          makeProjectile(
            "slime",
            width + 20,
            rand(18, height - 18),
            -attack.speed * 1.1,
            rand(-10, 10),
            18,
            18,
            attack.damage,
            rand(-10, 10),
          ),
        );
      }
      break;
    }
    case "fridgeClamp": {
      const laneY = rand(30, height - 70);
      battle.projectiles.push(
        makeProjectile(
          "door",
          -40,
          laneY,
          attack.speed * 1.32,
          0,
          250,
          42,
          attack.damage + 1,
          0,
        ),
      );
      battle.projectiles.push(
        makeProjectile(
          "door",
          width - 210,
          laneY + 12,
          -attack.speed * 1.32,
          0,
          250,
          42,
          attack.damage + 1,
          0,
        ),
      );
      battle.projectiles.push(
        makeProjectile(
          "spore",
          rand(width * 0.24, width * 0.76),
          -20,
          rand(-12, 12),
          attack.speed * 1.04,
          16,
          16,
          attack.damage,
          rand(-10, 10),
        ),
      );
      break;
    }
    case "moldBarrier": {
      const laneY = rand(30, height - 64);
      battle.projectiles.push(
        makeProjectile(
          "door",
          -50,
          laneY,
          attack.speed * 1.3,
          0,
          280,
          40,
          attack.damage + 1,
          0,
        ),
      );
      battle.projectiles.push(
        makeProjectile(
          "door",
          width + 50,
          laneY + 18,
          -attack.speed * 1.3,
          0,
          280,
          40,
          attack.damage + 1,
          0,
        ),
      );
      break;
    }
    case "slimeFlood": {
      const edges = [
        { x: rand(0, width - 18), y: -20, vx: rand(-14, 14), vy: attack.speed * 1.28 },
        { x: width + 20, y: rand(0, height - 18), vx: -attack.speed * 1.28, vy: rand(-14, 14) },
        { x: rand(0, width - 18), y: height + 20, vx: rand(-14, 14), vy: -attack.speed * 1.28 },
        { x: -20, y: rand(0, height - 18), vx: attack.speed * 1.28, vy: rand(-14, 14) },
      ];
      const count = 3 + (turn % 2);
      for (let i = 0; i < count; i += 1) {
        const edge = edges[(turn + i) % edges.length];
        battle.projectiles.push(
          makeProjectile(
            "slime",
            edge.x,
            edge.y,
            edge.vx + rand(-10, 10),
            edge.vy + rand(-10, 10),
            20,
            20,
            attack.damage + (i === count - 1 ? 1 : 0),
            rand(-8, 8),
          ),
        );
      }
      break;
    }
    case "moldCross": {
      battle.projectiles.push(
        makeProjectile(
          "spore",
          rand(0, width - 18),
          -18,
          rand(-12, 12),
          attack.speed * 1.14,
          16,
          16,
          attack.damage,
          rand(-8, 8),
        ),
      );
      battle.projectiles.push(
        makeProjectile(
          "spore",
          rand(0, width - 18),
          height + 18,
          rand(-12, 12),
          -attack.speed * 1.14,
          16,
          16,
          attack.damage,
          rand(-8, 8),
        ),
      );
      battle.projectiles.push(
        makeProjectile(
          "slime",
          -18,
          rand(20, height - 20),
          attack.speed * 1.22,
          rand(-10, 10),
          18,
          18,
          attack.damage + 1,
          rand(-8, 8),
        ),
      );
      battle.projectiles.push(
        makeProjectile(
          "slime",
          width + 18,
          rand(20, height - 20),
          -attack.speed * 1.22,
          rand(-10, 10),
          18,
          18,
          attack.damage + 1,
          rand(-8, 8),
        ),
      );
      break;
    }
    case "fridgeSlice": {
      const topLane = turn % 2 === 0;
      battle.projectiles.push(
        makeProjectile(
          "door",
          topLane ? -48 : width + 48,
          rand(18, height - 80),
          topLane ? attack.speed * 1.38 : -attack.speed * 1.38,
          0,
          220,
          40,
          attack.damage + 1,
          0,
        ),
      );
      battle.projectiles.push(
        makeProjectile(
          "spore",
          rand(16, width - 16),
          topLane ? -16 : height + 16,
          rand(-10, 10),
          topLane ? attack.speed * 1.18 : -attack.speed * 1.18,
          16,
          16,
          attack.damage,
          rand(-10, 10),
        ),
      );
      battle.projectiles.push(
        makeProjectile(
          "slime",
          rand(width * 0.2, width * 0.8),
          rand(20, height - 20),
          rand(-18, 18),
          rand(-18, 18),
          18,
          18,
          attack.damage,
          rand(-8, 8),
        ),
      );
      break;
    }
    default:
      break;
  }
}

function updateProjectiles(dt, now) {
  const battle = state.battle;
  if (!battle) {
    return;
  }

  const width = ui.battleArena.clientWidth || 560;
  const height = ui.battleArena.clientHeight || 280;
  const soulRect = {
    x: battle.soul.x * width - battle.soul.size / 2,
    y: battle.soul.y * height - battle.soul.size / 2,
    w: battle.soul.size,
    h: battle.soul.size,
  };

  for (const projectile of battle.projectiles) {
    projectile.x += (projectile.vx * dt) / 1000;
    projectile.y += (projectile.vy * dt) / 1000;
    projectile.node.style.transform = `translate(${projectile.x}px, ${projectile.y}px) rotate(${projectile.spin}deg)`;
  }

  const remaining = [];
  for (const projectile of battle.projectiles) {
    const offScreen =
      projectile.x + projectile.width < -40 ||
      projectile.x > width + 40 ||
      projectile.y + projectile.height < -40 ||
      projectile.y > height + 40;
    if (offScreen) {
      projectile.node.remove();
      continue;
    }

    const hit = rectsOverlap(
      soulRect,
      {
        x: projectile.x,
        y: projectile.y,
        w: projectile.width,
        h: projectile.height,
      },
    );

    if (hit && now >= battle.invulnUntil) {
      battle.playerHp = clamp(battle.playerHp - projectile.damage, 0, battle.playerMaxHp);
      battle.invulnUntil = now + 260;
      projectile.node.remove();
      setFlash("rgba(255,90,90,0.42)", 110);
      shake(90);
      continue;
    }

    remaining.push(projectile);
  }

  battle.projectiles = remaining;
}

function rectsOverlap(a, b) {
  return !(
    a.x + a.w < b.x ||
    a.x > b.x + b.w ||
    a.y + a.h < b.y ||
    a.y > b.y + b.h
  );
}

function updateBattleRender() {
  const battle = state.battle;
  if (!battle) {
    return;
  }

  ui.battlePlayerHp.textContent = `${Math.ceil(battle.playerHp)} / ${battle.playerMaxHp}`;
  ui.battleEnemyHp.textContent = `${Math.ceil(battle.enemyHp)} / ${battle.enemyMaxHp}`;
  ui.battlePlayerFill.style.width = `${percent(battle.playerHp, battle.playerMaxHp)}%`;
  ui.battleEnemyFill.style.width = `${percent(battle.enemyHp, battle.enemyMaxHp)}%`;

  updateLowHp();
}

function battleLoop(now) {
  const battle = state.battle;
  if (!battle || battle.finished) {
    return;
  }

  const dt = battle.lastFrameAt ? now - battle.lastFrameAt : 16;
  battle.lastFrameAt = now;

  if (battle.phase === "timing") {
    updateBattleTiming(now);
  } else if (battle.phase === "attack") {
    updateBattleSoul(dt, now);

    if (now >= battle.nextSpawnAt && now < battle.attackEndsAt) {
      spawnBattlePattern(battle.attack, battle);
      battle.nextSpawnAt += battle.attack.interval;
    }

    updateProjectiles(dt, now);

    if (battle.playerHp <= 0) {
      finishBattle("lose");
      return;
    }

    if (now >= battle.attackEndsAt) {
      battle.phase = "menu";
      battle.attack = null;
      battle.projectiles.forEach((projectile) => projectile.node.remove());
      battle.projectiles = [];
      ui.battleProjectiles.replaceChildren();
      ui.battleTiming.hidden = true;
      renderBattleControls(false);
      ui.battleMessage.textContent = "Твой ход.";
    }
  }

  updateBattleRender();
  if (!battle.finished) {
    state.rafId = requestAnimationFrame(battleLoop);
  }
}

function handleBattleCommand(command) {
  const battle = state.battle;
  if (!battle || battle.phase !== "menu") {
    return;
  }

  if (command === "fight") {
    startFightTiming();
    return;
  }

  if (command === "act") {
    openBattleSubmenu("act");
    return;
  }

  if (command === "item") {
    openBattleSubmenu("item");
    return;
  }
}

function startMiniGame(sceneId) {
  const scene = SCENES[sceneId];
  const mini = MINI_GAMES[scene.mini];

  resetScenePanels();
  ui.miniPanel.hidden = false;
  setMode("minigame", mini.theme);
  revealPanel(ui.miniPanel);

  state.mini = {
    sceneId,
    mini,
    startedAt: performance.now(),
    lastFrameAt: 0,
    finished: false,
    pieces: [],
    collected: 0,
    spawnAccumulator: 0,
    elapsed: 0,
    misses: 0,
    rounds: 0,
    score: 0,
    needle: 0,
    needleDirection: 1,
    zoneStart: mini.id === "clock" ? rand(0.42, 0.78) : 0.66,
    zoneWidth: mini.id === "clock" ? 0.12 : 0.16,
    hint: mini.hint,
    actionLabel: mini.actionLabel,
  };

  ui.miniTag.textContent = mini.tag;
  ui.miniTitle.textContent = mini.title;
  ui.miniText.textContent = mini.text;
  ui.miniSurrender.textContent = mini.actionLabel;
  ui.miniMeta.textContent = mini.hint;
  ui.miniStage.replaceChildren();
  ui.miniPanel.className = "panel mini-panel";
  ui.miniPanel.dataset.minigame = mini.id;

  if (mini.id === "papers" || mini.id === "folders") {
    setupPaperMini();
  } else {
    setupCoffeeMini();
  }

  updateMiniHud();
  setFlash("rgba(255,255,255,0.12)", 100);
  state.rafId = requestAnimationFrame(miniLoop);
}

function setupPaperMini() {
  const mini = state.mini;
  const isFolder = mini && mini.mini.id === "folders";
  ui.miniStage.innerHTML = `
    <div class="${isFolder ? "mini-folder-rain" : "mini-paper-rain"}"></div>
    <div class="mini-paper-hud">
      <span id="paper-count">0 / ${mini ? mini.mini.goal : 0}</span>
      <span id="paper-time">${((mini ? mini.mini.duration : 0) / 1000).toFixed(1)}s</span>
    </div>
  `;
}

function setupCoffeeMini() {
  ui.miniStage.innerHTML = `
    <div class="mini-coffee-shell">
      <div class="mini-coffee-top">
        <span id="coffee-round">Раунд 1 / 3</span>
        <span id="coffee-miss">Промахи 0 / 2</span>
      </div>
      <div class="mini-coffee-bar">
        <div class="mini-coffee-zone"></div>
        <div class="mini-coffee-needle"></div>
      </div>
      <div class="mini-coffee-cup">☕</div>
    </div>
  `;
}

function updateMiniHud() {
  const mini = state.mini;
  if (!mini) {
    return;
  }

  if (mini.mini.id === "papers" || mini.mini.id === "folders") {
    const config = MINI_GAMES[mini.mini.id];
    const count = ui.miniStage.querySelector("#paper-count");
    const time = ui.miniStage.querySelector("#paper-time");
    if (count) {
      count.textContent = `${mini.collected} / ${config.goal}`;
    }
    if (time) {
      const left = Math.max(0, (config.duration - mini.elapsed) / 1000);
      time.textContent = `${left.toFixed(1)}s`;
    }
    ui.miniMeta.textContent = mini.hint;
    return;
  }

  if (mini.mini.id === "coffee" || mini.mini.id === "clock") {
    const round = ui.miniStage.querySelector("#coffee-round");
    const miss = ui.miniStage.querySelector("#coffee-miss");
    if (round) {
      round.textContent = `Раунд ${mini.rounds + 1} / ${MINI_GAMES.coffee.rounds}`;
    }
    if (miss) {
      miss.textContent = `Промахи ${mini.misses} / ${MINI_GAMES.coffee.maxMisses}`;
    }
    ui.miniMeta.textContent = mini.hint;

    const zone = ui.miniStage.querySelector(".mini-coffee-zone");
    const needle = ui.miniStage.querySelector(".mini-coffee-needle");
    if (zone) {
      zone.style.left = `${mini.zoneStart * 100}%`;
      zone.style.width = `${mini.zoneWidth * 100}%`;
    }
    if (needle) {
      needle.style.left = `${mini.needle * 100}%`;
    }
  }
}

function createPaperPiece() {
  const mini = state.mini;
  const isFolder = mini && mini.mini.id === "folders";
  const piece = document.createElement("button");
  piece.type = "button";
  piece.className = isFolder ? "mini-folder" : "mini-paper";
  piece.textContent = isFolder ? "папка" : "лист";
  piece.setAttribute("aria-label", isFolder ? "Папка" : "Лист бумаги");
  piece.style.left = `${rand(4, 88)}%`;
  piece.style.top = `${rand(8, 78)}%`;

  const data = {
    el: piece,
    x: rand(0, 88),
    y: rand(8, 76),
    vx: rand(-12, 12),
    vy: rand(-10, 10),
    spin: rand(-15, 15),
    drift: rand(-8, 8),
  };

  piece.addEventListener("click", () => collectPaperPiece(data));
  ui.miniStage.appendChild(piece);
  return data;
}

function collectPaperPiece(piece) {
  const mini = state.mini;
  if (!mini || mini.finished) {
    return;
  }

  piece.el.classList.add("picked");
  setFlash("rgba(255,255,255,0.48)", 100);
  mini.collected += 1;
  updateMiniHud();
  schedule(() => piece.el.remove(), 120);

  if (mini.collected >= MINI_GAMES.papers.goal) {
    finishMiniGame(true);
  }
}

function actionMiniGame() {
  const mini = state.mini;
  if (!mini || mini.finished) {
    return;
  }

  if (mini.mini.id === "papers") {
    finishMiniGame(false);
    return;
  }

  if (mini.mini.id === "coffee") {
    resolveCoffeeStop();
  }
}

function resolveCoffeeStop() {
  const mini = state.mini;
  if (!mini || mini.finished) {
    return;
  }

  const center = mini.zoneStart + mini.zoneWidth / 2;
  const distance = Math.abs(mini.needle - center);
  if (distance <= mini.zoneWidth / 2) {
    mini.rounds += 1;
    setFlash("rgba(70,255,190,0.30)", 120);
    mini.zoneWidth = clamp(mini.zoneWidth - 0.01, 0.08, 0.18);
    mini.zoneStart = rand(0.16, 0.78);
    mini.needle = 0.02;
    mini.needleDirection = 1;
    mini.hint = "Есть попадание.";
    updateMiniHud();
    if (mini.rounds >= MINI_GAMES.coffee.rounds) {
      finishMiniGame(true);
      return;
    }
    return;
  }

  mini.misses += 1;
  mini.hint = "Мимо.";
  setFlash("rgba(255,80,80,0.28)", 110);
  updateMiniHud();
  if (mini.misses > MINI_GAMES.coffee.maxMisses) {
    finishMiniGame(false);
  }
}

function finishMiniGame(success) {
  const mini = state.mini;
  if (!mini || mini.finished) {
    return;
  }

  mini.finished = true;
  clearTimers();
  stopLoop();

  if (mini.mini.rewardFlag) {
    state.flags[mini.mini.rewardFlag] = success;
  }

  if (mini.mini.id === "papers" && success) {
    setFlash("rgba(255,255,255,0.62)", 180);
    shake(120);
  } else if (mini.mini.id === "coffee" && success) {
    setFlash("rgba(255,190,80,0.34)", 160);
  } else {
    setFlash("rgba(255,80,80,0.22)", 120);
  }

  const nextScene = success ? mini.mini.nextSuccess : mini.mini.nextFail;
  const note = success
    ? "Успех."
    : mini.mini.id === "papers"
      ? "Листы унесло."
      : "Кофе не успел.";
  ui.miniMeta.textContent = note;

  schedule(() => goTo(nextScene), 520);
}

function updatePaperMini(dt, now) {
  const mini = state.mini;
  const config = MINI_GAMES[mini.mini.id];

  mini.spawnAccumulator += dt;
  while (mini.pieces.length < 12 && mini.spawnAccumulator >= 600) {
    mini.pieces.push(createPaperPiece());
    mini.spawnAccumulator -= 600;
  }

  for (const piece of mini.pieces) {
    const step = dt / 1000;
    piece.x += piece.vx * step;
    piece.y += piece.vy * step;
    piece.vx += piece.drift * step * 0.12;
    piece.spin += dt * 0.024;

    if (piece.x < 0) {
      piece.x = 100;
    }
    if (piece.x > 100) {
      piece.x = 0;
    }
    if (piece.y < 0) {
      piece.y = 80;
    }
    if (piece.y > 80) {
      piece.y = 0;
    }

    piece.el.style.left = `${piece.x}%`;
    piece.el.style.top = `${piece.y}%`;
    piece.el.style.setProperty("--spin", `${piece.spin}deg`);
  }

  mini.elapsed = now - mini.startedAt;
  ui.miniStage.querySelector("#paper-time").textContent = `${Math.max(
    0,
    (config.duration - mini.elapsed) / 1000,
  ).toFixed(1)}s`;
  ui.miniStage.querySelector("#paper-count").textContent = `${mini.collected} / ${config.goal}`;

  if (mini.elapsed >= config.duration) {
    finishMiniGame(false);
    return;
  }

  updateMiniHud();
}

function updateCoffeeMini(now) {
  const mini = state.mini;
  const config = MINI_GAMES.coffee;

  const elapsed = (now - mini.startedAt) / 1000;
  mini.needle = (Math.sin(elapsed * 2.5) + 1) / 2;

  const zone = ui.miniStage.querySelector(".mini-coffee-zone");
  const needle = ui.miniStage.querySelector(".mini-coffee-needle");
  if (zone) {
    zone.style.left = `${mini.zoneStart * 100}%`;
    zone.style.width = `${mini.zoneWidth * 100}%`;
  }
  if (needle) {
    needle.style.left = `${mini.needle * 100}%`;
  }

  updateMiniHud();
}

function miniLoop(now) {
  const mini = state.mini;
  if (!mini || mini.finished) {
    return;
  }

  if (!mini.lastFrameAt) {
    mini.lastFrameAt = now;
  }

  const dt = now - mini.lastFrameAt;
  mini.lastFrameAt = now;

  if (mini.mini.id === "papers") {
    updatePaperMini(dt, now);
  } else {
    updateCoffeeMini(now);
  }

  if (!mini.finished) {
    state.rafId = requestAnimationFrame(miniLoop);
  }
}

function handleKeyboard(event) {
  if (event.type === "keydown") {
    state.keys.add(event.code);
  } else {
    state.keys.delete(event.code);
  }

  const battle = state.battle;
  const mini = state.mini;

  if (battle && battle.phase === "attack" && /Arrow|KeyW|KeyA|KeyS|KeyD/.test(event.code)) {
    event.preventDefault();
  }

  if (battle && battle.phase === "timing" && (event.code === "Space" || event.code === "Enter")) {
    event.preventDefault();
    if (event.type === "keydown") {
      resolveFightStrike();
    }
  }

  if (mini && (mini.mini.id === "coffee" || mini.mini.id === "clock") && (event.code === "Space" || event.code === "Enter")) {
    event.preventDefault();
    if (event.type === "keydown") {
      resolveCoffeeStop();
    }
  }

  if (mini && mini.mini.id === "papers" && event.code === "Escape" && event.type === "keydown") {
    event.preventDefault();
    finishMiniGame(false);
  }

  if (battle && event.code === "Escape" && event.type === "keydown") {
    event.preventDefault();
    hideBattleSubmenu();
    ui.battleTiming.hidden = true;
    state.battle.phase = "menu";
    renderBattleControls(false);
    setBattleMessage("Твой ход.");
  }
}

function wireUI() {
  ui.restartButton.addEventListener("click", restartGame);
  ui.miniSurrender.addEventListener("click", actionMiniGame);
  ui.battleTimingButton.addEventListener("click", resolveFightStrike);

  ui.battleControls.addEventListener("click", (event) => {
    const button = event.target.closest("button[data-battle-command]");
    if (!button) {
      return;
    }
    handleBattleCommand(button.dataset.battleCommand);
  });

  window.addEventListener("keydown", handleKeyboard);
  window.addEventListener("keyup", handleKeyboard);
  window.addEventListener("blur", () => {
    state.keys.clear();
  });
}

function boot() {
  wireUI();
  goTo("intro");
}

boot();
