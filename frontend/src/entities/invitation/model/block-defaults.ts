import type {
  Block,
  BlockType,
  BlockPropsMap,
  TextProps,
  NamesProps,
  DatetimeProps,
  VenueProps,
  DividerProps,
  OrnamentProps,
  ImageProps,
  ButtonProps,
  SpacerProps,
  QrProps,
  CustomProps,
} from './block-types';

function createBlockId() {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID().slice(0, 8);
  }

  return Math.random().toString(36).slice(2, 10);
}

// ─── Default props per block type ────────────────────────
const DEFAULT_PROPS: BlockPropsMap = {
  text: {
    content: 'Введите текст',
    fontSize: 12,
    letterSpacing: 0,
    family: 'sans',
    color: 'text',
    align: 'center',
    opacity: 1,
    weight: 400,
    lineHeight: 1.6,
    style: 'normal',
  } satisfies TextProps,

  names: {
    content: 'Имя & Имя',
    fontSize: 30,
    family: 'serif',
    color: 'accent',
  } satisfies NamesProps,

  datetime: {
    dateText: '1 января, 2026',
    timeText: '17:00',
    showBorder: true,
    showBackground: false,
  } satisfies DatetimeProps,

  venue: {
    venueName: 'Название места',
    address: 'Адрес',
    mapUrl: '',
    showIcon: true,
  } satisfies VenueProps,

  divider: {
    style: 'line',
    width: 40,
    opacity: 0.35,
  } satisfies DividerProps,

  ornament: {
    patternId: 'wave',
    opacity: 0.25,
    width: 80,
  } satisfies OrnamentProps,

  image: {
    url: undefined,
    width: 140,
    height: 140,
    borderRadius: 50,
  } satisfies ImageProps,

  button: {
    buttons: [{ id: 'btn-1', label: 'Открыть карту', icon: '🗺️', url: '' }],
  } satisfies ButtonProps,

  spacer: {
    height: 16,
  } satisfies SpacerProps,

  qr: {
    url: '',
    label: 'Kaspi QR',
  } satisfies QrProps,

  custom: {
    label: 'Dress code',
    value: 'Smart casual',
  } satisfies CustomProps,
};

const LINK_ONLY_TYPES = new Set<BlockType>(['button'])

/** Creates a new block of the given type with default props */
export function createBlock<T extends BlockType>(type: T): Block {
  return {
    id: createBlockId(),
    type,
    props: structuredClone(DEFAULT_PROPS[type]),
    ...(LINK_ONLY_TYPES.has(type) ? { linkOnly: true } : {}),
  } as Block;
}

/** Returns the seed invitation used for new projects */
export function getDefaultInvitation(): Block[] {
  return [
    {
      id: 'b1',
      type: 'ornament',
      props: { patternId: 'wave', opacity: 0.25, width: 80 },
    },
    {
      id: 'b2',
      type: 'text',
      props: {
        content: 'ҮЙЛЕНУ ТОЙЫНА ШАҚЫРУ',
        fontSize: 10,
        letterSpacing: 4,
        family: 'sans',
        color: 'muted',
        align: 'center',
        opacity: 1,
        weight: 500,
        lineHeight: 1.6,
        style: 'normal',
      },
    },
    {
      id: 'b3',
      type: 'names',
      props: { content: 'Алишер & Айгерім', fontSize: 34, family: 'serif', color: 'accent' },
    },
    {
      id: 'b4',
      type: 'divider',
      props: { style: 'line', width: 40, opacity: 0.35 },
    },
    {
      id: 'b5',
      type: 'text',
      props: {
        content:
          'Құрметті ағайын-туыс,\nдос-жарандар!\n\nСіздерді балаларымыздың\nүйлену тойына шақырамыз.',
        fontSize: 12,
        letterSpacing: 0,
        family: 'serif',
        color: 'text',
        align: 'center',
        opacity: 0.85,
        weight: 400,
        lineHeight: 1.9,
        style: 'normal',
      },
    },
    {
      id: 'b6',
      type: 'datetime',
      props: { dateText: '15 маусым, 2026', timeText: '17:00', showBorder: true, showBackground: false },
    },
    {
      id: 'b7',
      type: 'venue',
      props: {
        venueName: 'Rixos President Astana',
        address: 'Қабанбай батыр даңғылы, 7',
        mapUrl: 'https://2gis.kz/astana',
        showIcon: true,
      },
    },
    {
      id: 'b8',
      type: 'button',
      linkOnly: true,
      props: {
        buttons: [
          { id: 'btn-b8-1', label: 'Күнтізбеге қосу', icon: '📅' },
          { id: 'btn-b8-2', label: '2GIS картасы', icon: '🗺️' },
        ],
      },
    },
    {
      id: 'b9',
      type: 'text',
      props: {
        content: 'Құрметпен күтеміз',
        fontSize: 11,
        letterSpacing: 0,
        family: 'serif',
        color: 'muted',
        align: 'center',
        opacity: 1,
        weight: 400,
        lineHeight: 1.6,
        style: 'italic',
      },
    },
    {
      id: 'b10',
      type: 'ornament',
      props: { patternId: 'wave', opacity: 0.16, width: 80 },
    },
  ] satisfies Block[];
}
