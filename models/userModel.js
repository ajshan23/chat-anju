// models/User.js
import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
    },
    password: {
        type: String,
        required: true,
    },
    avatar: {
        type: String,
        default: "https://www.aljazeera.com/wp-content/uploads/2015/05/d328c19841dc4961817f9f460478caa0_18.jpeg?resize=1200%2C675"
    }

}, { timestamps: true });

// Hash password before saving
UserSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

// Compare password
UserSchema.methods.matchPassword = async function (password) {
    return await bcrypt.compare(password, this.password);
};

// Generate JWT
UserSchema.methods.getSignedJwtToken = function () {
    return jwt.sign({ id: this._id }, "anjuchat", { expiresIn: '1d' });
};

const User = mongoose.model('User', UserSchema);

export default User;
