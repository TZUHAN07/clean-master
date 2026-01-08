
import React from 'react';
import { 
  format, 
  startOfMonth, 
  endOfMonth, 
  startOfWeek, 
  endOfWeek, 
  eachDayOfInterval, 
  isSameMonth, 
  isSameDay, 
  parseISO
} from 'date-fns';
import { CleaningTask } from '../types';

interface CalendarViewProps {
  currentDate: Date;
  selectedDate: Date;
  onSelectDate: (date: Date) => void;
  tasks: CleaningTask[];
}

const CalendarView: React.FC<CalendarViewProps> = ({ currentDate, selectedDate, onSelectDate, tasks }) => {
  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(monthStart);
  const startDate = startOfWeek(monthStart);
  const endDate = endOfWeek(monthEnd);

  const calendarDays = eachDayOfInterval({ start: startDate, end: endDate });

  const getDayData = (date: Date) => {
    const dayTasks = tasks.filter(t => isSameDay(parseISO(t.date), date));
    return {
      count: dayTasks.length,
      income: dayTasks.reduce((sum, t) => sum + t.price, 0)
    };
  };

  const weekdays = ['日', '一', '二', '三', '四', '五', '六'];

  return (
    <div className="bg-white rounded-2xl p-2 animate-fadeIn">
      <div className="grid grid-cols-7 mb-2">
        {weekdays.map(day => (
          <div key={day} className="text-center text-gray-400 text-sm py-2 font-medium">
            {day}
          </div>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-1">
        {calendarDays.map((day, idx) => {
          const { count, income } = getDayData(day);
          const isSelected = isSameDay(day, selectedDate);
          const isCurrentMonth = isSameMonth(day, monthStart);
          
          return (
            <button
              key={idx}
              onClick={() => onSelectDate(day)}
              className={`
                flex flex-col h-20 p-1 border rounded-xl transition-all relative
                ${!isCurrentMonth ? 'opacity-20 bg-gray-50' : 'bg-white'}
                ${isSelected ? 'border-sensaicha ring-2 ring-sensaicha/20' : 'border-gray-100'}
                active:scale-95
              `}
            >
              <span className={`text-sm font-bold mb-1 ${isSameDay(day, new Date()) ? 'text-sensaicha underline decoration-2' : 'text-gray-700'}`}>
                {format(day, 'd')}
              </span>
              
              {count > 0 && (
                <div className="flex flex-col flex-1 justify-end">
                  <span className="text-[10px] text-gray-400 font-medium">
                    {count} 案
                  </span>
                  <span className="text-[11px] text-gold font-bold truncate">
                    ${income.toLocaleString()}
                  </span>
                </div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default CalendarView;
