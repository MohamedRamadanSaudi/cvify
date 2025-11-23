import { Injectable } from '@nestjs/common';
import * as fs from 'node:fs';
import * as path from 'node:path';
import { GroqService } from '../groq/groq.service';
import { PrismaService } from '../prisma/prisma.service';
import { GenerateCvDto } from './dto/generate-cv.dto';
import { PdfGenerator } from './pdf-generator';

@Injectable()
export class CvsService {
  private readonly uploadsDir = path.join(process.cwd(), 'uploads', 'cvs');

  constructor(
    private readonly groq: GroqService,
    private readonly prisma: PrismaService,
  ) {
    // Ensure uploads directory exists
    this.ensureUploadsDirExists();
  }

  private ensureUploadsDirExists() {
    if (!fs.existsSync(this.uploadsDir)) {
      fs.mkdirSync(this.uploadsDir, { recursive: true });
    }
  }

  async generate(generateCvDto: GenerateCvDto): Promise<Buffer | null> {
    // Fetch profile data
    const profile = await this.prisma.profiles.findUnique({
      where: { id: generateCvDto.profileId },
    });

    if (!profile) {
      throw new Error('Profile not found');
    }

    // Get optimized CV data from Groq
    const cvJsonString = await this.groq.getCvAsJson(
      generateCvDto.jobDescription,
      JSON.stringify(profile),
    );

    if (!cvJsonString) {
      throw new Error('Failed to generate CV data');
    }

    // Clean the response - remove markdown code blocks if present
    let cleanedJson = cvJsonString.trim();

    // Remove any introductory text before the JSON (e.g., "Here's the...")
    // Find the first { or [ character which indicates the start of JSON
    const jsonStartIndex = cleanedJson.search(/[{[]/);
    if (jsonStartIndex > 0) {
      cleanedJson = cleanedJson.substring(jsonStartIndex);
    }

    // Remove ```json and ``` markers if present
    if (cleanedJson.startsWith('```json')) {
      cleanedJson = cleanedJson
        .replace(/^```json\s*/, '')
        .replace(/\s*```$/, '');
    } else if (cleanedJson.startsWith('```')) {
      cleanedJson = cleanedJson.replace(/^```\s*/, '').replace(/\s*```$/, '');
    }

    // Remove any trailing text after the JSON
    const jsonEndIndex = cleanedJson.lastIndexOf('}');
    const arrayEndIndex = cleanedJson.lastIndexOf(']');
    const lastIndex = Math.max(jsonEndIndex, arrayEndIndex);
    if (lastIndex > 0 && lastIndex < cleanedJson.length - 1) {
      cleanedJson = cleanedJson.substring(0, lastIndex + 1);
    }

    // Parse the CV data
    let cvData;
    try {
      cvData = JSON.parse(cleanedJson.trim());
    } catch (error) {
      console.error('Failed to parse JSON:', cleanedJson);
      throw new Error(`Failed to parse CV data: ${error.message}`);
    }

    // Generate PDF
    const pdfBuffer = await PdfGenerator.generatePdf(cvData);

    // Save PDF to uploads directory
    const timestamp = Date.now();
    const filename = `cv_${generateCvDto.profileId}_${timestamp}.pdf`;
    const filePath = path.join(this.uploadsDir, filename);
    const relativePath = path.join('uploads', 'cvs', filename);

    fs.writeFileSync(filePath, pdfBuffer);

    // Save CV record to database
    await this.prisma.cVs.create({
      data: {
        profileId: generateCvDto.profileId,
        jobDescription: generateCvDto.jobDescription,
        pdfPath: relativePath,
        cvData: cvData,
      },
    });

    return pdfBuffer;
  }

  findAll() {
    return this.prisma.cVs.findMany({
      include: {
        profile: {
          select: {
            id: true,
            profileName: true,
            email: true,
            fullName: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  findOne(id: number) {
    return this.prisma.cVs.findUnique({
      where: { id },
      include: {
        profile: {
          select: {
            id: true,
            email: true,
            fullName: true,
          },
        },
      },
    });
  }

  findByProfile(profileId: number) {
    return this.prisma.cVs.findMany({
      where: { profileId },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async getPdfBuffer(id: number): Promise<Buffer | null> {
    const cv = await this.prisma.cVs.findUnique({
      where: { id },
    });

    if (!cv) {
      return null;
    }

    const fullPath = path.join(process.cwd(), cv.pdfPath);

    if (!fs.existsSync(fullPath)) {
      return null;
    }

    return fs.readFileSync(fullPath);
  }

  async regeneratePdf(id: number): Promise<Buffer | null> {
    // Get the CV record with cvData
    const cv = await this.prisma.cVs.findUnique({
      where: { id },
    });

    if (!cv?.cvData) {
      throw new Error('CV not found or no CV data available');
    }

    // Regenerate PDF from existing cvData
    const pdfBuffer = await PdfGenerator.generatePdf(cv.cvData);

    // Optionally update the PDF file in uploads directory
    const fullPath = path.join(process.cwd(), cv.pdfPath);
    fs.writeFileSync(fullPath, pdfBuffer);

    return pdfBuffer;
  }

  async updateCvData(id: number, cvData: any) {
    // Validate that CV exists
    const cv = await this.prisma.cVs.findUnique({
      where: { id },
    });

    if (!cv) {
      throw new Error('CV not found');
    }

    // Update the CV data
    const updatedCv = await this.prisma.cVs.update({
      where: { id },
      data: { cvData },
    });

    // Regenerate PDF with new data
    const pdfBuffer = await PdfGenerator.generatePdf(cvData);
    const fullPath = path.join(process.cwd(), cv.pdfPath);
    fs.writeFileSync(fullPath, pdfBuffer);

    return updatedCv;
  }

  async remove(id: number) {
    const cv = await this.prisma.cVs.findUnique({
      where: { id },
    });

    if (!cv) {
      throw new Error('CV not found');
    }

    // Delete the PDF file
    const fullPath = path.join(process.cwd(), cv.pdfPath);
    if (fs.existsSync(fullPath)) {
      fs.unlinkSync(fullPath);
    }

    // Delete the database record
    return this.prisma.cVs.delete({
      where: { id },
    });
  }
}
