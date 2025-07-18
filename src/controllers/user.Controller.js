import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/userModel.js";
// Function to generate JWT token

const generateToken = (user) => {
  const SECRET = process.env.JWT_SECRET;
  console.log(process.env.JWT_SECRET);

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
    const options = {
      expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // 3 days
      httpOnly: true,
      secure: false,
      sameSite: "strict" // Adjust as needed
    };
    const token = generateToken(newUser);
    if (!token) {
      return res.status(500).json({ error: "Failed to generate token" });
    }
    return res.cookie("authtoken", token, options).status(200).json({
      data: newUser, message: "user registered successful"
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: error.message });
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
const Profile = async(req, res) => {
  try {
    console.log(req.user);
    const id=req.user.id;
    if(!id) {
      return res.status(400).json({ error: "User ID is required" });
    }
    const user=await User.findById(id ).select("-password -__v");
    if(!user) {
      return res.status(404).json({ error: "User not found" });
    }
    
   return  res.status(200).json({user, message: "your profile" });

  } catch (error) {
   return  res.status(500).json({ error: error.message });

  }
};

const updateUserProfile = async (req, res) => {
  try {
    const { name, email, phone } = req.body;
    const userId = req.user.id;

    if (!userId) {
      return res.status(400).json({ error: "User ID is required" });
    }

    const existingUser = await User.findById(userId);
    if (!existingUser) {
      return res.status(404).json({ error: "User not found" });
    }

    // If email is provided and it's different from the current email, check for duplicates
    if (email && email !== existingUser.email) {
      const emailExists = await User.findOne({ email });
      if (emailExists) {
        return res.status(409).json({ error: "Email already exists" });
      }
    }

    // Build update object only with provided fields
    const updateFields = {};
    if (name) updateFields.name = name;
    if (email) updateFields.email = email;
    if (phone) updateFields.phone = phone;

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      updateFields,
      { new: true, runValidators: true }
    );

    return res.status(200).json({ message: "Profile updated successfully", user: updatedUser });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

const updatePassword = async (req, res) => {
  try {
    const {  newPassword } = req.body;
    const userId = req.user.id;
    if(!newPassword || newPassword.length < 6) {
      return res.status(400).json({ error: "New password is required and must be at least 6 characters long" });
    }

    if (!userId) {
      return res.status(400).json({ error: "User ID is required" });
    }
    

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const isPasswordCorrect = await bcrypt.compare(newPassword, user.password);
    if (isPasswordCorrect) {
      return res.status(401).json({ error: "both password are same" });
    }

    const hashedNewPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedNewPassword;
    await user.save();

    return res.status(200).json({ message: "Password updated successfully",user });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

// book the service








export { registerUser, userLogin, Profile ,updateUserProfile,updatePassword};