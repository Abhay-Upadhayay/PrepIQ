import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        lowercase: true,
        unique: true,
        trim: true
    },
    password: {
        type: String,
        required: true,
        minLength: 8
    },
    targetExam: {
        type: String,
        required: true,
    },
    selectedSubjects: [{
        type: String
    }]
}, { timestamps: true });

export const User = mongoose.model('User', userSchema);