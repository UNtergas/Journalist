import { Module } from "@nestjs/common";
import { CompanyController } from "./company.controller";
import { CompanyService } from "./company.service";
import { MissionService } from "#/mission/mission.service";
import { ActivityModule } from "#/activity/activity.module";
import { ApprenticeModule } from "#/apprentice/apprentice.module";

@Module({
  imports: [ActivityModule, ApprenticeModule],
  providers: [CompanyService, MissionService],
  controllers: [CompanyController],
})
export class CompanyModule {}
