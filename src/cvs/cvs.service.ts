import { Injectable } from '@nestjs/common';
import * as pdfMake from 'pdfmake/build/pdfmake';
import * as pdfFonts from 'pdfmake/build/vfs_fonts';
import { TDocumentDefinitions } from 'pdfmake/interfaces';
import { GroqService } from '../groq/groq.service';
import { PrismaService } from '../prisma/prisma.service';
import { GenerateCvDto } from './dto/generate-cv.dto';

// Set fonts for pdfmake
(pdfMake as any).vfs = pdfFonts;

@Injectable()
export class CvsService {
  constructor(
    private readonly groq: GroqService,
    private readonly prisma: PrismaService,
  ) {}

  async generate(generateCvDto: GenerateCvDto): Promise<Buffer | null> {
    // Fetch user data
    const user = await this.prisma.users.findUnique({
      where: { id: generateCvDto.userId },
    });

    if (!user) {
      throw new Error('User not found');
    }

    // Get optimized CV data from Groq
    const cvJsonString = await this.groq.getCvAsJson(
      generateCvDto.jobDescription,
      JSON.stringify(user),
    );

    if (!cvJsonString) {
      throw new Error('Failed to generate CV data');
    }

    // Clean the response - remove markdown code blocks if present
    let cleanedJson = cvJsonString.trim();

    // Remove ```json and ``` markers if present
    if (cleanedJson.startsWith('```json')) {
      cleanedJson = cleanedJson
        .replace(/^```json\s*/, '')
        .replace(/\s*```$/, '');
    } else if (cleanedJson.startsWith('```')) {
      cleanedJson = cleanedJson.replace(/^```\s*/, '').replace(/\s*```$/, '');
    }

    // Parse the CV data
    const cvData = JSON.parse(cleanedJson.trim());

    // Generate PDF
    return this.generatePdf(cvData);
  }

  private generatePdf(cvData: any): Promise<Buffer> {
    const docDefinition: TDocumentDefinitions = {
      content: [
        // Header Section
        {
          text: cvData.fullName || 'N/A',
          style: 'header',
          margin: [0, 0, 0, 5],
        },
        {
          text: cvData.title || '',
          style: 'subheader',
          margin: [0, 0, 0, 10],
        },
        {
          columns: [
            { text: cvData.email || '', style: 'contact' },
            { text: cvData.phone || '', style: 'contact' },
            { text: cvData.location || '', style: 'contact' },
          ],
          margin: [0, 0, 0, 15],
        },

        // Links Section
        ...(cvData.links && cvData.links.length > 0
          ? [
              {
                text: 'Links',
                style: 'sectionHeader',
                margin: [0, 10, 0, 5],
              },
              {
                ul: cvData.links.map(
                  (link: any) => `${link.type}: ${link.url}`,
                ),
                margin: [0, 0, 0, 10],
              },
            ]
          : []),

        // Summary Section
        ...(cvData.summary
          ? [
              {
                text: 'Professional Summary',
                style: 'sectionHeader',
                margin: [0, 10, 0, 5],
              },
              {
                text: cvData.summary,
                margin: [0, 0, 0, 10],
              },
            ]
          : []),

        // Skills Section
        ...(cvData.skills && cvData.skills.length > 0
          ? [
              {
                text: 'Skills',
                style: 'sectionHeader',
                margin: [0, 10, 0, 5],
              },
              {
                text: cvData.skills.join(' • '),
                margin: [0, 0, 0, 10],
              },
            ]
          : []),

        // Experience Section
        ...(cvData.experiences && cvData.experiences.length > 0
          ? [
              {
                text: 'Experience',
                style: 'sectionHeader',
                margin: [0, 10, 0, 5],
              },
              ...cvData.experiences.flatMap((exp: any) => [
                {
                  columns: [
                    {
                      text: exp.jobTitle || '',
                      style: 'jobTitle',
                      width: '*',
                    },
                    {
                      text: `${exp.startDate || ''} - ${exp.currentlyWorking ? 'Present' : exp.endDate || ''}`,
                      style: 'date',
                      alignment: 'right',
                      width: 'auto',
                    },
                  ],
                  margin: [0, 5, 0, 2],
                },
                {
                  columns: [
                    {
                      text: exp.companyName || '',
                      style: 'company',
                      width: '*',
                    },
                    {
                      text: exp.location || '',
                      style: 'company',
                      width: 'auto',
                    },
                    {
                      text: exp.employmentType || '',
                      style: 'employmentType',
                      alignment: 'right',
                      width: 'auto',
                    },
                  ],
                  margin: [0, 0, 0, 3],
                },
                {
                  text: exp.description || '',
                  margin: [0, 0, 0, 10],
                },
              ]),
            ]
          : []),

        // Projects Section
        ...(cvData.projects && cvData.projects.length > 0
          ? [
              {
                text: 'Projects',
                style: 'sectionHeader',
                margin: [0, 10, 0, 5],
              },
              ...cvData.projects.flatMap((project: any) => [
                {
                  columns: [
                    {
                      text: project.title || '',
                      style: 'jobTitle',
                      width: '*',
                    },
                    {
                      text: `${project.startDate || ''} - ${project.currentlyOngoing ? 'Present' : project.endDate || ''}`,
                      style: 'date',
                      alignment: 'right',
                      width: 'auto',
                    },
                  ],
                  margin: [0, 5, 0, 2],
                },
                {
                  text: project.description || '',
                  margin: [0, 0, 0, 3],
                },
                ...(project.technologies && project.technologies.length > 0
                  ? [
                      {
                        text: `Technologies: ${project.technologies.join(', ')}`,
                        style: 'technologies',
                        margin: [0, 0, 0, 10],
                      },
                    ]
                  : [{ margin: [0, 0, 0, 10] }]),
              ]),
            ]
          : []),

        // Education Section
        ...(cvData.education && cvData.education.length > 0
          ? [
              {
                text: 'Education',
                style: 'sectionHeader',
                margin: [0, 10, 0, 5],
              },
              ...cvData.education.flatMap((edu: any) => [
                {
                  columns: [
                    {
                      text: `${edu.degree || ''} in ${edu.fieldOfStudy || ''}`,
                      style: 'jobTitle',
                      width: '*',
                    },
                    {
                      text: `${edu.startDate || ''} - ${edu.currentlyStudying ? 'Present' : edu.endDate || ''}`,
                      style: 'date',
                      alignment: 'right',
                      width: 'auto',
                    },
                  ],
                  margin: [0, 5, 0, 2],
                },
                {
                  columns: [
                    {
                      text: edu.schoolName || '',
                      style: 'company',
                      width: '*',
                    },
                    {
                      text: edu.location || '',
                      style: 'company',
                      width: 'auto',
                    },
                  ],
                  margin: [0, 0, 0, 3],
                },
                ...(edu.grade
                  ? [
                      {
                        text: `Grade: ${edu.grade}`,
                        margin: [0, 0, 0, 3],
                      },
                    ]
                  : []),
                ...(edu.description
                  ? [
                      {
                        text: edu.description,
                        margin: [0, 0, 0, 10],
                      },
                    ]
                  : [{ margin: [0, 0, 0, 10] }]),
              ]),
            ]
          : []),

        // Activities Section
        ...(cvData.activities && cvData.activities.length > 0
          ? [
              {
                text: 'Activities',
                style: 'sectionHeader',
                margin: [0, 10, 0, 5],
              },
              ...cvData.activities.flatMap((activity: any) => [
                {
                  columns: [
                    {
                      text: activity.title || '',
                      style: 'jobTitle',
                      width: '*',
                    },
                    {
                      text: `${activity.startDate || ''} - ${activity.currentlyOngoing ? 'Present' : activity.endDate || ''}`,
                      style: 'date',
                      alignment: 'right',
                      width: 'auto',
                    },
                  ],
                  margin: [0, 5, 0, 2],
                },
                ...(activity.role
                  ? [
                      {
                        text: activity.role,
                        style: 'company',
                        margin: [0, 0, 0, 3],
                      },
                    ]
                  : []),
                {
                  text: activity.description || '',
                  margin: [0, 0, 0, 10],
                },
              ]),
            ]
          : []),

        // Volunteering Section
        ...(cvData.volunteering && cvData.volunteering.length > 0
          ? [
              {
                text: 'Volunteering',
                style: 'sectionHeader',
                margin: [0, 10, 0, 5],
              },
              ...cvData.volunteering.flatMap((vol: any) => [
                {
                  columns: [
                    {
                      text: vol.role || '',
                      style: 'jobTitle',
                      width: '*',
                    },
                    {
                      text: `${vol.startDate || ''} - ${vol.currentlyVolunteering ? 'Present' : vol.endDate || ''}`,
                      style: 'date',
                      alignment: 'right',
                      width: 'auto',
                    },
                  ],
                  margin: [0, 5, 0, 2],
                },
                {
                  columns: [
                    {
                      text: vol.organizationName || '',
                      style: 'company',
                      width: '*',
                    },
                    {
                      text: vol.location || '',
                      style: 'company',
                      width: 'auto',
                    },
                  ],
                  margin: [0, 0, 0, 3],
                },
                {
                  text: vol.description || '',
                  margin: [0, 0, 0, 10],
                },
              ]),
            ]
          : []),
      ],
      styles: {
        header: {
          fontSize: 24,
          bold: true,
          color: '#2c3e50',
        },
        subheader: {
          fontSize: 16,
          color: '#34495e',
        },
        contact: {
          fontSize: 10,
          color: '#7f8c8d',
        },
        sectionHeader: {
          fontSize: 14,
          bold: true,
          color: '#2c3e50',
          decoration: 'underline',
        },
        jobTitle: {
          fontSize: 12,
          bold: true,
        },
        company: {
          fontSize: 11,
          color: '#34495e',
          italics: true,
        },
        date: {
          fontSize: 10,
          color: '#7f8c8d',
        },
        employmentType: {
          fontSize: 10,
          color: '#7f8c8d',
        },
        technologies: {
          fontSize: 10,
          color: '#16a085',
          italics: true,
        },
      },
      defaultStyle: {
        fontSize: 11,
        color: '#2c3e50',
      },
    };

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

  findAll() {
    return `This action returns all cvs`;
  }
}
