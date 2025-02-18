import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { AuthModule } from "./auth/auth.module";
import { PermissionGuard } from "./guard/permission.guard";
import { ApprenticeController } from "./apprentice/apprentice.controller";
import { ApprenticeService } from "./apprentice/apprentice.service";
import { ApprenticeModule } from "./apprentice/apprentice.module";
import { MissionService } from "./mission/mission.service";
import { ActivityService } from "./activity/activity.service";
import { ActivityModule } from "./activity/activity.module";
import { FeedbackService } from "./feedback/feedback.service";
import { SkillService } from "./skill/skill.service";
import { CompanyController } from "./company/company.controller";
import { CompanyService } from "./company/company.service";
import { CompanyModule } from "./company/company.module";
import { SkillValidationService } from "./skill/skill-validation.service";

@Module({
  imports: [AuthModule, ApprenticeModule, ActivityModule, CompanyModule],
  controllers: [AppController, ApprenticeController, CompanyController],
  providers: [
    AppService,
    { provide: "APP_GUARD", useClass: PermissionGuard },
    ApprenticeService,
    MissionService,
    ActivityService,
    FeedbackService,
    SkillService,
    CompanyService,
    SkillValidationService,
  ],
})
export class AppModule {}
