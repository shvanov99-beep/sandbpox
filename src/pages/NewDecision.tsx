import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import TagInput from '../components/TagInput';
import ConfidenceScale from '../components/ConfidenceScale';
import { createDecision } from '../db/decisions';

interface FormState {
  action: string;
  context: string;
  alternatives: string;
  main_argument: string;
  expect_3m: string;
  expect_6m: string;
  expect_12m: string;
  confidence: number;
  emotional_state: string;
  tags: string[];
}

const empty: FormState = {
  action: '',
  context: '',
  alternatives: '',
  main_argument: '',
  expect_3m: '',
  expect_6m: '',
  expect_12m: '',
  confidence: 5,
  emotional_state: '',
  tags: [],
};

export default function NewDecision() {
  const [form, setForm] = useState<FormState>(empty);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const navigate = useNavigate();

  const valid =
    form.action.trim().length > 0 &&
    form.context.trim().length > 0 &&
    form.alternatives.trim().length > 0 &&
    form.main_argument.trim().length > 0 &&
    form.expect_3m.trim().length > 0 &&
    form.expect_6m.trim().length > 0 &&
    form.expect_12m.trim().length > 0 &&
    form.emotional_state.trim().length > 0 &&
    form.confidence >= 1 && form.confidence <= 10;

  function patch<K extends keyof FormState>(key: K, v: FormState[K]) {
    setForm((prev) => ({ ...prev, [key]: v }));
    setSaved(false);
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!valid || saving) return;
    setSaving(true);
    try {
      await createDecision(form);
      setSaved(true);
      setForm(empty);
      // Small pause so the user sees confirmation, then jump to archive.
      setTimeout(() => navigate('/archive'), 700);
    } finally {
      setSaving(false);
    }
  }

  return (
    <form
      onSubmit={onSubmit}
      className="max-w-3xl mx-auto px-6 py-12 space-y-10"
      noValidate
    >
      <header className="space-y-2">
        <h1 className="text-2xl font-medium tracking-tight">Новое решение</h1>
        <p className="text-sm text-ink-500">
          Запиши как есть. Через 3, 6 и 12 месяцев дневник спросит, что случилось —
          и покажет, насколько сегодняшний ты был прав.
        </p>
      </header>

      <section>
        <label htmlFor="action" className="field-label">Решение</label>
        <input
          id="action"
          className="field-input"
          placeholder="Одно предложение в форме действия"
          value={form.action}
          onChange={(e) => patch('action', e.target.value)}
          autoFocus
          maxLength={200}
        />
        <p className="field-hint">Пример: «Ухожу с работы в N».</p>
      </section>

      <section>
        <label htmlFor="context" className="field-label">Контекст</label>
        <textarea
          id="context"
          className="field-textarea"
          rows={3}
          placeholder="3–4 предложения о жизненных обстоятельствах прямо сейчас"
          value={form.context}
          onChange={(e) => patch('context', e.target.value)}
        />
      </section>

      <section>
        <label htmlFor="alternatives" className="field-label">Альтернативы</label>
        <textarea
          id="alternatives"
          className="field-textarea"
          rows={3}
          placeholder="Что ещё рассматривал. Обязательно — что отверг и почему."
          value={form.alternatives}
          onChange={(e) => patch('alternatives', e.target.value)}
        />
      </section>

      <section>
        <label htmlFor="arg" className="field-label">Главный аргумент</label>
        <input
          id="arg"
          className="field-input"
          placeholder="Ровно одна причина. Не список."
          value={form.main_argument}
          onChange={(e) => patch('main_argument', e.target.value)}
        />
      </section>

      <section className="space-y-5">
        <span className="field-label">Ожидания</span>
        <div>
          <label htmlFor="e3" className="block text-xs text-ink-500 mb-1">Через 3 месяца</label>
          <input
            id="e3"
            className="field-input"
            placeholder="Что ты рассчитываешь увидеть"
            value={form.expect_3m}
            onChange={(e) => patch('expect_3m', e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="e6" className="block text-xs text-ink-500 mb-1">Через 6 месяцев</label>
          <input
            id="e6"
            className="field-input"
            placeholder=""
            value={form.expect_6m}
            onChange={(e) => patch('expect_6m', e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="e12" className="block text-xs text-ink-500 mb-1">Через 12 месяцев</label>
          <input
            id="e12"
            className="field-input"
            placeholder=""
            value={form.expect_12m}
            onChange={(e) => patch('expect_12m', e.target.value)}
          />
        </div>
      </section>

      <section>
        <span className="field-label">Уверенность</span>
        <ConfidenceScale
          value={form.confidence}
          onChange={(v) => patch('confidence', v)}
        />
      </section>

      <section>
        <label htmlFor="emo" className="field-label">Состояние</label>
        <input
          id="emo"
          className="field-input"
          placeholder="одно слово или короткая фраза"
          value={form.emotional_state}
          onChange={(e) => patch('emotional_state', e.target.value)}
          maxLength={60}
        />
      </section>

      <section>
        <span className="field-label">Теги</span>
        <TagInput value={form.tags} onChange={(t) => patch('tags', t)} />
      </section>

      <footer className="flex items-center gap-4 pt-4 border-t border-ink-200 dark:border-ink-800">
        <button type="submit" className="btn-primary" disabled={!valid || saving}>
          {saving ? 'Сохраняю…' : 'Записать'}
        </button>
        <button
          type="button"
          className="btn-ghost"
          onClick={() => setForm(empty)}
          disabled={saving}
        >
          Очистить
        </button>
        {saved && (
          <span className="text-sm text-ink-500">записано</span>
        )}
      </footer>
    </form>
  );
}
