import { z } from 'zod';

export class SignInResponse {
  token: string;
  email: string;
  id: number;
}

export const signInSchema = z.object({
  email: z.string().email('Invalid email format'),
  password: z.string().min(8, 'Password must be of length > 8'),
})
  .required();

export const registerSchema = signInSchema.extend({
  name: z.string(),
})
  .required();

export const sendForgetPasswordSchema = z.object({
  email: z.string().email('Invalid email format')
})
export type SignInDTO = z.infer<typeof signInSchema>
export type RegisterDTO = z.infer<typeof registerSchema>
export type SendForgetPasswordDTO = z.infer<typeof sendForgetPasswordSchema>
