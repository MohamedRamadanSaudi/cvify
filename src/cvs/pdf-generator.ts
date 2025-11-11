import * as pdfMake from 'pdfmake/build/pdfmake';
import * as pdfFonts from 'pdfmake/build/vfs_fonts';
import { TDocumentDefinitions } from 'pdfmake/interfaces';

// Set fonts for pdfmake
(pdfMake as any).vfs = pdfFonts;

export class PdfGenerator {
  static generatePdf(cvData: any): Promise<Buffer> {
    const docDefinition: TDocumentDefinitions = {
      pageMargins: [40, 60, 40, 60],
      content: [
        // Header Section with Name
        {
          text: cvData.fullName?.toUpperCase() || 'N/A',
          style: 'header',
          alignment: 'center',
        },
        {
          text: cvData.title || '',
          style: 'subheader',
          alignment: 'center',
        },

        // Contact Information Row
        {
          text: [
            ...(cvData.email
              ? [
                  {
                    text: cvData.email,
                    link: `mailto:${cvData.email}`,
                    color: '#555555',
                  },
                ]
              : []),
            ...(cvData.phone && cvData.email
              ? [{ text: '  •  ', color: '#999999' }]
              : []),
            ...(cvData.phone ? [{ text: cvData.phone, color: '#555555' }] : []),
            ...(cvData.location && (cvData.email || cvData.phone)
              ? [{ text: '  •  ', color: '#999999' }]
              : []),
            ...(cvData.location
              ? [{ text: cvData.location, color: '#555555' }]
              : []),
          ],
          style: 'contact',
          margin: [0, 0, 0, 4],
          alignment: 'center',
        },

        // Links Row
        ...(cvData.links && cvData.links.length > 0
          ? [
              {
                text: cvData.links.flatMap((link: any, index: number) => [
                  ...(index > 0 ? [{ text: '  •  ', color: '#999999' }] : []),
                  {
                    text: link.type,
                    link: link.url,
                    color: '#0066cc',
                    decoration: 'underline',
                  },
                ]),
                style: 'links',
                margin: [0, 0, 0, 8],
                alignment: 'center',
              },
            ]
          : []),

        // Divider
        {
          canvas: [
            {
              type: 'line',
              x1: 0,
              y1: 0,
              x2: 515,
              y2: 0,
              lineWidth: 1.5,
              lineColor: '#0066cc',
            },
          ],
          margin: [0, 0, 0, 8],
        },

        // Summary Section
        ...(cvData.summary
          ? [
              {
                text: 'SUMMARY',
                style: 'sectionHeader',
              },
              {
                text: cvData.summary,
                margin: [0, 0, 0, 16],
                alignment: 'justify',
                lineHeight: 1.5,
              },
            ]
          : []),

        // Skills Section
        ...(cvData.skills && cvData.skills.length > 0
          ? [
              {
                text: 'SKILLS',
                style: 'sectionHeader',
              },
              {
                text: cvData.skills.join('  •  '),
                margin: [0, 0, 0, 16],
                lineHeight: 1.5,
              },
            ]
          : []),

        // Experience Section
        ...(cvData.experiences && cvData.experiences.length > 0
          ? [
              {
                text: 'PROFESSIONAL EXPERIENCE',
                style: 'sectionHeader',
              },
              ...cvData.experiences.flatMap((exp: any) => [
                {
                  columns: [
                    {
                      stack: [
                        {
                          text: exp.jobTitle || '',
                          style: 'jobTitle',
                        },
                        {
                          text: [
                            { text: exp.companyName || '', style: 'company' },
                            exp.location
                              ? { text: ` | ${exp.location}`, style: 'company' }
                              : {},
                          ],
                          margin: [0, 2, 0, 0],
                        },
                      ],
                      width: '*',
                    },
                    {
                      stack: [
                        {
                          text: `${exp.startDate || ''} - ${exp.currentlyWorking ? 'Present' : exp.endDate || ''}`,
                          style: 'date',
                          alignment: 'right',
                        },
                        ...(exp.employmentType
                          ? [
                              {
                                text: exp.employmentType,
                                style: 'employmentType',
                                alignment: 'right',
                                margin: [0, 2, 0, 0],
                              },
                            ]
                          : []),
                      ],
                      width: 'auto',
                    },
                  ],
                  margin: [0, 0, 0, 4],
                },
                ...(exp.links && exp.links.length > 0
                  ? [
                      {
                        text: exp.links.flatMap((link: any, index: number) => [
                          ...(index > 0
                            ? [{ text: '  |  ', color: '#666666' }]
                            : []),
                          {
                            text: link.type,
                            link: link.url,
                            color: '#0066cc',
                            decoration: 'underline',
                          },
                        ]),
                        style: 'experienceLinks',
                        margin: [0, 0, 0, 3],
                      },
                    ]
                  : []),
                {
                  text: exp.description || '',
                  margin: [0, 0, 0, 16],
                  alignment: 'justify',
                  lineHeight: 1.5,
                },
              ]),
            ]
          : []),

        // Projects Section
        ...(cvData.projects && cvData.projects.length > 0
          ? [
              {
                text: 'PROJECTS',
                style: 'sectionHeader',
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
                  margin: [0, 0, 0, 4],
                },
                {
                  text: project.description || '',
                  margin: [0, 0, 0, 3],
                  alignment: 'justify',
                },
                ...(project.links && project.links.length > 0
                  ? [
                      {
                        text: project.links.flatMap(
                          (link: any, index: number) => [
                            ...(index > 0
                              ? [{ text: '  |  ', color: '#666666' }]
                              : []),
                            {
                              text: link.type,
                              link: link.url,
                              color: '#0066cc',
                              decoration: 'underline',
                            },
                          ],
                        ),
                        style: 'projectLinks',
                        margin: [0, 0, 0, 3],
                      },
                    ]
                  : []),
                ...(project.technologies && project.technologies.length > 0
                  ? [
                      {
                        text: `Technologies: ${project.technologies.join(', ')}`,
                        style: 'technologies',
                        margin: [0, 0, 0, 16],
                      },
                    ]
                  : [
                      {
                        text: '',
                        margin: [0, 0, 0, 16],
                      },
                    ]),
              ]),
            ]
          : []),

        // Education Section
        ...(cvData.education && cvData.education.length > 0
          ? [
              {
                text: 'EDUCATION',
                style: 'sectionHeader',
              },
              ...cvData.education.flatMap((edu: any) => [
                {
                  columns: [
                    {
                      stack: [
                        {
                          text: `${edu.degree || ''} in ${edu.fieldOfStudy || ''}`,
                          style: 'jobTitle',
                        },
                        {
                          text: [
                            { text: edu.schoolName || '', style: 'company' },
                            edu.location
                              ? { text: ` | ${edu.location}`, style: 'company' }
                              : {},
                          ],
                          margin: [0, 2, 0, 0],
                        },
                        ...(edu.grade
                          ? [
                              {
                                text: `Grade: ${edu.grade}`,
                                style: 'company',
                                margin: [0, 2, 0, 0],
                              },
                            ]
                          : []),
                      ],
                      width: '*',
                    },
                    {
                      text: `${edu.startDate || ''} - ${edu.currentlyStudying ? 'Present' : edu.endDate || ''}`,
                      style: 'date',
                      alignment: 'right',
                      width: 'auto',
                    },
                  ],
                  margin: [0, 0, 0, 4],
                },
                ...(edu.description
                  ? [
                      {
                        text: edu.description,
                        margin: [0, 0, 0, 16],
                        alignment: 'justify',
                        lineHeight: 1.5,
                      },
                    ]
                  : [
                      {
                        text: '',
                        margin: [0, 0, 0, 16],
                      },
                    ]),
              ]),
            ]
          : []),

        // Activities Section
        ...(cvData.activities && cvData.activities.length > 0
          ? [
              {
                text: 'ACTIVITIES',
                style: 'sectionHeader',
              },
              ...cvData.activities.flatMap((activity: any) => [
                {
                  columns: [
                    {
                      stack: [
                        {
                          text: activity.title || '',
                          style: 'jobTitle',
                        },
                        ...(activity.role
                          ? [
                              {
                                text: activity.role,
                                style: 'company',
                                margin: [0, 2, 0, 0],
                              },
                            ]
                          : []),
                      ],
                      width: '*',
                    },
                    {
                      text: `${activity.startDate || ''} - ${activity.currentlyOngoing ? 'Present' : activity.endDate || ''}`,
                      style: 'date',
                      alignment: 'right',
                      width: 'auto',
                    },
                  ],
                  margin: [0, 0, 0, 4],
                },
                {
                  text: activity.description || '',
                  margin: [0, 0, 0, 16],
                  alignment: 'justify',
                  lineHeight: 1.5,
                },
              ]),
            ]
          : []),

        // Volunteering Section
        ...(cvData.volunteering && cvData.volunteering.length > 0
          ? [
              {
                text: 'VOLUNTEERING',
                style: 'sectionHeader',
              },
              ...cvData.volunteering.flatMap((vol: any) => [
                {
                  columns: [
                    {
                      stack: [
                        {
                          text: vol.role || '',
                          style: 'jobTitle',
                        },
                        {
                          text: [
                            {
                              text: vol.organizationName || '',
                              style: 'company',
                            },
                            vol.location
                              ? { text: ` | ${vol.location}`, style: 'company' }
                              : {},
                          ],
                          margin: [0, 2, 0, 0],
                        },
                      ],
                      width: '*',
                    },
                    {
                      text: `${vol.startDate || ''} - ${vol.currentlyVolunteering ? 'Present' : vol.endDate || ''}`,
                      style: 'date',
                      alignment: 'right',
                      width: 'auto',
                    },
                  ],
                  margin: [0, 0, 0, 4],
                },
                {
                  text: vol.description || '',
                  margin: [0, 0, 0, 16],
                  alignment: 'justify',
                  lineHeight: 1.5,
                },
              ]),
            ]
          : []),
      ],
      styles: {
        header: {
          fontSize: 24,
          bold: true,
          color: '#1a1a1a',
          characterSpacing: 2,
          margin: [0, 0, 0, 2],
        },
        subheader: {
          fontSize: 12,
          color: '#4a4a4a',
          bold: false,
          margin: [0, 0, 0, 8],
        },
        contact: {
          fontSize: 9,
          color: '#555555',
        },
        links: {
          fontSize: 8.5,
          color: '#555555',
        },
        sectionHeader: {
          fontSize: 13,
          bold: true,
          color: '#1a1a1a',
          margin: [0, 12, 0, 6],
          decoration: 'underline',
          decorationStyle: 'solid',
          decorationColor: '#0066cc',
        },
        jobTitle: {
          fontSize: 11.5,
          bold: true,
          color: '#1a1a1a',
        },
        company: {
          fontSize: 10,
          color: '#4a4a4a',
        },
        date: {
          fontSize: 9,
          color: '#666666',
          italics: false,
        },
        employmentType: {
          fontSize: 8.5,
          color: '#777777',
          italics: true,
        },
        technologies: {
          fontSize: 9,
          color: '#0066cc',
          bold: false,
        },
        experienceLinks: {
          fontSize: 8.5,
          color: '#0066cc',
        },
        projectLinks: {
          fontSize: 8.5,
          color: '#0066cc',
        },
      },
      defaultStyle: {
        fontSize: 10,
        color: '#2a2a2a',
        lineHeight: 1.4,
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
}
