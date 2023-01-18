type Session = any;
type Params = any;

const CACHED_SESSION_KEY = 'cache-session-key-a';

export const getCachedSessionId = () => window.localStorage.getItem(CACHED_SESSION_KEY);

export const setCachedSessionId = (sessionId: string) => window.localStorage.setItem(CACHED_SESSION_KEY, sessionId);

export const clearCachedSessionId = () => window.localStorage.removeItem(CACHED_SESSION_KEY);
