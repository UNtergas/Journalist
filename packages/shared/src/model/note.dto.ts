export class Note {
    readonly id : number;
    content : string;
    activityId : number;
}

export type NoteCreate = Omit<Note, 'id'|'createdAt'>;
export type NoteCreateRequest = Omit<NoteCreate, 'senderId'>;