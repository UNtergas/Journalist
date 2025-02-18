import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { JwtService } from "@nestjs/jwt";
import { PERMISSIONS_KEY } from "#/auth/decorators/permissions.decorator";
import { getScopesBasedOnUserRole, SecurityScope } from "#/auth/auth.scope";

@Injectable()
export class PermissionGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private jwtService: JwtService,
  ) {}

  canActivate(context: ExecutionContext): boolean {
    const permissions = this.reflector.get<SecurityScope[]>(
      PERMISSIONS_KEY,
      context.getHandler(),
    );
    if (!permissions) {
      return true;
    }
    const request = context.switchToHttp().getRequest();
    const token = request.cookies["jwt"];
    if (!token) {
      throw new UnauthorizedException("No token provided");
    }
    try {
      const payload = this.jwtService.verify(token);
      request.securityContext = {
        user: { id: payload.sub, email: payload.email, role: payload.role },
      };
      const scopes = getScopesBasedOnUserRole(payload.role);
      const hasPermission = permissions.every((permission) =>
        scopes.has(permission),
      );
      if (!hasPermission) {
        throw new ForbiddenException("Insufficient permissions");
      }
      return true;
    } catch (error) {
      if (error instanceof ForbiddenException) {
        throw error;
      }
      throw new UnauthorizedException("Invalid or expired token");
    }
  }
}
