import rateLimit from "express-rate-limit";

const rateLimiterConfig = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 1000,
    standardHeaders: true,
    legacyHeaders: false,
    statusCode: 429,
    message: {
        error: "Too many requests from this IP, please try again later.",
    }
});

export default rateLimiterConfig;