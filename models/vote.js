const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const VoteSchema = new Schema({
    tech: {
        type: String,
        required: true
    },
    points: {
        type: String,
        required: true
    }
})

const vote = mongoose.model('Vote',VoteSchema);
module.exports = vote;