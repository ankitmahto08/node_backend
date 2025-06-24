const express = require('express');
const logoutRouter = express.Router();
const { handleLogout } = require('../controllers/logoutController'); // Fixed path

logoutRouter.get('/', handleLogout);

module.exports = logoutRouter;
