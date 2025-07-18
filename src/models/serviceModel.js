import mongoose from "mongoose";
const serviceModel = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    baseprice: {
        type: Number,
        required: true,
    },
    servicecenterid: {
        type: Schema.Types.ObjectId,
        ref: "ServiceCenter",
        required: true,
    },
    approxtime: {
        type: String,
        required: true,
    },  
}
,{ timestamps: true });
const Service = mongoose.model("Service", serviceModel);
export default Service;