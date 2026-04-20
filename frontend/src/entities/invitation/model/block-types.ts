// ─── Color Keys ──────────────────────────────────────────
export type ColorKey = 'accent' | 'text' | 'muted' | 'background';

// ─── Per-Block Props ─────────────────────────────────────
export interface TextProps {
  content: string;
  fontSize: number;
  letterSpacing: number;
  family: 'sans' | 'serif';
  color: ColorKey;
  align: 'left' | 'center' | 'right';
  opacity: number;
  weight: 400 | 500 | 600 | 700;
  lineHeight: number;
  style: 'normal' | 'italic';
}

export interface NamesProps {
  content: string;
  fontSize: number;
  family: 'sans' | 'serif';
  color: ColorKey;
}

export interface DatetimeProps {
  dateText: string;
  timeText: string;
  showBorder: boolean;
  showBackground: boolean;
}

export interface VenueProps {
  venueName: string;
  address: string;
  mapUrl: string;
  showIcon: boolean;
}

export type DividerStyle = 'line' | 'ornament' | 'dots';
export interface DividerProps {
  style: DividerStyle;
  width: number;
  opacity: number;
}

export type OrnamentPattern = 'wave' | 'diamond' | 'laurel' | 'simple';
export interface OrnamentProps {
  patternId: OrnamentPattern;
  opacity: number;
  width: number;
}

export interface ImageProps {
  url?: string;
  width: number;
  height: number;
  borderRadius: number; // 0–50 (%)
}

export interface ButtonItem {
  id: string;
  label: string;
  icon: string;
  url?: string;
}
export interface ButtonProps {
  buttons: ButtonItem[];
}

export interface SpacerProps {
  height: number;
}

export interface QrProps {
  url: string;
  label: string;
}

export interface CustomProps {
  label: string;
  value: string;
}

// ─── Discriminated map ───────────────────────────────────
export interface BlockPropsMap {
  text: TextProps;
  names: NamesProps;
  datetime: DatetimeProps;
  venue: VenueProps;
  divider: DividerProps;
  ornament: OrnamentProps;
  image: ImageProps;
  button: ButtonProps;
  spacer: SpacerProps;
  qr: QrProps;
  custom: CustomProps;
}

export type BlockType = keyof BlockPropsMap;

export type Block = {
  [K in BlockType]: {
    id: string;
    type: K;
    props: BlockPropsMap[K];
    linkOnly?: boolean;
  };
}[BlockType];

// ─── Palette ─────────────────────────────────────────────
export interface Palette {
  name: string;
  bg: string;
  text: string;
  accent: string;
  muted: string;
  line: string;
  accentSoft: string;
  accentBorder: string;
  swatches: [string, string, string];
}

export const PALETTES: Record<string, Palette> = {
  gold: {
    name: 'Gold',
    bg: '#FFF8EE',
    text: '#1A1714',
    accent: '#C6930A',
    muted: '#8B7D5F',
    line: 'rgba(26,23,20,0.12)',
    accentSoft: 'rgba(198,147,10,0.1)',
    accentBorder: 'rgba(198,147,10,0.25)',
    swatches: ['#FFF8EE', '#1A1714', '#C6930A'],
  },
  olive: {
    name: 'Olive',
    bg: '#F0F7F4',
    text: '#1B4332',
    accent: '#D4A843',
    muted: '#5D7A6E',
    line: 'rgba(27,67,50,0.12)',
    accentSoft: 'rgba(212,168,67,0.12)',
    accentBorder: 'rgba(212,168,67,0.3)',
    swatches: ['#F0F7F4', '#1B4332', '#D4A843'],
  },
  blush: {
    name: 'Blush',
    bg: '#FFF0F5',
    text: '#4A1942',
    accent: '#C77DBA',
    muted: '#8B5C82',
    line: 'rgba(74,25,66,0.12)',
    accentSoft: 'rgba(199,125,186,0.12)',
    accentBorder: 'rgba(199,125,186,0.3)',
    swatches: ['#FFF0F5', '#4A1942', '#C77DBA'],
  },
  mono: {
    name: 'Mono',
    bg: '#FAFAFA',
    text: '#0D0D0D',
    accent: '#3A3A3A',
    muted: '#737373',
    line: 'rgba(0,0,0,0.1)',
    accentSoft: 'rgba(58,58,58,0.08)',
    accentBorder: 'rgba(58,58,58,0.2)',
    swatches: ['#FAFAFA', '#0D0D0D', '#8A8A8A'],
  },
};

// ─── Font Pairs ──────────────────────────────────────────
export interface FontPair {
  id: string;
  displayName: string;
  displayFont: string;
  bodyFont: string;
  previewText: string;
}

export const FONT_PAIRS: FontPair[] = [
  {
    id: 'fraunces-inter',
    displayName: 'Fraunces · Inter Tight',
    displayFont: "'Fraunces', Georgia, serif",
    bodyFont: "'Inter Tight', system-ui, sans-serif",
    previewText: 'Айгерім',
  },
  {
    id: 'playfair-dm',
    displayName: 'Playfair · DM Sans',
    displayFont: "'Playfair Display', Georgia, serif",
    bodyFont: "'DM Sans', system-ui, sans-serif",
    previewText: 'Алишер',
  },
  {
    id: 'cormorant-jost',
    displayName: 'Cormorant · Jost',
    displayFont: "'Cormorant Garamond', Georgia, serif",
    bodyFont: "'Jost', system-ui, sans-serif",
    previewText: 'Ансаган',
  },
];

// ─── Block meta (icon, name, description) ────────────────
export interface BlockMeta {
  type: BlockType;
  icon: string;
  name: string;
  desc: string;
}

export const BLOCK_META: BlockMeta[] = [
  { type: 'text',     icon: 'T', name: 'Text',       desc: 'Заголовок, описание, абзац' },
  { type: 'names',    icon: 'A', name: 'Names',      desc: 'Имена молодожёнов / виновника' },
  { type: 'datetime', icon: '⌚', name: 'Дата и время', desc: 'Форматированная дата' },
  { type: 'venue',    icon: '◎', name: 'Место',      desc: 'Название, адрес, карта' },
  { type: 'divider',  icon: '─', name: 'Разделитель', desc: 'Линия или орнамент' },
  { type: 'ornament', icon: '✦', name: 'Орнамент',   desc: 'Декоративный узор' },
  { type: 'image',    icon: '▣', name: 'Фото',        desc: 'Ваша фотография' },
  { type: 'button',   icon: '▭', name: 'Кнопки',     desc: 'Карта, календарь (только ссылка)' },
  { type: 'spacer',   icon: '↕', name: 'Отступ',     desc: 'Пустое пространство' },
  { type: 'qr',       icon: '▦', name: 'QR код',     desc: 'Kaspi или любая ссылка' },
  { type: 'custom',   icon: '◆', name: 'Поле',        desc: 'Dress code, wishes и др.' },
];