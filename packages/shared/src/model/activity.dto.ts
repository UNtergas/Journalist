import { Note } from "./note.dto";
import { LEVEL, Skill, SKILLTYPE, type Level, type SkillType } from "./skill.dto";
import { SkillOnActivity } from "./skillOnActivity.dto";
import { flatEnumToList } from "../utils/flatEnumToList";
import { z } from 'zod';


export class Activity{
    readonly id : number;
    title : string;
    description : string;
    date  : Date;
    missionId : number;
    skills : SkillOnActivity[];
    notes : Note[];
}

export class ActivityDetailed extends Activity {
    skillsDetailed : Skill[];
};

export const activityCreationSchema = z.object({
    title: z.string(),
    description: z.string(),
    missionId: z.number(),
})
.required();

export const activityUpdateSchema = activityCreationSchema.extend({
    skillDescription: z.string(),
    skillLevel: z.enum(flatEnumToList(SKILLTYPE)),
    skillType: z.enum(flatEnumToList(LEVEL)),
})
.partial();

export type ActivityCreation = z.infer<typeof activityCreationSchema>
export type ActivityUpdate = z.infer<typeof activityUpdateSchema>

// export class ActivityCreation {
    
//     @IsString()
//     @IsNotEmpty()
//     @IsDefined()
//     title : string;

//     @IsString()
//     @IsNotEmpty()
//     @IsDefined()
//     description : string;

//     @IsInt()
//     @IsDefined()
//     missionId : number;
// }

// export class ActivityUpdate extends PartialType(ActivityCreation) {

//     @IsNotEmpty()
//     skillDescription?: string;

//     @IsEnum(LEVEL)
//     skillLevel?: Level;

//     @IsEnum(SKILLTYPE)
//     skillType?: SkillType;
// }
