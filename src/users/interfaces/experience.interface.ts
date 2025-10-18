export interface Experience {
  jobTitle: string;
  companyName: string;
  employmentType?: string;
  location?: string;
  startDate: string;
  endDate?: string;
  currentlyWorking?: boolean;
  description?: string;
  [key: string]: any;
}
