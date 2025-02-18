import { Module } from "@nestjs/common";
import { ApprenticeService } from "./apprentice.service";
import { ApprenticeController } from "./apprentice.controller";
import { MissionService } from "#/mission/mission.service";
import { SkillService } from "#/skill/skill.service";

@Module({
  providers: [ApprenticeService, MissionService, SkillService],
  controllers: [ApprenticeController],
  exports: [ApprenticeService],
})
export class ApprenticeModule {}
