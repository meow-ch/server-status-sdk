import Logger from "saylo";

export type RequestOptions = import("https").RequestOptions;
export type GetRequestorResolveParam = { data: string; response: { rawHeaders: string[]; headers: { [k: string]: string | string[] | undefined; } } };
export type GetRequestor = (uri: string, options?: RequestOptions) => Promise<GetRequestorResolveParam>;
export type CheckStatusFunc = () => Promise<Status>;
export type Env = { [k: string]: string | undefined; };
export type CheckStatusFactoryProps = {}
  & { getRequestor: GetRequestor; }
  & { logger: Logger; }
  & { env: Env; }
export type CheckStatusFactory = (props: CheckStatusFactoryProps) => CheckStatusFunc;
export type StatusOrError = boolean | Error;
export type SessionIdOrError = string | Error;
export type Status = boolean | null;