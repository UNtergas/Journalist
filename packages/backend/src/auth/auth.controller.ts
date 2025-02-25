import {
  Controller,
  HttpCode,
  Post,
  HttpStatus,
  Body,
  Res,
  Req,
  UnauthorizedException,
  UsePipes,
  Get,
  NotFoundException,
  BadRequestException,
  Query,
} from "@nestjs/common";
import { AuthService } from "./auth.service";
import {
  User,
  ResponseObject,
  SignInResponse,
  SignInDTO,
  signInSchema,
  RegisterDTO,
  registerSchema,
  APIResponse,
  API,
} from "@shared/backend";
import { Request } from "express";
import { Response } from "express";
import { CONFIG } from "#/env.config";
import { JwtService } from "@nestjs/jwt";
import { ZodValidationPipe } from "#/pipes/zod.validation";
import { UserService } from "#/user/user.service";
import { MailService } from "#/mail/mail.service";
import { K } from "handlebars";


@Controller("api/auth")
export class AuthController {
  constructor(
    private authService: AuthService,
    private jwtService: JwtService,
    private userService : UserService,
    private mailService : MailService,
  ) {}

  @HttpCode(HttpStatus.OK)
  @Post("login")
  @UsePipes(new ZodValidationPipe(signInSchema))
  async signIn(
    @Body() body: SignInDTO,
    @Res({ passthrough: true }) res: Response,
  ): Promise<ResponseObject<"signIn", SignInResponse>> {
    

    const signIn = await this.authService.signIn(body);
    res.cookie("jwt", signIn.token, {
      httpOnly: true,
      maxAge: CONFIG.COOKIE_EXPIRE,
      sameSite: "strict",
    });
    return { signIn };
  }

  @HttpCode(HttpStatus.CREATED)
  @Post("register")
  @UsePipes(new ZodValidationPipe(registerSchema))
  async signUp(
    @Body() body: RegisterDTO,
  ): Promise<ResponseObject<"signUp", User>> {
    const signUp = await this.authService.signUp(body);
    await this.sendVerificationEmail(body.email);
    return { signUp };
  }

  @HttpCode(HttpStatus.OK)
  @Post("logout")
  async signOut(
    @Res({ passthrough: true }) res: Response,
  ): Promise<ResponseObject<"signOut", string>> {
    res.clearCookie("jwt");
    return { signOut: "Signout Successfully" };
  }

  @HttpCode(HttpStatus.OK)
  @Get("send-mail")
  async sendVerificationEmail(
    @Query('email') email:string 
  ): Promise<ResponseObject<"Api",APIResponse>>{
    const user = await this.userService.findOneByEmail(email);
    if (!user) {
      throw new NotFoundException("User not found");
    }
    if (user.verified) {
      throw new BadRequestException("User is already verified");
    }
    const {encryptedText,iv,key} = await this.authService.generateEncryption(user.email);
    const secret = this.authService.combineSecret(encryptedText,iv,key);
    await this.mailService.sendUserConfirmation(user,secret);
    return { Api: API.SUCCESS }
  }

  @HttpCode(HttpStatus.OK)
  @Get("send-mail-reset-password")
  async sendResetPasswordEmail(
    @Query('email') email: string
  ): Promise<ResponseObject<"secret",string>>{
    const user = await this.userService.findOneByEmail(email);
    if (!user) {
      throw new NotFoundException("User not found");
    }
    if (!user.verified) {
      throw new UnauthorizedException("This user is not yet verified");
    }
    const {encryptedText,iv,key} = await this.authService.generateEncryption(user.email)
    const secret = this.authService.combineSecret(encryptedText,iv,key);
    await this.mailService.sendResetPassword(user);
    return { secret };
  }

  @HttpCode(HttpStatus.OK)
  @Post("check-auth")
  async checkAuth(
    @Req() req: Request,
  ): Promise<ResponseObject<"checkAuth", boolean>> {
    const token = req.cookies["jwt"];
    if (!token) {
      return { checkAuth: false };
    }
    try {
      this.jwtService.verify(token);
      return { checkAuth: true };
    } catch {
      throw new UnauthorizedException("Invalid or expired token");
    }
  }
}
