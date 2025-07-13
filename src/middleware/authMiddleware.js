import jwt from "jsonwebtoken";


const verifyToken = (token) => {
  try {
    return jwt.verify(token, process.env.JWT_SECRET);
  } catch (error) { 
    throw new Error("Invalid token");
  }
}


const AuthMiddleware = (req, res, next) => {
      try {
  const token =req.cookies.authtoken || req.headers.authorization?.split(" ")[1];
  console.log("Token:", token);
  
  if (!token) {
    return res.status(401).json({ error: "Unauthorized access" });
  }
    // Assuming a function verifyToken exists that verifies the token
    const user = verifyToken(token);
    req.user = user; // Attach user info to request object
    next(); // Proceed to the next middleware or route handler
  } catch (error) {
    res.status(403).json({ error: "Invalid token" });
  }
}
export default AuthMiddleware;