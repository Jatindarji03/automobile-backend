import mongoose from "mongoose";

const mechanicalSchema = new mongoose.Schema({
    name:{
        type: String,
        required: true
    },
    email: {
        type:String,
        required: true,
        unique: true
    },
    phone: {
        type: String,
        required: true
    },
    serviceCenterId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'ServiceCenter',
        required: true
    },
    expertise: {
        type: [String],
        required: true
    },
    photoUri: {
        type: String,
    },

},{timestamps: true});

const mechanicalModel = mongoose.model('Mechanical', mechanicalSchema);
export default mechanicalModel;