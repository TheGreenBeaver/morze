const express = require('express');
const { createServer } = require('http');
const settings = require('./config/settings');
const useRouting = require('./routing/index');
const useMiddleware = require('./middleware/index');
const useWs = require('./ws/index');

const app = express();
const server = createServer(app);

// Middleware
useMiddleware(app, { prefix: 'app-level.' });
// Static Content
app.use(express.static(settings.STATIC_ROOT));
app.use('/media', express.static(settings.MEDIA_ROOT));
// API
useRouting(app);
// React index
app.get('/*', (req, res) =>
  res.sendFile(settings.REACT_INDEX)
)
// Error handlers
useMiddleware(app, { prefix: 'errors.' });
// WebSockets
useWs(server);

server.listen(settings.PORT, () =>
  console.log(`Server is running on port ${settings.PORT}...`)
);