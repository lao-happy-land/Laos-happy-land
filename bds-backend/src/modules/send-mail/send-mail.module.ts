import { Module } from '@nestjs/common';
import { MailService } from './sendmail.service';
import { SendMailController } from './send-mail.controller';

@Module({
  controllers: [SendMailController],
  providers: [MailService],
  exports: [MailService],
})
export class SendMailModule {}