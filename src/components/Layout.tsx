import { NavLink, Outlet } from 'react-router-dom';

const navItems = [
  { to: '/',          label: 'Новое',       end: true  },
  { to: '/archive',   label: 'Архив',       end: false },
  { to: '/review',    label: 'К пересмотру', end: false },
  { to: '/patterns',  label: 'Паттерны',    end: false },
];

export default function Layout() {
  return (
    <div className="min-h-full flex flex-col">
      <header className="border-b border-ink-200 dark:border-ink-800">
        <div className="max-w-3xl mx-auto px-6 h-14 flex items-center justify-between">
          <span className="text-sm tracking-[0.22em] uppercase text-ink-500">
            Дневник&nbsp;решений
          </span>
          <nav className="flex gap-6">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                className={({ isActive }) =>
                  [
                    'text-sm transition-colors',
                    isActive
                      ? 'text-ink-900 dark:text-ink-100'
                      : 'text-ink-400 hover:text-ink-700 dark:hover:text-ink-200',
                  ].join(' ')
                }
              >
                {item.label}
              </NavLink>
            ))}
          </nav>
        </div>
      </header>

      <main className="flex-1">
        <Outlet />
      </main>
    </div>
  );
}
