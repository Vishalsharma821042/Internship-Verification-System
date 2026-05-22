import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import { ProtectedRoute } from './components/ProtectedRoute';

// Layouts
import AdminLayout from './layouts/AdminLayout';
import HRLayout from './layouts/HRLayout';

// Public pages
import LandingPage from './pages/LandingPage';
import VerificationPage from './pages/Verification';
import Login from './pages/Login';
import NotFound from './pages/NotFound';

// Admin pages
import AdminDashboard from './pages/AdminDashboard';
import InternsList from './pages/InternsList';

// HR pages
import HRDashboard from './pages/HRDashboard';
import GenerateCode from './pages/GenerateCode';
import VerifyInternship from './pages/VerifyInternship';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Router>
          <Toaster
            position="top-right"
            toastOptions={{
              style: { background: '#121212', color: '#fff', border: '1px solid rgba(255,255,255,0.1)' }
            }}
          />
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<LandingPage />} />
            <Route path="/verification" element={<VerificationPage />} />
            <Route path="/login" element={<Login />} />

            {/* Admin Routes */}
            <Route
              path="/admin"
              element={
                <ProtectedRoute requiredRole="admin">
                  <AdminLayout />
                </ProtectedRoute>
              }
            >
              <Route index element={<Navigate to="dashboard" replace />} />
              <Route path="dashboard" element={<AdminDashboard />} />
              <Route path="interns"   element={<InternsList />} />
              <Route path="verify"    element={<VerifyInternship />} />
            </Route>

            {/* HR Routes */}
            <Route
              path="/hr"
              element={
                <ProtectedRoute requiredRole="hr">
                  <HRLayout />
                </ProtectedRoute>
              }
            >
              <Route index element={<Navigate to="dashboard" replace />} />
              <Route path="dashboard" element={<HRDashboard />} />
              <Route path="generate"  element={<GenerateCode />} />
              <Route path="verify"    element={<VerifyInternship />} />
            </Route>

            <Route path="*" element={<NotFound />} />
          </Routes>
        </Router>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
