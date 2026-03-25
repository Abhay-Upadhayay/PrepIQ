import mongoose from 'mongoose';

const questionSchema = new mongoose.Schema({
    exam: {
        type: String,
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
    difficulty: {
        type: String,
        enum: ['easy', 'medium', 'hard'],
        required: true
    },
    questionText: {
        type: String,
        required: true
    },
    options: {
        type: [String],
        validate: [v => v.length === 4, 'Must have exactly 4 options']
    },
    correctOption: {
        type: String,
        required: true
    },
    explanation: {
        type: String,
        required: true
    }
}, { timestamps: true });

export const Question = mongoose.model('Question', questionSchema);
