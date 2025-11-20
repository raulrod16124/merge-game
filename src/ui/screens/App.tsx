// src/App.tsx
import {Routes, Route, Navigate} from 'react-router-dom';
import BoardScreen from './board';
import Home from './home';
import Levels from './levels';
import Landing from './landing';
import Login from './login';
import ProtectedRoute from '@/router/ProtectedRoute';
import Profile from './profile';
import Store from './store';
import Settings from './settings';

export default function App() {
  return (
    <div className="min-h-screen bg-slate-900 text-white">
      <main className="max-w-5xl mx-auto p-4">
        <Routes>
          {/* Public */}
          <Route path="/" element={<Landing />} />
          {/* Login */}
          <Route path="/login" element={<Login />} />
          {/* Privates */}
          <Route
            path="/home"
            element={
              <ProtectedRoute>
                <Home />
              </ProtectedRoute>
            }
          />
          <Route
            path="/levels"
            element={
              <ProtectedRoute>
                <Levels />
              </ProtectedRoute>
            }
          />
          <Route
            path="/play/:levelId"
            element={
              <ProtectedRoute>
                <BoardScreen />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />

          <Route
            path="/settings"
            element={
              <ProtectedRoute>
                <Settings />
              </ProtectedRoute>
            }
          />

          <Route
            path="/store"
            element={
              <ProtectedRoute>
                <Store />
              </ProtectedRoute>
            }
          />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </div>
  );
}
