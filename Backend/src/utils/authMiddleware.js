const jwt = require("jsonwebtoken");
const { secretKey } = require("../configuration/jwtConfig");  // Destructure here
const sessionService = require("../services/session");

// Checks the access token AND that its session still exists (not logged out / revoked).
// All failures are 401 so the frontend knows to refresh or log in again.
async function authenticateToken(req, res, next) {
    const authHeader = req.header("Authorization");  // Changed to "Authorization"
    if (!authHeader) {
        return res.status(401).json({ message: "Unauthorized: Missing token!" });
    }
    const [bearer, token] = authHeader.split(" ");
    if (bearer !== "Bearer" || !token) {
        return res.status(401).json({ message: "Unauthorized: Invalid token format" });
    }

    let user;
    try {
        user = jwt.verify(token, secretKey);
    } catch (err) {
        const expired = err.name === "TokenExpiredError";
        return res.status(401).json({ message: expired ? "Session token expired" : "Unauthorized: Invalid Token" });
    }
    if (user.type !== "access" || !user.sid) {
        return res.status(401).json({ message: "Unauthorized: Invalid Token" });
    }

    try {
        if (!(await sessionService.isSessionActive(user.sid, user.id))) {
            return res.status(401).json({ message: "Session has ended, please log in again" });
        }
    } catch (error) {
        console.log(error.message);
        return res.status(500).json({ message: "Server error" });
    }

    req.user = user;
    req.sessionId = user.sid;
    next();
}

module.exports = { authenticateToken };
