const WebSocket = require('ws');
const settings = require('../config/settings');
const { formatWsResponse, EVENTS } = require('../util/ws');
const httpStatus = require('http-status');
const { checkAuthorization } = require('../util/method-handlers');
const { AuthError } = require('../util/custom-errors');
const path = require('path');
const { camelCase } = require('lodash');
const { User } = require('../models/index');


function useWs(server) {
  const wsServer = new WebSocket.Server({
    noServer: true,
    path: settings.WS_PATH,
    clientTracking: true
  });

  wsServer.on(EVENTS.connection, (ws, req, user) => {
    console.log(`New WebSocket connection established for ${user.username}`);

    ws.on(EVENTS.message, rawMessage => {
      const message = JSON.parse(rawMessage);
      const endpoint = message.url;
      console.log(`WS ${endpoint}`);
      const [view, action] = endpoint.split('/');
      const handler = require(path.join(__dirname, `${view}.js`))[camelCase(action)];
      if (handler) {
        handler(message.data, { ws, wsServer, user });
      } else {
        ws.send(formatWsResponse({ status: httpStatus.NOT_IMPLEMENTED }));
      }
    });
  });

  server.on(
    EVENTS.upgrade,
    (req, socket, head) => {
      console.log('New WebSocket connection request...');
      const cookies = req.headers.cookie.split('; ');
      const key = cookies.find(cookie => cookie.startsWith('Token='));
      checkAuthorization(
        key.replace('Token=', ''),
        { include: { model: User, as: 'user' } }
      )
        .then(authToken => {
          wsServer.handleUpgrade(req, socket, head, ws => {
            wsServer.emit(EVENTS.connection, ws, req, authToken.user);
          });
        })
        .catch(e => {
          const code = e instanceof AuthError ? 'UNAUTHORIZED' : 'INTERNAL_SERVER_ERROR';
          console.log(`WebSocket connection refused: ${code}`);
          socket.write(formatWsResponse(httpStatus[code]));
          socket.destroy();
        });
    }
  );
}

module.exports = useWs;