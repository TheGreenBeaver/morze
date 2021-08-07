const express = require('express');
const settings = require('./config/settings');
const useRouting = require('./routing/index');
const useMiddleware = require('./middleware/index');


const app = express();

// Middleware
useMiddleware(app, { prefix: 'app-level.' });
// API
useRouting(app);
// Error handlers
useMiddleware(app, { prefix: 'errors.' });

app.listen(settings.PORT, () => console.log(`Server is running on port ${settings.PORT}...`));