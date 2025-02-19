import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { AuthModule } from "./auth/auth.module";
import { PermissionGuard } from "./guard/permission.guard";


@Module({
  imports: [AuthModule],
  controllers: [AppController],
  providers: [
    AppService,
    { provide: "APP_GUARD", useClass: PermissionGuard },
  ],
})
export class AppModule {}
