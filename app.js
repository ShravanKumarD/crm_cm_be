const createError = require("http-errors");
const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const http = require("http");
const debug = require("debug")("server:server");
const bodyParser = require('body-parser');

const db = require("./models");
const leadRoutes = require('./routes/lead.routes');
const userRoutes = require('./routes/user.routes');
const leadAssignment = require('./routes/leadAssignment.routes');
const { findSourceMap } = require("module");

require("dotenv").config();

const app = express();


app.set('view engine', 'ejs');

// Set the views directory (if not in the default "views" folder)
app.set('views', path.join(__dirname, 'views'));
// Middleware
app.use(cors({ origin: "*" })); 
app.use(express.json());
app.use(bodyParser.json()); 
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

// Static files for production
if (process.env.NODE_ENV === "production") {
  app.use(express.static("client/build"));
  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "client", "build", "index.html"));
  });
}
db.sequelize.sync({alter:true}).then(() => {
  console.log("Database synchronized.");
});
// Routes
app.use('/lead', leadRoutes);
app.use('/user',userRoutes);
app.use('/leadAssignment',leadAssignment)

// Catch 404 and forward to error handler
  app.use((req, res, next) => {
    next(createError(404));
  });

// Error handler
app.use((err, req, res, next) => {
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};
  res.status(err.status || 500);
  res.render("error");
});

// Normalize port and create HTTP server
const port = normalizePort(process.env.PORT || "3001");
app.set("port", port);

const server = http.createServer(app);

server.listen(port);
server.on("error", onError);
server.on("listening", onListening);

// Functions
function normalizePort(val) {
  const port = parseInt(val, 10);
  if (isNaN(port)) {
    return val; // named pipe
  }
  if (port >= 0) {
    return port; // port number
  }
  return false;
}

function onError(error) {
  if (error.syscall !== "listen") {
    throw error;
  }

  const bind = typeof port === "string" ? "Pipe " + port : "Port " + port;

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case "EACCES":
      console.error(bind + " requires elevated privileges");
      process.exit(1);
      break;
    case "EADDRINUSE":
      console.error(bind + " is already in use");
      process.exit(1);
      break;
    default:
      throw error;
  }
}

function onListening() {
  const addr = server.address();
  const bind = typeof addr === "string" ? "pipe " + addr : "port " + addr.port;
  debug("Listening on " + bind);
}

module.exports = app;
