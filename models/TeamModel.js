const mongoose = require('mongoose');


const teamSchema = mongoose.Schema({
    teamName: {
        type: String,
        //required: true,
        trim: true
    },
    category : {
        type: String,
        //required: true,
        trim: true
    },
    trainerName: {
        type: String,
        //required: true,
        trim: true
    },
    clubRefs: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Club' 
    }],
    trainerRefs: [{
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User'
    }],
    playerRefs: [{
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User'
    }],
    planRefs: [{
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Plan'
    }],
    attendanceRefs: [{
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Attendance'
    }]

}, {timestamp: true})


module.exports = mongoose.model("Team", teamSchema);