import { MailerService } from '@nestjs-modules/mailer';
import { BadRequestException, Injectable } from '@nestjs/common';
import { User } from '@shared/backend';
import { CONFIG } from '#/env.config';
import { rejects } from 'assert';

export type MailingOptions = {
  targetMail: string;
  subject: string;
  from? : string;
  template: string;
  context: {
    name: string;
    url: string;
  };
}


@Injectable()
export class MailService {
  constructor(private mailerService: MailerService) {}

  async sendUserConfirmation(user: User, secret: string) {
    const url = `${CONFIG.ENDPOINT}/api/user/verified/?secret=${encodeURIComponent(secret)}`;
    const options: MailingOptions = {
      targetMail: user.email,
      subject: 'Account creation for Journalist',
      template: './confirm',
      context: {
        name: user.name,
        url
      }
    }
    await this._sendMail(options)
  }

  async sendResetPassword(user: User){
    const url = `${CONFIG.ENDPOINT}/api/user/reset-password`;
    const options: MailingOptions ={
      targetMail: user.email,
      subject: 'Reset password for Journalist',
      template: './reset-password', // `.hbs` extension is appended automatically
      context: { // filling curly brackets inside hbs template with content
        name: user.name,
        url,
      },
    };

    await this._sendMail(options)
  }
  
  private async _sendMail(options: MailingOptions){

    const mailOptions = {
      to: options.targetMail,
      from: options.from ? options.from : "Journalist <noreply@journal.fr>",
      subject: options.subject,
      template: options.template,
      context: options.context
    }
    return this.mailerService.sendMail(mailOptions)
  }
}
