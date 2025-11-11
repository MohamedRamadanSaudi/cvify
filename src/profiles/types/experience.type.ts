import { Link } from './link.type';

export type Experience = {
  jobTitle: string;
  companyName: string;
  employmentType?: string;
  location?: string;
  links?: Link[];
  startDate: string;
  endDate?: string;
  currentlyWorking?: boolean;
  description?: string;
};
