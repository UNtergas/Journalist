import { z } from "zod";

export class Note {
    readonly id : number;
    content : string;
    activityId : number;
}

export const noteCreationSchema = z.object({
    content: z.string()
})
.required();

export type NoteCreation = z.infer< typeof noteCreationSchema>

// export type NoteCreate = Omit<Note, 'id'|'createdAt'>;
// export type NoteCreateRequest = Omit<NoteCreate, 'senderId'>;