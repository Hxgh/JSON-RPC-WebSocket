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
  params?: Object;
  id?: string;
  isInform?: boolean | undefined;
  callback?: (res: ResType['res']) => void;
}

/**
 * Socket的事件类型
 *
 * @export
 * @interface PropsFuncType
 */
export interface PropsFuncType {
  onopen: (e?: Event) => void;
  onmessage: (e?: Object) => void;
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
  onopen?: PropsFuncType['onopen'];
  onmessage?: PropsFuncType['onmessage'];
  onclose?: PropsFuncType['onclose'];
  onerror?: PropsFuncType['onerror'];
  jsonrpc?: string;
}

/**
 * guid存储的类型
 *
 * @export
 * @interface GuidStorage
 */
export interface GuidStorage {
  splice(index: any, arg1: number): Array<any>;
  findIndex(arg0: (v: any) => boolean): number;
  push(guid: string): number;
  [index: number]: ResType['id'];
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
 * 实时通讯函暴露的API类型:public
 *
 * @export
 * @interface SocketType
 */
export interface SocketType {
  send: (send: Communicate) => void;
  stream: (send: Communicate) => Object;
  close: (code?: number, reason?: string) => void;
}
