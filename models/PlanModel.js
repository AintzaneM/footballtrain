const mongoose = require('mongoose');


const planSchema = mongoose.Schema({
    category: {
        type: String,
        required: true,
        trim: true
    },
    planTitle: {
        type: String,
        required: true,
        trim: true
    },
    planDescription: { 
        type: String,
        required: true,
        trim: true
    },
    dateStart: {
        type: String, // ISO date format (e.g., "2023-07-26T14:30:00Z")
    },
    dateEnd: {
        type: String, // ISO date format (e.g., "2023-07-26T14:30:00Z")
    },
    progress: {
        type: Number,// Track the user's progress (e.g., percentage completed)
    },
    excerciseRefs: [{
        type: mongoose.Schema.Types.ObjectId, ref: 'Excercise'
    }],
    userRefs: [{
        type: mongoose.Schema.Types.ObjectId, ref: 'User'
    }],
    attendanceRefs: {
        type: mongoose.Schema.Types.ObjectId, ref: 'Attendance'
    }
}, {timestamps: true})


module.exports = mongoose.model("Plan", planSchema);