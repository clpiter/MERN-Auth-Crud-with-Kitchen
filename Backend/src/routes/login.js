const express = require("express");
const {login,refreshToken,logout} = require("../controllers/login");
const sessionController = require("../controllers/session");
const {authenticateToken} = require("../utils/authMiddleware");

const router = express.Router();

router.post("/login",login);
router.post("/refresh-token",refreshToken);
router.post("/logout",logout);

// Active sessions (devices) of the logged-in user
router.get("/sessions",authenticateToken,sessionController.getSessions);
router.delete("/sessions",authenticateToken,sessionController.revokeOtherSessions);
router.delete("/sessions/:id",authenticateToken,sessionController.revokeSession);

module.exports= router;
