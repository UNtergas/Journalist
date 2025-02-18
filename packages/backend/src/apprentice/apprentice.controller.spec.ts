import { Test, TestingModule } from '@nestjs/testing';
import { ApprenticeController } from './apprentice.controller';

describe('ApprenticeController', () => {
  let controller: ApprenticeController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ApprenticeController],
    }).compile();

    controller = module.get<ApprenticeController>(ApprenticeController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
