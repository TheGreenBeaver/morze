import React, { createContext, useContext, useEffect, useRef, useState } from 'react';
import { node } from 'prop-types';
import { useDispatch } from 'react-redux';
import { HOST, WS_ACTION_MAPPING } from '../util/constants';
import useErrorHandler from '../hooks/use-error-handler';
import useAuth from '../hooks/use-auth';


const Context = createContext({
  send: () => {},
  unhandledError: null,
  setUnhandledError: () => {}
});

function useWs() {
  return useContext(Context);
}

function WsContext({ children }) {
  const socketRef = useRef(null);
  const waiting = useRef([]);
  const dispatch = useDispatch();
  const { isAuthorized } = useAuth();
  const [unhandledError, setUnhandledError] = useState(null);
  const handleBackendError = useErrorHandler();

  useEffect(() => {
    if (isAuthorized) {
      const socket = new WebSocket(`ws${HOST}/ws`);

      socket.onopen = () => {
        waiting.current.forEach(({ url, data }) => {
          send(url, data);
        });
      }

      socket.onmessage = e => {
        const { url, status, data } = JSON.parse(e.data);

        if (status && !handleBackendError({ response: { status } })) {
          setUnhandledError(data);
        } else if (!status) {
          dispatch(WS_ACTION_MAPPING[url](data));
        }
      };

      // TODO: onerror

      socketRef.current = socket;
    }

    return () => {
      if (socketRef.current) {
        socketRef.current.close(1000);
        socketRef.current = null;
      }
    }
  }, [isAuthorized]);

  function send(url, data) {
    if (socketRef.current) {

      if (socketRef.current.readyState !== WebSocket.OPEN) {
        waiting.current.push({ url, data });
        return;
      }

      setUnhandledError(null);
      const toSend = { url };
      if (data) {
        toSend.data = data;
      }
      socketRef.current.send(JSON.stringify(toSend));
    }
  }

  return (
    <Context.Provider value={{ send, unhandledError, setUnhandledError }}>
      {children}
    </Context.Provider>
  );
}

WsContext.propTypes = {
  children: node.isRequired
};

export default WsContext;
export { useWs };