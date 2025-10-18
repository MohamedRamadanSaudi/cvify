import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Groq from 'groq-sdk';
import * as fs from 'node:fs';
import * as path from 'node:path';

@Injectable()
export class GroqService {
  private readonly groq: Groq;

  constructor(private readonly configService: ConfigService) {
    this.groq = new Groq({
      apiKey: this.configService.get<string>('GROQ_API_KEY'),
    });
  }

  async getCvAsJson(jobDescription: string, userProfile: string) {
    const prompt = this.prompt(jobDescription, userProfile);
    return this.chat(prompt);
  }

  private prompt(jobDescription: string, userProfile: string) {
    const promptPath = path.join(__dirname, 'prompt.md');
    const template = fs.readFileSync(promptPath, 'utf-8');
    return template
      .replace('{{jobDescription}}', jobDescription)
      .replace('{{userProfile}}', userProfile);
  }

  async chat(prompt: string) {
    try {
      const completion = await this.groq.chat.completions.create({
        messages: [
          {
            role: 'system',
            content: `you are a technical recruiter with expertise in software development roles.`,
          },
          {
            role: 'user',
            content: prompt,
          },
        ],
        model: 'llama-3.1-8b-instant',
        temperature: 0.7,
      });

      return completion.choices[0]?.message?.content;
    } catch (error) {
      console.error('GROQ API Error:', error);
      throw error;
    }
  }
}
