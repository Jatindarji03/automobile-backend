import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    name:{
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    phone: {
        type: String,
    },
    role:{
        type: String,
        default: 'user',
        enum: ['user', 'service-provider']
    }

},{ timestamps: true });

const userModel = mongoose.model('User', userSchema);
export default userModel;
