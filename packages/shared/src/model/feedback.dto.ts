import { Role } from "./user.dto";

export class Feedback {
    readonly id : number;
    content : string;
    createdAt: Date;
    senderId : number;
    activityId : number;
}
export type FeedbackDetailed = Feedback & {
    senderName: string;
    senderRole: Role;
};
export type FeedbackCreate = Omit<Feedback, 'id'|'createdAt'>;
export type FeedbackCreateRequest = Omit<FeedbackCreate, 'senderId'>;