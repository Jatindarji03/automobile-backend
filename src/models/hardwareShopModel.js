import mongoose from "mongoose";

const hardwareShopSchema = new mongoose.Schema({
    name:{ // Name of the hardware shop Owner
        type: String,
        required: true,
    },
    email:{ // Email of the hardware shop Owner
        type: String,
        required: true,
        unique: true,
    },
    password:{ // Password of the hardware shop Owner
        type: String,
        required: true,
    },
    location: { // Location of the hardware shop
        type: {
            type: String,
            enum: ["Point"],
            default: "Point",
        },
        coordinates: {
            type: [Number], // [longitude, latitude]
            required: true,
        },
    },
    phoneNumber: { // Phone number of the hardware shop Owner
        type: String,
        required: true,
    },
    shopName: { // Name of the hardware shop
        type: String,
        required: true,
    },
    role:{
        type: String,
        enum: ["hardwareShop", "user"],
        default: "hardwareShop",
    }
},{timestamps: true});

const HardwareShop = mongoose.model("HardwareShop", hardwareShopSchema);
export default HardwareShop;

