
export interface Contact {
  id: string;
  name: string;
  mobile: string;
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
