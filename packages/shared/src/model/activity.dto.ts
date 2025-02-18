import { Feedback } from "./feedback.dto";
import { Skill, type Level, type SkillType } from "./skill.dto";
import { SkillOnActivity } from "./skillOnActivity.dto";


export const PHASE = {
    STUDY: 'STUDY',
    ACTION: 'ACTION',
    IMPROVEMENT: 'IMPROVEMENT'
} as const

export type Phase = typeof PHASE[keyof typeof PHASE];

export class Activity{
    readonly id : number;
    title : string;
    description : string;
    date  : Date;
    phase : Phase;
    apprenticeId : number;
    missionId : number;
    skills : SkillOnActivity[];
    feedbacks : Feedback[];
}
export type ActivityDetailed = Activity & {
    skillsDetailed : Skill[];
};

export type ActivityCreate = Omit<Activity, 'id'|'skills'|'feedbacks'|'date'>;

export type ActivityCreateRequest = Omit<Activity, 'id'|'skills'|'feedbacks'|'apprenticeId'|'date'>;

export type ActivityUpdateRequest = Partial<ActivityCreateRequest> & {
    skillDescription?: string;
    skillLevel?: Level;
    skillType?: SkillType;
};
