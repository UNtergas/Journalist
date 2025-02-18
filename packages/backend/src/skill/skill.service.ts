import PRISMA from "../../prisma";
import { Injectable } from "@nestjs/common";
import { Skill, SkillCreate } from "@shared/backend";

@Injectable()
export class SkillService {
  async count(): Promise<number> {
    return PRISMA.skill.count();
  }

  async findAll(): Promise<Skill[]> {
    return PRISMA.skill.findMany({
      include: {
        activities: true,
        missions: true,
        validation: true,
      },
    });
  }

  async findOneById(id: number): Promise<Skill> {
    return PRISMA.skill.findUnique({
      where: {
        id: id,
      },
      include: {
        activities: true,
        missions: true,
        validation: true,
      },
    });
  }

  async createOne(skillCreationData: SkillCreate): Promise<Skill> {
    return PRISMA.skill.create({
      data: {
        ...skillCreationData,
      },
      include: {
        activities: true,
        missions: true,
        validation: true,
      },
    });
  }
}
