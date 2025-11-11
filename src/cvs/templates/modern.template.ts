import { TDocumentDefinitions } from 'pdfmake/interfaces';
import { ICvTemplate } from './template.interface';

export class ModernTemplate implements ICvTemplate {
  name = 'modern';
  description = 'Bold and contemporary design with sidebar layout';

  generate(cvData: any): TDocumentDefinitions {
    return {
      pageMargins: [40, 40, 40, 40],
      content: [
        // Header with colored background
        {
          table: {
            widths: ['*'],
            body: [
              [
                {
                  stack: [
                    {
                      text: cvData.fullName?.toUpperCase() || 'N/A',
                      style: 'header',
                    },
                    {
                      text: cvData.title || '',
                      style: 'subheader',
                    },
                  ],
                  fillColor: '#1a73e8',
                  margin: [15, 15, 15, 15],
                },
              ],
            ],
          },
          layout: 'noBorders',
          margin: [0, 0, 0, 20],
        },

        // Contact Information in columns
        {
          columns: [
            {
              width: '*',
              stack: [
                ...(cvData.email
                  ? [
                      {
                        text: [
                          {
                            text: '@ ',
                            color: '#1a73e8',
                            fontSize: 11,
                            bold: true,
                          },
                          {
                            text: cvData.email,
                            link: `mailto:${cvData.email}`,
                            color: '#333333',
                          },
                        ],
                        style: 'contactItem',
                      },
                    ]
                  : []),
                ...(cvData.phone
                  ? [
                      {
                        text: [
                          {
                            text: '# ',
                            color: '#1a73e8',
                            fontSize: 11,
                            bold: true,
                          },
                          { text: cvData.phone, color: '#333333' },
                        ],
                        style: 'contactItem',
                      },
                    ]
                  : []),
                ...(cvData.links && cvData.links.length > 0
                  ? cvData.links
                      .filter((link: any, index: number) => index % 2 === 0)
                      .map((link: any) => ({
                        text: [
                          {
                            text: '» ',
                            color: '#1a73e8',
                            fontSize: 11,
                            bold: true,
                          },
                          {
                            text: link.type,
                            link: link.url,
                            color: '#1a73e8',
                            decoration: 'underline',
                          },
                        ],
                        style: 'contactItem',
                      }))
                  : []),
              ],
            },
            {
              width: '*',
              stack: [
                ...(cvData.location
                  ? [
                      {
                        text: [
                          {
                            text: '> ',
                            color: '#1a73e8',
                            fontSize: 11,
                            bold: true,
                          },
                          { text: cvData.location, color: '#333333' },
                        ],
                        style: 'contactItem',
                      },
                    ]
                  : []),
                ...(cvData.links && cvData.links.length > 0
                  ? cvData.links
                      .filter((link: any, index: number) => index % 2 === 1)
                      .map((link: any) => ({
                        text: [
                          {
                            text: '» ',
                            color: '#1a73e8',
                            fontSize: 11,
                            bold: true,
                          },
                          {
                            text: link.type,
                            link: link.url,
                            color: '#1a73e8',
                            decoration: 'underline',
                          },
                        ],
                        style: 'contactItem',
                      }))
                  : []),
              ],
            },
          ],
          columnGap: 20,
          margin: [0, 0, 0, 20],
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
                margin: [0, 0, 0, 20],
                alignment: 'justify',
                lineHeight: 1.6,
              },
            ]
          : []),

        // Skills Section with compact boxes
        ...(cvData.skills && cvData.skills.length > 0
          ? [
              {
                text: 'SKILLS',
                style: 'sectionHeader',
              },
              {
                table: {
                  widths: new Array(4).fill('*'),
                  body: this.chunkArray(cvData.skills, 4).map((row: any) =>
                    row.map((skill: any) => ({
                      text: skill,
                      style: 'skillBox',
                      fillColor: '#e8f0fe',
                      border: [true, true, true, true],
                      borderColor: ['#1a73e8', '#1a73e8', '#1a73e8', '#1a73e8'],
                    })),
                  ),
                },
                layout: {
                  paddingLeft: () => 3,
                  paddingRight: () => 3,
                  paddingTop: () => 3,
                  paddingBottom: () => 3,
                },
                margin: [0, 0, 0, 20],
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
              ...cvData.experiences.flatMap((exp: any, idx: number) => [
                {
                  columns: [
                    {
                      width: 8,
                      canvas: [
                        {
                          type: 'rect',
                          x: 0,
                          y: 0,
                          w: 4,
                          h: 4,
                          r: 2,
                          color: '#1a73e8',
                        },
                      ],
                      margin: [0, 6, 0, 0],
                    },
                    {
                      width: '*',
                      stack: [
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
                                    {
                                      text: exp.companyName || '',
                                      style: 'company',
                                      bold: true,
                                    },
                                    exp.location
                                      ? {
                                          text: ` • ${exp.location}`,
                                          style: 'company',
                                        }
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
                        },
                        ...(exp.links && exp.links.length > 0
                          ? [
                              {
                                text: exp.links.flatMap(
                                  (link: any, index: number) => [
                                    ...(index > 0
                                      ? [{ text: '  •  ', color: '#999999' }]
                                      : []),
                                    {
                                      text: link.type,
                                      link: link.url,
                                      color: '#1a73e8',
                                      decoration: 'underline',
                                      fontSize: 8.5,
                                    },
                                  ],
                                ),
                                margin: [0, 3, 0, 3],
                              },
                            ]
                          : []),
                        {
                          text: exp.description || '',
                          margin: [0, 5, 0, 0],
                          alignment: 'justify',
                          lineHeight: 1.5,
                        },
                      ],
                      margin: [0, 0, 0, 18],
                    },
                  ],
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
                      width: 8,
                      canvas: [
                        {
                          type: 'rect',
                          x: 0,
                          y: 0,
                          w: 4,
                          h: 4,
                          r: 2,
                          color: '#1a73e8',
                        },
                      ],
                      margin: [0, 6, 0, 0],
                    },
                    {
                      width: '*',
                      stack: [
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
                        },
                        {
                          text: project.description || '',
                          margin: [0, 5, 0, 3],
                          alignment: 'justify',
                        },
                        ...(project.links && project.links.length > 0
                          ? [
                              {
                                text: project.links.flatMap(
                                  (link: any, index: number) => [
                                    ...(index > 0
                                      ? [{ text: '  •  ', color: '#999999' }]
                                      : []),
                                    {
                                      text: link.type,
                                      link: link.url,
                                      color: '#1a73e8',
                                      decoration: 'underline',
                                      fontSize: 8.5,
                                    },
                                  ],
                                ),
                                margin: [0, 0, 0, 3],
                              },
                            ]
                          : []),
                        ...(project.technologies &&
                        project.technologies.length > 0
                          ? [
                              {
                                text: `Tech Stack: ${project.technologies.join(' • ')}`,
                                style: 'technologies',
                                margin: [0, 0, 0, 0],
                              },
                            ]
                          : []),
                      ],
                      margin: [0, 0, 0, 18],
                    },
                  ],
                },
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
                      width: 8,
                      canvas: [
                        {
                          type: 'rect',
                          x: 0,
                          y: 0,
                          w: 4,
                          h: 4,
                          r: 2,
                          color: '#1a73e8',
                        },
                      ],
                      margin: [0, 6, 0, 0],
                    },
                    {
                      width: '*',
                      stack: [
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
                                    {
                                      text: edu.schoolName || '',
                                      style: 'company',
                                      bold: true,
                                    },
                                    edu.location
                                      ? {
                                          text: ` • ${edu.location}`,
                                          style: 'company',
                                        }
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
                        },
                        ...(edu.description
                          ? [
                              {
                                text: edu.description,
                                margin: [0, 5, 0, 0],
                                alignment: 'justify',
                                lineHeight: 1.5,
                              },
                            ]
                          : []),
                      ],
                      margin: [0, 0, 0, 18],
                    },
                  ],
                },
              ]),
            ]
          : []),

        // Activities Section
        ...(cvData.activities && cvData.activities.length > 0
          ? [
              {
                text: 'ACTIVITIES & ACHIEVEMENTS',
                style: 'sectionHeader',
              },
              ...cvData.activities.flatMap((activity: any) => [
                {
                  columns: [
                    {
                      width: 8,
                      canvas: [
                        {
                          type: 'rect',
                          x: 0,
                          y: 0,
                          w: 4,
                          h: 4,
                          r: 2,
                          color: '#1a73e8',
                        },
                      ],
                      margin: [0, 6, 0, 0],
                    },
                    {
                      width: '*',
                      stack: [
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
                        },
                        {
                          text: activity.description || '',
                          margin: [0, 5, 0, 0],
                          alignment: 'justify',
                          lineHeight: 1.5,
                        },
                      ],
                      margin: [0, 0, 0, 18],
                    },
                  ],
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
                      width: 8,
                      canvas: [
                        {
                          type: 'rect',
                          x: 0,
                          y: 0,
                          w: 4,
                          h: 4,
                          r: 2,
                          color: '#1a73e8',
                        },
                      ],
                      margin: [0, 6, 0, 0],
                    },
                    {
                      width: '*',
                      stack: [
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
                                      bold: true,
                                    },
                                    vol.location
                                      ? {
                                          text: ` • ${vol.location}`,
                                          style: 'company',
                                        }
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
                        },
                        {
                          text: vol.description || '',
                          margin: [0, 5, 0, 0],
                          alignment: 'justify',
                          lineHeight: 1.5,
                        },
                      ],
                      margin: [0, 0, 0, 18],
                    },
                  ],
                },
              ]),
            ]
          : []),
      ],
      styles: {
        header: {
          fontSize: 26,
          bold: true,
          color: '#ffffff',
          characterSpacing: 3,
          margin: [0, 0, 0, 5],
        },
        subheader: {
          fontSize: 13,
          color: '#e3f2fd',
          bold: false,
          margin: [0, 0, 0, 0],
        },
        contactItem: {
          fontSize: 9,
          margin: [0, 0, 0, 3],
        },
        sectionHeader: {
          fontSize: 14,
          bold: true,
          color: '#1a73e8',
          margin: [0, 0, 0, 10],
          characterSpacing: 1,
        },
        skillBox: {
          fontSize: 8,
          alignment: 'center',
          margin: [2, 3, 2, 3],
          color: '#1a73e8',
          bold: true,
        },
        jobTitle: {
          fontSize: 11.5,
          bold: true,
          color: '#1a1a1a',
        },
        company: {
          fontSize: 10,
          color: '#555555',
        },
        date: {
          fontSize: 9,
          color: '#777777',
          italics: false,
        },
        employmentType: {
          fontSize: 8.5,
          color: '#888888',
          italics: true,
        },
        technologies: {
          fontSize: 9,
          color: '#1a73e8',
          bold: true,
        },
      },
      defaultStyle: {
        fontSize: 10,
        color: '#333333',
        lineHeight: 1.4,
      },
    };
  }

  // Helper function to chunk array for skills table
  private chunkArray(array: any[], size: number): any[][] {
    const chunks: any[][] = [];
    for (let i = 0; i < array.length; i += size) {
      const chunk = array.slice(i, i + size);
      // Pad the last row if needed
      while (chunk.length < size) {
        chunk.push('');
      }
      chunks.push(chunk);
    }
    return chunks;
  }
}
