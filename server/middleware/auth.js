import jwt from "jsonwebtoken";

export const verifyToken = (req, res, next) => {
  let token = req.headers.authorization;

  console.log("🔐 RAW HEADER:", token);

  if (!token) {
    return res.status(401).json("No token");
  }

  // 🔥 soporta "Bearer xxx" o "xxx"
  if (token.startsWith("Bearer ")) {
    token = token.split(" ")[1];
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = decoded;

    next();
  } catch (err) {
    console.log("❌ JWT ERROR:", err.message);
    return res.status(401).json("Token inválido");
  }
};
export const isAdmin = (req, res, next) => {
  if (req.user.role !== "Admin") {
    return res.status(403).json("Solo admin");
  }
  next();
};
export const getUserFromToken = () => {
  try {
    const token = localStorage.getItem("token");
    if (!token) return null;

    return JSON.parse(atob(token.split(".")[1]));
  } catch {
    return null;
  }
};