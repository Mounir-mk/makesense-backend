const express = require("express");
const path = require("path");
const cors = require("cors");
require("dotenv").config();

const router = express.Router();

// serve the uploads folder for uploaded resources
router.use(express.static(path.join(__dirname, "../uploads")));

router.options("*", cors());

// // use some application-level middlewares
// let allowedOrigins = ["http://localhost:3000"];

// if (process.env.NODE_ENV === "production") {
//   allowedOrigins = [process.env.FRONTEND_URL];
// }

// router.use(
//   cors({
//     // eslint-disable-next-line object-shorthand, func-names
//     origin: function (origin, callback) {
//       if (!origin) return callback(null, true);
//       if (allowedOrigins.indexOf(origin) === -1) {
//         const msg =
//           "La politique CORS ne permet pas l'accès à cette ressource pour cette origine spécifique.";
//         return callback(new Error(msg), false);
//       }
//       return callback(null, true);
//     },
//   })
// );

router.use(cors({ origin: "*" }));

// prefix all routes with /api
router.use("/api", router);

const decisionControllers = require("./controllers/decisionControllers");
const userControllers = require("./controllers/userControllers");
const {
  hashPassword,
  verifyPassword,
  refreshTokens,
  verifyToken,
} = require("./services/auth");

router.post(
  "/users/login",
  userControllers.getUserByEmailWithPasswordAndPassToNext,
  verifyPassword
);

router.post(
  "/users",
  userControllers.uploadFile,
  userControllers.handleFile,
  hashPassword,
  userControllers.add
);

router.post("/token", refreshTokens);

router.use(verifyToken);

// route concernings decisions

router.get("/decisions", decisionControllers.browse);
router.get("/decisions/:id", decisionControllers.read);
router.put("/decisions/:id", decisionControllers.edit);
router.post("/decisions", decisionControllers.add);
router.delete("/decisions/:id", decisionControllers.destroy);
router.post(
  "/decisions/:decisionId/comments",
  decisionControllers.addCommentToDecision
);

// route concernings users
router.get("/users/decisions", userControllers.browseAndCountDecisions);
router.get("/users", userControllers.browse);
router.get("/users/:id", userControllers.read);
router.put("/users/:id", hashPassword, userControllers.edit);
router.delete("/users/:id", userControllers.destroy);

router.get("/", (req, res) => {
  res.send({
    message: "Welcome to the API",
    environment: process.env.NODE_ENV,
  });
});

module.exports = router;
