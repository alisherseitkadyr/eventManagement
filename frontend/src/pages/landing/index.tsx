import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  Activity,
  ArrowRight,
  CalendarDays,
  Cake,
  Check,
  ChevronDown,
  Eye,
  Gift,
  Globe,
  Heart,
  Mail,
  MapPin,
  Menu,
  Plus,
  Send,
  Shield,
  Sparkles,
  Star,
  UserRound,
  Users,
  X,
  type LucideIcon,
} from 'lucide-react'
import { routePaths } from '@app/routes/route-paths'

type IconCard = {
  title: string
  subtitle?: string
  description?: string
  iconWrapClassName: string
  iconClassName: string
  Icon: LucideIcon
}

type TemplateCard = {
  name: string
  subtitle: string
  badge: string
  badgeClassName: string
  preview: 'minimal' | 'classic' | 'ethnic'
  featured?: boolean
}

const navLinks = [
  { href: '#features', label: 'Возможности' },
  { href: '#templates', label: 'Шаблоны' },
  { href: '#pricing', label: 'Тарифы' },
  { href: '#faq', label: 'FAQ' },
] as const

const stats = [
  { value: '10 000+', label: 'создано приглашений' },
  { value: '250 000+', label: 'гостей приглашены' },
  { value: '94%', label: 'открываемость ссылок' },
  { value: '6 городов', label: 'Казахстан и СНГ' },
] as const

const eventTypes: IconCard[] = [
  { title: 'Свадьба', subtitle: 'Той', iconWrapClassName: 'bg-rose-100 group-hover:bg-rose-600', iconClassName: 'text-rose-600 group-hover:text-white', Icon: Heart },
  { title: 'Қыз ұзату', subtitle: 'Проводы невесты', iconWrapClassName: 'bg-pink-100 group-hover:bg-rose-600', iconClassName: 'text-pink-600 group-hover:text-white', Icon: UserRound },
  { title: 'Беташар', subtitle: 'Ритуал знакомства', iconWrapClassName: 'bg-amber-100 group-hover:bg-rose-600', iconClassName: 'text-amber-600 group-hover:text-white', Icon: Eye },
  { title: 'Сүндет той', subtitle: 'Торжество', iconWrapClassName: 'bg-blue-100 group-hover:bg-rose-600', iconClassName: 'text-blue-600 group-hover:text-white', Icon: Sparkles },
  { title: 'Юбилей', subtitle: '50, 60, 70 лет', iconWrapClassName: 'bg-violet-100 group-hover:bg-rose-600', iconClassName: 'text-violet-600 group-hover:text-white', Icon: Gift },
  { title: 'День рождения', subtitle: 'Туған күн', iconWrapClassName: 'bg-green-100 group-hover:bg-rose-600', iconClassName: 'text-green-600 group-hover:text-white', Icon: Cake },
]

const steps = [
  { number: '1', title: 'Создайте событие', description: 'Выберите тип мероприятия, заполните детали: дата, место, программа. Несколько этапов в одном проекте.', Icon: Plus },
  { number: '2', title: 'Пригласите гостей', description: 'Добавьте гостей, сформируйте семейные группы. Отправьте персональные ссылки через WhatsApp или Telegram.', Icon: Send },
  { number: '3', title: 'Отслеживайте ответы', description: 'Видите кто подтвердил, кто отказал, кто не ответил. Напомните одним кликом. Экспортируйте список.', Icon: Activity },
]

const features: IconCard[] = [
  { title: 'Мульти-событие в одном проекте', description: 'Қыз ұзату → Неке қию → Той → Беташар. Все этапы торжества в одном приглашении с разными датами, локациями и программами.', iconWrapClassName: 'bg-rose-600', iconClassName: 'text-white', Icon: CalendarDays },
  { title: 'Приглашение по семье', description: 'Семья Нургалиевых — 4 человека. Не нужно создавать 4 отдельных контакта. Одна ссылка, общий ответ, правильное приветствие.', iconWrapClassName: 'bg-rose-600', iconClassName: 'text-white', Icon: Users },
  { title: 'Казахский и русский языки', description: 'Один проект — две версии текста. Гость выбирает язык сам. Все системные кнопки, статусы и формулировки локализованы.', iconWrapClassName: 'bg-rose-600', iconClassName: 'text-white', Icon: Globe },
  { title: 'Messenger-first', description: 'Ссылка мгновенно открывается в WhatsApp и Telegram без регистрации. Красивый OG-превью. Работает на медленном интернете.', iconWrapClassName: 'bg-rose-600', iconClassName: 'text-white', Icon: Mail },
  { title: 'Режим для старших гостей', description: 'Крупный шрифт, минималистичный экран, одна большая кнопка «Буду». Без лишних шагов для родителей и ата-анасы.', iconWrapClassName: 'bg-rose-600', iconClassName: 'text-white', Icon: Eye },
  { title: 'Роль координатора', description: 'Мама, сестра или агент может вести свою часть гостей. Делите список, отправляйте напоминания вместе — без доступа ко всему событию.', iconWrapClassName: 'bg-rose-600', iconClassName: 'text-white', Icon: Shield },
]

const currentPainPoints = [
  'Картинки через WhatsApp без единого места с деталями',
  'Ответы собираются хаотично: "ладно приду", "напомни"',
  'Непонятно сколько человек придёт — считают в уме',
  'Для беташара и қыз ұзату — отдельные чаты, путаница',
  'Для родственников старшего возраста — особенно неудобно',
] as const

const qonaqBenefits = [
  'Красивая страница с картой, программой, дресс-кодом',
  'Гость нажимает «Буду» — вы сразу видите в дашборде',
  'Точное число гостей, кто не ответил — напомните в 1 клик',
  'Все этапы торжества — в одном проекте, один линк',
  'Режим крупного шрифта для старших гостей — без путаницы',
] as const

const testimonials = [
  { quote: '«У нас было 3 этапа: қыз ұзату, никах и основной той. Всё в одном проекте — гости сами видели, куда идти. Никаких созвонов с уточнением адреса!»', initial: 'А', name: 'Айнур Сейткали', meta: 'Свадьба · Алматы', avatarClassName: 'bg-rose-200 text-rose-700' },
  { quote: '«Мама не очень хорошо разбирается в телефонах. Но там была большая кнопка и один вопрос — она легко ответила. Это важно!»', initial: 'Д', name: 'Дамир Ахметов', meta: 'Юбилей 60 лет · Астана', avatarClassName: 'bg-amber-100 text-amber-700' },
  { quote: '«Делала сүндет той на 200 человек. Разделила гостей по сторонам, каждый видел только свою часть программы. Потрясающе удобно!»', initial: 'Г', name: 'Гульнара Мусина', meta: 'Сүндет той · Шымкент', avatarClassName: 'bg-violet-100 text-violet-700' },
]

const templateCards: TemplateCard[] = [
  { name: 'Modern Minimal', subtitle: 'Чисто, без лишнего', badge: 'Бесплатно', badgeClassName: 'bg-gray-100 text-gray-600', preview: 'minimal' },
  { name: 'Elegant Classic', subtitle: 'Статусно и красиво', badge: 'Premium', badgeClassName: 'bg-rose-100 text-rose-700', preview: 'classic', featured: true },
  { name: 'Ethnic Light', subtitle: 'Национальный мотив', badge: 'Premium', badgeClassName: 'bg-amber-100 text-amber-700', preview: 'ethnic' },
]

const pricingPlans = [
  {
    name: 'Бесплатно',
    price: '0 ₸',
    suffix: '',
    note: 'навсегда бесплатно',
    buttonLabel: 'Начать бесплатно',
    buttonClassName: 'block text-center border-2 border-rose-200 text-rose-700 hover:bg-rose-50 font-semibold py-3 rounded-xl transition-colors duration-200 focus-visible:ring-2 focus-visible:ring-rose-500 focus-visible:ring-offset-2',
    containerClassName: 'bg-white rounded-2xl p-7 card-soft flex flex-col reveal',
    features: [
      { included: true, text: '1 активное мероприятие' },
      { included: true, text: 'До 50 гостей' },
      { included: true, text: 'Базовый шаблон (Modern Minimal)' },
      { included: true, text: 'RSVP и статусы гостей' },
      { included: false, text: 'PDF-версия' },
      { included: false, text: 'Мульти-событие' },
    ],
  },
  {
    name: 'Premium',
    price: '1 990 ₸',
    suffix: '/мес',
    note: 'или 14 990 ₸/год (экономия 37%)',
    buttonLabel: 'Выбрать Premium',
    buttonClassName: 'block text-center bg-white text-rose-700 hover:bg-rose-50 font-semibold py-3 rounded-xl transition-colors duration-200 focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-rose-600',
    containerClassName: 'bg-rose-600 rounded-2xl p-7 flex flex-col relative reveal shadow-[0_20px_50px_rgba(219,39,119,0.25)]',
    featured: true,
    features: [
      { included: true, text: 'Неограниченные мероприятия' },
      { included: true, text: 'До 300 гостей' },
      { included: true, text: 'Все шаблоны (15+)' },
      { included: true, text: 'PDF и JPG экспорт' },
      { included: true, text: 'Расширенные RSVP-вопросы' },
      { included: true, text: 'KZ + RU оба языка' },
    ],
  },
  {
    name: 'Pro',
    price: '4 990 ₸',
    suffix: '/мес',
    note: 'для агентств и организаторов',
    buttonLabel: 'Выбрать Pro',
    buttonClassName: 'block text-center border-2 border-rose-200 text-rose-700 hover:bg-rose-50 font-semibold py-3 rounded-xl transition-colors duration-200 focus-visible:ring-2 focus-visible:ring-rose-500 focus-visible:ring-offset-2',
    containerClassName: 'bg-white rounded-2xl p-7 card-soft flex flex-col reveal',
    features: [
      { included: true, text: 'Всё из Premium' },
      { included: true, text: 'Неограниченно гостей' },
      { included: true, text: 'Мульти-событие в проекте' },
      { included: true, text: 'Семейные группы гостей' },
      { included: true, text: 'Роль координатора' },
      { included: true, text: 'Экспорт CSV / Excel' },
    ],
  },
]

const faqs = [
  { question: 'Нужно ли гостю скачивать приложение?', answer: 'Нет. Гость просто нажимает на ссылку в WhatsApp или Telegram — страница открывается в браузере. Никакой регистрации и загрузки приложений.' },
  { question: 'Можно ли создать приглашение на казахском языке?', answer: 'Да. Казахский и русский языки доступны сразу. В Premium вы можете заполнить один проект на двух языках, а гость выбирает сам. Все кнопки и статусы локализованы.' },
  { question: 'Как гость подтверждает участие?', answer: 'Гость открывает персональную ссылку, видит приглашение и нажимает одну из кнопок: «Буду», «Не смогу», «Ещё не знаю». Можно указать количество человек и оставить комментарий.' },
  { question: 'Можно ли добавить қыз ұзату и беташар в одно приглашение?', answer: 'Да, это одна из главных фич. В расширенных тарифах вы создаёте несколько этапов внутри одного проекта: каждый со своей датой, местом и программой.' },
  { question: 'Что такое персональная ссылка?', answer: 'Для каждого гостя или семьи создаётся уникальная ссылка. Когда гость её открывает, система знает кто это, показывает его имя и сохраняет именно его ответ.' },
  { question: 'Можно ли скачать список гостей?', answer: 'Да. В тарифе Pro список гостей со статусами экспортируется в CSV или Excel. Удобно для рассадки, ресторана или личного архива.' },
] as const

const footerColumns = [
  { title: 'Продукт', links: ['Возможности', 'Шаблоны', 'Тарифы', 'FAQ'] },
  { title: 'Мероприятия', links: ['Свадьба / Той', 'Қыз ұзату', 'Беташар', 'Юбилей', 'Сүндет той'] },
  { title: 'Контакты', links: ['Написать нам', 'Telegram', 'Instagram', 'WhatsApp'] },
] as const

function PhonePreview() {
  return (
    <div className="relative">
      <div className="absolute -right-8 -top-8 h-48 w-48 rounded-full bg-rose-200/40 blur-3xl" aria-hidden="true" />
      <div className="absolute -bottom-8 -left-8 h-40 w-40 rounded-full bg-[#fde68a]/30 blur-3xl" aria-hidden="true" />

      <div className="phone-outer relative z-10">
        <div className="phone-screen">
          <div
            className="flex h-full flex-col"
            style={{ background: 'linear-gradient(160deg, #FDF2F8 0%, #FCE7F3 100%)' }}
          >
            <div className="flex items-center justify-between px-4 pb-1 pt-4 text-[9px] text-gray-400">
              <span>9:41</span>
              <div className="flex items-center gap-1">
                <div className="h-2.5 w-2.5 rounded-full border border-current" />
                <div className="h-2.5 w-4 rounded-[3px] border border-current" />
              </div>
            </div>

            <div className="flex flex-1 flex-col items-center justify-center px-4 pb-4">
              <div className="w-full overflow-hidden rounded-2xl bg-white shadow-sm">
                <div
                  className="relative h-20 overflow-hidden"
                  style={{ background: 'linear-gradient(135deg, #DB2777, #9D174D)' }}
                >
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                      <p className="font-sans text-[8px] tracking-[2px] text-rose-200">TOY INVITE</p>
                      <p className="font-serif text-[14px] font-semibold text-white">Алибек & Айгерим</p>
                    </div>
                  </div>
                  <div className="absolute left-3 top-2 h-1.5 w-1.5 rounded-full bg-rose-300/50" />
                  <div className="absolute left-6 top-4 h-1 w-1 rounded-full bg-rose-300/30" />
                  <div className="absolute right-4 top-2 h-1 w-1 rounded-full bg-rose-300/40" />
                </div>

                <div className="space-y-2 p-3">
                  <div className="flex items-center gap-2">
                    <div className="flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-rose-100">
                      <CalendarDays className="h-2.5 w-2.5 text-rose-600" strokeWidth={2} />
                    </div>
                    <span className="text-[9px] text-gray-700">15 мая 2025, 17:00</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-rose-100">
                      <MapPin className="h-2.5 w-2.5 text-rose-600" strokeWidth={2} />
                    </div>
                    <span className="text-[9px] text-gray-700">Rixos Almaty, зал «Сарай»</span>
                  </div>
                  <div className="pt-1">
                    <div className="w-full rounded-lg bg-rose-600 py-1.5 text-center text-[9px] font-semibold text-white">
                      Подтвердить участие
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-3 flex w-full gap-2">
                <div className="flex flex-1 items-center justify-center gap-1 rounded-xl bg-green-500 py-2">
                  <span className="text-[8px] font-semibold text-white">WhatsApp</span>
                </div>
                <div className="flex flex-1 items-center justify-center gap-1 rounded-xl bg-blue-500 py-2">
                  <span className="text-[8px] font-semibold text-white">Telegram</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function TemplatePreview({ preview }: { preview: TemplateCard['preview'] }) {
  if (preview === 'minimal') {
    return (
      <div className="absolute inset-0 flex flex-col items-center justify-center p-6">
        <div className="w-full max-w-[180px]">
          <div className="mb-4 h-px w-full bg-gray-300" />
          <p className="text-center text-[8px] uppercase tracking-widest text-gray-400">WEDDING INVITATION</p>
          <p className="mt-1 text-center font-serif text-[18px] font-bold text-gray-800">Алибек & Айгерим</p>
          <p className="mt-1 text-center text-[9px] text-gray-400">15 мая 2025 · Алматы</p>
          <div className="mb-3 mt-4 h-px w-full bg-gray-300" />
          <div className="flex justify-center">
            <div className="border border-gray-800 px-4 py-1.5 text-center text-[8px] tracking-[1px] text-gray-800">
              RSVP
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (preview === 'classic') {
    return (
      <div className="absolute inset-0 flex flex-col items-center justify-center p-6">
        <div className="absolute left-2 top-2 h-8 w-8 border-l border-t border-rose-300/50" />
        <div className="absolute right-2 top-2 h-8 w-8 border-r border-t border-rose-300/50" />
        <div className="absolute bottom-2 left-2 h-8 w-8 border-b border-l border-rose-300/50" />
        <div className="absolute bottom-2 right-2 h-8 w-8 border-b border-r border-rose-300/50" />

        <div className="text-center">
          <p className="text-[7px] uppercase tracking-[3px] text-rose-200">ТОЙ ШАҚЫРУ</p>
          <p className="mt-2 font-serif text-[20px] font-bold text-white">Алибек</p>
          <p className="font-serif text-[13px] font-light italic text-rose-200">&</p>
          <p className="font-serif text-[20px] font-bold text-white">Айгерим</p>
          <div className="mt-3 flex items-center justify-center gap-2">
            <div className="h-px w-10 bg-rose-300/60" />
            <p className="text-[9px] text-rose-200">15 · 05 · 2025</p>
            <div className="h-px w-10 bg-rose-300/60" />
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="absolute inset-0">
      <div
        className="absolute inset-0"
        style={{
          backgroundImage:
            'radial-gradient(circle at 20% 20%, rgba(202,138,4,0.12) 0%, transparent 50%), radial-gradient(circle at 80% 80%, rgba(202,138,4,0.12) 0%, transparent 50%)',
        }}
      />
      <div className="absolute inset-0 flex flex-col items-center justify-center p-6">
        <div className="mb-3 flex items-center gap-2">
          <div className="h-px w-6 bg-amber-400" />
          <div className="h-2 w-2 rotate-45 border border-amber-400" />
          <div className="h-px w-6 bg-amber-400" />
        </div>
        <p className="mb-1 font-serif text-[8px] uppercase tracking-[2px] text-amber-800">
          ШАҚЫРУ / ПРИГЛАШЕНИЕ
        </p>
        <p className="mt-1 font-serif text-[18px] font-bold text-amber-900">Алибек & Айгерим</p>
        <p className="mt-1 text-[9px] text-amber-700">Сәрсенбі, 15 мамыр 2025</p>
        <p className="mt-0.5 text-[8px] text-amber-600">Среда, 15 мая 2025</p>
        <div className="mt-3 flex items-center gap-2">
          <div className="h-px w-6 bg-amber-400" />
          <div className="h-2 w-2 rotate-45 border border-amber-400" />
          <div className="h-px w-6 bg-amber-400" />
        </div>
      </div>
    </div>
  )
}

export function LandingPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0)

  useEffect(() => {
    const revealNodes = Array.from(document.querySelectorAll<HTMLElement>('.reveal'))

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches || !('IntersectionObserver' in window)) {
      revealNodes.forEach((node) => node.classList.add('visible'))
      return
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible')
            observer.unobserve(entry.target)
          }
        })
      },
      { threshold: 0.12 },
    )

    revealNodes.forEach((node) => observer.observe(node))

    return () => observer.disconnect()
  }, [])

  return (
    <div className="antialiased">
      <header className="fixed left-4 right-4 top-3 z-50 transition-all duration-300" id="navbar">
        <nav className="nav-blur mx-auto flex max-w-6xl items-center justify-between rounded-2xl border border-rose-200/60 bg-white/80 px-4 py-3 shadow-sm">
          <Link aria-label="Qonaq — главная" className="flex cursor-pointer items-center gap-2" to={routePaths.landing}>
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-rose-600">
              <Mail className="h-4 w-4 text-white" strokeWidth={2.5} />
            </div>
            <span className="font-serif text-lg font-semibold leading-none text-rose-900">Qonaq</span>
          </Link>

          <ul className="hidden items-center gap-6 text-sm font-medium text-gray-600 md:flex">
            {navLinks.map((link) => (
              <li key={link.href}>
                <a className="cursor-pointer transition-colors duration-200 hover:text-rose-600" href={link.href}>
                  {link.label}
                </a>
              </li>
            ))}
          </ul>

          <div className="flex items-center gap-3">
            <div className="hidden items-center gap-1 overflow-hidden rounded-lg border border-rose-200 text-xs font-medium sm:flex">
              <span className="bg-rose-600 px-3 py-1.5 text-white">RU</span>
              <span className="px-3 py-1.5 text-rose-700">ҚАЗ</span>
            </div>

            <Link
              className="hidden items-center gap-1.5 rounded-xl bg-rose-600 px-4 py-2 text-sm font-medium text-white transition-colors duration-200 hover:bg-rose-700 focus-visible:ring-2 focus-visible:ring-rose-500 focus-visible:ring-offset-2 sm:inline-flex"
              to={routePaths.signUp}
            >
              Создать
              <ArrowRight className="h-3.5 w-3.5" strokeWidth={2.5} />
            </Link>

            <button
              aria-expanded={mobileMenuOpen}
              aria-label="Открыть меню"
              className="flex h-8 w-8 items-center justify-center rounded-lg transition-colors duration-200 hover:bg-rose-50 focus-visible:ring-2 focus-visible:ring-rose-500 md:hidden"
              onClick={() => setMobileMenuOpen((value) => !value)}
              type="button"
            >
              {mobileMenuOpen ? (
                <X className="h-5 w-5 text-rose-800" strokeWidth={2} />
              ) : (
                <Menu className="h-5 w-5 text-rose-800" strokeWidth={2} />
              )}
            </button>
          </div>
        </nav>

        {mobileMenuOpen ? (
          <div className="nav-blur mx-auto mt-2 max-w-6xl rounded-2xl border border-rose-200/60 bg-white/90 px-5 py-4 shadow-lg md:hidden">
            <ul className="flex flex-col gap-3 text-sm font-medium text-gray-700">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <a
                    className="block cursor-pointer py-1 transition-colors duration-200 hover:text-rose-600"
                    href={link.href}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {link.label}
                  </a>
                </li>
              ))}
              <li className="border-t border-rose-100 pt-1">
                <Link
                  className="inline-flex items-center gap-1.5 rounded-xl bg-rose-600 px-4 py-2 text-sm font-medium text-white transition-colors duration-200"
                  onClick={() => setMobileMenuOpen(false)}
                  to={routePaths.signUp}
                >
                  Создать приглашение бесплатно
                </Link>
              </li>
            </ul>
          </div>
        ) : null}
      </header>

      <main>
        <section className="hero-gradient overflow-hidden px-4 pb-20 pt-32 md:pb-28">
          <div className="mx-auto max-w-6xl">
            <div className="flex flex-col items-center gap-12 lg:flex-row lg:gap-16">
              <div className="flex-1 text-center lg:text-left">
                <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-rose-200 bg-white/70 px-3.5 py-1.5 text-xs font-semibold text-rose-700">
                  <span aria-hidden="true" className="pulse-dot h-1.5 w-1.5 rounded-full bg-rose-500" />
                  Для казахстанских мероприятий
                </div>

                <h1 className="mb-5 font-serif text-4xl font-bold leading-tight text-rose-900 sm:text-5xl md:text-6xl">
                  Цифровое
                  <br />
                  <span className="italic text-rose-600">приглашение</span>
                  <br />
                  для вашего той
                </h1>

                <p className="mx-auto mb-8 max-w-lg text-lg leading-relaxed text-gray-600 lg:mx-0">
                  Создайте красивое приглашение за 10 минут. Отправьте через WhatsApp. Соберите ответы всех
                  гостей — без звонков и путаницы.
                </p>

                <div className="flex flex-col items-center gap-3 sm:flex-row sm:justify-center lg:justify-start">
                  <Link
                    className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-rose-600 px-7 py-3.5 text-base font-semibold text-white shadow-md transition-all duration-200 hover:bg-rose-700 hover:shadow-lg focus-visible:ring-2 focus-visible:ring-rose-500 focus-visible:ring-offset-2 sm:w-auto"
                    to={routePaths.signUp}
                  >
                    Создать бесплатно
                    <ArrowRight className="h-4 w-4" strokeWidth={2.5} />
                  </Link>
                  <a
                    className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-rose-200 bg-white px-7 py-3.5 text-base font-semibold text-rose-700 transition-all duration-200 hover:bg-rose-50 focus-visible:ring-2 focus-visible:ring-rose-500 focus-visible:ring-offset-2 sm:w-auto"
                    href="#templates"
                  >
                    Посмотреть шаблоны
                  </a>
                </div>

                <p className="mt-5 flex items-center justify-center gap-1.5 text-xs text-gray-400 lg:justify-start">
                  <Star className="h-3.5 w-3.5 fill-current text-rose-400" strokeWidth={1.5} />
                  Уже 10 000+ приглашений создано в Казахстане
                </p>
              </div>

              <div className="flex shrink-0 justify-center">
                <PhonePreview />
              </div>
            </div>
          </div>
        </section>

        <section className="border-y border-rose-100 bg-white px-4 py-8">
          <div className="mx-auto grid max-w-4xl grid-cols-2 gap-6 text-center md:grid-cols-4">
            {stats.map((item) => (
              <div className="reveal" key={item.label}>
                <p className="font-serif text-3xl font-bold text-rose-700">{item.value}</p>
                <p className="mt-1 text-sm text-gray-500">{item.label}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="px-4 py-20" id="events">
          <div className="mx-auto max-w-6xl">
            <div className="reveal mb-12 text-center">
              <p className="ornament mb-3 text-sm font-semibold uppercase tracking-widest text-rose-500">
                Для каких мероприятий
              </p>
              <h2 className="font-serif text-3xl font-bold text-rose-900 md:text-4xl">Всё, что важно для семьи</h2>
              <p className="mx-auto mt-3 max-w-xl text-gray-500">
                Готовые сценарии под каждый тип казахстанского торжества — с правильными формулировками и
                структурой.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
              {eventTypes.map(({ Icon, iconClassName, iconWrapClassName, subtitle, title }) => (
                <div
                  className="group card-soft reveal cursor-pointer rounded-2xl bg-white p-5 text-center transition-all duration-200 hover:-translate-y-1"
                  key={title}
                >
                  <div
                    className={`mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-xl transition-colors duration-200 ${iconWrapClassName}`}
                  >
                    <Icon className={`h-6 w-6 transition-colors duration-200 ${iconClassName}`} strokeWidth={1.5} />
                  </div>
                  <p className="text-sm font-semibold text-gray-700">{title}</p>
                  <p className="mt-0.5 text-xs text-gray-400">{subtitle}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-white px-4 py-20">
          <div className="mx-auto max-w-5xl">
            <div className="reveal mb-14 text-center">
              <p className="ornament mb-3 text-sm font-semibold uppercase tracking-widest text-rose-500">
                Как это работает
              </p>
              <h2 className="font-serif text-3xl font-bold text-rose-900 md:text-4xl">
                Три шага до красивого приглашения
              </h2>
            </div>

            <div className="relative grid gap-8 md:grid-cols-3">
              <div aria-hidden="true" className="absolute left-1/4 right-1/4 top-10 hidden h-px bg-rose-200 md:block" />

              {steps.map(({ Icon, description, number, title }) => (
                <div className="reveal relative z-10 text-center" key={number}>
                  <div className="mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-2xl bg-rose-600 shadow-lg">
                    <Icon className="h-9 w-9 text-white" strokeWidth={1.5} />
                  </div>
                  <div className="absolute left-1/2 top-[-8px] flex h-7 w-7 -translate-x-1/2 items-center justify-center rounded-full border-2 border-rose-300 bg-rose-100">
                    <span className="text-xs font-bold text-rose-600">{number}</span>
                  </div>
                  <h3 className="mb-2 font-serif text-xl font-semibold text-rose-900">{title}</h3>
                  <p className="text-sm leading-relaxed text-gray-500">{description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="hero-gradient px-4 py-20" id="templates">
          <div className="mx-auto max-w-6xl">
            <div className="reveal mb-14 text-center">
              <p className="ornament mb-3 text-sm font-semibold uppercase tracking-widest text-rose-500">Шаблоны</p>
              <h2 className="font-serif text-3xl font-bold text-rose-900 md:text-4xl">Три направления стиля</h2>
              <p className="mx-auto mt-3 max-w-xl text-gray-500">
                Каждый шаблон можно настроить: цвета, шрифты, фото, порядок блоков.
              </p>
            </div>

            <div className="grid gap-6 md:grid-cols-3">
              {templateCards.map((template) => (
                <div
                  className={`template-preview card-soft reveal cursor-pointer overflow-hidden rounded-2xl bg-white ${
                    template.featured ? 'ring-2 ring-rose-300' : ''
                  }`}
                  key={template.name}
                >
                  {template.featured ? (
                    <div className="relative">
                      <div className="absolute right-3 top-3 z-10">
                        <span className="rounded-full bg-rose-600 px-2.5 py-1 text-xs font-bold text-white">
                          Популярный
                        </span>
                      </div>
                    </div>
                  ) : null}

                  <div
                    className="relative h-56 overflow-hidden"
                    style={{
                      background:
                        template.preview === 'minimal'
                          ? '#FAFAFA'
                          : template.preview === 'classic'
                            ? 'linear-gradient(160deg, #831843 0%, #DB2777 100%)'
                            : 'linear-gradient(160deg, #FEF9C3 0%, #FEF3C7 100%)',
                    }}
                  >
                    <TemplatePreview preview={template.preview} />
                  </div>

                  <div className="border-t border-gray-100 p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-semibold text-gray-800">{template.name}</p>
                        <p className="mt-0.5 text-xs text-gray-400">{template.subtitle}</p>
                      </div>
                      <span className={`rounded-full px-2 py-1 text-xs font-medium ${template.badgeClassName}`}>
                        {template.badge}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="reveal mt-8 text-center">
              <a
                className="inline-flex items-center gap-2 text-sm font-semibold text-rose-600 transition-colors duration-200 hover:text-rose-700"
                href="#cta"
              >
                Смотреть все шаблоны
                <ArrowRight className="h-4 w-4" strokeWidth={2.5} />
              </a>
            </div>
          </div>
        </section>

        <section className="bg-white px-4 py-20" id="features">
          <div className="mx-auto max-w-6xl">
            <div className="reveal mb-14 text-center">
              <p className="ornament mb-3 text-sm font-semibold uppercase tracking-widest text-rose-500">
                Преимущества
              </p>
              <h2 className="font-serif text-3xl font-bold text-rose-900 md:text-4xl">Сделано для Казахстана</h2>
              <p className="mx-auto mt-3 max-w-2xl text-gray-500">
                Мы изучили, как проводят торжества здесь — и собрали инструмент под локальные сценарии, а не
                абстрактный западный конструктор.
              </p>
            </div>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {features.map(({ Icon, description, iconClassName, iconWrapClassName, title }) => (
                <div className="bg-rose-bg reveal rounded-2xl p-6" key={title}>
                  <div className={`mb-4 flex h-11 w-11 items-center justify-center rounded-xl ${iconWrapClassName}`}>
                    <Icon className={`h-5 w-5 ${iconClassName}`} strokeWidth={2} />
                  </div>
                  <h3 className="mb-2 font-serif text-lg font-semibold text-rose-900">{title}</h3>
                  <p className="text-sm leading-relaxed text-gray-500">{description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="hero-gradient px-4 py-20">
          <div className="mx-auto max-w-5xl">
            <div className="reveal mb-12 text-center">
              <p className="ornament mb-3 text-sm font-semibold uppercase tracking-widest text-rose-500">
                Зачем это нужно
              </p>
              <h2 className="font-serif text-3xl font-bold text-rose-900 md:text-4xl">
                Canva + WhatsApp
                <br />
                уже не справляются
              </h2>
            </div>

            <div className="reveal grid gap-6 md:grid-cols-2">
              <div className="card-soft rounded-2xl bg-white p-7">
                <div className="mb-5 flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gray-100">
                    <X className="h-5 w-5 text-gray-400" strokeWidth={2} />
                  </div>
                  <p className="text-base font-semibold text-gray-600">Как сейчас</p>
                </div>
                <ul className="space-y-3">
                  {currentPainPoints.map((item) => (
                    <li className="flex items-start gap-2.5 text-sm text-gray-500" key={item}>
                      <span className="mt-0.5 h-4 w-4 flex-shrink-0 rounded-full bg-gray-200" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="rounded-2xl bg-rose-600 p-7">
                <div className="mb-5 flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/20">
                    <Check className="h-5 w-5 text-white" strokeWidth={2.5} />
                  </div>
                  <p className="text-base font-semibold text-white">С Qonaq</p>
                </div>
                <ul className="space-y-3">
                  {qonaqBenefits.map((item) => (
                    <li className="flex items-start gap-2.5 text-sm text-rose-100" key={item}>
                      <Check className="mt-0.5 h-4 w-4 flex-shrink-0 text-rose-200" strokeWidth={2.5} />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>

        <section className="bg-white px-4 py-20">
          <div className="mx-auto max-w-6xl">
            <div className="reveal mb-12 text-center">
              <p className="ornament mb-3 text-sm font-semibold uppercase tracking-widest text-rose-500">Отзывы</p>
              <h2 className="font-serif text-3xl font-bold text-rose-900 md:text-4xl">Они уже провели свой той</h2>
            </div>

            <div className="grid gap-6 md:grid-cols-3">
              {testimonials.map((item) => (
                <div className="bg-rose-bg card-soft reveal rounded-2xl p-6" key={item.name}>
                  <div className="mb-4 flex gap-1">
                    {Array.from({ length: 5 }).map((_, index) => (
                      <Star className="h-4 w-4 fill-current text-[#CA8A04]" key={`${item.name}-${index}`} strokeWidth={1.5} />
                    ))}
                  </div>
                  <p className="mb-5 text-sm leading-relaxed text-gray-600">{item.quote}</p>
                  <div className="flex items-center gap-3">
                    <div className={`flex h-10 w-10 items-center justify-center rounded-full font-serif font-bold ${item.avatarClassName}`}>
                      {item.initial}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-800">{item.name}</p>
                      <p className="text-xs text-gray-400">{item.meta}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="hero-gradient px-4 py-20" id="pricing">
          <div className="mx-auto max-w-5xl">
            <div className="reveal mb-14 text-center">
              <p className="ornament mb-3 text-sm font-semibold uppercase tracking-widest text-rose-500">Тарифы</p>
              <h2 className="font-serif text-3xl font-bold text-rose-900 md:text-4xl">Начните бесплатно</h2>
              <p className="mt-3 text-gray-500">Без кредитной карты. Обновитесь в любой момент.</p>
            </div>

            <div className="grid items-stretch gap-6 md:grid-cols-3">
              {pricingPlans.map((plan) => (
                <div className={plan.containerClassName} key={plan.name}>
                  {plan.featured ? (
                    <div className="absolute left-1/2 top-[-14px] -translate-x-1/2">
                      <span className="whitespace-nowrap rounded-full bg-[#CA8A04] px-3 py-1.5 text-xs font-bold text-white">
                        Самый популярный
                      </span>
                    </div>
                  ) : null}

                  <div className="mb-5">
                    <p className={`text-base font-semibold ${plan.featured ? 'text-rose-100' : 'text-gray-700'}`}>
                      {plan.name}
                    </p>
                    <div className="mt-2 flex items-baseline gap-1">
                      <span className={`font-serif text-4xl font-bold ${plan.featured ? 'text-white' : 'text-gray-900'}`}>
                        {plan.price}
                      </span>
                      {plan.suffix ? (
                        <span className={`text-sm ${plan.featured ? 'text-rose-200' : 'text-gray-400'}`}>{plan.suffix}</span>
                      ) : null}
                    </div>
                    <p className={`mt-1 text-xs ${plan.featured ? 'text-rose-200' : 'text-gray-400'}`}>{plan.note}</p>
                  </div>

                  <ul className="mb-7 flex-1 space-y-3">
                    {plan.features.map((feature) => (
                      <li
                        className={`flex items-center gap-2.5 text-sm ${
                          plan.featured
                            ? 'text-rose-100'
                            : feature.included
                              ? 'text-gray-600'
                              : 'text-gray-400'
                        }`}
                        key={feature.text}
                      >
                        {feature.included ? (
                          <Check
                            className={`h-4 w-4 flex-shrink-0 ${plan.featured ? 'text-rose-200' : 'text-green-500'}`}
                            strokeWidth={2.5}
                          />
                        ) : (
                          <X className="h-4 w-4 flex-shrink-0 text-gray-200" strokeWidth={2} />
                        )}
                        {feature.text}
                      </li>
                    ))}
                  </ul>

                  <Link className={plan.buttonClassName} to={routePaths.signUp}>
                    {plan.buttonLabel}
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-white px-4 py-20" id="faq">
          <div className="mx-auto max-w-2xl">
            <div className="reveal mb-12 text-center">
              <p className="ornament mb-3 text-sm font-semibold uppercase tracking-widest text-rose-500">Вопросы</p>
              <h2 className="font-serif text-3xl font-bold text-rose-900 md:text-4xl">Часто спрашивают</h2>
            </div>

            <div className="reveal space-y-3">
              {faqs.map((faq, index) => {
                const isOpen = openFaqIndex === index

                return (
                  <div className={`faq-item bg-rose-bg overflow-hidden rounded-2xl ${isOpen ? 'open' : ''}`} key={faq.question}>
                    <button
                      aria-expanded={isOpen}
                      className="faq-toggle flex w-full cursor-pointer items-center justify-between px-6 py-5 text-left focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-rose-500"
                      onClick={() => setOpenFaqIndex(isOpen ? null : index)}
                      type="button"
                    >
                      <span className="text-sm font-semibold text-gray-800">{faq.question}</span>
                      <ChevronDown className="faq-chevron ml-3 h-4 w-4 flex-shrink-0 text-rose-400" strokeWidth={2.5} />
                    </button>
                    <div className="faq-answer px-6">
                      <p className="pb-5 text-sm leading-relaxed text-gray-500">{faq.answer}</p>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </section>

        <section
          className="px-4 py-24"
          id="cta"
          style={{ background: 'linear-gradient(135deg, #831843 0%, #DB2777 50%, #BE185D 100%)' }}
        >
          <div className="reveal mx-auto max-w-2xl text-center">
            <p className="ornament mb-4 text-sm font-semibold uppercase tracking-widest text-rose-200">
              Начните прямо сейчас
            </p>
            <h2 className="mb-5 font-serif text-3xl font-bold leading-tight text-white md:text-5xl">
              Создайте ваше первое
              <br />
              <span className="italic text-rose-200">цифровое приглашение</span>
            </h2>
            <p className="mx-auto mb-8 max-w-md text-base text-rose-200">Бесплатно. Без карты. Готово за 10 минут.</p>

            <div className="flex flex-col justify-center gap-3 sm:flex-row">
              <Link
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-white px-8 py-4 text-base font-semibold text-rose-700 shadow-lg transition-all duration-200 hover:bg-rose-50 hover:shadow-xl focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-rose-600"
                to={routePaths.signUp}
              >
                Создать приглашение
                <ArrowRight className="h-4 w-4" strokeWidth={2.5} />
              </Link>
              <a
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/30 bg-white/10 px-8 py-4 text-base font-semibold text-white transition-all duration-200 hover:bg-white/20 focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-rose-600"
                href="#templates"
              >
                Посмотреть шаблоны
              </a>
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-rose-900 px-4 py-12 text-rose-200">
        <div className="mx-auto max-w-6xl">
          <div className="mb-10 grid grid-cols-2 gap-8 md:grid-cols-4">
            <div className="col-span-2 md:col-span-1">
              <div className="mb-3 flex items-center gap-2">
                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-rose-600">
                  <Mail className="h-3.5 w-3.5 text-white" strokeWidth={2.5} />
                </div>
                <span className="font-serif text-base font-semibold text-white">Qonaq</span>
              </div>
              <p className="text-sm leading-relaxed text-rose-300">
                Цифровой центр приглашений и координации гостей для казахстанских мероприятий.
              </p>
            </div>

            {footerColumns.map((column) => (
              <div key={column.title}>
                <p className="mb-3 text-sm font-semibold text-white">{column.title}</p>
                <ul className="space-y-2 text-sm">
                  {column.links.map((link) => (
                    <li key={link}>
                      <a className="cursor-pointer transition-colors duration-200 hover:text-white" href="#">
                        {link}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="flex flex-col items-center justify-between gap-3 border-t border-rose-800 pt-7 text-xs text-rose-400 sm:flex-row">
            <p>© 2026 Qonaq. Все права защищены.</p>
            <div className="flex gap-5">
              <a className="cursor-pointer transition-colors duration-200 hover:text-rose-200" href="#">
                Условия использования
              </a>
              <a className="cursor-pointer transition-colors duration-200 hover:text-rose-200" href="#">
                Политика конфиденциальности
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
