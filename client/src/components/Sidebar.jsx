import { Link, useLocation, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Users, ShieldCheck, LogOut, Settings, Menu, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

function cn(...classes) {
  return classes.filter(Boolean).join(' ');
}

const Sidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);

  const menuItems = [
    { icon: LayoutDashboard, label: 'Overview', path: '/dashboard' },
    { icon: Users, label: 'Interns List', path: '/dashboard/interns' },
    { icon: Settings, label: 'Settings', path: '/dashboard/settings' },
  ];

  const isActive = (path) => {
    if (path === '/dashboard') {
      return location.pathname === '/dashboard' || location.pathname === '/dashboard/';
    }
    return location.pathname.startsWith(path);
  };

  const handleLogout = () => {
    logout();
    navigate('/login', { replace: true });
  };

  const sidebarContent = (
    <>
      <div className="p-6">
        <Link to="/dashboard" className="flex items-center space-x-2 text-xl font-bold tracking-tighter mb-8">
          <div className="bg-white text-black p-1.5 rounded-lg">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-white via-gray-300 to-gray-500">
            Admin Panel
          </span>
        </Link>
        
        <nav className="space-y-2">
          <p className="text-xs text-gray-500 font-semibold uppercase tracking-wider mb-4 px-3">Menu</p>
          {menuItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.path);
            
            return (
              <Link
                key={item.label}
                to={item.path}
                onClick={() => setMobileOpen(false)}
                className={cn(
                  "flex items-center space-x-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200",
                  active
                    ? "bg-white/10 text-white border border-white/10"
                    : "text-gray-400 hover:text-white hover:bg-white/5"
                )}
              >
                <Icon className={cn("w-4 h-4", active && "text-white")} />
                <span>{item.label}</span>
                {active && (
                  <div className="ml-auto w-1.5 h-1.5 rounded-full bg-white" />
                )}
              </Link>
            );
          })}
        </nav>
      </div>
      
      {/* User info + Logout */}
      <div className="mt-auto p-6 space-y-4">
        {user && (
          <div className="px-3 py-3 rounded-lg bg-white/5 border border-white/10">
            <p className="text-sm font-medium text-white truncate">{user.name || user.email}</p>
            <p className="text-xs text-gray-500 mt-0.5">{user.role?.toUpperCase()}</p>
          </div>
        )}
        <button
          onClick={handleLogout}
          className="flex items-center space-x-3 px-3 py-2.5 rounded-lg text-sm font-medium text-red-400 hover:bg-red-500/10 transition-all w-full"
        >
          <LogOut className="w-4 h-4" />
          <span>Logout</span>
        </button>
      </div>
    </>
  );

  return (
    <>
      {/* Mobile menu button */}
      <button
        onClick={() => setMobileOpen(!mobileOpen)}
        className="md:hidden fixed top-4 left-4 z-50 p-2 rounded-lg bg-white/10 backdrop-blur-xl border border-white/10"
      >
        {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
      </button>

      {/* Mobile overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setMobileOpen(false)}
            className="md:hidden fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
          />
        )}
      </AnimatePresence>

      {/* Mobile sidebar */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.aside
            initial={{ x: -280 }}
            animate={{ x: 0 }}
            exit={{ x: -280 }}
            transition={{ type: 'spring', damping: 25 }}
            className="md:hidden fixed left-0 top-0 w-64 h-screen z-50 bg-[#0a0a0a] border-r border-white/10 flex flex-col"
          >
            {sidebarContent}
          </motion.aside>
        )}
      </AnimatePresence>

      {/* Desktop sidebar */}
      <aside className="w-64 bg-[#0a0a0a]/80 backdrop-blur-xl border-r border-white/10 hidden md:flex flex-col h-screen fixed left-0 top-0">
        {sidebarContent}
      </aside>
    </>
  );
};

export default Sidebar;
