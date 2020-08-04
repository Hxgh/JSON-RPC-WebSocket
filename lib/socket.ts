import { encode, decode } from 'msgpack-lite';
import { createGUID } from './tools';
import {
  PropsType,
  PropsFuncType,
  Communicate,
  ResType,
  GuidStorage,
  CallbackStorage,
  SocketType,
} from './type';

const defaultProps: PropsFuncType = {
  onopen: () => {},
  onmessage: () => {},
  onclose: () => {},
  onerror: () => {},
};

/**
 * Socket
 * 基于WebSocket、msgpack、JSONRPC封装的实时通讯函数
 * @export
 * @class Socket
 */
export default class Socket {
  private props: PropsType;

  private guidStorage: GuidStorage = [];

  private callbackStorage: CallbackStorage = {};

  private ws: WebSocket;

  private streamID: string = '';

  constructor(props: PropsType) {
    this.props = { jsonrpc: '2.0', ...defaultProps, ...props };
    this.ws = this.setupWS();
  }

  /**
   * 初始化链接
   *
   * @private
   * @returns {WebSocket}
   * @memberof Socket
   */
  private setupWS(): WebSocket {
    const ws: WebSocket = new WebSocket(this.props.url);
    ws.binaryType = 'arraybuffer';
    ws.onopen = (e) => (<PropsFuncType['onopen']>this.props.onopen)(e);
    ws.onmessage = (e) => this.onmessage(e);
    ws.onclose = (e) => (<PropsFuncType['onopen']>this.props.onclose)(e);
    ws.onerror = (e) => (<PropsFuncType['onerror']>this.props.onerror)(e);
    return ws;
  }

  /**
   * 存储guid
   *
   * @private
   * @param {string} guid
   * @returns {string}
   * @memberof Socket
   */
  private saveGUID(guid: string): string {
    this.guidStorage.push(guid);
    return guid;
  }

  /**
   * 删除guid
   *
   * @private
   * @param {string} guid
   * @returns {string}
   * @memberof Socket
   */

  private deleteGUID(guid: string): string {
    const arr = this.guidStorage;
    const index = arr.findIndex((v) => v === guid);
    if (index !== -1) {
      arr.splice(index, 1);
    }
    return guid;
  }

  /**
   * 存储回调方法
   *
   * @private
   * @param {Communicate['callback']} callback
   * @param {string} id
   * @memberof Socket
   */
  private saveResponse(callback: Communicate['callback'], id: string) {
    this.callbackStorage[id] = callback;
  }

  /**
   * 执行回调方法并移除
   *
   * @private
   * @param {string} id
   * @returns
   * @memberof Socket
   */
  private finishResponse(res: ResType['res'], id: string) {
    const callback = this.callbackStorage[id];
    if (this.callbackStorage[id] !== undefined && callback) {
      // 执行方法
      callback(res);
      // 移除方法的存储
      if (id !== this.streamID) delete this.callbackStorage[id];
    }
    return id;
  }

  /**
   * 接收数据
   *
   * @param {MessageEvent} buffer
   * @returns
   * @memberof Socket
   */
  private onmessage(e: MessageEvent) {
    const response: ResType = decode(Array.prototype.slice.call(new Uint8Array(e.data)));
    if (!response) return;
    const { result, error, id, message, data } = response;
    const res = result || error || { message, data };
    if (id) {
      this.deleteGUID(id);
      this.finishResponse(res, id);
    }
    (<PropsFuncType['onmessage']>this.props.onmessage)(res);
  }

  /**
   * 发送数据
   *
   * @param {Communicate} params
   * @returns
   * @memberof Socket
   */
  public send: SocketType['send'] = (data: Communicate) => {
    const { method, isInform, callback, params } = data;
    // 未建立链接不允许通信
    if (this.ws.readyState !== 1) return;
    // 未传method return
    if (method === undefined) return;
    // 如果是通知责无需存guid
    let guid: { id?: Communicate['id'] } = {};
    const id = this.saveGUID(createGUID());
    if (!isInform) {
      guid = { id };
      // 如果需要回调处理
      if (callback) {
        this.saveResponse(callback, id);
      }
    }
    // 构造完整send数据
    this.ws.send(encode({ jsonrpc: this.props.jsonrpc, params, ...guid }));
  };

  public stream: SocketType['stream'] = async (data: Communicate) => {
    const { method, callback, params } = data;
    // 未传method || 未建立链接不允许通信 || 未传回调
    if (method === undefined || !callback || this.ws.readyState !== 1) return;
    // 存储并维护id callback
    const id = this.saveGUID(createGUID());
    if (callback) {
      this.saveResponse(callback, id);
    }
    // 构造完整send数据
    this.ws.send(encode({ jsonrpc: this.props.jsonrpc, params, ...{ id: this.streamID } }));
    // 处理关闭逻辑：清除streamID 并关闭链接
    return {
      id: this.streamID,
      close: (code: number | undefined, reason: string | undefined) => {
        this.streamID = '';
        this.close(code, reason);
      },
    };
  };

  /**
   * 关闭链接
   *
   * @memberof Socket
   */
  public close: SocketType['close'] = (code, reason) => this.ws.close(code, reason);
}
