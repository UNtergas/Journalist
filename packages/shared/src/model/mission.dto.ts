import { Activity, ActivityDetailed } from "./activity.dto";
import { SkillOnMission } from "./skillOnMission.dto";

export class Mission {
    readonly id : number;
    title : string;
    description : string;
    semester : string;
    apprenticeId : number;
    companyId : number;
    skills : SkillOnMission[];
    activities: Activity[];
}
export type MissionDetailed = Mission & {
    activitiesDetailed: ActivityDetailed[];
}
export type MissionCreate = Omit<Mission, 'id'|'skills'|'activities'>;

export type MissionCreateRequest = Omit<Mission, 'id' | 'skills' | 'apprenticeId'|'companyId'|'activities'> & {
    apprenticeEmail: string;
};

// export type MissonWithActivities = Mission & {
//     activities: Activity[];
// }

// export type MissionGETResponse = MissonWithActivities[];
