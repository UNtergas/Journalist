import { registerSchema } from "@shared/frontend";
import { z } from 'zod'

export const confirmedRegisterSchema = registerSchema.extend({
  confirmPassword: z.string()
}).superRefine(({ confirmPassword, password },ctx)=>{
  if(confirmPassword !== password){
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "The password did not match",
      path: ['confirmPassword']
    })
  }
})

export type ConfirmedRegisterDTO = z.infer<typeof confirmedRegisterSchema>