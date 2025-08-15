import jwt from "jsonwebtoken";

const auth = (req, res, next) => {
  const token = req.headers.authorization;
  jwt.verify(token, process.env.JWT_SECRET);
  next();
  try {
  } catch (error) {
    res.json({ success: false, message: "invalid token" });
  }
};

export default auth;
