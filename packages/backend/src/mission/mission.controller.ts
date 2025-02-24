import { SecurityScope } from '#/auth/auth.scope';
import { CurrentUserId } from '#/auth/decorators/current-user.decorator';
import { Permissions } from '#/auth/decorators/permissions.decorator';
import { UserService } from '#/user/user.service';
import { Body, Controller, Delete, Get, HttpCode, HttpStatus, NotFoundException, Param, Post, Put, UsePipes } from '@nestjs/common';
import { Mission, MissionCreation, missionCreationSchema, MissionUpdate, missionUpdateSchema, ResponseObject } from '@shared/backend';
import { MissionService } from './mission.service';
import { ZodValidationPipe } from '#/pipes/zod.validation';

@Controller('/api/mission')
export class MissionController {
  constructor(
    private userService: UserService,
    private missionService: MissionService,
  ){}

  @HttpCode(HttpStatus.OK)
  @Get('')
  @Permissions(SecurityScope.MISSION_READ)
  async getMissions(
    @CurrentUserId() userId: number
  ): Promise<ResponseObject<"missions",Mission[]>> {
    if(!userId){
      throw new NotFoundException("User not found");
    }
    const missions = await this.missionService.findAll(userId);
    return { missions }
  }

  @HttpCode(HttpStatus.OK)
  @Get(':missionId')
  @Permissions(SecurityScope.MISSION_READ)
  async getMissionById(
    @Param("missionId") id: number,
    @CurrentUserId() userId: number
  ): Promise<ResponseObject<"mission",Mission>> {
    if(!userId){
      throw new NotFoundException("User not found");
    }
    const mission = await this.missionService.findOneById(userId,id);
    if(!mission){
      throw new NotFoundException("Mission not found")
    }
    return { mission }
  }

  @HttpCode(HttpStatus.CREATED)
  @Post('')
  @Permissions(SecurityScope.MISSION_WRITE)
  @UsePipes(new ZodValidationPipe(missionCreationSchema))
  async createMission(
    @CurrentUserId() userId: number,
    @Body() body: Omit<MissionCreation,"userId">,
  ): Promise<ResponseObject<"mission",Mission>>{
    if(!userId){
      throw new NotFoundException("User not found");
    }
    const mission = await this.missionService.createOne({
      ...body,
      userId: userId,
    });
    return { mission }
  }

  @HttpCode(HttpStatus.OK)
  @Put(':missionId')
  @Permissions(SecurityScope.MISSION_WRITE)
  @UsePipes(new ZodValidationPipe(missionUpdateSchema))
  async updateMissionById(
    @CurrentUserId() userId: number,
    @Param('missionId') id: number,
    @Body() body: MissionUpdate,
  ): Promise<ResponseObject<"mission",Mission>>{
    if(!userId){
      throw new NotFoundException("User not found");
    }
    const mission = await this.missionService.updateOne(userId,id,body);
    return { mission }
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete(':missionId')
  @Permissions(SecurityScope.MISSION_WRITE)
  async deleteMissionById(
    @CurrentUserId() userId: number,
    @Param('missionId') id: number,
  ){
    if(!userId){
      throw new NotFoundException("User not found");
    }
    await this.missionService.deleteOne(userId,id);
  }
}
