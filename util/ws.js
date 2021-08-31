const httpStatus = require('http-status');
const WebSocket = require('ws');
const { ValidationError } = require('sequelize');
const { getValidationErrJson, dummyResolve, noOp } = require('./misc');
const { CustomError } = require('../util/custom-errors');


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
 * @param {function(WebSocket): Promise=} extraCondition
 * @param {function(Object, WebSocket): Object} adjustData
 */
function wsBroadcast(
  wsServer, response,
  { current, extraCondition = dummyResolve, adjustData = v => v } = {}
) {
  wsServer.clients.forEach(client => {
    if (
      (!current || client !== current) &&
      client.readyState === WebSocket.OPEN
    ) {
      const adjustedData = adjustData(response.data, client);
      extraCondition(client).then(() => wsResp({ ...response, data: adjustedData }, client)).catch(noOp);
    }
  });
}

function onlyMembers(members, client) {
  return new Promise((resolve, reject) => members.map(m => m.id).includes(client.user.id) ? resolve() : reject());
}

function handleError(ws, endpoint, e) {
  console.log(e);
  const custom = data => wsResp({
    status: httpStatus.BAD_REQUEST,
    url: endpoint,
    data
  }, ws);

  if (e instanceof ValidationError) {
    custom(getValidationErrJson(e));
  } else if (e instanceof CustomError) {
    custom(e.data);
  } else {
    wsErr(ws, 'INTERNAL_SERVER_ERROR', endpoint);
  }
}

module.exports = {
  wsResp,
  wsErr,
  wsBroadcast,
  handleError,
  onlyMembers,

  EVENTS,
};