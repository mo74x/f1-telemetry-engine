import { WebSocketGateway, WebSocketServer, OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Logger } from '@nestjs/common';

@WebSocketGateway(3001, { // ⚠️ Running on Port 3001
  cors: {
    origin: '*', // Allow connections from anywhere (for development)
  },
})
export class TelemetryGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  private logger = new Logger('TelemetryGateway');

  handleConnection(client: Socket) {
    this.logger.log(`🟢 Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`🔴 Client disconnected: ${client.id}`);
  }

  // This is the method our Service will call
  broadcastTelemetry(data: any) {
    // Emitting event named 'live_update' to all connected clients
    this.server.emit('live_update', data); 
  }
}