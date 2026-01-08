
import React, { useState, useEffect, useMemo } from 'react';
import { 
  format, 
  startOfMonth, 
  endOfMonth, 
  startOfWeek, 
  endOfWeek, 
  eachDayOfInterval, 
  isSameMonth, 
  isSameDay, 
  addMonths, 
  subMonths,
  parseISO
} from 'date-fns';
import { Plus, ChevronLeft, ChevronRight, Calendar as CalendarIcon, List, Target, Trophy, Settings } from 'lucide-react';
import { ViewMode, CleaningTask } from './types';
import CalendarView from './components/CalendarView';
import DailyView from './components/DailyView';
import TaskModal from './components/TaskModal';
import GoalModal from './components/GoalModal';
import StatsFooter from './components/StatsFooter';
import CelebrationOverlay from './components/CelebrationOverlay';

const STORAGE_KEY = 'cleanmaster_pro_tasks';
const STORAGE_GOAL_KEY = 'cleanmaster_pro_goal';
const DEFAULT_GOAL = 50000;

export default function App() {
  const [tasks, setTasks] = useState<CleaningTask[]>([]);
  const [monthlyGoal, setMonthlyGoal] = useState<number>(DEFAULT_GOAL);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [viewMode, setViewMode] = useState<ViewMode>(ViewMode.CALENDAR);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isGoalModalOpen, setIsGoalModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<CleaningTask | null>(null);
  const [showCelebration, setShowCelebration] = useState(false);

  useEffect(() => {
    const savedTasks = localStorage.getItem(STORAGE_KEY);
    if (savedTasks) {
      setTasks(JSON.parse(savedTasks));
    }
    const savedGoal = localStorage.getItem(STORAGE_GOAL_KEY);
    if (savedGoal) {
      setMonthlyGoal(Number(savedGoal));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
  }, [tasks]);

  useEffect(() => {
    localStorage.setItem(STORAGE_GOAL_KEY, monthlyGoal.toString());
  }, [monthlyGoal]);

  const monthlyTasks = useMemo(() => {
    return tasks.filter(t => isSameMonth(parseISO(t.date), currentDate));
  }, [tasks, currentDate]);

  const monthlyIncome = useMemo(() => {
    return monthlyTasks.reduce((sum, t) => sum + t.price, 0);
  }, [monthlyTasks]);

  const dailyTasks = useMemo(() => {
    return tasks.filter(t => isSameDay(parseISO(t.date), selectedDate));
  }, [tasks, selectedDate]);

  const dailyIncome = useMemo(() => {
    return dailyTasks.reduce((sum, t) => sum + t.price, 0);
  }, [dailyTasks]);

  const handleAddTask = (task: Omit<CleaningTask, 'id'>) => {
    const newTask = { ...task, id: Math.random().toString(36).substr(2, 9) };
    setTasks(prev => [...prev, newTask]);
    setIsModalOpen(false);
    
    if (monthlyIncome + task.price >= monthlyGoal && monthlyIncome < monthlyGoal) {
      setShowCelebration(true);
    }
  };

  const handleUpdateTask = (task: CleaningTask) => {
    setTasks(prev => prev.map(t => t.id === task.id ? task : t));
    setEditingTask(null);
    setIsModalOpen(false);
  };

  const handleDeleteTask = (id: string) => {
    setTasks(prev => prev.filter(t => t.id !== id));
  };

  const openEditModal = (task: CleaningTask) => {
    setEditingTask(task);
    setIsModalOpen(true);
  };

  const handleUpdateGoal = (newGoal: number) => {
    setMonthlyGoal(newGoal);
    setIsGoalModalOpen(false);
  };

  return (
    <div className="flex flex-col min-h-screen pb-40 max-w-md mx-auto bg-white shadow-xl relative">
      <header className="bg-sensaicha text-white px-6 pt-8 pb-4 sticky top-0 z-30 shadow-md">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold flex items-center gap-2">
             <Trophy className="text-yellow-400 w-6 h-6" />
             CleanMaster
          </h1>
          <button 
            onClick={() => setIsGoalModalOpen(true)}
            className="p-2 bg-white/10 rounded-full active:scale-95 transition-transform"
          >
            <Settings className="w-5 h-5" />
          </button>
        </div>
        
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <button onClick={() => setCurrentDate(subMonths(currentDate, 1))} className="p-1">
              <ChevronLeft className="w-6 h-6" />
            </button>
            <span className="text-xl font-medium min-w-[120px] text-center">
              {format(currentDate, 'yyyy / MM')}
            </span>
            <button onClick={() => setCurrentDate(addMonths(currentDate, 1))} className="p-1">
              <ChevronRight className="w-6 h-6" />
            </button>
          </div>
          <div className="flex bg-black/20 rounded-lg p-1">
            <button 
              onClick={() => setViewMode(ViewMode.CALENDAR)}
              className={`p-2 rounded-md transition-colors ${viewMode === ViewMode.CALENDAR ? 'bg-white text-sensaicha' : 'text-white'}`}
            >
              <CalendarIcon className="w-5 h-5" />
            </button>
            <button 
              onClick={() => setViewMode(ViewMode.DAILY)}
              className={`p-2 rounded-md transition-colors ${viewMode === ViewMode.DAILY ? 'bg-white text-sensaicha' : 'text-white'}`}
            >
              <List className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto px-4 py-6">
        {viewMode === ViewMode.CALENDAR ? (
          <CalendarView 
            currentDate={currentDate} 
            selectedDate={selectedDate}
            onSelectDate={(date) => {
              setSelectedDate(date);
              setViewMode(ViewMode.DAILY);
            }}
            tasks={tasks}
          />
        ) : (
          <DailyView 
            date={selectedDate} 
            tasks={dailyTasks} 
            dailyIncome={dailyIncome}
            onEdit={openEditModal}
            onDelete={handleDeleteTask}
          />
        )}
      </main>

      {/* FAB - Adjusted for better mobile reach and visibility */}
      <button 
        onClick={() => {
          setEditingTask(null);
          setIsModalOpen(true);
        }}
        className="fixed bottom-36 left-1/2 -translate-x-1/2 sm:translate-x-0 sm:left-auto sm:right-6 w-16 h-16 bg-gold rounded-full shadow-2xl flex items-center justify-center text-white z-50 active:scale-90 transition-transform"
        style={{ marginBottom: '20px' }}
      >
        <Plus className="w-8 h-8" />
      </button>

      <StatsFooter 
        viewMode={viewMode}
        dailyIncome={dailyIncome}
        monthlyIncome={monthlyIncome}
        monthlyGoal={monthlyGoal}
      />

      <TaskModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={editingTask ? handleUpdateTask : handleAddTask}
        initialTask={editingTask}
        selectedDate={selectedDate}
      />

      <GoalModal
        isOpen={isGoalModalOpen}
        onClose={() => setIsGoalModalOpen(false)}
        onSave={handleUpdateGoal}
        currentGoal={monthlyGoal}
      />

      {showCelebration && (
        <CelebrationOverlay onClose={() => setShowCelebration(false)} />
      )}
    </div>
  );
}
