import React from 'react';

interface BubbleLoadingAnimationProps {
  isVisible: boolean;
}

const BubbleLoadingAnimation: React.FC<BubbleLoadingAnimationProps> = ({ isVisible }) => {
  if (!isVisible) return null;

  return (
    <div className="absolute inset-0 flex items-center justify-center z-10 rounded-lg bg-background/80 backdrop-blur-sm">
      <div className="relative w-24 h-24 flex items-center justify-center">
        {/* Ripple effect */}
        <div className="absolute w-full h-full rounded-full bg-primary/20 animate-ripple"></div>
        <div className="absolute w-3/4 h-3/4 rounded-full bg-primary/30 animate-ripple-delay-200"></div>
        <div className="absolute w-1/2 h-1/2 rounded-full bg-primary/40 animate-ripple-delay-400"></div>
        
        {/* Bubbling effect */}
        <div className="relative flex space-x-1">
          <div className="w-3 h-3 bg-primary rounded-full animate-bounce"></div>
          <div className="w-3 h-3 bg-primary rounded-full animate-bounce-delay-100"></div>
          <div className="w-3 h-3 bg-primary rounded-full animate-bounce-delay-200"></div>
        </div>
      </div>
      
      <style jsx>{`
        @keyframes ripple {
          0% {
            transform: scale(0.8);
            opacity: 1;
          }
          100% {
            transform: scale(1.5);
            opacity: 0;
          }
        }
        
        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        
        .animate-ripple {
          animation: ripple 2s infinite;
        }
        
        .animate-ripple-delay-200 {
          animation: ripple 2s infinite 0.2s;
        }
        
        .animate-ripple-delay-400 {
          animation: ripple 2s infinite 0.4s;
        }
        
        .animate-bounce {
          animation: bounce 0.6s infinite;
        }
        
        .animate-bounce-delay-100 {
          animation: bounce 0.6s infinite 0.1s;
        }
        
        .animate-bounce-delay-200 {
          animation: bounce 0.6s infinite 0.2s;
        }
      `}</style>
    </div>
  );
};

export default BubbleLoadingAnimation;