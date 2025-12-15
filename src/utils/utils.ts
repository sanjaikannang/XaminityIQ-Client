type StorageType = "local" | "session";

function getStorage(type: StorageType): Storage {
    return type === "local" ? localStorage : sessionStorage;
}

export function getItemFromStorage<T>({
    key,
    type = "local",
}: {
    key: string;
    type?: StorageType;
}): T | null {
    try {
        const storage = getStorage(type);
        const raw = storage.getItem(key);

        if (!raw) return null;

        try {
            return JSON.parse(raw) as T;
        } catch {
            // If it's not valid JSON (like a JWT), just return the string
            return raw as T;
        }

    } catch (error) {
        // eslint-disable-next-line
        console.error(`Error getting ${type}Storage item "${key}":`, error);
        return null;
    }
}