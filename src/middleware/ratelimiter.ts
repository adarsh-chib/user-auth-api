import rateLimit from "express-rate-limit";

export const apiLimiter = rateLimit({
    windowMs : 15 * 60 * 1000,
    max : 10,
    message : "too many attempt, try again later"
});

