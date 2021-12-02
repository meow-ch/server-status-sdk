import Dev_ServerBugError from "../errors/Dev_ServerBugError";
import sleep from "../utils/sleep";
import getStringDate, { hoursAgo, secondsToYMWDHMSSentence } from "../utils/getStringDate";

type GetRequestor = (uri: string) => Promise<string>;
type NotifyMessage = { subject: string; text: string; };
type NotifyAll = (conf: { sms: NotifyMessage, email: NotifyMessage; }) => Promise<[void, any]>;
type DetermineStatus = () => boolean;
type NotificationMessage = { subject: string; text: string; };
type NotificationMessageFor = { up: NotificationMessage; down: NotificationMessage; };
type NotificationMessages = { email: NotificationMessageFor; sms: NotificationMessageFor; };
type NotificationMessagesConfig = { all: NotificationMessageFor; } & NotificationMessages;
type Status = boolean | null;
type StatusName = 'up' | 'down' | 'unknown';
type StatusStats = {
  friendlyFullSentence: string;
  friendlyStatusPhrase: string;
  checkIntervalInMinutes: number;
  dateLastChecked: string;
  checksSpreeCount: number;
  aliveForYMDHMS: string;
  statusName: StatusName;
}

interface StatusCheckServiceConstructorPropsInterface {
  determineStatus: DetermineStatus;
  checkInterval: number;
  getRequestor: GetRequestor;
  notifyAll: NotifyAll;
  onFailNotifyHoursInterval: number;
  serverUri: string;
  notificationMessages: NotificationMessagesConfig;
}

export default class StatusCheckService {
  public checkInterval: number;
  public determineStatus: DetermineStatus;
  public lastChecked: number | null;
  public lastEmailSentTime: number | null;
  public notifyAll: NotifyAll;
  public notificationMessages: NotificationMessages;
  public onFailNotifyHoursInterval: number;
  public status: Status;
  public statusChecksCount: number;
  public serverUri: string;

  constructor({ notifyAll, serverUri, determineStatus, checkInterval, onFailNotifyHoursInterval, notificationMessages }: StatusCheckServiceConstructorPropsInterface) {
    if (!notifyAll) {
      throw new Dev_ServerBugError('StatusCheck service needs notifyAll to operate');
    }

    this.checkInterval = checkInterval;
    this.determineStatus = determineStatus;
    this.lastChecked = null;
    this.lastEmailSentTime = null;
    this.notifyAll = notifyAll;
    this.onFailNotifyHoursInterval = onFailNotifyHoursInterval;
    this.serverUri = serverUri;
    this.status = null;
    this.statusChecksCount = 0;

    if (notificationMessages.all !== undefined) {
      this.notificationMessages = {
        email: notificationMessages.all,
        sms: notificationMessages.all,
      };
    } else {
      this.notificationMessages = notificationMessages;
    }
  }

  async run() {
    while (1) {
      this.handleNewStatus(await this.checkStatus());
      await sleep(this.checkInterval * 1000);
    }
  }

  statusChanged(status: boolean) {
    return this.status !== status;
  }

  changedStatusOrDownStatusForMoreThanOneHour(status: boolean) {
    const notifyOnlyOnStatusChanges = this.onFailNotifyHoursInterval === 0;
    const notifiedTooLongAgo = this.lastEmailSentTime !== null && this.lastEmailSentTime <= hoursAgo(this.onFailNotifyHoursInterval);
    return this.statusChanged(status) || (!notifyOnlyOnStatusChanges && (!status && notifiedTooLongAgo));
  }

  shouldNotifyCurrentStatus(status: boolean) {
    return this.changedStatusOrDownStatusForMoreThanOneHour(status)
  }

  getStatusFriendlyPhrase(status: Status) {
    return `${status === null
      ? 'Please wait: system status'
      : status
        ? 'Good news: system'
        : 'Alert: system'
      } is ${this.getStatusName(status)}!`;
  }

  async notifyServiceStatus(status: Status) {
    if (this.lastChecked !== null && status !== null) {
      await this.notifyAll({
        email: { ...this.notificationMessages.email[status ? "up" : "down"] },
        sms: { ...this.notificationMessages.sms[status ? "up" : "down"] },
      });
    }
  }

  async handleNewStatus(status: boolean) {
    if (this.shouldNotifyCurrentStatus(status)) {
      this.notifyServiceStatus(status);
      this.lastEmailSentTime = Date.now();
    }
    this.status = status;
  }

  async checkStatus() {
    let status = false;
    try {
      status = this.determineStatus();
    } catch (err) {
      this.handleFailedRequest(err as Error);
    }
    this.statusChecksCount++;
    this.lastChecked = Date.now();
    return status;
  }

  handleFailedRequest(err: Error) {
    throw err;
  }

  getCheckIntervalInMinutes() {
    return Math.ceil(this.checkInterval / 60);
  }

  timezoned(timestamp: number) {
    return timestamp + 2*60*60*1000;
  }

  getStatusStats(): StatusStats {
    const dateLastChecked = this.lastChecked === null ? 'Never' : getStringDate(this.timezoned(this.lastChecked));
    const checkIntervalInMinutes = this.getCheckIntervalInMinutes();
    const checksSpreeCount = this.statusChecksCount;
    const friendlyStatusPhrase = this.status === null ? 'Unknown' : this.getStatusFriendlyPhrase(this.status);
    const friendlyFullSentence = (this.lastChecked === null || this.status === null)
      ? `Not checked yet. Please wait ${checkIntervalInMinutes} min. or so and refresh this page.`
      : `${friendlyStatusPhrase}. Last time I checked was on ${dateLastChecked.split(', ').join(' at ')} (checked ${checksSpreeCount} time${ checksSpreeCount === 1 ? '' : 's'} in a row without restarting). I check every ${checkIntervalInMinutes} min.`;

    const secondsBetweenLastCheckAndNow = Math.floor((Date.now() - (this.lastChecked || Date.now())) / 1000);
    const aliveSeconds = this.checkInterval * (this.statusChecksCount - 1) + (secondsBetweenLastCheckAndNow < this.checkInterval ? secondsBetweenLastCheckAndNow : 0);
    const aliveForYMDHMS = secondsToYMWDHMSSentence(aliveSeconds);

    return {
      friendlyFullSentence,
      friendlyStatusPhrase,
      checkIntervalInMinutes,
      dateLastChecked,
      checksSpreeCount,
      statusName: this.getStatusName(this.status),
      aliveForYMDHMS,
    };
  }

  getStatusName(status: Status): StatusName {
    if (status === null) return 'unknown';
    return status ? 'up' : 'down';
  }
}
