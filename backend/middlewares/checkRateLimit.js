import RateLimit from "../models/RateLimit.js";

const checkRateLimit = async (req, res, next) => {
  try {

    const ip = req.ip || req.headers["x-forwarded-for"] || req.connection.remoteAddress;
    const now = new Date();
    const limitDuration = 60 * 60 * 1000; // 1 hour in milliseconds

    //   Find rate limit record for this ip
    let limit = await RateLimit.findOne({ ipAddress: ip });

  
    if (!limit) {
      limit = await RateLimit.create({
        ipAddress: ip,
        count: 1,
        resetTime: new Date(now.getTime() + limitDuration),
      });
    } else {
    
      if (now > limit.resetTime) {
        limit.count = 1;
        limit.resetTime = new Date(now.getTime() + limitDuration);
      } else {
       
        limit.count++;
      }

 
      await limit.save();
    }


    if (limit.count > 5) {
      return res.status(429).json({
        success: false,
        error: "Rate limit exceeded. Try again later.",
        resetTimestamp: limit.resetTime.getTime() 
      });
    }


    next();

  } catch (error) {
    console.error("Rate limit error", error);
    res.status(500).json({
      success: false,
      error: "Rate limit check failed",
    });
  }
};

export default checkRateLimit;
