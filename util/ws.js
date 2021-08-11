const httpStatus = require('http-status');
const WebSocket = require('ws');
const { ValidationError } = require('sequelize');
const { getValidationErrJson, dummyPromise, noOp } = require('./misc');


const EVENTS = {
  upgrade: 'upgrade',
  connection: 'connection',
  message: 'message',
  error: 'error',
  open: 'open',
};

/**
 * @typedef WsResponse
 * @type {Object}
 * @property {string|undefined} url
 * @property {object|undefined} data
 * @property {number|undefined} status
 */

/**
 * @param {WsResponse} response
 * @param {WebSocket} ws
 * @returns {string}
 */
function wsResp(response, ws) {
  ws.send(JSON.stringify(response));
}

/**
 *
 * @param {WebSocket} ws
 * @param {string} code
 * @param {string=} endpoint
 */
function wsErr(ws, code, endpoint) {
  const toSend = { status: httpStatus[code] };
  if (endpoint) {
    toSend.url = endpoint;
  }
  wsResp(toSend, ws);
}

/**
 *
 * @param {any} wsServer
 * @param {WsResponse} response
 * @param {WebSocket=} current provide this only when broadcasting to everyone except current
 * @param {function(): Promise=} extraCondition
 */
function wsBroadcast(
  wsServer, response,
  { current, extraCondition = dummyPromise } = {}
) {
  wsServer.clients.forEach(client => {
    if (
      (!current || client !== current) &&
      client.readyState === WebSocket.OPEN
    ) {
      extraCondition(client).then(() => wsResp(response, client)).catch(noOp);
    }
  });
}

function handleError(ws, endpoint, e) {
  const custom = data => wsResp({
    status: httpStatus.BAD_REQUEST,
    url: endpoint,
    data
  }, ws);
  const e500 = () => wsErr(ws, 'INTERNAL_SERVER_ERROR', endpoint);

  if (e instanceof ValidationError) {
    custom(getValidationErrJson(e));
  } else if (e instanceof Error) {
    e500();
  } else if (typeof e === 'object') {
    custom(e);
  } else {
    e500();
  }
}

module.exports = {
  wsResp,
  wsErr,
  wsBroadcast,
  handleError,

  EVENTS,
};