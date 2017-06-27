let mongoose = require('mongoose');
let Schema = mongoose.Schema;

let savedGameSchema = new Schema({
    _id: String,
    maze: String
});
module.exports = mongoose.model('SavedGame', savedGameSchema);