export interface Education {
  schoolName: string;
  degree: string;
  fieldOfStudy: string;
  grade?: string;
  startDate: string;
  endDate?: string;
  description?: string;
  location?: string;
  currentlyStudying?: boolean;
  [key: string]: any;
}
