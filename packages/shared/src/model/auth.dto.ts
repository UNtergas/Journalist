import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export interface SignInResponse {
  token: string;
  email: string;
  id: number;
}


export class SignInDTO {

  @IsEmail()
  email: string;

  @IsString()
  @IsNotEmpty()
  password: string;
}

export class RegisterDTO extends SignInDTO {
  @IsString()
  @IsNotEmpty()
  name: string;
}
