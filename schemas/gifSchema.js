var mongoose = require('mongoose')

var Schema = mongoose.Schema;

var gameSchema = new Schema({
    gif: String,
    id: String,
})

var playerModel = mongoose.model('playerModel', gameSchema);

module.exports = playerModel