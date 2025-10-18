import { Link } from './link.interface';

export interface Project {
  title: string;
  description?: string;
  technologies?: string[];
  links?: Link[];
  startDate: string;
  endDate?: string;
  currentlyOngoing?: boolean;
  [key: string]: any;
}
