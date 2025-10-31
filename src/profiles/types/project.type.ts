import { Link } from './link.type';

export type Project = {
  title: string;
  description?: string;
  technologies?: string[];
  links?: Link[];
  startDate: string;
  endDate?: string;
  currentlyOngoing?: boolean;
};
