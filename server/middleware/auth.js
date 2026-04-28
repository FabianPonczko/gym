import jwt from "jsonwebtoken";

export const verifyToken = (req, res, next) => {
  const token = req.headers.authorization;

  if (!token) return res.status(401).json("No autorizado");

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch {
    res.status(401).json("Token inválido");
  }
};
export const isAdmin = (req, res, next) => {
  if (req.user.role !== "admin") {
    return res.status(403).json("Solo admin");
  }
  next();
};