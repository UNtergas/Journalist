import { Test, TestingModule } from '@nestjs/testing';
import { ApprenticeService } from './apprentice.service';

describe('ApprenticeService', () => {
  let service: ApprenticeService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ApprenticeService],
    }).compile();

    service = module.get<ApprenticeService>(ApprenticeService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
