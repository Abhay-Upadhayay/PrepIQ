import jwt from "jsonwebtoken";
import config from "../config/config.js";
import { User } from "../models/user.model.js";

export const authMiddleware = async (req, res, next) => {
    try {
        let token;

        // Check for token in Authorization header
        if (req.headers.authorization && req.headers.authorization.startsWith("Bearer ")) {
            token = req.headers.authorization.split(" ")[1];
        } 
        // Fallback to checking cookies if cookie-parser is used
        else if (req.cookies && req.cookies.token) {
            token = req.cookies.token;
        }

        if (!token) {
            return res.status(401).json({ message: "Not authorized, no token provided" });
        }

        // Verify token
        const decoded = jwt.verify(token, config.jwtSecret);

        // Find user by id and exclude the password field
        const currentUser = await User.findById(decoded.id).select("-password");

        if (!currentUser) {
            return res.status(401).json({ message: "Not authorized, user no longer exists" });
        }

        // Attach user to request object
        req.user = currentUser;
        next();
    } catch (error) {
        if (error.name === "TokenExpiredError") {
            return res.status(401).json({ message: "Not authorized, token expired" });
        }
        res.status(401).json({ message: "Not authorized, token failed" });
    }
};
