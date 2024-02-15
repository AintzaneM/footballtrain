const mongoose = require('mongoose');

const attendanceSchema = new mongoose.Schema({
    userRefs: [{
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User',
        required: true
    }], 
    planRefs: [{
       type: mongoose.Schema.Types.ObjectId,
       ref: 'Plan',
        //required: true
    }],
    date: {
        type: Date,
        default: Date.now,
        //required: true
    },
    marked: {
        type: Boolean,
        default: false
    } // Whether the attendance is marked or not
});

module.exports = mongoose.model('Attendance', attendanceSchema);