const settings = require('./config/settings');
const useRouting = require('./routing/index');
const useMiddleware = require('./middleware/index');
const { app, server } = require('./util/make-server');


// Middleware
useMiddleware(app, { prefix: 'app-level.' });
// API
useRouting(app);
// Error handlers
useMiddleware(app, { prefix: 'errors.' });

server.listen(settings.PORT, () => console.log(`Server is running on port ${settings.PORT}...`));