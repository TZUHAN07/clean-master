
import React, { useState, useEffect } from 'react';
import { X, Save, User, MapPin } from 'lucide-react';
import { CleaningTask } from '../types';
import { format } from 'date-fns';

interface TaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (task: any) => void;
  initialTask?: CleaningTask | null;
  selectedDate: Date;
}

const TaskModal: React.FC<TaskModalProps> = ({ isOpen, onClose, onSave, initialTask, selectedDate }) => {
  const [formData, setFormData] = useState({
    clientName: '',
    startTime: '09:00',
    endTime: '12:00',
    price: '',
    address: '',
    date: format(selectedDate, 'yyyy-MM-dd')
  });

  useEffect(() => {
    if (initialTask) {
      setFormData({
        ...initialTask,
        price: initialTask.price.toString()
      });
    } else {
      setFormData({
        clientName: '',
        startTime: '09:00',
        endTime: '12:00',
        price: '',
        address: '',
        date: format(selectedDate, 'yyyy-MM-dd')
      });
    }
  }, [initialTask, isOpen, selectedDate]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      ...formData,
      price: Number(formData.price),
      id: initialTask?.id
    });
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-end justify-center bg-black/60 backdrop-blur-sm transition-opacity px-4">
      <div className="bg-white w-full max-w-md rounded-t-[40px] p-6 pb-10 shadow-2xl animate-slideUp overflow-y-auto max-h-[90vh]">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-gray-800">
            {initialTask ? '編輯任務' : '新增清潔任務'}
          </h2>
          <button type="button" onClick={onClose} className="p-2 bg-gray-100 rounded-full active:bg-gray-200">
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* 客戶名稱 */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-gray-400 ml-2">客戶名稱</label>
            <div className="relative">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
                <User className="w-5 h-5" />
              </div>
              <input 
                type="text"
                placeholder="請輸入客戶名稱"
                required
                className="w-full bg-gray-50 border-2 border-transparent rounded-2xl py-4 pl-12 pr-4 text-lg focus:border-sensaicha focus:bg-white outline-none transition-all"
                value={formData.clientName}
                onChange={e => setFormData(prev => ({ ...prev, clientName: e.target.value }))}
              />
            </div>
          </div>

          {/* 服務時段 - 修正行動版無法調整的問題 */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-gray-400 ml-2">服務時段 (點擊輸入框調整時間)</label>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label htmlFor="start-time" className="text-[10px] text-gray-400 uppercase block ml-1 text-center">開始時間</label>
                <input 
                  id="start-time"
                  type="time"
                  required
                  className="w-full bg-gray-50 border-2 border-transparent rounded-2xl py-4 px-2 text-lg focus:border-sensaicha focus:bg-white outline-none text-center cursor-pointer"
                  value={formData.startTime}
                  onChange={e => setFormData(prev => ({ ...prev, startTime: e.target.value }))}
                />
              </div>
              <div className="space-y-1">
                <label htmlFor="end-time" className="text-[10px] text-gray-400 uppercase block ml-1 text-center">結束時間</label>
                <input 
                  id="end-time"
                  type="time"
                  required
                  className="w-full bg-gray-50 border-2 border-transparent rounded-2xl py-4 px-2 text-lg focus:border-sensaicha focus:bg-white outline-none text-center cursor-pointer"
                  value={formData.endTime}
                  onChange={e => setFormData(prev => ({ ...prev, endTime: e.target.value }))}
                />
              </div>
            </div>
          </div>

          {/* 服務金額 */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-gray-400 ml-2">服務金額</label>
            <div className="relative">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-bold text-xl pointer-events-none">
                $
              </div>
              <input 
                type="number"
                placeholder="請輸入金額"
                required
                className="w-full bg-gray-50 border-2 border-transparent rounded-2xl py-4 pl-12 pr-4 text-2xl font-black text-gold focus:border-sensaicha focus:bg-white outline-none"
                value={formData.price}
                onChange={e => setFormData(prev => ({ ...prev, price: e.target.value }))}
              />
            </div>
          </div>

          {/* 服務地址 */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-gray-400 ml-2">服務地址</label>
            <div className="relative">
              <div className="absolute left-4 top-4 text-gray-400 pointer-events-none">
                <MapPin className="w-5 h-5" />
              </div>
              <textarea 
                placeholder="請輸入地址，方便導航"
                rows={2}
                className="w-full bg-gray-50 border-2 border-transparent rounded-2xl py-4 pl-12 pr-4 text-lg focus:border-sensaicha focus:bg-white outline-none transition-all"
                value={formData.address}
                onChange={e => setFormData(prev => ({ ...prev, address: e.target.value }))}
              />
            </div>
          </div>

          <button 
            type="submit"
            className="w-full bg-sensaicha text-white py-5 rounded-3xl text-lg font-bold shadow-lg shadow-sensaicha/20 flex items-center justify-center gap-3 active:scale-95 transition-transform mt-4"
          >
            <Save className="w-5 h-5" />
            確認儲存任務
          </button>
        </form>
      </div>
    </div>
  );
};

export default TaskModal;
