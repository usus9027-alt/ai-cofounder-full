export function detectCategory(idea: string) {
  const categories = {
    'plant': 'plant_care',
    'fitness': 'fitness',
    'workout': 'fitness',
    'productivity': 'productivity',
    'task': 'productivity',
    'food': 'food_delivery',
    'restaurant': 'food_delivery',
    'travel': 'travel',
    'education': 'education',
    'learning': 'education',
    'health': 'healthcare',
    'medical': 'healthcare',
    'finance': 'fintech',
    'money': 'fintech',
    'shopping': 'ecommerce',
    'buy': 'ecommerce'
  }

  const lowerIdea = idea.toLowerCase()
  for (const [keyword, category] of Object.entries(categories)) {
    if (lowerIdea.includes(keyword)) {
      return category
    }
  }
  return 'general'
}

export function getFallbackInsights(idea: string) {
  const category = detectCategory(idea)
  const data = marketInsights[category] || marketInsights['general']
  
  return {
    summary: `Анализ рынка для "${idea}" на основе исследовательской базы данных`,
    problems: data.problems,
    userQuotes: data.quotes,
    statistics: data.statistics,
    sentiment: "mixed",
    confidence: 0.7,
    source: "Fallback Database"
  }
}

const marketInsights = {
  plant_care: {
    problems: [
      "73% людей забывают поливать растения регулярно",
      "Большинство не знает, как определить болезни растений",
      "Сложно понять, сколько света нужно разным растениям",
      "Нет понимания, когда пересаживать растения"
    ],
    quotes: [
      "Я постоянно забываю поливать, и растения умирают",
      "Не понимаю, почему листья желтеют",
      "Хочу растения дома, но боюсь их убить",
      "Не знаю, как ухаживать за разными видами"
    ],
    statistics: {
      marketSize: "$2.7B indoor plant market",
      growth: "18% annual growth",
      demographics: "25-40 years, urban millennials"
    }
  },
  fitness: {
    problems: [
      "80% людей бросают тренировки через 3 месяца",
      "Сложно найти мотивацию заниматься дома",
      "Не знают правильную технику упражнений",
      "Нет времени на походы в спортзал"
    ],
    quotes: [
      "Начинаю тренироваться, но быстро теряю мотивацию",
      "Не знаю, как правильно делать упражнения",
      "Хочу заниматься дома, но не знаю с чего начать",
      "У меня нет времени на спортзал"
    ],
    statistics: {
      marketSize: "$96B global fitness market",
      growth: "12% annual growth",
      demographics: "18-45 years, health-conscious"
    }
  },
  productivity: {
    problems: [
      "Люди тратят 2.5 часа в день на отвлекающие факторы",
      "Сложно организовать задачи и приоритеты",
      "Многозадачность снижает эффективность на 40%",
      "Нет системы для отслеживания прогресса"
    ],
    quotes: [
      "Постоянно отвлекаюсь и ничего не успеваю",
      "Не знаю, как организовать свои задачи",
      "Хочу быть продуктивнее, но не знаю как",
      "Много дел, но нет системы"
    ],
    statistics: {
      marketSize: "$58B productivity software market",
      growth: "15% annual growth",
      demographics: "25-50 years, knowledge workers"
    }
  },
  food_delivery: {
    problems: [
      "Долгое время доставки (45+ минут)",
      "Холодная еда при доставке",
      "Высокие цены и комиссии",
      "Ограниченный выбор ресторанов"
    ],
    quotes: [
      "Еда приходит холодной и невкусной",
      "Слишком долго ждать доставку",
      "Цены завышены из-за комиссий",
      "Мало ресторанов в моем районе"
    ],
    statistics: {
      marketSize: "$150B global food delivery market",
      growth: "20% annual growth",
      demographics: "18-45 years, urban dwellers"
    }
  },
  travel: {
    problems: [
      "Сложно найти лучшие цены на билеты",
      "Планирование маршрута занимает много времени",
      "Не знают местные особенности и культуру",
      "Страх заблудиться в незнакомом месте"
    ],
    quotes: [
      "Трачу часы на поиск дешевых билетов",
      "Не знаю, что посмотреть в новом городе",
      "Боюсь заблудиться в незнакомом месте",
      "Планирование поездки - это стресс"
    ],
    statistics: {
      marketSize: "$1.7T global travel market",
      growth: "8% annual growth",
      demographics: "25-55 years, middle to upper class"
    }
  },
  education: {
    problems: [
      "Скучные и неинтерактивные курсы",
      "Высокая стоимость качественного образования",
      "Не хватает практических навыков",
      "Сложно найти подходящий курс"
    ],
    quotes: [
      "Курсы скучные и неинтересные",
      "Слишком дорого за качественное обучение",
      "Хочу практические навыки, а не теорию",
      "Не могу найти подходящий курс"
    ],
    statistics: {
      marketSize: "$366B global education market",
      growth: "10% annual growth",
      demographics: "18-65 years, lifelong learners"
    }
  },
  healthcare: {
    problems: [
      "Долгое ожидание приема врача",
      "Сложно получить второе мнение",
      "Высокие цены на медицинские услуги",
      "Не хватает информации о симптомах"
    ],
    quotes: [
      "Жду приема врача несколько недель",
      "Хочу получить второе мнение, но не знаю как",
      "Медицина слишком дорогая",
      "Не понимаю свои симптомы"
    ],
    statistics: {
      marketSize: "$4.5T global healthcare market",
      growth: "6% annual growth",
      demographics: "All ages, health-conscious"
    }
  },
  fintech: {
    problems: [
      "Сложные и запутанные финансовые продукты",
      "Высокие комиссии за переводы",
      "Не хватает финансовой грамотности",
      "Страх потерять деньги при инвестировании"
    ],
    quotes: [
      "Не понимаю финансовые продукты",
      "Слишком высокие комиссии",
      "Хочу инвестировать, но боюсь потерять деньги",
      "Не знаю, как управлять финансами"
    ],
    statistics: {
      marketSize: "$310B global fintech market",
      growth: "25% annual growth",
      demographics: "25-55 years, tech-savvy"
    }
  },
  ecommerce: {
    problems: [
      "Сложно найти нужный товар",
      "Не доверяют качеству товаров онлайн",
      "Проблемы с возвратом и обменом",
      "Высокие цены доставки"
    ],
    quotes: [
      "Не могу найти то, что нужно",
      "Боюсь, что товар будет плохого качества",
      "Сложно вернуть товар, если не подошел",
      "Доставка стоит слишком дорого"
    ],
    statistics: {
      marketSize: "$5.7T global ecommerce market",
      growth: "14% annual growth",
      demographics: "18-65 years, online shoppers"
    }
  },
  general: {
    problems: [
      "Пользователи ищут простое решение сложных проблем",
      "Не хватает персонализированного подхода",
      "Слишком много вариантов, сложно выбрать",
      "Нет доверия к новым решениям"
    ],
    quotes: [
      "Хочу простое решение моей проблемы",
      "Нужен индивидуальный подход",
      "Слишком много вариантов, не знаю что выбрать",
      "Не доверяю новым сервисам"
    ],
    statistics: {
      marketSize: "Varies by industry",
      growth: "10-20% annual growth",
      demographics: "Varies by target audience"
    }
  }
}
