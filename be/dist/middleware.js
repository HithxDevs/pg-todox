"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.middleware = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const config_1 = require("./config");
const middleware = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (authHeader) {
        const token = authHeader.split(' ')[1];
        try {
            const decoded = jsonwebtoken_1.default.verify(token, config_1.JWT_SECRET);
            req.user = decoded.userId; // ONLY store the userId
            console.log('userid:', decoded); // Should be a number or string, not an object
            next();
        }
        catch (err) {
            return res.status(401).json({ message: 'Invalid token' });
        }
    }
    else {
        res.status(401).json({ message: 'Unauthorized' });
    }
};
exports.middleware = middleware;
