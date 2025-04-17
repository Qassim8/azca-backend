import jwt from "jsonwebtoken";

const JWT_SECRET = "your_jwt_secret_key";

export const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Unauthorized: No token provided" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded; // هتلاقي فيها id و email أو أي بيانات خزنتها في التوكن
    next();
  } catch (err) {
    res.status(401).json({ error: "Unauthorized: Invalid token" });
  }
};

// middlewares/optionalToken.js

export const optionalToken = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (authHeader && authHeader.startsWith("Bearer ")) {
    const token = authHeader.split(" ")[1];

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = decoded; // لو التوكن صالح
    } catch (err) {
      // لو التوكن غير صالح، نواصل بدون user
      req.user = null;
    }
  } else {
    req.user = null; // ما في توكن
  }

  next();
};
