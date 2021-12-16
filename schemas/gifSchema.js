var mongoose = require('mongoose')

var Schema = mongoose.Schema;

// A schema is how its stored on the backend
var gameSchema = new Schema({
    gif: String,
    id: String,
})

var playerModel = mongoose.model('playerModel', gameSchema);

module.exports = playerModel