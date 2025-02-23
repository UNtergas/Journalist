import { Module } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { AuthController } from "./auth.controller";
import { JwtModule } from "@nestjs/jwt";
import { CONFIG } from "#/env.config";
import { MailService } from "#/mail/mail.service";
import { MailModule } from "#/mail/mail.module";
import { UserModule } from "#/user/user.module";

@Module({
  imports: [
    JwtModule.register({
      global: true,
      secret: CONFIG.JWT_SECRET,
      signOptions: { expiresIn: CONFIG.JWT_EXPIRE },
    }),
    MailModule,
    UserModule,
  ],
  providers: [AuthService, MailService],
  controllers: [AuthController],
})
export class AuthModule {}
