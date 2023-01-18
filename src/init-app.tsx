import React from 'react';
import { useGridSignals } from '@ombori/grid-signals-react';
import InitSession from './init-session';
import useSessionInit from './use-session-init';

const {
  REACT_APP_ACCESS_ID,
  REACT_APP_ACCESS_TOKEN,
  REACT_APP_SPACE_ID,
  REACT_APP_TENANT_ID,
} = process.env;

const InitAppWithSignals = ({ sessionId, isFreshSession }: { sessionId: string; isFreshSession: boolean }) => {
  const isSignalsReady = useGridSignals({
    sessionId,
    accessId: REACT_APP_ACCESS_ID,
    accessToken: REACT_APP_ACCESS_TOKEN,
    spaceId: REACT_APP_SPACE_ID,
    tenantId: REACT_APP_TENANT_ID,
    useValidCachedSessionOnInit: true,
  });

  if (!isSignalsReady) {
    return <div className='init'>Initializing App...</div>
  }

  return <InitSession isFreshSession={isFreshSession} />
}

const Init = () => {
  const { sessionId, status, isFreshSession } = useSessionInit();

  switch(status) {
    case 'error':
      return <div>Error: No sessionId found in URL</div>
    case 'loading':
      return <div>Loading...</div>;
    case 'ready':
      return <InitAppWithSignals sessionId={sessionId} isFreshSession={isFreshSession} />;
    default:
      return <div>Unknown status</div>;
  }
}

export default Init;
