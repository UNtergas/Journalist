import { z } from "zod";
import { SkillOnActivity } from "./skillOnActivity.dto";
import { flatEnumToList } from "../utils/flatEnumToList";

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
}

export const skillCreationSchema = z.object({
  level: z.enum(flatEnumToList(LEVEL)),
  type: z.enum(flatEnumToList(SKILLTYPE)),
  description: z.string()
})
.required();

export type SkillCreation = z.infer<typeof skillCreationSchema>

// export type SkillCreate = Pick<Skill, 'level'|'type'|'description'>;