import { SecurityScope } from "#/auth/auth.scope";
import { MissionService } from "#/mission/mission.service";
import {
  BadRequestException,
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
} from "@nestjs/common";
import { CompanyService } from "./company.service";
import { CurrentUserID } from "#/auth/decorators/current-user.decorator";
import { Mission, MissionCreateRequest, ResponseObject } from "@shared/backend";
import { Permissions } from "#/auth/decorators/permissions.decorator";
import { ApprenticeService } from "#/apprentice/apprentice.service";
import { ActivityService } from "#/activity/activity.service";

@Controller("api/company")
export class CompanyController {
  constructor(
    private missionService: MissionService,
    private companyService: CompanyService,
    private apprenticeService: ApprenticeService,
    private activityService: ActivityService,
  ) {}

  // @HttpCode(HttpStatus.OK)
  // @Get("missions")
  // @Permissions(SecurityScope.MISSION_READ)
  // async getMissions(
  //   @CurrentUserID() userId: number,
  // ): Promise<ResponseObject<"missions", Mission[]>> {
  //   const missions = (await this.missionService.findAll()).filter(
  //     (mission) => mission.companyId === userId,
  //   );
  //   // const activities = await this.activityService.findAll();

  //   // // Step 3: Map missions and attach their corresponding activities
  //   // const missionsWithActivities: MissionGETResponse = missions.map(
  //   //   (mission) => ({
  //   //     ...mission,
  //   //     activities: activities.filter(
  //   //       (activity) => activity.apprenticeId === mission.apprenticeId,
  //   //     ),
  //   //   }),
  //   // );
  //   return { missions: missions };
  // }

  @HttpCode(HttpStatus.CREATED)
  @Post("mission")
  @Permissions(SecurityScope.MISSION_WRITE)
  async createMission(
    @CurrentUserID() userId: number,
    @Body() body: MissionCreateRequest,
  ): Promise<ResponseObject<"mission", Mission>> {
    if (body.apprenticeEmail === null) {
      throw new BadRequestException("ApprenticeId is required");
    }
    const apprentice = await this.apprenticeService.findOneByEmail(
      body.apprenticeEmail,
    );
    if (apprentice === null) {
      throw new BadRequestException("Apprentice not found");
    }
    const mission = await this.missionService.createOne({
      title: body.title,
      description: body.description,
      semester: body.semester,
      companyId: userId,
      apprenticeId: apprentice.id,
    });

    return { mission };
  }
}
