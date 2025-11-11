import { ClassicTemplate } from './classic.template';
import { ModernTemplate } from './modern.template';
import { ICvTemplate } from './template.interface';

export class TemplateFactory {
  private static templates: Map<string, ICvTemplate> = new Map([
    ['classic', new ClassicTemplate()],
    ['modern', new ModernTemplate()],
  ]);

  static getTemplate(name: string): ICvTemplate {
    const template = this.templates.get(name);
    if (!template) {
      // Default to classic template if not found
      return this.templates.get('classic')!;
    }
    return template;
  }

  static getAllTemplates(): Array<{
    name: string;
    description: string;
  }> {
    return Array.from(this.templates.values()).map((template) => ({
      name: template.name,
      description: template.description,
    }));
  }
}
