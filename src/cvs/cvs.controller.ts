import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Res,
} from '@nestjs/common';
import { Response } from 'express';
import { CvsService } from './cvs.service';
import { GenerateCvDto } from './dto/generate-cv.dto';

@Controller('cvs')
export class CvsController {
  constructor(private readonly cvsService: CvsService) {}

  @Post('generate')
  async generate(@Body() generateCvDto: GenerateCvDto, @Res() res: Response) {
    const pdfBuffer = await this.cvsService.generate(generateCvDto);

    if (!pdfBuffer) {
      res.status(500).send('Failed to generate PDF');
      return;
    }

    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': 'attachment; filename=cv.pdf',
      'Content-Length': pdfBuffer.length,
    });

    res.send(pdfBuffer);
  }

  @Get()
  async findAll() {
    return this.cvsService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.cvsService.findOne(+id);
  }

  @Get('profile/:profileId')
  async findByProfile(@Param('profileId') profileId: string) {
    return this.cvsService.findByProfile(+profileId);
  }

  @Patch(':id/cv-data')
  async updateCvData(@Param('id') id: string, @Body() cvData: any) {
    return this.cvsService.updateCvData(+id, cvData);
  }

  @Get(':id/regenerate')
  async regeneratePdf(@Param('id') id: string, @Res() res: Response) {
    try {
      const pdfBuffer = await this.cvsService.regeneratePdf(+id);

      if (!pdfBuffer) {
        res.status(500).send('Failed to regenerate PDF');
        return;
      }

      res.set({
        'Content-Type': 'application/pdf',
        'Content-Disposition': 'inline; filename=cv.pdf',
        'Content-Length': pdfBuffer.length,
      });

      res.send(pdfBuffer);
    } catch (error) {
      res.status(404).send(error.message);
    }
  }

  @Get(':id/download')
  async download(@Param('id') id: string, @Res() res: Response) {
    const pdfBuffer = await this.cvsService.getPdfBuffer(+id);

    if (!pdfBuffer) {
      res.status(404).send('CV not found');
      return;
    }

    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': 'attachment; filename=cv.pdf',
      'Content-Length': pdfBuffer.length,
    });

    res.send(pdfBuffer);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.cvsService.remove(+id);
  }
}
