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
    private userService: UserService,
    private authService: AuthService,
  ) {}

  @HttpCode(HttpStatus.OK)
  @Get('current')
  @Permissions(SecurityScope.USER_CURRENT_READ)
  async getCurrentUser(
    @CurrentUserId() userId: number
  ): Promise< ResponseObject<"user", User>> {
    const user = await this.userService.findOneById(userId)
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
    const user = await this.userService.findOneByEmail(userEmail);
    if(!user){
      throw new NotFoundException("User not found")
    }
    await this.userService.updateOne(user.id,
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
    @Body() body:{ secret: string; newPassword: string}
  ): Promise<ResponseObject<"Api", APIResponse>>{
    if(!userId){
      throw new NotFoundException("User not found");
    }
    const {encryptedText,iv,key} = this.authService.splitSecret(body.secret);
    const userEmail = this.authService.inputDecryption(encryptedText,iv,key);
    const user = await this.userService.findOneByEmail(userEmail);
    if(!user){
      throw new NotFoundException("User not found")
    }
    if (
      userId !== user.id
    ) {
      throw new ConflictException("The origin of the request is not correct");
    }
    const newPassword = this.authService.generateHashed(
      body.newPassword,
    );
    await this.userService.updateOne(userId, {
      password: newPassword,
    });
    return { Api: API.SUCCESS };
  }
}
