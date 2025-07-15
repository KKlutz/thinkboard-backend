// import ratelimit
import ratelimit from "../config/upstash.js";

export const rateLimiter = async (_, res, next) => {
  try {
    const { success, limit, remaining } = await ratelimit.limit("My-Rate-Limit");
    console.log(`Rate limit: ${limit} | Remaining: ${remaining}`);

    if (!success) {
      console.log("Rate limit exceeded.");
      return res.status(429).json({ message: "Too many requests, please try again later." });
    }
    next(); // If the request is within the limit, proceed to the next middleware or route handler
  } catch (error) {
    console.error("Rate limiter error: ", error);
    next(error);
  }
};
