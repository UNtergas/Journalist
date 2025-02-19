import { Activity, ActivityDetailed } from "./activity.dto";

export class Mission {
    readonly id : number;
    title : string;
    description : string;
    from : Date;
    to : Date;
    userId : number;
    activities: Activity[];
}
export type MissionDetailed = Mission & {
    activitiesDetailed: ActivityDetailed[];
}
export type MissionCreate = Omit<Mission, 'id'|'skills'|'activities'>;


