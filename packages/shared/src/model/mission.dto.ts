import { Activity, ActivityDetailed } from "./activity.dto";
import { z } from 'zod';

export class Mission {
    readonly id : number;
    title : string;
    description : string;
    from : Date;
    to : Date;
    userId : number;
    activities: Activity[];
}
export class MissionDetailed extends Mission{
    activitiesDetailed: ActivityDetailed[];
}
// export type MissionCreate = Omit<Mission, 'id'|'activities'>;

export const missionCreationSchema = z.object({
    title: z.string(),
    description: z.string(),
    userId : z.number(),
})
.required();

export type MissionCreation = z.infer<typeof missionCreationSchema>
