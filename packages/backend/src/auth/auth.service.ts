import {
  Injectable,
  UnauthorizedException,
  ConflictException,
  BadRequestException,
} from "@nestjs/common";
import { UserService } from "#/user/user.service";
import { JwtService } from "@nestjs/jwt";
import { User } from "@shared/backend";
import { SignInDTO, SignInResponse, RegisterDTO } from "@shared/backend";
import * as bcrypt from "bcryptjs";
import { createCipheriv, createDecipheriv, randomBytes, scrypt } from 'crypto';
import { promisify } from 'util';
import { CONFIG } from "#/env.config";

@Injectable()
export class AuthService {
  constructor(
    private userRepo: UserService,
    private jwtService: JwtService,
  ) {}

  async signUp(data: RegisterDTO): Promise<User> {
    const user = await this.userRepo.findOneByEmail(data.email);
    if (user) {
      throw new ConflictException("User already exists");
    }
    if (!data.password) {
      throw new UnauthorizedException("Password is required");
    }
    const password = this.generateHashed(data.password);
    data = { ...data, password };
    return await this.userRepo.createOne(data);
  }

  async signIn(data: SignInDTO): Promise<SignInResponse> {
    const user = await this.userRepo.findOneByEmail(data.email);
    if (!user) {
      throw new UnauthorizedException("User not found");
    }

    if (!user.verified) {
      throw new UnauthorizedException("User is not verified");
    }
    if (this.verifyHashed(data.password, user.password) === false) {
      throw new UnauthorizedException("Password is incorrect");
    }

    const payload = { email: user.email, sub: user.id, role: user.role };
    const token = this.jwtService.sign(payload);
    return {
      token: token,
      email: user.email,
      id: user.id,
    };
  }
  generateHashed(input: string): string {
    return bcrypt.hashSync(input, bcrypt.genSaltSync());
  }
  verifyHashed(input: string, hashedData: string): boolean {
    return bcrypt.compareSync(input, hashedData);
  }
  async generateEncryption(input: string){
    //Initial Vector
    const iv = randomBytes(16);
    //Secret used to generate key
    const secret = CONFIG.ENC_SECRET;

    // The key length is dependent on the algorithm.
    // In this case for aes256, it is 32 bytes.
    const key = (await promisify(scrypt)(secret, 'salt', 32)) as Buffer;
    const cipher = createCipheriv('aes-256-ctr', key, iv);

    const encryptedText = Buffer.concat([
      cipher.update(input),
      cipher.final(),
    ]);
    return {
      encryptedText,
      iv,
      key,
    };
  }
  inputDecryption(input: Buffer, iv:Buffer, key: Buffer){
    const decipher = createDecipheriv('aes-256-ctr', key, iv);
    const decryptedText = Buffer.concat([
      decipher.update(input),
      decipher.final(),
    ]);
    return decryptedText.toString('utf-8')
  }

  combineSecret(encryptedText: Buffer, iv: Buffer, key: Buffer) {
    // Convert all parts to Base64 strings and join them with a delimiter
    return [
      encryptedText.toString('base64'),
      iv.toString('base64'),
      key.toString('base64'),
    ].join('-');
  }
  
  splitSecret(secret: string) {
    const parts = secret.split('-');
    if (parts.length !== 3) {
      throw new BadRequestException('Invalid secret format');
    }
    // Convert each part back to Buffer
    const [encryptedText, iv, key] = parts.map(part => Buffer.from(part, 'base64'));
    
    return {
      encryptedText,
      iv,
      key,
    };
  }
}
