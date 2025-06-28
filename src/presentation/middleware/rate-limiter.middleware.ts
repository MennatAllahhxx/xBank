import rateLimit from "express-rate-limit";

const rateLimiterConfig = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    standardHeaders: true,
    legacyHeaders: false,
});

export default rateLimiterConfig;