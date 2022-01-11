import Dev_ServerBugError from "../errors/Dev_ServerBugError";
import { hoursAgo, sleep, secondsToYMWDHMSSentence } from "swiss-army-knifey";
import { CheckStatusFunc, InitializedStatus, MaybeUninitializedStatus, WrappedStatus, WrappedStatusE } from "../requestor";

type GetRequestor = (uri: string) => Promise<string>;
type NotifyMessage = { subject: string; text: string; };
type NotifyAll = (conf: { sms: NotifyMessage, email: NotifyMessage; }) => Promise<[void, any]>;
type NotificationMessage = { subject: string; text: string; };
type NotificationMessageFor = { up: NotificationMessage; down: NotificationMessage; };
type NotificationMessages = { email: NotificationMessageFor; sms: NotificationMessageFor; };
type NotificationMessagesConfig = { all: NotificationMessageFor; } & NotificationMessages;
type StatusName = 'up' | 'down' | 'unknown';
type StatusStats = {
  friendlyFullSentence: string;
  friendlyStatusPhrase: string;
  checkIntervalInMinutes: number;
  dateLastChecked: string;
  checksSpreeCount: number;
  aliveForYMDHMS: string;
  statusName: StatusName;
  errors: Error[];
}

interface StatusCheckServiceConstructorPropsInterface {
  checkStatus: CheckStatusFunc;
  checkInterval: number;
  getRequestor: GetRequestor;
  notifyAll: NotifyAll;
  onFailNotifyHoursInterval: number;
  serverUri: string;
  notificationMessages: NotificationMessagesConfig;
}

function isWrappedStatusWithInitializedErrors<T>(w: WrappedStatus<T>): w is WrappedStatusE<T> {
  return w.errors !== undefined && Array.isArray(w.errors);
}

export default class StatusCheckService {
  public checkInterval: number;
  public userProvidedCheckStatus: CheckStatusFunc;
  public lastChecked: number | null;
  public lastEmailSentTime: number | null;
  public notifyAll: NotifyAll;
  public notificationMessages: NotificationMessages;
  public onFailNotifyHoursInterval: number;
  public wrappedStatus: WrappedStatusE<MaybeUninitializedStatus>;
  public statusChecksCount: number;
  public serverUri: string;

  constructor({ notifyAll, serverUri, checkStatus, checkInterval, onFailNotifyHoursInterval, notificationMessages }: StatusCheckServiceConstructorPropsInterface) {
    if (!notifyAll) {
      throw new Dev_ServerBugError('StatusCheck service needs notifyAll to operate');
    }

    this.checkInterval = checkInterval;
    this.userProvidedCheckStatus = checkStatus;
    this.lastChecked = null;
    this.lastEmailSentTime = null;
    this.notifyAll = notifyAll;
    this.onFailNotifyHoursInterval = onFailNotifyHoursInterval;
    this.serverUri = serverUri;
    this.wrappedStatus = { status: null, errors: [] };
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

  statusChanged(status: InitializedStatus) {
    return this.wrappedStatus.status !== status;
  }

  changedStatusOrDownStatusForMoreThanOneHour(status: InitializedStatus) {
    const notifyOnlyOnStatusChanges = this.onFailNotifyHoursInterval === 0;
    const notifiedTooLongAgo = this.lastEmailSentTime !== null && this.lastEmailSentTime <= hoursAgo(this.onFailNotifyHoursInterval);
    return this.statusChanged(status) || (!notifyOnlyOnStatusChanges && (!status && notifiedTooLongAgo));
  }

  shouldNotifyCurrentStatus(status: InitializedStatus) {
    return this.changedStatusOrDownStatusForMoreThanOneHour(status)
  }

  getStatusFriendlyPhrase(status: MaybeUninitializedStatus) {
    return `${status === null
      ? 'Please wait: system status'
      : status
        ? 'Good news: system'
        : 'Alert: system'
      } is ${this.getStatusName(status)}!`;
  }

  async notifyServiceStatus({ status }: WrappedStatus<InitializedStatus>) {
    if (this.lastChecked !== null && status !== null) {
      await this.notifyAll({
        email: { ...this.notificationMessages.email[status ? "up" : "down"] },
        sms: { ...this.notificationMessages.sms[status ? "up" : "down"] },
      });
    }
  }

  async handleNewStatus(w: WrappedStatus<InitializedStatus>) {
    if (this.shouldNotifyCurrentStatus(w.status)) {
      this.notifyServiceStatus(w);
      this.lastEmailSentTime = Date.now();
    }
    this.wrappedStatus = isWrappedStatusWithInitializedErrors(w)
      ? w
      : { ...w, errors: [] };
  }

  async checkStatus(): Promise<WrappedStatus<InitializedStatus>> {
    let wrappedStatus = { status: false };
    try {
      wrappedStatus = await this.userProvidedCheckStatus();
    } catch (err) {
      this.handleFailedRequest(err as Error);
    }
    this.statusChecksCount++;
    this.lastChecked = Date.now();
    return wrappedStatus;
  }

  handleFailedRequest(err: Error) {
    throw err;
  }

  getCheckIntervalInMinutes() {
    return Math.ceil(this.checkInterval / 60);
  }

  getStatusStats(): StatusStats {
    const dateLastChecked = this.lastChecked === null ? 'Never' : `${new Date(this.lastChecked).toLocaleDateString()}, ${new Date(this.lastChecked).toLocaleTimeString()}`;
    const checkIntervalInMinutes = this.getCheckIntervalInMinutes();
    const checksSpreeCount = this.statusChecksCount;
    const friendlyStatusPhrase = this.wrappedStatus.status === null ? 'Unknown' : this.getStatusFriendlyPhrase(this.wrappedStatus.status);
    const friendlyFullSentence = (this.lastChecked === null || this.wrappedStatus.status === null)
      ? `Not checked yet. Please wait ${checkIntervalInMinutes} min. or so and refresh this page.`
      : `${friendlyStatusPhrase}. Last time I checked was on ${dateLastChecked.split(', ').join(' at ')} (checked ${checksSpreeCount} time${ checksSpreeCount === 1 ? '' : 's'} in a row without restarting). I check every ${checkIntervalInMinutes} min.`;

    const secondsBetweenLastCheckAndNow = Math.floor((Date.now() - (this.lastChecked || Date.now())) / 1000);
    const aliveSeconds = this.checkInterval * (this.statusChecksCount - 1) + (secondsBetweenLastCheckAndNow < this.checkInterval ? secondsBetweenLastCheckAndNow : 0);
    const aliveForYMDHMS = secondsToYMWDHMSSentence(aliveSeconds);

    return {
      errors: this.wrappedStatus.errors,
      friendlyFullSentence,
      friendlyStatusPhrase,
      checkIntervalInMinutes,
      dateLastChecked,
      checksSpreeCount,
      statusName: this.getStatusName(this.wrappedStatus.status),
      aliveForYMDHMS,
    };
  }

  getStatusName(status: MaybeUninitializedStatus): StatusName {
    if (status === null) return 'unknown';
    return status ? 'up' : 'down';
  }
}
