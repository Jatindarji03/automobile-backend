import mongoose from "mongoose";

const vehicleSchema = new mongoose.Schema({
    userId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    vechicleType:{
        type: String,
        required: true
    },
    model:{
        type: String,
        required: true
    },
    registrationNumber:{
        type: String,
        required: true,
        unique: true
    },
    fuelType:{
        type: String,
        required: true,
        enum: ['Petrol', 'Diesel', 'Electric', 'Hybrid']
    },
    yearOfManufacture:{
        type: Number,
        required: true
    }
},{timestamps: true});

const vehicleModel = mongoose.model('Vehicle', vehicleSchema);
export default vehicleModel;
