const STORAGE_KEYS = {
    USER_ROLE: 'user_role',
    USER_DATA: 'user',
    GEMINI_API_KEY: 'gemini_api_key',
    THEME: 'theme'
};

const StorageService = {
    // User Data Management
    getUser: () => {
        const user = localStorage.getItem(STORAGE_KEYS.USER_DATA);
        return user ? JSON.parse(user) : null;
    },
    setUser: (user) => localStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(user)),
    removeUser: () => localStorage.removeItem(STORAGE_KEYS.USER_DATA),

    // Role Management
    getRole: () => localStorage.getItem(STORAGE_KEYS.USER_ROLE),
    setRole: (role) => localStorage.setItem(STORAGE_KEYS.USER_ROLE, role),
    removeRole: () => localStorage.removeItem(STORAGE_KEYS.USER_ROLE),

    // Gemini API Key
    getGeminiKey: () => localStorage.getItem(STORAGE_KEYS.GEMINI_API_KEY),
    setGeminiKey: (key) => localStorage.setItem(STORAGE_KEYS.GEMINI_API_KEY, key),

    // Theme Management
    getTheme: () => localStorage.getItem(STORAGE_KEYS.THEME),
    setTheme: (theme) => localStorage.setItem(STORAGE_KEYS.THEME, theme),

    // Clear Authentication
    clearAuth: () => {
        localStorage.removeItem(STORAGE_KEYS.USER_ROLE);
        localStorage.removeItem(STORAGE_KEYS.USER_DATA);
    }
};

export default StorageService;
