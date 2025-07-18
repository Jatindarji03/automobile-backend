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
        required: false
    },
    expertise: {
        type: [String],
        enum: ['car', 'bike', 'both'],
        required: true
    },
    isavailable: {
        type: Boolean,
        default: true
    },
    photoUri: {
        type: String,
    },

},{timestamps: true});

const Mechanical = mongoose.model('Mechanical', mechanicalSchema);
export default Mechanical;