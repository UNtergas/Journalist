import { ApiProperty , ApiBody } from '@nestjs/swagger';
import { Mission, MissionDetailed } from './mission.dto';
import { Activity, ActivityDetailed } from './activity.dto';
import { Feedback } from './feedback.dto';
import { SkillValidation, SkillValidationDetailed } from './skillValidation.dto';

export const ROLE ={
  STUDENT: 'STUDENT',
  COMPANY: 'COMPANY',
  ADMIN: 'ADMIN',
  TUTOR: 'TUTOR',
} as const

export type Role = typeof ROLE[keyof typeof ROLE];

export class User {
  readonly id: number;
  name: string;
  email: string;
  password: string;
  role: Role;

  // mission_apprentice: Mission[];
  // mission_company: Mission[];

  // activities: Activity[];
  // feedbacks: Feedback[];
  // validatedCompetencies: SkillValidation[];
  // validatorCompetencies: SkillValidation[];

  // tutorId: number;
  // // apprentices: User[];
}

export class Apprentice extends User {
  tutorId: number;
  mission_apprentice: Mission[];
  activities: Activity[];
  validatedCompetencies: SkillValidation[];
}
export type ApprenticeSkillMap = User & {
  tutorId: number;
  activities: Activity[];
  validatedCompetencies: SkillValidationDetailed[];
}

export type ApprenticeUpdate = Partial<Omit<Apprentice, 'id' | 'mission_apprentice' | 'activities' | 'validatedCompetencies'| 'role'>>;

export type ApprenticeDetailed = Apprentice & {
  mission_apprenticeDetailed: MissionDetailed[];
}

export class Company extends User {
  mission_company: Mission[];
  feedbacks: Feedback[];
}

export class Tutor extends User {
  apprentices: Apprentice[];
  validatorCompetencies: SkillValidation[];
  feedbacks: Feedback[];
}

export type TutorDetailed = Tutor & {
  apprenticesDetailed: ApprenticeDetailed[];
}


