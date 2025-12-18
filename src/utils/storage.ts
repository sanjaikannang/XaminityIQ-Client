export function setItemInStorage<T>({
  key,
  value,
}: {
  key: string;
  value: T;
}): void {
  try {
    const storage = localStorage;
    storage.setItem(key, JSON.stringify(value));
  } catch (error) {    
    console.error(`Error setting item in local storage":`, error);
  }
}

export function getItemFromStorage<T>({
  key,
}: {
  key: string;  
}): T | null {
  try {
    const storage = localStorage;
    const raw = storage.getItem(key);

    if (!raw) return null;

    try {
      return JSON.parse(raw) as T;
    } catch {
      // If it's not valid JSON (like a JWT), just return the string
      return raw as T;
    }

  } catch (error) {
    console.error(`Error getting item from local storage:`, error);
    return null;
  }
}


export function removeItemFromStorage({
  key,  
}: {
  key: string;
}): void {
  try {
    const storage = localStorage;
    storage.removeItem(key);
  } catch (error) {
    console.error(`Error removing item in Storage:`, error);
  }
}

export function clearStorage(): void {
  try {
    const storage = localStorage;
    storage.clear();
  } catch (error) {
    console.error(`Error clearing items in Storage:`, error);
  }
}
