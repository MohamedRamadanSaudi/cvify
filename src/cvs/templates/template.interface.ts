import { TDocumentDefinitions } from 'pdfmake/interfaces';

export interface ICvTemplate {
  name: string;
  description: string;
  generate(cvData: any): TDocumentDefinitions;
}
