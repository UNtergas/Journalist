import { SkillOnActivity } from "./skillOnActivity.dto";
import { SkillOnMission } from "./skillOnMission.dto";
import { SkillValidation } from "./skillValidation.dto";

export const SKILLTYPE = {
  ANALYTICAL: 'ANALYTICAL',
  PLANNING: 'PLANNING',
  ADHESION: 'ADHESION',
  RESOURCE_MANAGEMENT: 'RESOURCE_MANAGEMENT',
  INFOMATION_PROCESSING: 'INFOMATION_PROCESSING',
  RISK_MANAGEMENT: 'RISK_MANAGEMENT',
  OPERATION_IMPLEMENTATION: 'OPERATION_IMPLEMENTATION',
  CONTROL: 'CONTROL',
  CORRECTION: 'CORRECTION',
  MONITORING: 'MONITORING'
} as const
export const LEVEL = {
  BASIC: 'BASIC',
  INTERMEDIATE: 'INTERMEDIATE',
  ADVANCED: 'ADVANCED',
  EXPERT: 'EXPERT'
} as const

export type SkillType = typeof SKILLTYPE[keyof typeof SKILLTYPE];
export type Level = typeof LEVEL[keyof typeof LEVEL];

export class Skill {
    readonly id : number;
    type: SkillType;
    level : Level;
    description: string;
    activities: SkillOnActivity[];
    missions: SkillOnMission[];
    validation?: SkillValidation;
}

export type SkillValidationMap = {
    skillType: SkillType;
    validatedLevel: Level;
}
export type SkillCreate = Pick<Skill, 'level'|'type'|'description'>;