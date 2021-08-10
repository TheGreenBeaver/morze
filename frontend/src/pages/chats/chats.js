import React, { useEffect, useRef } from 'react';


function Chats() {

  const socketRef = useRef(null);

  useEffect(() => {
    const socket = new WebSocket('ws://localhost:8000/ws');

    socket.onopen = ev => {
      console.log({
        ev,
        what: 'open'
      });
    }

    socket.onmessage = ev => {
      console.log({
        ev,
        what: 'message'
      });
    }

    socketRef.current = socket;
  }, []);

  return (
    <div>
      CHATS PAGE
      <button
        onClick={() => {
          if (socketRef.current) {
            socketRef.current.send(JSON.stringify({
              url: 'chats/create',
              data: { name: 'Second Chat WOOOOOO!', invited: [3] }
            }));
          }
        }}
      >
        asdf
      </button>
    </div>
  );
}

export default Chats;