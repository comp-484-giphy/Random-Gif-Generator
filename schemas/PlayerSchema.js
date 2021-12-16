var mongoose = require('mongoose')

var Schema = mongoose.Schema;

// this is the user schema
var player = new Schema({
    id: String,
    name: { type: String, required: true },
    password: { type: String, required: true },
    email: { type: String, required: true },
    // the player data is the gifs that are stored
    PlayerData: [{ type: Schema.Types.ObjectId}],
    role: {type: String, default: 'user'}
})


var playerModel = mongoose.model('GameMode', player);

module.exports = playerModel