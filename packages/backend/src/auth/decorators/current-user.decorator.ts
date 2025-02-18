import {
  createParamDecorator,
  ExecutionContext,
  UnauthorizedException,
} from "@nestjs/common";

export const CurrentUserID = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    if (!request.securityContext) {
      throw new UnauthorizedException("Context is not set");
    }
    return request.securityContext.user.id;
  },
);

export const CurrentUserRole = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    if (!request.securityContext) {
      throw new UnauthorizedException("Context is not set");
    }
    return request.securityContext.user.role;
  },
);
