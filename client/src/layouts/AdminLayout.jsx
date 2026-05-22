import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { LayoutDashboard, Users, ShieldCheck, LogOut, Menu, X, ChevronRight, Search } from 'lucide-react';

function cn(...c) { return c.filter(Boolean).join(' '); }

const MENU = [
  { icon: LayoutDashboard, label: 'Dashboard',   path: '/admin/dashboard' },
  { icon: Users,           label: 'Intern List',  path: '/admin/interns' },
  { icon: Search,          label: 'Verification', path: '/admin/verify' },
];

export default function AdminLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [open, setOpen] = useState(false);

  const isActive = (path) => location.pathname === path;

  const handleLogout = () => { logout(); navigate('/login', { replace: true }); };

  const Nav = () => (
    <>
      {/* Logo */}
      <div className="px-5 py-5 border-b border-white/10">
        <Link to="/admin/dashboard" className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-white flex items-center justify-center shadow-lg">
            <ShieldCheck className="w-5 h-5 text-black" />
          </div>
          <div>
            <p className="text-sm font-bold text-white leading-tight">Admin Panel</p>
            <p className="text-[10px] text-gray-500 uppercase tracking-widest">InternVerify</p>
          </div>
        </Link>
      </div>

      {/* Nav items */}
      <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
        <p className="text-[9px] font-bold uppercase tracking-[0.15em] text-gray-500 px-3 py-2">Navigation</p>
        {MENU.map(({ icon: Icon, label, path }) => {
          const active = isActive(path);
          return (
            <Link key={path} to={path} onClick={() => setOpen(false)}
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all group',
                active
                  ? 'bg-white/10 text-white border border-white/20'
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
              )}>
              <Icon className={cn('w-4 h-4 flex-shrink-0', active ? 'text-white' : 'text-gray-500 group-hover:text-white')} />
              <span className="flex-1">{label}</span>
              {active && <ChevronRight className="w-3 h-3 text-white" />}
            </Link>
          );
        })}
      </nav>

      {/* User + Logout */}
      <div className="px-3 py-4 border-t border-white/10 space-y-2">
        <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl bg-white/5 border border-white/10">
          <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center text-black text-xs font-bold flex-shrink-0">
            {(user?.name || user?.email || 'A')[0].toUpperCase()}
          </div>
          <div className="min-w-0">
            <p className="text-xs font-semibold text-white truncate">{user?.name || user?.email}</p>
            <p className="text-[10px] text-gray-500">Administrator</p>
          </div>
        </div>
        <button onClick={handleLogout}
          className="flex items-center gap-3 px-3 py-2 rounded-xl text-sm text-red-400 hover:bg-red-500/10 transition-all w-full">
          <LogOut className="w-4 h-4" /><span>Logout</span>
        </button>
      </div>
    </>
  );

  return (
    <div className="min-h-screen flex bg-black text-white">
      {/* Mobile toggle */}
      <button onClick={() => setOpen(!open)}
        className="md:hidden fixed top-4 left-4 z-50 p-2 rounded-xl border border-white/20 bg-black/80 backdrop-blur">
        {open ? <X className="w-5 h-5 text-white" /> : <Menu className="w-5 h-5 text-white" />}
      </button>

      <AnimatePresence>
        {open && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={() => setOpen(false)} className="md:hidden fixed inset-0 bg-black/70 z-40" />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {open && (
          <motion.aside initial={{ x: -280 }} animate={{ x: 0 }} exit={{ x: -280 }}
            transition={{ type: 'spring', damping: 25 }}
            className="md:hidden fixed left-0 top-0 h-screen w-64 z-50 flex flex-col border-r border-white/10 bg-black">
            <Nav />
          </motion.aside>
        )}
      </AnimatePresence>

      {/* Desktop sidebar */}
      <aside className="w-64 hidden md:flex flex-col h-screen fixed left-0 top-0 border-r border-white/10 bg-black">
        <Nav />
      </aside>

      {/* Main */}
      <div className="flex-1 md:ml-64 flex flex-col min-h-screen">
        <header className="h-14 sticky top-0 z-30 flex items-center justify-between px-6 md:px-8 border-b border-white/10 bg-black/85 backdrop-blur">
          <div className="flex items-center gap-2 md:ml-0 ml-10">
            <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
            <span className="text-xs text-gray-500 font-semibold uppercase tracking-widest">Admin Console</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="hidden sm:block text-xs text-gray-500">{user?.email}</span>
            <div className="w-7 h-7 rounded-lg bg-white flex items-center justify-center text-black text-xs font-bold">
              {(user?.name || user?.email || 'A')[0].toUpperCase()}
            </div>
          </div>
        </header>
        <main className="flex-1 p-6 md:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
