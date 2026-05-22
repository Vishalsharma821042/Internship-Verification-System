import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { AlertTriangle } from 'lucide-react';

const NotFound = () => {
  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center text-center px-4">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-white/10 mb-8">
          <AlertTriangle className="w-10 h-10 text-white" />
        </div>
        <h1 className="text-6xl font-bold tracking-tighter mb-4 text-gradient">404</h1>
        <h2 className="text-2xl font-semibold mb-4">Page not found</h2>
        <p className="text-gray-400 max-w-md mx-auto mb-8">
          The page you are looking for doesn't exist or has been moved to another universe.
        </p>
        <Link
          to="/"
          className="inline-block bg-white text-black px-8 py-3 rounded-full font-medium hover:bg-gray-200 transition-colors"
        >
          Return Home
        </Link>
      </motion.div>
    </div>
  );
};

export default NotFound;
