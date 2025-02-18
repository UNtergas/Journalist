import { Module } from "@nestjs/common";
import { PermissionGuard } from "./permission.guard";
import { JwtService } from "@nestjs/jwt";
import { Reflector } from "@nestjs/core";

@Module({
  providers: [PermissionGuard, Reflector, JwtService],
  exports: [PermissionGuard],
})
export class PermissionModule {}
