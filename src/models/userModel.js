import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import mongooseAggregatePaginate from 'mongoose-aggregate-paginate-v2';
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

userSchema.methods.ispasswordCorrect = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword , this.password);   
}

userSchema.plugin(mongooseAggregatePaginate);

const User = mongoose.model('User', userSchema);
export default User;
