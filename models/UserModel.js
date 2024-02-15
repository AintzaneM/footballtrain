const mongoose = require('mongoose');


const userSchema = mongoose.Schema({
    username: {
        type: String,
        //required: true,
        min: 3,
        max: 20,
        unique: true,
        trim: true
    },
    email: {
        type: String,
        //required: true,
        max: 50,
        unique: true,
        trim: true
    },
    password: {
        type: String,
        //required: true,
        min: 8
    },
    teamRefs: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Team' 
    }],
    profilePicture: {
        type: String,
        default: ""
    },
    isAdmin: {
        type: Boolean,
        default: false
    },
    isTrainer: {
        type: Boolean,
        default: false 
    },
    attendanceRefs: [{
        type: mongoose.Schema.Types.ObjectId, ref: 'Attendance'
    }],
    planRefs: [{
        type: mongoose.Schema.Types.ObjectId, ref: 'Plan'
    }]
}, {timestamps: true})


module.exports = mongoose.model("User", userSchema);