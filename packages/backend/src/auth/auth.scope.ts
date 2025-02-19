import { Role, ROLE } from "@shared/backend";

export enum SecurityScope {
  USER_CURRENT_READ = "user:current.read",
  USER_CURRENT_WRITE = "user:current.write",
  TOKEN_CURRENT = "token:current",
  MISSION_READ = "mission.read",
  MISSION_WRITE = "mission.write",
  ACTIVITY_READ = "activity.read",
  ACTIVITY_WRITE = "activity.write",
  NOTE_READ = "note.read",
  NOTE_WRITE = "note.write",
}

export const USER_SCOPES: Set<SecurityScope> = new Set<SecurityScope>([
  SecurityScope.USER_CURRENT_READ,
  SecurityScope.USER_CURRENT_WRITE,
  SecurityScope.TOKEN_CURRENT,
  SecurityScope.MISSION_READ,
  SecurityScope.MISSION_WRITE,
  SecurityScope.ACTIVITY_READ,
  SecurityScope.ACTIVITY_WRITE,
  SecurityScope.NOTE_READ,
  SecurityScope.NOTE_WRITE,
]);



export function getScopesBasedOnUserRole(userRole: Role): Set<SecurityScope> {
  if (userRole === ROLE.USER) {
    return USER_SCOPES;
  } 
  return new Set<SecurityScope>();
}
