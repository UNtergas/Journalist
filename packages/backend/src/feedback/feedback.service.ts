import PRISMA from "../../prisma";
import { Injectable } from "@nestjs/common";
import { Feedback, FeedbackCreate } from "@shared/backend";

@Injectable()
export class FeedbackService {
  async count(): Promise<number> {
    return PRISMA.feedback.count();
  }

  async findAll(): Promise<Feedback[]> {
    return PRISMA.feedback.findMany();
  }

  async findOneById(id: number): Promise<Feedback> {
    return PRISMA.feedback.findUnique({
      where: {
        id: id,
      },
    });
  }

  async createOne(feedbackCreationData: FeedbackCreate): Promise<Feedback> {
    return PRISMA.feedback.create({
      data: {
        ...feedbackCreationData,
      },
    });
  }
}
