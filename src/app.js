const express = require("express");
const cors = require("cors");
const router = require("./router");

const app = express();

// use some application-level middlewares
let allowedOrigins = ["http://localhost:3000"];

if (process.env.NODE_ENV === "production") {
  allowedOrigins = [process.env.FRONTEND_URL];
}

app.use(
  cors({
    // eslint-disable-next-line object-shorthand, func-names
    origin: function (origin, callback) {
      if (!origin) return callback(null, true);
      if (allowedOrigins.indexOf(origin) === -1) {
        const msg =
          "La politique CORS ne permet pas l'accès à cette ressource pour cette origine spécifique.";
        return callback(new Error(msg), false);
      }
      return callback(null, true);
    },
  })
);
app.use(express.json());

// Serve the uploads folder for uploaded resources

// API routes
app.use(router);

// ready to export
module.exports = app;
