import HardwareShop from '../models/HardwareShopModel.js';
import getCoordinates from '../utils/getCordinates.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';


// It Will Genrate A New JWT Token Whenver The Hardware Shop Logs In Or Registers
const generateToken = (hardwareShop) => {
    const SECRET = process.env.JWT_SECRET;
    return jwt.sign(
        {
            id: hardwareShop._id,
            email: hardwareShop.email,
            role: hardwareShop.role
        },
        SECRET,
        {
            expiresIn: '1d'
        }
    );
};

// Register Hardware Shop 
const registerHardwareShop = async (req, res) => {
    try {
        const { name, email, password, location, phoneNumber, shopName } = req.body;

        //Check If The All Required Fields Are Provided
        if (!name || !email || !password || !location || !phoneNumber || !shopName) {
            return res.status(400).json({ message: "All fields are required" });
        }

        //Check If The Email Already Exists
        const existingShop = await HardwareShop.findOne({ email });
        if (existingShop) {
            return res.status(409).json({ message: "Email already exists" });
        }

        //Hash The Password
        const hashedPassword = await bcrypt.hash(password, 10);

        //Get Coordinates From The Location
        const coordinates = await getCoordinates(location);

        if (!coordinates) {
            return res.status(400).json({ message: "Invalid location" });
        }
       

        //Create A New Hardware Shop 
        const newHardwareShop = new HardwareShop({
            name: name,
            email: email,
            password: hashedPassword,
            location: {
                type: "Point",
                coordinates: coordinates
            },
            phoneNumber: phoneNumber,
            shopName: shopName
        });
     
        if (!newHardwareShop) {
            return res.status(500).json({ message: "Hardware shop creation failed" });
        }
        //genrate JWT token
        const token = generateToken(newHardwareShop);
        if (!token) {
            return res.status(500).json({ message: "Token generation failed" });
        }

        //Save The Hardware Shop To The Database
        await newHardwareShop.save();

        //Set Cookie With The JWT Token
        const cookieOptions = {
            expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // 3 days
            httpOnly: true,
            secure: false, // Set to true if using HTTPS
            sameSite: "strict", // Adjust as needed
        }
        const hardwareShopData = newHardwareShop.toObject();
        delete hardwareShopData.password;

        return res.status(201).cookie("authtoken", token, cookieOptions).json({
            message: "Hardware shop registered successfully",
            hardwareShop:hardwareShopData,
            token: token
        })


    } catch (error) {
        return res.status(500).json({ message: "Internal server error" });
    }
};

// Login Hardware Shop 
const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        //Check If The All Required Fields Are Provided
        if (!email || !password) {
            return res.status(400).json({ message: "Email and password are required" });
        }

        //Check If The Hardware Shop Exists
        const hardwareShop = await HardwareShop.findOne({ email });
        if (!hardwareShop) {
            return res.status(404).json({ message: "Hardware shop not found" });
        }

        //Check If The Password Is Correct
        const isPasswordValid = await bcrypt.compare(password, hardwareShop.password);

        if (!isPasswordValid) {
            return res.status(401).json({ message: "Invalid password" });
        }
        //Generate JWT Token
        const token = generateToken(hardwareShop);
        if (!token) {
            return res.status(500).json({ message: "Token generation failed" });
        }
        //Set Cookie With The JWT Token
        const cookieOptions = {
            expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // 3 days
            httpOnly: true,
            secure: false, // Set to true if using HTTPS
            sameSite: "strict", // Adjust as needed
        }
          const hardwareShopData = hardwareShop.toObject();
          delete hardwareShopData.password;

        return res.status(200).cookie("authtoken", token, cookieOptions).json({
            message: "Hardware shop logged in successfully",
            hardwareShop: hardwareShop,
            token: token
        });


    } catch (error) {
       return res.status(500).json({ message: "Internal server error" });
    }
};

//Update Hardware Shop Profile
const updateHardwareShopProfile = async (req, res) => {
    try {
        const { name, email, location, phoneNumber, shopName } = req.body;
        const hardwareShopId = req.params.id;
        const updateFields = {};
        if (name) updateFields.name = name;

        //check if email is already exists
        if (email) {
            const existingShop = await HardwareShop.findOne({ email: email });
            if (existingShop) {
                return res.status(409).json({ message: "Email already exists" });
            } else {
                updateFields.email = email;
            }
        }

        //Converting Location To Coordinates
        if (location) {
            //Get Coordinates From The Location
            const coordinates = await getCoordinates(location);
            if (!coordinates) {
                return res.status(400).json({ message: "Invalid location" });
            } else {
                updateFields.location = {
                    type: "Point",
                    coordinates: coordinates
                };
            }
        }
        if (phoneNumber) updateFields.phoneNumber = phoneNumber;
        if (shopName) updateFields.shopName = shopName;

        //Update The Hardware Shop Profile
        const updateHardwareShop = await HardwareShop.findByIdAndUpdate(
            hardwareShopId,
            updateFields,
            { new: true }
        );

        if (!updateHardwareShop) {
            return res.status(404).json({ message: "Hardware shop not found" });
        }

        const hardwareShopData = updateHardwareShop.toObject();
        delete hardwareShopData.password;
        return res.status(200).json({
            message: "Hardware shop profile updated successfully",
            hardwareShop: hardwareShopData
        });

    } catch (error) {
        return res.status(500).json({ message: "Internal server error" });
    }

};

//Get The Hardware Shop Profile
const getHardwareShopProfile = async (req, res) => {
    try{
        const hardwareShopId = req.params.id;
        //Find The Hardware Shop By Id
        const hardwareShop = await HardwareShop.findById(hardwareShopId);
        if (!hardwareShop) {
            return res.status(404).json({ message: "Hardware shop not found" });
        }
        const hardwareShopData = hardwareShop.toObject();
        delete hardwareShopData.password;
        return res.status(200).json({
            message: "Hardware shop profile fetched successfully",
            hardwareShop:hardwareShopData
        });
    }catch (error) {
        return res.status(500).json({ message: "Internal server error" });
    }
};
export { registerHardwareShop, updateHardwareShopProfile, login , getHardwareShopProfile}