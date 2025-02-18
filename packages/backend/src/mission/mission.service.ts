import PRISMA from "../../prisma";
import { Injectable } from "@nestjs/common";
import { Mission, MissionCreate } from "@shared/backend";

@Injectable()
export class MissionService {
  async count(): Promise<number> {
    return PRISMA.mission.count();
  }

  async findAll(): Promise<Mission[]> {
    return PRISMA.mission.findMany({
      include: {
        skills: true,
        activities: {
          include: {
            feedbacks: true,
            skills: {
              include: {
                skill: {
                  include: {
                    validation: true,
                  },
                },
              },
            },
          },
        },
      },
    });
  }

  async findOneById(id: number): Promise<Mission> {
    return PRISMA.mission.findUnique({
      where: {
        id: id,
      },
      include: {
        skills: true,
        activities: {
          include: {
            feedbacks: true,
            skills: {
              include: {
                skill: {
                  include: {
                    validation: true,
                  },
                },
              },
            },
          },
        },
      },
    });
  }

  async createOne(missionCreationData: MissionCreate): Promise<Mission> {
    return PRISMA.mission.create({
      data: {
        ...missionCreationData,
      },
      include: {
        skills: true,
        activities: {
          include: {
            feedbacks: true,
            skills: {
              include: {
                skill: {
                  include: {
                    validation: true,
                  },
                },
              },
            },
          },
        },
      },
    });
  }
}
