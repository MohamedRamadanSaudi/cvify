import * as pdfMake from 'pdfmake/build/pdfmake';
import * as pdfFonts from 'pdfmake/build/vfs_fonts';
import { TemplateFactory } from './templates/template.factory';

// Set fonts for pdfmake
(pdfMake as any).vfs = pdfFonts;

export class PdfGenerator {
  static generatePdf(cvData: any, templateName = 'classic'): Promise<Buffer> {
    // Get the selected template
    const template = TemplateFactory.getTemplate(templateName);
    const docDefinition = template.generate(cvData);

    // Create PDF using pdfMake
    const pdfDocGenerator = (pdfMake as any).createPdf(docDefinition);

    return new Promise((resolve, reject) => {
      pdfDocGenerator.getBuffer(
        (buffer: Buffer) => {
          resolve(buffer);
        },
        (err: Error) => {
          reject(err);
        },
      );
    });
  }

  // Get all available templates
  static getAvailableTemplates() {
    return TemplateFactory.getAllTemplates();
  }
}
