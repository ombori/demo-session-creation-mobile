import React, { useEffect, useCallback, useState } from 'react';
import { getInstance as gs } from '@ombori/grid-signals-react';
import styled from 'styled-components';
import { clearCachedSessionId } from './utils/local-cache';
import { formatRemoteKey } from 'utils/format-remote-key';


function App({ isFreshSession }: { isFreshSession: boolean }) {
  const [canControl, setCanControl] = useState(false);
  const [hasCompletedInit, setHasCompletedInit] = useState(false);
  const [hasRequestedNewSession, setHasRequestedNewSession] = useState(false);
  const [isInvalidSession, setIsInvalidSession] = useState(false);

  const clientId = gs().getInstanceProps().clientId || '';

  const checkAndSetControlsFromState = useCallback((spaceState: Record<string, any>) => {
    const remoteSessionKey = formatRemoteKey(clientId);
    const myActiveSession = spaceState[remoteSessionKey];
    setCanControl(!!myActiveSession);
    if (myActiveSession) {
      setHasCompletedInit(true);
    }
  }, [clientId]);

  useEffect(() => {
    const establishSession = async () => {
      if (isFreshSession) {
        setTimeout(() => {
          gs().sendCustomEvent({
            eventType: `GWREMOTE_REQUEST`,
            interaction: true,
            str1: clientId,
          });
        }, 1000);
        
        setHasRequestedNewSession(true);
      } else {
        const spaceState: any = await gs().getSpaceState();
        checkAndSetControlsFromState(spaceState);
        setHasCompletedInit(true);
      }
    }

    establishSession();
  }, [checkAndSetControlsFromState, clientId, isFreshSession]);

  useEffect(() => {
    if (hasRequestedNewSession) {
      setTimeout(() => {
        console.log('lol');
        let invalidSession = false;
        setHasCompletedInit(status => {
          if (!status) {
            invalidSession = true;
            return false;
          }

          return true;
        });

        if (invalidSession) {
          clearCachedSessionId();
        }
        setIsInvalidSession(invalidSession);
      }, 7000);
    }
  }, [hasRequestedNewSession, isFreshSession]);

  useEffect(() => {
    const startSpaceSubscription = async () => {
      const spaceStateSubscription = await gs().subscribeSpaceState((spaceState) => {
        checkAndSetControlsFromState(spaceState);
        console.log('spaceState:', spaceState);
      });

      const spaceState: any = await gs().getSpaceState();
      console.log('spaceState:', spaceState);
      checkAndSetControlsFromState(spaceState);

      return () => {
        spaceStateSubscription.stop();
      }
    }

    startSpaceSubscription();
  }, [checkAndSetControlsFromState, clientId]);

  if (isInvalidSession) {
    return <div>Failed to establish connection</div>;
  }

  if (!hasCompletedInit) {
    return <div>Establishing connection...</div>;
  }

  return (
    <Container>
      <div>Show gate statuses</div>
      {canControl && <div>Show gate controls</div>}
    </Container>
  );
}

const Container = styled.div`
  text-align: center;
  background-color: #282c34;
  height: 100%;
  position: absolute;
  display: flex;
  flex-direction: column;
  width: 100%;
  color: white;
  align-items: center;
  justify-content: center;
  font-size: calc(10px + 1.5vmin);
`;

export default App;
