import { Injectable } from "@nestjs/common";
import PRISMA from "../../prisma";
import { SkillValidation, SkillValidationCreate } from "@shared/backend";

@Injectable()
export class SkillValidationService {
  async count(): Promise<number> {
    return PRISMA.skillValidation.count();
  }

  async findAll(): Promise<SkillValidation[]> {
    return PRISMA.skillValidation.findMany();
  }

  async findOneById(id: number): Promise<SkillValidation> {
    return PRISMA.skillValidation.findUnique({
      where: {
        id: id,
      },
    });
  }

  async createOne(
    validatorId: number,
    skillValidationCreationData: SkillValidationCreate,
  ): Promise<SkillValidation> {
    return PRISMA.skillValidation.create({
      data: {
        ...skillValidationCreationData,
        validatorId: validatorId,
      },
    });
  }
}
