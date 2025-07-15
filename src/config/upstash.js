import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";
import "dotenv/config";

// Upstash Redis to create a rate limiter which used to limit the number of requests a user can
const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.fixedWindow(30, "60 s"), // 10 requests every 10 seconds
});

export default ratelimit;
