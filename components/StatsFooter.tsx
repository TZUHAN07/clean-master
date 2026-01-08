
import React, { useEffect, useState } from 'react';
import { TrendingUp, Award } from 'lucide-react';
import { ViewMode } from '../types';

interface StatsFooterProps {
  viewMode: ViewMode;
  dailyIncome: number;
  monthlyIncome: number;
  monthlyGoal: number;
}

const StatsFooter: React.FC<StatsFooterProps> = ({ viewMode, dailyIncome, monthlyIncome, monthlyGoal }) => {
  const [displayValue, setDisplayValue] = useState(0);
  const progress = Math.min((monthlyIncome / monthlyGoal) * 100, 100);

  const targetValue = viewMode === ViewMode.DAILY ? dailyIncome : monthlyIncome;
  const label = viewMode === ViewMode.DAILY ? '本日預計收入' : '本月預計總收入';

  useEffect(() => {
    const duration = 600;
    const start = displayValue;
    const end = targetValue;
    const startTime = performance.now();

    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const factor = Math.min(elapsed / duration, 1);
      const easeFactor = factor === 1 ? 1 : 1 - Math.pow(2, -10 * factor);
      setDisplayValue(Math.floor(start + (end - start) * easeFactor));
      if (factor < 1) requestAnimationFrame(animate);
    };

    requestAnimationFrame(animate);
  }, [targetValue, viewMode]);

  return (
    <footer className="fixed bottom-0 left-0 right-0 max-w-md mx-auto z-40 px-4 pb-8 pt-4 pointer-events-none">
      <div className="bg-white rounded-[32px] shadow-[0_-15px_50px_rgba(0,0,0,0.1)] p-6 border border-gray-100 backdrop-blur-md bg-white/95 pointer-events-auto">
        <div className="flex justify-between items-end mb-4">
          <div className="space-y-0.5">
            <span className="text-gray-400 text-[11px] font-bold uppercase tracking-wider">{label}</span>
            <div className="flex items-baseline gap-1">
              <span className="text-3xl font-black text-gold">$</span>
              <span className="text-4xl font-black text-gray-900 tabular-nums">
                {displayValue.toLocaleString()}
              </span>
            </div>
          </div>
          <div className="text-right">
             <div className="flex items-center gap-1 text-sensaicha font-bold justify-end">
               <TrendingUp className="w-4 h-4" />
               <span className="text-lg">{progress.toFixed(0)}%</span>
             </div>
             <span className="text-[10px] text-gray-400 font-medium">月目標 {monthlyGoal.toLocaleString()}</span>
          </div>
        </div>

        {/* 進度條 */}
        <div className="w-full h-2.5 bg-gray-100 rounded-full overflow-hidden mb-4 relative">
          <div 
            className="h-full bg-sensaicha transition-all duration-1000 ease-out relative"
            style={{ width: `${progress}%` }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-transparent to-white/20"></div>
          </div>
        </div>

        {/* 跑馬燈激勵資訊 */}
        <div className="flex items-center gap-2 text-xs text-gray-500 overflow-hidden whitespace-nowrap border-t border-gray-50 pt-3">
          <Award className="w-4 h-4 text-gold flex-shrink-0" />
          <div className="animate-marquee inline-block">
            {monthlyIncome >= monthlyGoal 
              ? '🏆 已達標！辛苦工作是有回報的，給自己放個假吧！' 
              : `💪 目前月總收入 $${monthlyIncome.toLocaleString()}，距離目標還差 $${(monthlyGoal - monthlyIncome).toLocaleString()}！`}
          </div>
        </div>
      </div>
      
      <style>{`
        @keyframes marquee {
          0% { transform: translateX(100%); }
          100% { transform: translateX(-100%); }
        }
        .animate-marquee {
          animation: marquee 15s linear infinite;
        }
        @keyframes slideUp {
          from { transform: translateY(100%); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        .animate-slideUp {
          animation: slideUp 0.4s cubic-bezier(0.16, 1, 0.3, 1);
        }
      `}</style>
    </footer>
  );
};

export default StatsFooter;
