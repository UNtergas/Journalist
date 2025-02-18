import {
  Controller,
  HttpCode,
  Post,
  HttpStatus,
  Body,
  Res,
  Req,
  UnauthorizedException,
} from "@nestjs/common";
import { AuthService } from "./auth.service";
import {
  User,
  ResponseObject,
  SignInResponse,
  RegisterDTO,
  SignInDTO,
} from "@shared/backend";
import { Request } from "express";
import { ApiBody } from "@nestjs/swagger";
import { Response } from "express";
import { CONFIG } from "#/env.config";
import { JwtService } from "@nestjs/jwt";

@Controller("api/auth")
export class AuthController {
  constructor(
    private authService: AuthService,
    private jwtService: JwtService,
  ) {}

  @HttpCode(HttpStatus.OK)
  @Post("login")
  @ApiBody({ type: SignInDTO })
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
  @ApiBody({ type: RegisterDTO })
  async signUp(
    @Body() body: RegisterDTO,
  ): Promise<ResponseObject<"signUp", User>> {
    const signUp = await this.authService.signUp(body);
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
