import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { MailService } from './sendmail.service';

@ApiTags('send-mail')
@Controller('send-mail')
export class SendMailController {
  constructor(private readonly mailService: MailService) {}

  @Post('test')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Send test email to a user' })
  @ApiResponse({
    status: 200,
    description: 'Email sent successfully',
    schema: {
      type: 'object',
      properties: {
        message: { type: 'string' },
        success: { type: 'boolean' },
      },
    },
  })
  @ApiResponse({ status: 400, description: 'Bad request' })
  async sendTestEmail(
    @Body() body: { to: string; subject?: string; content?: string },
  ) {
    const { to, subject = 'Test Email from Laos Happy Land', content } = body;

    if (!to) {
      return {
        message: 'Recipient email is required',
        success: false,
      };
    }

    try {
      await this.mailService.sendMail(to, subject, 'test-mail', {
        title: 'Test Email',
      });

      return {
        message: `Email sent successfully to ${to}`,
        success: true,
      };
    } catch (error) {
      console.error('Error sending test email:', error);
      return {
        message: `Failed to send email: ${error.message}`,
        success: false,
      };
    }
  }

  @Post('new-post-notification')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Send new post notification email',
    description:
      'Send an email notification about a new post to a specific user',
  })
  @ApiResponse({ status: 200, description: 'Email sent successfully' })
  async sendNewPostNotification(
    @Body()
    body: {
      to: string;
      postTitle: string;
      postDetails: string;
      postType: string;
    },
  ) {
    const { to, postTitle, postDetails, postType } = body;

    if (!to || !postTitle) {
      return {
        message: 'Recipient email and post title are required',
        success: false,
      };
    }

    try {
      await this.mailService.sendMail(
        to,
        `New Post: ${postTitle}`,
        'new-post',
        {
          title: 'New Post Published',
          postTitle,
          postDetails,
          postType,
        },
      );

      return {
        message: `New post notification sent to ${to}`,
        success: true,
      };
    } catch (error) {
      console.error('Error sending new post notification:', error);
      return {
        message: `Failed to send email: ${error.message}`,
        success: false,
      };
    }
  }

  @Post('contact')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Send contact email' })
  @ApiResponse({ status: 200, description: 'Contact email sent successfully' })
  async sendContactEmail(
    @Body()
    body: {
      from: string;
      to: string;
      subject: string;
      message: string;
      senderName?: string;
    },
  ) {
    const { from, to, subject, message, senderName } = body;

    if (!from || !to || !subject || !message) {
      return {
        message: 'From, To, Subject, and Message fields are required',
        success: false,
      };
    }

    try {
      await this.mailService.sendContact(from, subject, {
        title: 'New Contact Message',
        senderName: senderName || 'Anonymous',
        from,
        subject,
        message,
      });

      return {
        message: `Contact email sent from ${from} to ${to}`,
        success: true,
      };
    } catch (error) {
      console.error('Error sending contact email:', error);
      return {
        message: `Failed to send contact email: ${error.message}`,
        success: false,
      };
    }
  }
}
