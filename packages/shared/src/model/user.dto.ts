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
  verified: boolean;
  role : Role;
  
  // We don't need this field for user profile manipulation
  // missions: Mission[]  
}

export type Profile = Omit<User, 'password'>;


