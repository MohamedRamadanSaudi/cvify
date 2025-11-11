export class GenerateCvDto {
  jobDescription: string;
  profileId: number;
  template?: string; // 'classic' or 'modern', defaults to 'classic'
}
