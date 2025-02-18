import { Module } from "@nestjs/common";
import { UserController } from "#/user/User.controller";
import { UserRepository } from "#/user/User.repository";
import { AuthService } from "#/auth/auth.service";
import { UserSeedService } from "./user.seed";

@Module({
  controllers: [UserController],
  providers: [UserRepository, AuthService, UserSeedService],
  exports: [UserRepository],
})
export class UserModule {}
