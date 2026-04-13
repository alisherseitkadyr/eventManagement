import { useState, useEffect, useRef } from "react";

// ─── Design Tokens ───
const T = {
  cream: "#FAF6F1", ivory: "#F5EDE4", sand: "#E8DDD0", sandLight: "#F0EAE1",
  warmGray: "#9C9186", burgundy: "#7A2E3A", burgundyDeep: "#5C1D29",
  gold: "#C9A96E", goldLight: "#DCC69A", goldFaint: "rgba(201,169,110,0.10)",
  terra: "#B8674D", charcoal: "#2C2825", charcoalSoft: "#4A4541",
  white: "#FFFFFF", success: "#2D8A56", successBg: "#E8F5EE",
  warning: "#D4870E", warningBg: "#FEF5E7", danger: "#C0392B", dangerBg: "#FDE8E8",
  infoBg: "#EEF2FF", info: "#4F5FBF",
};

const font = { display: "'Cormorant Garamond', serif", body: "'Outfit', sans-serif" };

// ─── Mock Data ───
const MOCK_GUESTS = [
  { id: 1, name: "Семья Нургалиевых", count: 4, side: "Невеста", status: "confirmed", phone: "+7 701 123 4567" },
  { id: 2, name: "Ержан Касымов", count: 1, side: "Жених", status: "confirmed", phone: "+7 702 234 5678" },
  { id: 3, name: "Семья Байтурсыновых", count: 3, side: "Невеста", status: "pending", phone: "+7 707 345 6789" },
  { id: 4, name: "Дана и Арман Сагиновы", count: 2, side: "Общие", status: "declined", phone: "+7 700 456 7890" },
  { id: 5, name: "Бауыржан Омаров", count: 1, side: "Жених", status: "maybe", phone: "+7 705 567 8901" },
  { id: 6, name: "Семья Алдабергеновых", count: 5, side: "Невеста", status: "confirmed", phone: "+7 708 678 9012" },
  { id: 7, name: "Мадина Ахметова", count: 1, side: "Общие", status: "pending", phone: "+7 701 789 0123" },
  { id: 8, name: "Семья Токтаровых", count: 3, side: "Жених", status: "confirmed", phone: "+7 776 890 1234" },
  { id: 9, name: "Асель Жумабаева", count: 2, side: "Невеста", status: "pending", phone: "+7 747 901 2345" },
  { id: 10, name: "Тимур Сейтказин", count: 1, side: "Жених", status: "confirmed", phone: "+7 702 012 3456" },
];

const MOCK_STAGES = [
  { id: 1, name: "Қыз ұзату", time: "12:00", date: "14 июля", place: 'Ресторан "Алтын Ғасыр"', address: "ул. Абая 52, Алматы" },
  { id: 2, name: "Неке қию", time: "15:00", date: "15 июля", place: "Мечеть Хазрет Султан", address: "пр. Тәуелсіздік 48, Астана" },
  { id: 3, name: "Основной той", time: "18:00", date: "15 июля", place: 'Банкетный зал "Достар"', address: "пр. Кабанбай батыра 11, Астана" },
];

// ─── Icons (inline SVG) ───
const Icon = ({ name, size = 20, color = "currentColor" }) => {
  const icons = {
    home: <><rect x="3" y="10" width="7" height="10" rx="1" stroke={color} strokeWidth="1.5" fill="none"/><rect x="14" y="10" width="7" height="10" rx="1" stroke={color} strokeWidth="1.5" fill="none"/><path d="M2 10L12 3L22 10" stroke={color} strokeWidth="1.5" fill="none" strokeLinecap="round"/></>,
    users: <><circle cx="9" cy="7" r="3.5" stroke={color} strokeWidth="1.5" fill="none"/><path d="M2 20c0-3.5 3-6 7-6s7 2.5 7 6" stroke={color} strokeWidth="1.5" fill="none" strokeLinecap="round"/><circle cx="17" cy="8" r="2.5" stroke={color} strokeWidth="1.5" fill="none"/><path d="M19 14c2 .5 3.5 2 3.5 4" stroke={color} strokeWidth="1.5" fill="none" strokeLinecap="round"/></>,
    edit: <><path d="M4 20h16" stroke={color} strokeWidth="1.5" strokeLinecap="round"/><path d="M14.5 5.5l4 4L8 20H4v-4L14.5 5.5z" stroke={color} strokeWidth="1.5" fill="none" strokeLinejoin="round"/></>,
    eye: <><path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12z" stroke={color} strokeWidth="1.5" fill="none"/><circle cx="12" cy="12" r="3" stroke={color} strokeWidth="1.5" fill="none"/></>,
    send: <><path d="M22 2L11 13" stroke={color} strokeWidth="1.5" strokeLinecap="round"/><path d="M22 2L15 22l-4-9-9-4L22 2z" stroke={color} strokeWidth="1.5" fill="none" strokeLinejoin="round"/></>,
    plus: <><line x1="12" y1="5" x2="12" y2="19" stroke={color} strokeWidth="1.5" strokeLinecap="round"/><line x1="5" y1="12" x2="19" y2="12" stroke={color} strokeWidth="1.5" strokeLinecap="round"/></>,
    check: <><path d="M5 13l4 4L19 7" stroke={color} strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"/></>,
    x: <><line x1="6" y1="6" x2="18" y2="18" stroke={color} strokeWidth="1.5" strokeLinecap="round"/><line x1="18" y1="6" x2="6" y2="18" stroke={color} strokeWidth="1.5" strokeLinecap="round"/></>,
    clock: <><circle cx="12" cy="12" r="9" stroke={color} strokeWidth="1.5" fill="none"/><path d="M12 7v5l3 3" stroke={color} strokeWidth="1.5" strokeLinecap="round"/></>,
    map: <><path d="M1 6l7-3 8 3 7-3v15l-7 3-8-3-7 3V6z" stroke={color} strokeWidth="1.5" fill="none"/><line x1="8" y1="3" x2="8" y2="18" stroke={color} strokeWidth="1.5"/><line x1="16" y1="6" x2="16" y2="21" stroke={color} strokeWidth="1.5"/></>,
    calendar: <><rect x="3" y="4" width="18" height="17" rx="2" stroke={color} strokeWidth="1.5" fill="none"/><line x1="3" y1="10" x2="21" y2="10" stroke={color} strokeWidth="1.5"/><line x1="8" y1="2" x2="8" y2="6" stroke={color} strokeWidth="1.5" strokeLinecap="round"/><line x1="16" y1="2" x2="16" y2="6" stroke={color} strokeWidth="1.5" strokeLinecap="round"/></>,
    chevronRight: <><path d="M9 6l6 6-6 6" stroke={color} strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round"/></>,
    settings: <><circle cx="12" cy="12" r="3" stroke={color} strokeWidth="1.5" fill="none"/><path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 11-2.83 2.83l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 11-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 11-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 110-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 112.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 114 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 112.83 2.83l-.06.06A1.65 1.65 0 0019.4 9c.2.55.2 1.16 0 1.71" stroke={color} strokeWidth="1.5" fill="none"/></>,
    download: <><path d="M12 3v12m0 0l-4-4m4 4l4-4" stroke={color} strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round"/><path d="M4 17v2a2 2 0 002 2h12a2 2 0 002-2v-2" stroke={color} strokeWidth="1.5" fill="none" strokeLinecap="round"/></>,
    filter: <><path d="M3 4h18l-7 8v5l-4 2V12L3 4z" stroke={color} strokeWidth="1.5" fill="none" strokeLinejoin="round"/></>,
    search: <><circle cx="11" cy="11" r="7" stroke={color} strokeWidth="1.5" fill="none"/><path d="M16 16l5 5" stroke={color} strokeWidth="1.5" strokeLinecap="round"/></>,
    bell: <><path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9" stroke={color} strokeWidth="1.5" fill="none"/><path d="M13.73 21a2 2 0 01-3.46 0" stroke={color} strokeWidth="1.5" fill="none" strokeLinecap="round"/></>,
    link: <><path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71" stroke={color} strokeWidth="1.5" fill="none" strokeLinecap="round"/><path d="M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71" stroke={color} strokeWidth="1.5" fill="none" strokeLinecap="round"/></>,
    copy: <><rect x="9" y="9" width="11" height="11" rx="2" stroke={color} strokeWidth="1.5" fill="none"/><path d="M5 15V5a2 2 0 012-2h10" stroke={color} strokeWidth="1.5" fill="none" strokeLinecap="round"/></>,
  };
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none">{icons[name]}</svg>;
};

// ─── Shared Styles ───
const S = {
  sidebar: { width: 260, background: T.white, borderRight: `1px solid ${T.sand}`, height: "100vh", position: "fixed", left: 0, top: 0, display: "flex", flexDirection: "column", zIndex: 50, transition: "transform 0.35s cubic-bezier(0.16,1,0.3,1)" },
  main: { marginLeft: 260, minHeight: "100vh", background: T.cream },
  page: { padding: "2rem 2.5rem", maxWidth: 1100 },
  card: { background: T.white, borderRadius: 16, border: `1px solid ${T.sand}`, padding: "1.5rem", transition: "box-shadow 0.3s, transform 0.3s" },
  badge: (bg, color) => ({ display: "inline-flex", alignItems: "center", padding: "0.25rem 0.7rem", borderRadius: 100, fontSize: 11, fontWeight: 500, background: bg, color, letterSpacing: "0.03em" }),
  btn: (variant = "primary") => ({
    display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 8,
    padding: variant === "sm" ? "0.45rem 1rem" : "0.65rem 1.5rem",
    borderRadius: 100, border: "none", cursor: "pointer", fontFamily: font.body,
    fontSize: variant === "sm" ? 12 : 13, fontWeight: 500, letterSpacing: "0.03em",
    transition: "all 0.3s cubic-bezier(0.16,1,0.3,1)", textDecoration: "none",
    ...(variant === "primary" ? { background: T.burgundy, color: T.white } :
       variant === "gold" ? { background: T.gold, color: T.white } :
       variant === "ghost" ? { background: "transparent", color: T.charcoalSoft, border: `1.5px solid ${T.sand}` } :
       variant === "sm" ? { background: T.goldFaint, color: T.burgundy } :
       { background: T.burgundy, color: T.white }),
  }),
  input: { width: "100%", padding: "0.65rem 0.85rem", borderRadius: 10, border: `1.5px solid ${T.sand}`, fontFamily: font.body, fontSize: 14, background: T.white, color: T.charcoal, outline: "none", transition: "border-color 0.2s" },
  label: { display: "block", fontSize: 12, fontWeight: 500, color: T.charcoalSoft, marginBottom: 6, letterSpacing: "0.02em" },
  sectionTitle: { fontFamily: font.display, fontSize: 28, fontWeight: 300, color: T.charcoal, lineHeight: 1.2 },
  tableHead: { fontSize: 11, fontWeight: 500, color: T.warmGray, textTransform: "uppercase", letterSpacing: "0.08em", padding: "0.75rem 1rem", textAlign: "left", borderBottom: `1px solid ${T.sand}` },
  tableCell: { padding: "0.85rem 1rem", borderBottom: `1px solid ${T.sandLight}`, fontSize: 13.5, color: T.charcoal },
};

// ─── Status helpers ───
const statusMap = {
  confirmed: { label: "Подтвердил", bg: T.successBg, color: T.success, icon: "check" },
  declined: { label: "Отказ", bg: T.dangerBg, color: T.danger, icon: "x" },
  maybe: { label: "Под вопросом", bg: T.warningBg, color: T.warning, icon: "clock" },
  pending: { label: "Не ответил", bg: T.infoBg, color: T.info, icon: "clock" },
};

// ═══════════════════════════════════════════
// SIDEBAR
// ═══════════════════════════════════════════
const Sidebar = ({ active, onNav }) => {
  const items = [
    { id: "dashboard", icon: "home", label: "Дашборд" },
    { id: "guests", icon: "users", label: "Гости" },
    { id: "constructor", icon: "edit", label: "Конструктор" },
    { id: "preview", icon: "eye", label: "Предпросмотр" },
    { id: "sending", icon: "send", label: "Рассылка" },
  ];
  return (
    <aside style={S.sidebar}>
      <div style={{ padding: "1.5rem 1.5rem 2rem", borderBottom: `1px solid ${T.sand}` }}>
        <div style={{ fontFamily: font.display, fontSize: 22, fontWeight: 600, color: T.burgundy }}>Qona<span style={{ color: T.gold }}>q</span></div>
        <div style={{ fontSize: 11, color: T.warmGray, marginTop: 4, letterSpacing: "0.03em" }}>Панель организатора</div>
      </div>
      {/* Event selector */}
      <div style={{ padding: "1rem 1rem 0.5rem" }}>
        <div style={{ ...S.card, padding: "0.75rem 1rem", cursor: "pointer", display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 36, height: 36, borderRadius: 10, background: `linear-gradient(135deg, ${T.burgundy}, ${T.terra})`, display: "flex", alignItems: "center", justifyContent: "center", color: T.white, fontSize: 15, fontFamily: font.display, fontWeight: 600 }}>А&N</div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 13, fontWeight: 500, color: T.charcoal, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>Свадьба Айданы & Нурлана</div>
            <div style={{ fontSize: 11, color: T.warmGray }}>15 июля 2026</div>
          </div>
          <Icon name="chevronRight" size={14} color={T.warmGray} />
        </div>
      </div>
      {/* Nav */}
      <nav style={{ flex: 1, padding: "0.75rem 0.75rem", display: "flex", flexDirection: "column", gap: 2 }}>
        {items.map(it => (
          <button key={it.id} onClick={() => onNav(it.id)} style={{
            display: "flex", alignItems: "center", gap: 10, padding: "0.6rem 0.85rem", borderRadius: 10,
            border: "none", cursor: "pointer", fontFamily: font.body, fontSize: 13.5, fontWeight: active === it.id ? 500 : 400,
            background: active === it.id ? T.goldFaint : "transparent",
            color: active === it.id ? T.burgundy : T.charcoalSoft,
            transition: "all 0.2s", width: "100%", textAlign: "left",
          }}>
            <Icon name={it.icon} size={18} color={active === it.id ? T.burgundy : T.warmGray} />
            {it.label}
          </button>
        ))}
      </nav>
      {/* Bottom */}
      <div style={{ padding: "1rem 1.25rem", borderTop: `1px solid ${T.sand}`, display: "flex", alignItems: "center", gap: 10 }}>
        <div style={{ width: 32, height: 32, borderRadius: "50%", background: `linear-gradient(135deg, ${T.gold}, ${T.terra})`, display: "flex", alignItems: "center", justifyContent: "center", color: T.white, fontSize: 12, fontWeight: 600 }}>АК</div>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 13, fontWeight: 500, color: T.charcoal }}>Айгерим К.</div>
          <div style={{ fontSize: 11, color: T.warmGray }}>Организатор</div>
        </div>
        <button style={{ background: "none", border: "none", cursor: "pointer", padding: 4 }}>
          <Icon name="settings" size={16} color={T.warmGray} />
        </button>
      </div>
    </aside>
  );
};

// ═══════════════════════════════════════════
// DASHBOARD
// ═══════════════════════════════════════════
const Dashboard = () => {
  const confirmed = MOCK_GUESTS.filter(g => g.status === "confirmed");
  const totalPeople = MOCK_GUESTS.reduce((s, g) => s + g.count, 0);
  const confirmedPeople = confirmed.reduce((s, g) => s + g.count, 0);

  const stats = [
    { label: "Всего гостей", value: MOCK_GUESTS.length, sub: `${totalPeople} человек`, accent: T.charcoal },
    { label: "Подтвердили", value: confirmed.length, sub: `${confirmedPeople} человек`, accent: T.success },
    { label: "Не ответили", value: MOCK_GUESTS.filter(g => g.status === "pending").length, sub: "ожидают ответа", accent: T.warning },
    { label: "Отказали", value: MOCK_GUESTS.filter(g => g.status === "declined").length, sub: "", accent: T.danger },
  ];

  return (
    <div style={S.page}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "2rem", flexWrap: "wrap", gap: "1rem" }}>
        <div>
          <h1 style={{ ...S.sectionTitle, fontSize: 32 }}>Свадьба <span style={{ fontStyle: "italic", color: T.burgundy }}>Айданы & Нурлана</span></h1>
          <p style={{ fontSize: 14, color: T.warmGray, marginTop: 6 }}>15 июля 2026 · Астана · 3 этапа</p>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <button style={S.btn("ghost")}><Icon name="download" size={15} /> Экспорт</button>
          <button style={S.btn("primary")}><Icon name="send" size={15} /> Разослать</button>
        </div>
      </div>

      {/* Stats */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16, marginBottom: "2rem" }}>
        {stats.map((st, i) => (
          <div key={i} style={{ ...S.card, position: "relative", overflow: "hidden" }}>
            <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 3, background: st.accent, opacity: 0.5, borderRadius: "16px 16px 0 0" }} />
            <div style={{ fontSize: 11, color: T.warmGray, fontWeight: 500, letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: 8 }}>{st.label}</div>
            <div style={{ fontFamily: font.display, fontSize: 40, fontWeight: 300, color: st.accent, lineHeight: 1 }}>{st.value}</div>
            {st.sub && <div style={{ fontSize: 12, color: T.warmGray, marginTop: 4 }}>{st.sub}</div>}
          </div>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1.4fr 1fr", gap: 20 }}>
        {/* Recent RSVP */}
        <div style={S.card}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
            <h3 style={{ fontFamily: font.display, fontSize: 20, fontWeight: 500, color: T.charcoal }}>Последние ответы</h3>
            <span style={{ fontSize: 12, color: T.gold, cursor: "pointer", fontWeight: 500 }}>Все →</span>
          </div>
          {MOCK_GUESTS.filter(g => g.status !== "pending").slice(0, 5).map(g => {
            const st = statusMap[g.status];
            return (
              <div key={g.id} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0.65rem 0", borderBottom: `1px solid ${T.sandLight}` }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <div style={{ width: 34, height: 34, borderRadius: "50%", background: `linear-gradient(135deg, ${T.ivory}, ${T.sand})`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 600, color: T.burgundy }}>{g.name[0]}</div>
                  <div>
                    <div style={{ fontSize: 13.5, fontWeight: 500, color: T.charcoal }}>{g.name}</div>
                    <div style={{ fontSize: 11, color: T.warmGray }}>{g.count} чел. · {g.side}</div>
                  </div>
                </div>
                <span style={S.badge(st.bg, st.color)}><Icon name={st.icon} size={12} color={st.color} /> <span style={{ marginLeft: 4 }}>{st.label}</span></span>
              </div>
            );
          })}
        </div>

        {/* Stages */}
        <div style={S.card}>
          <h3 style={{ fontFamily: font.display, fontSize: 20, fontWeight: 500, color: T.charcoal, marginBottom: 16 }}>Этапы события</h3>
          {MOCK_STAGES.map((stage, i) => (
            <div key={stage.id} style={{ display: "flex", gap: 14, padding: "0.75rem 0", borderBottom: i < MOCK_STAGES.length - 1 ? `1px solid ${T.sandLight}` : "none" }}>
              <div style={{ width: 44, height: 44, borderRadius: 12, background: i === 0 ? `linear-gradient(135deg, ${T.burgundy}, ${T.burgundyDeep})` : i === 1 ? `linear-gradient(135deg, ${T.gold}, ${T.terra})` : `linear-gradient(135deg, ${T.terra}, ${T.burgundy})`, display: "flex", alignItems: "center", justifyContent: "center", color: T.white, fontSize: 16, flexShrink: 0 }}>
                {i === 0 ? "👰" : i === 1 ? "🕌" : "🎉"}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 14, fontWeight: 500, color: T.charcoal }}>{stage.name}</div>
                <div style={{ fontSize: 12, color: T.warmGray, marginTop: 2 }}>{stage.date} · {stage.time}</div>
                <div style={{ fontSize: 12, color: T.warmGray }}>{stage.place}</div>
              </div>
            </div>
          ))}
          <button style={{ ...S.btn("sm"), width: "100%", marginTop: 12, justifyContent: "center" }}>
            <Icon name="plus" size={14} color={T.burgundy} /> Добавить этап
          </button>
        </div>
      </div>

      {/* Progress bar */}
      <div style={{ ...S.card, marginTop: 20 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
          <h3 style={{ fontFamily: font.display, fontSize: 20, fontWeight: 500 }}>Прогресс ответов</h3>
          <span style={{ fontSize: 13, color: T.warmGray }}>{Math.round((confirmed.length / MOCK_GUESTS.length) * 100)}% подтвердили</span>
        </div>
        <div style={{ height: 10, background: T.ivory, borderRadius: 100, overflow: "hidden", display: "flex" }}>
          <div style={{ width: `${(MOCK_GUESTS.filter(g=>g.status==="confirmed").length / MOCK_GUESTS.length)*100}%`, background: T.success, borderRadius: 100, transition: "width 1s" }} />
          <div style={{ width: `${(MOCK_GUESTS.filter(g=>g.status==="maybe").length / MOCK_GUESTS.length)*100}%`, background: T.warning }} />
          <div style={{ width: `${(MOCK_GUESTS.filter(g=>g.status==="declined").length / MOCK_GUESTS.length)*100}%`, background: T.danger }} />
        </div>
        <div style={{ display: "flex", gap: 20, marginTop: 10 }}>
          {[["Подтвердили", T.success], ["Под вопросом", T.warning], ["Отказали", T.danger], ["Не ответили", T.info]].map(([l, c]) => (
            <div key={l} style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, color: T.charcoalSoft }}>
              <div style={{ width: 8, height: 8, borderRadius: "50%", background: c }} />{l}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// ═══════════════════════════════════════════
// GUEST MANAGEMENT
// ═══════════════════════════════════════════
const GuestsPage = () => {
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");

  const filtered = MOCK_GUESTS.filter(g => {
    if (filter !== "all" && g.status !== filter) return false;
    if (search && !g.name.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  return (
    <div style={S.page}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "1.75rem", flexWrap: "wrap", gap: "1rem" }}>
        <div>
          <h1 style={S.sectionTitle}>Гостевая <span style={{ fontStyle: "italic", color: T.burgundy }}>база</span></h1>
          <p style={{ fontSize: 14, color: T.warmGray, marginTop: 4 }}>{MOCK_GUESTS.length} гостей · {MOCK_GUESTS.reduce((s, g) => s + g.count, 0)} человек</p>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <button style={S.btn("ghost")}><Icon name="download" size={15} /> CSV</button>
          <button style={S.btn("primary")}><Icon name="plus" size={15} /> Добавить</button>
        </div>
      </div>

      {/* Filters */}
      <div style={{ ...S.card, padding: "1rem 1.25rem", marginBottom: 16, display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12 }}>
        <div style={{ display: "flex", gap: 6 }}>
          {[["all", "Все"], ["confirmed", "Подтвердили"], ["pending", "Не ответили"], ["maybe", "Под вопросом"], ["declined", "Отказали"]].map(([k, l]) => (
            <button key={k} onClick={() => setFilter(k)} style={{
              padding: "0.4rem 0.9rem", borderRadius: 100, border: `1.5px solid ${filter === k ? T.burgundy : T.sand}`,
              background: filter === k ? T.burgundy : "transparent", color: filter === k ? T.white : T.charcoalSoft,
              fontSize: 12, fontWeight: 500, cursor: "pointer", fontFamily: font.body, transition: "all 0.2s"
            }}>{l}</button>
          ))}
        </div>
        <div style={{ position: "relative" }}>
          <input placeholder="Поиск..." value={search} onChange={e => setSearch(e.target.value)}
            style={{ ...S.input, width: 220, paddingLeft: "2.25rem", fontSize: 13 }} />
          <div style={{ position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)" }}>
            <Icon name="search" size={15} color={T.warmGray} />
          </div>
        </div>
      </div>

      {/* Table */}
      <div style={{ ...S.card, padding: 0, overflow: "hidden" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ background: T.ivory }}>
              <th style={S.tableHead}>Имя / Семья</th>
              <th style={S.tableHead}>Чел.</th>
              <th style={S.tableHead}>Сторона</th>
              <th style={S.tableHead}>Статус</th>
              <th style={S.tableHead}>Телефон</th>
              <th style={{ ...S.tableHead, textAlign: "right" }}>Действия</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(g => {
              const st = statusMap[g.status];
              return (
                <tr key={g.id} style={{ transition: "background 0.15s", cursor: "pointer" }}
                  onMouseEnter={e => e.currentTarget.style.background = T.ivory}
                  onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
                  <td style={S.tableCell}>
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <div style={{ width: 32, height: 32, borderRadius: "50%", background: `linear-gradient(135deg, ${T.ivory}, ${T.sand})`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 600, color: T.burgundy, flexShrink: 0 }}>{g.name[0]}</div>
                      <span style={{ fontWeight: 500 }}>{g.name}</span>
                    </div>
                  </td>
                  <td style={S.tableCell}>{g.count}</td>
                  <td style={S.tableCell}><span style={{ fontSize: 12, color: T.warmGray }}>{g.side}</span></td>
                  <td style={S.tableCell}><span style={S.badge(st.bg, st.color)}>{st.label}</span></td>
                  <td style={{ ...S.tableCell, fontSize: 12, color: T.warmGray }}>{g.phone}</td>
                  <td style={{ ...S.tableCell, textAlign: "right" }}>
                    <div style={{ display: "flex", gap: 4, justifyContent: "flex-end" }}>
                      <button style={{ background: T.goldFaint, border: "none", borderRadius: 8, padding: "0.35rem 0.5rem", cursor: "pointer" }} title="Копировать ссылку"><Icon name="link" size={14} color={T.gold} /></button>
                      <button style={{ background: T.goldFaint, border: "none", borderRadius: 8, padding: "0.35rem 0.5rem", cursor: "pointer" }} title="Напомнить"><Icon name="bell" size={14} color={T.gold} /></button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// ═══════════════════════════════════════════
// INVITATION CONSTRUCTOR
// ═══════════════════════════════════════════
const Constructor = () => {
  const [blocks, setBlocks] = useState([
    { id: "cover", label: "Обложка", icon: "🖼", enabled: true },
    { id: "names", label: "Имена", icon: "💑", enabled: true },
    { id: "countdown", label: "Обратный отсчёт", icon: "⏳", enabled: true },
    { id: "story", label: "Обращение", icon: "💌", enabled: true },
    { id: "program", label: "Программа", icon: "📋", enabled: true },
    { id: "map", label: "Карта", icon: "📍", enabled: true },
    { id: "dresscode", label: "Дресс-код", icon: "👗", enabled: false },
    { id: "gallery", label: "Галерея", icon: "📸", enabled: false },
    { id: "rsvp", label: "RSVP", icon: "✅", enabled: true },
    { id: "contacts", label: "Контакты", icon: "📞", enabled: true },
  ]);

  const toggle = (id) => setBlocks(bs => bs.map(b => b.id === id ? { ...b, enabled: !b.enabled } : b));

  return (
    <div style={S.page}>
      <h1 style={{ ...S.sectionTitle, marginBottom: 6 }}>Конструктор <span style={{ fontStyle: "italic", color: T.burgundy }}>приглашения</span></h1>
      <p style={{ fontSize: 14, color: T.warmGray, marginBottom: "1.75rem" }}>Включайте, отключайте и настраивайте блоки страницы</p>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1.2fr", gap: 24, alignItems: "start" }}>
        {/* Block toggles */}
        <div>
          <div style={{ ...S.card, padding: 0 }}>
            <div style={{ padding: "1rem 1.25rem", borderBottom: `1px solid ${T.sand}`, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <h3 style={{ fontFamily: font.display, fontSize: 18, fontWeight: 500 }}>Блоки страницы</h3>
              <span style={{ fontSize: 11, color: T.warmGray }}>{blocks.filter(b => b.enabled).length} из {blocks.length}</span>
            </div>
            {blocks.map((b, i) => (
              <div key={b.id} style={{
                display: "flex", alignItems: "center", justifyContent: "space-between",
                padding: "0.75rem 1.25rem", borderBottom: i < blocks.length - 1 ? `1px solid ${T.sandLight}` : "none",
                opacity: b.enabled ? 1 : 0.5, transition: "opacity 0.2s"
              }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <span style={{ fontSize: 18 }}>{b.icon}</span>
                  <span style={{ fontSize: 13.5, fontWeight: 500, color: T.charcoal }}>{b.label}</span>
                </div>
                <button onClick={() => toggle(b.id)} style={{
                  width: 40, height: 22, borderRadius: 100, border: "none", cursor: "pointer",
                  background: b.enabled ? T.burgundy : T.sand, position: "relative", transition: "background 0.25s",
                  padding: 0
                }}>
                  <div style={{
                    width: 16, height: 16, borderRadius: "50%", background: T.white,
                    position: "absolute", top: 3, left: b.enabled ? 21 : 3,
                    transition: "left 0.25s cubic-bezier(0.16,1,0.3,1)",
                    boxShadow: "0 1px 3px rgba(0,0,0,0.15)"
                  }} />
                </button>
              </div>
            ))}
          </div>

          {/* Style settings */}
          <div style={{ ...S.card, marginTop: 16 }}>
            <h3 style={{ fontFamily: font.display, fontSize: 18, fontWeight: 500, marginBottom: 16 }}>Стиль</h3>
            <div style={{ marginBottom: 14 }}>
              <label style={S.label}>Шаблон</label>
              <div style={{ display: "flex", gap: 8 }}>
                {[["Modern", T.charcoal], ["Elegant", T.burgundyDeep], ["National", T.gold]].map(([n, c]) => (
                  <div key={n} style={{
                    flex: 1, padding: "0.6rem", borderRadius: 10, textAlign: "center", fontSize: 12, fontWeight: 500,
                    border: `1.5px solid ${n === "Elegant" ? T.burgundy : T.sand}`,
                    background: n === "Elegant" ? T.goldFaint : "transparent",
                    color: n === "Elegant" ? T.burgundy : T.charcoalSoft, cursor: "pointer"
                  }}>{n}</div>
                ))}
              </div>
            </div>
            <div style={{ marginBottom: 14 }}>
              <label style={S.label}>Язык</label>
              <div style={{ display: "flex", gap: 8 }}>
                {["Русский", "Қазақша", "Оба"].map(l => (
                  <button key={l} style={{
                    flex: 1, padding: "0.5rem", borderRadius: 8, fontSize: 12, fontWeight: 500, cursor: "pointer",
                    border: `1.5px solid ${l === "Оба" ? T.burgundy : T.sand}`,
                    background: l === "Оба" ? T.burgundy : "transparent",
                    color: l === "Оба" ? T.white : T.charcoalSoft, fontFamily: font.body,
                  }}>{l}</button>
                ))}
              </div>
            </div>
            <div>
              <label style={S.label}>Акцентный цвет</label>
              <div style={{ display: "flex", gap: 8 }}>
                {[T.burgundy, T.gold, T.terra, T.charcoal, "#3B6B5F", "#5B4A8A"].map(c => (
                  <div key={c} style={{
                    width: 28, height: 28, borderRadius: "50%", background: c, cursor: "pointer",
                    border: c === T.burgundy ? `2px solid ${T.charcoal}` : "2px solid transparent",
                    transition: "border-color 0.2s"
                  }} />
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Live preview */}
        <div style={{ position: "sticky", top: "1rem" }}>
          <div style={{ background: T.charcoal, borderRadius: 24, padding: "12px 12px 16px", boxShadow: `0 20px 60px rgba(0,0,0,0.15)` }}>
            {/* Phone frame top */}
            <div style={{ display: "flex", justifyContent: "center", marginBottom: 8 }}>
              <div style={{ width: 100, height: 4, borderRadius: 100, background: "rgba(255,255,255,0.15)" }} />
            </div>
            <div style={{ background: T.white, borderRadius: 16, overflow: "hidden", maxHeight: 580, overflowY: "auto" }}>
              {/* Mini preview of invitation */}
              <div style={{ background: `linear-gradient(180deg, ${T.burgundyDeep} 0%, ${T.burgundy} 100%)`, padding: "3rem 2rem 2.5rem", textAlign: "center" }}>
                <div style={{ fontSize: 11, letterSpacing: "0.2em", textTransform: "uppercase", color: "rgba(220,198,154,0.6)", marginBottom: 8 }}>Свадьба</div>
                <div style={{ fontFamily: font.display, fontSize: 28, color: T.goldLight, fontWeight: 300, lineHeight: 1.2 }}>Айдана <span style={{ fontStyle: "italic", opacity: 0.6, fontWeight: 300 }}>&</span> Нурлан</div>
                <div style={{ width: 30, height: 1, background: "rgba(220,198,154,0.3)", margin: "1rem auto" }} />
                <div style={{ fontSize: 11, letterSpacing: "0.15em", color: "rgba(255,255,255,0.5)" }}>15 · ИЮЛЯ · 2026</div>
              </div>
              {/* Countdown */}
              <div style={{ padding: "1.5rem 1.5rem", textAlign: "center", background: T.cream }}>
                <div style={{ fontSize: 10, letterSpacing: "0.15em", textTransform: "uppercase", color: T.warmGray, marginBottom: 10 }}>До события</div>
                <div style={{ display: "flex", justifyContent: "center", gap: 12 }}>
                  {[["82", "дней"], ["14", "часов"], ["32", "минут"]].map(([v, l]) => (
                    <div key={l}>
                      <div style={{ fontFamily: font.display, fontSize: 28, fontWeight: 300, color: T.burgundy, lineHeight: 1 }}>{v}</div>
                      <div style={{ fontSize: 9, color: T.warmGray, letterSpacing: "0.05em", marginTop: 2 }}>{l}</div>
                    </div>
                  ))}
                </div>
              </div>
              {/* Story */}
              <div style={{ padding: "1.25rem 1.5rem", textAlign: "center" }}>
                <div style={{ fontFamily: font.display, fontSize: 18, color: T.charcoal, fontWeight: 500, marginBottom: 8 }}>Дорогие гости!</div>
                <p style={{ fontSize: 12, lineHeight: 1.7, color: T.warmGray }}>Мы рады пригласить вас на самый важный день в нашей жизни. Будем счастливы разделить этот праздник вместе с вами.</p>
              </div>
              {/* Program */}
              <div style={{ padding: "1.25rem 1.5rem", background: T.ivory }}>
                <div style={{ fontSize: 10, letterSpacing: "0.15em", textTransform: "uppercase", color: T.gold, marginBottom: 10, textAlign: "center" }}>Программа</div>
                {MOCK_STAGES.map((s, i) => (
                  <div key={s.id} style={{ display: "flex", gap: 10, marginBottom: i < 2 ? 10 : 0 }}>
                    <div style={{ fontSize: 11, color: T.burgundy, fontWeight: 600, minWidth: 40 }}>{s.time}</div>
                    <div>
                      <div style={{ fontSize: 12.5, fontWeight: 500, color: T.charcoal }}>{s.name}</div>
                      <div style={{ fontSize: 11, color: T.warmGray }}>{s.place}</div>
                    </div>
                  </div>
                ))}
              </div>
              {/* RSVP */}
              <div style={{ padding: "1.5rem", textAlign: "center" }}>
                <div style={{ fontSize: 10, letterSpacing: "0.15em", textTransform: "uppercase", color: T.gold, marginBottom: 12 }}>Подтвердите участие</div>
                <div style={{ display: "flex", gap: 6, justifyContent: "center" }}>
                  <button style={{ padding: "0.5rem 1.1rem", borderRadius: 100, background: T.burgundy, color: T.white, border: "none", fontSize: 11, fontWeight: 500 }}>Буду ✓</button>
                  <button style={{ padding: "0.5rem 1.1rem", borderRadius: 100, background: T.ivory, color: T.charcoalSoft, border: "none", fontSize: 11 }}>Не смогу</button>
                  <button style={{ padding: "0.5rem 1.1rem", borderRadius: 100, background: T.ivory, color: T.charcoalSoft, border: "none", fontSize: 11 }}>Под вопросом</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// ═══════════════════════════════════════════
// PREVIEW (Guest-facing invitation)
// ═══════════════════════════════════════════
const Preview = () => {
  const [rsvp, setRsvp] = useState(null);
  const [guestCount, setGuestCount] = useState(2);
  const [lang, setLang] = useState("ru");

  return (
    <div style={S.page}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
        <div>
          <h1 style={S.sectionTitle}>Предпросмотр <span style={{ fontStyle: "italic", color: T.burgundy }}>приглашения</span></h1>
          <p style={{ fontSize: 14, color: T.warmGray, marginTop: 4 }}>Так видит приглашение гость «Семья Нургалиевых»</p>
        </div>
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <div style={{ display: "flex", borderRadius: 100, border: `1.5px solid ${T.sand}`, overflow: "hidden" }}>
            {["ru", "kz"].map(l => (
              <button key={l} onClick={() => setLang(l)} style={{
                padding: "0.4rem 0.85rem", border: "none", fontSize: 12, fontWeight: 500, cursor: "pointer",
                background: lang === l ? T.burgundy : "transparent", color: lang === l ? T.white : T.charcoalSoft,
                fontFamily: font.body
              }}>{l === "ru" ? "Рус" : "Қаз"}</button>
            ))}
          </div>
          <button style={S.btn("ghost")}><Icon name="copy" size={14} /> Скопировать ссылку</button>
        </div>
      </div>

      {/* Full-width phone preview */}
      <div style={{ display: "flex", justifyContent: "center" }}>
        <div style={{ width: 390, background: T.charcoal, borderRadius: 32, padding: "14px 14px 20px", boxShadow: `0 24px 80px rgba(0,0,0,0.2)` }}>
          <div style={{ display: "flex", justifyContent: "center", marginBottom: 10 }}>
            <div style={{ width: 110, height: 5, borderRadius: 100, background: "rgba(255,255,255,0.12)" }} />
          </div>
          <div style={{ background: T.white, borderRadius: 20, overflow: "hidden", maxHeight: 700, overflowY: "auto" }}>
            {/* Cover */}
            <div style={{ background: `linear-gradient(180deg, ${T.burgundyDeep}, ${T.burgundy})`, padding: "4rem 2rem 3rem", textAlign: "center", position: "relative", overflow: "hidden" }}>
              <div style={{ position: "absolute", inset: 0, opacity: 0.04, backgroundImage: "radial-gradient(circle at 30% 20%, white 1px, transparent 1px), radial-gradient(circle at 70% 80%, white 1px, transparent 1px)", backgroundSize: "40px 40px" }} />
              <div style={{ position: "relative", zIndex: 1 }}>
                <div style={{ fontSize: 10, letterSpacing: "0.25em", textTransform: "uppercase", color: "rgba(220,198,154,0.5)", marginBottom: 16 }}>
                  {lang === "ru" ? "Приглашение на свадьбу" : "Тойға шақыру"}
                </div>
                <div style={{ fontFamily: font.display, fontSize: 36, color: T.goldLight, fontWeight: 300, lineHeight: 1.15 }}>
                  Айдана<br/><span style={{ fontStyle: "italic", fontSize: 24, opacity: 0.5 }}>&</span><br/>Нурлан
                </div>
                <div style={{ width: 40, height: 1, background: "rgba(220,198,154,0.25)", margin: "1.5rem auto" }} />
                <div style={{ fontSize: 11, letterSpacing: "0.2em", color: "rgba(255,255,255,0.45)" }}>15 · ИЮЛЯ · 2026 · АСТАНА</div>
              </div>
            </div>

            {/* Personal greeting */}
            <div style={{ padding: "1.75rem 1.75rem", textAlign: "center", background: T.cream }}>
              <div style={{ fontFamily: font.display, fontSize: 20, color: T.charcoal, fontWeight: 500, marginBottom: 8 }}>
                {lang === "ru" ? "Құрметті Семья Нургалиевых!" : "Құрметті Нұрғалиевтер отбасы!"}
              </div>
              <p style={{ fontSize: 13, lineHeight: 1.75, color: T.warmGray }}>
                {lang === "ru"
                  ? "Мы рады пригласить вас на самый важный день в нашей жизни. Будем счастливы разделить этот праздник вместе с вами и вашей семьёй."
                  : "Біз сізді өміріміздегі ең маңызды күнге шақыруға қуаныштымыз. Бұл мерекені сіздермен бірге бөлісуге қуаныштымыз."}
              </p>
            </div>

            {/* Countdown */}
            <div style={{ padding: "1.25rem", textAlign: "center" }}>
              <div style={{ fontSize: 9, letterSpacing: "0.2em", textTransform: "uppercase", color: T.gold, marginBottom: 10 }}>{lang === "ru" ? "До события осталось" : "Тойға дейін"}</div>
              <div style={{ display: "flex", justifyContent: "center", gap: 16 }}>
                {[["82", lang === "ru" ? "дней" : "күн"], ["14", lang === "ru" ? "часов" : "сағат"], ["32", lang === "ru" ? "мин" : "мин"]].map(([v, l]) => (
                  <div key={l} style={{ background: T.ivory, borderRadius: 12, padding: "0.6rem 0.9rem", minWidth: 60 }}>
                    <div style={{ fontFamily: font.display, fontSize: 30, fontWeight: 300, color: T.burgundy, lineHeight: 1 }}>{v}</div>
                    <div style={{ fontSize: 9, color: T.warmGray, marginTop: 3 }}>{l}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Program */}
            <div style={{ padding: "1.5rem 1.75rem", background: T.ivory }}>
              <div style={{ fontSize: 9, letterSpacing: "0.2em", textTransform: "uppercase", color: T.gold, marginBottom: 14, textAlign: "center" }}>{lang === "ru" ? "Программа" : "Бағдарлама"}</div>
              {MOCK_STAGES.map((s, i) => (
                <div key={s.id} style={{
                  display: "flex", gap: 14, padding: "0.85rem 0",
                  borderBottom: i < 2 ? `1px solid ${T.sand}` : "none"
                }}>
                  <div style={{
                    width: 42, height: 42, borderRadius: 12,
                    background: i === 0 ? `linear-gradient(135deg, ${T.burgundy}, ${T.burgundyDeep})` : i === 1 ? `linear-gradient(135deg, ${T.gold}, ${T.terra})` : `linear-gradient(135deg, ${T.terra}, ${T.burgundy})`,
                    display: "flex", alignItems: "center", justifyContent: "center", color: T.white, fontSize: 18, flexShrink: 0
                  }}>{i === 0 ? "👰" : i === 1 ? "🕌" : "🎉"}</div>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 600, color: T.charcoal }}>{s.name}</div>
                    <div style={{ fontSize: 12, color: T.warmGray, marginTop: 2 }}>{s.date} · {s.time}</div>
                    <div style={{ fontSize: 12, color: T.warmGray }}>{s.place}</div>
                  </div>
                </div>
              ))}
            </div>

            {/* Map placeholder */}
            <div style={{ padding: "1.5rem 1.75rem" }}>
              <div style={{ fontSize: 9, letterSpacing: "0.2em", textTransform: "uppercase", color: T.gold, marginBottom: 10, textAlign: "center" }}>{lang === "ru" ? "Как добраться" : "Жол көрсеткіш"}</div>
              <div style={{
                height: 140, borderRadius: 12, background: T.ivory, border: `1px solid ${T.sand}`,
                display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: 6
              }}>
                <Icon name="map" size={28} color={T.warmGray} />
                <span style={{ fontSize: 12, color: T.warmGray }}>Google Maps / 2GIS</span>
              </div>
            </div>

            {/* RSVP */}
            <div style={{ padding: "1.75rem", textAlign: "center", background: T.cream }}>
              <div style={{ fontFamily: font.display, fontSize: 20, fontWeight: 500, color: T.charcoal, marginBottom: 6 }}>
                {lang === "ru" ? "Подтвердите участие" : "Қатысуыңызды растаңыз"}
              </div>
              <p style={{ fontSize: 12, color: T.warmGray, marginBottom: 16 }}>
                {lang === "ru" ? "Нажмите кнопку и укажите количество гостей" : "Батырманы басып, қонақтар санын көрсетіңіз"}
              </p>
              <div style={{ display: "flex", gap: 8, justifyContent: "center", marginBottom: 16 }}>
                {[["confirmed", lang === "ru" ? "Буду" : "Келемін", T.burgundy, T.white],
                  ["declined", lang === "ru" ? "Не смогу" : "Келе алмаймын", T.ivory, T.charcoalSoft],
                  ["maybe", "🤔", T.ivory, T.charcoalSoft]].map(([s, l, bg, c]) => (
                  <button key={s} onClick={() => setRsvp(s)} style={{
                    padding: "0.55rem 1.2rem", borderRadius: 100, border: rsvp === s ? `2px solid ${T.burgundy}` : `2px solid transparent`,
                    background: rsvp === s ? T.burgundy : bg, color: rsvp === s ? T.white : c,
                    fontSize: 12, fontWeight: 500, cursor: "pointer", fontFamily: font.body, transition: "all 0.2s"
                  }}>{l}</button>
                ))}
              </div>
              {rsvp === "confirmed" && (
                <div style={{ background: T.white, borderRadius: 12, padding: "1rem", border: `1px solid ${T.sand}` }}>
                  <label style={{ ...S.label, textAlign: "left" }}>{lang === "ru" ? "Сколько человек придёт?" : "Неше адам келеді?"}</label>
                  <div style={{ display: "flex", alignItems: "center", gap: 12, justifyContent: "center", marginBottom: 12 }}>
                    <button onClick={() => setGuestCount(Math.max(1, guestCount - 1))} style={{ width: 32, height: 32, borderRadius: "50%", border: `1px solid ${T.sand}`, background: T.white, cursor: "pointer", fontSize: 16, display: "flex", alignItems: "center", justifyContent: "center" }}>−</button>
                    <span style={{ fontFamily: font.display, fontSize: 28, color: T.burgundy, minWidth: 40, textAlign: "center" }}>{guestCount}</span>
                    <button onClick={() => setGuestCount(guestCount + 1)} style={{ width: 32, height: 32, borderRadius: "50%", border: `1px solid ${T.sand}`, background: T.white, cursor: "pointer", fontSize: 16, display: "flex", alignItems: "center", justifyContent: "center" }}>+</button>
                  </div>
                  <textarea placeholder={lang === "ru" ? "Комментарий (необязательно)" : "Пікір (міндетті емес)"} style={{ ...S.input, height: 60, resize: "none", fontSize: 12 }} />
                  <button style={{ ...S.btn("primary"), width: "100%", marginTop: 10, justifyContent: "center" }}>
                    {lang === "ru" ? "Подтвердить" : "Растау"} ✓
                  </button>
                </div>
              )}
            </div>

            {/* Contacts */}
            <div style={{ padding: "1.25rem 1.75rem 2rem", textAlign: "center" }}>
              <div style={{ fontSize: 9, letterSpacing: "0.2em", textTransform: "uppercase", color: T.gold, marginBottom: 8 }}>{lang === "ru" ? "Координатор" : "Үйлестіруші"}</div>
              <div style={{ fontSize: 13, fontWeight: 500, color: T.charcoal }}>Айгерим Касымова</div>
              <div style={{ fontSize: 12, color: T.warmGray }}>+7 701 123 45 67</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// ═══════════════════════════════════════════
// SENDING PAGE
// ═══════════════════════════════════════════
const Sending = () => {
  const pending = MOCK_GUESTS.filter(g => g.status === "pending");
  const [copied, setCopied] = useState(null);

  const handleCopy = (id) => { setCopied(id); setTimeout(() => setCopied(null), 2000); };

  return (
    <div style={S.page}>
      <h1 style={{ ...S.sectionTitle, marginBottom: 6 }}>Рассылка <span style={{ fontStyle: "italic", color: T.burgundy }}>приглашений</span></h1>
      <p style={{ fontSize: 14, color: T.warmGray, marginBottom: "1.75rem" }}>Отправьте персональные ссылки через мессенджеры или скопируйте текст</p>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginBottom: 24 }}>
        {/* Quick share */}
        <div style={S.card}>
          <h3 style={{ fontFamily: font.display, fontSize: 18, fontWeight: 500, marginBottom: 16 }}>Быстрая отправка</h3>
          <div style={{ ...S.card, background: T.ivory, border: "none", padding: "1rem", marginBottom: 12 }}>
            <label style={S.label}>Текст сообщения</label>
            <textarea style={{ ...S.input, height: 100, resize: "none", fontSize: 13, background: T.white }} defaultValue={"Ассалаумағалейкум! 🤍\n\nРады пригласить вас на свадьбу Айданы и Нурлана!\n\n📅 15 июля 2026\n📍 Астана\n\nПодробности и подтверждение по ссылке:\nhttps://qonaq.kz/i/abc123"} />
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <button style={{ ...S.btn("primary"), flex: 1, justifyContent: "center", background: "#25D366" }}>
              WhatsApp
            </button>
            <button style={{ ...S.btn("primary"), flex: 1, justifyContent: "center", background: "#0088cc" }}>
              Telegram
            </button>
            <button style={{ ...S.btn("ghost"), flex: 1, justifyContent: "center" }}>
              <Icon name="copy" size={14} /> Копировать
            </button>
          </div>
        </div>

        {/* Stats */}
        <div style={S.card}>
          <h3 style={{ fontFamily: font.display, fontSize: 18, fontWeight: 500, marginBottom: 16 }}>Статистика доставки</h3>
          {[
            ["Ссылки созданы", MOCK_GUESTS.length, T.charcoal],
            ["Открыли ссылку", 7, T.info],
            ["Подтвердили", MOCK_GUESTS.filter(g => g.status === "confirmed").length, T.success],
            ["Не открыли", 3, T.warmGray],
          ].map(([l, v, c]) => (
            <div key={l} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "0.65rem 0", borderBottom: `1px solid ${T.sandLight}` }}>
              <span style={{ fontSize: 13.5, color: T.charcoalSoft }}>{l}</span>
              <span style={{ fontFamily: font.display, fontSize: 22, fontWeight: 400, color: c }}>{v}</span>
            </div>
          ))}
          <button style={{ ...S.btn("sm"), width: "100%", marginTop: 14, justifyContent: "center" }}>
            <Icon name="bell" size={14} color={T.burgundy} /> Напомнить неответившим ({pending.length})
          </button>
        </div>
      </div>

      {/* Per-guest links */}
      <div style={S.card}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
          <h3 style={{ fontFamily: font.display, fontSize: 18, fontWeight: 500 }}>Персональные ссылки</h3>
          <button style={S.btn("sm")}><Icon name="download" size={14} color={T.burgundy} /> PDF всех приглашений</button>
        </div>
        <div style={{ display: "grid", gap: 8 }}>
          {MOCK_GUESTS.map(g => {
            const st = statusMap[g.status];
            const link = `qonaq.kz/i/${g.name.replace(/\s/g, '').slice(0,6).toLowerCase()}`;
            return (
              <div key={g.id} style={{ display: "flex", alignItems: "center", gap: 12, padding: "0.6rem 0.75rem", background: T.ivory, borderRadius: 10 }}>
                <div style={{ width: 30, height: 30, borderRadius: "50%", background: `linear-gradient(135deg, ${T.ivory}, ${T.sand})`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 600, color: T.burgundy, border: `1px solid ${T.sand}` }}>{g.name[0]}</div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 13, fontWeight: 500, color: T.charcoal }}>{g.name}</div>
                  <div style={{ fontSize: 11, color: T.warmGray, fontFamily: "monospace" }}>{link}</div>
                </div>
                <span style={{ ...S.badge(st.bg, st.color), fontSize: 10 }}>{st.label}</span>
                <button onClick={() => handleCopy(g.id)} style={{
                  background: copied === g.id ? T.successBg : T.goldFaint,
                  border: "none", borderRadius: 8, padding: "0.35rem 0.6rem", cursor: "pointer",
                  display: "flex", alignItems: "center", gap: 4, fontSize: 11, fontWeight: 500,
                  color: copied === g.id ? T.success : T.burgundy, fontFamily: font.body, transition: "all 0.2s"
                }}>
                  <Icon name={copied === g.id ? "check" : "copy"} size={12} color={copied === g.id ? T.success : T.burgundy} />
                  {copied === g.id ? "Скопировано" : "Копировать"}
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

// ═══════════════════════════════════════════
// APP SHELL
// ═══════════════════════════════════════════
export default function App() {
  const [page, setPage] = useState("dashboard");

  const pages = { dashboard: Dashboard, guests: GuestsPage, constructor: Constructor, preview: Preview, sending: Sending };
  const PageComponent = pages[page];

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;0,700;1,300;1,400&family=Outfit:wght@300;400;500;600&display=swap');
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: 'Outfit', sans-serif; background: ${T.cream}; }
        ::-webkit-scrollbar { width: 6px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: ${T.sand}; border-radius: 3px; }
        ::-webkit-scrollbar-thumb:hover { background: ${T.warmGray}; }
        input:focus, textarea:focus { border-color: ${T.gold} !important; box-shadow: 0 0 0 3px rgba(201,169,110,0.1); }
        button:hover { opacity: 0.92; }
        @media (max-width: 900px) {
          .qonaq-sidebar { transform: translateX(-100%) !important; }
          .qonaq-main { margin-left: 0 !important; }
        }
      `}</style>
      <div style={{ display: "flex" }}>
        <Sidebar active={page} onNav={setPage} />
        <main className="qonaq-main" style={S.main}>
          <PageComponent />
        </main>
      </div>
    </>
  );
}
