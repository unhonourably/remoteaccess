interface RichPresenceData {
  image: string;
  title: string;
  line1: string;
  line2: string;
}

// Global variable to persist across serverless function calls
let globalPresenceData: RichPresenceData = {
  image: '',
  title: '',
  line1: '',
  line2: ''
};

class PresenceStore {
  updatePresence(data: RichPresenceData): void {
    globalPresenceData = { ...data };
    console.log(`[PresenceStore] Updated presence data:`, globalPresenceData);
  }

  clearPresence(): void {
    globalPresenceData = {
      image: '',
      title: '',
      line1: '',
      line2: ''
    };
    console.log(`[PresenceStore] Cleared presence data`);
  }

  getCurrentPresence(): RichPresenceData {
    return { ...globalPresenceData };
  }
}

export const presenceStore = new PresenceStore();
