import jwt from "jsonwebtoken";
import bcypt from "bcryptjs";

// auth token generator
const generateToken = (userData) =>
  jwt.sign(
    {
      _id: userData._id,
      userName: userData.userName,
      email: userData.email,
      userType: userData.userType,
    },
    process.env.JWT_SECRET
  );

// verification of auth token
const verifyToken = (req, res, next) => {
  const token = req.header("auth-token");
  if (!token) return res.status(401).json("Access denied!");

  try {
    const verified = jwt.verify(token, process.env.JWT_SECRET);
    req.user = verified;
    next();
  } catch (error) {
    res.status(401).json("Invalid token!");
  }
};

// encryption of password
const generateHashedPassword = async (password) => {
  try {
    const salt = await bcypt.genSalt(10);
    const hashedPassword = await bcypt.hash(password, salt);
    return hashedPassword;
  } catch (error) {
    throw new Error(`Hashing Error: ${error}`);
  }
};

export { generateToken, verifyToken, generateHashedPassword };
