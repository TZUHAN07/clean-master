
import React from 'react';
import { format } from 'date-fns';
import { MapPin, Navigation, Clock, Edit2, Trash2, CalendarX } from 'lucide-react';
import { CleaningTask } from '../types';

interface DailyViewProps {
  date: Date;
  tasks: CleaningTask[];
  dailyIncome: number;
  onEdit: (task: CleaningTask) => void;
  onDelete: (id: string) => void;
}

const DailyView: React.FC<DailyViewProps> = ({ date, tasks, dailyIncome, onEdit, onDelete }) => {
  const handleOpenMap = (address: string) => {
    const url = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(address)}`;
    window.open(url, '_blank');
  };

  return (
    <div className="space-y-4 animate-fadeIn">
      <div className="flex justify-between items-center px-2 py-2">
        <h2 className="text-xl font-bold text-gray-800">
          {format(date, 'MM月dd日')} 任務清單
        </h2>
        <span className="text-sm bg-gray-100 text-gray-500 px-3 py-1 rounded-full">
          共 {tasks.length} 件
        </span>
      </div>

      {tasks.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-gray-400">
          <CalendarX className="w-16 h-16 mb-4 opacity-20" />
          <p>今日尚無行程安排</p>
          <p className="text-sm">點擊按鈕新增任務</p>
        </div>
      ) : (
        <div className="space-y-4">
          {tasks.map(task => (
            <div key={task.id} className="bg-white border border-gray-100 rounded-3xl p-5 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden">
              <div className="absolute top-0 left-0 w-1.5 h-full bg-sensaicha opacity-20"></div>
              
              <div className="flex justify-between items-start mb-3">
                <div className="flex-1 pr-4">
                  <h3 className="text-lg font-bold text-gray-900 mb-1 truncate">{task.clientName}</h3>
                  <div className="flex items-center text-gray-500 text-sm gap-1">
                    <Clock className="w-4 h-4" />
                    <span>{task.startTime} - {task.endTime}</span>
                  </div>
                </div>
                <div className="text-right flex-shrink-0">
                  <div className="text-xl font-bold text-gold">${task.price.toLocaleString()}</div>
                </div>
              </div>

              <div className="flex items-start gap-2 text-gray-600 mb-5">
                <MapPin className="w-4 h-4 mt-1 flex-shrink-0" />
                <span className="text-sm break-words line-clamp-2">{task.address || '未填寫地址'}</span>
              </div>

              <div className="flex gap-2">
                <button 
                  onClick={() => handleOpenMap(task.address)}
                  className="flex-1 bg-sensaicha text-white py-3 rounded-2xl flex items-center justify-center gap-2 font-medium active:scale-95 transition-transform text-sm"
                >
                  <Navigation className="w-4 h-4" />
                  導航路線
                </button>
                <div className="flex gap-2">
                  <button 
                    onClick={() => onEdit(task)}
                    className="p-3 border border-gray-200 text-gray-500 rounded-2xl active:bg-gray-100"
                  >
                    <Edit2 className="w-5 h-5" />
                  </button>
                  <button 
                    onClick={() => {
                      if(confirm('確定要刪除這筆任務嗎？')) onDelete(task.id);
                    }}
                    className="p-3 border border-red-100 text-red-500 rounded-2xl active:bg-red-50"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default DailyView;
