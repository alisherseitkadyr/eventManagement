import { BLOCK_META, PALETTES } from '@entities/invitation';
import type { Block, ColorKey } from '@entities/invitation';
import { useEditorStore } from '../model/editor-store';
import css from './block-properties-panel.module.css';

// ─── Reusable primitives ──────────────────────────────────

interface FieldProps { label: string; valueDisplay?: string; children: React.ReactNode; }
function Field({ label, valueDisplay, children }: FieldProps) {
  return (
    <div className={css.field}>
      <div className={css.fieldLabel}>
        {label}
        {valueDisplay && <span className={css.fieldValue}>{valueDisplay}</span>}
      </div>
      {children}
    </div>
  );
}

interface SegProps<T extends string> {
  cols: 2 | 3 | 4;
  options: { value: T; label: string }[];
  value: T;
  onChange: (v: T) => void;
}
function Seg<T extends string>({ cols, options, value, onChange }: SegProps<T>) {
  const colClass = cols === 4 ? css.seg4 : cols === 3 ? css.seg3 : css.seg2;
  return (
    <div className={`${css.seg} ${colClass}`}>
      {options.map((o) => (
        <button
          key={o.value}
          className={`${css.segBtn} ${value === o.value ? css.segBtnActive : ''}`}
          onClick={() => onChange(o.value)}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}

interface ToggleRowProps { label: string; value: boolean; onChange: (v: boolean) => void; }
function ToggleRow({ label, value, onChange }: ToggleRowProps) {
  return (
    <div className={css.toggleRow}>
      <span className={css.toggleLabel}>{label}</span>
      <button
        className={`${css.toggle} ${value ? css.toggleOn : ''}`}
        onClick={() => onChange(!value)}
      />
    </div>
  );
}

interface SliderFieldProps {
  label: string;
  min: number; max: number; value: number;
  formatDisplay?: (v: number) => string;
  onChange: (v: number) => void;
}
function SliderField({ label, min, max, value, formatDisplay, onChange }: SliderFieldProps) {
  const display = formatDisplay ? formatDisplay(value) : `${value}px`;
  return (
    <Field label={label} valueDisplay={display}>
      <input
        type="range"
        className={css.slider}
        min={min} max={max} step={1}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
      />
    </Field>
  );
}

// ─── Color picker (accent / text / muted) ────────────────
interface ColorPickerProps { value: ColorKey; onChange: (k: ColorKey) => void; palette: string; }
function ColorPicker({ value, onChange, palette }: ColorPickerProps) {
  const p = PALETTES[palette];
  const opts: { key: ColorKey; color: string }[] = [
    { key: 'accent', color: p.accent },
    { key: 'text', color: p.text },
    { key: 'muted', color: p.muted },
  ];
  return (
    <Field label="Цвет">
      <div className={css.colorGrid}>
        {opts.map(({ key, color }) => (
          <div
            key={key}
            className={`${css.colorPick} ${value === key ? css.colorPickSelected : ''}`}
            style={{ background: color }}
            title={key}
            onClick={() => onChange(key)}
          />
        ))}
      </div>
    </Field>
  );
}

// ─── Per-type property editors ────────────────────────────

function TextProps({ block, update, palette }: BlockEditorProps<'text'>) {
  const p = block.props;
  return (
    <>
      <Field label="Содержимое">
        <textarea
          className={css.textarea}
          value={p.content}
          onChange={(e) => update({ content: e.target.value })}
        />
      </Field>
      <SliderField label="Размер шрифта" min={8} max={48} value={p.fontSize}
        onChange={(v) => update({ fontSize: v })} />
      <SliderField label="Межбуквенный" min={0} max={20} value={p.letterSpacing}
        formatDisplay={(v) => `${v}`}
        onChange={(v) => update({ letterSpacing: v })} />
      <SliderField label="Межстрочный" min={10} max={30} value={Math.round(p.lineHeight * 10)}
        formatDisplay={(v) => `${(v / 10).toFixed(1)}`}
        onChange={(v) => update({ lineHeight: v / 10 })} />
      <SliderField label="Прозрачность" min={10} max={100} value={Math.round(p.opacity * 100)}
        formatDisplay={(v) => `${v}%`}
        onChange={(v) => update({ opacity: v / 100 })} />
      <Field label="Начертание">
        <Seg cols={3}
          options={[{ value: 'left', label: '←' }, { value: 'center', label: '↔' }, { value: 'right', label: '→' }]}
          value={p.align}
          onChange={(v) => update({ align: v })}
        />
      </Field>
      <Field label="Гарнитура">
        <Seg cols={2}
          options={[{ value: 'serif', label: 'Serif' }, { value: 'sans', label: 'Sans' }]}
          value={p.family}
          onChange={(v) => update({ family: v })}
        />
      </Field>
      <Field label="Стиль">
        <Seg cols={2}
          options={[{ value: 'normal', label: 'Обычный' }, { value: 'italic', label: 'Курсив' }]}
          value={p.style}
          onChange={(v) => update({ style: v })}
        />
      </Field>
      <ColorPicker value={p.color} onChange={(v) => update({ color: v })} palette={palette} />
    </>
  );
}

function NamesPropsEditor({ block, update, palette }: BlockEditorProps<'names'>) {
  const p = block.props;
  return (
    <>
      <Field label="Имена">
        <input className={css.input} value={p.content} onChange={(e) => update({ content: e.target.value })} />
      </Field>
      <SliderField label="Размер шрифта" min={16} max={60} value={p.fontSize}
        onChange={(v) => update({ fontSize: v })} />
      <Field label="Гарнитура">
        <Seg cols={2}
          options={[{ value: 'serif', label: 'Serif' }, { value: 'sans', label: 'Sans' }]}
          value={p.family}
          onChange={(v) => update({ family: v })}
        />
      </Field>
      <ColorPicker value={p.color} onChange={(v) => update({ color: v })} palette={palette} />
    </>
  );
}

function DatetimePropsEditor({ block, update }: BlockEditorProps<'datetime'>) {
  const p = block.props;
  return (
    <>
      <Field label="Текст даты">
        <input className={css.input} value={p.dateText} onChange={(e) => update({ dateText: e.target.value })} />
      </Field>
      <Field label="Время">
        <input className={css.input} value={p.timeText} onChange={(e) => update({ timeText: e.target.value })} />
      </Field>
      <ToggleRow label="Рамка сверху/снизу" value={p.showBorder} onChange={(v) => update({ showBorder: v })} />
      <ToggleRow label="Фоновая плашка" value={p.showBackground} onChange={(v) => update({ showBackground: v })} />
    </>
  );
}

function VenuePropsEditor({ block, update }: BlockEditorProps<'venue'>) {
  const p = block.props;
  return (
    <>
      <Field label="Название места">
        <input className={css.input} value={p.venueName} onChange={(e) => update({ venueName: e.target.value })} />
      </Field>
      <Field label="Адрес">
        <input className={css.input} value={p.address} onChange={(e) => update({ address: e.target.value })} />
      </Field>
      <Field label="2GIS / Maps link">
        <input className={css.input} value={p.mapUrl} placeholder="https://2gis.kz/..."
          onChange={(e) => update({ mapUrl: e.target.value })} />
      </Field>
      <ToggleRow label="Показать иконку" value={p.showIcon} onChange={(v) => update({ showIcon: v })} />
    </>
  );
}

function DividerPropsEditor({ block, update }: BlockEditorProps<'divider'>) {
  const p = block.props;
  return (
    <>
      <Field label="Стиль">
        <Seg cols={3}
          options={[{ value: 'line', label: '─' }, { value: 'ornament', label: '✦' }, { value: 'dots', label: '•••' }]}
          value={p.style}
          onChange={(v) => update({ style: v })}
        />
      </Field>
      <SliderField label="Ширина" min={20} max={200} value={p.width}
        onChange={(v) => update({ width: v })} />
      <SliderField label="Прозрачность" min={10} max={100} value={Math.round(p.opacity * 100)}
        formatDisplay={(v) => `${v}%`}
        onChange={(v) => update({ opacity: v / 100 })} />
    </>
  );
}

function OrnamentPropsEditor({ block, update }: BlockEditorProps<'ornament'>) {
  const p = block.props;
  return (
    <>
      <Field label="Узор">
        <Seg cols={4}
          options={[
            { value: 'wave', label: '∿' },
            { value: 'diamond', label: '◇' },
            { value: 'laurel', label: '✦' },
            { value: 'simple', label: '─' },
          ]}
          value={p.patternId}
          onChange={(v) => update({ patternId: v })}
        />
      </Field>
      <SliderField label="Ширина" min={40} max={200} value={p.width}
        onChange={(v) => update({ width: v })} />
      <SliderField label="Прозрачность" min={5} max={100} value={Math.round(p.opacity * 100)}
        formatDisplay={(v) => `${v}%`}
        onChange={(v) => update({ opacity: v / 100 })} />
    </>
  );
}

function ImagePropsEditor({ block, update }: BlockEditorProps<'image'>) {
  const p = block.props;
  return (
    <>
      <Field label="URL изображения">
        <input
          className={css.input}
          value={p.url ?? ''}
          placeholder="https://images.unsplash.com/..."
          onChange={(e) => update({ url: e.target.value || undefined })}
        />
      </Field>
      <SliderField label="Размер" min={60} max={280} value={p.width}
        onChange={(v) => update({ width: v, height: v })} />
      <SliderField label="Скругление" min={0} max={50} value={p.borderRadius}
        formatDisplay={(v) => `${v}%`}
        onChange={(v) => update({ borderRadius: v })} />
    </>
  );
}

function ButtonPropsEditor({ block, update }: BlockEditorProps<'button'>) {
  const p = block.props;
  return (
    <>
      {p.buttons.map((btn, i) => (
        <div key={btn.id} style={{ marginBottom: 14 }}>
          <Field label={`Кнопка ${i + 1} — текст`}>
            <input
              className={css.input}
              value={btn.label}
              onChange={(e) => {
                const buttons = [...p.buttons];
                buttons[i] = { ...buttons[i], label: e.target.value };
                update({ buttons });
              }}
            />
          </Field>
          <Field label="Иконка">
            <input
              className={css.input}
              value={btn.icon}
              onChange={(e) => {
                const buttons = [...p.buttons];
                buttons[i] = { ...buttons[i], icon: e.target.value };
                update({ buttons });
              }}
            />
          </Field>
          <Field label="Ссылка">
            <input
              className={css.input}
              value={btn.url ?? ''}
              placeholder="https://..."
              onChange={(e) => {
                const buttons = [...p.buttons];
                buttons[i] = { ...buttons[i], url: e.target.value };
                update({ buttons });
              }}
            />
          </Field>
          {p.buttons.length > 1 ? (
            <button
              type="button"
              className={css.inlineButton}
              onClick={() => {
                const buttons = p.buttons.filter((_, index) => index !== i);
                update({ buttons });
              }}
            >
              Удалить кнопку
            </button>
          ) : null}
        </div>
      ))}
      <button
        type="button"
        className={css.inlineButton}
        onClick={() =>
          update({
            buttons: [
              ...p.buttons,
              {
                id: crypto.randomUUID().slice(0, 8),
                label: 'Новая кнопка',
                icon: '→',
                url: '',
              },
            ],
          })
        }
      >
        Добавить кнопку
      </button>
    </>
  );
}

function SpacerPropsEditor({ block, update }: BlockEditorProps<'spacer'>) {
  return (
    <SliderField label="Высота" min={4} max={80} value={block.props.height}
      onChange={(v) => update({ height: v })} />
  );
}

function QrPropsEditor({ block, update }: BlockEditorProps<'qr'>) {
  const p = block.props;
  return (
    <>
      <Field label="Ссылка">
        <input className={css.input} value={p.url} placeholder="https://pay.kaspi.kz/..."
          onChange={(e) => update({ url: e.target.value })} />
      </Field>
      <Field label="Подпись">
        <input className={css.input} value={p.label}
          onChange={(e) => update({ label: e.target.value })} />
      </Field>
    </>
  );
}

function CustomPropsEditor({ block, update }: BlockEditorProps<'custom'>) {
  const p = block.props;
  return (
    <>
      <Field label="Метка">
        <input className={css.input} value={p.label}
          onChange={(e) => update({ label: e.target.value })} />
      </Field>
      <Field label="Значение">
        <input className={css.input} value={p.value}
          onChange={(e) => update({ value: e.target.value })} />
      </Field>
    </>
  );
}

// ─── Typed helper for block editor props ──────────────────
type BlockEditorProps<T extends Block['type']> = {
  block: Extract<Block, { type: T }>;
  update: (patch: Partial<Extract<Block, { type: T }>['props']>) => void;
  palette: string;
};

// ─── BlockPropertiesPanel ─────────────────────────────────
type BlockPropertiesPanelProps = {
  embedded?: boolean;
};

export function BlockPropertiesPanel({ embedded = false }: BlockPropertiesPanelProps) {
  const blocks = useEditorStore((s) => s.blocks);
  const selectedId = useEditorStore((s) => s.selectedId);
  const palette = useEditorStore((s) => s.palette);
  const updateBlockProps = useEditorStore((s) => s.updateBlockProps);

  const block = blocks.find((b) => b.id === selectedId);
  if (!block) {
    return (
      <div className={`${css.panel} ${embedded ? css.panelEmbedded : ''}`}>
        <div className={css.emptyState}>
          <div className={css.emptyTitle}>Свойства блока</div>
          <p className={css.emptyText}>
            Выберите любой блок в списке или в превью, чтобы поменять текст, размеры,
            цвета и другие настройки.
          </p>
        </div>
      </div>
    );
  }

  const selectedBlock = block;
  const meta = BLOCK_META.find((m) => m.type === selectedBlock.type);
  const update = (patch: Partial<typeof selectedBlock.props>) =>
    updateBlockProps(selectedBlock.id, patch);

  function renderFields() {
    switch (selectedBlock.type) {
      case 'text':
        return <TextProps block={selectedBlock} update={update} palette={palette} />;
      case 'names':
        return <NamesPropsEditor block={selectedBlock} update={update} palette={palette} />;
      case 'datetime':
        return <DatetimePropsEditor block={selectedBlock} update={update} palette={palette} />;
      case 'venue':
        return <VenuePropsEditor block={selectedBlock} update={update} palette={palette} />;
      case 'divider':
        return <DividerPropsEditor block={selectedBlock} update={update} palette={palette} />;
      case 'ornament':
        return <OrnamentPropsEditor block={selectedBlock} update={update} palette={palette} />;
      case 'image':
        return <ImagePropsEditor block={selectedBlock} update={update} palette={palette} />;
      case 'button':
        return <ButtonPropsEditor block={selectedBlock} update={update} palette={palette} />;
      case 'spacer':
        return <SpacerPropsEditor block={selectedBlock} update={update} palette={palette} />;
      case 'qr':
        return <QrPropsEditor block={selectedBlock} update={update} palette={palette} />;
      case 'custom':
        return <CustomPropsEditor block={selectedBlock} update={update} palette={palette} />;
    }
  }

  return (
    <div className={`${css.panel} ${embedded ? css.panelEmbedded : ''}`}>
      <div className={css.header}>
        <div className={css.headerIcon}>{meta?.icon}</div>
        <div className={css.headerTitle}>{meta?.name}</div>
        <div className={css.headerType}>{selectedBlock.type}</div>
      </div>
      {renderFields()}
    </div>
  );
}
