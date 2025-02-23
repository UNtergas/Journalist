import PRISMA from '../../prisma';
import { Injectable } from '@nestjs/common';
import { RegisterDTO, ROLE, User } from '@shared/backend';

@Injectable()
export class UserService {
  async count(): Promise<number> {
    return PRISMA.user.count();
  }

  async findAll(): Promise<User[]> {
    return PRISMA.user.findMany();
  }
  async findOneByEmail(email: string): Promise<User|null> {
    return PRISMA.user.findUnique({
      where: {
        email: email,
      },
    });
  }
  async findOneById(id: number): Promise<User|null> {
    return PRISMA.user.findUnique({
      where: {
        id: id,
      },
    });
  }
  async createOne(CreateData: RegisterDTO): Promise<User> {
    return PRISMA.user.create({
      data: {
        ...CreateData,
        company: "default",
        school: "default",
        specialty: "default",
        verified: false,
        role: ROLE.USER,
      },
    });
  }

  async updateOne(
    id: number,
    UpdateData: Partial<Omit<User, "id">>,
  ): Promise<User> {
    return PRISMA.user.update({
      where: {
        id: id,
      },
      data: UpdateData,
    });
  }
}
