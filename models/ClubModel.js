const mongoose = require('mongoose');


const clubSchema = mongoose.Schema({
    clubName: {
        type: String,
        //required: true,
        trim: true
    },
    trainerRefs: [{ 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User' }],
    playerRefs: [{ 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User' }],
    teamRefs: [{ 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Team' }],
    clubRefs: [{ 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Club' }],
}, { timestamp: true })


module.exports = mongoose.model("Club", clubSchema);