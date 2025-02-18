import { UserRepository } from "#/user/User.repository";
import {
  Body,
  Controller,
  Get,
  Post,
  HttpCode,
  HttpStatus,
  ConflictException,
} from "@nestjs/common";
import { Permissions } from "#/auth/decorators/permissions.decorator";
import { SecurityScope } from "#/auth/auth.scope";
import { RegisterDTO, ResponseObject, ROLE, User } from "@shared/backend";
import { ApiBody } from "@nestjs/swagger";
import { CurrentUserID } from "#/auth/decorators/current-user.decorator";
import { AuthService } from "#/auth/auth.service";

@Controller("api/user")
export class UserController {
  constructor(
    private userRepository: UserRepository,
    private authService: AuthService,
  ) {}

  @HttpCode(HttpStatus.OK)
  @Get("me")
  @Permissions(SecurityScope.USER_CURRENT_READ)
  @ApiBody({ type: User })
  async getMe(
    @CurrentUserID() userId: number,
  ): Promise<ResponseObject<"user", User>> {
    const user = await this.userRepository.findOneById(userId);
    return { user };
  }

  @HttpCode(HttpStatus.OK)
  @Post("reset-password")
  @Permissions(SecurityScope.USER_CURRENT_WRITE)
  async resetPassword(
    @CurrentUserID() userId: number,
    @Body() body: { oldPassword: string; newPassword: string },
  ): Promise<ResponseObject<"user", User>> {
    const oldUser = await this.userRepository.findOneById(userId);
    if (
      // eslint-disable-next-line prettier/prettier
      this.authService.verifyPassword(body.oldPassword, oldUser.password) === false
    ) {
      throw new ConflictException("Old Password is incorrect");
    }
    const newPassword = this.authService.generatePasswordHashed(
      body.newPassword,
    );
    const user = await this.userRepository.updateOne(userId, {
      password: newPassword,
    });
    return { user };
  }

  ////////////////
  // Admin routes
  @HttpCode(HttpStatus.OK)
  @Get("all")
  @Permissions(SecurityScope.USER_READ)
  @ApiBody({ type: User })
  async getAll(): Promise<
    ResponseObject<"users", User[]> & ResponseObject<"usersCount", number>
  > {
    const users = await this.userRepository.findAll();
    const usersCount = await this.userRepository.count();
    return { users, usersCount };
  }

  @HttpCode(HttpStatus.CREATED)
  @Post("/company")
  @Permissions(SecurityScope.USER_WRITE)
  async createCompany(
    @Body() body: RegisterDTO,
  ): Promise<ResponseObject<"company", User>> {
    const existingCompany = await this.userRepository.findOneByEmail(
      body.email,
    );
    if (existingCompany) {
      throw new ConflictException("User already exists");
    }
    const password = this.authService.generatePasswordHashed(body.password);
    const company = await this.userRepository.createOne({
      ...body,
      password,
    });
    const updatedCompany = await this.userRepository.updateOne(company.id, {
      role: ROLE.COMPANY,
    });
    return { company: updatedCompany };
  }

  @HttpCode(HttpStatus.CREATED)
  @Post("/tutor")
  @Permissions(SecurityScope.USER_WRITE)
  async createTutor(
    @Body() body: RegisterDTO,
  ): Promise<ResponseObject<"tutor", User>> {
    const existingTutor = await this.userRepository.findOneByEmail(body.email);
    if (existingTutor) {
      throw new ConflictException("User already exists");
    }
    const password = this.authService.generatePasswordHashed(body.password);
    const tutor = await this.userRepository.createOne({
      ...body,
      password,
    });
    const updatedTutor = await this.userRepository.updateOne(tutor.id, {
      role: ROLE.TUTOR,
    });
    return { tutor: updatedTutor };
  }
}
