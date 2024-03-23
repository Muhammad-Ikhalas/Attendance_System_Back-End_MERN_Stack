const mongoose = require('mongoose');


const studentSchema = mongoose.Schema({
    name : {
        type: String,
        required: true
    },
    email : {
        type: String,
        required: true
    },
    password : {
        type: String,
        required: true
    },
    isAdmin : {
        type: Boolean,
        required: true
    },
    requests : [{
        type : mongoose.Schema.Types.ObjectId,
        ref : 'Record'
    }]
})

module.exports = mongoose.model('User', studentSchema);
