import { Link } from 'react-router-dom';
import { ShieldCheck, LogIn, Search } from 'lucide-react';
import { motion } from 'framer-motion';

const Navbar = () => {
  return (
    <motion.nav 
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="glass sticky top-0 z-50 px-6 py-4"
    >
      <div className="container mx-auto flex items-center justify-between">
        <Link to="/" className="flex items-center space-x-2 text-xl font-bold tracking-tighter">
          <div className="bg-white text-black p-1.5 rounded-lg">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <span className="text-gradient">InternVerify</span>
        </Link>
        
        <div className="flex items-center space-x-4">
          <Link
            to="/verification"
            className="flex items-center space-x-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 text-gray-400 hover:text-white hover:bg-white/5"
          >
            <Search className="w-4 h-4" />
            <span>Verify Code</span>
          </Link>
          
          <Link
            to="/login"
            className="flex items-center space-x-2 bg-white text-black px-5 py-2 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors"
          >
            <LogIn className="w-4 h-4" />
            <span>System Login</span>
          </Link>
        </div>
      </div>
    </motion.nav>
  );
};

export default Navbar;
