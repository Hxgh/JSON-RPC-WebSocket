/// <reference lib="dom" />
/**
 * 发送数据时回调函数参数类型
 *
 * @export
 * @interface ResType
 */
export interface ResType {
  jsonrpc: string;
  result: object;
  id: string;
  error?: object;
  message?: string;
  data?: string | object;
  res?:
    | ResType['result']
    | ResType['error']
    | { message: ResType['message']; data: ResType['data'] };
}

/**
 * 发送数据的参数类型
 *
 * @export
 * @interface Communicate
 */
export interface Communicate {
  jsonrpc?: string;
  method: string;
  params?: Record<string, unknown>;
  id?: string;
  timeout?: number;
  isInform?: boolean | undefined;
  callback?: (res: ResType['res']) => void;
  onerror?: (res: { code?: string | number; message?: string }) => void;
}

/**
 * Socket的事件类型
 *
 * @export
 * @interface PropsFuncType
 */
export interface PropsFuncType {
  onopen: (e?: Event) => void;
  onmessage: (e?: unknown) => void;
  onclose: (e?: CloseEvent) => void;
  onerror: (e?: Event) => void;
}

/**
 * Socket的websocket参数类型
 *
 * @export
 * @interface PropsType
 */
export interface PropsType {
  url: string;
  protocols?: string | string[] | undefined;
  onopen?: PropsFuncType['onopen'];
  onmessage?: PropsFuncType['onmessage'];
  onclose?: PropsFuncType['onclose'];
  onerror?: PropsFuncType['onerror'];
  jsonrpc?: string;
}

/**
 * 发送数据时回调函数存储的类型
 *
 * @export
 * @interface CallbackStorage
 */
export interface CallbackStorage {
  [propName: string]: Communicate['callback'];
}
/**
 * 更换url函数的数据类型
 *
 * @export
 * @interface WithUrl
 */
export type WithUrl = (url: string) => void

/**
 * stream的类型
 *
 * @export
 * @interface SocketStrem
 */
export interface SocketStrem {
  close: (code?: number, reason?: string) => void;
}

/**
 * 实时通讯函暴露的API类型:public
 *
 * @export
 * @interface SocketType
 */
export interface SocketType {
  send: (send: Communicate) => void;
  close: (code?: number, reason?: string) => void;
  stream: (send: Communicate) => {
    id: string;
    close: SocketStrem['close'];
  } | undefined;
}
