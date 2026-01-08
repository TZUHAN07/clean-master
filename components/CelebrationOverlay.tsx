
import React, { useEffect } from 'react';
import { Trophy, Star, PartyPopper } from 'lucide-react';

interface CelebrationOverlayProps {
  onClose: () => void;
}

const CelebrationOverlay: React.FC<CelebrationOverlayProps> = ({ onClose }) => {
  useEffect(() => {
    const timer = setTimeout(onClose, 4000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-sensaicha/90 backdrop-blur-md animate-fadeIn">
      <div className="text-center p-10 animate-slideUp">
        <div className="relative inline-block mb-6">
          <Trophy className="w-32 h-32 text-yellow-400 drop-shadow-2xl animate-bounce" />
          <PartyPopper className="absolute -top-4 -left-4 w-12 h-12 text-white animate-pulse" />
          <Star className="absolute -bottom-2 -right-6 w-10 h-10 text-white animate-pulse delay-100" />
        </div>
        
        <h2 className="text-4xl font-black text-white mb-4">目標達成！</h2>
        <p className="text-xl text-white/80 font-medium">
          恭喜你本月收入突破目標金額！<br/>
          辛苦工作是有回報的 🎉
        </p>

        <button 
          onClick={onClose}
          className="mt-10 px-8 py-4 bg-white text-sensaicha rounded-full font-bold text-lg shadow-xl active:scale-95 transition-transform"
        >
          太好了！繼續努力
        </button>
      </div>

      {/* Basic Particle Animation Mocks */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {[...Array(20)].map((_, i) => (
          <div 
            key={i}
            className="absolute w-2 h-2 rounded-full bg-yellow-400 animate-ping"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 2}s`,
              animationDuration: `${2 + Math.random() * 3}s`
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default CelebrationOverlay;
