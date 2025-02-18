import { Test, TestingModule } from '@nestjs/testing';
import { SkillValidationService } from './skill-validation.service';

describe('SkillValidationService', () => {
  let service: SkillValidationService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SkillValidationService],
    }).compile();

    service = module.get<SkillValidationService>(SkillValidationService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
