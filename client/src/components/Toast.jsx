import { useEffect } from 'react';
import { CheckCircle, XCircle, X } from 'lucide-react';
function cn(...classes) {
  return classes.filter(Boolean).join(' ');
}

const Toast = ({ message, type = 'success', onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 5000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className="fixed bottom-4 right-4 z-50 animate-slide-up">
      <div className={cn(
        "flex items-center justify-between px-4 py-3 rounded-lg shadow-lg border backdrop-blur-md min-w-[300px]",
        type === 'success' ? 'bg-green-500/10 border-green-500/20 text-green-400' : 'bg-red-500/10 border-red-500/20 text-red-400'
      )}>
        <div className="flex items-center space-x-3">
          {type === 'success' ? <CheckCircle className="w-5 h-5" /> : <XCircle className="w-5 h-5" />}
          <span className="font-medium text-sm">{message}</span>
        </div>
        <button onClick={onClose} className="hover:opacity-70 transition-opacity">
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default Toast;
