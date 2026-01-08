
export interface CleaningTask {
  id: string;
  clientName: string;
  startTime: string; // HH:mm
  endTime: string;   // HH:mm
  price: number;
  address: string;
  date: string;      // YYYY-MM-DD
}

export enum ViewMode {
  CALENDAR = 'CALENDAR',
  DAILY = 'DAILY'
}

export interface MonthlyStats {
  totalIncome: number;
  taskCount: number;
  goal: number;
}
