import { Note } from "./note.dto";
import { Skill, type Level, type SkillType } from "./skill.dto";
import { SkillOnActivity } from "./skillOnActivity.dto";

export class Activity{
    readonly id : number;
    title : string;
    description : string;
    date  : Date;
    missionId : number;
    skills : SkillOnActivity[];
    notes : Note[];
}
export type ActivityDetailed = Activity & {
    skillsDetailed : Skill[];
};

export type ActivityCreate = Omit<Activity, 'id'|'skills'|'notes'|'date'>;

