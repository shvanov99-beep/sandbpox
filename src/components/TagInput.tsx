import { useState, useRef, type KeyboardEvent } from 'react';

interface Props {
  value: string[];
  onChange: (next: string[]) => void;
}

/**
 * Free-form tag input. User types → Enter/comma commits a tag.
 * No preset suggestions, no autocomplete on purpose —
 * tag taxonomy is supposed to emerge from the user, not from us.
 */
export default function TagInput({ value, onChange }: Props) {
  const [draft, setDraft] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  function commit(raw: string) {
    const t = raw.trim().replace(/,+$/, '');
    if (!t) return;
    if (value.some((v) => v.toLowerCase() === t.toLowerCase())) {
      setDraft('');
      return;
    }
    onChange([...value, t]);
    setDraft('');
  }

  function remove(tag: string) {
    onChange(value.filter((t) => t !== tag));
  }

  function handleKey(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      commit(draft);
    } else if (e.key === 'Backspace' && draft === '' && value.length > 0) {
      onChange(value.slice(0, -1));
    }
  }

  return (
    <div
      className="flex flex-wrap gap-2 border-b border-ink-200 dark:border-ink-800
                 focus-within:border-ink-900 dark:focus-within:border-ink-100
                 transition-colors py-2"
      onClick={() => inputRef.current?.focus()}
    >
      {value.map((tag) => (
        <span
          key={tag}
          className="inline-flex items-center gap-1.5 text-sm
                     border border-ink-300 dark:border-ink-700 rounded-full
                     px-3 py-0.5"
        >
          {tag}
          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); remove(tag); }}
            className="text-ink-400 hover:text-ink-900 dark:hover:text-ink-100"
            aria-label={`Удалить тег ${tag}`}
          >
            ×
          </button>
        </span>
      ))}
      <input
        ref={inputRef}
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
        onKeyDown={handleKey}
        onBlur={() => commit(draft)}
        placeholder={value.length === 0 ? 'свои теги, enter для добавления' : ''}
        className="flex-1 min-w-[8rem] bg-transparent border-0 outline-none
                   text-base placeholder:text-ink-300 dark:placeholder:text-ink-600"
      />
    </div>
  );
}
