import Link from "next/link";
import { listEvents } from "@/shared/lib/mock-store";
import styles from "./page.module.css";

export const dynamic = "force-dynamic";

const stats = [
  { value: "10 000+", label: "создано приглашений" },
  { value: "250 000+", label: "гостей приглашено" },
  { value: "94%", label: "открываемость ссылок" },
  { value: "6 городов", label: "Казахстан и СНГ" },
];

const eventTypes = [
  { title: "Свадьба", subtitle: "Той", icon: "heart" },
  { title: "Қыз ұзату", subtitle: "Проводы невесты", icon: "user" },
  { title: "Беташар", subtitle: "Традиционный этап", icon: "spark" },
  { title: "Сүндет той", subtitle: "Семейное торжество", icon: "star" },
  { title: "Юбилей", subtitle: "Праздничный вечер", icon: "gift" },
  { title: "День рождения", subtitle: "Современный формат", icon: "balloon" },
];

const steps = [
  {
    number: "01",
    title: "Создайте приглашение",
    text: "Выберите стиль, заполните текст и добавьте все этапы вашего события.",
  },
  {
    number: "02",
    title: "Отправьте ссылку",
    text: "Поделитесь приглашением через WhatsApp или Telegram без приложений и регистраций.",
  },
  {
    number: "03",
    title: "Соберите ответы",
    text: "Следите за подтверждениями гостей, комментариями и количеством людей в одном месте.",
  },
];

const templates = [
  { title: "Modern Minimal", subtitle: "Чисто, без лишнего", badge: "Бесплатно", variant: "minimal" },
  {
    title: "Elegant Classic",
    subtitle: "Статусно и красиво",
    badge: "Premium",
    variant: "classic",
    featured: true,
  },
  { title: "Ethnic Light", subtitle: "Национальный мотив", badge: "Premium", variant: "ethnic" },
];

const features = [
  "Мульти-событие в одном проекте",
  "Приглашение по семье",
  "Казахский и русский языки",
  "Messenger-first",
  "Режим для старших гостей",
  "Роль координатора",
];

const testimonials = [
  "Гости сразу видели адрес, программу и где подтвердить участие.",
  "Для қыз ұзату и той мы сделали один проект с двумя этапами.",
  "Ответы пришли аккуратно и без ручной сводки.",
];

const faqs = [
  ["Нужно ли гостю что-то скачивать?", "Нет. Гость открывает ссылку в браузере и видит приглашение сразу."],
  ["Можно ли сделать приглашение на двух языках?", "Да. Один проект может содержать казахскую и русскую версии текста."],
  ["Как гость подтверждает участие?", "Он открывает ссылку и выбирает вариант ответа прямо в приглашении."],
  ["Можно ли объединить несколько этапов события?", "Да. Для больших семейных мероприятий можно собрать несколько этапов в одном проекте."],
];

function Icon({ kind }: { kind: string }) {
  const paths: Record<string, string> = {
    heart: "M12 21.35 10.55 20C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09A6 6 0 0 1 16.5 3C19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54Z",
    user: "M12 12a4 4 0 1 0-4-4 4 4 0 0 0 4 4Zm-7 9c0-4 3.13-7 7-7s7 3 7 7",
    spark: "m12 2 1.8 5.2L19 9l-5.2 1.8L12 16l-1.8-5.2L5 9l5.2-1.8Z",
    star: "m12 3 2.8 5.67L21 9.6l-4.5 4.38 1.06 6.22L12 17.27 6.44 20.2 7.5 13.98 3 9.6l6.2-.93Z",
    gift: "M20 12v8a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1v-8m17 0H3m9 0v9m-6-9V7h12v5M8 7a2 2 0 1 1 4 0m0 0a2 2 0 1 1 4 0",
    balloon: "M12 2c3.3 0 6 2.8 6 6.2 0 4.8-4.2 8.8-6 10.3-1.8-1.5-6-5.5-6-10.3C6 4.8 8.7 2 12 2Zm0 16.5V22m-2 0h4",
  };

  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d={paths[kind] ?? paths.spark} />
    </svg>
  );
}

export default async function HomePage() {
  const events = listEvents();
  const firstEvent = events[0];

  return (
    <div className={styles.page}>
      <header className={styles.navbarWrap}>
        <div className={styles.navbar}>
          <Link href="/" className={styles.brand}>
            <span className={styles.brandMark}>Q</span>
            <span className={styles.brandText}>Qonaq</span>
          </Link>

          <nav className={styles.navLinks}>
            <a href="#features">Возможности</a>
            <a href="#templates">Шаблоны</a>
            <a href="#pricing">Тарифы</a>
            <a href="#faq">FAQ</a>
          </nav>

          <div className={styles.navActions}>
            {firstEvent ? <Link href={`/events/${firstEvent.id}`} className={styles.navSecondary}>Кабинет</Link> : null}
            <a href="#cta" className={styles.navPrimary}>Создать</a>
          </div>
        </div>
      </header>

      <section className={styles.hero}>
        <div className={styles.heroInner}>
          <div className={styles.heroCopy}>
            <div className={styles.heroBadge}><span className={styles.pulseDot} />Для казахстанских мероприятий</div>
            <h1 className={styles.heroTitle}>Цифровое<br /><span>приглашение</span><br />для вашего той</h1>
            <p className={styles.heroText}>
              Создайте красивое приглашение за 10 минут. Отправьте через WhatsApp. Соберите ответы всех гостей без звонков и путаницы.
            </p>
            <div className={styles.heroButtons}>
              <Link href="/events/new" className={styles.primaryCta}>Создать бесплатно</Link>
              <a href="#templates" className={styles.secondaryCta}>Посмотреть шаблоны</a>
            </div>
            <p className={styles.heroTrust}>Уже 10 000+ приглашений создано в Казахстане</p>
          </div>

          <div className={styles.heroVisual}>
            <div className={styles.visualBlobOne} aria-hidden="true" />
            <div className={styles.visualBlobTwo} aria-hidden="true" />
            <div className={styles.phoneOuter}>
              <div className={styles.phoneScreen}>
                <div className={styles.phoneStatus}><span>9:41</span><span>Qonaq</span></div>
                <div className={styles.invitationCard}>
                  <div className={styles.invitationHead}>
                    <p>ТОЙ ШАҚЫРУ</p>
                    <h2>Алибек &amp; Айгерим</h2>
                  </div>
                  <div className={styles.invitationBody}>
                    <div className={styles.inviteRow}><strong>15 мая 2025</strong><span>17:00</span></div>
                    <div className={styles.inviteRow}><strong>Rixos Almaty</strong><span>зал «Сарай»</span></div>
                    <div className={styles.inviteButton}>Подтвердить участие</div>
                  </div>
                </div>
                <div className={styles.shareRow}>
                  <div className={styles.shareChip}>WhatsApp</div>
                  <div className={styles.shareChipAlt}>Telegram</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className={styles.statsBar}>
        <div className={styles.statsGrid}>
          {stats.map((stat) => (
            <div key={stat.label} className={styles.statItem}>
              <p>{stat.value}</p>
              <span>{stat.label}</span>
            </div>
          ))}
        </div>
      </section>

      <section id="events" className={styles.section}>
        <div className={styles.sectionHeader}>
          <p className={styles.eyebrow}>Для каких мероприятий</p>
          <h2>Всё, что важно для семьи</h2>
          <p>Готовые сценарии под каждый тип казахстанского торжества с правильной подачей и структурой.</p>
        </div>
        <div className={styles.eventGrid}>
          {eventTypes.map((event) => (
            <article key={event.title} className={styles.eventCard}>
              <div className={styles.eventIcon}><Icon kind={event.icon} /></div>
              <h3>{event.title}</h3>
              <p>{event.subtitle}</p>
            </article>
          ))}
        </div>
      </section>

      <section className={`${styles.section} ${styles.sectionWhite}`}>
        <div className={styles.sectionHeader}>
          <p className={styles.eyebrow}>Как это работает</p>
          <h2>Три простых шага</h2>
          <p>Почти тот же ритм и структура, что в референсе из `designs`, но в палитре Qonaq.</p>
        </div>
        <div className={styles.stepsGrid}>
          {steps.map((step) => (
            <article key={step.number} className={styles.stepCard}>
              <span>{step.number}</span>
              <h3>{step.title}</h3>
              <p>{step.text}</p>
            </article>
          ))}
        </div>
      </section>

      <section id="templates" className={`${styles.section} ${styles.sectionTinted}`}>
        <div className={styles.sectionHeader}>
          <p className={styles.eyebrow}>Шаблоны</p>
          <h2>Три направления стиля</h2>
          <p>Каждый шаблон можно настроить: цвета, шрифты, фото и порядок блоков.</p>
        </div>
        <div className={styles.templateGrid}>
          {templates.map((template) => (
            <article key={template.title} className={`${styles.templateCard} ${template.featured ? styles.templateFeatured : ""}`}>
              {template.featured ? <div className={styles.templatePill}>Популярный</div> : null}
              <div className={`${styles.templatePreview} ${styles[`preview_${template.variant}`]}`}>
                {template.variant === "minimal" ? <div className={styles.previewMinimal}><div /><p>WEDDING INVITATION</p><strong>Алибек &amp; Айгерим</strong><span>15 мая 2025 · Алматы</span><button>RSVP</button></div> : null}
                {template.variant === "classic" ? <div className={styles.previewClassic}><p>ТОЙ ШАҚЫРУ</p><strong>Алибек</strong><em>&amp;</em><strong>Айгерим</strong><span>15 · 05 · 2025</span></div> : null}
                {template.variant === "ethnic" ? <div className={styles.previewEthnic}><div className={styles.ethnicLine} /><p>ШАҚЫРУ / ПРИГЛАШЕНИЕ</p><strong>Алибек &amp; Айгерим</strong><span>Сәрсенбі, 15 мамыр 2025</span><small>Среда, 15 мая 2025</small><div className={styles.ethnicLine} /></div> : null}
              </div>
              <div className={styles.templateMeta}>
                <div><h3>{template.title}</h3><p>{template.subtitle}</p></div>
                <span>{template.badge}</span>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section id="features" className={`${styles.section} ${styles.sectionWhite}`}>
        <div className={styles.sectionHeader}>
          <p className={styles.eyebrow}>Преимущества</p>
          <h2>Сделано для Казахстана</h2>
          <p>Не западный шаблонный сервис, а продукт под локальные сценарии и семейные форматы.</p>
        </div>
        <div className={styles.featureGrid}>
          {features.map((feature) => (
            <article key={feature} className={styles.featureCard}>
              <div className={styles.featureMark}>+</div>
              <h3>{feature}</h3>
              <p>Локальная подача, простой интерфейс и правильный сценарий для гостей и организатора.</p>
            </article>
          ))}
        </div>
      </section>

      <section className={`${styles.section} ${styles.sectionTinted}`}>
        <div className={styles.sectionHeader}>
          <p className={styles.eyebrow}>Зачем это нужно</p>
          <h2>Canva + WhatsApp<br />уже не справляются</h2>
        </div>
        <div className={styles.compareGrid}>
          <article className={styles.compareCard}>
            <div className={styles.compareHead}>Как сейчас</div>
            <ul>
              <li>Картинки без единого места с деталями</li>
              <li>Ответы гостей теряются в переписке</li>
              <li>Сложно понять итоговое количество людей</li>
              <li>Для каждого этапа нужен новый файл</li>
            </ul>
          </article>
          <article className={`${styles.compareCard} ${styles.compareCardAccent}`}>
            <div className={styles.compareHead}>С Qonaq</div>
            <ul>
              <li>Одна ссылка со всеми этапами и картой</li>
              <li>Понятный RSVP для гостя или семьи</li>
              <li>Статусы и комментарии собираются автоматически</li>
              <li>Организатор видит актуальную картину в кабинете</li>
            </ul>
          </article>
        </div>
      </section>

      <section className={`${styles.section} ${styles.sectionWhite}`}>
        <div className={styles.sectionHeader}>
          <p className={styles.eyebrow}>Отзывы</p>
          <h2>Что говорят организаторы</h2>
        </div>
        <div className={styles.testimonialGrid}>
          {testimonials.map((item) => (
            <article key={item} className={styles.testimonialCard}>
              <p>“{item}”</p>
            </article>
          ))}
        </div>
      </section>

      <section id="pricing" className={`${styles.section} ${styles.sectionTinted}`}>
        <div className={styles.sectionHeader}>
          <p className={styles.eyebrow}>Тарифы</p>
          <h2>Выберите подходящий уровень</h2>
          <p>Три карточки и центральный акцент, как в референсе.</p>
        </div>
        <div className={styles.pricingGrid}>
          <article className={styles.priceCard}><div className={styles.priceTop}><h3>Free</h3><strong>0 ₸</strong><p>Для быстрого старта</p></div><ul><li>1 приглашение</li><li>Базовый шаблон</li><li>Ссылка для отправки</li><li>Простой RSVP</li></ul><Link href="/events/new" className={styles.priceSecondary}>Выбрать</Link></article>
          <article className={`${styles.priceCard} ${styles.priceFeatured}`}><div className={styles.priceTop}><h3>Premium</h3><strong>14 900 ₸</strong><p>Самый популярный</p></div><ul><li>Премиальные шаблоны</li><li>Два языка</li><li>Карта, dress code, программа</li><li>Статусы гостей</li></ul><Link href="/events/new" className={styles.pricePrimary}>Выбрать</Link></article>
          <article className={styles.priceCard}><div className={styles.priceTop}><h3>Pro</h3><strong>29 900 ₸</strong><p>Для больших событий</p></div><ul><li>Несколько этапов события</li><li>Семейные приглашения</li><li>Экспорт списка гостей</li><li>Работа с координатором</li></ul><Link href="/events/new" className={styles.priceSecondary}>Выбрать</Link></article>
        </div>
      </section>

      <section id="faq" className={`${styles.section} ${styles.sectionWhite}`}>
        <div className={styles.sectionHeader}>
          <p className={styles.eyebrow}>FAQ</p>
          <h2>Частые вопросы</h2>
        </div>
        <div className={styles.faqList}>
          {faqs.map(([question, answer]) => (
            <details key={question} className={styles.faqItem}>
              <summary>{question}</summary>
              <p>{answer}</p>
            </details>
          ))}
        </div>
      </section>

      <section id="cta" className={styles.finalCta}>
        <div className={styles.finalInner}>
          <p className={styles.finalEyebrow}>Начните прямо сейчас</p>
          <h2>Создайте ваше первое<br /><span>цифровое приглашение</span></h2>
          <p>Бесплатно. Без карты. Готово за 10 минут.</p>
          <div className={styles.finalButtons}>
            <Link href="/events/new" className={styles.finalPrimary}>Создать приглашение</Link>
            <a href="#templates" className={styles.finalSecondary}>Посмотреть шаблоны</a>
          </div>
        </div>
      </section>

      <footer className={styles.footer}>
        <div className={styles.footerGrid}>
          <div className={styles.footerBrand}><div className={styles.footerLogo}><span className={styles.brandMark}>Q</span><span className={styles.brandText}>Qonaq</span></div><p>Цифровой центр приглашений и координации гостей для казахстанских мероприятий.</p></div>
          <div><h3>Продукт</h3><a href="#features">Возможности</a><a href="#templates">Шаблоны</a><a href="#pricing">Тарифы</a><a href="#faq">FAQ</a></div>
          <div><h3>Мероприятия</h3><span>Свадьба / Той</span><span>Қыз ұзату</span><span>Беташар</span><span>Юбилей</span></div>
          <div><h3>Контакты</h3><span>Telegram</span><span>Instagram</span><span>WhatsApp</span></div>
        </div>
        <div className={styles.footerBottom}><p>© 2025 Qonaq. Все права защищены.</p><div><span>Условия использования</span><span>Политика конфиденциальности</span></div></div>
      </footer>
    </div>
  );
}
