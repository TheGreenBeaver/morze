import React, { createContext, useContext, useEffect, useRef, useState } from 'react';
import { node } from 'prop-types';
import { useDispatch } from 'react-redux';
import { WS_ENDPOINTS} from '../util/constants';
import useErrorHandler from '../hooks/use-error-handler';
import { addChat, setChats } from '../store/actions/chats';
import { setWsReady } from '../store/actions/general';
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
  const dispatch = useDispatch();
  const { isAuthorized } = useAuth();
  const [unhandledError, setUnhandledError] = useState(null);
  const handleBackendError = useErrorHandler();

  useEffect(() => {
    if (isAuthorized) {
      const socket = new WebSocket('ws://localhost:8000/ws');

      socket.onopen = () => {
        dispatch(setWsReady(true));
      }

      socket.onmessage = e => {
        const { url, status, data } = JSON.parse(e.data);

        if (status && !handleBackendError({ response: { status } })) {
          setUnhandledError(data);
        } else {
          switch (url) {
            case WS_ENDPOINTS.chats.list:
              dispatch(setChats(data));
              break;
            case WS_ENDPOINTS.chats.create:
              dispatch(addChat(data));
              break;
            case WS_ENDPOINTS.messages.send:
              console.log(data);
              break;
            default:
          }
        }
      };

      socket.onclose = () => {
        dispatch(setWsReady(false));
      }

      // onerror

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