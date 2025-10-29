import { useState, useEffect } from "react";
import { XMarkIcon, CheckCircleIcon, ExclamationTriangleIcon, InformationCircleIcon, XCircleIcon } from "@heroicons/react/24/outline";
import { CheckCircleIcon as CheckCircleSolid, ExclamationTriangleIcon as ExclamationTriangleSolid, InformationCircleIcon as InformationCircleSolid, XCircleIcon as XCircleSolid } from "@heroicons/react/24/solid";

export interface CustomToast {
  id: string;
  title: string;
  description?: string;
  type: 'success' | 'error' | 'warning' | 'info';
  duration?: number;
}

interface CustomToastProps {
  toast: CustomToast;
  onRemove: (id: string) => void;
}

const CustomToastComponent = ({ toast, onRemove }: CustomToastProps) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isLeaving, setIsLeaving] = useState(false);

  useEffect(() => {
    // Animate in
    const timer = setTimeout(() => setIsVisible(true), 10);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (toast.duration) {
      const timer = setTimeout(() => {
        handleRemove();
      }, toast.duration);
      return () => clearTimeout(timer);
    }
  }, [toast.duration]);

  const handleRemove = () => {
    setIsLeaving(true);
    setTimeout(() => {
      onRemove(toast.id);
    }, 300);
  };

  const getIcon = () => {
    const iconClass = "h-5 w-5";
    switch (toast.type) {
      case 'success':
        return <CheckCircleSolid className={`${iconClass} text-green-500`} />;
      case 'error':
        return <XCircleSolid className={`${iconClass} text-red-500`} />;
      case 'warning':
        return <ExclamationTriangleSolid className={`${iconClass} text-yellow-500`} />;
      case 'info':
        return <InformationCircleSolid className={`${iconClass} text-blue-500`} />;
      default:
        return <InformationCircleSolid className={`${iconClass} text-blue-500`} />;
    }
  };

  const getBackgroundColor = () => {
    switch (toast.type) {
      case 'success':
        return 'bg-green-500/10 border-green-500/20';
      case 'error':
        return 'bg-red-500/10 border-red-500/20';
      case 'warning':
        return 'bg-yellow-500/10 border-yellow-500/20';
      case 'info':
        return 'bg-blue-500/10 border-blue-500/20';
      default:
        return 'bg-blue-500/10 border-blue-500/20';
    }
  };

  return (
    <div
      className={`
        relative overflow-hidden rounded-lg border backdrop-blur-sm p-4 shadow-lg transition-all duration-300 ease-in-out
        ${getBackgroundColor()}
        ${isVisible && !isLeaving ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'}
        ${isLeaving ? 'translate-x-full opacity-0' : ''}
        glass-effect
      `}
      style={{
        transform: isVisible && !isLeaving ? 'translateX(0)' : 'translateX(100%)',
        opacity: isVisible && !isLeaving ? 1 : 0,
      }}
    >
      {/* Animated background gradient */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent animate-pulse" />
      
      <div className="relative flex items-start gap-3">
        <div className="flex-shrink-0">
          {getIcon()}
        </div>
        
        <div className="flex-1 min-w-0">
          <h4 className="text-sm font-semibold text-foreground mb-1">
            {toast.title}
          </h4>
          {toast.description && (
            <p className="text-xs text-muted-foreground leading-relaxed">
              {toast.description}
            </p>
          )}
        </div>
        
        <button
          onClick={handleRemove}
          className="flex-shrink-0 p-1 rounded-full hover:bg-white/10 transition-colors"
        >
          <XMarkIcon className="h-4 w-4 text-muted-foreground hover:text-foreground" />
        </button>
      </div>
      
      {/* Progress bar */}
      {toast.duration && (
        <div className="absolute bottom-0 left-0 h-0.5 bg-current opacity-30">
          <div 
            className="h-full bg-current animate-pulse"
            style={{
              animation: `shrink ${toast.duration}ms linear forwards`
            }}
          />
        </div>
      )}
    </div>
  );
};

// Toast container component
interface ToastContainerProps {
  toasts: CustomToast[];
  onRemove: (id: string) => void;
}

export const CustomToastContainer = ({ toasts, onRemove }: ToastContainerProps) => {
  return (
    <div className="fixed top-4 right-4 z-50 space-y-2 max-w-sm w-full">
      {toasts.map((toast) => (
        <CustomToastComponent
          key={toast.id}
          toast={toast}
          onRemove={onRemove}
        />
      ))}
    </div>
  );
};

// Hook for managing toasts
export const useCustomToast = () => {
  const [toasts, setToasts] = useState<CustomToast[]>([]);

  const addToast = (toast: Omit<CustomToast, 'id'>) => {
    const id = Math.random().toString(36).substr(2, 9);
    const newToast: CustomToast = {
      ...toast,
      id,
      duration: toast.duration || 2500,
    };
    
    setToasts(prev => [...prev, newToast]);
  };

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  };

  const toast = {
    success: (title: string, description?: string) => 
      addToast({ title, description, type: 'success' }),
    error: (title: string, description?: string) => 
      addToast({ title, description, type: 'error' }),
    warning: (title: string, description?: string) => 
      addToast({ title, description, type: 'warning' }),
    info: (title: string, description?: string) => 
      addToast({ title, description, type: 'info' }),
  };

  return { toast, toasts, removeToast };
};

// Add CSS animation for progress bar
const style = document.createElement('style');
style.textContent = `
  @keyframes shrink {
    from { width: 100%; }
    to { width: 0%; }
  }
`;
document.head.appendChild(style);
