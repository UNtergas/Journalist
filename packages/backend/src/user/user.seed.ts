import { Injectable, OnModuleInit } from "@nestjs/common";
import { UserRepository } from "./User.repository";
import { AuthService } from "#/auth/auth.service";
import { ROLE } from "@shared/backend";

@Injectable()
export class UserSeedService implements OnModuleInit {
  constructor(
    private userReposity: UserRepository,
    private authService: AuthService,
  ) {}
  async onModuleInit() {
    const data = {
      name: "admin",
      email: "admin@insa.fr",
      password: "admin",
    };
    const admin = await this.userReposity.findOneByEmail(data.email);
    if (!admin) {
      const hashedPassword = this.authService.generatePasswordHashed(
        data.password,
      );
      const newAdmin = await this.userReposity.createOne({
        ...data,
        password: hashedPassword,
      });
      await this.userReposity.updateOne(newAdmin.id, {
        role: ROLE.ADMIN,
      });
      console.log("Admin created");
    }
  }
}
