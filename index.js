const express = require('express');
const settings = require('./config/settings');
const useRouting = require('./routing/index');


const app = express();

// API
useRouting(app);

app.listen(settings.PORT, () => console.log(`Server is running on port ${settings.PORT}...`));