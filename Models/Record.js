const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const recordSchema = new Schema({
    date : {
        type: String,
        required: true
    },
    day : {
        type: String,
        required: true
    },
    requestFor : {
        type: String,
        required: true
    },
    status : {
        type: String,
        required: true
    },
    createdBy : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'User'
    }
})

module.exports = mongoose.model('Record', recordSchema);
