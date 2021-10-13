import React, { createContext, useContext, useEffect, useRef, useState } from 'react';
import { node } from 'prop-types';
import { useDispatch } from 'react-redux';
import { ERROR_RESP_THRESHOLD, HOST, WS_ACTION_MAPPING } from '../util/constants';
import useErrorHandler from '../hooks/use-error-handler';
import useAuth from '../hooks/use-auth';
import { omit } from 'lodash';


const Context = createContext({
  send: () => {},
  unhandledError: null,
  setUnhandledError: () => {},
  eventsData: {}
});

function useWs() {
  return omit(useContext(Context), 'eventsData');
}

function useWsEvent(url, callback, extraDeps = []) {
  const { eventsData } = useContext(Context);
  const data = Array.isArray(url) ? url.map(u => eventsData[u]) :  [eventsData[url]];

  useEffect(() => {
    if (data.some(d => !!d)) {
      callback(...data, ...extraDeps);
    }
  }, [...data, ...extraDeps])
}

function WsContext({ children }) {
  const socketRef = useRef(null);
  const waiting = useRef([]);
  const dispatch = useDispatch();
  const { isAuthorized } = useAuth();
  const [unhandledError, setUnhandledError] = useState(null);
  const [eventsData, setEventsData] = useState({});
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

        if (status >= ERROR_RESP_THRESHOLD && !handleBackendError({ response: { status } })) {
          setUnhandledError(data);
        } else {
          dispatch(WS_ACTION_MAPPING[url](data));
          setEventsData(curr => ({ ...curr, [url]: data }));
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
    <Context.Provider value={{ send, unhandledError, setUnhandledError, eventsData }}>
      {children}
    </Context.Provider>
  );
}

WsContext.propTypes = {
  children: node.isRequired
};

export default WsContext;
export { useWs, useWsEvent };