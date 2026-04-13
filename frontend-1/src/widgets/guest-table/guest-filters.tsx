import type { RsvpStatus } from '@entities/guest'
import { Icon } from '@shared/ui/icon'
import { LegacyCard } from '@shared/ui/legacy-ui'
import styles from '@widgets/guest-table/guest-filters.module.css'

type GuestFiltersProps = {
  activeStatus: RsvpStatus | 'all'
  onStatusChange: (status: RsvpStatus | 'all') => void
  search: string
  onSearchChange: (value: string) => void
}

const statusTabs: Array<{ key: RsvpStatus | 'all'; label: string }> = [
  { key: 'all', label: 'Все' },
  { key: 'confirmed', label: 'Подтвердили' },
  { key: 'pending', label: 'Не ответили' },
  { key: 'maybe', label: 'Под вопросом' },
  { key: 'declined', label: 'Отказались' },
]

export function GuestFilters({
  activeStatus,
  onStatusChange,
  search,
  onSearchChange,
}: GuestFiltersProps) {
  return (
    <LegacyCard>
      <div className={styles.bar}>
        <div className={styles.tabs}>
          {statusTabs.map((tab) => (
            <button
              key={tab.key}
              type="button"
              className={`${styles.tab} ${activeStatus === tab.key ? styles.tabActive : ''}`}
              onClick={() => onStatusChange(tab.key)}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className={styles.search}>
          <span className={styles.searchIcon}>
            <Icon name="search" size={15} color="var(--warm-gray)" />
          </span>
          <input
            className={styles.input}
            placeholder="Поиск..."
            value={search}
            onChange={(event) => onSearchChange(event.target.value)}
          />
        </div>
      </div>
    </LegacyCard>
  )
}
