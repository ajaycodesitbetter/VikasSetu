export type District = "gwalior" | "bhind" | "morena";
export type Category = "roads" | "water" | "sanitation" | "health" | "electricity" | "other";
export type MapMode = "needs" | "works" | "facilities";
export type OfficialFeedback = { message: string; date: string; author: string };

export type Issue = {
  id: string;
  district: District;
  mode: MapMode;
  category: Category;
  title: string;
  description: string;
  department: string;
  date: string;
  status: string;
  lat: number;
  lng: number;
  location: string;
  photo?: string;
  sample?: boolean;
  feedback?: OfficialFeedback[];
};

const DB_NAME = "vikassetu-prototype";
const STORE = "citizen-reports";

function openDb(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, 1);
    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(STORE)) db.createObjectStore(STORE, { keyPath: "id" });
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

export async function readReports(): Promise<Issue[]> {
  const db = await openDb();
  return new Promise((resolve, reject) => {
    const request = db.transaction(STORE, "readonly").objectStore(STORE).getAll();
    request.onsuccess = () => resolve(request.result as Issue[]);
    request.onerror = () => reject(request.error);
  });
}

export async function saveReport(issue: Issue): Promise<void> {
  const db = await openDb();
  return new Promise((resolve, reject) => {
    const request = db.transaction(STORE, "readwrite").objectStore(STORE).put(issue);
    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
  });
}
