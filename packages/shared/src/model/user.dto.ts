import { Mission } from './mission.dto';

export const ROLE ={
  USER: 'USER',
} as const

export type Role = typeof ROLE[keyof typeof ROLE];

export class User {
  readonly id: number;
  name: string;
  email: string;
  password: string;
  company: string;
  school:  string;
  specialty: string;
  role : Role;

  missions: Mission[]  
}

export type Profile = Omit<User, 'password'>;


