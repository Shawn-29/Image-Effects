/**
 * Attempts to return a value from local storage.
 * 
 * @param key
 * 
 * @returns The value associated with a given key or null if the corresponding
 * value couldn't be found or local storage is disabled.
 */
export const getStorageValue = (key: string) : string | null => {
    
    try {
        return window.localStorage.getItem(key);
    } catch (_) {
        return null;
    }
};

/**
 * Sets a local storage value corresponding with a given key.
 * 
 * @param key
 *
 * @param value
 *
 * @returns Returns true if the value was set or false otherwise, such as from
 * local storage being disabled.
 */
export const setStorageValue = (key: string, value: string) : boolean => {
    try {
        window.localStorage.setItem(key, value);
        return true;
    } catch (_) {
        return false;
    }
};