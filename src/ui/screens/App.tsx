// src/App.tsx
import React from 'react';
import {Routes, Route, Navigate} from 'react-router-dom';
import {useUserStore} from '@/state/user-store';
import BoardScreen from './board';
import Home from './home';
import Levels from './levels';
import Landing from './landing';
import Login from './login';
import ProtectedRoute from '@/router/ProtectedRoute';
import Profile from './profile';
import Store from './store';
import Settings from './settings';
import styled from 'styled-components';
import Inventory from './inventory';
import EditName from './edit-name';
import EditAvatar from './edit-avatar';
import AchievementsScreen from './achievements/AchievementsScreen';

const AppWrapper = styled.div`
  min-height: 100dvh;
  height: 100dvh;
  overflow-y: hidden;
  overflow-x: hidden;
`;

export default function App() {
  const loadFromStorage = useUserStore(s => s.loadFromStorage);

  React.useEffect(() => {
    loadFromStorage();
  }, []);

  return (
    <AppWrapper>
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

        <Route
          path="/edit-name"
          element={
            <ProtectedRoute>
              <EditName />
            </ProtectedRoute>
          }
        />

        <Route
          path="/edit-avatar"
          element={
            <ProtectedRoute>
              <EditAvatar />
            </ProtectedRoute>
          }
        />

        <Route
          path="/inventory"
          element={
            <ProtectedRoute>
              <Inventory />
            </ProtectedRoute>
          }
        />

        <Route
          path="/achievements"
          element={
            <ProtectedRoute>
              <AchievementsScreen />
            </ProtectedRoute>
          }
        />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AppWrapper>
  );
}
