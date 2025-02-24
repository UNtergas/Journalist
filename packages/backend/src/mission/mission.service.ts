import { API, APIResponse, Mission, MissionCreation, MissionUpdate } from '@shared/backend';
import PRISMA from '../../prisma';
import { Injectable } from '@nestjs/common';

@Injectable()
export class MissionService {
  
  async count(): Promise<number> {
    return PRISMA.mission.count();
  }
  
  async findAll(userId: number): Promise<Mission[]>{
    return PRISMA.mission.findMany({
      where:{
        userId: userId
      },
      include:{
        activities: {
          include: {
            notes: true,
            skills: true
          }
        }
      }
    });
  }
  async findOneById(userId: number,id: number): Promise<Mission | null> {
    return PRISMA.mission.findUnique({
      where:{
        id: id,
        userId: userId,
      },
      include:{
        activities: {
          include: {
            notes: true,
            skills: true
          }
        }
      }
    });
  }
  async createOne(creationData: MissionCreation): Promise<Mission>{
    return PRISMA.mission.create({
      data:{
        ...creationData,
      },
      include:{
        activities: {
          include: {
            notes: true,
            skills: true
          }
        }
      }
    })
  }
  async updateOne(
    userId: number,
    id: number,
    updateData: MissionUpdate,
  ): Promise<Mission>{
    return PRISMA.mission.update({
      where:{
        userId: userId,
        id: id,
      },
      data: {
        title: updateData.title? updateData.title: undefined,
        description: updateData.description? updateData.description : undefined,
        from: updateData.from ? new Date(updateData.from) : undefined,
        to: updateData.to ? new Date(updateData.to) : undefined,
      },
      include:{
        activities: {
          include: {
            notes: true,
            skills: true
          }
        }
      }
    });
  }
  async deleteOne(
    userId: number,
    id: number,
  ): Promise<APIResponse>{
      await PRISMA.mission.delete({
      where:{
        userId: userId,
        id:id,
      }
    });
    return API.SUCCESS;
  }
}
