
export interface InteractionLog {
  id: string;
  type: 'Call' | 'SMS' | 'WhatsApp';
  timestamp: string;
  comment?: string;
  audioBase64?: string;
  imageBase64?: string;
}

export interface Contact {
  id: string;
  name: string;
  mobile: string;
  logs: InteractionLog[];
}

export interface SavedList {
  id: string;
  name: string;
  contacts: Contact[];
  createdAt: string;
  updatedAt: string;
}

export interface ContactManagerData {
  activeListId: string | null;
  savedLists: SavedList[];
}