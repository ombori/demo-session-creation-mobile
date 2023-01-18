import { useEffect, useState } from 'react';
import qs from 'query-string';
import { getCachedSessionId, setCachedSessionId } from './utils/local-cache';

export default function useSessionInit() {
  const [sessionId, setSessionId] = useState('');
  const [isFreshSession, setIsFreshSession] = useState(false);
  const [status, setStatus] = useState<'loading' | 'ready' | 'error'>('loading');

  useEffect(() => {
    const [newLoc, paramsString] = `${window.parent.parent.location.href}`.split('#');

    // Append the hash to avoid triggering page reloads but use replace to avoid poisioning browser history
    window.parent.parent.location.replace(`${newLoc}#`);

    const params = qs.parse(paramsString);
    const cachedSessionId = getCachedSessionId();
    const urlBasedSession = params.s as string;
    const curSessionId = urlBasedSession || cachedSessionId;

    if (curSessionId) {
      setIsFreshSession(!!urlBasedSession);
      setSessionId(curSessionId);
      setCachedSessionId(curSessionId);
      setStatus('ready');
    } else {
      setStatus('error');
    }
  }, []);

  return { sessionId, status, isFreshSession };
}