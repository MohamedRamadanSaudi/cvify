export interface Activity {
  title: string;
  description?: string;
  role?: string;
  startDate: string;
  endDate?: string;
  currentlyOngoing?: boolean;
  [key: string]: any;
}
