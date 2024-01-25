import sendgridClient from '@sendgrid/client';
import sendgrid from '@sendgrid/mail';

import { SENDGRID_API_KEY } from './env';

sendgrid.setApiKey(SENDGRID_API_KEY);
sendgridClient.setApiKey(SENDGRID_API_KEY);

export { sendgrid as mailer };
