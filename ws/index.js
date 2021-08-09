const WebSocket = require('ws');
const settings = require('../config/settings');
const { server } = require('../util/make-server');
const { EVENTS } = require('../util/constants');
const { formatWsResponse } = require('../util/misc');
const httpStatus = require('http-status');
const { checkAuthorization } = require('../util/method-handlers');
const { AuthError } = require('../util/custom-errors');
const path = require('path');

const wsServer = WebSocket.Server({
  server,
  path: settings.WS_PATH,
  clientTracking: true
});

wsServer.on(EVENTS.connection, (ws, req, user) => {
  ws.on(EVENTS.message, rawMessage => {
    const message = JSON.parse(rawMessage);
    const endpoint = message.url;
    const [view, action] = endpoint.split('/');
    require(path.join(__dirname, `${view}.js`))[action](message.data, ws, user);
  });
});

server.on(EVENTS.upgrade, (req, socket, head) =>
  checkAuthorization(req.headers.authorization)
    .then(authToken => {
      wsServer.handleUpgrade(req, socket, head, ws => {
        wsServer.emit(EVENTS.connection, ws, req, authToken.user);
      });
    })
    .catch(e => {
      const code = e instanceof AuthError ? 'UNAUTHORIZED' : 'INTERNAL_SERVER_ERROR';
      socket.write(formatWsResponse(httpStatus[code]));
      socket.destroy();
    })
);