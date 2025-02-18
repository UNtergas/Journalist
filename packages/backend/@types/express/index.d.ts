import { User } from "@shared/backend";

declare global {
  namespace Express {
    interface Request {
      securityContext?: {
        user: User;
      };
      cookies: string;
    }
  }
}
