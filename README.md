# [WebSocket-JSONRPC](https://github.com/Hxgh/websocket-jsonrpc)

基于WebSocket+JSONRPC+msgpack封装的实时通讯函数
- [msgpack-lite](https://github.com/kawanet/msgpack-lite/)
- [JSON-RPC 2.0](http://wiki.geekdream.com/Specification/json-rpc_2.0.html)

### 安装

```sh
$ npm install websocket-jsonrpc
# or
yarn add websocket-jsonrpc
```
### 使用 
```
const socket: SocketType = new Socket({ url: 'ws://url' });

socket.communicate({
    method: 'sayhellosync',
    callback: e => {
      console.log(e);
    },
});