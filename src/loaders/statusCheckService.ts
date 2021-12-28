import { LoadDictElement, GetInstanceType } from 'di-why/build/src/DiContainer';
import StatusCheckService from '../services/StatusCheckService';

const loadDictElement: LoadDictElement<GetInstanceType<typeof StatusCheckService>> = {
  constructible: StatusCheckService,

  before({ deps: predeps }) {
    const { appConfig, ...deps } = predeps;
    const url = appConfig.url;
    const notificationMessages = {
      email: {
        up: {
          subject: process.env.STATUS_UP_EMAIL_NOTIF_SUBJECT,
          text: process.env.STATUS_UP_EMAIL_NOTIF_TEXT?.replace("{{ URL }}", url),
        },
        down: {
          subject: process.env.STATUS_DOWN_EMAIL_NOTIF_SUBJECT,
          text: process.env.STATUS_DOWN_EMAIL_NOTIF_TEXT?.replace("{{ URL }}", url),
        },
      },
      sms: {
        up: {
          subject: process.env.STATUS_UP_SMS_NOTIF_SUBJECT,
          text: process.env.STATUS_UP_SMS_NOTIF_TEXT?.replace("{{ URL }}", url),
        },
        down: {
          subject: process.env.STATUS_DOWN_SMS_NOTIF_SUBJECT,
          text: process.env.STATUS_DOWN_SMS_NOTIF_TEXT?.replace("{{ URL }}", url),
        },
      }
    };

    return {
      ...deps,
      notificationMessages,
    };
  },

  deps: {
    checkInterval: process.env.CHECK_INTERVAL_SEC,
    onFailNotifyHoursInterval: process.env.ON_FAIL_NOTIFY_INTERVAL_HOURS || 0,
  },

  locateDeps: {
    notifyAll: 'notifyAll',
    checkStatus: 'checkStatus',
    appConfig: 'appConfig',
  }
};

export default loadDictElement