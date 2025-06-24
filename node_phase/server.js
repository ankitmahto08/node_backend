const express = require("express");
const app = express();
const path = require("path");
const { logger } = require('./middleware/logEvents');
const errorHandler = require('./middleware/errHandler');
const cors = require('cors');
const homeRouter = require('./routes/homeRouter')
const employeeRouter = require('./routes/api/employeeRouter')
const registerRouter= require('./routes/registerRouter')
const authRouter= require('./routes/authRouter')
const port = process.env.PORT || 3000;
const cookieParser = require('cookie-parser')
// Built-in middleware
app.use(express.urlencoded({ extended: false })); // Parses form data
app.use(express.json()); // Parses JSON
app.use('/', express.static(path.join(__dirname, 'public'))); // Serves static files
app.use('/subdir', express.static(path.join(__dirname, 'public'))); // Serves static files
app.use(cookieParser())
// 3rd party CORS config
const whitelist = ["https://www.google.com", "http://localhost:5173"];
const corsOptions = {
  origin: (origin, callback) => {
    if (whitelist.indexOf(origin) !== -1 || !origin) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  optionsSuccessStatus: 200
};
app.use(cors(corsOptions));

// Custom middleware
app.use(logger);

// Routes
app.use('/', homeRouter)
app.use('/register', registerRouter)
app.use('/auth',authRouter)

app.use('/api/employee',employeeRouter)

app.get(/^\/$|^\/index(\.html)?$/, (req, res) => {
  res.sendFile('./views/index.html', { root: __dirname });
});

app.get(/^\/new-page(\.html)?$/, (req, res) => {
  res.sendFile('./views/new-page.html', { root: __dirname });
});

app.get(/^\/old-page(\.html)?$/, (req, res) => {
  res.redirect(301, '/new-page.html');
});

// 404 handler
app.all(/^\/.*$/, (req, res) => {
  res.status(404);
  if (req.accepts('html')) {
    res.sendFile(path.join(__dirname, 'views', '404.html'));
  } else if (req.accepts('json')) {
    res.json({ error: "404 Not Found" });
  } else {
    res.type('txt').send('404 Not Found');
  }
});

// Global error handler
app.use(errorHandler);

// Start server
app.listen(port, () => {
  console.log('Server running on port', port);
});
