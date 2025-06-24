const { format } = require('date-fns');
const { v4: uuid } = require('uuid');
const express = require("express");
const app = express();
const path = require('path');
const fs = require('fs');
const fsPromises = fs.promises;

const logEvents = async (message, fileName) => {
  const dateTime = format(new Date(), "dd:MM:yyyy\tHH:mm:ss");
  const logItem = `${dateTime}\t${uuid()}\t${message}\n`;

  try {
    const logDir = path.join(__dirname, '..', 'logs');
    if (!fs.existsSync(logDir)) {
      await fsPromises.mkdir(logDir, { recursive: true });
    }

    await fsPromises.appendFile(path.join(logDir, fileName), logItem);
  } catch (error) {
    console.log(error.message);
  }
};

const logger = (req, res, next) => {
  logEvents(`${req.method}\t${req.headers.origin || 'unknown'}\t${req.url}`, 'reqLog.txt');
  console.log(`${req.method} ${req.url}`);
  next();
};

module.exports = { logEvents, logger };
