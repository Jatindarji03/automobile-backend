import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/userModel.js";
// Function to generate JWT token

const generateToken = (user) => {
  const SECRET = process.env.JWT_SECRET;
  return jwt.sign(
    { id: user._id, email: user.email, role: user.role },
    SECRET,
    { expiresIn: "1d" }
  );
};

const registerUser = async (req, res) => {
  try {
    const { name, email, password, phone, role } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ error: "Name, email, and password are required" });
    }
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ error: "User already exists" });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      phone,
      role
    });
    await newUser.save();
    const token = generateToken(newUser);
    res.status(201).cookie({ authtoken: token }).json({
      data: newUser,
      token,
      message: "User registered successfully"
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const userLogin = async (req, res) => {
  try {

    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
      return res.status(401).json({ error: "Invalid password" });
    }
    const options = {
      expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // 3 days
      httpOnly: true,
      secure: false,
      sameSite: "strict" // Adjust as needed
    };
    const token = generateToken(user);
    res.cookie("authtoken", token, options).status(200).json({
      data: user, message: "Login successful"
    });
  } catch (error) {
    res.status(500).json({ error: error });
  }
};
const HomePage = (req, res) => {
  try {
    console.log(req.user);
    
    res.status(200).json({ message: "Welcome to the Automobile Service API" });

  } catch (error) {
    res.status(500).json({ error: error.message });

  }
};



export { registerUser, userLogin, HomePage };