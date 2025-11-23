import { IsOptional, IsString } from 'class-validator';
import { Activity } from '../types/activity.type';
import { Certificate } from '../types/certificate.type';
import { Education } from '../types/education.type';
import { Experience } from '../types/experience.type';
import { Link } from '../types/link.type';
import { Project } from '../types/project.type';
import { Volunteering } from '../types/volunteering.type';

export class UpdateProfileDto {
  @IsOptional()
  @IsString()
  fullName?: string;

  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsString()
  phone?: string;

  @IsOptional()
  @IsString()
  location?: string;

  @IsOptional()
  @IsString()
  summary?: string;

  @IsOptional()
  @IsString({ each: true })
  skills?: string[];

  @IsOptional()
  links?: Link[];

  @IsOptional()
  education?: Education[];

  @IsOptional()
  experiences?: Experience[];

  @IsOptional()
  projects?: Project[];

  @IsOptional()
  activities?: Activity[];

  @IsOptional()
  volunteering?: Volunteering[];

  @IsOptional()
  certificates?: Certificate[];
}
