const mongoose = require('mongoose');


const exerciseSchema = mongoose.Schema({
    exerciseName: {
        type: String,
        required: true,
        trim: true
    },
    exerciseDescription: {
        type: String,
        required: true,
        trim: true
    },
    repetitions: {
        type: Number,
    },
    sets: {
        type: Number,
    },
    planRefs : [{
        type: mongoose.Schema.Types.ObjectId, ref: 'Plan'
    }]
}, {timestamp: true})


module.exports = mongoose.model("Exercise", exerciseSchema);