import PRISMA from "../../prisma";
import { Injectable } from "@nestjs/common";
import { Activity, ActivityCreate, SkillCreate } from "@shared/backend";

@Injectable()
export class ActivityService {
  async count(): Promise<number> {
    return PRISMA.activity.count();
  }

  async findAll(): Promise<Activity[]> {
    return PRISMA.activity.findMany({
      include: {
        skills: {
          include: {
            skill: {
              include: {
                validation: true,
              },
            },
          },
        },
        feedbacks: true,
      },
    });
  }

  async findOneById(id: number): Promise<Activity> {
    return PRISMA.activity.findUnique({
      where: {
        id: id,
      },
      include: {
        skills: {
          include: {
            skill: {
              include: {
                validation: true,
              },
            },
          },
        },
        feedbacks: true,
      },
    });
  }

  async createOne(activityCreationData: ActivityCreate): Promise<Activity> {
    return PRISMA.activity.create({
      data: {
        ...activityCreationData,
      },
      include: {
        skills: {
          include: {
            skill: {
              include: {
                validation: true,
              },
            },
          },
        },
        feedbacks: true,
      },
    });
  }

  async updateOne(
    id: number,
    activityData: Partial<ActivityCreate> | null = null,
    newSkill: SkillCreate | null = null,
  ): Promise<Activity> {
    return PRISMA.activity.update({
      where: {
        id: id,
      },
      data: {
        ...activityData,
        skills: newSkill
          ? {
              create: [
                {
                  skill: {
                    create: newSkill,
                  },
                },
              ],
            }
          : undefined,
      },
      include: {
        skills: {
          include: {
            skill: {
              include: {
                validation: true,
              },
            },
          },
        },
        feedbacks: true,
      },
    });
  }
}
