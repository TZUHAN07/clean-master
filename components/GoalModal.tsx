
import React, { useState, useEffect } from 'react';
import { X, Save, Target, DollarSign } from 'lucide-react';

interface GoalModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (newGoal: number) => void;
  currentGoal: number;
}

const GoalModal: React.FC<GoalModalProps> = ({ isOpen, onClose, onSave, currentGoal }) => {
  const [goal, setGoal] = useState(currentGoal.toString());

  useEffect(() => {
    if (isOpen) {
      setGoal(currentGoal.toString());
    }
  }, [isOpen, currentGoal]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const numericGoal = Number(goal);
    if (numericGoal > 0) {
      onSave(numericGoal);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 backdrop-blur-sm transition-opacity px-4">
      <div className="bg-white w-full max-w-md rounded-t-[40px] p-8 pb-10 shadow-2xl animate-slideUp">
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gold/10 rounded-xl">
              <Target className="w-6 h-6 text-gold" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800">
              設定每月目標
            </h2>
          </div>
          <button onClick={onClose} className="p-2 bg-gray-100 rounded-full">
            <X className="w-6 h-6 text-gray-500" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <p className="text-gray-500 text-sm">
            設定一個具有挑戰性但可達成的目標，我們將協助你追蹤進度。
          </p>

          <div className="relative">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-bold text-xl">
              $
            </div>
            <input 
              type="number"
              placeholder="目標金額 (例如: 50,000)"
              required
              min="1"
              className="w-full bg-gray-50 border-none rounded-2xl py-6 pl-12 pr-4 text-3xl font-black text-gray-900 focus:ring-2 focus:ring-sensaicha outline-none"
              value={goal}
              onChange={e => setGoal(e.target.value)}
              autoFocus
            />
          </div>

          <button 
            type="submit"
            className="w-full bg-sensaicha text-white py-5 rounded-3xl text-xl font-bold shadow-lg shadow-sensaicha/20 flex items-center justify-center gap-3 active:scale-95 transition-transform"
          >
            <Save className="w-6 h-6" />
            更新目標
          </button>
        </form>
      </div>
    </div>
  );
};

export default GoalModal;
