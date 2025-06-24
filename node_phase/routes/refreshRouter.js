const express = require('express');
const refreshRouter = express.Router();

const refreshController = require('../controllers/refreshController');

refreshRouter.get('/', refreshController.handleRefreshToken);

module.exports = refreshRouter;
