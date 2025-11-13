// src/ui/components/Header.tsx
import {Link, useLocation} from 'react-router-dom';

export function Header() {
  const loc = useLocation();
  return (
    <header className="w-full bg-[#2f3a26] border-b border-slate-800 shadow-sm">
      <div className="max-w-5xl mx-auto flex items-center justify-between p-3">
        <Link to="/" className="text-2xl font-bold">
          Merge Game
        </Link>

        <nav className="flex items-center gap-3">
          <Link
            to="/levels"
            className={`px-3 py-1 rounded ${loc.pathname.startsWith('/levels') ? 'bg-slate-700' : 'hover:bg-slate-800'}`}>
            Niveles
          </Link>
          <Link
            to="/"
            className={`px-3 py-1 rounded ${loc.pathname === '/' ? 'bg-slate-700' : 'hover:bg-slate-800'}`}>
            Home
          </Link>
        </nav>
      </div>
    </header>
  );
}
