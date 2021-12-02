import { LoadDictElement } from 'di-why/build/src/DiContainer';
import 'dotenv/config';
import { Env } from '../requestor';
import { hasKeyOrThrow } from 'swiss-army-knifey/build/src/utils/envHasKey';

const env: Env = {};

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

const loadDictElement: LoadDictElement<Env> = {
  instance: process.env,
}

export default loadDictElement;