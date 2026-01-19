// // import { io, Socket } from "socket.io-client";
// import { ReconnectingWebSocket } from "@nktkas/rews";

// class WebSocketService {
//     private constructor() {}

//     private static instance?: WebSocketService

//     callbacks: any = {};
//     ws?: ReconnectingWebSocket | null
//     isConnected = false;
//     reconnectAttempts = 0;
//     maxReconnectAttempts = 5;
//     timeout: any

//     messageQueue: any[] = [];

//     public static getInstance(): WebSocketService {
//         if (WebSocketService.instance == null) {
//             WebSocketService.instance = new WebSocketService()
//         }

//         return WebSocketService.instance
//     }

//     connect() {
//     if (this.ws) {
//       return
//     }

    
    
//     // this.ws = new WebSocket()
//     this.ws = new ReconnectingWebSocket('wss://api.hyperliquid.xyz/ws');
    
//     // this.ws.onopen = () => {
//     // this.ws.on("connect", () => {
//     this.ws.addEventListener("open", () => {
//       console.log('WebSocket connected');
//       this.isConnected = true;
//       this.reconnectAttempts = 0;

//       console.log("messageQueue.length = ", this.messageQueue.length)
//       //  Send any queued messages
//       while (this.messageQueue.length > 0) {
//         const data = this.messageQueue.shift();
//         //this.ws?.send(JSON.stringify(data));
//         this.sendMessage(data)
//       }
      
//       // Trigger callback
//       this.executeCallback('connect', null);
//     });


//     // this.ws.on('respond', function (data) {
//     //   console.log(data);
//     // });

    
//     // this.ws.onmessage = (e) => {
//     //   // console.log("onmessage e = ", e)
//     //   const message = JSON.parse(e.data);
//     //   this.executeCallback(message.channel, message.data);
//     // };
//     // this.ws.on('message', (data) => {
//     this.ws.addEventListener('message', (data) => {
//       //console.log("message data = ", data)
//       const message = JSON.parse(data.data);
//       this.executeCallback(message.channel, message.data);
//     });

    
//     // this.ws.onerror = (e) => {
//     // this.ws.on("connect_error", (e) => {
//     // this.ws.addEventListener("error", () => {
//     //   console.error('WebSocket error:', );
//     //   // this.executeCallback('error', e);
//     // });

//     // this.ws.on("ping", (p) => {
//     //   console.log("ping = ", p)
//     // });

    
//     // this.ws.onclose = (e) => {
//     // this.ws.on("disconnect", (e) => {
//     this.ws.addEventListener("close", (e) => {
//       console.log('WebSocket closed:', e);
//       this.isConnected = false;
//       this.ws = null;
      
//       if (this.reconnectAttempts < this.maxReconnectAttempts) {
//         // Exponential backoff for reconnection
//         const delay = Math.min(1000 * 2 ** this.reconnectAttempts, 30000);
//         this.timeout = setTimeout(() => {
//           this.reconnectAttempts++;
//           this.connect();
//         }, delay);
//       }
//     });
//   }

//   disconnect() {
//     if (this.ws) {
//       this.ws.close();
//       this.ws = null;
//       this.isConnected = false;
//       clearTimeout(this.timeout);
//     }
//   }

//   sendMessage(data: any) {
//     console.log('sendMessage')
//     if (this.ws && this.isConnected) {
//       this.ws.send(JSON.stringify(data));
//       console.log("sendMessage true, data = ", data)
//       return true;
//     }
//     console.log("sendMessage false, data = ", data)
//     this.messageQueue.push(data);
//     return false;
//   }

//   addCallbacks(messageType: string, callback: {}) {
//     if (!this.callbacks[messageType]) {
//       this.callbacks[messageType] = [];
//     }
//     this.callbacks[messageType].push(callback);
//   }

  
//   removeCallbacks(messageType: string, callback: {}) {
//     if (this.callbacks[messageType]) {
//       this.callbacks[messageType] = this.callbacks[messageType]
//         .filter((cb: {}) => cb !== callback);
//     }
//   }

  
//   executeCallback(messageType: string, data: any) {
//     if (this.callbacks[messageType]) {
//       this.callbacks[messageType].forEach((callback: any) => callback(data));
//     }
//   }
// }

// export default WebSocketService.getInstance();