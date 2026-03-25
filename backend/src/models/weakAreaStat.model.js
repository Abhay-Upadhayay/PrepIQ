import mongoose from 'mongoose';

const weakAreaStatSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    subject: {
        type: String,
        required: true
    },
    topic: {
        type: String,
        required: true
    },
    totalAttempts: {
        type: Number,
        default: 0
    },
    correctCount: {
        type: Number,
        default: 0
    },
    accuracyPercent: {
        type: Number,
        default: 0
    },
    lastUpdated: {
        type: Date,
        default: Date.now
    }
}, { timestamps: true });

export const WeakAreaStat = mongoose.model('WeakAreaStat', weakAreaStatSchema);
