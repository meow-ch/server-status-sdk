import 'dotenv/config';
import { hasKeyOrThrow } from '../utils/envHasKey';

const env: { [k: string]: string; } = {};

hasKeyOrThrow(process.env, 'CHECK_INTERVAL_SEC');

hasKeyOrThrow(process.env, 'STATUS_UP_EMAIL_NOTIF_SUBJECT');
hasKeyOrThrow(process.env, 'STATUS_UP_EMAIL_NOTIF_TEXT');
hasKeyOrThrow(process.env, 'STATUS_DOWN_EMAIL_NOTIF_SUBJECT');
hasKeyOrThrow(process.env, 'STATUS_DOWN_EMAIL_NOTIF_TEXT');

hasKeyOrThrow(process.env, 'STATUS_UP_SMS_NOTIF_SUBJECT');
hasKeyOrThrow(process.env, 'STATUS_UP_SMS_NOTIF_TEXT');
hasKeyOrThrow(process.env, 'STATUS_DOWN_SMS_NOTIF_SUBJECT');
hasKeyOrThrow(process.env, 'STATUS_DOWN_SMS_NOTIF_TEXT');

hasKeyOrThrow(process.env, 'SITE_TITLE');

process.env = {
  ...process.env,
  ...env,
}

export default env;