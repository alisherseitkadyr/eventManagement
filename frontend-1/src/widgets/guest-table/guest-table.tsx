import { guestSideLabels, rsvpStatusLabels, type Guest } from '@entities/guest'
import { legacyStatusStyles } from '@shared/lib/legacy-theme'
import { Icon } from '@shared/ui/icon'
import { LegacyAvatar, LegacyBadge, LegacyCard } from '@shared/ui/legacy-ui'
import styles from '@widgets/guest-table/guest-table.module.css'

type GuestTableProps = {
  guests: Guest[]
  onCopyLink?: (guest: Guest) => void
  onRemind?: (guest: Guest) => void
  copiedId?: string | null
}

export function GuestTable({ guests, onCopyLink, onRemind, copiedId }: GuestTableProps) {
  return (
    <LegacyCard noPadding>
      <div className={styles.tableWrap}>
        <table className={styles.table}>
          <thead>
            <tr className={styles.headRow}>
              <th className={styles.th}>Имя / Семья</th>
              <th className={styles.th}>Чел.</th>
              <th className={styles.th}>Сторона</th>
              <th className={styles.th}>Статус</th>
              <th className={styles.th}>Телефон</th>
              <th className={`${styles.th} ${styles.thRight}`}>Действия</th>
            </tr>
          </thead>
          <tbody>
            {guests.map((guest) => (
              <tr key={guest.id} className={styles.row}>
                <td className={styles.td}>
                  <div className={styles.nameCell}>
                    <LegacyAvatar name={guest.name} size={32} />
                    <div>
                      <span className={styles.guestName}>{guest.name}</span>
                      {guest.isVip ? <span className={styles.vipBadge}>VIP</span> : null}
                      {guest.isElder ? <span className={styles.elderBadge}>Ақсақал</span> : null}
                    </div>
                  </div>
                </td>
                <td className={styles.td}>{guest.count}</td>
                <td className={styles.td}>{guestSideLabels[guest.side].ru}</td>
                <td className={styles.td}>
                  <LegacyBadge
                    bg={legacyStatusStyles[guest.status].bg}
                    color={legacyStatusStyles[guest.status].color}
                  >
                    {rsvpStatusLabels[guest.status].ru}
                  </LegacyBadge>
                </td>
                <td className={`${styles.td} ${styles.phone}`}>{guest.phone || '—'}</td>
                <td className={`${styles.td} ${styles.tdRight}`}>
                  <div className={styles.actions}>
                    <button
                      className={`${styles.actionBtn} ${copiedId === guest.id ? styles.actionBtnSuccess : ''}`}
                      title="Копировать ссылку"
                      type="button"
                      onClick={() => onCopyLink?.(guest)}
                    >
                      <Icon
                        name={copiedId === guest.id ? 'check' : 'link'}
                        size={14}
                        color={copiedId === guest.id ? 'var(--success)' : 'var(--gold)'}
                      />
                    </button>
                    {guest.status === 'pending' ? (
                      <button
                        className={styles.actionBtn}
                        title="Напомнить"
                        type="button"
                        onClick={() => onRemind?.(guest)}
                      >
                        <Icon name="bell" size={14} color="var(--gold)" />
                      </button>
                    ) : null}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </LegacyCard>
  )
}
