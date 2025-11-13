// src/ui/screens/Home.tsx
import {Link} from 'react-router-dom';

export function Home() {
  return (
    <div className="flex flex-col items-center gap-6 mt-8">
      <h1 className="text-4xl font-extrabold">Merge Game 🧩</h1>
      <p className="text-slate-300 max-w-2xl text-center">
        Bienvenido — coloca piezas, combina 3 iguales para crear lo siguiente y
        evita a los osos. Selecciona un nivel y comienza a jugar.
      </p>

      <div className="flex gap-4">
        <Link
          to="/levels"
          className="px-6 py-3 bg-emerald-600 hover:bg-emerald-500 rounded-lg font-semibold">
          Seleccionar nivel
        </Link>
      </div>
    </div>
  );
}
