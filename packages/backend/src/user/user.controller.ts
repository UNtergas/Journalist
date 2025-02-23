import { Body, ConflictException, Controller, Get, HttpCode, HttpStatus, NotFoundException, Post, Query } from '@nestjs/common';
import { UserService  } from './user.service';
import { AuthService } from '#/auth/auth.service';
import { Permissions } from '#/auth/decorators/permissions.decorator';
import { SecurityScope } from '#/auth/auth.scope';
import { CurrentUserId } from '#/auth/decorators/current-user.decorator';
import { APIResponse, ResponseObject, User, API } from '@shared/backend';
@Controller('/api/user')
export class UserController {
  constructor(
    private userSerivce: UserService,
    private authService: AuthService,
  ) {}

  @HttpCode(HttpStatus.OK)
  @Get('current')
  @Permissions(SecurityScope.USER_CURRENT_READ)
  async getCurrentUser(
    @CurrentUserId() userId: number
  ): Promise< ResponseObject<"user", User>> {
    const user = await this.userSerivce.findOneById(userId)
    if(!user){
      throw new NotFoundException("User not found");
    }
    return { user };
  }

  @HttpCode(HttpStatus.OK)
  @Get('verified')
  async verifyUser(
    @Query("secret") secret: string,
  ): Promise<ResponseObject<"Api",APIResponse>>{
    const {encryptedText,iv,key} = this.authService.splitSecret(decodeURIComponent(secret));
    const userEmail = this.authService.inputDecryption(encryptedText,iv,key);
    const user = await this.userSerivce.findOneByEmail(userEmail);
    if(!user){
      throw new NotFoundException("User not found")
    }
    await this.userSerivce.updateOne(user.id,
      {
        verified:true
      }
    );
    return { Api: API.SUCCESS };
  }

  @HttpCode(HttpStatus.OK)
  @Post("reset-password")
  @Permissions(SecurityScope.USER_CURRENT_WRITE)
  async resetPassword(
    @CurrentUserId() userId: number,
    @Body() body:{ oldPassword: string; newPassword: string}
  ): Promise<ResponseObject<"Api", APIResponse>>{
    const oldUser = await this.userSerivce.findOneById(userId);
    if(!oldUser){
      throw new NotFoundException("User not found");
    }
    if (
      this.authService.verifyHashed(body.oldPassword, oldUser.password) === false
    ) {
      throw new ConflictException("Old Password is incorrect");
    }
    const newPassword = this.authService.generateHashed(
      body.newPassword,
    );
    await this.userSerivce.updateOne(userId, {
      password: newPassword,
    });
    return { Api: API.SUCCESS };
  }
}
