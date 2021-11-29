import 'dotenv/config';

const env: { [k: string]: string; } = {};

function hasKey(env: any, key: string) {
  return (env[key] || '').length > 0;
} 

if (!hasKey(process.env, 'MAIL_USERNAME')) {
  throw new Error('Cannot operate without MAIL_USERNAME, add it to .env file');
}
if (!hasKey(process.env, 'MAIL_PASSWORD')) {
  throw new Error('Cannot operate without MAIL_PASSWORD, add it to .env file');
}
if (!hasKey(process.env, 'MAIL_FROM')) {
  throw new Error('Cannot operate without MAIL_FROM, add it to .env file');
}
if (!hasKey(process.env, 'MAIL_TO')) {
  throw new Error('Cannot operate without MAIL_TO, add it to .env file');
}
if (!hasKey(process.env, 'CHECK_INTERVAL_SEC')) {
  throw new Error('Cannot operate without CHECK_INTERVAL_SEC, add it to .env file');
}

if (!hasKey(process.env, 'STATUS_UP_EMAIL_NOTIF_SUBJECT')) {
  throw new Error('Cannot operate without STATUS_UP_EMAIL_NOTIF_SUBJECT, add it to .env file');
}
if (!hasKey(process.env, 'STATUS_UP_EMAIL_NOTIF_TEXT')) {
  throw new Error('Cannot operate without STATUS_UP_EMAIL_NOTIF_TEXT, add it to .env file');
}
if (!hasKey(process.env, 'STATUS_DOWN_EMAIL_NOTIF_SUBJECT')) {
  throw new Error('Cannot operate without STATUS_DOWN_EMAIL_NOTIF_SUBJECT, add it to .env file');
}
if (!hasKey(process.env, 'STATUS_DOWN_EMAIL_NOTIF_TEXT')) {
  throw new Error('Cannot operate without STATUS_DOWN_EMAIL_NOTIF_TEXT, add it to .env file');
}
if (!hasKey(process.env, 'STATUS_UP_SMS_NOTIF_SUBJECT')) {
  throw new Error('Cannot operate without STATUS_UP_SMS_NOTIF_SUBJECT, add it to .env file');
}
if (!hasKey(process.env, 'STATUS_UP_SMS_NOTIF_TEXT')) {
  throw new Error('Cannot operate without STATUS_UP_SMS_NOTIF_TEXT, add it to .env file');
}
if (!hasKey(process.env, 'STATUS_DOWN_SMS_NOTIF_SUBJECT')) {
  throw new Error('Cannot operate without STATUS_DOWN_SMS_NOTIF_SUBJECT, add it to .env file');
}
if (!hasKey(process.env, 'STATUS_DOWN_SMS_NOTIF_TEXT')) {
  throw new Error('Cannot operate without STATUS_DOWN_SMS_NOTIF_TEXT, add it to .env file');
}
if (!hasKey(process.env, 'SITE_TITLE')) {
  throw new Error('Cannot operate without SITE_TITLE, add it to .env file');
}

process.env = {
  ...process.env,
  ...env,
}

export default env;