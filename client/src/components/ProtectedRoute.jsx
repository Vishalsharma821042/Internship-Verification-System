import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

// ─── Synchronous localStorage read ───────────────────────────────────────────
const getStoredUser = () => {
  try {
    const raw = localStorage.getItem('userInfo');
    if (raw) return JSON.parse(raw);
  } catch { /* ignore */ }
  return null;
};

/**
 * ProtectedRoute
 *   requiredRole = 'admin' | 'hr' | undefined (any authenticated user)
 *   If role doesn't match → redirected to their correct home
 */
export const ProtectedRoute = ({ children, requiredRole }) => {
  const { user } = useAuth();

  // Synchronous fallback: state may not be hydrated yet on first render
  const effectiveUser = user || getStoredUser();

  // Not authenticated at all
  if (!effectiveUser) {
    console.log('[ProtectedRoute] No user → /login');
    return <Navigate to="/login" replace />;
  }

  // Role check
  if (requiredRole && effectiveUser.role !== requiredRole) {
    const home = effectiveUser.role === 'admin' ? '/admin/dashboard' : '/hr/dashboard';
    console.log(`[ProtectedRoute] Role mismatch (need ${requiredRole}, have ${effectiveUser.role}) → ${home}`);
    return <Navigate to={home} replace />;
  }

  return children;
};
