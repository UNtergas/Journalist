import PRISMA from "../../prisma";
import { Injectable } from "@nestjs/common";
import { Company } from "@shared/backend";

@Injectable()
export class CompanyService {
  async findAll(): Promise<Company[]> {
    return PRISMA.user.findMany({
      include: {
        mission_company: {
          include: {
            skills: true,
            activities: {
              include: {
                feedbacks: true,
                skills: {
                  include: {
                    skill: true,
                  },
                },
              },
            },
          },
        },
        feedbacks: true,
      },
    });
  }

  async findOneById(id: number): Promise<Company> {
    return PRISMA.user.findUnique({
      where: {
        id: id,
      },
      include: {
        mission_company: {
          include: {
            skills: true,
            activities: {
              include: {
                feedbacks: true,
                skills: {
                  include: {
                    skill: true,
                  },
                },
              },
            },
          },
        },
        feedbacks: true,
      },
    });
  }

  async findOneByEmail(email: string): Promise<Company> {
    return PRISMA.user.findUnique({
      where: {
        email: email,
      },
      include: {
        mission_company: {
          include: {
            skills: true,
            activities: {
              include: {
                feedbacks: true,
                skills: {
                  include: {
                    skill: true,
                  },
                },
              },
            },
          },
        },
        feedbacks: true,
      },
    });
  }
}
