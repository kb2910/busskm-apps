// src/app/services/socket.service.ts
import { Injectable } from '@angular/core';
import { io, Socket } from 'socket.io-client';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SocketService {
  public socket: Socket;

  constructor() {
    this.socket = io(environment.API_SOCKET, {
      autoConnect: false, // conectar manualmente
      transports: ['websocket']
    });
  }

  connect() {
    if (!this.socket.connected) this.socket.connect();
  }

  disconnect() {
    if (this.socket.connected) this.socket.disconnect();
  }

  on(event: string, callback: (data: any) => void) {
    this.socket.on(event, callback);
  }

  emit(event: string, payload: any) {
    this.socket.emit(event, payload);
  }

  off(event: string) {
    this.socket.off(event);
  }
}
