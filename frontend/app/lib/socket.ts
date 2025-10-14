import { io, type Socket } from "socket.io-client";

export function createSocket(baseUrl: string, token: string): Socket {
  return io(baseUrl, {
    transports: ["websocket"],
    query: { token },
    autoConnect: true,
  });
}


