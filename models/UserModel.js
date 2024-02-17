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
    profilePicture: {
        type: String,
        default: ""
    },
    clubName: {
        type: String,
        default: "",
    },
    teamName: {
        type: String,
        default: "",
    },
    role: {
        type: String,
        enum: ['player', 'trainer', "admin"],
        default: 'player' // Default role is user
    },
    clubRefs: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Club' 
    }],
    teamRefs: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Team' 
    }],
    planRefs: [{
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Plan'
    }],
    attendanceRefs: [{
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Attendance'
    }]
}, {timestamps: true})


module.exports = mongoose.model("User", userSchema);