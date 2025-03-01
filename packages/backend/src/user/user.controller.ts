import { Body, ConflictException, Controller, Get, HttpCode, HttpStatus, NotFoundException, Post, Query, UsePipes } from '@nestjs/common';
import { UserService  } from './user.service';
import { AuthService } from '#/auth/auth.service';
import { Permissions } from '#/auth/decorators/permissions.decorator';
import { SecurityScope } from '#/auth/auth.scope';
import { CurrentUserId } from '#/auth/decorators/current-user.decorator';
import { APIResponse, ResponseObject, User, API, resetPasswordSchema } from '@shared/backend';
import { ZodValidationPipe } from '#/pipes/zod.validation';
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
  @UsePipes(new ZodValidationPipe(resetPasswordSchema))
  async resetPassword(
    @Query("secret") secret: string,
    @Body() body:{password: string}
  ): Promise<ResponseObject<"Api", APIResponse>>{
    console.log(secret);
    const {encryptedText,iv,key} = this.authService.splitSecret(decodeURIComponent(secret));
    const userEmail = this.authService.inputDecryption(encryptedText,iv,key);
    const user = await this.userService.findOneByEmail(userEmail);
    if(!user){
      throw new NotFoundException("User not found")
    }
 
    const newPassword = this.authService.generateHashed(
      body.password,
    );
    await this.userService.updateOne(user.id, {
      password: newPassword,
    });
    return { Api: API.SUCCESS };
  }
}
