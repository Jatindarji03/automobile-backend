import mongoose from "mongoose";

const serviceCenterSchema = new mongoose.Schema({
    name:{
        type: String,
        required: true
    },
    location: {
        type:[Number],
        required: true,

    },
    ownerName:{
        type: String,
        required: true
    },
    email:{
        type: String,
        required: true,
        unique: true
    },
    role:{
        type: String,
        default: 'service-provider',
        enum: ['user', 'service-provider']
    },
    password:{
        type: String,
        required: true
    },
    photoUri:{
        type:String,
    },
    availableServices:{
        type:[String]
    },
    rating:{
        type: Number
    }

},{timestamps: true});


const ServiceCenter = mongoose.model('ServiceCenter', serviceCenterSchema);
export default ServiceCenter;
