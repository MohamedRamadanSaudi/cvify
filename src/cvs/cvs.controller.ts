import { Body, Controller, Post, Res } from '@nestjs/common';
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
}
