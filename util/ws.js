const httpStatus = require('http-status');
const WebSocket = require('ws');


const EVENTS = {
  upgrade: 'upgrade',
  connection: 'connection',
  message: 'message',
  error: 'error',
};

function formatWsResponse(response) {
  return JSON.stringify({ response });
}

function ws500(ws) {
  ws.send(formatWsResponse({ status: httpStatus.INTERNAL_SERVER_ERROR }));
}

// Provide 'current' only when broadcasting to everyone except current
function broadcast(wsServer, data, current) {
  wsServer.clients.forEach(client => {
    if ((!current || client !== current) && client.readyState === WebSocket.OPEN) {
      client.send(formatWsResponse(data));
    }
  });
}

module.exports = {
  formatWsResponse,
  ws500,
  broadcast,

  EVENTS
};