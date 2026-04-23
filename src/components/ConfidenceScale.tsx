interface Props {
  value: number;
  onChange: (v: number) => void;
}

/**
 * 1..10 scale rendered as 10 tappable cells.
 * Honest, no decimals, no slider tooltip — user commits to an integer.
 */
export default function ConfidenceScale({ value, onChange }: Props) {
  return (
    <div>
      <div className="flex gap-1" role="radiogroup" aria-label="Уверенность">
        {Array.from({ length: 10 }, (_, i) => i + 1).map((n) => {
          const active = n <= value;
          return (
            <button
              key={n}
              type="button"
              role="radio"
              aria-checked={value === n}
              onClick={() => onChange(n)}
              className={[
                'flex-1 h-10 text-sm border transition-colors',
                active
                  ? 'bg-ink-900 text-white border-ink-900 dark:bg-ink-100 dark:text-ink-900 dark:border-ink-100'
                  : 'bg-transparent text-ink-400 border-ink-200 dark:border-ink-800 hover:border-ink-500',
              ].join(' ')}
            >
              {n}
            </button>
          );
        })}
      </div>
      <div className="flex justify-between text-xs text-ink-400 mt-1.5">
        <span>сомневаюсь</span>
        <span>уверен полностью</span>
      </div>
    </div>
  );
}
