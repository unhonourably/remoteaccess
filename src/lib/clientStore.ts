interface RegisteredClient {
  url: string;
  lastSeen: Date;
}

// Global variable to persist across serverless function calls
let globalClients: RegisteredClient[] = [];

class ClientStore {
  registerClient(clientUrl: string): number {
    console.log(`[ClientStore] Before cleanup: ${globalClients.length} clients`)
    this.cleanupExpiredClients();
    console.log(`[ClientStore] After cleanup: ${globalClients.length} clients`)
    
    const existingClient = globalClients.find(client => client.url === clientUrl);
    
    if (existingClient) {
      existingClient.lastSeen = new Date();
      console.log(`[ClientStore] Updated existing client: ${clientUrl}`)
    } else {
      globalClients.push({
        url: clientUrl,
        lastSeen: new Date()
      });
      console.log(`[ClientStore] Added new client: ${clientUrl}`)
    }
    
    console.log(`[ClientStore] Total clients after registration: ${globalClients.length}`)
    return globalClients.length;
  }

  getClients(): RegisteredClient[] {
    console.log(`[ClientStore] getClients called - ${globalClients.length} clients before cleanup`)
    this.cleanupExpiredClients();
    console.log(`[ClientStore] getClients returning ${globalClients.length} clients`)
    return [...globalClients];
  }

  getClientCount(): number {
    console.log(`[ClientStore] getClientCount called - ${globalClients.length} clients before cleanup`)
    this.cleanupExpiredClients();
    console.log(`[ClientStore] getClientCount returning ${globalClients.length}`)
    return globalClients.length;
  }

  updateClientLastSeen(clientUrl: string): void {
    const client = globalClients.find(c => c.url === clientUrl);
    if (client) {
      client.lastSeen = new Date();
    }
  }

  private cleanupExpiredClients(): void {
    const fiveMinutesAgo = Date.now() - 300000; // 5 minutes
    globalClients = globalClients.filter(client => {
      return client.lastSeen.getTime() > fiveMinutesAgo;
    });
  }
}

export const clientStore = new ClientStore();
