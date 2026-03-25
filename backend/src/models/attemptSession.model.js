import mongoose from 'mongoose';

const attemptSessionSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    type: {
        type: String,
        enum: ['mock', 'practice'],
        required: true
    },
    subject: {
        type: String
    },
    questions: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Question'
    }],
    startTime: {
        type: Date,
        required: true
    },
    durationSeconds: {
        type: Number,
        required: true
    },
    endTime: {
        type: Date
    },
    score: {
        type: Number,
        default: 0
    }
}, { timestamps: true });

export const AttemptSession = mongoose.model('AttemptSession', attemptSessionSchema);
