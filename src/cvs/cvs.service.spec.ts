import { Test, TestingModule } from '@nestjs/testing';
import { CvsService } from './cvs.service';

describe('CvsService', () => {
  let service: CvsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CvsService],
    }).compile();

    service = module.get<CvsService>(CvsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
