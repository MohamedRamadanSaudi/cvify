import { IsOptional, IsString } from 'class-validator';
import { Activity } from '../interfaces/activity.interface';
import { Education } from '../interfaces/education.interface';
import { Experience } from '../interfaces/experience.interface';
import { Link } from '../interfaces/link.interface';
import { Project } from '../interfaces/project.interface';
import { Volunteering } from '../interfaces/volunteering.interface';

export class UpdateUserDto {
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
}
