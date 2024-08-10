export const setLocalStorage = (key: string, value: string) => {
    localStorage.setItem(key, JSON.stringify(value));
};

export const getFromLocalStorage = (key: string) => {
    const savedValue = localStorage.getItem(key);
    return savedValue ? JSON.parse(savedValue) : null;
};

export const saveArrayToLocalStorage = (key: string, array: string[]) => {
    localStorage.setItem(key, JSON.stringify(array));
};

export const getArrayFromLocalStorage = (key: string): string[] => {
    const storedValue = localStorage.getItem(key);
    return storedValue ? JSON.parse(storedValue) : [];
};
