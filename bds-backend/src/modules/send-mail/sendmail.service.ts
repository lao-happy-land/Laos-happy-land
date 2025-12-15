import { Injectable, OnModuleInit } from '@nestjs/common';
import { createTransport } from 'nodemailer';
import { google } from 'googleapis';
import * as fs from 'fs';
import * as path from 'path';
import * as Handlebars from 'handlebars';

@Injectable()
export class MailService implements OnModuleInit {
  private transporter: any;

  constructor() {}

  async onModuleInit() {
    const OAuth2 = google.auth.OAuth2;
    const oauth2Client = new OAuth2(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET,
      process.env.GOOGLE_OAUTH_REDIRECT_URI,
    );

    oauth2Client.setCredentials({
      refresh_token: process.env.GOOGLE_OAUTH_REFRESH_TOKEN,
    });

    try {
      const tokenResponse = await oauth2Client.getAccessToken();
      const accessToken = tokenResponse.token;

      this.transporter = createTransport({
        service: 'gmail',
        auth: {
          type: 'OAuth2',
          user: process.env.MAIL_FROM_EMAIL,
          clientId: process.env.GOOGLE_CLIENT_ID,
          clientSecret: process.env.GOOGLE_CLIENT_SECRET,
          refreshToken: process.env.GOOGLE_OAUTH_REFRESH_TOKEN,
          accessToken,
        },
      });

      await this.transporter.verify();
    } catch (error) {
      console.error('Failed to initialize email service:', error);
    }
  }

  private renderTemplate(template: string, data: any) {
    const layoutPath = path.join(__dirname, 'templates/layout.hbs');
    const templatePath = path.join(__dirname, `templates/${template}.hbs`);

    const layoutSource = fs.readFileSync(layoutPath, 'utf8');
    const templateSource = fs.readFileSync(templatePath, 'utf8');

    const layout = Handlebars.compile(layoutSource);
    const body = Handlebars.compile(templateSource);

    return layout({
      title: data.title,
      year: new Date().getFullYear(),
      body: body(data),
    });
  }

    async sendMail(to: string, subject: string, template: string, data: any) {
    const html = this.renderTemplate(template, data);

    await this.transporter.sendMail({
      from: `"${process.env.MAIL_FROM_NAME}" <${process.env.MAIL_FROM_EMAIL}>`,
      to,
      subject,
      html,
    });
  }

  async sendContact(from: string, subject: string, data: any) {
    const html = this.renderTemplate('contact', data);

    await this.transporter.sendMail({
      from,
      to: process.env.MAIL_FROM_EMAIL,
      subject,
      html,
    });
  }
}