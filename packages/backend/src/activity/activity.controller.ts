import { FeedbackService } from "#/feedback/feedback.service";
import { SkillService } from "#/skill/skill.service";
import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Put,
} from "@nestjs/common";
import { ActivityService } from "./activity.service";
import { Permissions } from "#/auth/decorators/permissions.decorator";
import { SecurityScope } from "#/auth/auth.scope";
import {
  CurrentUserID,
  CurrentUserRole,
} from "#/auth/decorators/current-user.decorator";
import {
  Activity,
  ActivityCreate,
  ActivityCreateRequest,
  ActivityUpdateRequest,
  Feedback,
  FeedbackCreateRequest,
  FeedbackDetailed,
  Mission,
  MissionDetailed,
  ResponseObject,
  ROLE,
  SkillCreate,
  SkillValidation,
  SkillValidationCreate,
} from "@shared/backend";
import { MissionService } from "#/mission/mission.service";
import { UserRepository } from "#/user/User.repository";
import { SkillValidationService } from "#/skill/skill-validation.service";

@Controller("api/activity")
export class ActivityController {
  constructor(
    private activityService: ActivityService,
    private missionService: MissionService,
    private feedbackService: FeedbackService,
    private skillService: SkillService,
    private skillValidationService: SkillValidationService,
    private userReposiotry: UserRepository,
  ) {}
  /// GETS Endpoints

  @HttpCode(HttpStatus.OK)
  @Get("missions")
  @Permissions(SecurityScope.MISSION_READ)
  async getMissions(
    @CurrentUserID() userId: number,
    @CurrentUserRole() role: string,
  ): Promise<ResponseObject<"missions", MissionDetailed[]>> {
    let missions: Mission[] = [];
    if (role === ROLE.STUDENT) {
      missions = (await this.missionService.findAll()).filter(
        (mission) => mission.apprenticeId === userId,
      );
    } else if (role === ROLE.COMPANY) {
      missions = (await this.missionService.findAll()).filter(
        (mission) => mission.companyId === userId,
      );
    }
    const allSkills = await this.skillService.findAll();
    const missionsDetailed: MissionDetailed[] = missions.map(
      (mission: Mission) => ({
        ...mission,
        activitiesDetailed: mission.activities.map((activity: Activity) => ({
          ...activity,
          skillsDetailed: allSkills.filter((skill) =>
            activity.skills.some(
              (activitySkill) => activitySkill.skillId === skill.id,
            ),
          ),
        })),
      }),
    );
    return { missions: missionsDetailed };
  }

  @HttpCode(HttpStatus.OK)
  @Get("feedback/:activityId")
  @Permissions(SecurityScope.FEEDBACK_READ)
  async getFeedback(
    @Param("activityId") id: string,
  ): Promise<ResponseObject<"feedbacks", FeedbackDetailed[]>> {
    const activityId = parseInt(id);
    const feedbacks = (await this.feedbackService.findAll()).filter(
      (feedback: Feedback) => feedback.activityId === activityId,
    );
    const users = await this.userReposiotry.findAll();
    const userMap = new Map(
      users.map((user) => [user.id, { name: user.name, role: user.role }]),
    );
    const feedbacksDetailed: FeedbackDetailed[] = feedbacks.map(
      (feedback: Feedback) => ({
        ...feedback,
        senderName: userMap.get(feedback.senderId).name,
        senderRole: userMap.get(feedback.senderId).role,
      }),
    );
    return { feedbacks: feedbacksDetailed };
  }

  /// POSTS Endpoints

  @HttpCode(HttpStatus.CREATED)
  @Post("")
  @Permissions(SecurityScope.ACTIVITY_WRITE)
  async createActivity(
    @CurrentUserID() userId: number,
    @Body() body: ActivityCreateRequest,
  ): Promise<ResponseObject<"activity", Activity>> {
    const activity = await this.activityService.createOne({
      ...body,
      apprenticeId: userId,
    });
    return { activity };
  }

  @HttpCode(HttpStatus.OK)
  @Post("feedback")
  @Permissions(SecurityScope.FEEDBACK_WRITE)
  async createFeedback(
    @CurrentUserID() userId: number,
    @Body() body: FeedbackCreateRequest,
  ): Promise<ResponseObject<"feedback", Feedback>> {
    const feedback = await this.feedbackService.createOne({
      ...body,
      senderId: userId,
    });
    return { feedback };
  }

  @HttpCode(HttpStatus.CREATED)
  @Post("validation")
  @Permissions(SecurityScope.VALIDATION_WRITE)
  async createValidation(
    @CurrentUserID() userId: number,
    @Body() body: SkillValidationCreate,
  ): Promise<ResponseObject<"validation", SkillValidation>> {
    const validation = await this.skillValidationService.createOne(
      userId,
      body,
    );
    return { validation };
  }

  /// PUTS Endpoints
  @HttpCode(HttpStatus.OK)
  @Put(":id")
  @Permissions(SecurityScope.ACTIVITY_WRITE)
  async updateActivity(
    @Body() body: ActivityUpdateRequest,
    @Param("id") id: string,
  ): Promise<ResponseObject<"activity", Activity>> {
    const activity: Partial<ActivityCreate> = {
      title: body.title,
      description: body.description,
      phase: body.phase,
      missionId: body.missionId,
    };
    let skill: SkillCreate | undefined;
    if (body.skillDescription && body.skillLevel && body.skillType) {
      skill = {
        description: body.skillDescription,
        level: body.skillLevel,
        type: body.skillType,
      };
    }
    const updatedActivity = await this.activityService.updateOne(
      parseInt(id),
      activity,
      skill,
    );
    return { activity: updatedActivity };
  }
}
