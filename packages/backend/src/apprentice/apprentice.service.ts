import { Injectable } from "@nestjs/common";
import { Apprentice, ApprenticeSkillMap, ApprenticeUpdate, ROLE } from "@shared/backend";
import PRISMA from "../../prisma";
@Injectable()
export class ApprenticeService {
  async findAll(): Promise<Apprentice[]> {
    return PRISMA.user.findMany({
      include: {
        mission_apprentice: {
          include: {
            skills: true,
            activities: {
              include: {
                feedbacks: true,
                skills: true,
              },
            },
          },
        },
        activities: {
          include: {
            skills: true,
            feedbacks: true,
          },
        },
        validatedCompetencies: true,
      },
    });
  }

  async findOneById(id: number): Promise<ApprenticeSkillMap> {
    return PRISMA.user.findUnique({
      where: {
        id: id,
      },
      include: {
        mission_apprentice: {
          include: {
            skills: true,
            activities: {
              include: {
                feedbacks: true,
                skills: true,
              },
            },
          },
        },
        activities: {
          include: {
            skills: true,
            feedbacks: true,
          },
        },
        validatedCompetencies: {
          include:{
            skill: {
              select:{
                type: true,
              }
            },
          }
        },
      },
    });
  }
  async findManyBySearch(search: string): Promise<{ email: string }[]> {
    return PRISMA.user.findMany({
      where: {
        role: ROLE.STUDENT,
        email: {
          contains: search,
          mode: "insensitive",
        },
      },
      select: { email: true },
    });
  }

  async findOneByEmail(email: string): Promise<Apprentice> {
    return PRISMA.user.findUnique({
      where: {
        email: email,
      },
      include: {
        mission_apprentice: {
          include: {
            skills: true,
            activities: {
              include: {
                feedbacks: true,
                skills: true,
              },
            },
          },
        },
        activities: {
          include: {
            skills: true,
            feedbacks: true,
          },
        },
        validatedCompetencies: true,
      },
    });
  }

  async updateOne(id: number, data: ApprenticeUpdate): Promise<Apprentice> {
    return PRISMA.user.update({
      where: {
        id: id,
      },
      data: {
        ...data,
      },
      include: {
        mission_apprentice: {
          include: {
            skills: true,
            activities: {
              include: {
                feedbacks: true,
                skills: true,
              },
            },
          },
        },
        activities: {
          include: {
            skills: true,
            feedbacks: true,
          },
        },
        validatedCompetencies: true,
      },
    });
  }
}
