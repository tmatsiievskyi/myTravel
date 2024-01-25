import { classToPlain, instanceToPlain } from 'class-transformer';

import { mailer } from '../../configs/email';
import { logger } from '../../configs/logger';
import { EmailDeliveryException } from '../../exceptions';
import { validateDto } from '../../utils';

import { SendEmailDto } from './email.dto';

export class Email {
  constructor() {}

  public send = async (message: SendEmailDto) => {
    const started = Date.now();

    try {
      await validateDto(SendEmailDto, message, true);
      logger.info(`Sending email to ${message.to}`);

      try {
        const result = await mailer.send(instanceToPlain(message) as any);
        logger.info(`Email to ${message.to} sent successfully`);
        //TODO: event

        return true;
      } catch (error) {
        logger.error(error);
        throw new EmailDeliveryException(message.to);
      }
    } catch (error) {
      throw error;
    }
  };
}
