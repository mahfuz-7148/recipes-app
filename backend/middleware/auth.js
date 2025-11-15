import jwt from "jsonwebtoken";

export const verifyToken = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader?.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        message: "No token provided"
      });
    }

    const token = authHeader.split(" ")[1];

    const decoded = await jwt.verify(token, process.env.SECRET_KEY);
    console.log('Decoded token:', decoded);

    req.user = decoded;
    next();
  } catch (error) {
    const message = {
      TokenExpiredError: "Token expired",
      JsonWebTokenError: "Invalid token",
      NotBeforeError: "Token not active yet"
    }[error.name] || "Authentication failed";

    return res.status(401).json({
      success: false,
      message
    });
  }
};

export default verifyToken;