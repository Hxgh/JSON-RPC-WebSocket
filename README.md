# [json-rpc-websocket](https://github.com/Hxgh/json-rpc-websocket)

基于WebSocket+JSONRPC+msgpack+TypeScript封装的实时通讯函数
- [msgpack-lite](https://github.com/kawanet/msgpack-lite/)
- [JSON-RPC 2.0](http://wiki.geekdream.com/Specification/json-rpc_2.0.html)

### 安装

```sh
pnpm add json-rpc-websocket
```
### 使用
```
import Socket, { SocketType } from 'json-rpc-websocket';

const socket: SocketType = new Socket({ url: 'ws://url' });

// 普通模式
socket.send({
    method: 'msg',
    callback: e => {
      console.log(e);
    },
});

// 流模式
const stream = socket.stream({
    method: 'start',
    callback: e => {
      console.log(e);
    },
    onerror: e => {
      console.log('处理超时 || 处理send无法启动');
    },
});
stream.close();

// 接收所有消息
const socket = new Socket({
  url: 'ws://url',
  onmessage: (res: Object) => console.log(res),
});

```