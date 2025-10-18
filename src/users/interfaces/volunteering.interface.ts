export interface Volunteering {
  organizationName: string;
  description?: string;
  role: string;
  location?: string;
  startDate: string;
  endDate?: string;
  currentlyVolunteering?: boolean;
  [key: string]: any;
}
