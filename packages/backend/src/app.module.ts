import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { AuthModule } from "./auth/auth.module";
import { PermissionGuard } from "./guard/permission.guard";
import { UserModule } from './user/user.module';
import { MailModule } from './mail/mail.module';


@Module({
  imports: [AuthModule, UserModule, MailModule],
  controllers: [AppController],
  providers: [
    AppService,
    { provide: "APP_GUARD", useClass: PermissionGuard },
  ],
})
export class AppModule {}
