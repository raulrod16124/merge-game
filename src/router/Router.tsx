import AchievementsScreen from '@/ui/screens/achievements/AchievementsScreen';
import BoardScreen from '@/ui/screens/board';
import EditAvatar from '@/ui/screens/edit-avatar';
import EditName from '@/ui/screens/edit-name';
import {Routes, Route, Navigate} from 'react-router-dom';
import ProtectedRoute from './ProtectedRoute';
import PlayerStats from '@/ui/screens/stats/PlayerStats';
import Landing from '@/ui/screens/landing/Landing';
import Login from '@/ui/screens/login/Login';
import Home from '@/ui/screens/home/Home';
import {Levels} from '@/ui/screens/levels/Levels';
import Profile from '@/ui/screens/profile/Profile';
import Settings from '@/ui/screens/settings/Settings';
import Store from '@/ui/screens/store/Store';
import RankingScreen from '@/ui/screens/ranking/RankingScreen';
import FriendsScreen from '@/ui/screens/friends/FriendsScreen';

export default function Router() {
  return (
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
        path="/achievements"
        element={
          <ProtectedRoute>
            <AchievementsScreen />
          </ProtectedRoute>
        }
      />

      <Route
        path="/ranking"
        element={
          <ProtectedRoute>
            <RankingScreen />
          </ProtectedRoute>
        }
      />

      <Route
        path="/stats"
        element={
          <ProtectedRoute>
            <PlayerStats />
          </ProtectedRoute>
        }
      />

      <Route
        path="/stats"
        element={
          <ProtectedRoute>
            <PlayerStats />
          </ProtectedRoute>
        }
      />

      <Route
        path="/friends"
        element={
          <ProtectedRoute>
            <FriendsScreen />
          </ProtectedRoute>
        }
      />

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
