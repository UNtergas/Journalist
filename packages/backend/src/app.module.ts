import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { AuthModule } from "./auth/auth.module";
import { PermissionGuard } from "./guard/permission.guard";
import { UserModule } from './user/user.module';
import { MailModule } from './mail/mail.module';
import { MissionController } from './mission/mission.controller';
import { MissionService } from './mission/mission.service';
import { MissionModule } from './mission/mission.module';


@Module({
  imports: [AuthModule, UserModule, MailModule, MissionModule],
  controllers: [AppController, MissionController],
  providers: [
    AppService,
    { provide: "APP_GUARD", useClass: PermissionGuard },
    MissionService,
  ],
})
export class AppModule {}
