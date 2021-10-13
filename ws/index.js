const WebSocket = require('ws');
const settings = require('../config/settings');
const { EVENTS, wsResp, wsErr, wsBroadcast, handleError } = require('../util/ws');
const httpStatus = require('http-status');
const { checkAuthorization } = require('../util/method-handlers');
const { AuthError } = require('../util/custom-errors');
const path = require('path');
const { isEmpty } = require('lodash');


function useWs(server) {
  const wsServer = new WebSocket.Server({
    noServer: true,
    path: settings.WS_PATH,
    clientTracking: true
  });

  wsServer.on(EVENTS.connection, (ws, req, user) => {
    console.log(`New WebSocket connection established for ${user.username}`);
    ws.user = user;

    ws.on(EVENTS.message, rawMessage => {
      const message = JSON.parse(rawMessage);
      const endpoint = message.url;
      console.log(`WS ${endpoint}`);
      const [view, action] = endpoint.split('/');
      const handler = require(path.join(__dirname, `${view}.js`))[action];
      if (handler) {
        handler(message.data, {
          user,
          resp: (toSend, status = httpStatus.OK) => wsResp({ data: toSend, url: endpoint, status }, ws),
          broadcast: (dataConfig, { skipCurrent, extraCondition, status = httpStatus.OK } = {}) => {
            const args = [wsServer, endpoint, status, dataConfig];
            const config = {};
            if (skipCurrent) {
              config.current = ws;
            }
            if (extraCondition) {
              config.extraCondition = extraCondition;
            }
            if (!isEmpty(config)) {
              args.push(config);
            }
            wsBroadcast(...args);
          }
        }).catch(e => handleError(ws, endpoint, e));
      } else {
        wsErr(ws, 'NOT_IMPLEMENTED');
      }
    });
  });

  server.on(
    EVENTS.upgrade,
    (req, socket, head) => {
      console.log('New WebSocket connection request...');
      const cookieHeader = req.headers.cookie;
      const cookies = cookieHeader ? cookieHeader.split('; ') : [];
      const key = cookies.find(cookie => cookie.startsWith('Token='));
      checkAuthorization(cookieHeader ? key.replace('Token=', '') : '')
        .then(authToken => {
          wsServer.handleUpgrade(req, socket, head, ws => {
            wsServer.emit(EVENTS.connection, ws, req, authToken.user);
          });
        })
        .catch(e => {
          const code = e instanceof AuthError ? 'UNAUTHORIZED' : 'INTERNAL_SERVER_ERROR';
          console.log(`WebSocket connection refused: ${code}`);
          socket.write(JSON.stringify({ status: httpStatus[code] }));
          socket.destroy();
        });
    }
  );
}

module.exports = useWs;