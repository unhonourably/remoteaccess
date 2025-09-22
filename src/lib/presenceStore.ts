interface RichPresenceData {
  image: string;
  imageAltText: string;
  smallImage: string;
  smallImageAltText: string;
  title: string;
  line1: string;
  line2: string;
  button1Text: string;
  button1Url: string;
  button2Text: string;
  button2Url: string;
}

// Global variable to persist across serverless function calls
let globalPresenceData: RichPresenceData = {
  image: '',
  imageAltText: '',
  smallImage: '',
  smallImageAltText: '',
  title: '',
  line1: '',
  line2: '',
  button1Text: '',
  button1Url: '',
  button2Text: '',
  button2Url: ''
};

class PresenceStore {
  updatePresence(data: RichPresenceData): void {
    globalPresenceData = { ...data };
    console.log(`[PresenceStore] Updated presence data:`, globalPresenceData);
  }

  clearPresence(): void {
    globalPresenceData = {
      image: '',
      imageAltText: '',
      smallImage: '',
      smallImageAltText: '',
      title: '',
      line1: '',
      line2: '',
      button1Text: '',
      button1Url: '',
      button2Text: '',
      button2Url: ''
    };
    console.log(`[PresenceStore] Cleared presence data`);
  }

  getCurrentPresence(): RichPresenceData {
    return { ...globalPresenceData };
  }
}

export const presenceStore = new PresenceStore();
