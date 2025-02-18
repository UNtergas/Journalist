import { SecurityScope } from "#/auth/auth.scope";
import { SetMetadata } from "@nestjs/common";

export const PERMISSIONS_KEY = "permissions";
export const Permissions = (...permissions: SecurityScope[]) =>
  SetMetadata(PERMISSIONS_KEY, permissions);
